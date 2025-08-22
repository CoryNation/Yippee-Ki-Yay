-- Example (trim to your needs)
create table if not exists goals (
  id uuid primary key default gen_random_uuid(),
  owner uuid references auth.users(id) on delete cascade,
  title text not null,
  description text,
  created_at timestamptz default now()
);

-- ... decisions, outcomes, and RLS policies ...
