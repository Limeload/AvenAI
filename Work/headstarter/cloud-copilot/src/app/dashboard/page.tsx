"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Cloud, Plus, Play, History, Settings, Zap, Shield, DollarSign } from "lucide-react"
import Link from "next/link"
import ScanButton from "@/components/ScanButton"
import HistoryList from "@/components/HistoryList"
import BillingCard from "@/components/BillingCard"

interface User {
  id: string
  name: string
  email: string
  role: 'FREE' | 'PRO' | 'TEAM'
  stats?: {
    monthlyScans: number
    maxScans: number
    scansRemaining: number
  }
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [scans, setScans] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
    }
  }, [status, router])

  useEffect(() => {
    if (session) {
      fetchUserData()
      fetchScans()
    }
  }, [session])

  const fetchUserData = async () => {
    try {
      const response = await fetch('/api/user')
      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
      }
    } catch (error) {
      console.error('Error fetching user data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchScans = async () => {
    try {
      const response = await fetch('/api/scans')
      if (response.ok) {
        const data = await response.json()
        setScans(data.scans)
      }
    } catch (error) {
      console.error('Error fetching scans:', error)
    }
  }

  const handleScanComplete = (scanId: string) => {
    // Refresh scans list
    fetchScans()
    // Navigate to scan results
    router.push(`/dashboard/scans/${scanId}`)
  }

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="max-w-7xl mx-auto">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome back, {session.user?.name?.split(' ')[0] || 'there'}!
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Ready to optimize your cloud infrastructure? Connect your cloud providers and start scanning.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <Cloud className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Connected Clouds</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">0</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                  <Zap className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Scans Completed</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">0</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                  <Shield className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Issues Found</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">0</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                  <DollarSign className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Potential Savings</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">$0</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cloud Scanning */}
          <div className="lg:col-span-2">
            <div className="space-y-6">
              <ScanButton 
                cloudProvider="AWS" 
                onScanComplete={handleScanComplete}
                disabled={user?.role === 'FREE'}
              />
              <ScanButton 
                cloudProvider="GCP" 
                onScanComplete={handleScanComplete}
                disabled={user?.role === 'FREE'}
              />
              <ScanButton 
                cloudProvider="Azure" 
                onScanComplete={handleScanComplete}
                disabled={user?.role === 'FREE'}
              />
            </div>

            {/* Recent Scans */}
            <div className="mt-6">
              <HistoryList 
                scans={scans} 
                onRefresh={fetchScans}
                isLoading={isLoading}
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Billing Card */}
            {user && (
              <BillingCard 
                user={user} 
                stats={{
                  monthlyScans: user.stats?.monthlyScans || 0,
                  maxScans: user.stats?.maxScans || 10,
                  scansRemaining: user.stats?.scansRemaining || 10
                }}
              />
            )}

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  className="w-full" 
                  onClick={() => router.push('/dashboard/scans')}
                >
                  <History className="h-4 w-4 mr-2" />
                  View All Scans
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => router.push('/dashboard/settings')}
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Account Settings
                </Button>
              </CardContent>
            </Card>

            {/* Getting Started */}
            <Card>
              <CardHeader>
                <CardTitle>Getting Started</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start space-x-2">
                    <div className="w-5 h-5 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-blue-600 text-xs font-bold">1</span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300">
                      Choose a cloud provider to scan
                    </p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-5 h-5 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-gray-600 text-xs font-bold">2</span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300">
                      Run your first infrastructure scan
                    </p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-5 h-5 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-gray-600 text-xs font-bold">3</span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300">
                      Review AI recommendations and apply fixes
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
    </div>
  )
}
