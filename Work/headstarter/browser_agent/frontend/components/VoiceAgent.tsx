'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Brain, 
  Zap,
  Eye,
  Terminal,
  Play,
  Pause,
  Square
} from 'lucide-react'
import toast from 'react-hot-toast'

interface VoiceAgentProps {
  sessionId: string | null
}

interface TranscriptionData {
  text: string
  confidence: number
  intent: string
  entities: Record<string, any>
  suggested_actions: string[]
}

interface BrowserResult {
  action: string
  success: boolean
  screenshot?: string
  logs: string[]
  error?: string
}

export default function VoiceAgent({ sessionId }: VoiceAgentProps) {
  const [isListening, setIsListening] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [transcription, setTranscription] = useState<TranscriptionData | null>(null)
  const [browserResult, setBrowserResult] = useState<BrowserResult | null>(null)
  const [isTTSEnabled, setIsTTSEnabled] = useState(true)
  const [recentCommands, setRecentCommands] = useState<string[]>([])
  const [wsConnection, setWsConnection] = useState<WebSocket | null>(null)
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])

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
      console.log('WebSocket connected')
      setWsConnection(ws)
    }
    
    ws.onmessage = (event) => {
      const message = JSON.parse(event.data)
      handleWebSocketMessage(message)
    }
    
    ws.onclose = () => {
      console.log('WebSocket disconnected')
      setWsConnection(null)
    }
    
    ws.onerror = (error) => {
      console.error('WebSocket error:', error)
      toast.error('Connection error')
    }
  }

  const handleWebSocketMessage = (message: any) => {
    switch (message.type) {
      case 'transcription':
        setTranscription(message.data)
        setIsProcessing(false)
        break
      case 'browser_result':
        setBrowserResult(message.data)
        toast.success(`Action ${message.data.success ? 'completed' : 'failed'}`)
        break
      case 'tts_response':
        if (isTTSEnabled && message.data.audio) {
          playTTSAudio(message.data.audio)
        }
        break
      case 'error':
        toast.error(message.message)
        setIsProcessing(false)
        break
    }
  }

  const startListening = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data)
      }

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' })
        sendAudioToServer(audioBlob)
        stream.getTracks().forEach(track => track.stop())
      }

      mediaRecorder.start()
      setIsListening(true)
      toast.success('Listening...')
    } catch (error) {
      console.error('Error accessing microphone:', error)
      toast.error('Microphone access denied')
    }
  }

  const stopListening = () => {
    if (mediaRecorderRef.current && isListening) {
      mediaRecorderRef.current.stop()
      setIsListening(false)
      setIsProcessing(true)
    }
  }

  const sendAudioToServer = async (audioBlob: Blob) => {
    if (!wsConnection || !sessionId) return

    try {
      const arrayBuffer = await audioBlob.arrayBuffer()
      const base64Audio = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)))
      
      wsConnection.send(JSON.stringify({
        type: 'voice_command',
        data: {
          audio_data: base64Audio,
          session_id: sessionId
        }
      }))
    } catch (error) {
      console.error('Error sending audio:', error)
      toast.error('Failed to process audio')
      setIsProcessing(false)
    }
  }

  const playTTSAudio = (audioData: string) => {
    try {
      const audioBlob = new Blob([Uint8Array.from(atob(audioData), c => c.charCodeAt(0))], { type: 'audio/mp3' })
      const audioUrl = URL.createObjectURL(audioBlob)
      const audio = new Audio(audioUrl)
      audio.play()
      
      audio.onended = () => {
        URL.revokeObjectURL(audioUrl)
      }
    } catch (error) {
      console.error('Error playing TTS audio:', error)
    }
  }

  const executeCommand = async (command: string) => {
    if (!wsConnection || !sessionId) return

    try {
      // Simulate voice command processing
      const audioBlob = new Blob([command], { type: 'text/plain' })
      await sendAudioToServer(audioBlob)
      
      // Add to recent commands
      setRecentCommands(prev => [command, ...prev.slice(0, 4)])
    } catch (error) {
      console.error('Error executing command:', error)
      toast.error('Failed to execute command')
    }
  }

  const suggestedCommands = [
    "Go to google.com",
    "Click the search button",
    "Type hello world",
    "Take a screenshot",
    "Scroll down",
    "Find the login form"
  ]

  return (
    <div className="h-full flex flex-col space-y-6">
      {/* Voice Control Panel */}
      <div className="panel flex-1">
        <div className="panel-header">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Brain className="w-6 h-6 text-tech-accent" />
              <h2 className="text-xl font-bold text-white">Voice Control Center</h2>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsTTSEnabled(!isTTSEnabled)}
                className={`p-2 rounded-lg transition-colors ${
                  isTTSEnabled 
                    ? 'bg-tech-accent/20 text-tech-accent' 
                    : 'bg-tech-gray text-gray-400'
                }`}
              >
                {isTTSEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Voice Input */}
          <div className="flex flex-col items-center space-y-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={isListening ? stopListening : startListening}
              disabled={isProcessing}
              className={`relative w-32 h-32 rounded-full flex items-center justify-center transition-all duration-300 ${
                isListening 
                  ? 'bg-tech-accent glow-green' 
                  : isProcessing
                  ? 'bg-tech-blue glow-blue'
                  : 'bg-tech-gray hover:bg-tech-light-gray border-2 border-tech-accent/30'
              }`}
            >
              {isListening ? (
                <MicOff className="w-12 h-12 text-black" />
              ) : isProcessing ? (
                <div className="spinner w-8 h-8" />
              ) : (
                <Mic className="w-12 h-12 text-tech-accent" />
              )}
              
              {isListening && (
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="absolute inset-0 rounded-full border-2 border-tech-accent/50"
                />
              )}
            </motion.button>

            <div className="text-center">
              <p className="text-lg font-semibold text-white">
                {isListening ? 'Listening...' : isProcessing ? 'Processing...' : 'Click to speak'}
              </p>
              <p className="text-sm text-gray-400 mt-1">
                {isListening ? 'Speak your command' : 'Voice commands will be processed automatically'}
              </p>
            </div>
          </div>

          {/* Transcription Results */}
          <AnimatePresence>
            {transcription && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mt-8 p-4 bg-tech-dark/50 rounded-lg border border-tech-accent/20"
              >
                <div className="flex items-center space-x-2 mb-3">
                  <Terminal className="w-5 h-5 text-tech-accent" />
                  <h3 className="font-semibold text-white">Transcription</h3>
                  <span className="text-xs text-tech-accent font-mono">
                    {Math.round(transcription.confidence * 100)}% confidence
                  </span>
                </div>
                
                <p className="text-white mb-3">{transcription.text}</p>
                
                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center space-x-1">
                    <Brain className="w-4 h-4 text-tech-blue" />
                    <span className="text-tech-blue">Intent: {transcription.intent}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Zap className="w-4 h-4 text-tech-purple" />
                    <span className="text-tech-purple">
                      {transcription.suggested_actions.length} actions
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Browser Results */}
          <AnimatePresence>
            {browserResult && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mt-6 p-4 bg-tech-dark/50 rounded-lg border border-tech-accent/20"
              >
                <div className="flex items-center space-x-2 mb-3">
                  <Eye className="w-5 h-5 text-tech-accent" />
                  <h3 className="font-semibold text-white">Browser Action</h3>
                  <span className={`text-xs font-mono ${
                    browserResult.success ? 'text-tech-accent' : 'text-tech-red'
                  }`}>
                    {browserResult.success ? 'SUCCESS' : 'FAILED'}
                  </span>
                </div>
                
                <p className="text-white mb-3">Action: {browserResult.action}</p>
                
                {browserResult.logs.length > 0 && (
                  <div className="mb-3">
                    <h4 className="text-sm font-semibold text-gray-300 mb-2">Execution Logs:</h4>
                    <div className="space-y-1">
                      {browserResult.logs.map((log, index) => (
                        <p key={index} className="text-xs text-gray-400 font-mono">
                          {log}
                        </p>
                      ))}
                    </div>
                  </div>
                )}
                
                {browserResult.error && (
                  <div className="p-2 bg-tech-red/20 border border-tech-red/30 rounded text-tech-red text-sm">
                    Error: {browserResult.error}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Quick Commands */}
      <div className="panel">
        <div className="panel-header">
          <h3 className="text-lg font-semibold text-white">Quick Commands</h3>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-2 gap-3">
            {suggestedCommands.map((command, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => executeCommand(command)}
                className="p-3 text-left bg-tech-dark/50 hover:bg-tech-accent/20 border border-tech-accent/20 rounded-lg transition-colors"
              >
                <p className="text-sm text-white">{command}</p>
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Commands */}
      {recentCommands.length > 0 && (
        <div className="panel">
          <div className="panel-header">
            <h3 className="text-lg font-semibold text-white">Recent Commands</h3>
          </div>
          <div className="p-4">
            <div className="space-y-2">
              {recentCommands.map((command, index) => (
                <div key={index} className="flex items-center space-x-2 text-sm">
                  <div className="w-2 h-2 bg-tech-accent rounded-full" />
                  <span className="text-gray-300 font-mono">{command}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
