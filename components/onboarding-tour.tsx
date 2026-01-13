'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { X, ChevronRight, ChevronLeft, Upload, Palette, MessageSquare, Sparkles, Download } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useOnboardingComplete } from '@/lib/hooks/use-first-visit'

interface OnboardingStep {
  id: string
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  highlight?: string // CSS selector to highlight
}

const steps: OnboardingStep[] = [
  {
    id: 'upload',
    title: 'Upload Your Image',
    description: 'Start by uploading a photo of your room. You can drag and drop or paste a URL.',
    icon: Upload,
  },
  {
    id: 'style',
    title: 'Choose a Style',
    description: 'Pick from 10 curated design styles, or describe your own vision.',
    icon: Palette,
  },
  {
    id: 'prompt',
    title: 'Describe Your Vision',
    description: 'Tell the AI what changes you want. Be specific for best results!',
    icon: MessageSquare,
  },
  {
    id: 'generate',
    title: 'Generate Your Render',
    description: 'Click Generate and watch the AI transform your space in seconds.',
    icon: Sparkles,
  },
  {
    id: 'download',
    title: 'Download & Share',
    description: 'Save your renders in multiple formats or share them with the world.',
    icon: Download,
  },
]

interface OnboardingTourProps {
  forceShow?: boolean
  onComplete?: () => void
}

export function OnboardingTour({ forceShow = false, onComplete }: OnboardingTourProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const { isComplete, markComplete } = useOnboardingComplete()

  useEffect(() => {
    if (forceShow || !isComplete()) {
      // Small delay for better UX
      const timer = setTimeout(() => setIsVisible(true), 500)
      return () => clearTimeout(timer)
    }
  }, [forceShow, isComplete])

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      handleComplete()
    }
  }

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSkip = () => {
    handleComplete()
  }

  const handleComplete = () => {
    markComplete()
    setIsVisible(false)
    onComplete?.()
  }

  if (!isVisible) return null

  const step = steps[currentStep]
  const Icon = step.icon
  const isLastStep = currentStep === steps.length - 1

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 animate-fade-in-up">
      <div className="bg-background rounded-2xl p-6 max-w-md mx-4 shadow-2xl animate-scale-pop">
        {/* Close button */}
        <button
          onClick={handleSkip}
          className="absolute top-4 right-4 p-1 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Step indicator */}
        <div className="flex justify-center gap-1.5 mb-6">
          {steps.map((_, index) => (
            <div
              key={index}
              className={cn(
                'h-1.5 rounded-full transition-all duration-300',
                index === currentStep ? 'w-6 bg-primary' : 'w-1.5 bg-muted'
              )}
            />
          ))}
        </div>

        {/* Icon */}
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <Icon className="h-8 w-8 text-primary" />
        </div>

        {/* Content */}
        <div className="text-center mb-6">
          <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
          <p className="text-muted-foreground">{step.description}</p>
        </div>

        {/* Step counter */}
        <p className="text-center text-sm text-muted-foreground mb-4">
          Step {currentStep + 1} of {steps.length}
        </p>

        {/* Navigation */}
        <div className="flex gap-3">
          {currentStep > 0 && (
            <Button
              variant="outline"
              onClick={handlePrev}
              className="flex-1"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
          )}
          <Button
            onClick={handleNext}
            className={cn('flex-1', currentStep === 0 && 'w-full')}
          >
            {isLastStep ? (
              'Get Started'
            ) : (
              <>
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </>
            )}
          </Button>
        </div>

        {/* Skip link */}
        <button
          onClick={handleSkip}
          className="mt-4 text-sm text-muted-foreground hover:text-foreground transition-colors mx-auto block"
        >
          Skip tour
        </button>
      </div>
    </div>
  )
}
