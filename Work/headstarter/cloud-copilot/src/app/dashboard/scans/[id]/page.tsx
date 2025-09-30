"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  ArrowLeft,
  Download,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Clock,
  XCircle,
  Code,
  Copy,
  ExternalLink
} from "lucide-react"
import SummaryCard from "@/components/SummaryCard"
import FixSnippet from "@/components/FixSnippet"

interface Scan {
  id: string
  cloudProvider: string
  status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED'
  createdAt: string
  completedAt?: string
  summary?: string
  infraData?: any
  issues: Issue[]
  recommendations: Recommendation[]
}

interface Issue {
  id: string
  title: string
  description: string
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  category: string
  createdAt: string
}

interface Recommendation {
  id: string
  title: string
  description: string
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  category: string
  terraform?: string
  createdAt: string
}

export default function ScanResultsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const params = useParams()
  const [scan, setScan] = useState<Scan | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'issues' | 'recommendations'>('issues')
  const [isGeneratingTerraform, setIsGeneratingTerraform] = useState<string | null>(null)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
    }
  }, [status, router])

  useEffect(() => {
    if (session && params.id) {
      fetchScan()
    }
  }, [session, params.id])

  const fetchScan = async () => {
    try {
      const response = await fetch(`/api/scans/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setScan(data.scan)
      } else {
        console.error("Failed to fetch scan")
      }
    } catch (error) {
      console.error("Error fetching scan:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (status === "loading" || isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading scan results...</p>
        </div>
      </div>
    )
  }

  if (!session || !scan) {
    return null
  }

  const getStatusIcon = (status: Scan['status']) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case 'RUNNING':
        return <RefreshCw className="h-5 w-5 text-blue-600 animate-spin" />
      case 'FAILED':
        return <XCircle className="h-5 w-5 text-red-600" />
      default:
        return <Clock className="h-5 w-5 text-yellow-600" />
    }
  }

  const getStatusBadge = (status: Scan['status']) => {
    switch (status) {
      case 'COMPLETED':
        return <Badge variant="default" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Completed</Badge>
      case 'RUNNING':
        return <Badge variant="default" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">Running</Badge>
      case 'FAILED':
        return <Badge variant="destructive">Failed</Badge>
      default:
        return <Badge variant="secondary">Pending</Badge>
    }
  }

  const getSeverityBadge = (severity: Issue['severity']) => {
    switch (severity) {
      case 'CRITICAL':
        return <Badge variant="destructive">Critical</Badge>
      case 'HIGH':
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">High</Badge>
      case 'MEDIUM':
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">Medium</Badge>
      default:
        return <Badge variant="secondary">Low</Badge>
    }
  }

  const getPriorityBadge = (priority: Recommendation['priority']) => {
    switch (priority) {
      case 'URGENT':
        return <Badge variant="destructive">Urgent</Badge>
      case 'HIGH':
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">High</Badge>
      case 'MEDIUM':
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">Medium</Badge>
      default:
        return <Badge variant="secondary">Low</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    // TODO: Add toast notification
  }

  const handleGenerateTerraform = async (recommendationId: string) => {
    setIsGeneratingTerraform(recommendationId)
    try {
      const response = await fetch('/api/fix', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recommendationId,
          scanId: scan?.id
        })
      })

      if (response.ok) {
        // Refresh scan data to get updated Terraform code
        await fetchScan()
      }
    } catch (error) {
      console.error('Error generating Terraform:', error)
    } finally {
      setIsGeneratingTerraform(null)
    }
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-4 mb-4">
          <Button variant="outline" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="flex items-center space-x-2">
            {getStatusIcon(scan.status)}
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {scan.cloudProvider} Scan Results
            </h1>
            {getStatusBadge(scan.status)}
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 dark:text-gray-300">
              Started: {formatDate(scan.createdAt)}
            </p>
            {scan.completedAt && (
              <p className="text-gray-600 dark:text-gray-300">
                Completed: {formatDate(scan.completedAt)}
              </p>
            )}
            {scan.summary && (
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                {scan.summary}
              </p>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" disabled={scan.status !== 'COMPLETED'}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm" onClick={fetchScan}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>
      </div>

      {scan.status === 'COMPLETED' && (
        <>
          {/* Summary Card */}
          <SummaryCard 
            scanData={{
              summary: scan.summary || 'Scan completed successfully',
              issues: scan.issues,
              recommendations: scan.recommendations,
              overall_score: {
                cost_optimization: 75,
                security: 60,
                performance: 80,
                best_practices: 70
              }
            }}
          />

          {/* Tabs */}
          <div className="mb-6">
            <div className="border-b border-gray-200 dark:border-gray-700">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab('issues')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'issues'
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  Issues ({scan.issues.length})
                </button>
                <button
                  onClick={() => setActiveTab('recommendations')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'recommendations'
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  Recommendations ({scan.recommendations.length})
                </button>
              </nav>
            </div>
          </div>

          {/* Content */}
          {activeTab === 'issues' && (
            <div className="space-y-4">
              {scan.issues.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Issues Found</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Great! Your infrastructure looks healthy and well-configured.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                scan.issues.map((issue) => (
                  <Card key={issue.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                              {issue.title}
                            </h3>
                            {getSeverityBadge(issue.severity)}
                            <Badge variant="outline">{issue.category}</Badge>
                          </div>
                          <p className="text-gray-600 dark:text-gray-300 mb-4">
                            {issue.description}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Found on {formatDate(issue.createdAt)}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          )}

          {activeTab === 'recommendations' && (
            <div className="space-y-4">
              {scan.recommendations.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Recommendations</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Your infrastructure is already optimized!
                    </p>
                  </CardContent>
                </Card>
              ) : (
                scan.recommendations.map((recommendation) => (
                  <FixSnippet
                    key={recommendation.id}
                    recommendation={recommendation}
                    onGenerateTerraform={handleGenerateTerraform}
                    isLoading={isGeneratingTerraform === recommendation.id}
                  />
                ))
              )}
            </div>
          )}
        </>
      )}

      {scan.status === 'RUNNING' && (
        <Card>
          <CardContent className="p-12 text-center">
            <RefreshCw className="h-12 w-12 text-blue-600 mx-auto mb-4 animate-spin" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Scan in Progress</h3>
            <p className="text-gray-600 dark:text-gray-300">
              We're analyzing your {scan.cloudProvider} infrastructure. This may take a few minutes.
            </p>
          </CardContent>
        </Card>
      )}

      {scan.status === 'FAILED' && (
        <Card>
          <CardContent className="p-12 text-center">
            <XCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Scan Failed</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              There was an error scanning your {scan.cloudProvider} infrastructure.
            </p>
            <Button onClick={fetchScan}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry Scan
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
