"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  AlertTriangle, 
  CheckCircle, 
  DollarSign, 
  Shield, 
  Zap,
  TrendingUp,
  TrendingDown
} from "lucide-react"

interface SummaryCardProps {
  scanData: {
    summary: string
    issues: Array<{
      id: string
      title: string
      severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
      category: string
    }>
    recommendations: Array<{
      id: string
      title: string
      priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
      category: string
    }>
    overall_score?: {
      cost_optimization: number
      security: number
      performance: number
      best_practices: number
    }
  }
}

export default function SummaryCard({ scanData }: SummaryCardProps) {
  const { summary, issues, recommendations, overall_score } = scanData

  const getSeverityCount = (severity: string) => {
    return issues.filter(issue => issue.severity === severity).length
  }

  const getPriorityCount = (priority: string) => {
    return recommendations.filter(rec => rec.priority === priority).length
  }

  const getCategoryCount = (category: string) => {
    return issues.filter(issue => issue.category === category).length
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreIcon = (score: number) => {
    if (score >= 80) return <TrendingUp className="h-4 w-4 text-green-600" />
    if (score >= 60) return <TrendingUp className="h-4 w-4 text-yellow-600" />
    return <TrendingDown className="h-4 w-4 text-red-600" />
  }

  return (
    <div className="space-y-6">
      {/* Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
            Scan Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            {summary}
          </p>
        </CardContent>
      </Card>

      {/* Overall Scores */}
      {overall_score && (
        <Card>
          <CardHeader>
            <CardTitle>Infrastructure Health Scores</CardTitle>
            <CardDescription>
              Overall assessment of your cloud infrastructure
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  {getScoreIcon(overall_score.cost_optimization)}
                </div>
                <div className={`text-2xl font-bold ${getScoreColor(overall_score.cost_optimization)}`}>
                  {overall_score.cost_optimization}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Cost Optimization</div>
                <Progress value={overall_score.cost_optimization} className="h-2 mt-2" />
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  {getScoreIcon(overall_score.security)}
                </div>
                <div className={`text-2xl font-bold ${getScoreColor(overall_score.security)}`}>
                  {overall_score.security}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Security</div>
                <Progress value={overall_score.security} className="h-2 mt-2" />
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  {getScoreIcon(overall_score.performance)}
                </div>
                <div className={`text-2xl font-bold ${getScoreColor(overall_score.performance)}`}>
                  {overall_score.performance}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Performance</div>
                <Progress value={overall_score.performance} className="h-2 mt-2" />
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  {getScoreIcon(overall_score.best_practices)}
                </div>
                <div className={`text-2xl font-bold ${getScoreColor(overall_score.best_practices)}`}>
                  {overall_score.best_practices}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Best Practices</div>
                <Progress value={overall_score.best_practices} className="h-2 mt-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Issues Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2 text-yellow-600" />
            Issues Found
          </CardTitle>
          <CardDescription>
            {issues.length} issues identified in your infrastructure
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {getSeverityCount('CRITICAL')}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Critical</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {getSeverityCount('HIGH')}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">High</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {getSeverityCount('MEDIUM')}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Medium</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {getSeverityCount('LOW')}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Low</div>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium text-gray-900 dark:text-white">Issues by Category</h4>
            <div className="flex flex-wrap gap-2">
              {['Security', 'Cost', 'Performance', 'Best Practice'].map(category => {
                const count = getCategoryCount(category)
                if (count === 0) return null
                
                return (
                  <Badge key={category} variant="outline" className="flex items-center space-x-1">
                    <span>{category}</span>
                    <span className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full px-1.5 py-0.5 text-xs">
                      {count}
                    </span>
                  </Badge>
                )
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recommendations Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Zap className="h-5 w-5 mr-2 text-blue-600" />
            Recommendations
          </CardTitle>
          <CardDescription>
            {recommendations.length} recommendations to improve your infrastructure
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {getPriorityCount('URGENT')}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Urgent</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {getPriorityCount('HIGH')}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">High</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {getPriorityCount('MEDIUM')}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Medium</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {getPriorityCount('LOW')}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Low</div>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium text-gray-900 dark:text-white">Recommendations by Category</h4>
            <div className="flex flex-wrap gap-2">
              {['Security', 'Cost', 'Performance', 'Best Practice'].map(category => {
                const count = recommendations.filter(rec => rec.category === category).length
                if (count === 0) return null
                
                return (
                  <Badge key={category} variant="outline" className="flex items-center space-x-1">
                    <span>{category}</span>
                    <span className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full px-1.5 py-0.5 text-xs">
                      {count}
                    </span>
                  </Badge>
                )
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common next steps after reviewing your scan results
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <Shield className="h-8 w-8 text-red-600 mx-auto mb-2" />
              <h3 className="font-medium text-gray-900 dark:text-white mb-1">Security Issues</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {getSeverityCount('CRITICAL') + getSeverityCount('HIGH')} high-priority security issues found
              </p>
            </div>
            
            <div className="text-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <DollarSign className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <h3 className="font-medium text-gray-900 dark:text-white mb-1">Cost Optimization</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {getCategoryCount('Cost')} cost optimization opportunities identified
              </p>
            </div>
            
            <div className="text-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <Zap className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <h3 className="font-medium text-gray-900 dark:text-white mb-1">Performance</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {getCategoryCount('Performance')} performance improvements available
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
