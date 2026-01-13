'use client'

import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { Sparkles, Upload, Cpu, ImageIcon, Check } from 'lucide-react'

interface GenerationProgressProps {
  isGenerating: boolean
  onCancel?: () => void
}

const steps = [
  { id: 'upload', label: 'Uploading', icon: Upload },
  { id: 'process', label: 'Processing', icon: Cpu },
  { id: 'render', label: 'Rendering', icon: Sparkles },
  { id: 'finalize', label: 'Finalizing', icon: ImageIcon },
]

export function GenerationProgress({ isGenerating, onCancel }: GenerationProgressProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (!isGenerating) {
      setCurrentStep(0)
      setProgress(0)
      return
    }

    // Simulate progress through steps
    const stepDurations = [2000, 5000, 15000, 3000] // ms per step
    const totalDuration = stepDurations.reduce((a, b) => a + b, 0)
    let elapsed = 0

    const interval = setInterval(() => {
      elapsed += 100

      // Calculate overall progress
      const overallProgress = Math.min((elapsed / totalDuration) * 100, 95)
      setProgress(overallProgress)

      // Determine current step
      let accumulatedTime = 0
      for (let i = 0; i < stepDurations.length; i++) {
        accumulatedTime += stepDurations[i]
        if (elapsed < accumulatedTime) {
          setCurrentStep(i)
          break
        }
      }
    }, 100)

    return () => clearInterval(interval)
  }, [isGenerating])

  if (!isGenerating) return null

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Progress bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Generating your render...</span>
          <span className="font-medium">{Math.round(progress)}%</span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-300 ease-out animate-progress-pulse"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Steps indicator */}
      <div className="flex justify-between">
        {steps.map((step, index) => {
          const Icon = step.icon
          const isComplete = index < currentStep
          const isCurrent = index === currentStep
          const isPending = index > currentStep

          return (
            <div
              key={step.id}
              className={cn(
                'flex flex-col items-center gap-2 flex-1',
                isPending && 'opacity-40'
              )}
            >
              <div
                className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300',
                  isComplete && 'bg-primary text-primary-foreground',
                  isCurrent && 'bg-primary/20 text-primary ring-2 ring-primary ring-offset-2',
                  isPending && 'bg-muted text-muted-foreground'
                )}
              >
                {isComplete ? (
                  <Check className="h-5 w-5 animate-scale-pop" />
                ) : (
                  <Icon className={cn('h-5 w-5', isCurrent && 'animate-pulse')} />
                )}
              </div>
              <span
                className={cn(
                  'text-xs font-medium text-center',
                  isCurrent && 'text-primary',
                  isPending && 'text-muted-foreground'
                )}
              >
                {step.label}
              </span>
            </div>
          )
        })}
      </div>

      {/* Estimated time */}
      <p className="text-center text-sm text-muted-foreground">
        Estimated time: {progress < 30 ? '20-25' : progress < 60 ? '15-20' : progress < 80 ? '10-15' : '5-10'} seconds
      </p>

      {/* Cancel button */}
      {onCancel && (
        <button
          onClick={onCancel}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors mx-auto block"
        >
          Cancel generation
        </button>
      )}
    </div>
  )
}
