'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Download, Trash2, Maximize2 } from 'lucide-react'
import type { Generation } from '@/types'

interface GenerationCardProps {
  generation: Generation
  onDelete?: (id: string) => void
}

export function GenerationCard({ generation, onDelete }: GenerationCardProps) {
  const [showFull, setShowFull] = useState(false)

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
      <Card className="overflow-hidden group">
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
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setShowFull(false)}
        >
          <div className="relative max-w-4xl max-h-[90vh]">
            <img
              src={generation.output_image_url}
              alt="Generated render"
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
            />
            <Button
              size="sm"
              variant="secondary"
              className="absolute top-2 right-2"
              onClick={(e) => {
                e.stopPropagation()
                handleDownload()
              }}
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>
        </div>
      )}
    </>
  )
}
