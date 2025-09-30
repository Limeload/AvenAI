import Stripe from 'stripe'

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set')
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-12-18.acacia',
  typescript: true,
})

export const STRIPE_CONFIG = {
  prices: {
    PRO: process.env.STRIPE_PRO_PRICE_ID || 'price_pro_monthly',
    TEAM: process.env.STRIPE_TEAM_PRICE_ID || 'price_team_monthly',
  },
  webhook_secret: process.env.STRIPE_WEBHOOK_SECRET || '',
}

export const PLAN_DETAILS = {
  FREE: {
    name: 'Free',
    price: 0,
    scans: 10,
    features: [
      'Mock scans only',
      'Basic recommendations',
      'Community support',
      'Email notifications'
    ]
  },
  PRO: {
    name: 'Pro',
    price: 29,
    scans: 10,
    features: [
      '10 real cloud scans/month',
      'AWS, GCP, Azure support',
      'Terraform code generation',
      'Priority email support',
      'Scan history & analytics'
    ]
  },
  TEAM: {
    name: 'Team',
    price: 99,
    scans: 1000,
    features: [
      'Unlimited cloud scans',
      'Multi-cloud dashboard',
      'Slack integration',
      'Team collaboration',
      'Priority support',
      'Custom integrations'
    ]
  }
}

export async function createCheckoutSession(
  customerId: string,
  priceId: string,
  successUrl: string,
  cancelUrl: string
) {
  try {
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: successUrl,
      cancel_url: cancelUrl,
      allow_promotion_codes: true,
    })

    return session
  } catch (error) {
    console.error('Error creating checkout session:', error)
    throw error
  }
}

export async function createCustomerPortalSession(customerId: string, returnUrl: string) {
  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    })

    return session
  } catch (error) {
    console.error('Error creating customer portal session:', error)
    throw error
  }
}

export async function getSubscription(subscriptionId: string) {
  try {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId)
    return subscription
  } catch (error) {
    console.error('Error retrieving subscription:', error)
    throw error
  }
}

export async function cancelSubscription(subscriptionId: string) {
  try {
    const subscription = await stripe.subscriptions.cancel(subscriptionId)
    return subscription
  } catch (error) {
    console.error('Error canceling subscription:', error)
    throw error
  }
}

export async function updateSubscription(subscriptionId: string, newPriceId: string) {
  try {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId)
    
    const updatedSubscription = await stripe.subscriptions.update(subscriptionId, {
      items: [
        {
          id: subscription.items.data[0].id,
          price: newPriceId,
        },
      ],
      proration_behavior: 'create_prorations',
    })

    return updatedSubscription
  } catch (error) {
    console.error('Error updating subscription:', error)
    throw error
  }
}

export function getPlanFromPriceId(priceId: string): 'FREE' | 'PRO' | 'TEAM' {
  if (priceId === STRIPE_CONFIG.prices.PRO) return 'PRO'
  if (priceId === STRIPE_CONFIG.prices.TEAM) return 'TEAM'
  return 'FREE'
}

export function getPriceIdFromPlan(plan: 'FREE' | 'PRO' | 'TEAM'): string | null {
  switch (plan) {
    case 'PRO':
      return STRIPE_CONFIG.prices.PRO
    case 'TEAM':
      return STRIPE_CONFIG.prices.TEAM
    default:
      return null
  }
}
