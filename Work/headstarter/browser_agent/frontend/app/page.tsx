'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Mic, 
  MicOff, 
  Monitor, 
  Activity, 
  Settings, 
  Download,
  Play,
  Pause,
  Square,
  Camera,
  Zap,
  Brain,
  Eye,
  Terminal
} from 'lucide-react'
import VoiceAgent from '@/components/VoiceAgent'
import MonitoringDashboard from '@/components/MonitoringDashboard'
import SessionManager from '@/components/SessionManager'
import ExecutionPanel from '@/components/ExecutionPanel'
import LogsPanel from '@/components/LogsPanel'
import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'

export default function Home() {
  const [activeTab, setActiveTab] = useState('voice')
  const [isConnected, setIsConnected] = useState(false)
  const [sessionId, setSessionId] = useState<string | null>(null)

  useEffect(() => {
    // Initialize connection and create session
    const initializeSession = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/sessions`, {
          method: 'POST',
        })
        const data = await response.json()
        setSessionId(data.session_id)
        setIsConnected(true)
      } catch (error) {
        console.error('Failed to initialize session:', error)
      }
    }

    initializeSession()
  }, [])

  const tabs = [
    { id: 'voice', label: 'Voice Control', icon: Mic },
    { id: 'monitor', label: 'Browser Monitor', icon: Monitor },
    { id: 'execution', label: 'Execution Panel', icon: Terminal },
    { id: 'logs', label: 'Activity Logs', icon: Activity },
    { id: 'session', label: 'Session Manager', icon: Settings },
  ]

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'voice':
        return <VoiceAgent sessionId={sessionId} />
      case 'monitor':
        return <MonitoringDashboard sessionId={sessionId} />
      case 'execution':
        return <ExecutionPanel sessionId={sessionId} />
      case 'logs':
        return <LogsPanel sessionId={sessionId} />
      case 'session':
        return <SessionManager sessionId={sessionId} />
      default:
        return <VoiceAgent sessionId={sessionId} />
    }
  }

  return (
    <div className="min-h-screen bg-tech-dark text-white">
      {/* Header */}
      <Header 
        isConnected={isConnected} 
        sessionId={sessionId}
        onSessionChange={setSessionId}
      />

      {/* Main Content */}
      <div className="flex h-[calc(100vh-80px)]">
        {/* Sidebar */}
        <Sidebar 
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {/* Main Panel */}
        <main className="flex-1 p-6">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            {renderActiveTab()}
          </motion.div>
        </main>
      </div>

      {/* Status Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-tech-gray border-t border-tech-accent/30 px-6 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-tech-accent animate-pulse' : 'bg-tech-red'}`} />
              <span className="text-sm font-mono">
                {isConnected ? 'CONNECTED' : 'DISCONNECTED'}
              </span>
            </div>
            {sessionId && (
              <span className="text-xs text-tech-accent/70 font-mono">
                Session: {sessionId.slice(0, 8)}...
              </span>
            )}
          </div>
          
          <div className="flex items-center space-x-4 text-xs font-mono">
            <div className="flex items-center space-x-1">
              <Brain className="w-3 h-3 text-tech-blue" />
              <span>AI Ready</span>
            </div>
            <div className="flex items-center space-x-1">
              <Eye className="w-3 h-3 text-tech-purple" />
              <span>Browser Active</span>
            </div>
            <div className="flex items-center space-x-1">
              <Zap className="w-3 h-3 text-tech-yellow" />
              <span>Auto Mode</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
