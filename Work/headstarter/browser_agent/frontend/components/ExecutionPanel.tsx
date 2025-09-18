'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Terminal, 
  Play, 
  Pause, 
  Square, 
  Camera,
  Eye,
  MousePointer,
  Type,
  Navigation,
  Scroll,
  Search,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react'
import toast from 'react-hot-toast'

interface ExecutionPanelProps {
  sessionId: string | null
}

interface BrowserAction {
  action: string
  target: string
  value?: string
  wait_time?: number
  screenshot?: boolean
}

interface ExecutionResult {
  action: string
  success: boolean
  screenshot?: string
  logs: string[]
  error?: string
  execution_time: number
}

export default function ExecutionPanel({ sessionId }: ExecutionPanelProps) {
  const [isExecuting, setIsExecuting] = useState(false)
  const [currentAction, setCurrentAction] = useState<BrowserAction | null>(null)
  const [executionHistory, setExecutionHistory] = useState<ExecutionResult[]>([])
  const [wsConnection, setWsConnection] = useState<WebSocket | null>(null)
  const [selectedScreenshot, setSelectedScreenshot] = useState<string | null>(null)

  const actionTypes = [
    { id: 'navigate', label: 'Navigate', icon: Navigation, color: 'tech-blue' },
    { id: 'click', label: 'Click', icon: MousePointer, color: 'tech-accent' },
    { id: 'type', label: 'Type', icon: Type, color: 'tech-purple' },
    { id: 'scroll', label: 'Scroll', icon: Scroll, color: 'tech-yellow' },
    { id: 'screenshot', label: 'Screenshot', icon: Camera, color: 'tech-cyan' },
    { id: 'search', label: 'Search', icon: Search, color: 'tech-magenta' },
  ]

  useEffect(() => {
    if (sessionId) {
      connectWebSocket()
    }
    
    return () => {
      if (wsConnection) {
        wsConnection.close()
      }
    }
  }, [sessionId])

  const connectWebSocket = () => {
    if (!sessionId) return
    
    const ws = new WebSocket(`${process.env.NEXT_PUBLIC_WS_URL}/ws/${sessionId}`)
    
    ws.onopen = () => {
      console.log('Execution WebSocket connected')
      setWsConnection(ws)
    }
    
    ws.onmessage = (event) => {
      const message = JSON.parse(event.data)
      handleWebSocketMessage(message)
    }
    
    ws.onclose = () => {
      console.log('Execution WebSocket disconnected')
      setWsConnection(null)
    }
    
    ws.onerror = (error) => {
      console.error('Execution WebSocket error:', error)
      toast.error('Connection error')
    }
  }

  const handleWebSocketMessage = (message: any) => {
    switch (message.type) {
      case 'browser_result':
        const result: ExecutionResult = {
          action: message.data.action,
          success: message.data.success,
          screenshot: message.data.screenshot,
          logs: message.data.logs,
          error: message.data.error,
          execution_time: message.data.execution_time || 0
        }
        setExecutionHistory(prev => [result, ...prev])
        setIsExecuting(false)
        setCurrentAction(null)
        
        if (result.success) {
          toast.success(`Action ${result.action} completed successfully`)
        } else {
          toast.error(`Action ${result.action} failed: ${result.error}`)
        }
        break
      case 'error':
        toast.error(message.message)
        setIsExecuting(false)
        setCurrentAction(null)
        break
    }
  }

  const executeAction = async (action: BrowserAction) => {
    if (!wsConnection || !sessionId || isExecuting) return

    try {
      setCurrentAction(action)
      setIsExecuting(true)
      
      wsConnection.send(JSON.stringify({
        type: 'browser_action',
        data: {
          action: action.action,
          target: action.target,
          value: action.value,
          wait_time: action.wait_time || 5,
          screenshot: action.screenshot !== false,
          session_id: sessionId
        }
      }))
      
      toast.success(`Executing ${action.action}...`)
    } catch (error) {
      console.error('Error executing action:', error)
      toast.error('Failed to execute action')
      setIsExecuting(false)
      setCurrentAction(null)
    }
  }

  const stopExecution = () => {
    setIsExecuting(false)
    setCurrentAction(null)
    toast.info('Execution stopped')
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

  return (
    <div className="h-full flex flex-col space-y-6">
      {/* Action Builder */}
      <div className="panel">
        <div className="panel-header">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Terminal className="w-6 h-6 text-tech-accent" />
              <h2 className="text-xl font-bold text-white">Execution Panel</h2>
            </div>
            <div className="flex items-center space-x-2">
              {isExecuting ? (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={stopExecution}
                  className="flex items-center space-x-2 px-4 py-2 bg-tech-red/20 hover:bg-tech-red/30 text-tech-red rounded-lg transition-colors"
                >
                  <Square className="w-4 h-4" />
                  <span className="font-mono">Stop</span>
                </motion.button>
              ) : (
                <div className="flex items-center space-x-2 text-sm text-gray-400">
                  <div className="w-2 h-2 bg-tech-accent rounded-full" />
                  <span className="font-mono">READY</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Action Type Selection */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-4">Select Action Type</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {actionTypes.map((actionType) => {
                const Icon = actionType.icon
                return (
                  <motion.button
                    key={actionType.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      const action: BrowserAction = {
                        action: actionType.id,
                        target: '',
                        screenshot: true
                      }
                      executeAction(action)
                    }}
                    disabled={isExecuting}
                    className={`p-4 rounded-lg border transition-all ${
                      isExecuting
                        ? 'opacity-50 cursor-not-allowed'
                        : `border-${actionType.color}/30 hover:border-${actionType.color}/60 hover:bg-${actionType.color}/10`
                    }`}
                  >
                    <div className="flex flex-col items-center space-y-2">
                      <Icon className={`w-6 h-6 text-${actionType.color}`} />
                      <span className="text-sm font-medium text-white">{actionType.label}</span>
                    </div>
                  </motion.button>
                )
              })}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => executeAction({
                  action: 'navigate',
                  target: 'https://google.com',
                  screenshot: true
                })}
                disabled={isExecuting}
                className="p-4 bg-tech-blue/20 hover:bg-tech-blue/30 border border-tech-blue/30 rounded-lg transition-colors disabled:opacity-50"
              >
                <div className="flex items-center space-x-3">
                  <Navigation className="w-5 h-5 text-tech-blue" />
                  <div className="text-left">
                    <p className="font-medium text-white">Navigate to Google</p>
                    <p className="text-sm text-gray-400">Open google.com</p>
                  </div>
                </div>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => executeAction({
                  action: 'screenshot',
                  target: 'current_page',
                  screenshot: true
                })}
                disabled={isExecuting}
                className="p-4 bg-tech-cyan/20 hover:bg-tech-cyan/30 border border-tech-cyan/30 rounded-lg transition-colors disabled:opacity-50"
              >
                <div className="flex items-center space-x-3">
                  <Camera className="w-5 h-5 text-tech-cyan" />
                  <div className="text-left">
                    <p className="font-medium text-white">Take Screenshot</p>
                    <p className="text-sm text-gray-400">Capture current page</p>
                  </div>
                </div>
              </motion.button>
            </div>
          </div>

          {/* Current Execution */}
          {currentAction && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-tech-blue/20 border border-tech-blue/30 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <div className="spinner w-5 h-5" />
                <div>
                  <p className="font-medium text-white">Executing: {currentAction.action}</p>
                  <p className="text-sm text-gray-400">Target: {currentAction.target}</p>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Execution History */}
      <div className="panel flex-1">
        <div className="panel-header">
          <h3 className="text-lg font-semibold text-white">Execution History</h3>
        </div>
        <div className="p-4 flex-1 overflow-y-auto">
          {executionHistory.length === 0 ? (
            <div className="flex items-center justify-center h-32 text-gray-400">
              <div className="text-center">
                <Terminal className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No executions yet</p>
                <p className="text-sm">Execute actions to see results here</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {executionHistory.map((result, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 bg-tech-dark/30 border border-tech-accent/10 rounded-lg"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(result.success)}
                      <div>
                        <p className="font-medium text-white">{result.action}</p>
                        <p className={`text-sm font-mono ${getStatusColor(result.success)}`}>
                          {result.success ? 'SUCCESS' : 'FAILED'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right text-sm text-gray-400">
                      <p>{result.execution_time.toFixed(2)}s</p>
                      <p className="font-mono">{new Date().toLocaleTimeString()}</p>
                    </div>
                  </div>

                  {result.logs.length > 0 && (
                    <div className="mb-3">
                      <h4 className="text-sm font-semibold text-gray-300 mb-2">Execution Logs:</h4>
                      <div className="space-y-1">
                        {result.logs.map((log, logIndex) => (
                          <p key={logIndex} className="text-xs text-gray-400 font-mono bg-tech-dark/50 p-2 rounded">
                            {log}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}

                  {result.error && (
                    <div className="mb-3 p-2 bg-tech-red/20 border border-tech-red/30 rounded text-tech-red text-sm">
                      Error: {result.error}
                    </div>
                  )}

                  {result.screenshot && (
                    <div className="mt-3">
                      <button
                        onClick={() => setSelectedScreenshot(result.screenshot!)}
                        className="flex items-center space-x-2 text-tech-accent hover:text-tech-accent/80 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        <span className="text-sm">View Screenshot</span>
                      </button>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Screenshot Modal */}
      {selectedScreenshot && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-tech-gray rounded-lg p-4 max-w-4xl max-h-[90vh] overflow-auto"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Screenshot</h3>
              <button
                onClick={() => setSelectedScreenshot(null)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            <img
              src={`data:image/png;base64,${selectedScreenshot}`}
              alt="Screenshot"
              className="w-full h-auto rounded border border-tech-accent/30"
            />
          </motion.div>
        </div>
      )}
    </div>
  )
}
