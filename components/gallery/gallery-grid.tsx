'use client'

import { GalleryCard } from './gallery-card'
import { Skeleton } from '@/components/ui/skeleton'

interface Generation {
  id: string
  input_image_url: string
  output_image_url: string
  style: string
  room_type: string
  view_count?: number
  share_token?: string
  is_featured?: boolean
}

interface GalleryGridProps {
  generations: Generation[]
  isLoading?: boolean
}

export function GalleryGrid({ generations, isLoading }: GalleryGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="aspect-[4/3] rounded-lg" />
        ))}
      </div>
    )
  }

  if (generations.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No renders found</p>
        <p className="text-sm text-muted-foreground mt-1">
          Try adjusting your filters or check back later
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {generations.map((generation) => (
        <GalleryCard
          key={generation.id}
          id={generation.id}
          inputImageUrl={generation.input_image_url}
          outputImageUrl={generation.output_image_url}
          style={generation.style}
          roomType={generation.room_type}
          viewCount={generation.view_count}
          shareToken={generation.share_token}
          isFeatured={generation.is_featured}
        />
      ))}
    </div>
  )
}
