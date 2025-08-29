-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- Create profiles table for user information
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  full_name text,
  avatar_url text,
  bio text,
  brainpower_rating decimal(3,2) default 0.00,
  total_tasks_completed integer default 0,
  total_earnings decimal(10,2) default 0.00,
  wallet_address text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Create tasks table
create table if not exists tasks (
  id uuid primary key default gen_random_uuid(),
  requester_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  description text not null,
  category text not null,
  complexity_level text check (complexity_level in ('simple', 'moderate', 'complex', 'expert')),
  estimated_hours integer,
  budget_min decimal(10,2),
  budget_max decimal(10,2),
  status text default 'open' check (status in ('open', 'in_progress', 'completed', 'cancelled')),
  deadline timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Create bids table
create table if not exists bids (
  id uuid primary key default gen_random_uuid(),
  task_id uuid references tasks(id) on delete cascade not null,
  solver_id uuid references auth.users(id) on delete cascade not null,
  bid_amount decimal(10,2) not null,
  proposed_solution text,
  estimated_completion_time integer, -- in hours
  status text default 'pending' check (status in ('pending', 'accepted', 'rejected', 'completed')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Create task_assignments table
create table if not exists task_assignments (
  id uuid primary key default gen_random_uuid(),
  task_id uuid references tasks(id) on delete cascade not null,
  solver_id uuid references auth.users(id) on delete cascade not null,
  bid_id uuid references bids(id) on delete cascade not null,
  assigned_at timestamptz default now(),
  completed_at timestamptz,
  final_amount decimal(10,2)
);

-- Create transactions table for crypto payments
create table if not exists transactions (
  id uuid primary key default gen_random_uuid(),
  task_id uuid references tasks(id) on delete cascade not null,
  from_user_id uuid references auth.users(id) not null,
  to_user_id uuid references auth.users(id) not null,
  amount decimal(10,2) not null,
  transaction_hash text,
  status text default 'pending' check (status in ('pending', 'completed', 'failed')),
  created_at timestamptz default now()
);

-- Drop existing policies if they exist (now that tables are created)
drop policy if exists "Users can view all profiles" on profiles;
drop policy if exists "Users can update own profile" on profiles;
drop policy if exists "Users can insert own profile" on profiles;

drop policy if exists "Users can view all tasks" on tasks;
drop policy if exists "Users can create tasks" on tasks;
drop policy if exists "Users can update own tasks" on tasks;

drop policy if exists "Users can view all bids" on bids;
drop policy if exists "Users can create bids" on bids;
drop policy if exists "Users can update own bids" on bids;

drop policy if exists "Users can view task assignments" on task_assignments;
drop policy if exists "Users can update assigned tasks" on task_assignments;

drop policy if exists "Users can view own transactions" on transactions;
drop policy if exists "Users can create transactions" on transactions;

-- Drop existing triggers if they exist
drop trigger if exists on_auth_user_created on auth.users;
drop trigger if exists on_bid_status_changed on bids;

-- Drop existing functions if they exist
drop function if exists public.handle_new_user();
drop function if exists public.handle_bid_accepted();

-- Enable Row Level Security
alter table profiles enable row level security;
alter table tasks enable row level security;
alter table bids enable row level security;
alter table task_assignments enable row level security;
alter table transactions enable row level security;

-- Profiles policies
create policy "Users can view all profiles" on profiles for select using (true);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);
create policy "Users can insert own profile" on profiles for insert with check (auth.uid() = id);

-- Tasks policies
create policy "Users can view all tasks" on tasks for select using (true);
create policy "Users can create tasks" on tasks for insert with check (auth.uid() = requester_id);
create policy "Users can update own tasks" on tasks for update using (auth.uid() = requester_id);

-- Bids policies
create policy "Users can view all bids" on bids for select using (true);
create policy "Users can create bids" on bids for insert with check (auth.uid() = solver_id);
create policy "Users can update own bids" on bids for update using (auth.uid() = solver_id);

-- Task assignments policies
create policy "Users can view task assignments" on task_assignments for select using (true);
create policy "Users can update assigned tasks" on task_assignments for update using (auth.uid() = solver_id);

-- Transactions policies
create policy "Users can view own transactions" on transactions for select using (auth.uid() = from_user_id or auth.uid() = to_user_id);
create policy "Users can create transactions" on transactions for insert with check (auth.uid() = from_user_id);

-- Function to handle new user creation
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger for new users
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Function to update task status when bid is accepted
create or replace function public.handle_bid_accepted()
returns trigger as $$
begin
  if new.status = 'accepted' and old.status = 'pending' then
    -- Update task status to in_progress
    update tasks set status = 'in_progress' where id = new.task_id;
    
    -- Create task assignment
    insert into task_assignments (task_id, solver_id, bid_id)
    values (new.task_id, new.solver_id, new.id);
  end if;
  return new;
end;
$$ language plpgsql security definer;

-- Trigger for bid status changes
create trigger on_bid_status_changed
  after update on bids
  for each row execute procedure public.handle_bid_accepted();
