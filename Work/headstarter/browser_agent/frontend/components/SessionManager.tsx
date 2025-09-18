'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Settings, 
  Download, 
  Trash2, 
  Eye, 
  Clock,
  Activity,
  CheckCircle,
  XCircle,
  RefreshCw,
  Plus,
  Copy,
  ExternalLink
} from 'lucide-react'
import toast from 'react-hot-toast'

interface SessionManagerProps {
  sessionId: string | null
}

interface SessionInfo {
  session_id: string
  created_at: string
  last_activity: string
  status: string
  total_actions: number
  successful_actions: number
  success_rate: number
  screenshots_count: number
  logs_count: number
  current_url: string
  browser_session_id: string
}

interface SessionExport {
  session_id: string
  export_timestamp: string
  session_data: any
  actions_summary: Record<string, number>
  screenshots: string[]
  logs: any[]
  metadata: Record<string, any>
}

export default function SessionManager({ sessionId }: SessionManagerProps) {
  const [sessions, setSessions] = useState<SessionInfo[]>([])
  const [selectedSession, setSelectedSession] = useState<SessionInfo | null>(null)
  const [sessionExport, setSessionExport] = useState<SessionExport | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isCreatingSession, setIsCreatingSession] = useState(false)
  const [isExporting, setIsExporting] = useState(false)

  useEffect(() => {
    fetchSessions()
    
    const interval = setInterval(() => {
      fetchSessions()
    }, 10000) // Update every 10 seconds

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (selectedSession) {
      fetchSessionExport(selectedSession.session_id)
    }
  }, [selectedSession])

  const fetchSessions = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/sessions`)
      const data = await response.json()
      setSessions(data)
      
      // Auto-select current session if available
      if (sessionId && !selectedSession) {
        const currentSession = data.find((s: SessionInfo) => s.session_id === sessionId)
        if (currentSession) {
          setSelectedSession(currentSession)
        }
      }
    } catch (error) {
      console.error('Failed to fetch sessions:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchSessionExport = async (sessionId: string) => {
    try {
      setIsExporting(true)
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/sessions/${sessionId}/export`)
      const data = await response.json()
      setSessionExport(data)
    } catch (error) {
      console.error('Failed to fetch session export:', error)
      toast.error('Failed to load session data')
    } finally {
      setIsExporting(false)
    }
  }

  const createNewSession = async () => {
    try {
      setIsCreatingSession(true)
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/sessions`, {
        method: 'POST',
      })
      const data = await response.json()
      
      // Refresh sessions list
      await fetchSessions()
      
      // Select the new session
      const newSession = sessions.find(s => s.session_id === data.session_id)
      if (newSession) {
        setSelectedSession(newSession)
      }
      
      toast.success('New session created')
    } catch (error) {
      console.error('Failed to create session:', error)
      toast.error('Failed to create new session')
    } finally {
      setIsCreatingSession(false)
    }
  }

  const deleteSession = async (sessionId: string) => {
    if (!confirm('Are you sure you want to delete this session? This action cannot be undone.')) {
      return
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/sessions/${sessionId}`, {
        method: 'DELETE',
      })
      
      if (response.ok) {
        setSessions(sessions.filter(s => s.session_id !== sessionId))
        if (selectedSession?.session_id === sessionId) {
          setSelectedSession(null)
          setSessionExport(null)
        }
        toast.success('Session deleted')
      } else {
        throw new Error('Failed to delete session')
      }
    } catch (error) {
      console.error('Failed to delete session:', error)
      toast.error('Failed to delete session')
    }
  }

  const exportSession = async (sessionId: string) => {
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
      console.error('Failed to export session:', error)
      toast.error('Failed to export session')
    }
  }

  const copySessionId = (sessionId: string) => {
    navigator.clipboard.writeText(sessionId)
    toast.success('Session ID copied to clipboard')
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    return {
      time: date.toLocaleTimeString(),
      date: date.toLocaleDateString(),
      relative: getRelativeTime(date)
    }
  }

  const getRelativeTime = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (days > 0) return `${days}d ago`
    if (hours > 0) return `${hours}h ago`
    if (minutes > 0) return `${minutes}m ago`
    return 'Just now'
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-tech-accent'
      case 'completed':
        return 'text-tech-blue'
      case 'error':
        return 'text-tech-red'
      default:
        return 'text-gray-400'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4 text-tech-accent" />
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-tech-blue" />
      case 'error':
        return <XCircle className="w-4 h-4 text-tech-red" />
      default:
        return <Clock className="w-4 h-4 text-gray-400" />
    }
  }

  return (
    <div className="h-full flex space-x-6">
      {/* Sessions List */}
      <div className="w-1/3">
        <div className="panel">
          <div className="panel-header">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Sessions</h2>
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
            </div>
          </div>

          <div className="p-4 flex-1 overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center h-32">
                <div className="spinner w-8 h-8" />
              </div>
            ) : sessions.length === 0 ? (
              <div className="flex items-center justify-center h-32 text-gray-400">
                <div className="text-center">
                  <Settings className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No sessions found</p>
                  <p className="text-sm">Create a new session to get started</p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {sessions.map((session) => {
                  const timestamp = formatTimestamp(session.last_activity)
                  const isSelected = selectedSession?.session_id === session.session_id
                  
                  return (
                    <motion.div
                      key={session.session_id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedSession(session)}
                      className={`p-4 rounded-lg border cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-tech-accent/20 border-tech-accent/50 glow-green'
                          : 'bg-tech-dark/30 border-tech-accent/20 hover:border-tech-accent/40'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(session.status)}
                          <span className={`text-sm font-mono ${getStatusColor(session.status)}`}>
                            {session.status.toUpperCase()}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500 font-mono">
                          {timestamp.relative}
                        </div>
                      </div>

                      <div className="mb-2">
                        <p className="text-sm font-medium text-white">
                          {session.session_id.slice(0, 8)}...
                        </p>
                        <p className="text-xs text-gray-400">
                          {timestamp.date} {timestamp.time}
                        </p>
                      </div>

                      <div className="flex items-center justify-between text-xs text-gray-400">
                        <div className="flex items-center space-x-3">
                          <span>{session.total_actions} actions</span>
                          <span>{session.success_rate}% success</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              copySessionId(session.session_id)
                            }}
                            className="hover:text-tech-accent transition-colors"
                          >
                            <Copy className="w-3 h-3" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              deleteSession(session.session_id)
                            }}
                            className="hover:text-tech-red transition-colors"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Session Details */}
      <div className="flex-1">
        {selectedSession ? (
          <div className="space-y-6">
            {/* Session Overview */}
            <div className="panel">
              <div className="panel-header">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white">Session Details</h3>
                  <div className="flex items-center space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => exportSession(selectedSession.session_id)}
                      className="flex items-center space-x-1 px-3 py-1 bg-tech-blue/20 hover:bg-tech-blue/30 text-tech-blue rounded-lg transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      <span className="text-sm font-mono">Export</span>
                    </motion.button>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-300 mb-3">Session Info</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Session ID:</span>
                        <span className="text-white font-mono text-sm">
                          {selectedSession.session_id.slice(0, 16)}...
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Status:</span>
                        <span className={`font-mono text-sm ${getStatusColor(selectedSession.status)}`}>
                          {selectedSession.status.toUpperCase()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Created:</span>
                        <span className="text-white text-sm">
                          {formatTimestamp(selectedSession.created_at).date}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Last Activity:</span>
                        <span className="text-white text-sm">
                          {formatTimestamp(selectedSession.last_activity).relative}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-gray-300 mb-3">Statistics</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Total Actions:</span>
                        <span className="text-white font-mono">{selectedSession.total_actions}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Successful:</span>
                        <span className="text-tech-accent font-mono">{selectedSession.successful_actions}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Success Rate:</span>
                        <span className="text-tech-accent font-mono">{selectedSession.success_rate}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Screenshots:</span>
                        <span className="text-white font-mono">{selectedSession.screenshots_count}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {selectedSession.current_url && (
                  <div className="mt-6">
                    <h4 className="text-sm font-semibold text-gray-300 mb-2">Current URL</h4>
                    <div className="flex items-center space-x-2 p-2 bg-tech-dark/50 rounded border border-tech-accent/20">
                      <ExternalLink className="w-4 h-4 text-tech-accent" />
                      <span className="text-sm text-white font-mono truncate">
                        {selectedSession.current_url}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Session Export Data */}
            {sessionExport && (
              <div className="panel">
                <div className="panel-header">
                  <h3 className="text-lg font-semibold text-white">Session Data</h3>
                </div>

                <div className="p-6">
                  {isExporting ? (
                    <div className="flex items-center justify-center h-32">
                      <div className="spinner w-8 h-8" />
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Actions Summary */}
                      <div>
                        <h4 className="text-sm font-semibold text-gray-300 mb-3">Actions Summary</h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {Object.entries(sessionExport.actions_summary).map(([action, count]) => (
                            <div key={action} className="p-3 bg-tech-dark/30 rounded border border-tech-accent/20">
                              <p className="text-sm font-medium text-white capitalize">
                                {action.replace('_', ' ')}
                              </p>
                              <p className="text-lg font-bold text-tech-accent">{count}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Metadata */}
                      <div>
                        <h4 className="text-sm font-semibold text-gray-300 mb-3">Session Metadata</h4>
                        <div className="bg-tech-dark/30 p-4 rounded border border-tech-accent/20">
                          <pre className="text-xs text-gray-300 font-mono overflow-x-auto">
                            {JSON.stringify(sessionExport.metadata, null, 2)}
                          </pre>
                        </div>
                      </div>

                      {/* Screenshots Preview */}
                      {sessionExport.screenshots.length > 0 && (
                        <div>
                          <h4 className="text-sm font-semibold text-gray-300 mb-3">
                            Screenshots ({sessionExport.screenshots.length})
                          </h4>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {sessionExport.screenshots.slice(0, 8).map((screenshot, index) => (
                              <div key={index} className="relative group">
                                <img
                                  src={`data:image/png;base64,${screenshot}`}
                                  alt={`Screenshot ${index + 1}`}
                                  className="w-full h-20 object-cover rounded border border-tech-accent/20"
                                />
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded flex items-center justify-center">
                                  <Eye className="w-4 h-4 text-white" />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="panel h-full flex items-center justify-center">
            <div className="text-center text-gray-400">
              <Settings className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg">Select a session to view details</p>
              <p className="text-sm">Choose a session from the list to see its information and data</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
