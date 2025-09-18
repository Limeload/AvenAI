'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { 
  Activity, 
  Filter, 
  Download, 
  Search,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  Terminal,
  Zap,
  Monitor,
  Brain
} from 'lucide-react'
import toast from 'react-hot-toast'

interface LogsPanelProps {
  sessionId: string | null
}

interface LogEntry {
  session_id: string
  action_type: string
  timestamp: string
  success: boolean
  details: Record<string, any>
  execution_time?: number
}

export default function LogsPanel({ sessionId }: LogsPanelProps) {
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [filteredLogs, setFilteredLogs] = useState<LogEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [autoScroll, setAutoScroll] = useState(true)
  const logsEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchLogs()
    
    const interval = setInterval(() => {
      fetchLogs()
    }, 2000) // Update every 2 seconds

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    filterLogs()
  }, [logs, searchTerm, filterType, filterStatus])

  useEffect(() => {
    if (autoScroll && logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [filteredLogs, autoScroll])

  const fetchLogs = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/monitoring/logs`)
      const data = await response.json()
      setLogs(data)
    } catch (error) {
      console.error('Failed to fetch logs:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filterLogs = () => {
    let filtered = logs

    // Filter by type
    if (filterType !== 'all') {
      filtered = filtered.filter(log => log.action_type === filterType)
    }

    // Filter by status
    if (filterStatus !== 'all') {
      const successFilter = filterStatus === 'success'
      filtered = filtered.filter(log => log.success === successFilter)
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(log => 
        log.action_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        JSON.stringify(log.details).toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredLogs(filtered)
  }

  const exportLogs = () => {
    const exportData = {
      export_timestamp: new Date().toISOString(),
      total_logs: filteredLogs.length,
      logs: filteredLogs
    }

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `logs-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    toast.success('Logs exported successfully')
  }

  const clearLogs = () => {
    setLogs([])
    setFilteredLogs([])
    toast.info('Logs cleared')
  }

  const getStatusIcon = (success: boolean) => {
    return success ? (
      <CheckCircle className="w-4 h-4 text-tech-accent" />
    ) : (
      <XCircle className="w-4 h-4 text-tech-red" />
    )
  }

  const getStatusColor = (success: boolean) => {
    return success ? 'text-tech-accent' : 'text-tech-red'
  }

  const getActionIcon = (actionType: string) => {
    switch (actionType) {
      case 'voice_command':
        return <Zap className="w-4 h-4 text-tech-blue" />
      case 'browser_action':
        return <Monitor className="w-4 h-4 text-tech-purple" />
      case 'intent_parsing':
        return <Brain className="w-4 h-4 text-tech-yellow" />
      default:
        return <Activity className="w-4 h-4 text-gray-400" />
    }
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    return {
      time: date.toLocaleTimeString(),
      date: date.toLocaleDateString()
    }
  }

  const actionTypes = ['all', 'voice_command', 'browser_action', 'intent_parsing', 'health_check']

  return (
    <div className="h-full flex flex-col space-y-4">
      {/* Header */}
      <div className="panel">
        <div className="panel-header">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Activity className="w-6 h-6 text-tech-accent" />
              <h2 className="text-xl font-bold text-white">Activity Logs</h2>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-tech-accent rounded-full animate-pulse" />
                <span className="text-sm text-tech-accent font-mono">LIVE</span>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={exportLogs}
                className="flex items-center space-x-1 px-3 py-1 bg-tech-blue/20 hover:bg-tech-blue/30 text-tech-blue rounded-lg transition-colors"
              >
                <Download className="w-4 h-4" />
                <span className="text-sm font-mono">Export</span>
              </motion.button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="p-4 border-t border-tech-accent/20">
          <div className="flex flex-wrap items-center gap-4">
            {/* Search */}
            <div className="flex items-center space-x-2">
              <Search className="w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search logs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-3 py-1 bg-tech-dark border border-tech-accent/30 rounded text-white text-sm placeholder-gray-400 focus:outline-none focus:border-tech-accent"
              />
            </div>

            {/* Action Type Filter */}
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-1 bg-tech-dark border border-tech-accent/30 rounded text-white text-sm focus:outline-none focus:border-tech-accent"
              >
                {actionTypes.map(type => (
                  <option key={type} value={type} className="bg-tech-dark">
                    {type === 'all' ? 'All Types' : type.replace('_', ' ')}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div className="flex items-center space-x-2">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-1 bg-tech-dark border border-tech-accent/30 rounded text-white text-sm focus:outline-none focus:border-tech-accent"
              >
                <option value="all" className="bg-tech-dark">All Status</option>
                <option value="success" className="bg-tech-dark">Success Only</option>
                <option value="failed" className="bg-tech-dark">Failed Only</option>
              </select>
            </div>

            {/* Auto Scroll Toggle */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="autoScroll"
                checked={autoScroll}
                onChange={(e) => setAutoScroll(e.target.checked)}
                className="w-4 h-4 text-tech-accent bg-tech-dark border-tech-accent/30 rounded focus:ring-tech-accent"
              />
              <label htmlFor="autoScroll" className="text-sm text-gray-300">
                Auto Scroll
              </label>
            </div>

            {/* Clear Logs */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={clearLogs}
              className="px-3 py-1 bg-tech-red/20 hover:bg-tech-red/30 text-tech-red rounded-lg transition-colors text-sm"
            >
              Clear
            </motion.button>
          </div>
        </div>
      </div>

      {/* Logs Display */}
      <div className="panel flex-1">
        <div className="panel-header">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">
              Logs ({filteredLogs.length})
            </h3>
            <div className="text-sm text-gray-400 font-mono">
              {logs.length} total entries
            </div>
          </div>
        </div>

        <div className="p-4 flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <div className="spinner w-8 h-8" />
            </div>
          ) : filteredLogs.length === 0 ? (
            <div className="flex items-center justify-center h-32 text-gray-400">
              <div className="text-center">
                <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No logs found</p>
                <p className="text-sm">Logs will appear here as actions are performed</p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredLogs.map((log, index) => {
                const timestamp = formatTimestamp(log.timestamp)
                return (
                  <motion.div
                    key={`${log.timestamp}-${index}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="p-4 bg-tech-dark/30 border border-tech-accent/10 rounded-lg hover:border-tech-accent/20 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        {getActionIcon(log.action_type)}
                        <div>
                          <p className="font-medium text-white capitalize">
                            {log.action_type.replace('_', ' ')}
                          </p>
                          <p className={`text-sm font-mono ${getStatusColor(log.success)}`}>
                            {log.success ? 'SUCCESS' : 'FAILED'}
                          </p>
                        </div>
                      </div>
                      <div className="text-right text-sm text-gray-400">
                        <p className="font-mono">{timestamp.time}</p>
                        <p className="text-xs">{timestamp.date}</p>
                        {log.execution_time && (
                          <p className="text-xs text-tech-accent">
                            {log.execution_time.toFixed(2)}s
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Log Details */}
                    {Object.keys(log.details).length > 0 && (
                      <div className="mb-3">
                        <h4 className="text-sm font-semibold text-gray-300 mb-2">Details:</h4>
                        <div className="bg-tech-dark/50 p-3 rounded border border-tech-accent/10">
                          <pre className="text-xs text-gray-300 font-mono overflow-x-auto">
                            {JSON.stringify(log.details, null, 2)}
                          </pre>
                        </div>
                      </div>
                    )}

                    {/* Session ID */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-xs text-gray-500">
                        <Terminal className="w-3 h-3" />
                        <span className="font-mono">Session: {log.session_id.slice(0, 8)}...</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        {getStatusIcon(log.success)}
                        <span className={`text-xs font-mono ${getStatusColor(log.success)}`}>
                          {log.success ? 'COMPLETED' : 'ERROR'}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
              <div ref={logsEndRef} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
