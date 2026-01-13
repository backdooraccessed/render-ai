'use client'

import { Button } from '@/components/ui/button'
import { Sparkles, Loader2 } from 'lucide-react'

interface GenerateButtonProps {
  onClick: () => void
  disabled?: boolean
  isLoading?: boolean
}

export function GenerateButton({ onClick, disabled, isLoading }: GenerateButtonProps) {
  return (
    <Button
      onClick={onClick}
      disabled={disabled || isLoading}
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
  )
}
