'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { FURNITURE_ITEMS, type FurnitureItem } from '@/lib/staging-data'
import { Check } from 'lucide-react'

interface FurnitureSelectorProps {
  roomType: string
  selectedItems: FurnitureItem[]
  onSelectionChange: (items: FurnitureItem[]) => void
  disabled?: boolean
}

const CATEGORIES = [
  { id: 'living', name: 'Living' },
  { id: 'bedroom', name: 'Bedroom' },
  { id: 'dining', name: 'Dining' },
  { id: 'office', name: 'Office' },
  { id: 'decor', name: 'Decor' },
]

export function FurnitureSelector({
  roomType,
  selectedItems,
  onSelectionChange,
  disabled,
}: FurnitureSelectorProps) {
  const [activeCategory, setActiveCategory] = useState(roomType || 'living')

  const filteredItems = FURNITURE_ITEMS.filter(
    (item) => item.category === activeCategory || item.category === 'decor'
  )

  const toggleItem = (item: FurnitureItem) => {
    if (disabled) return

    const isSelected = selectedItems.some((i) => i.id === item.id)
    if (isSelected) {
      onSelectionChange(selectedItems.filter((i) => i.id !== item.id))
    } else {
      onSelectionChange([...selectedItems, item])
    }
  }

  const isSelected = (item: FurnitureItem) =>
    selectedItems.some((i) => i.id === item.id)

  return (
    <div className="space-y-4">
      {/* Category tabs */}
      <div className="flex gap-1 p-1 bg-muted rounded-lg overflow-x-auto">
        {CATEGORIES.map((category) => (
          <button
            key={category.id}
            onClick={() => setActiveCategory(category.id)}
            disabled={disabled}
            className={cn(
              'px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap',
              activeCategory === category.id
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Furniture grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {filteredItems.map((item) => (
          <button
            key={item.id}
            onClick={() => toggleItem(item)}
            disabled={disabled}
            className={cn(
              'relative p-3 rounded-lg border-2 transition-all text-left',
              isSelected(item)
                ? 'border-primary bg-primary/5'
                : 'border-muted hover:border-muted-foreground/30',
              disabled && 'opacity-50 cursor-not-allowed'
            )}
          >
            <div className="flex items-center gap-2">
              <span className="text-xl">{item.icon}</span>
              <span className="text-sm font-medium">{item.name}</span>
            </div>
            {isSelected(item) && (
              <div className="absolute top-1 right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                <Check className="w-3 h-3 text-primary-foreground" />
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Selected count */}
      {selectedItems.length > 0 && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            {selectedItems.length} item{selectedItems.length !== 1 ? 's' : ''} selected
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onSelectionChange([])}
            disabled={disabled}
          >
            Clear all
          </Button>
        </div>
      )}
    </div>
  )
}
