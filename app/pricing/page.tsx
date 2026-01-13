import { getUser } from '@/lib/auth'
import { PricingPageClient } from './pricing-client'

export default async function PricingPage() {
  const authResult = await getUser()

  return (
    <PricingPageClient
      isAuthenticated={!!authResult?.user}
      currentTier={authResult?.profile?.subscription_tier || 'free'}
    />
  )
}
