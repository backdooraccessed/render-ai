'use client'

import { cn } from '@/lib/utils'
import { ROOM_TYPES, type RoomType } from '@/lib/staging-data'

interface RoomTypePickerProps {
  selectedRoom: string | null
  onRoomSelect: (roomId: string) => void
  disabled?: boolean
}

export function RoomTypePicker({
  selectedRoom,
  onRoomSelect,
  disabled,
}: RoomTypePickerProps) {
  return (
    <div className="flex gap-2 flex-wrap">
      {ROOM_TYPES.map((room) => (
        <button
          key={room.id}
          onClick={() => onRoomSelect(room.id)}
          disabled={disabled}
          className={cn(
            'flex items-center gap-2 px-4 py-2 rounded-full border-2 transition-all',
            selectedRoom === room.id
              ? 'border-primary bg-primary/10 text-primary'
              : 'border-muted hover:border-muted-foreground/30',
            disabled && 'opacity-50 cursor-not-allowed'
          )}
        >
          <span className="text-lg">{room.icon}</span>
          <span className="text-sm font-medium">{room.name}</span>
        </button>
      ))}
    </div>
  )
}
