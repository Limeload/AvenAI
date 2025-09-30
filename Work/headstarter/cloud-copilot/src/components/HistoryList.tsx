"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  History, 
  Eye, 
  Download, 
  Trash2, 
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Zap
} from "lucide-react"
import { useRouter } from "next/navigation"

interface Scan {
  id: string
  cloudProvider: string
  status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED'
  createdAt: string
  completedAt?: string
  summary?: string
  issues: Array<{
    id: string
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  }>
  recommendations: Array<{
    id: string
    priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  }>
}

interface HistoryListProps {
  scans: Scan[]
  onRefresh?: () => void
  isLoading?: boolean
}

export default function HistoryList({ scans, onRefresh, isLoading }: HistoryListProps) {
  const router = useRouter()
  const [sortBy, setSortBy] = useState<'date' | 'status' | 'provider'>('date')
  const [filterBy, setFilterBy] = useState<'all' | 'completed' | 'failed' | 'running'>('all')

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

  const getProviderIcon = (provider: string) => {
    switch (provider) {
      case 'AWS':
        return <span className="text-orange-600 font-bold text-sm">AWS</span>
      case 'GCP':
        return <span className="text-blue-600 font-bold text-sm">GCP</span>
      case 'Azure':
        return <span className="text-blue-600 font-bold text-sm">AZ</span>
      default:
        return <span className="text-gray-600 font-bold text-sm">{provider}</span>
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  const getSeverityCount = (scan: Scan) => {
    const critical = scan.issues.filter(i => i.severity === 'CRITICAL').length
    const high = scan.issues.filter(i => i.severity === 'HIGH').length
    return critical + high
  }

  const getPriorityCount = (scan: Scan) => {
    const urgent = scan.recommendations.filter(r => r.priority === 'URGENT').length
    const high = scan.recommendations.filter(r => r.priority === 'HIGH').length
    return urgent + high
  }

  const filteredScans = scans.filter(scan => {
    if (filterBy === 'all') return true
    if (filterBy === 'completed') return scan.status === 'COMPLETED'
    if (filterBy === 'failed') return scan.status === 'FAILED'
    if (filterBy === 'running') return scan.status === 'RUNNING'
    return true
  })

  const sortedScans = [...filteredScans].sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      case 'status':
        return a.status.localeCompare(b.status)
      case 'provider':
        return a.cloudProvider.localeCompare(b.cloudProvider)
      default:
        return 0
    }
  })

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading scan history...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center">
              <History className="h-5 w-5 mr-2" />
              Scan History
            </CardTitle>
            <CardDescription>
              {scans.length} total scans, {filteredScans.length} shown
            </CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <select
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value as any)}
              className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-800"
            >
              <option value="all">All Scans</option>
              <option value="completed">Completed</option>
              <option value="running">Running</option>
              <option value="failed">Failed</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-800"
            >
              <option value="date">Sort by Date</option>
              <option value="status">Sort by Status</option>
              <option value="provider">Sort by Provider</option>
            </select>
            <Button variant="outline" size="sm" onClick={onRefresh}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {sortedScans.length === 0 ? (
          <div className="text-center py-12">
            <History className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No scans found</h3>
            <p className="text-gray-600 dark:text-gray-300">
              {filterBy === 'all' 
                ? "You haven't run any scans yet. Start by scanning your cloud infrastructure."
                : `No ${filterBy} scans found.`
              }
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedScans.map((scan) => (
              <div
                key={scan.id}
                className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    {getStatusIcon(scan.status)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <div className="w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                        {getProviderIcon(scan.cloudProvider)}
                      </div>
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                        {scan.cloudProvider} Infrastructure Scan
                      </h3>
                      {getStatusBadge(scan.status)}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                      {scan.summary || 'Scan in progress...'}
                    </p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                      <span>Started: {formatDate(scan.createdAt)}</span>
                      {scan.completedAt && (
                        <span>Completed: {formatDate(scan.completedAt)}</span>
                      )}
                      {scan.status === 'COMPLETED' && (
                        <>
                          <span className="flex items-center">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            {scan.issues.length} issues
                          </span>
                          <span className="flex items-center">
                            <Zap className="h-3 w-3 mr-1" />
                            {scan.recommendations.length} recommendations
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {scan.status === 'COMPLETED' && (
                    <>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => router.push(`/dashboard/scans/${scan.id}`)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Results
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Export
                      </Button>
                    </>
                  )}
                  {scan.status === 'FAILED' && (
                    <Button variant="outline" size="sm">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Retry
                    </Button>
                  )}
                  {scan.status === 'RUNNING' && (
                    <Button variant="outline" size="sm" disabled>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Running...
                    </Button>
                  )}
                  <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
