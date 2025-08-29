'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { Task, Profile } from '@/types/database'
import CreateTask from '@/components/CreateTask'
import Auth from '@/components/Auth'

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [showCreateTask, setShowCreateTask] = useState(false)
  const [showAuth, setShowAuth] = useState(false)

  useEffect(() => {
    fetchTasks()
    checkUser()
    
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    setUser(user)
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
  }

  const fetchTasks = async () => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('status', 'open')
        .order('created_at', { ascending: false })
        .limit(10)

      if (error) throw error
      setTasks(data || [])
    } catch (error) {
      console.error('Error fetching tasks:', error)
    } finally {
      setLoading(false)
    }
  }

  const getComplexityColor = (level: string) => {
    switch (level) {
      case 'simple': return 'text-green-400'
      case 'moderate': return 'text-yellow-400'
      case 'complex': return 'text-orange-400'
      case 'expert': return 'text-red-400'
      default: return 'text-gray-400'
    }
  }

  const handleTaskCreated = () => {
    fetchTasks()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      {/* Header */}
      <header className="border-b border-purple-500/20 bg-black/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-yellow-400 rounded-lg flex items-center justify-center">
                <span className="text-black font-bold text-xl">🧠</span>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-yellow-400 bg-clip-text text-transparent">
                BrainPower Exchange
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-3">
                  <span className="text-gray-300">{user.email}</span>
                  <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors">
                    Dashboard
                  </button>
                  <button 
                    onClick={handleSignOut}
                    className="px-4 py-2 border border-gray-600 text-gray-300 rounded-lg hover:border-gray-500 hover:text-white transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => setShowAuth(true)}
                  className="px-6 py-2 bg-gradient-to-r from-purple-600 to-yellow-500 hover:from-purple-700 hover:to-yellow-600 text-white rounded-lg transition-all transform hover:scale-105"
                >
                  Connect Brain
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-yellow-400 to-purple-400 bg-clip-text text-transparent">
            Lend Your Brain Power
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            The world's first reverse marketplace where problem solvers bid on tasks. 
            Convert your unused brainpower into crypto rewards.
          </p>
          <div className="flex justify-center space-x-4">
            <button 
              onClick={() => user ? setShowCreateTask(true) : setShowAuth(true)}
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-lg transition-all transform hover:scale-105"
            >
              Post a Task
            </button>
            <button className="px-8 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black rounded-lg transition-all transform hover:scale-105">
              Browse Tasks
            </button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-black/20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-400 mb-2">1,247</div>
              <div className="text-gray-400">Active Tasks</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-yellow-400 mb-2">$89.2K</div>
              <div className="text-gray-400">Total Rewards</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-400 mb-2">5,891</div>
              <div className="text-gray-400">Brain Connections</div>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Tasks */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h3 className="text-3xl font-bold text-white mb-8">Recent Tasks</h3>
          {loading ? (
            <div className="text-center text-gray-400">Loading tasks...</div>
          ) : tasks.length === 0 ? (
            <div className="text-center text-gray-400 py-12">
              <div className="text-6xl mb-4">🧠</div>
              <p className="text-xl mb-4">No tasks available yet</p>
              <p className="text-gray-500">Be the first to post a task and start the brainpower exchange!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tasks.map((task) => (
                <div key={task.id} className="bg-gray-800/50 border border-purple-500/20 rounded-lg p-6 hover:border-purple-500/40 transition-all">
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="text-lg font-semibold text-white">{task.title}</h4>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getComplexityColor(task.complexity_level)}`}>
                      {task.complexity_level}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-3">{task.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-purple-400 font-medium">
                      ${task.budget_min} - ${task.budget_max}
                    </span>
                    <button className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black rounded-lg text-sm font-medium hover:from-yellow-600 hover:to-yellow-700 transition-all">
                      Bid Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-purple-500/20 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-400">
          <p>© 2024 BrainPower Exchange. Connecting minds, one task at a time.</p>
        </div>
      </footer>

      {/* Create Task Modal */}
      {showCreateTask && (
        <CreateTask
          onTaskCreated={handleTaskCreated}
          onClose={() => setShowCreateTask(false)}
        />
      )}

      {/* Auth Modal */}
      {showAuth && (
        <Auth onClose={() => setShowAuth(false)} />
      )}
    </div>
  )
}
