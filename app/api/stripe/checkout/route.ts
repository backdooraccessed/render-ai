import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createCheckoutSession, isStripeConfigured } from '@/lib/stripe'

export async function POST() {
  try {
    if (!isStripeConfigured()) {
      return NextResponse.json(
        { success: false, error: 'Stripe not configured' },
        { status: 500 }
      )
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      )
    }

    // Get user's profile for existing Stripe customer ID
    const { data: profile } = await supabase
      .from('profiles')
      .select('stripe_customer_id')
      .eq('id', user.id)
      .single()

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

    const checkoutUrl = await createCheckoutSession({
      userId: user.id,
      email: user.email!,
      customerId: profile?.stripe_customer_id || undefined,
      successUrl: `${baseUrl}/app?upgrade=success`,
      cancelUrl: `${baseUrl}/pricing?upgrade=canceled`,
    })

    if (!checkoutUrl) {
      return NextResponse.json(
        { success: false, error: 'Failed to create checkout session' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      url: checkoutUrl,
    })
  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}
