'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Play, X } from 'lucide-react'
import { ImageCompareSlider } from '@/components/ui/image-compare-slider'

export function Hero() {
  const [isVideoOpen, setIsVideoOpen] = useState(false)

  return (
    <section className="relative overflow-hidden hero-bg-studio grain-overlay">
      <div className="container relative mx-auto px-4 py-24 md:py-32 lg:py-40">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <div className="animate-fade-up delay-1">
            <span className="badge-studio">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)] animate-pulse" />
              Virtual Staging
            </span>
          </div>

          {/* Headline */}
          <h1 className="mt-8 text-5xl md:text-6xl lg:text-7xl font-semibold tracking-tight animate-fade-up delay-2">
            <span className="text-[var(--surface-light)]">See the potential.</span>
          </h1>

          {/* Subheadline */}
          <p className="mt-6 text-lg md:text-xl text-[var(--text-secondary)] max-w-2xl mx-auto leading-relaxed animate-fade-up delay-3">
            Transform empty spaces into photorealistic renders in seconds.
            <br className="hidden md:block" />
            No designers. No waiting. Just results.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10 animate-fade-up delay-4">
            <Button
              asChild
              size="lg"
              className="btn-accent gap-2 text-base h-12 px-8 rounded-xl glow-accent"
            >
              <Link href="/signup">
                Start Creating
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="btn-ghost gap-2 h-12 px-8 rounded-xl"
              onClick={() => setIsVideoOpen(true)}
            >
              <Play className="h-5 w-5" />
              Watch Demo
            </Button>
          </div>

          {/* Trust indicators */}
          <div className="flex flex-wrap items-center justify-center gap-8 mt-10 text-sm text-[var(--text-muted)] animate-fade-up delay-5">
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-[var(--success)]" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-[var(--success)]" />
              <span>30-second renders</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-[var(--success)]" />
              <span>5 free daily</span>
            </div>
          </div>
        </div>

        {/* Before/After Slider */}
        <div className="mt-20 mx-auto max-w-5xl animate-scale-up delay-6">
          <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
            {/* Accent glow behind */}
            <div className="absolute -inset-1 bg-[var(--accent)]/10 blur-2xl rounded-3xl" />

            <div className="relative bg-[var(--bg-elevated)] p-2 rounded-2xl">
              <ImageCompareSlider
                beforeImage="https://images.unsplash.com/photo-1598928636135-d146006ff4be?w=1200&q=80"
                afterImage="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1200&q=80"
                beforeLabel="Empty"
                afterLabel="Staged"
                className="rounded-xl overflow-hidden aspect-[16/10]"
              />
            </div>
          </div>

          {/* Caption */}
          <p className="mt-4 text-center text-sm text-[var(--text-muted)] animate-fade-in delay-8">
            Drag the slider to see the transformation
          </p>
        </div>
      </div>

      {/* Video Modal */}
      {isVideoOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 animate-fade-in"
          onClick={() => setIsVideoOpen(false)}
        >
          <div
            className="relative max-w-4xl w-full aspect-video bg-[var(--bg-elevated)] rounded-2xl flex items-center justify-center border border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center">
              <Play className="h-16 w-16 mx-auto mb-4 text-[var(--text-muted)]" />
              <p className="text-[var(--text-muted)]">Demo video coming soon</p>
            </div>
            <button
              className="absolute top-4 right-4 p-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-white/5 transition-colors"
              onClick={() => setIsVideoOpen(false)}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
    </section>
  )
}
