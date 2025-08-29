'use client'

import { supabase } from '@/lib/supabase'
import { useEffect, useState } from 'react'

export default function TestPage() {
  const [status, setStatus] = useState('Testing connection...')

  useEffect(() => {
    async function testConnection() {
      try {
        const { data, error } = await supabase.from('profiles').select('count')
        if (error) throw error
        setStatus('✅ Connected to Supabase successfully!')
      } catch (error) {
        setStatus(`❌ Connection error: ${error}`)
      }
    }
    testConnection()
  }, [])

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Supabase Connection Test</h1>
      <p className="text-lg">{status}</p>
    </div>
  )
}
