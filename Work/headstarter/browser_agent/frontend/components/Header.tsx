'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Zap, 
  Wifi, 
  WifiOff, 
  Settings, 
  Download,
  RefreshCw,
  Plus,
  Trash2
} from 'lucide-react'
import toast from 'react-hot-toast'

interface HeaderProps {
  isConnected: boolean
  sessionId: string | null
  onSessionChange: (sessionId: string | null) => void
}

export default function Header({ isConnected, sessionId, onSessionChange }: HeaderProps) {
  const [isCreatingSession, setIsCreatingSession] = useState(false)

  const createNewSession = async () => {
    setIsCreatingSession(true)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/sessions`, {
        method: 'POST',
      })
      const data = await response.json()
      onSessionChange(data.session_id)
      toast.success('New session created')
    } catch (error) {
      toast.error('Failed to create new session')
    } finally {
      setIsCreatingSession(false)
    }
  }

  const exportSession = async () => {
    if (!sessionId) return
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/sessions/${sessionId}/export`)
      const data = await response.json()
      
      // Create download link
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `session-${sessionId}-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      
      toast.success('Session exported successfully')
    } catch (error) {
      toast.error('Failed to export session')
    }
  }

  return (
    <header className="bg-tech-gray border-b border-tech-accent/30 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Logo and Title */}
        <div className="flex items-center space-x-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-8 h-8"
          >
            <Zap className="w-8 h-8 text-tech-accent" />
          </motion.div>
          <div>
            <h1 className="text-xl font-bold text-white">Voice Browser Agent</h1>
            <p className="text-sm text-tech-accent/70 font-mono">Advanced Automation Platform</p>
          </div>
        </div>

        {/* Connection Status */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            {isConnected ? (
              <Wifi className="w-5 h-5 text-tech-accent" />
            ) : (
              <WifiOff className="w-5 h-5 text-tech-red" />
            )}
            <span className={`text-sm font-mono ${isConnected ? 'text-tech-accent' : 'text-tech-red'}`}>
              {isConnected ? 'CONNECTED' : 'DISCONNECTED'}
            </span>
          </div>

          {/* Session Info */}
          {sessionId && (
            <div className="flex items-center space-x-2 bg-tech-dark/50 px-3 py-1 rounded-lg border border-tech-accent/20">
              <span className="text-xs text-tech-accent/70 font-mono">Session:</span>
              <span className="text-xs text-white font-mono">{sessionId.slice(0, 8)}...</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={createNewSession}
              disabled={isCreatingSession}
              className="flex items-center space-x-1 px-3 py-1 bg-tech-accent/20 hover:bg-tech-accent/30 text-tech-accent rounded-lg transition-colors disabled:opacity-50"
            >
              {isCreatingSession ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Plus className="w-4 h-4" />
              )}
              <span className="text-sm font-mono">New</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={exportSession}
              disabled={!sessionId}
              className="flex items-center space-x-1 px-3 py-1 bg-tech-blue/20 hover:bg-tech-blue/30 text-tech-blue rounded-lg transition-colors disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span className="text-sm font-mono">Export</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-1 px-3 py-1 bg-tech-purple/20 hover:bg-tech-purple/30 text-tech-purple rounded-lg transition-colors"
            >
              <Settings className="w-4 h-4" />
              <span className="text-sm font-mono">Settings</span>
            </motion.button>
          </div>
        </div>
      </div>
    </header>
  )
}
