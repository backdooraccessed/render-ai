'use client'

import { cn } from '@/lib/utils'
import { STYLE_BUNDLES, type StyleBundle } from '@/lib/staging-data'
import { Check } from 'lucide-react'

interface StyleBundlesProps {
  selectedStyle: StyleBundle | null
  onStyleSelect: (style: StyleBundle) => void
  disabled?: boolean
}

export function StyleBundles({
  selectedStyle,
  onStyleSelect,
  disabled,
}: StyleBundlesProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {STYLE_BUNDLES.map((style) => (
        <button
          key={style.id}
          onClick={() => onStyleSelect(style)}
          disabled={disabled}
          className={cn(
            'relative p-4 rounded-xl border-2 transition-all text-left group',
            selectedStyle?.id === style.id
              ? 'border-primary ring-2 ring-primary/20'
              : 'border-muted hover:border-muted-foreground/30',
            disabled && 'opacity-50 cursor-not-allowed'
          )}
        >
          {/* Color indicator */}
          <div
            className={cn(
              'w-8 h-8 rounded-full mb-3',
              style.color
            )}
          />

          {/* Style name */}
          <h3 className="font-semibold text-sm mb-1">{style.name}</h3>

          {/* Description */}
          <p className="text-xs text-muted-foreground line-clamp-2">
            {style.description}
          </p>

          {/* Selected indicator */}
          {selectedStyle?.id === style.id && (
            <div className="absolute top-2 right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
              <Check className="w-4 h-4 text-primary-foreground" />
            </div>
          )}
        </button>
      ))}
    </div>
  )
}
