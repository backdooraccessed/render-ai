import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createBillingPortalSession, isStripeConfigured } from '@/lib/stripe'

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

    // Get user's Stripe customer ID
    const { data: profile } = await supabase
      .from('profiles')
      .select('stripe_customer_id')
      .eq('id', user.id)
      .single()

    if (!profile?.stripe_customer_id) {
      return NextResponse.json(
        { success: false, error: 'No active subscription found' },
        { status: 400 }
      )
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

    const portalUrl = await createBillingPortalSession({
      customerId: profile.stripe_customer_id,
      returnUrl: `${baseUrl}/settings`,
    })

    if (!portalUrl) {
      return NextResponse.json(
        { success: false, error: 'Failed to create portal session' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      url: portalUrl,
    })
  } catch (error) {
    console.error('Portal error:', error)
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}
