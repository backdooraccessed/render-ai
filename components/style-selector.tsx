'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { STYLES } from '@/lib/prompts'

interface StyleSelectorProps {
  value: string
  onChange: (value: string) => void
  disabled?: boolean
}

export function StyleSelector({ value, onChange, disabled }: StyleSelectorProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="style-select">Interior Style</Label>
      <Select value={value} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger id="style-select" className="w-full">
          <SelectValue placeholder="Select a style" />
        </SelectTrigger>
        <SelectContent>
          {STYLES.map((style) => (
            <SelectItem key={style.id} value={style.id}>
              {style.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
