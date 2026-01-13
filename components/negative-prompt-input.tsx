'use client'

import { useState } from 'react'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { ChevronDown, ChevronUp } from 'lucide-react'

interface NegativePromptInputProps {
  value: string
  onChange: (value: string) => void
  disabled?: boolean
}

const COMMON_NEGATIVE_PROMPTS = [
  "blurry",
  "low quality",
  "distorted",
  "watermark",
  "text",
  "people",
  "furniture",
  "plants",
  "dark",
  "cluttered",
]

export function NegativePromptInput({ value, onChange, disabled }: NegativePromptInputProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const togglePrompt = (prompt: string) => {
    const currentPrompts = value.split(',').map(p => p.trim()).filter(Boolean)
    const promptIndex = currentPrompts.findIndex(p => p.toLowerCase() === prompt.toLowerCase())

    if (promptIndex >= 0) {
      currentPrompts.splice(promptIndex, 1)
    } else {
      currentPrompts.push(prompt)
    }

    onChange(currentPrompts.join(', '))
  }

  const isPromptSelected = (prompt: string) => {
    const currentPrompts = value.split(',').map(p => p.trim().toLowerCase())
    return currentPrompts.includes(prompt.toLowerCase())
  }

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between w-full text-left"
        disabled={disabled}
      >
        <Label className="cursor-pointer">
          Negative Prompt
          <span className="text-muted-foreground font-normal ml-1">(optional)</span>
        </Label>
        {isExpanded ? (
          <ChevronUp className="h-4 w-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        )}
      </button>

      {isExpanded && (
        <div className="space-y-3 animate-in slide-in-from-top-2 duration-200">
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            placeholder="e.g., blurry, low quality, distorted, watermark..."
            className="flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
          />
          <div className="space-y-1.5">
            <p className="text-xs text-muted-foreground">Quick add:</p>
            <div className="flex flex-wrap gap-1.5">
              {COMMON_NEGATIVE_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => togglePrompt(prompt)}
                  disabled={disabled}
                  className={cn(
                    "text-xs px-2 py-1 rounded-full transition-colors disabled:opacity-50",
                    isPromptSelected(prompt)
                      ? "bg-destructive/10 text-destructive border border-destructive/30"
                      : "bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground"
                  )}
                >
                  {isPromptSelected(prompt) ? '✕ ' : ''}{prompt}
                </button>
              ))}
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Describe what you don&apos;t want to see in the generated image
          </p>
        </div>
      )}
    </div>
  )
}
