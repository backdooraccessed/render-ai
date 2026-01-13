'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Eye } from 'lucide-react'
import { cn } from '@/lib/utils'

interface GalleryCardProps {
  id: string
  inputImageUrl: string
  outputImageUrl: string
  style: string
  roomType: string
  viewCount?: number
  shareToken?: string
  isFeatured?: boolean
}

export function GalleryCard({
  id,
  inputImageUrl,
  outputImageUrl,
  style,
  roomType,
  viewCount,
  shareToken,
  isFeatured,
}: GalleryCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  const href = shareToken ? `/share/${shareToken}` : '#'

  return (
    <Link href={href}>
      <Card
        className={cn(
          'overflow-hidden card-hover cursor-pointer group',
          isFeatured && 'ring-2 ring-primary'
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative aspect-[4/3]">
          {/* Before/After transition on hover */}
          <img
            src={isHovered ? inputImageUrl : outputImageUrl}
            alt={`${style} ${roomType}`}
            className="w-full h-full object-cover transition-opacity duration-500"
          />

          {/* Hover overlay */}
          <div
            className={cn(
              'absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent',
              'opacity-0 group-hover:opacity-100 transition-opacity duration-300'
            )}
          />

          {/* Labels */}
          <div
            className={cn(
              'absolute bottom-2 left-2 right-2 flex justify-between items-end',
              'opacity-0 group-hover:opacity-100 transition-opacity duration-300'
            )}
          >
            <div>
              <p className="text-white text-sm font-medium">{style}</p>
              <p className="text-white/80 text-xs">{roomType}</p>
            </div>
            {viewCount !== undefined && viewCount > 0 && (
              <div className="flex items-center gap-1 text-white/80 text-xs">
                <Eye className="h-3 w-3" />
                {viewCount.toLocaleString()}
              </div>
            )}
          </div>

          {/* Featured badge */}
          {isFeatured && (
            <div className="absolute top-2 right-2 px-2 py-1 bg-primary text-primary-foreground text-xs font-medium rounded">
              Featured
            </div>
          )}

          {/* Hover instruction */}
          <div
            className={cn(
              'absolute top-2 left-2 px-2 py-1 bg-black/50 text-white text-xs rounded',
              'opacity-0 group-hover:opacity-100 transition-opacity duration-300'
            )}
          >
            {isHovered ? 'Before' : 'After'}
          </div>
        </div>
      </Card>
    </Link>
  )
}
