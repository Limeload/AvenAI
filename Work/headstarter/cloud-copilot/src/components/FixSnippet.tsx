"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Copy, 
  Check, 
  Code, 
  Download, 
  ExternalLink,
  AlertCircle,
  Info
} from "lucide-react"

interface FixSnippetProps {
  recommendation: {
    id: string
    title: string
    description: string
    priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
    category: string
    terraform?: string
  }
  onGenerateTerraform?: (recommendationId: string) => Promise<void>
  isLoading?: boolean
}

export default function FixSnippet({ recommendation, onGenerateTerraform, isLoading }: FixSnippetProps) {
  const [copied, setCopied] = useState(false)
  const [showFullCode, setShowFullCode] = useState(false)

  const handleCopy = async () => {
    if (recommendation.terraform) {
      await navigator.clipboard.writeText(recommendation.terraform)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleGenerateTerraform = async () => {
    if (onGenerateTerraform) {
      await onGenerateTerraform(recommendation.id)
    }
  }

  const getPriorityBadge = (priority: string) => {
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

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'security':
        return <AlertCircle className="h-4 w-4 text-red-600" />
      case 'cost':
        return <span className="text-green-600 font-bold">$</span>
      case 'performance':
        return <span className="text-blue-600 font-bold">⚡</span>
      default:
        return <Info className="h-4 w-4 text-gray-600" />
    }
  }

  const formatTerraformCode = (code: string) => {
    // Simple syntax highlighting for Terraform
    return code
      .replace(/(resource\s+["\w-]+"\s+["\w-]+)/g, '<span class="text-blue-600 font-semibold">$1</span>')
      .replace(/(provider\s+["\w-]+)/g, '<span class="text-purple-600 font-semibold">$1</span>')
      .replace(/(variable\s+["\w-]+)/g, '<span class="text-green-600 font-semibold">$1</span>')
      .replace(/(output\s+["\w-]+)/g, '<span class="text-orange-600 font-semibold">$1</span>')
      .replace(/(["\w-]+)\s*=/g, '<span class="text-gray-700 dark:text-gray-300">$1</span> =')
      .replace(/(#.*$)/gm, '<span class="text-gray-500 italic">$1</span>')
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              {getCategoryIcon(recommendation.category)}
              <CardTitle className="text-lg">{recommendation.title}</CardTitle>
              {getPriorityBadge(recommendation.priority)}
            </div>
            <CardDescription className="text-base">
              {recommendation.description}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {!recommendation.terraform ? (
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <div className="flex items-start space-x-2">
                <Code className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-900 dark:text-blue-200">Terraform Code Available</h4>
                  <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                    Generate production-ready Terraform code to implement this recommendation.
                  </p>
                </div>
              </div>
            </div>
            
            <Button 
              onClick={handleGenerateTerraform}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Generating Terraform Code...
                </>
              ) : (
                <>
                  <Code className="h-4 w-4 mr-2" />
                  Generate Terraform Code
                </>
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-gray-900 dark:text-white">Terraform Configuration</h4>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopy}
                  disabled={copied}
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFullCode(!showFullCode)}
                >
                  {showFullCode ? 'Show Less' : 'Show More'}
                </Button>
              </div>
            </div>

            <div className="relative">
              <div className="bg-gray-900 dark:bg-gray-800 rounded-lg p-4 overflow-x-auto">
                <pre className="text-sm text-gray-100 whitespace-pre-wrap">
                  <code 
                    dangerouslySetInnerHTML={{ 
                      __html: showFullCode 
                        ? formatTerraformCode(recommendation.terraform) 
                        : formatTerraformCode(recommendation.terraform.split('\n').slice(0, 20).join('\n') + (recommendation.terraform.split('\n').length > 20 ? '\n...' : ''))
                    }} 
                  />
                </pre>
              </div>
              
              {!showFullCode && recommendation.terraform.split('\n').length > 20 && (
                <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-gray-900 to-transparent rounded-b-lg"></div>
              )}
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-300">
                <span className="flex items-center">
                  <Code className="h-4 w-4 mr-1" />
                  {recommendation.terraform.split('\n').length} lines
                </span>
                <span className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                  Production Ready
                </span>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
                <Button variant="outline" size="sm">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open in Terraform Cloud
                </Button>
              </div>
            </div>

            <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <div className="flex items-start space-x-2">
                <Info className="h-4 w-4 text-yellow-600 mt-0.5" />
                <div className="text-sm text-yellow-800 dark:text-yellow-200">
                  <strong>Implementation Notes:</strong>
                  <ul className="mt-1 list-disc list-inside space-y-1">
                    <li>Review and customize variables before applying</li>
                    <li>Test in a development environment first</li>
                    <li>Ensure you have the necessary permissions</li>
                    <li>Consider the impact on existing resources</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
