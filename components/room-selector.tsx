'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { ROOM_TYPES } from '@/lib/prompts'

interface RoomSelectorProps {
  value: string
  onChange: (value: string) => void
  disabled?: boolean
}

export function RoomSelector({ value, onChange, disabled }: RoomSelectorProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="room-select">Room Type</Label>
      <Select value={value} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger id="room-select" className="w-full">
          <SelectValue placeholder="Select room type" />
        </SelectTrigger>
        <SelectContent>
          {ROOM_TYPES.map((room) => (
            <SelectItem key={room.id} value={room.id}>
              {room.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
