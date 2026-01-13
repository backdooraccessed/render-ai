'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Eraser, Paintbrush, RotateCcw, Download } from 'lucide-react'
import { cn } from '@/lib/utils'

interface InpaintCanvasProps {
  imageUrl: string
  onMaskChange: (maskDataUrl: string | null) => void
  disabled?: boolean
}

export function InpaintCanvas({ imageUrl, onMaskChange, disabled }: InpaintCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const overlayCanvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [brushSize, setBrushSize] = useState(30)
  const [tool, setTool] = useState<'brush' | 'eraser'>('brush')
  const [imageLoaded, setImageLoaded] = useState(false)
  const imageRef = useRef<HTMLImageElement | null>(null)

  // Load image and set up canvas
  useEffect(() => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      imageRef.current = img
      setImageLoaded(true)

      const canvas = canvasRef.current
      const overlay = overlayCanvasRef.current
      if (!canvas || !overlay) return

      // Set canvas dimensions to match image aspect ratio
      const container = containerRef.current
      if (!container) return

      const containerWidth = container.clientWidth
      const scale = containerWidth / img.width
      const canvasHeight = img.height * scale

      canvas.width = containerWidth
      canvas.height = canvasHeight
      overlay.width = containerWidth
      overlay.height = canvasHeight

      // Draw image on background canvas
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.drawImage(img, 0, 0, containerWidth, canvasHeight)
      }
    }
    img.src = imageUrl
  }, [imageUrl])

  const getMousePos = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = overlayCanvasRef.current
    if (!canvas) return { x: 0, y: 0 }

    const rect = canvas.getBoundingClientRect()
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    }
  }, [])

  const getTouchPos = useCallback((e: React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = overlayCanvasRef.current
    if (!canvas) return { x: 0, y: 0 }

    const rect = canvas.getBoundingClientRect()
    const touch = e.touches[0]
    return {
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top,
    }
  }, [])

  const draw = useCallback(
    (x: number, y: number) => {
      const canvas = overlayCanvasRef.current
      if (!canvas) return

      const ctx = canvas.getContext('2d')
      if (!ctx) return

      ctx.beginPath()
      ctx.arc(x, y, brushSize / 2, 0, Math.PI * 2)

      if (tool === 'brush') {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)'
        ctx.fill()
      } else {
        ctx.globalCompositeOperation = 'destination-out'
        ctx.fill()
        ctx.globalCompositeOperation = 'source-over'
      }
    },
    [brushSize, tool]
  )

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (disabled) return
    setIsDrawing(true)
    const pos = getMousePos(e)
    draw(pos.x, pos.y)
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || disabled) return
    const pos = getMousePos(e)
    draw(pos.x, pos.y)
  }

  const handleMouseUp = () => {
    setIsDrawing(false)
    exportMask()
  }

  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (disabled) return
    e.preventDefault()
    setIsDrawing(true)
    const pos = getTouchPos(e)
    draw(pos.x, pos.y)
  }

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || disabled) return
    e.preventDefault()
    const pos = getTouchPos(e)
    draw(pos.x, pos.y)
  }

  const handleTouchEnd = () => {
    setIsDrawing(false)
    exportMask()
  }

  const clearMask = () => {
    const canvas = overlayCanvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    onMaskChange(null)
  }

  const exportMask = () => {
    const overlay = overlayCanvasRef.current
    const img = imageRef.current
    if (!overlay || !img) return

    // Create a new canvas at the original image resolution for the mask
    const maskCanvas = document.createElement('canvas')
    maskCanvas.width = img.width
    maskCanvas.height = img.height
    const maskCtx = maskCanvas.getContext('2d')
    if (!maskCtx) return

    // Fill with black (areas to keep)
    maskCtx.fillStyle = 'black'
    maskCtx.fillRect(0, 0, maskCanvas.width, maskCanvas.height)

    // Draw the overlay scaled up, with white for masked areas
    const scaleX = img.width / overlay.width
    const scaleY = img.height / overlay.height

    const overlayCtx = overlay.getContext('2d')
    if (!overlayCtx) return

    const overlayData = overlayCtx.getImageData(0, 0, overlay.width, overlay.height)
    const maskData = maskCtx.getImageData(0, 0, maskCanvas.width, maskCanvas.height)

    for (let y = 0; y < maskCanvas.height; y++) {
      for (let x = 0; x < maskCanvas.width; x++) {
        const overlayX = Math.floor(x / scaleX)
        const overlayY = Math.floor(y / scaleY)
        const overlayIdx = (overlayY * overlay.width + overlayX) * 4
        const maskIdx = (y * maskCanvas.width + x) * 4

        // If overlay pixel has alpha > 0, it's masked (white in output)
        if (overlayData.data[overlayIdx + 3] > 0) {
          maskData.data[maskIdx] = 255 // R
          maskData.data[maskIdx + 1] = 255 // G
          maskData.data[maskIdx + 2] = 255 // B
          maskData.data[maskIdx + 3] = 255 // A
        }
      }
    }

    maskCtx.putImageData(maskData, 0, 0)
    onMaskChange(maskCanvas.toDataURL('image/png'))
  }

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex gap-1">
          <Button
            variant={tool === 'brush' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTool('brush')}
            disabled={disabled}
          >
            <Paintbrush className="h-4 w-4 mr-1" />
            Brush
          </Button>
          <Button
            variant={tool === 'eraser' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTool('eraser')}
            disabled={disabled}
          >
            <Eraser className="h-4 w-4 mr-1" />
            Eraser
          </Button>
        </div>

        <div className="flex items-center gap-2 flex-1 min-w-[150px] max-w-[200px]">
          <span className="text-sm text-muted-foreground whitespace-nowrap">
            Size: {brushSize}
          </span>
          <Slider
            value={[brushSize]}
            onValueChange={([v]) => setBrushSize(v)}
            min={5}
            max={100}
            step={5}
            disabled={disabled}
          />
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={clearMask}
          disabled={disabled}
        >
          <RotateCcw className="h-4 w-4 mr-1" />
          Clear
        </Button>
      </div>

      {/* Canvas Container */}
      <div
        ref={containerRef}
        className={cn(
          'relative rounded-lg overflow-hidden border bg-muted',
          disabled && 'opacity-50 pointer-events-none'
        )}
      >
        {/* Background image canvas */}
        <canvas
          ref={canvasRef}
          className="w-full block"
        />

        {/* Overlay mask canvas */}
        <canvas
          ref={overlayCanvasRef}
          className="absolute inset-0 w-full h-full cursor-crosshair"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        />

        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-muted-foreground">Loading image...</p>
          </div>
        )}
      </div>

      <p className="text-xs text-muted-foreground">
        Paint over the areas you want to change. The AI will regenerate only the masked regions.
      </p>
    </div>
  )
}
