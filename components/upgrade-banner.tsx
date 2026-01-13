'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Sparkles, X } from 'lucide-react'
import { useState } from 'react'

interface UpgradeBannerProps {
  remaining: number
  onDismiss?: () => void
}

export function UpgradeBanner({ remaining, onDismiss }: UpgradeBannerProps) {
  const [dismissed, setDismissed] = useState(false)

  if (dismissed) return null

  const handleDismiss = () => {
    setDismissed(true)
    onDismiss?.()
  }

  const isUrgent = remaining <= 1
  const message = remaining === 0
    ? "You've used all your free generations today"
    : remaining === 1
    ? "Only 1 generation left today"
    : `${remaining} generations remaining today`

  return (
    <div className={`
      relative rounded-lg p-4 mb-4
      ${isUrgent
        ? 'bg-orange-500/10 border border-orange-500/20'
        : 'bg-primary/5 border border-primary/10'
      }
    `}>
      <button
        onClick={handleDismiss}
        className="absolute top-2 right-2 p-1 hover:bg-background/50 rounded"
      >
        <X className="h-4 w-4 text-muted-foreground" />
      </button>

      <div className="flex items-start gap-3">
        <div className={`
          p-2 rounded-full shrink-0
          ${isUrgent ? 'bg-orange-500/20' : 'bg-primary/10'}
        `}>
          <Sparkles className={`h-5 w-5 ${isUrgent ? 'text-orange-500' : 'text-primary'}`} />
        </div>

        <div className="flex-1 min-w-0">
          <p className={`font-medium ${isUrgent ? 'text-orange-500' : 'text-foreground'}`}>
            {message}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Upgrade to Pro for unlimited generations, priority processing, and more.
          </p>

          <div className="mt-3">
            <Button size="sm" asChild>
              <Link href="/pricing">
                <Sparkles className="mr-2 h-4 w-4" />
                Upgrade to Pro - $10/month
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
