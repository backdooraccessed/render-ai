'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Download, RefreshCw, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Generation } from '@/types'

interface GenerationResultProps {
  generation: Generation | null
  inputImageUrl: string | null
  isLoading: boolean
  isMock?: boolean
  onRegenerate?: () => void
}

export function GenerationResult({
  generation,
  inputImageUrl,
  isLoading,
  isMock,
  onRegenerate,
}: GenerationResultProps) {
  const [sliderPosition, setSliderPosition] = useState(50)
  const [isDragging, setIsDragging] = useState(false)

  const handleDownload = async () => {
    if (!generation?.output_image_url) return

    try {
      const response = await fetch(generation.output_image_url)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `render-${generation.id}.jpg`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Download failed:', error)
    }
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return
    const rect = e.currentTarget.getBoundingClientRect()
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width))
    setSliderPosition((x / rect.width) * 100)
  }

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging) return
    const rect = e.currentTarget.getBoundingClientRect()
    const x = Math.max(0, Math.min(e.touches[0].clientX - rect.left, rect.width))
    setSliderPosition((x / rect.width) * 100)
  }

  // Loading state
  if (isLoading) {
    return (
      <Card className="p-4">
        <div className="aspect-[4/3] relative">
          <Skeleton className="w-full h-full rounded-lg" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-pulse text-muted-foreground">
                <p className="text-sm font-medium">Generating your render...</p>
                <p className="text-xs mt-1">This may take 15-30 seconds</p>
              </div>
            </div>
          </div>
        </div>
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
  if (!generation?.output_image_url || !inputImageUrl) {
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

      {/* Before/After Slider */}
      <div
        className="relative aspect-[4/3] rounded-lg overflow-hidden cursor-ew-resize select-none"
        onMouseDown={() => setIsDragging(true)}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
        onMouseMove={handleMouseMove}
        onTouchStart={() => setIsDragging(true)}
        onTouchEnd={() => setIsDragging(false)}
        onTouchMove={handleTouchMove}
      >
        {/* After image (full) */}
        <img
          src={generation.output_image_url}
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
      </div>

      {/* Action buttons */}
      <div className="flex gap-2 mt-4">
        <Button onClick={handleDownload} className="flex-1" variant="default">
          <Download className="mr-2 h-4 w-4" />
          Download
        </Button>
        {onRegenerate && (
          <Button onClick={onRegenerate} variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Regenerate
          </Button>
        )}
      </div>
    </Card>
  )
}
