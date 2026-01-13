'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface GalleryFiltersProps {
  style: string
  roomType: string
  sort: string
  onStyleChange: (value: string) => void
  onRoomTypeChange: (value: string) => void
  onSortChange: (value: string) => void
}

const STYLES = [
  { value: 'all', label: 'All Styles' },
  { value: 'Modern', label: 'Modern' },
  { value: 'Minimalist', label: 'Minimalist' },
  { value: 'Scandinavian', label: 'Scandinavian' },
  { value: 'Industrial', label: 'Industrial' },
  { value: 'Traditional', label: 'Traditional' },
  { value: 'Contemporary', label: 'Contemporary' },
  { value: 'Mid-Century Modern', label: 'Mid-Century Modern' },
  { value: 'Bohemian', label: 'Bohemian' },
  { value: 'Coastal', label: 'Coastal' },
  { value: 'Rustic', label: 'Rustic' },
]

const ROOM_TYPES = [
  { value: 'all', label: 'All Rooms' },
  { value: 'Living Room', label: 'Living Room' },
  { value: 'Bedroom', label: 'Bedroom' },
  { value: 'Kitchen', label: 'Kitchen' },
  { value: 'Bathroom', label: 'Bathroom' },
  { value: 'Office', label: 'Office' },
  { value: 'Dining Room', label: 'Dining Room' },
]

const SORT_OPTIONS = [
  { value: 'recent', label: 'Most Recent' },
  { value: 'popular', label: 'Most Popular' },
  { value: 'oldest', label: 'Oldest' },
]

export function GalleryFilters({
  style,
  roomType,
  sort,
  onStyleChange,
  onRoomTypeChange,
  onSortChange,
}: GalleryFiltersProps) {
  return (
    <div className="flex flex-wrap gap-3">
      <Select value={style} onValueChange={onStyleChange}>
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder="Style" />
        </SelectTrigger>
        <SelectContent>
          {STYLES.map((s) => (
            <SelectItem key={s.value} value={s.value}>
              {s.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={roomType} onValueChange={onRoomTypeChange}>
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder="Room Type" />
        </SelectTrigger>
        <SelectContent>
          {ROOM_TYPES.map((r) => (
            <SelectItem key={r.value} value={r.value}>
              {r.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={sort} onValueChange={onSortChange}>
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder="Sort By" />
        </SelectTrigger>
        <SelectContent>
          {SORT_OPTIONS.map((s) => (
            <SelectItem key={s.value} value={s.value}>
              {s.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
