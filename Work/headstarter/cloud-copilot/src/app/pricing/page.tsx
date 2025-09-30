import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { CheckCircle, ArrowRight } from "lucide-react"

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-gray-900 dark:text-white">CloudCopilot</span>
          </Link>
          <div className="flex items-center space-x-4">
            <Link href="/auth/signin">
              <Button>Get Started</Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Pricing Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Start free and scale as your cloud infrastructure grows. All plans include our core features.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Free Plan */}
          <Card>
            <CardHeader>
              <CardTitle>Free</CardTitle>
              <CardDescription>Perfect for getting started</CardDescription>
              <div className="text-4xl font-bold">$0<span className="text-lg font-normal text-gray-500">/month</span></div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                  Mock infrastructure scans
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                  Basic AI recommendations
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                  Community support
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                  Email notifications
                </li>
              </ul>
              <Link href="/auth/signin">
                <Button className="w-full" variant="outline">
                  Get Started Free
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Pro Plan */}
          <Card className="border-blue-500 relative scale-105">
            <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-600">
              Most Popular
            </Badge>
            <CardHeader>
              <CardTitle>Pro</CardTitle>
              <CardDescription>For individual developers</CardDescription>
              <div className="text-4xl font-bold">$29<span className="text-lg font-normal text-gray-500">/month</span></div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                  10 real cloud scans/month
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                  AWS, GCP, Azure support
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                  Terraform code generation
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                  Priority email support
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                  Scan history & analytics
                </li>
              </ul>
              <Link href="/auth/signin">
                <Button className="w-full">
                  Start Pro Trial
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Team Plan */}
          <Card>
            <CardHeader>
              <CardTitle>Team</CardTitle>
              <CardDescription>For growing teams</CardDescription>
              <div className="text-4xl font-bold">$99<span className="text-lg font-normal text-gray-500">/month</span></div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                  Unlimited cloud scans
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                  Multi-cloud dashboard
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                  Slack integration
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                  Team collaboration
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                  Priority support
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                  Custom integrations
                </li>
              </ul>
              <Link href="/auth/signin">
                <Button className="w-full" variant="outline">
                  Contact Sales
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* FAQ Section */}
        <div className="mt-20 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                What cloud providers do you support?
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                We support AWS, Google Cloud Platform (GCP), and Microsoft Azure. You can connect multiple accounts from different providers.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                How secure is my cloud data?
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                We use read-only permissions and never store your actual infrastructure data. All connections are encrypted and follow security best practices.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Can I cancel anytime?
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Yes, you can cancel your subscription at any time. You'll continue to have access to paid features until the end of your billing period.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Do you offer custom enterprise plans?
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Yes, we offer custom enterprise plans with additional features like SSO, custom integrations, and dedicated support. Contact us for more information.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
