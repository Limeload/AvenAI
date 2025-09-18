'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Monitor, 
  Activity, 
  Zap, 
  Eye, 
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  TrendingUp,
  Users,
  Globe,
  Camera
} from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'

interface MonitoringDashboardProps {
  sessionId: string | null
}

interface SystemMetrics {
  total_actions: number
  successful_actions: number
  failed_actions: number
  success_rate: number
  average_response_time: number
  active_sessions: number
  total_sessions: number
  peak_concurrent_sessions: number
  recent_actions_1h: number
  system_uptime: number
  services_status: Record<string, boolean>
}

interface ActivityLog {
  session_id: string
  action_type: string
  timestamp: string
  success: boolean
  details: Record<string, any>
  execution_time?: number
}

export default function MonitoringDashboard({ sessionId }: MonitoringDashboardProps) {
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null)
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedTimeRange, setSelectedTimeRange] = useState('1h')

  useEffect(() => {
    fetchMetrics()
    fetchActivityLogs()
    
    const interval = setInterval(() => {
      fetchMetrics()
      fetchActivityLogs()
    }, 5000) // Update every 5 seconds

    return () => clearInterval(interval)
  }, [selectedTimeRange])

  const fetchMetrics = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/monitoring/status`)
      const data = await response.json()
      setMetrics(data)
    } catch (error) {
      console.error('Failed to fetch metrics:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchActivityLogs = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/monitoring/logs`)
      const data = await response.json()
      setActivityLogs(data)
    } catch (error) {
      console.error('Failed to fetch activity logs:', error)
    }
  }

  const formatUptime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    return `${hours}h ${minutes}m`
  }

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString()
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

  // Mock data for charts
  const performanceData = [
    { time: '00:00', actions: 12, success: 11 },
    { time: '01:00', actions: 8, success: 8 },
    { time: '02:00', actions: 15, success: 14 },
    { time: '03:00', actions: 22, success: 20 },
    { time: '04:00', actions: 18, success: 17 },
    { time: '05:00', actions: 25, success: 24 },
  ]

  const actionTypesData = [
    { type: 'Navigate', count: 45 },
    { type: 'Click', count: 32 },
    { type: 'Type', count: 28 },
    { type: 'Screenshot', count: 15 },
    { type: 'Scroll', count: 12 },
  ]

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="spinner w-8 h-8" />
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col space-y-6">
      {/* System Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="panel p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Total Actions</p>
              <p className="text-2xl font-bold text-white">{metrics?.total_actions || 0}</p>
            </div>
            <Activity className="w-8 h-8 text-tech-accent" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="panel p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Success Rate</p>
              <p className="text-2xl font-bold text-tech-accent">{metrics?.success_rate || 0}%</p>
            </div>
            <TrendingUp className="w-8 h-8 text-tech-accent" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="panel p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Active Sessions</p>
              <p className="text-2xl font-bold text-white">{metrics?.active_sessions || 0}</p>
            </div>
            <Users className="w-8 h-8 text-tech-blue" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="panel p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Avg Response</p>
              <p className="text-2xl font-bold text-white">{metrics?.average_response_time?.toFixed(2) || 0}s</p>
            </div>
            <Clock className="w-8 h-8 text-tech-purple" />
          </div>
        </motion.div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="panel p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Performance Trends</h3>
            <div className="flex space-x-2">
              {['1h', '6h', '24h'].map((range) => (
                <button
                  key={range}
                  onClick={() => setSelectedTimeRange(range)}
                  className={`px-3 py-1 text-xs rounded ${
                    selectedTimeRange === range
                      ? 'bg-tech-accent text-black'
                      : 'bg-tech-gray text-gray-300'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>
          
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="time" stroke="#666" />
              <YAxis stroke="#666" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1a1a1a', 
                  border: '1px solid #00ff88',
                  borderRadius: '8px'
                }} 
              />
              <Line 
                type="monotone" 
                dataKey="actions" 
                stroke="#00ff88" 
                strokeWidth={2}
                dot={{ fill: '#00ff88' }}
              />
              <Line 
                type="monotone" 
                dataKey="success" 
                stroke="#0088ff" 
                strokeWidth={2}
                dot={{ fill: '#0088ff' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Action Types Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="panel p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-4">Action Types</h3>
          
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={actionTypesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="type" stroke="#666" />
              <YAxis stroke="#666" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1a1a1a', 
                  border: '1px solid #00ff88',
                  borderRadius: '8px'
                }} 
              />
              <Bar dataKey="count" fill="#00ff88" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Service Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="panel p-6"
      >
        <h3 className="text-lg font-semibold text-white mb-4">Service Status</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {Object.entries(metrics?.services_status || {}).map(([service, status]) => (
            <div key={service} className="flex flex-col items-center space-y-2">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                status ? 'bg-tech-accent/20' : 'bg-tech-red/20'
              }`}>
                {service === 'voice_service' && <Zap className={`w-6 h-6 ${status ? 'text-tech-accent' : 'text-tech-red'}`} />}
                {service === 'intent_parser' && <Brain className={`w-6 h-6 ${status ? 'text-tech-accent' : 'text-tech-red'}`} />}
                {service === 'browser_automation' && <Monitor className={`w-6 h-6 ${status ? 'text-tech-accent' : 'text-tech-red'}`} />}
                {service === 'session_manager' && <Users className={`w-6 h-6 ${status ? 'text-tech-accent' : 'text-tech-red'}`} />}
                {service === 'monitoring' && <Activity className={`w-6 h-6 ${status ? 'text-tech-accent' : 'text-tech-red'}`} />}
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-white capitalize">
                  {service.replace('_', ' ')}
                </p>
                <p className={`text-xs font-mono ${
                  status ? 'text-tech-accent' : 'text-tech-red'
                }`}>
                  {status ? 'ONLINE' : 'OFFLINE'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="panel p-6 flex-1"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Recent Activity</h3>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-tech-accent rounded-full animate-pulse" />
            <span className="text-sm text-tech-accent font-mono">LIVE</span>
          </div>
        </div>
        
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {activityLogs.slice(0, 10).map((log, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center space-x-3 p-3 bg-tech-dark/30 rounded-lg border border-tech-accent/10"
            >
              {getStatusIcon(log.success)}
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-white">{log.action_type}</span>
                  <span className={`text-xs font-mono ${getStatusColor(log.success)}`}>
                    {log.success ? 'SUCCESS' : 'FAILED'}
                  </span>
                </div>
                <p className="text-xs text-gray-400 font-mono">
                  {formatTimestamp(log.timestamp)}
                  {log.execution_time && ` • ${log.execution_time.toFixed(2)}s`}
                </p>
              </div>
              <div className="text-xs text-gray-500 font-mono">
                {log.session_id.slice(0, 8)}...
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
