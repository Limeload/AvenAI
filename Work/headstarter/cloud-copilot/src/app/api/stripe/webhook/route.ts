import { NextRequest, NextResponse } from "next/server"
import { headers } from "next/headers"
import { stripe, STRIPE_CONFIG } from "@/lib/stripe"
import { prisma } from "@/lib/prisma"
import { getPlanFromPriceId } from "@/lib/stripe"

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = headers().get('stripe-signature')

    if (!signature) {
      return NextResponse.json({ error: "No signature" }, { status: 400 })
    }

    let event: any

    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        STRIPE_CONFIG.webhook_secret
      )
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message)
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
    }

    console.log('Received webhook event:', event.type)

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object
        await handleCheckoutSessionCompleted(session)
        break
      }

      case 'customer.subscription.created': {
        const subscription = event.data.object
        await handleSubscriptionCreated(subscription)
        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object
        await handleSubscriptionUpdated(subscription)
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object
        await handleSubscriptionDeleted(subscription)
        break
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object
        await handlePaymentSucceeded(invoice)
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object
        await handlePaymentFailed(invoice)
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: "Webhook error" }, { status: 500 })
  }
}

async function handleCheckoutSessionCompleted(session: any) {
  try {
    const customerId = session.customer
    const subscriptionId = session.subscription

    if (!customerId || !subscriptionId) {
      console.error('Missing customer or subscription ID in checkout session')
      return
    }

    // Get the subscription details
    const subscription = await stripe.subscriptions.retrieve(subscriptionId)
    const priceId = subscription.items.data[0].price.id
    const plan = getPlanFromPriceId(priceId)

    // Find user by Stripe customer ID
    const userSubscription = await prisma.subscription.findFirst({
      where: { stripeCustomerId: customerId },
      include: { user: true }
    })

    if (!userSubscription) {
      console.error('User subscription not found for customer:', customerId)
      return
    }

    // Update subscription
    await prisma.subscription.update({
      where: { id: userSubscription.id },
      data: {
        stripeSubscriptionId: subscriptionId,
        stripePriceId: priceId,
        status: 'ACTIVE',
        plan: plan,
        stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000)
      }
    })

    // Update user role
    await prisma.user.update({
      where: { id: userSubscription.userId },
      data: { role: plan }
    })

    console.log(`Subscription activated for user ${userSubscription.userId}`)
  } catch (error) {
    console.error('Error handling checkout session completed:', error)
  }
}

async function handleSubscriptionCreated(subscription: any) {
  try {
    const customerId = subscription.customer
    const subscriptionId = subscription.id
    const priceId = subscription.items.data[0].price.id
    const plan = getPlanFromPriceId(priceId)

    // Find user by Stripe customer ID
    const userSubscription = await prisma.subscription.findFirst({
      where: { stripeCustomerId: customerId },
      include: { user: true }
    })

    if (!userSubscription) {
      console.error('User subscription not found for customer:', customerId)
      return
    }

    // Update subscription
    await prisma.subscription.update({
      where: { id: userSubscription.id },
      data: {
        stripeSubscriptionId: subscriptionId,
        stripePriceId: priceId,
        status: 'ACTIVE',
        plan: plan,
        stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000)
      }
    })

    // Update user role
    await prisma.user.update({
      where: { id: userSubscription.userId },
      data: { role: plan }
    })

    console.log(`Subscription created for user ${userSubscription.userId}`)
  } catch (error) {
    console.error('Error handling subscription created:', error)
  }
}

async function handleSubscriptionUpdated(subscription: any) {
  try {
    const subscriptionId = subscription.id
    const priceId = subscription.items.data[0].price.id
    const plan = getPlanFromPriceId(priceId)
    const status = subscription.status === 'active' ? 'ACTIVE' : 'INACTIVE'

    // Find subscription in database
    const userSubscription = await prisma.subscription.findFirst({
      where: { stripeSubscriptionId: subscriptionId },
      include: { user: true }
    })

    if (!userSubscription) {
      console.error('User subscription not found for subscription:', subscriptionId)
      return
    }

    // Update subscription
    await prisma.subscription.update({
      where: { id: userSubscription.id },
      data: {
        stripePriceId: priceId,
        status: status,
        plan: plan,
        stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000)
      }
    })

    // Update user role
    await prisma.user.update({
      where: { id: userSubscription.userId },
      data: { role: plan }
    })

    console.log(`Subscription updated for user ${userSubscription.userId}`)
  } catch (error) {
    console.error('Error handling subscription updated:', error)
  }
}

async function handleSubscriptionDeleted(subscription: any) {
  try {
    const subscriptionId = subscription.id

    // Find subscription in database
    const userSubscription = await prisma.subscription.findFirst({
      where: { stripeSubscriptionId: subscriptionId },
      include: { user: true }
    })

    if (!userSubscription) {
      console.error('User subscription not found for subscription:', subscriptionId)
      return
    }

    // Update subscription
    await prisma.subscription.update({
      where: { id: userSubscription.id },
      data: {
        status: 'CANCELED',
        plan: 'FREE'
      }
    })

    // Update user role
    await prisma.user.update({
      where: { id: userSubscription.userId },
      data: { role: 'FREE' }
    })

    console.log(`Subscription canceled for user ${userSubscription.userId}`)
  } catch (error) {
    console.error('Error handling subscription deleted:', error)
  }
}

async function handlePaymentSucceeded(invoice: any) {
  try {
    const subscriptionId = invoice.subscription
    if (!subscriptionId) return

    // Find subscription in database
    const userSubscription = await prisma.subscription.findFirst({
      where: { stripeSubscriptionId: subscriptionId }
    })

    if (!userSubscription) {
      console.error('User subscription not found for subscription:', subscriptionId)
      return
    }

    // Update subscription status
    await prisma.subscription.update({
      where: { id: userSubscription.id },
      data: { status: 'ACTIVE' }
    })

    console.log(`Payment succeeded for subscription ${subscriptionId}`)
  } catch (error) {
    console.error('Error handling payment succeeded:', error)
  }
}

async function handlePaymentFailed(invoice: any) {
  try {
    const subscriptionId = invoice.subscription
    if (!subscriptionId) return

    // Find subscription in database
    const userSubscription = await prisma.subscription.findFirst({
      where: { stripeSubscriptionId: subscriptionId }
    })

    if (!userSubscription) {
      console.error('User subscription not found for subscription:', subscriptionId)
      return
    }

    // Update subscription status
    await prisma.subscription.update({
      where: { id: userSubscription.id },
      data: { status: 'PAST_DUE' }
    })

    console.log(`Payment failed for subscription ${subscriptionId}`)
  } catch (error) {
    console.error('Error handling payment failed:', error)
  }
}
