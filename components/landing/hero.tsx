'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Play, Sparkles, CheckCircle2 } from 'lucide-react'
import { ImageCompareSlider } from '@/components/ui/image-compare-slider'

export function Hero() {
  const [isVideoOpen, setIsVideoOpen] = useState(false)

  return (
    <section className="relative overflow-hidden hero-gradient-bg">
      {/* Decorative elements */}
      <div className="absolute top-0 left-1/4 w-72 h-72 bg-gradient-to-r from-pink-500/20 to-violet-500/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-r from-violet-500/20 to-teal-500/20 rounded-full blur-3xl" />

      <div className="container relative mx-auto px-4 py-20 md:py-32">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-gradient-brand px-4 py-1.5 text-sm text-white shadow-lg">
            <Sparkles className="h-4 w-4" />
            <span className="font-medium">AI-Powered Virtual Staging</span>
          </div>

          {/* Headline */}
          <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-6xl lg:text-7xl">
            <span className="text-gradient-brand">AI Staging</span>
            <br />
            <span className="text-foreground">in Seconds</span>
          </h1>

          {/* Subheadline */}
          <p className="mb-8 text-lg text-muted-foreground md:text-xl max-w-2xl mx-auto">
            Transform empty rooms into beautifully staged renders instantly.
            No designers, no waiting, no hassle.
          </p>

          {/* CTAs */}
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row mb-8">
            <Button
              asChild
              size="lg"
              className="btn-gradient glow-gradient gap-2 text-lg h-12 px-8 rounded-xl"
            >
              <Link href="/signup">
                Try Free
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="gap-2 h-12 px-8 rounded-xl"
              onClick={() => setIsVideoOpen(true)}
            >
              <Play className="h-5 w-5" />
              Watch Demo
            </Button>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-teal-500" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-teal-500" />
              <span>30-second renders</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-teal-500" />
              <span>5 free renders daily</span>
            </div>
          </div>
        </div>

        {/* Before/After Slider */}
        <div className="mt-16 mx-auto max-w-4xl">
          <div className="relative rounded-2xl border bg-card/50 backdrop-blur p-3 shadow-2xl glass-card">
            <ImageCompareSlider
              beforeImage="https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80"
              afterImage="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80"
              beforeLabel="Empty Room"
              afterLabel="AI Staged"
              className="rounded-xl overflow-hidden"
            />
          </div>

          {/* Caption */}
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Drag the slider to see the transformation
          </p>
        </div>
      </div>

      {/* Video Modal - simplified placeholder */}
      {isVideoOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setIsVideoOpen(false)}
        >
          <div className="relative max-w-4xl w-full aspect-video bg-card rounded-xl flex items-center justify-center">
            <div className="text-center">
              <Play className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">Demo video coming soon</p>
            </div>
            <button
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
              onClick={() => setIsVideoOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </section>
  )
}
