'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { Check, Sparkles, PartyPopper } from 'lucide-react'

interface SuccessAnimationProps {
  show: boolean
  type?: 'check' | 'confetti' | 'sparkle'
  onComplete?: () => void
  className?: string
}

export function SuccessAnimation({
  show,
  type = 'check',
  onComplete,
  className,
}: SuccessAnimationProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (show) {
      setIsVisible(true)
      const timer = setTimeout(() => {
        setIsVisible(false)
        onComplete?.()
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [show, onComplete])

  if (!isVisible) return null

  if (type === 'confetti') {
    return <ConfettiAnimation className={className} />
  }

  if (type === 'sparkle') {
    return (
      <div className={cn('animate-scale-pop', className)}>
        <Sparkles className="h-8 w-8 text-yellow-500" />
      </div>
    )
  }

  return (
    <div
      className={cn(
        'w-16 h-16 rounded-full bg-green-500 flex items-center justify-center animate-scale-pop',
        className
      )}
    >
      <Check className="h-8 w-8 text-white animate-check-draw" />
    </div>
  )
}

function ConfettiAnimation({ className }: { className?: string }) {
  const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8']
  const confettiCount = 30

  return (
    <div className={cn('fixed inset-0 pointer-events-none z-50', className)}>
      {Array.from({ length: confettiCount }).map((_, i) => (
        <div
          key={i}
          className="absolute w-3 h-3 rounded-sm"
          style={{
            backgroundColor: colors[i % colors.length],
            left: `${Math.random() * 100}%`,
            top: '-10px',
            animation: `confettiFall ${1.5 + Math.random() * 1}s ease-out forwards`,
            animationDelay: `${Math.random() * 0.5}s`,
            transform: `rotate(${Math.random() * 360}deg)`,
          }}
        />
      ))}
    </div>
  )
}

interface FirstGenerationCelebrationProps {
  show: boolean
  onClose: () => void
}

export function FirstGenerationCelebration({
  show,
  onClose,
}: FirstGenerationCelebrationProps) {
  if (!show) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-fade-in-up">
      <ConfettiAnimation />
      <div className="bg-background rounded-xl p-8 max-w-md mx-4 text-center shadow-2xl animate-scale-pop">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <PartyPopper className="h-10 w-10 text-primary" />
        </div>
        <h2 className="text-2xl font-bold mb-2">You did it!</h2>
        <p className="text-muted-foreground mb-6">
          Your first AI render is complete. Welcome to the future of interior design!
        </p>
        <div className="space-y-3">
          <button
            onClick={onClose}
            className="w-full bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium btn-press"
          >
            Continue Creating
          </button>
          <button
            onClick={onClose}
            className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  )
}
