import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { createCustomerPortalSession } from "@/lib/stripe"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
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

    const activeSubscription = user.subscriptions[0]
    if (!activeSubscription?.stripeCustomerId) {
      return NextResponse.json({ 
        error: "No active subscription found" 
      }, { status: 404 })
    }

    // Create customer portal session
    const portalSession = await createCustomerPortalSession(
      activeSubscription.stripeCustomerId,
      `${process.env.NEXTAUTH_URL}/dashboard/settings`
    )

    return NextResponse.json({ 
      url: portalSession.url 
    })

  } catch (error) {
    console.error("Customer portal error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
