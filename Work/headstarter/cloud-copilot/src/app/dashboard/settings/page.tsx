"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// Removed unused imports
import { Badge } from "@/components/ui/badge"
import { 
  User, 
  Bell, 
  Shield, 
  CreditCard,
  Trash2,
  Save,
  Key,
  Mail
} from "lucide-react"

export default function SettingsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState({
    name: '',
    email: '',
    notifications: {
      email: true,
      scanComplete: true,
      weeklyReport: false
    }
  })

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
    }
  }, [status, router])

  useEffect(() => {
    if (session) {
      setUser({
        name: session.user?.name || '',
        email: session.user?.email || '',
        notifications: {
          email: true,
          scanComplete: true,
          weeklyReport: false
        }
      })
      setIsLoading(false)
    }
  }, [session])

  if (status === "loading" || isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading settings...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  const handleSave = () => {
    // TODO: Save user settings
    console.log('Saving settings:', user)
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Settings
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="space-y-6">
        {/* Profile Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="h-5 w-5 mr-2" />
              Profile Information
            </CardTitle>
            <CardDescription>
              Update your personal information and account details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={user.name}
                  onChange={(e) => setUser({ ...user, name: e.target.value })}
                  placeholder="Enter your full name"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={user.email}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-gray-50 dark:bg-gray-800 dark:text-gray-400"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Email cannot be changed. Contact support if needed.
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between pt-4">
              <div className="flex items-center space-x-2">
                <Badge variant="secondary">Free Plan</Badge>
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  Upgrade to Pro for more features
                </span>
              </div>
              <Button onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="h-5 w-5 mr-2" />
              Notifications
            </CardTitle>
            <CardDescription>
              Choose how you want to be notified about your scans and account activity
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label htmlFor="email-notifications" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Email Notifications
                  </label>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Receive notifications via email
                  </p>
                </div>
                <input
                  type="checkbox"
                  id="email-notifications"
                  checked={user.notifications.email}
                  onChange={(e) => setUser({
                    ...user,
                    notifications: { ...user.notifications, email: e.target.checked }
                  })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label htmlFor="scan-complete" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Scan Complete
                  </label>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Get notified when scans are completed
                  </p>
                </div>
                <input
                  type="checkbox"
                  id="scan-complete"
                  checked={user.notifications.scanComplete}
                  onChange={(e) => setUser({
                    ...user,
                    notifications: { ...user.notifications, scanComplete: e.target.checked }
                  })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label htmlFor="weekly-report" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Weekly Report
                  </label>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Receive weekly summary reports
                  </p>
                </div>
                <input
                  type="checkbox"
                  id="weekly-report"
                  checked={user.notifications.weeklyReport}
                  onChange={(e) => setUser({
                    ...user,
                    notifications: { ...user.notifications, weeklyReport: e.target.checked }
                  })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="h-5 w-5 mr-2" />
              Security
            </CardTitle>
            <CardDescription>
              Manage your account security and authentication
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                    <Key className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">Two-Factor Authentication</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Add an extra layer of security to your account
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm" disabled>
                  Enable 2FA
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                    <Mail className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">Connected Accounts</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Google and GitHub authentication enabled
                    </p>
                  </div>
                </div>
                <Badge variant="secondary">Active</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Billing Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CreditCard className="h-5 w-5 mr-2" />
              Billing & Subscription
            </CardTitle>
            <CardDescription>
              Manage your subscription and billing information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">Current Plan</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Free plan with limited features
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary">Free</Badge>
                <Button variant="outline" size="sm">
                  Upgrade
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-red-200 dark:border-red-800">
          <CardHeader>
            <CardTitle className="flex items-center text-red-600">
              <Trash2 className="h-5 w-5 mr-2" />
              Danger Zone
            </CardTitle>
            <CardDescription>
              Irreversible and destructive actions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 border border-red-200 dark:border-red-800 rounded-lg bg-red-50 dark:bg-red-900/20">
              <div>
                <h3 className="font-medium text-red-900 dark:text-red-200">Delete Account</h3>
                <p className="text-sm text-red-700 dark:text-red-300">
                  Permanently delete your account and all associated data
                </p>
              </div>
              <Button variant="destructive" size="sm" disabled>
                Delete Account
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
