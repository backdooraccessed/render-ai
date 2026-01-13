'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Maximize, Loader2, ChevronDown, Check } from 'lucide-react'
import { toast } from 'sonner'

interface UpscaleButtonProps {
  imageUrl: string
  generationId?: string
  onUpscaleComplete?: (upscaledUrl: string) => void
  disabled?: boolean
}

export function UpscaleButton({
  imageUrl,
  generationId,
  onUpscaleComplete,
  disabled,
}: UpscaleButtonProps) {
  const [isUpscaling, setIsUpscaling] = useState(false)
  const [completedScale, setCompletedScale] = useState<number | null>(null)

  const handleUpscale = async (scale: 2 | 4) => {
    if (!imageUrl || isUpscaling) return

    setIsUpscaling(true)
    setCompletedScale(null)

    try {
      const response = await fetch('/api/upscale', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageUrl,
          generationId,
          scale,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setCompletedScale(scale)
        toast.success(`Image upscaled to ${scale}x resolution`)

        if (onUpscaleComplete && data.upscaledUrl) {
          onUpscaleComplete(data.upscaledUrl)
        }

        // Auto-download the upscaled image
        if (data.upscaledUrl) {
          const a = document.createElement('a')
          a.href = data.upscaledUrl
          a.download = `render-${scale}x-upscaled.jpg`
          a.target = '_blank'
          document.body.appendChild(a)
          a.click()
          document.body.removeChild(a)
        }
      } else {
        toast.error(data.error || 'Upscaling failed')
      }
    } catch (error) {
      console.error('Upscale error:', error)
      toast.error('Failed to upscale image')
    } finally {
      setIsUpscaling(false)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          disabled={disabled || isUpscaling || !imageUrl}
        >
          {isUpscaling ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : completedScale ? (
            <Check className="h-4 w-4 mr-2" />
          ) : (
            <Maximize className="h-4 w-4 mr-2" />
          )}
          {isUpscaling ? 'Upscaling...' : 'Upscale'}
          <ChevronDown className="h-4 w-4 ml-2" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => handleUpscale(2)}>
          <span className="flex-1">2x Resolution</span>
          <span className="text-xs text-muted-foreground">Faster</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleUpscale(4)}>
          <span className="flex-1">4x Resolution</span>
          <span className="text-xs text-muted-foreground">Best quality</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
