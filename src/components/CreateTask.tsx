'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { Task } from '@/types/database'

interface CreateTaskProps {
  onTaskCreated: () => void
  onClose: () => void
}

export default function CreateTask({ onTaskCreated, onClose }: CreateTaskProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    complexity_level: 'simple' as Task['complexity_level'],
    estimated_hours: '',
    budget_min: '',
    budget_max: '',
    deadline: ''
  })
  const [loading, setLoading] = useState(false)

  const categories = [
    'Programming', 'Design', 'Writing', 'Research', 'Analysis', 
    'Automation', 'Consulting', 'Creative', 'Technical', 'Other'
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      const { error } = await supabase.from('tasks').insert({
        requester_id: user.id,
        title: formData.title,
        description: formData.description,
        category: formData.category,
        complexity_level: formData.complexity_level,
        estimated_hours: formData.estimated_hours ? parseInt(formData.estimated_hours) : null,
        budget_min: formData.budget_min ? parseFloat(formData.budget_min) : null,
        budget_max: formData.budget_max ? parseFloat(formData.budget_max) : null,
        deadline: formData.deadline || null
      })

      if (error) throw error

      onTaskCreated()
      onClose()
    } catch (error) {
      console.error('Error creating task:', error)
      alert('Failed to create task. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-900 border border-purple-500/20 rounded-lg p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Post a New Task</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Task Title
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-3 bg-gray-800 border border-purple-500/20 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none transition-colors"
              placeholder="What do you need help with?"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description
            </label>
            <textarea
              required
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 bg-gray-800 border border-purple-500/20 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none transition-colors resize-none"
              placeholder="Describe your task in detail..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Category
              </label>
              <select
                required
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-3 bg-gray-800 border border-purple-500/20 rounded-lg text-white focus:border-purple-500 focus:outline-none transition-colors"
              >
                <option value="">Select category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Complexity Level
              </label>
              <select
                required
                value={formData.complexity_level}
                onChange={(e) => setFormData({ ...formData, complexity_level: e.target.value as Task['complexity_level'] })}
                className="w-full px-4 py-3 bg-gray-800 border border-purple-500/20 rounded-lg text-white focus:border-purple-500 focus:outline-none transition-colors"
              >
                <option value="simple">Simple</option>
                <option value="moderate">Moderate</option>
                <option value="complex">Complex</option>
                <option value="expert">Expert</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Estimated Hours
              </label>
              <input
                type="number"
                min="1"
                value={formData.estimated_hours}
                onChange={(e) => setFormData({ ...formData, estimated_hours: e.target.value })}
                className="w-full px-4 py-3 bg-gray-800 border border-purple-500/20 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none transition-colors"
                placeholder="Hours"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Min Budget ($)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.budget_min}
                onChange={(e) => setFormData({ ...formData, budget_min: e.target.value })}
                className="w-full px-4 py-3 bg-gray-800 border border-purple-500/20 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none transition-colors"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Max Budget ($)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.budget_max}
                onChange={(e) => setFormData({ ...formData, budget_max: e.target.value })}
                className="w-full px-4 py-3 bg-gray-800 border border-purple-500/20 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none transition-colors"
                placeholder="0.00"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Deadline (Optional)
            </label>
            <input
              type="datetime-local"
              value={formData.deadline}
              onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
              className="w-full px-4 py-3 bg-gray-800 border border-purple-500/20 rounded-lg text-white focus:border-purple-500 focus:outline-none transition-colors"
            />
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-600 text-gray-300 rounded-lg hover:border-gray-500 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : 'Post Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
