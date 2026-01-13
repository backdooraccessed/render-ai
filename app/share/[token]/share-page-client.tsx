'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Download, Eye, EyeOff, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

interface Generation {
  id: string
  input_image_url: string
  output_image_url: string | null
  output_image_urls?: string[]
  upscaled_image_url?: string
  style: string
  room_type: string
  created_at: string
  view_count?: number
}

interface SharePageClientProps {
  generation: Generation
}

type ViewMode = 'slider' | 'before' | 'after'

export function SharePageClient({ generation }: SharePageClientProps) {
  const [sliderPosition, setSliderPosition] = useState(50)
  const [isDragging, setIsDragging] = useState(false)
  const [viewMode, setViewMode] = useState<ViewMode>('slider')

  const outputUrl = generation.upscaled_image_url || generation.output_image_url
  const inputUrl = generation.input_image_url

  const handleDownload = async () => {
    if (!outputUrl) return

    try {
      const response = await fetch(outputUrl)
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `render-${generation.style.toLowerCase()}-${generation.room_type.toLowerCase()}.jpg`
      document.body.appendChild(a)
      a.click()
      URL.revokeObjectURL(url)
      document.body.removeChild(a)
      toast.success('Image downloaded')
    } catch (error) {
      console.error('Download failed:', error)
      toast.error('Download failed')
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

  if (!outputUrl || !inputUrl) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">This render is not available</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <span className="font-semibold text-lg">RenderAI</span>
          </Link>
          <Button asChild>
            <Link href="/app">Create Your Own</Link>
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">
            {generation.style} {generation.room_type}
          </h1>
          <p className="text-muted-foreground">
            Created with RenderAI
            {generation.view_count && generation.view_count > 1 && (
              <span className="ml-2">
                &bull; {generation.view_count.toLocaleString()} views
              </span>
            )}
          </p>
        </div>

        <Card className="p-4 md:p-6">
          {/* View Mode Toggle */}
          <div className="flex gap-1 mb-4 p-1 bg-muted rounded-lg w-fit mx-auto">
            <button
              onClick={() => setViewMode('before')}
              className={cn(
                'px-3 py-1.5 text-xs font-medium rounded-md transition-colors',
                viewMode === 'before'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <EyeOff className="h-3 w-3 inline mr-1" />
              Before
            </button>
            <button
              onClick={() => setViewMode('slider')}
              className={cn(
                'px-3 py-1.5 text-xs font-medium rounded-md transition-colors',
                viewMode === 'slider'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              Compare
            </button>
            <button
              onClick={() => setViewMode('after')}
              className={cn(
                'px-3 py-1.5 text-xs font-medium rounded-md transition-colors',
                viewMode === 'after'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <Eye className="h-3 w-3 inline mr-1" />
              After
            </button>
          </div>

          {/* Image Display */}
          <div
            className={cn(
              'relative aspect-[4/3] rounded-lg overflow-hidden select-none',
              viewMode === 'slider' && 'cursor-ew-resize'
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
                src={inputUrl}
                alt="Original"
                className="w-full h-full object-cover"
                draggable={false}
              />
            ) : viewMode === 'after' ? (
              <img
                src={outputUrl}
                alt="Rendered"
                className="w-full h-full object-cover"
                draggable={false}
              />
            ) : (
              <>
                {/* After image (full) */}
                <img
                  src={outputUrl}
                  alt="Rendered"
                  className="absolute inset-0 w-full h-full object-cover"
                  draggable={false}
                />

                {/* Before image (clipped) */}
                <div
                  className="absolute inset-0 overflow-hidden"
                  style={{ width: `${sliderPosition}%` }}
                >
                  <img
                    src={inputUrl}
                    alt="Original"
                    className="absolute inset-0 w-full h-full object-cover"
                    style={{
                      width: `${100 / (sliderPosition / 100)}%`,
                      maxWidth: 'none',
                    }}
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

          {/* Actions */}
          <div className="flex gap-3 mt-6 justify-center">
            <Button onClick={handleDownload} variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
            <Button asChild>
              <Link href="/app">
                <Sparkles className="mr-2 h-4 w-4" />
                Create Your Own
              </Link>
            </Button>
          </div>
        </Card>

        {/* CTA */}
        <div className="mt-12 text-center">
          <h2 className="text-xl font-semibold mb-2">
            Transform Your Space with AI
          </h2>
          <p className="text-muted-foreground mb-4">
            Upload a photo of any room and see it transformed in seconds
          </p>
          <Button size="lg" asChild>
            <Link href="/app">Try RenderAI Free</Link>
          </Button>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t mt-16 py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>Created with RenderAI - AI-Powered Interior Design</p>
        </div>
      </footer>
    </div>
  )
}
