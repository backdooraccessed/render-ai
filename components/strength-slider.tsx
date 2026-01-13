'use client'

import { Slider } from '@/components/ui/slider'
import { Label } from '@/components/ui/label'
import { Info } from 'lucide-react'

interface StrengthSliderProps {
  value: number
  onChange: (value: number) => void
  disabled?: boolean
}

export function StrengthSlider({ value, onChange, disabled }: StrengthSliderProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="flex items-center gap-2">
          Transformation Strength
          <span className="inline-flex items-center">
            <Info className="h-3.5 w-3.5 text-muted-foreground" />
          </span>
        </Label>
        <span className="text-sm font-medium tabular-nums">
          {Math.round(value * 100)}%
        </span>
      </div>

      <Slider
        value={[value]}
        onValueChange={([v]) => onChange(v)}
        min={0.2}
        max={0.8}
        step={0.05}
        disabled={disabled}
        className="w-full"
      />

      <div className="flex justify-between text-xs text-muted-foreground">
        <span>Subtle changes</span>
        <span>Dramatic changes</span>
      </div>
    </div>
  )
}
