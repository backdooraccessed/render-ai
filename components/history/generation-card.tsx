'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Download, Trash2, Maximize2, Heart, X, ShoppingBag } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Generation } from '@/types'
import { toast } from 'sonner'
import { ShopThisLook } from '@/components/shop'

interface GenerationCardProps {
  generation: Generation
  onDelete?: (id: string) => void
  onFavoriteToggle?: (id: string, isFavorite: boolean) => void
}

export function GenerationCard({ generation, onDelete, onFavoriteToggle }: GenerationCardProps) {
  const [showFull, setShowFull] = useState(false)
  const [isFavorite, setIsFavorite] = useState(generation.is_favorite ?? false)
  const [isTogglingFavorite, setIsTogglingFavorite] = useState(false)

  const handleDownload = async () => {
    if (!generation.output_image_url) return

    try {
      const response = await fetch(generation.output_image_url)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `render-${generation.id.slice(0, 8)}.jpg`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Download failed:', error)
    }
  }

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (isTogglingFavorite) return

    setIsTogglingFavorite(true)
    try {
      const response = await fetch(`/api/generations/${generation.id}/favorite`, {
        method: 'POST',
      })

      if (response.ok) {
        const data = await response.json()
        setIsFavorite(data.is_favorite)
        if (onFavoriteToggle) {
          onFavoriteToggle(generation.id, data.is_favorite)
        }
        toast.success(data.is_favorite ? 'Added to favorites' : 'Removed from favorites')
      } else {
        toast.error('Failed to update favorite')
      }
    } catch (error) {
      console.error('Favorite toggle failed:', error)
      toast.error('Failed to update favorite')
    } finally {
      setIsTogglingFavorite(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <>
      <Card className="overflow-hidden group card-hover cursor-pointer">
        <div className="relative aspect-[4/3]">
          {generation.output_image_url ? (
            <img
              src={generation.output_image_url}
              alt="Generated render"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <span className="text-sm text-muted-foreground">
                {generation.status === 'failed' ? 'Failed' : 'Processing...'}
              </span>
            </div>
          )}

          {/* Favorite badge */}
          {isFavorite && (
            <div className="absolute top-2 left-2 bg-red-500 text-white p-1.5 rounded-full">
              <Heart className="h-3 w-3 fill-current" />
            </div>
          )}

          {/* Overlay with actions */}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <Button
              size="icon"
              variant="secondary"
              onClick={() => setShowFull(true)}
              className="h-9 w-9"
            >
              <Maximize2 className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="secondary"
              onClick={handleToggleFavorite}
              disabled={isTogglingFavorite}
              className={cn("h-9 w-9", isFavorite && "text-red-500")}
            >
              <Heart className={cn(
                "h-4 w-4 transition-transform",
                isFavorite && "fill-current animate-heart-pop"
              )} />
            </Button>
            {generation.output_image_url && (
              <Button
                size="icon"
                variant="secondary"
                onClick={handleDownload}
                className="h-9 w-9"
              >
                <Download className="h-4 w-4" />
              </Button>
            )}
            {onDelete && (
              <Button
                size="icon"
                variant="destructive"
                onClick={() => onDelete(generation.id)}
                className="h-9 w-9"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        <div className="p-3">
          <p className="text-xs text-muted-foreground">
            {formatDate(generation.created_at)}
          </p>
        </div>
      </Card>

      {/* Full size modal */}
      {showFull && generation.output_image_url && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setShowFull(false)}
        >
          <div
            className="relative w-full max-w-5xl my-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <Button
              size="icon"
              variant="ghost"
              className="absolute -top-12 right-0 text-white hover:bg-white/10"
              onClick={() => setShowFull(false)}
            >
              <X className="h-5 w-5" />
            </Button>

            {/* Image */}
            <div className="relative">
              <img
                src={generation.output_image_url}
                alt="Generated render"
                className="w-full object-contain rounded-lg max-h-[60vh]"
              />
              <Button
                size="sm"
                variant="secondary"
                className="absolute top-2 right-2"
                onClick={handleDownload}
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>

              {/* Style/Room info badge */}
              {(generation.style || generation.room_type) && (
                <div className="absolute bottom-2 left-2 flex gap-2">
                  {generation.style && (
                    <span className="px-2 py-1 bg-black/50 backdrop-blur-sm text-white text-xs rounded capitalize">
                      {generation.style}
                    </span>
                  )}
                  {generation.room_type && (
                    <span className="px-2 py-1 bg-black/50 backdrop-blur-sm text-white text-xs rounded capitalize">
                      {generation.room_type.replace('-', ' ')}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Shop This Look */}
            {generation.style && generation.room_type && (
              <div className="mt-4">
                <ShopThisLook
                  style={generation.style}
                  roomType={generation.room_type}
                  generationId={generation.id}
                  defaultExpanded={true}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
