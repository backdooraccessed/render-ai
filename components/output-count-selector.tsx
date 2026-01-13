'use client'

import { cn } from '@/lib/utils'
import { Label } from '@/components/ui/label'

interface OutputCountSelectorProps {
  value: number
  onChange: (count: number) => void
  disabled?: boolean
}

const OUTPUT_OPTIONS = [1, 2, 3, 4] as const

export function OutputCountSelector({ value, onChange, disabled }: OutputCountSelectorProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label>Number of Variations</Label>
        <span className="text-xs text-muted-foreground">
          {value === 1 ? 'Single output' : `${value} variations`}
        </span>
      </div>
      <div className="flex gap-2">
        {OUTPUT_OPTIONS.map((count) => (
          <button
            key={count}
            type="button"
            onClick={() => onChange(count)}
            disabled={disabled}
            className={cn(
              "flex-1 py-2 px-3 rounded-md border text-sm font-medium transition-all",
              value === count
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-background hover:bg-muted border-input",
              disabled && "opacity-50 cursor-not-allowed"
            )}
          >
            {count}
          </button>
        ))}
      </div>
      <p className="text-xs text-muted-foreground">
        Generate multiple variations to compare different results
      </p>
    </div>
  )
}
