'use client'

import { useState } from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ChevronDown, ChevronUp, Shuffle, Copy, Check } from 'lucide-react'
import { toast } from 'sonner'

interface SeedControlProps {
  value: number | undefined
  onChange: (seed: number | undefined) => void
  disabled?: boolean
}

export function SeedControl({ value, onChange, disabled }: SeedControlProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [copied, setCopied] = useState(false)

  const generateRandomSeed = () => {
    const seed = Math.floor(Math.random() * 2147483647)
    onChange(seed)
  }

  const clearSeed = () => {
    onChange(undefined)
  }

  const copySeed = async () => {
    if (value === undefined) return
    try {
      await navigator.clipboard.writeText(value.toString())
      setCopied(true)
      toast.success('Seed copied to clipboard')
      setTimeout(() => setCopied(false), 2000)
    } catch (e) {
      toast.error('Failed to copy seed')
    }
  }

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between w-full text-left"
        disabled={disabled}
      >
        <div className="flex items-center gap-2">
          <Label className="cursor-pointer">
            Seed
            <span className="text-muted-foreground font-normal ml-1">(optional)</span>
          </Label>
          {value !== undefined && (
            <span className="text-xs bg-muted px-2 py-0.5 rounded font-mono">
              {value}
            </span>
          )}
        </div>
        {isExpanded ? (
          <ChevronUp className="h-4 w-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        )}
      </button>

      {isExpanded && (
        <div className="space-y-3 animate-in slide-in-from-top-2 duration-200">
          <div className="flex gap-2">
            <Input
              type="number"
              value={value ?? ''}
              onChange={(e) => {
                const val = e.target.value
                if (val === '') {
                  onChange(undefined)
                } else {
                  const num = parseInt(val, 10)
                  if (!isNaN(num) && num >= 0) {
                    onChange(num)
                  }
                }
              }}
              placeholder="Random"
              disabled={disabled}
              className="font-mono"
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={generateRandomSeed}
              disabled={disabled}
              title="Generate random seed"
            >
              <Shuffle className="h-4 w-4" />
            </Button>
            {value !== undefined && (
              <>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={copySeed}
                  disabled={disabled}
                  title="Copy seed"
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={clearSeed}
                  disabled={disabled}
                >
                  Clear
                </Button>
              </>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            Use a seed to get reproducible results. The same seed with the same settings will generate similar outputs.
          </p>
        </div>
      )}
    </div>
  )
}
