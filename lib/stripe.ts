import Stripe from 'stripe'

if (!process.env.STRIPE_SECRET_KEY) {
  console.warn('STRIPE_SECRET_KEY not set - Stripe features will be unavailable')
}

export const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-12-15.clover',
      typescript: true,
    })
  : null

export function isStripeConfigured(): boolean {
  return !!process.env.STRIPE_SECRET_KEY
}

export const STRIPE_PRO_PRICE_ID = process.env.STRIPE_PRO_PRICE_ID

/**
 * Create a Stripe checkout session for Pro subscription
 */
export async function createCheckoutSession(params: {
  userId: string
  email: string
  customerId?: string
  successUrl: string
  cancelUrl: string
}): Promise<string | null> {
  if (!stripe || !STRIPE_PRO_PRICE_ID) {
    console.error('Stripe not configured')
    return null
  }

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [
      {
        price: STRIPE_PRO_PRICE_ID,
        quantity: 1,
      },
    ],
    success_url: params.successUrl,
    cancel_url: params.cancelUrl,
    customer: params.customerId || undefined,
    customer_email: params.customerId ? undefined : params.email,
    metadata: {
      userId: params.userId,
    },
    subscription_data: {
      metadata: {
        userId: params.userId,
      },
    },
  })

  return session.url
}

/**
 * Create a billing portal session for subscription management
 */
export async function createBillingPortalSession(params: {
  customerId: string
  returnUrl: string
}): Promise<string | null> {
  if (!stripe) {
    console.error('Stripe not configured')
    return null
  }

  const session = await stripe.billingPortal.sessions.create({
    customer: params.customerId,
    return_url: params.returnUrl,
  })

  return session.url
}

/**
 * Construct Stripe webhook event from payload
 */
export function constructWebhookEvent(
  payload: Buffer,
  signature: string,
  webhookSecret: string
): Stripe.Event | null {
  if (!stripe) return null

  try {
    return stripe.webhooks.constructEvent(payload, signature, webhookSecret)
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return null
  }
}
