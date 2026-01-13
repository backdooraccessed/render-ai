import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Sparkles } from 'lucide-react'

export function Hero() {
  return (
    <section className="relative overflow-hidden py-20 md:py-32">
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(45%_40%_at_50%_60%,rgba(var(--primary-rgb),0.12),transparent)]" />

      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-muted/50 px-4 py-1.5 text-sm">
            <Sparkles className="h-4 w-4 text-primary" />
            <span>AI-Powered Interior Design</span>
          </div>

          <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-6xl">
            Transform Your Space with{' '}
            <span className="text-primary">AI Rendering</span>
          </h1>

          <p className="mb-8 text-lg text-muted-foreground md:text-xl">
            Upload any room photo and describe your vision. Our AI transforms it into
            a photorealistic interior render in seconds.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button asChild size="lg" className="gap-2">
              <Link href="/app">
                Start Creating
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="#how-it-works">See How It Works</Link>
            </Button>
          </div>
        </div>

        {/* Before/After Preview */}
        <div className="mt-16 mx-auto max-w-4xl">
          <div className="relative rounded-xl border bg-muted/30 p-2 shadow-2xl">
            <div className="grid grid-cols-2 gap-2">
              <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-muted">
                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <p className="text-sm font-medium">Before</p>
                    <p className="text-xs">Original Photo</p>
                  </div>
                </div>
              </div>
              <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-gradient-to-br from-primary/20 to-primary/5">
                <div className="absolute inset-0 flex items-center justify-center text-primary">
                  <div className="text-center">
                    <Sparkles className="h-8 w-8 mx-auto mb-2" />
                    <p className="text-sm font-medium">After</p>
                    <p className="text-xs">AI Rendered</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
