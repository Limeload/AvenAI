import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { createCheckoutSession, getPriceIdFromPlan } from "@/lib/stripe"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { plan } = body

    if (!plan || !['PRO', 'TEAM'].includes(plan)) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 })
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

    // Check if user already has an active subscription
    if (user.subscriptions.length > 0) {
      return NextResponse.json({ 
        error: "User already has an active subscription" 
      }, { status: 400 })
    }

    const priceId = getPriceIdFromPlan(plan)
    if (!priceId) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 })
    }

    // Create or get Stripe customer
    let stripeCustomerId = user.subscriptions[0]?.stripeCustomerId

    if (!stripeCustomerId) {
      // Create new Stripe customer
      const { stripe } = await import('@/lib/stripe')
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name || undefined,
        metadata: {
          userId: user.id,
        },
      })
      stripeCustomerId = customer.id

      // Update user with Stripe customer ID
      await prisma.subscription.create({
        data: {
          userId: user.id,
          stripeCustomerId: stripeCustomerId,
          status: 'INACTIVE',
          plan: 'FREE'
        }
      })
    }

    // Create checkout session
    const checkoutSession = await createCheckoutSession(
      stripeCustomerId,
      priceId,
      `${process.env.NEXTAUTH_URL}/dashboard?success=true`,
      `${process.env.NEXTAUTH_URL}/dashboard?canceled=true`
    )

    return NextResponse.json({ 
      sessionId: checkoutSession.id,
      url: checkoutSession.url 
    })

  } catch (error) {
    console.error("Checkout session error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
