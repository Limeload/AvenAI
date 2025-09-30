import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import mockInfraData from "@/data/mockInfra.json"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { cloudProvider } = body

    if (!cloudProvider || !['AWS', 'GCP', 'Azure'].includes(cloudProvider)) {
      return NextResponse.json({ error: "Invalid cloud provider" }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Check user's plan limits
    const scanCount = await prisma.scan.count({
      where: { 
        userId: user.id,
        createdAt: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) // This month
        }
      }
    })

    const maxScans = user.role === 'FREE' ? 10 : user.role === 'PRO' ? 50 : 1000
    
    if (scanCount >= maxScans) {
      return NextResponse.json({ 
        error: "Scan limit reached for your plan",
        limit: maxScans,
        used: scanCount
      }, { status: 403 })
    }

    // Get mock data for the specified provider
    const mockData = mockInfraData[cloudProvider.toLowerCase() as keyof typeof mockInfraData]
    
    if (!mockData) {
      return NextResponse.json({ error: "Mock data not available for this provider" }, { status: 400 })
    }

    // Create new scan
    const scan = await prisma.scan.create({
      data: {
        userId: user.id,
        cloudProvider,
        status: 'PENDING'
      }
    })

    // Simulate scan completion after 2 seconds
    setTimeout(async () => {
      try {
        await prisma.scan.update({
          where: { id: scan.id },
          data: {
            status: 'RUNNING'
          }
        })

        // Simulate scan completion after 5 seconds
        setTimeout(async () => {
          try {
            await prisma.scan.update({
              where: { id: scan.id },
              data: {
                status: 'COMPLETED',
                summary: `Mock scan completed for ${cloudProvider}. Found 5 optimization opportunities across 3 services.`,
                infraData: mockData,
                completedAt: new Date()
              }
            })

            // Create mock issues based on the infrastructure data
            const mockIssues = [
              {
                scanId: scan.id,
                title: "Over-provisioned EC2 Instance",
                description: `Instance ${mockData.resources.ec2_instances?.[0]?.id || 'i-1234567890abcdef0'} is using a larger instance type than needed based on current usage patterns.`,
                severity: 'MEDIUM',
                category: 'Cost'
              },
              {
                scanId: scan.id,
                title: "Public S3 Bucket",
                description: `Bucket '${mockData.resources.s3_buckets?.find(b => b.public_read)?.name || 'my-public-assets'}' is publicly accessible, which may pose security risks.`,
                severity: 'HIGH',
                category: 'Security'
              },
              {
                scanId: scan.id,
                title: "Stopped EC2 Instance",
                description: `Instance ${mockData.resources.ec2_instances?.find(i => i.state === 'stopped')?.id || 'i-abcdef1234567890'} has been stopped for 30+ days and may be incurring storage costs.`,
                severity: 'LOW',
                category: 'Cost'
              },
              {
                scanId: scan.id,
                title: "Missing Backup Configuration",
                description: "Some RDS instances don't have automated backups enabled, which could lead to data loss.",
                severity: 'MEDIUM',
                category: 'Best Practice'
              },
              {
                scanId: scan.id,
                title: "Overly Permissive IAM Policy",
                description: "User 'admin-user' has AdministratorAccess, which violates the principle of least privilege.",
                severity: 'HIGH',
                category: 'Security'
              }
            ]

            for (const issue of mockIssues) {
              await prisma.issue.create({
                data: issue
              })
            }

            // Create mock recommendations
            const mockRecommendations = [
              {
                scanId: scan.id,
                title: "Right-size EC2 Instance",
                description: "Consider downgrading the instance type to match actual usage patterns and save costs.",
                priority: 'MEDIUM',
                category: 'Cost'
              },
              {
                scanId: scan.id,
                title: "Secure S3 Bucket",
                description: "Remove public access and implement proper IAM policies for controlled access.",
                priority: 'HIGH',
                category: 'Security'
              },
              {
                scanId: scan.id,
                title: "Terminate Unused Instance",
                description: "Terminate the stopped instance to avoid unnecessary storage costs.",
                priority: 'LOW',
                category: 'Cost'
              },
              {
                scanId: scan.id,
                title: "Enable Automated Backups",
                description: "Configure automated backups for all RDS instances to ensure data protection.",
                priority: 'MEDIUM',
                category: 'Best Practice'
              },
              {
                scanId: scan.id,
                title: "Implement Least Privilege Access",
                description: "Review and reduce IAM permissions to follow the principle of least privilege.",
                priority: 'HIGH',
                category: 'Security'
              }
            ]

            for (const recommendation of mockRecommendations) {
              await prisma.recommendation.create({
                data: recommendation
              })
            }
          } catch (error) {
            console.error("Error completing mock scan:", error)
            await prisma.scan.update({
              where: { id: scan.id },
              data: { status: 'FAILED' }
            })
          }
        }, 5000)
      } catch (error) {
        console.error("Error starting mock scan:", error)
        await prisma.scan.update({
          where: { id: scan.id },
          data: { status: 'FAILED' }
        })
      }
    }, 2000)

    return NextResponse.json({ 
      scan,
      message: "Mock scan started successfully"
    })
  } catch (error) {
    console.error("Error creating mock scan:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
