'use client'

import { cn } from '@/lib/utils'

interface StylePresetsProps {
  selectedStyle: string | null
  onStyleSelect: (style: string, prompt: string) => void
  disabled?: boolean
}

interface StylePreset {
  name: string
  icon: string
  prompt: string
  color: string
}

const STYLE_PRESETS: StylePreset[] = [
  {
    name: 'Modern',
    icon: '🏢',
    prompt: 'Transform into a modern contemporary style with clean lines, neutral colors, sleek furniture, and minimalist decor',
    color: 'bg-slate-100 hover:bg-slate-200 border-slate-300',
  },
  {
    name: 'Scandinavian',
    icon: '🌿',
    prompt: 'Apply Scandinavian design with light wood tones, white walls, cozy textiles, and functional minimalist furniture',
    color: 'bg-amber-50 hover:bg-amber-100 border-amber-200',
  },
  {
    name: 'Industrial',
    icon: '🏭',
    prompt: 'Create an industrial loft style with exposed brick, metal accents, concrete floors, and vintage factory elements',
    color: 'bg-stone-100 hover:bg-stone-200 border-stone-300',
  },
  {
    name: 'Bohemian',
    icon: '🎨',
    prompt: 'Design a bohemian eclectic space with rich patterns, layered textiles, plants, and collected global decor',
    color: 'bg-orange-50 hover:bg-orange-100 border-orange-200',
  },
  {
    name: 'Minimalist',
    icon: '⬜',
    prompt: 'Create a minimalist zen space with very few furniture pieces, white and neutral palette, and clean empty surfaces',
    color: 'bg-gray-50 hover:bg-gray-100 border-gray-200',
  },
  {
    name: 'Mid-Century',
    icon: '🪑',
    prompt: 'Apply mid-century modern style with iconic 1950s-60s furniture, warm wood tones, and retro accent colors',
    color: 'bg-yellow-50 hover:bg-yellow-100 border-yellow-200',
  },
  {
    name: 'Coastal',
    icon: '🌊',
    prompt: 'Transform into coastal beach style with white and blue palette, natural textures, rattan furniture, and ocean-inspired decor',
    color: 'bg-sky-50 hover:bg-sky-100 border-sky-200',
  },
  {
    name: 'Luxury',
    icon: '✨',
    prompt: 'Create a luxury high-end interior with premium materials, elegant furniture, sophisticated lighting, and designer accents',
    color: 'bg-purple-50 hover:bg-purple-100 border-purple-200',
  },
  {
    name: 'Japandi',
    icon: '🎋',
    prompt: 'Apply Japandi style combining Japanese minimalism with Scandinavian warmth, natural materials, and serene atmosphere',
    color: 'bg-green-50 hover:bg-green-100 border-green-200',
  },
  {
    name: 'Farmhouse',
    icon: '🏡',
    prompt: 'Design a modern farmhouse interior with shiplap walls, rustic wood, vintage accents, and cozy comfortable furniture',
    color: 'bg-amber-100 hover:bg-amber-200 border-amber-300',
  },
]

export function StylePresets({ selectedStyle, onStyleSelect, disabled }: StylePresetsProps) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">Quick Styles</p>
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {STYLE_PRESETS.map((style) => (
          <button
            key={style.name}
            type="button"
            onClick={() => onStyleSelect(style.name, style.prompt)}
            disabled={disabled}
            className={cn(
              "flex flex-col items-center gap-1 p-3 rounded-lg border transition-all text-sm",
              style.color,
              selectedStyle === style.name && "ring-2 ring-primary ring-offset-1",
              disabled && "opacity-50 cursor-not-allowed"
            )}
          >
            <span className="text-xl">{style.icon}</span>
            <span className="font-medium text-xs">{style.name}</span>
          </button>
        ))}
      </div>
      {selectedStyle && (
        <p className="text-xs text-muted-foreground">
          Selected: {selectedStyle} style preset. You can still customize the prompt below.
        </p>
      )}
    </div>
  )
}
