'use client'

import { Button } from '@/components/ui/button'
import { Sparkles, Loader2 } from 'lucide-react'

interface GenerateButtonProps {
  onClick: () => void
  disabled?: boolean
  isLoading?: boolean
  credits?: {
    remaining: number
    isPro: boolean
  } | null
}

export function GenerateButton({ onClick, disabled, isLoading, credits }: GenerateButtonProps) {
  const showCredits = credits && !credits.isPro && credits.remaining < Infinity

  return (
    <div className="space-y-2">
      <Button
        onClick={onClick}
        disabled={disabled || isLoading || (credits?.remaining === 0)}
        className="w-full h-12 text-base font-medium"
        size="lg"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <Sparkles className="mr-2 h-5 w-5" />
            Generate Render
          </>
        )}
      </Button>
      {showCredits && (
        <p className="text-center text-sm text-muted-foreground">
          {credits.remaining === 0
            ? 'No generations remaining today'
            : `${credits.remaining} generation${credits.remaining !== 1 ? 's' : ''} remaining today`}
        </p>
      )}
      {credits?.isPro && (
        <p className="text-center text-sm text-primary">
          <Sparkles className="inline h-3 w-3 mr-1" />
          Pro - Unlimited generations
        </p>
      )}
    </div>
  )
}
