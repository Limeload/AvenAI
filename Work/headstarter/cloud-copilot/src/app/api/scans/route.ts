import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        scans: {
          orderBy: { createdAt: 'desc' },
          include: {
            issues: true,
            recommendations: true
          }
        }
      }
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({ scans: user.scans })
  } catch (error) {
    console.error("Error fetching scans:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

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

    // Create new scan
    const scan = await prisma.scan.create({
      data: {
        userId: user.id,
        cloudProvider,
        status: 'PENDING'
      }
    })

    // TODO: Trigger actual cloud scan in background
    // For now, simulate a scan
    setTimeout(async () => {
      try {
        await prisma.scan.update({
          where: { id: scan.id },
          data: {
            status: 'RUNNING'
          }
        })

        // Simulate scan completion after 30 seconds
        setTimeout(async () => {
          try {
            await prisma.scan.update({
              where: { id: scan.id },
              data: {
                status: 'COMPLETED',
                summary: `Found 5 optimization opportunities across 2 services in ${cloudProvider}`,
                infraData: {
                  services: ['EC2', 'S3'],
                  resources: 12,
                  estimatedCost: 450
                }
              }
            })

            // Create mock issues
            await prisma.issue.createMany({
              data: [
                {
                  scanId: scan.id,
                  title: "Unused EC2 Instance",
                  description: "Instance i-1234567890abcdef0 has been running for 30+ days without activity",
                  severity: 'MEDIUM',
                  category: 'Cost'
                },
                {
                  scanId: scan.id,
                  title: "Public S3 Bucket",
                  description: "Bucket 'my-public-bucket' is publicly accessible",
                  severity: 'HIGH',
                  category: 'Security'
                },
                {
                  scanId: scan.id,
                  title: "Over-provisioned RDS Instance",
                  description: "RDS instance is using only 20% of allocated resources",
                  severity: 'LOW',
                  category: 'Performance'
                }
              ]
            })

            // Create mock recommendations
            await prisma.recommendation.createMany({
              data: [
                {
                  scanId: scan.id,
                  title: "Terminate Unused Instance",
                  description: "Terminate the unused EC2 instance to save $45/month",
                  priority: 'MEDIUM',
                  category: 'Cost',
                  terraform: `resource "aws_instance" "example" {
  # Terminate unused instance
  instance_type = "t3.micro"
  # ... other configuration
}`
                },
                {
                  scanId: scan.id,
                  title: "Secure S3 Bucket",
                  description: "Remove public access and implement proper IAM policies",
                  priority: 'HIGH',
                  category: 'Security',
                  terraform: `resource "aws_s3_bucket" "example" {
  bucket = "my-secure-bucket"
}

resource "aws_s3_bucket_public_access_block" "example" {
  bucket = aws_s3_bucket.example.id
  
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}`
                }
              ]
            })
          } catch (error) {
            console.error("Error completing scan:", error)
            await prisma.scan.update({
              where: { id: scan.id },
              data: { status: 'FAILED' }
            })
          }
        }, 30000)
      } catch (error) {
        console.error("Error starting scan:", error)
        await prisma.scan.update({
          where: { id: scan.id },
          data: { status: 'FAILED' }
        })
      }
    }, 1000)

    return NextResponse.json({ scan })
  } catch (error) {
    console.error("Error creating scan:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
