import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export interface Profile {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  subscription_tier: 'free' | 'pro'
  stripe_customer_id: string | null
  stripe_subscription_id: string | null
  subscription_status: 'active' | 'past_due' | 'canceled'
  generations_today: number
  generations_reset_at: string
  created_at: string
  updated_at: string
}

/**
 * Get the current authenticated user and their profile
 * Returns null if not authenticated
 */
export async function getUser() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return {
    user,
    profile: profile as Profile | null,
  }
}

/**
 * Require authentication - redirects to login if not authenticated
 * Use in Server Components
 */
export async function requireAuth() {
  const result = await getUser()

  if (!result?.user) {
    redirect('/login')
  }

  return result
}

/**
 * Check if user can generate (has remaining credits)
 */
export async function checkGenerationLimit(userId: string): Promise<{
  allowed: boolean
  remaining: number
  isPro: boolean
}> {
  const supabase = await createClient()

  const { data: profile } = await supabase
    .from('profiles')
    .select('subscription_tier, subscription_status, generations_today, generations_reset_at')
    .eq('id', userId)
    .single()

  if (!profile) {
    return { allowed: false, remaining: 0, isPro: false }
  }

  // Pro users with active subscription: unlimited
  if (
    profile.subscription_tier === 'pro' &&
    profile.subscription_status === 'active'
  ) {
    return { allowed: true, remaining: Infinity, isPro: true }
  }

  // Free users: 5/day
  const FREE_LIMIT = 5
  const now = new Date()
  const resetAt = new Date(profile.generations_reset_at)

  // Check if counter needs reset (new day in UTC)
  if (now.toUTCString().slice(0, 16) !== resetAt.toUTCString().slice(0, 16)) {
    // New day, reset counter
    await supabase
      .from('profiles')
      .update({
        generations_today: 0,
        generations_reset_at: now.toISOString(),
      })
      .eq('id', userId)

    return { allowed: true, remaining: FREE_LIMIT, isPro: false }
  }

  const remaining = FREE_LIMIT - profile.generations_today
  return {
    allowed: remaining > 0,
    remaining: Math.max(0, remaining),
    isPro: false,
  }
}

/**
 * Increment generation count after successful generation
 */
export async function incrementGenerationCount(userId: string): Promise<void> {
  const supabase = await createClient()

  // Use the database function for atomic increment
  await supabase.rpc('increment_generation_count', { user_uuid: userId })
}

/**
 * Get profile by Stripe customer ID
 */
export async function getProfileByStripeCustomerId(
  customerId: string
): Promise<Profile | null> {
  const supabase = await createClient()

  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('stripe_customer_id', customerId)
    .single()

  return data as Profile | null
}

/**
 * Update profile subscription info
 */
export async function updateSubscription(
  userId: string,
  data: {
    subscription_tier?: 'free' | 'pro'
    stripe_customer_id?: string
    stripe_subscription_id?: string | null
    subscription_status?: 'active' | 'past_due' | 'canceled'
  }
): Promise<void> {
  const supabase = await createClient()

  await supabase
    .from('profiles')
    .update({
      ...data,
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId)
}
