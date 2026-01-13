import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

export function CTA() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight mb-4">
            Ready to Transform Your Space?
          </h2>
          <p className="text-muted-foreground mb-8">
            Start creating stunning interior renders in seconds. No design skills required.
          </p>
          <Button asChild size="lg" className="gap-2">
            <Link href="/app">
              Get Started Free
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
