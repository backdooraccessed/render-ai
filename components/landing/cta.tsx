'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Sparkles } from 'lucide-react'

export function CTA() {
  return (
    <section className="py-20 md:py-28 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-brand opacity-[0.03]" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-pink-500/20 to-violet-500/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-r from-violet-500/20 to-teal-500/20 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-gradient-brand px-4 py-1.5 text-sm text-white mb-6">
            <Sparkles className="h-4 w-4" />
            <span className="font-medium">Start transforming spaces today</span>
          </div>

          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">
            Ready to Transform{' '}
            <span className="text-gradient-brand">Your Listings?</span>
          </h2>

          <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
            Join thousands of real estate professionals using AI to create stunning property visuals. No credit card required to get started.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              asChild
              size="lg"
              className="btn-gradient glow-gradient gap-2 text-lg h-12 px-8 rounded-xl"
            >
              <Link href="/signup">
                Get Started Free
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="h-12 px-8 rounded-xl"
            >
              <Link href="#pricing">View Pricing</Link>
            </Button>
          </div>

          <p className="mt-6 text-sm text-muted-foreground">
            No credit card required. 5 free renders daily.
          </p>
        </div>
      </div>
    </section>
  )
}
