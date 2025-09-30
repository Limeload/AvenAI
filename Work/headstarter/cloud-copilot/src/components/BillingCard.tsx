"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  CreditCard, 
  Calendar, 
  Users, 
  Zap, 
  CheckCircle,
  AlertTriangle,
  ExternalLink,
  Settings
} from "lucide-react"

interface BillingCardProps {
  user: {
    role: 'FREE' | 'PRO' | 'TEAM'
    subscription?: {
      status: 'ACTIVE' | 'INACTIVE' | 'CANCELED' | 'PAST_DUE'
      plan: 'FREE' | 'PRO' | 'TEAM'
      currentPeriodEnd?: string
      stripeCustomerId?: string
    }
  }
  stats: {
    monthlyScans: number
    maxScans: number
    scansRemaining: number
  }
}

export default function BillingCard({ user, stats }: BillingCardProps) {
  const [isLoading, setIsLoading] = useState(false)

  const getPlanDetails = (plan: string) => {
    switch (plan) {
      case 'PRO':
        return {
          name: 'Pro',
          price: '$29',
          period: 'month',
          features: [
            '10 real cloud scans/month',
            'AWS, GCP, Azure support',
            'Terraform code generation',
            'Priority email support',
            'Scan history & analytics'
          ],
          limits: {
            scans: 10,
            users: 1
          }
        }
      case 'TEAM':
        return {
          name: 'Team',
          price: '$99',
          period: 'month',
          features: [
            'Unlimited cloud scans',
            'Multi-cloud dashboard',
            'Slack integration',
            'Team collaboration',
            'Priority support',
            'Custom integrations'
          ],
          limits: {
            scans: 1000,
            users: 10
          }
        }
      default:
        return {
          name: 'Free',
          price: '$0',
          period: 'month',
          features: [
            'Mock scans only',
            'Basic recommendations',
            'Community support',
            'Email notifications'
          ],
          limits: {
            scans: 10,
            users: 1
          }
        }
    }
  }

  const planDetails = getPlanDetails(user.role)

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'ACTIVE':
        return <Badge variant="default" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Active</Badge>
      case 'PAST_DUE':
        return <Badge variant="destructive">Past Due</Badge>
      case 'CANCELED':
        return <Badge variant="secondary">Canceled</Badge>
      default:
        return <Badge variant="secondary">Inactive</Badge>
    }
  }

  const handleUpgrade = async (newPlan: string) => {
    setIsLoading(true)
    try {
      // TODO: Implement Stripe checkout
      console.log(`Upgrading to ${newPlan} plan`)
    } catch (error) {
      console.error('Upgrade error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleManageBilling = () => {
    // TODO: Implement Stripe customer portal
    console.log('Opening billing management')
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString()
  }

  const getUsageColor = (used: number, max: number) => {
    const percentage = (used / max) * 100
    if (percentage >= 90) return 'text-red-600'
    if (percentage >= 75) return 'text-yellow-600'
    return 'text-green-600'
  }

  return (
    <div className="space-y-6">
      {/* Current Plan */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <CreditCard className="h-5 w-5 mr-2" />
                Current Plan
              </CardTitle>
              <CardDescription>
                Your current subscription and usage
              </CardDescription>
            </div>
            {getStatusBadge(user.subscription?.status)}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                {planDetails.price}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                {planDetails.period}
              </div>
              <div className="text-lg font-medium text-gray-900 dark:text-white mt-2">
                {planDetails.name} Plan
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-300">Scans Used</span>
                <span className={getUsageColor(stats.monthlyScans, stats.maxScans)}>
                  {stats.monthlyScans} / {stats.maxScans}
                </span>
              </div>
              <Progress 
                value={(stats.monthlyScans / stats.maxScans) * 100} 
                className="h-2" 
              />
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {stats.scansRemaining} scans remaining this month
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="text-sm text-gray-600 dark:text-gray-300">
                {user.subscription?.currentPeriodEnd && (
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    Renews: {formatDate(user.subscription.currentPeriodEnd)}
                  </div>
                )}
              </div>
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleManageBilling}
                  className="flex-1"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Manage
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Plan Features */}
      <Card>
        <CardHeader>
          <CardTitle>Plan Features</CardTitle>
          <CardDescription>
            What's included in your {planDetails.name} plan
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {planDetails.features.map((feature, index) => (
              <div key={index} className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  {feature}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Usage Alerts */}
      {stats.monthlyScans >= stats.maxScans * 0.9 && (
        <Card className="border-yellow-200 dark:border-yellow-800">
          <CardContent className="p-4">
            <div className="flex items-start space-x-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-yellow-900 dark:text-yellow-200">
                  Scan Limit Warning
                </h4>
                <p className="text-sm text-yellow-800 dark:text-yellow-300 mt-1">
                  You've used {Math.round((stats.monthlyScans / stats.maxScans) * 100)}% of your monthly scans. 
                  {stats.scansRemaining > 0 
                    ? ` You have ${stats.scansRemaining} scans remaining.`
                    : ' Consider upgrading to continue scanning.'
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upgrade Options */}
      {user.role === 'FREE' && (
        <Card>
          <CardHeader>
            <CardTitle>Upgrade Your Plan</CardTitle>
            <CardDescription>
              Get more scans and advanced features
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="text-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Pro</h3>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">$29<span className="text-sm font-normal text-gray-500">/month</span></div>
                </div>
                <ul className="space-y-2 mb-4">
                  <li className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                    10 real scans/month
                  </li>
                  <li className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                    Terraform code generation
                  </li>
                  <li className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                    Priority support
                  </li>
                </ul>
                <Button 
                  className="w-full" 
                  onClick={() => handleUpgrade('PRO')}
                  disabled={isLoading}
                >
                  Upgrade to Pro
                </Button>
              </div>
              
              <div className="p-4 border border-blue-200 dark:border-blue-800 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                <div className="text-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Team</h3>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">$99<span className="text-sm font-normal text-gray-500">/month</span></div>
                </div>
                <ul className="space-y-2 mb-4">
                  <li className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                    Unlimited scans
                  </li>
                  <li className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                    Slack integration
                  </li>
                  <li className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                    Team collaboration
                  </li>
                </ul>
                <Button 
                  className="w-full" 
                  onClick={() => handleUpgrade('TEAM')}
                  disabled={isLoading}
                >
                  Upgrade to Team
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Billing History */}
      <Card>
        <CardHeader>
          <CardTitle>Billing History</CardTitle>
          <CardDescription>
            Your recent billing activity
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No billing history</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              {user.role === 'FREE' 
                ? "You're on the free plan. Upgrade to see billing history."
                : "Your billing history will appear here after your first payment."
              }
            </p>
            {user.role === 'FREE' && (
              <Button onClick={() => handleUpgrade('PRO')}>
                View Upgrade Options
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
