'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import Link from 'next/link'
import { PricingCard } from '@/components/pricing-card'
import { Button } from '@/components/ui/button'
import { Sparkles, ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'

interface PricingPageClientProps {
  isAuthenticated: boolean
  currentTier: 'free' | 'pro'
}

export function PricingPageClient({ isAuthenticated, currentTier }: PricingPageClientProps) {
  const searchParams = useSearchParams()

  useEffect(() => {
    if (searchParams.get('upgrade') === 'canceled') {
      toast.info('Checkout was canceled')
    }
  }, [searchParams])

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <span className="font-semibold text-lg">RenderAI</span>
          </Link>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/app">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to App
            </Link>
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16 max-w-5xl">
        {/* Hero */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Start free with 5 generations per day. Upgrade to Pro for unlimited access.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          <PricingCard
            name="Free"
            price="$0"
            description="Perfect for trying out RenderAI"
            features={[
              '5 generations per day',
              'All design styles',
              'Before/after comparison',
              'Download in JPG, PNG, WebP',
              'Share to social media',
              'Public gallery access',
            ]}
            isCurrentPlan={currentTier === 'free'}
            isPro={false}
            isAuthenticated={isAuthenticated}
          />
          <PricingCard
            name="Pro"
            price="$10"
            description="For professionals and power users"
            features={[
              'Unlimited generations',
              'Priority processing',
              '2x and 4x upscaling',
              'Inpainting / partial editing',
              'Reference image styling',
              'Batch processing',
              'Priority support',
            ]}
            isCurrentPlan={currentTier === 'pro'}
            isPro={true}
            isAuthenticated={isAuthenticated}
          />
        </div>

        {/* FAQ */}
        <div className="mt-16 max-w-2xl mx-auto">
          <h2 className="text-2xl font-semibold text-center mb-8">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-medium mb-2">How does the free tier work?</h3>
              <p className="text-sm text-muted-foreground">
                Free users get 5 generations per day, which resets at midnight UTC.
                All core features are available, including style presets and social sharing.
              </p>
            </div>
            <div>
              <h3 className="font-medium mb-2">Can I cancel my subscription?</h3>
              <p className="text-sm text-muted-foreground">
                Yes, you can cancel anytime from your account settings. You&apos;ll keep
                Pro access until the end of your billing period.
              </p>
            </div>
            <div>
              <h3 className="font-medium mb-2">What payment methods do you accept?</h3>
              <p className="text-sm text-muted-foreground">
                We accept all major credit and debit cards through Stripe, including
                Visa, Mastercard, and American Express.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
