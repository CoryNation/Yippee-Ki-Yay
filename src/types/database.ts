export interface Profile {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  bio: string | null
  brainpower_rating: number
  total_tasks_completed: number
  total_earnings: number
  wallet_address: string | null
  created_at: string
  updated_at: string
}

export interface Task {
  id: string
  requester_id: string
  title: string
  description: string
  category: string
  complexity_level: 'simple' | 'moderate' | 'complex' | 'expert'
  estimated_hours: number | null
  budget_min: number | null
  budget_max: number | null
  status: 'open' | 'in_progress' | 'completed' | 'cancelled'
  deadline: string | null
  created_at: string
  updated_at: string
}

export interface Bid {
  id: string
  task_id: string
  solver_id: string
  bid_amount: number
  proposed_solution: string | null
  estimated_completion_time: number | null
  status: 'pending' | 'accepted' | 'rejected' | 'completed'
  created_at: string
  updated_at: string
}

export interface TaskAssignment {
  id: string
  task_id: string
  solver_id: string
  bid_id: string
  assigned_at: string
  completed_at: string | null
  final_amount: number | null
}

export interface Transaction {
  id: string
  task_id: string
  from_user_id: string
  to_user_id: string
  amount: number
  transaction_hash: string | null
  status: 'pending' | 'completed' | 'failed'
  created_at: string
}

// Supabase database schema type
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile
        Insert: Omit<Profile, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Profile, 'id' | 'created_at' | 'updated_at'>>
      }
      tasks: {
        Row: Task
        Insert: Omit<Task, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Task, 'id' | 'created_at' | 'updated_at'>>
      }
      bids: {
        Row: Bid
        Insert: Omit<Bid, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Bid, 'id' | 'created_at' | 'updated_at'>>
      }
      task_assignments: {
        Row: TaskAssignment
        Insert: Omit<TaskAssignment, 'id' | 'assigned_at'>
        Update: Partial<Omit<TaskAssignment, 'id' | 'assigned_at'>>
      }
      transactions: {
        Row: Transaction
        Insert: Omit<Transaction, 'id' | 'created_at'>
        Update: Partial<Omit<Transaction, 'id' | 'created_at'>>
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
