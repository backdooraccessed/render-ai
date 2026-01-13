'use client'

import { Label } from '@/components/ui/label'

interface PromptInputProps {
  value: string
  onChange: (value: string) => void
  disabled?: boolean
}

const EXAMPLE_PROMPTS = [
  "Add modern minimalist furniture",
  "Make the room brighter with natural light",
  "Change the floor to hardwood",
  "Add indoor plants and greenery",
  "Paint the walls white",
]

export function PromptInput({ value, onChange, disabled }: PromptInputProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="prompt-input">Describe your changes</Label>
      <textarea
        id="prompt-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        placeholder="e.g., Add a modern sofa and coffee table, make the lighting warmer..."
        className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
      />
      <div className="space-y-1.5">
        <p className="text-xs text-muted-foreground">Examples:</p>
        <div className="flex flex-wrap gap-1.5">
          {EXAMPLE_PROMPTS.map((prompt) => (
            <button
              key={prompt}
              type="button"
              onClick={() => onChange(prompt)}
              disabled={disabled}
              className="text-xs px-2 py-1 rounded-full bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
