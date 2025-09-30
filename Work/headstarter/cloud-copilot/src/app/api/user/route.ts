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
          select: {
            id: true,
            status: true,
            createdAt: true,
            cloudProvider: true
          }
        },
        subscriptions: {
          where: { status: 'ACTIVE' },
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      }
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Calculate stats
    const totalScans = user.scans.length
    const completedScans = user.scans.filter(s => s.status === 'COMPLETED').length
    const runningScans = user.scans.filter(s => s.status === 'RUNNING').length
    const failedScans = user.scans.filter(s => s.status === 'FAILED').length

    // Get current month scan count
    const currentMonth = new Date()
    currentMonth.setDate(1)
    currentMonth.setHours(0, 0, 0, 0)

    const monthlyScans = await prisma.scan.count({
      where: {
        userId: user.id,
        createdAt: {
          gte: currentMonth
        }
      }
    })

    // Get plan limits
    const planLimits = {
      FREE: 10,
      PRO: 50,
      TEAM: 1000
    }

    const maxScans = planLimits[user.role] || 10

    const userStats = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      stats: {
        totalScans,
        completedScans,
        runningScans,
        failedScans,
        monthlyScans,
        maxScans,
        scansRemaining: Math.max(0, maxScans - monthlyScans)
      },
      subscription: user.subscriptions[0] || null
    }

    return NextResponse.json({ user: userStats })
  } catch (error) {
    console.error("Error fetching user:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { name, notifications } = body

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Update user profile
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        name: name || user.name,
        // Note: notifications would need a separate table in a real implementation
      }
    })

    return NextResponse.json({ user: updatedUser })
  } catch (error) {
    console.error("Error updating user:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
