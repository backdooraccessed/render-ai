'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Download, RefreshCw, AlertCircle, Share2, Check, Eye, EyeOff, ChevronDown, Heart, Share, Globe, Wand2 } from 'lucide-react'
import { SocialExportButton } from '@/components/social-export-button'
import { UpscaleButton } from '@/components/upscale-button'
import { GenerationProgress } from '@/components/generation-progress'
import { ShopThisLook } from '@/components/shop'
import { cn } from '@/lib/utils'
import type { Generation } from '@/types'
import { toast } from 'sonner'

interface GenerationResultProps {
  generation: Generation | null
  inputImageUrl: string | null
  isLoading: boolean
  isMock?: boolean
  onRegenerate?: () => void
}

type ViewMode = 'slider' | 'before' | 'after'
type DownloadFormat = 'jpg' | 'png' | 'webp'

export function GenerationResult({
  generation,
  inputImageUrl,
  isLoading,
  isMock,
  onRegenerate,
}: GenerationResultProps) {
  const [sliderPosition, setSliderPosition] = useState(50)
  const [isDragging, setIsDragging] = useState(false)
  const [viewMode, setViewMode] = useState<ViewMode>('slider')
  const [copied, setCopied] = useState(false)
  const [selectedOutputIndex, setSelectedOutputIndex] = useState(0)
  const [isFavorite, setIsFavorite] = useState(generation?.is_favorite ?? false)
  const [isTogglingFavorite, setIsTogglingFavorite] = useState(false)
  const [isPublic, setIsPublic] = useState(generation?.is_public ?? false)
  const [isTogglingPublic, setIsTogglingPublic] = useState(false)

  // Get all output URLs (support both single and multiple outputs)
  const outputUrls = generation?.output_image_urls?.length
    ? generation.output_image_urls
    : generation?.output_image_url
    ? [generation.output_image_url]
    : []

  const currentOutputUrl = outputUrls[selectedOutputIndex] || generation?.output_image_url

  const handleDownload = async (format: DownloadFormat = 'jpg') => {
    if (!currentOutputUrl) return

    try {
      const response = await fetch(currentOutputUrl)
      const blob = await response.blob()

      // Convert to desired format using canvas
      const img = new Image()
      img.crossOrigin = 'anonymous'

      await new Promise((resolve, reject) => {
        img.onload = resolve
        img.onerror = reject
        img.src = URL.createObjectURL(blob)
      })

      const canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext('2d')
      ctx?.drawImage(img, 0, 0)

      const mimeTypes: Record<DownloadFormat, string> = {
        jpg: 'image/jpeg',
        png: 'image/png',
        webp: 'image/webp',
      }

      canvas.toBlob((convertedBlob) => {
        if (!convertedBlob) return
        const url = URL.createObjectURL(convertedBlob)
        const a = document.createElement('a')
        a.href = url
        a.download = `render-${generation?.id?.slice(0, 8) || 'image'}.${format}`
        document.body.appendChild(a)
        a.click()
        URL.revokeObjectURL(url)
        document.body.removeChild(a)
        toast.success(`Downloaded as ${format.toUpperCase()}`)
      }, mimeTypes[format], format === 'jpg' ? 0.95 : undefined)
    } catch (error) {
      console.error('Download failed:', error)
      toast.error('Download failed')
    }
  }

  const handleShare = async () => {
    if (!generation?.id) return

    try {
      // Create share link via API
      const response = await fetch(`/api/generations/${generation.id}/share`, {
        method: 'POST',
      })

      const data = await response.json()

      if (data.success && data.shareUrl) {
        await navigator.clipboard.writeText(data.shareUrl)
        setCopied(true)
        toast.success('Share link copied to clipboard')
        setTimeout(() => setCopied(false), 2000)
      } else {
        toast.error(data.error || 'Failed to create share link')
      }
    } catch (error) {
      console.error('Share failed:', error)
      toast.error('Failed to create share link')
    }
  }

  const handleToggleFavorite = async () => {
    if (!generation?.id || isTogglingFavorite) return

    setIsTogglingFavorite(true)
    try {
      const response = await fetch(`/api/generations/${generation.id}/favorite`, {
        method: 'POST',
      })

      if (response.ok) {
        const data = await response.json()
        setIsFavorite(data.is_favorite)
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

  const handleTogglePublic = async () => {
    if (!generation?.id || isTogglingPublic) return

    setIsTogglingPublic(true)
    try {
      const response = await fetch(`/api/generations/${generation.id}/public`, {
        method: 'POST',
      })

      if (response.ok) {
        const data = await response.json()
        setIsPublic(data.is_public)
        toast.success(data.is_public ? 'Added to public gallery' : 'Removed from public gallery')
      } else {
        toast.error('Failed to update visibility')
      }
    } catch (error) {
      console.error('Public toggle failed:', error)
      toast.error('Failed to update visibility')
    } finally {
      setIsTogglingPublic(false)
    }
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || viewMode !== 'slider') return
    const rect = e.currentTarget.getBoundingClientRect()
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width))
    setSliderPosition((x / rect.width) * 100)
  }

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging || viewMode !== 'slider') return
    const rect = e.currentTarget.getBoundingClientRect()
    const x = Math.max(0, Math.min(e.touches[0].clientX - rect.left, rect.width))
    setSliderPosition((x / rect.width) * 100)
  }

  // Loading state with progress indicator
  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="aspect-[4/3] relative mb-6">
          <Skeleton className="w-full h-full rounded-lg" />
        </div>
        <GenerationProgress isGenerating={isLoading} />
      </Card>
    )
  }

  // Error state
  if (generation?.status === 'failed') {
    return (
      <Card className="p-4">
        <div className="aspect-[4/3] flex items-center justify-center bg-destructive/5 rounded-lg border border-destructive/20">
          <div className="text-center p-6">
            <AlertCircle className="h-10 w-10 text-destructive mx-auto mb-3" />
            <p className="text-sm font-medium text-destructive mb-2">Generation Failed</p>
            <p className="text-xs text-muted-foreground mb-4">
              {generation.error_message || 'An unexpected error occurred'}
            </p>
            {onRegenerate && (
              <Button variant="outline" size="sm" onClick={onRegenerate}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Again
              </Button>
            )}
          </div>
        </div>
      </Card>
    )
  }

  // No result yet
  if (!currentOutputUrl || !inputImageUrl) {
    return (
      <Card className="p-4">
        <div className="aspect-[4/3] flex items-center justify-center bg-muted/50 rounded-lg border-2 border-dashed border-muted-foreground/25">
          <div className="text-center p-6">
            <p className="text-sm text-muted-foreground">
              Your generated render will appear here
            </p>
          </div>
        </div>
      </Card>
    )
  }

  // Result with before/after comparison
  return (
    <Card className="p-4">
      {isMock && (
        <div className="mb-3 px-3 py-2 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
          <p className="text-xs text-yellow-600 dark:text-yellow-500">
            Mock mode: Replicate API not configured. Showing original image.
          </p>
        </div>
      )}

      {/* View Mode Toggle */}
      <div className="flex gap-1 mb-3 p-1 bg-muted rounded-lg w-fit">
        <button
          onClick={() => setViewMode('before')}
          className={cn(
            "px-3 py-1.5 text-xs font-medium rounded-md transition-colors",
            viewMode === 'before'
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <EyeOff className="h-3 w-3 inline mr-1" />
          Before
        </button>
        <button
          onClick={() => setViewMode('slider')}
          className={cn(
            "px-3 py-1.5 text-xs font-medium rounded-md transition-colors",
            viewMode === 'slider'
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          Compare
        </button>
        <button
          onClick={() => setViewMode('after')}
          className={cn(
            "px-3 py-1.5 text-xs font-medium rounded-md transition-colors",
            viewMode === 'after'
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Eye className="h-3 w-3 inline mr-1" />
          After
        </button>
      </div>

      {/* Image Display */}
      <div
        className={cn(
          "relative aspect-[4/3] rounded-lg overflow-hidden select-none",
          viewMode === 'slider' && "cursor-ew-resize"
        )}
        onMouseDown={() => viewMode === 'slider' && setIsDragging(true)}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
        onMouseMove={handleMouseMove}
        onTouchStart={() => viewMode === 'slider' && setIsDragging(true)}
        onTouchEnd={() => setIsDragging(false)}
        onTouchMove={handleTouchMove}
      >
        {viewMode === 'before' ? (
          <img
            src={inputImageUrl}
            alt="Original image"
            className="w-full h-full object-cover"
            draggable={false}
          />
        ) : viewMode === 'after' ? (
          <img
            src={currentOutputUrl}
            alt="Generated render"
            className="w-full h-full object-cover"
            draggable={false}
          />
        ) : (
          <>
            {/* After image (full) */}
            <img
              src={currentOutputUrl}
              alt="Generated render"
              className="absolute inset-0 w-full h-full object-cover"
              draggable={false}
            />

            {/* Before image (clipped) */}
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ width: `${sliderPosition}%` }}
            >
              <img
                src={inputImageUrl}
                alt="Original image"
                className="absolute inset-0 w-full h-full object-cover"
                style={{ width: `${100 / (sliderPosition / 100)}%`, maxWidth: 'none' }}
                draggable={false}
              />
            </div>

            {/* Slider handle */}
            <div
              className="absolute top-0 bottom-0 w-1 bg-white shadow-lg cursor-ew-resize"
              style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
            >
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center">
                <div className="flex gap-0.5">
                  <div className="w-0.5 h-3 bg-gray-400 rounded-full" />
                  <div className="w-0.5 h-3 bg-gray-400 rounded-full" />
                </div>
              </div>
            </div>

            {/* Labels */}
            <div className="absolute top-2 left-2 px-2 py-1 bg-black/50 text-white text-xs rounded">
              Before
            </div>
            <div className="absolute top-2 right-2 px-2 py-1 bg-black/50 text-white text-xs rounded">
              After
            </div>
          </>
        )}
      </div>

      {/* Output selector for multiple variations */}
      {outputUrls.length > 1 && (
        <div className="mt-4">
          <p className="text-xs text-muted-foreground mb-2">
            {outputUrls.length} variations generated - click to view
          </p>
          <div className="grid grid-cols-4 gap-2">
            {outputUrls.map((url, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setSelectedOutputIndex(index)}
                className={cn(
                  "relative aspect-[4/3] rounded-md overflow-hidden border-2 transition-all",
                  selectedOutputIndex === index
                    ? "border-primary ring-2 ring-primary/20"
                    : "border-transparent hover:border-muted-foreground/30"
                )}
              >
                <img
                  src={url}
                  alt={`Variation ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-[10px] py-0.5 text-center">
                  #{index + 1}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex gap-2 mt-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="flex-1" variant="default">
              <Download className="mr-2 h-4 w-4" />
              Download
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => handleDownload('jpg')}>
              Download as JPG
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleDownload('png')}>
              Download as PNG
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleDownload('webp')}>
              Download as WebP
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button onClick={handleShare} variant="outline" size="icon">
          {copied ? <Check className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
        </Button>

        <Button
          onClick={handleToggleFavorite}
          variant="outline"
          size="icon"
          disabled={isTogglingFavorite}
          className={cn(isFavorite && "text-red-500 hover:text-red-600")}
        >
          <Heart className={cn(
            "h-4 w-4 transition-transform",
            isFavorite && "fill-current animate-heart-pop"
          )} />
        </Button>

        <Button
          onClick={handleTogglePublic}
          variant="outline"
          size="icon"
          disabled={isTogglingPublic}
          title={isPublic ? "Remove from gallery" : "Add to gallery"}
          className={cn(isPublic && "text-green-500 hover:text-green-600")}
        >
          <Globe className={cn("h-4 w-4", isPublic && "fill-current")} />
        </Button>

        <SocialExportButton imageUrl={currentOutputUrl || ''} disabled={!currentOutputUrl} />

        <UpscaleButton
          imageUrl={currentOutputUrl || ''}
          generationId={generation?.id}
          disabled={!currentOutputUrl}
        />

        {generation?.id && (
          <Button variant="outline" size="icon" asChild title="Edit with AI">
            <Link href={`/app/edit/${generation.id}`}>
              <Wand2 className="h-4 w-4" />
            </Link>
          </Button>
        )}

        {onRegenerate && (
          <Button onClick={onRegenerate} variant="outline" size="icon">
            <RefreshCw className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Shop This Look - Shoppable Staging Feature */}
      {generation?.style && generation?.room_type && generation.status === 'completed' && (
        <div className="mt-4">
          <ShopThisLook
            style={generation.style}
            roomType={generation.room_type}
            generationId={generation.id}
          />
        </div>
      )}
    </Card>
  )
}
