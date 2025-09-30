"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Play, 
  Cloud, 
  CheckCircle, 
  AlertTriangle, 
  Clock,
  RefreshCw
} from "lucide-react"
import { useRouter } from "next/navigation"

interface ScanButtonProps {
  cloudProvider: 'AWS' | 'GCP' | 'Azure'
  onScanComplete?: (scanId: string) => void
  disabled?: boolean
}

export default function ScanButton({ cloudProvider, onScanComplete, disabled }: ScanButtonProps) {
  const [isScanning, setIsScanning] = useState(false)
  const [scanProgress, setScanProgress] = useState(0)
  const [scanStatus, setScanStatus] = useState<'idle' | 'scanning' | 'completed' | 'error'>('idle')
  const [currentScanId, setCurrentScanId] = useState<string | null>(null)
  const router = useRouter()

  const handleScan = async () => {
    if (isScanning || disabled) return

    setIsScanning(true)
    setScanStatus('scanning')
    setScanProgress(0)

    try {
      // Start mock scan
      const response = await fetch('/api/mock-scan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cloudProvider
        })
      })

      if (!response.ok) {
        throw new Error('Failed to start scan')
      }

      const data = await response.json()
      setCurrentScanId(data.scan.id)

      // Simulate progress
      const progressInterval = setInterval(() => {
        setScanProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 1000)

      // Poll for scan completion
      const pollInterval = setInterval(async () => {
        try {
          const scanResponse = await fetch(`/api/scans/${data.scan.id}`)
          if (scanResponse.ok) {
            const scanData = await scanResponse.json()
            if (scanData.scan.status === 'COMPLETED') {
              clearInterval(pollInterval)
              clearInterval(progressInterval)
              setScanProgress(100)
              setScanStatus('completed')
              setIsScanning(false)
              
              if (onScanComplete) {
                onScanComplete(data.scan.id)
              }
            } else if (scanData.scan.status === 'FAILED') {
              clearInterval(pollInterval)
              clearInterval(progressInterval)
              setScanStatus('error')
              setIsScanning(false)
            }
          }
        } catch (error) {
          console.error('Error polling scan status:', error)
        }
      }, 2000)

    } catch (error) {
      console.error('Scan error:', error)
      setScanStatus('error')
      setIsScanning(false)
    }
  }

  const getProviderIcon = () => {
    switch (cloudProvider) {
      case 'AWS':
        return <span className="text-orange-600 font-bold text-sm">AWS</span>
      case 'GCP':
        return <span className="text-blue-600 font-bold text-sm">GCP</span>
      case 'Azure':
        return <span className="text-blue-600 font-bold text-sm">AZ</span>
      default:
        return <Cloud className="h-5 w-5" />
    }
  }

  const getStatusIcon = () => {
    switch (scanStatus) {
      case 'scanning':
        return <RefreshCw className="h-4 w-4 animate-spin text-blue-600" />
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusBadge = () => {
    switch (scanStatus) {
      case 'scanning':
        return <Badge variant="default" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">Scanning</Badge>
      case 'completed':
        return <Badge variant="default" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Completed</Badge>
      case 'error':
        return <Badge variant="destructive">Failed</Badge>
      default:
        return <Badge variant="secondary">Ready</Badge>
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
              {getProviderIcon()}
            </div>
            <div>
              <CardTitle className="text-lg">{cloudProvider} Infrastructure</CardTitle>
              <CardDescription>
                {scanStatus === 'idle' && 'Ready to scan your infrastructure'}
                {scanStatus === 'scanning' && 'Analyzing your cloud resources...'}
                {scanStatus === 'completed' && 'Scan completed successfully'}
                {scanStatus === 'error' && 'Scan failed - please try again'}
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {getStatusIcon()}
            {getStatusBadge()}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {scanStatus === 'scanning' && (
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Scan Progress</span>
                <span>{scanProgress}%</span>
              </div>
              <Progress value={scanProgress} className="h-2" />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Scanning {cloudProvider} resources... This may take a few minutes.
            </p>
          </div>
        )}

        {scanStatus === 'completed' && (
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-green-600">
              <CheckCircle className="h-5 w-5" />
              <span className="font-medium">Scan completed successfully!</span>
            </div>
            <div className="flex space-x-2">
              <Button 
                onClick={() => router.push(`/dashboard/scans/${currentScanId}`)}
                className="flex-1"
              >
                View Results
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setScanStatus('idle')
                  setScanProgress(0)
                  setCurrentScanId(null)
                }}
              >
                New Scan
              </Button>
            </div>
          </div>
        )}

        {scanStatus === 'error' && (
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              <span className="font-medium">Scan failed</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              There was an error scanning your {cloudProvider} infrastructure. Please try again.
            </p>
            <Button 
              onClick={() => {
                setScanStatus('idle')
                setScanProgress(0)
                setCurrentScanId(null)
              }}
              className="w-full"
            >
              Try Again
            </Button>
          </div>
        )}

        {scanStatus === 'idle' && (
          <Button 
            onClick={handleScan}
            disabled={disabled}
            className="w-full"
            size="lg"
          >
            <Play className="h-4 w-4 mr-2" />
            Start {cloudProvider} Scan
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
