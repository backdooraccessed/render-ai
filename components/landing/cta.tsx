'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

export function CTA() {
  return (
    <section className="py-24 md:py-32 bg-[var(--bg-secondary)] relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[var(--accent)]/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative">
        <div className="max-w-3xl mx-auto text-center">
          {/* Headline */}
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-[var(--surface-light)] animate-fade-up">
            Ready to transform your listings?
          </h2>

          <p className="mt-6 text-lg text-[var(--text-secondary)] max-w-xl mx-auto animate-fade-up delay-1">
            Join thousands of real estate professionals using AI to create stunning property visuals. No credit card required.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10 animate-fade-up delay-2">
            <Button
              asChild
              size="lg"
              className="btn-accent gap-2 text-base h-12 px-8 rounded-xl glow-accent"
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
              className="btn-ghost h-12 px-8 rounded-xl"
            >
              <Link href="#pricing">View Pricing</Link>
            </Button>
          </div>

          <p className="mt-8 text-sm text-[var(--text-muted)] animate-fade-up delay-3">
            No credit card required · 5 free renders daily
          </p>
        </div>
      </div>
    </section>
  )
}
