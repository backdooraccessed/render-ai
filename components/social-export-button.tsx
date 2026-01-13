'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuGroup,
} from '@/components/ui/dropdown-menu'
import { Share, Loader2, ChevronDown } from 'lucide-react'
import { toast } from 'sonner'

interface SocialExportButtonProps {
  imageUrl: string
  disabled?: boolean
}

interface SocialTemplate {
  name: string
  width: number
  height: number
  platform: string
}

const SOCIAL_TEMPLATES: SocialTemplate[] = [
  // Instagram
  { name: 'Instagram Post', width: 1080, height: 1080, platform: 'Instagram' },
  { name: 'Instagram Portrait', width: 1080, height: 1350, platform: 'Instagram' },
  { name: 'Instagram Story', width: 1080, height: 1920, platform: 'Instagram' },
  // Facebook
  { name: 'Facebook Post', width: 1200, height: 630, platform: 'Facebook' },
  { name: 'Facebook Cover', width: 820, height: 312, platform: 'Facebook' },
  // Pinterest
  { name: 'Pinterest Pin', width: 1000, height: 1500, platform: 'Pinterest' },
  // Twitter/X
  { name: 'Twitter/X Post', width: 1600, height: 900, platform: 'Twitter' },
  // LinkedIn
  { name: 'LinkedIn Post', width: 1200, height: 627, platform: 'LinkedIn' },
]

export function SocialExportButton({ imageUrl, disabled }: SocialExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false)

  const exportForSocial = async (template: SocialTemplate) => {
    if (!imageUrl) {
      toast.error('No image to export')
      return
    }

    setIsExporting(true)
    try {
      // Load the image
      const response = await fetch(imageUrl)
      const blob = await response.blob()

      const img = new Image()
      img.crossOrigin = 'anonymous'

      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve()
        img.onerror = reject
        img.src = URL.createObjectURL(blob)
      })

      // Create canvas with template dimensions
      const canvas = document.createElement('canvas')
      canvas.width = template.width
      canvas.height = template.height
      const ctx = canvas.getContext('2d')

      if (!ctx) {
        throw new Error('Could not get canvas context')
      }

      // Fill background
      ctx.fillStyle = '#f5f5f5'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Calculate dimensions to fit image while maintaining aspect ratio
      const imgAspect = img.width / img.height
      const canvasAspect = canvas.width / canvas.height

      let drawWidth: number
      let drawHeight: number
      let offsetX: number
      let offsetY: number

      if (imgAspect > canvasAspect) {
        // Image is wider - fit to width, crop height
        drawWidth = canvas.width
        drawHeight = canvas.width / imgAspect
        offsetX = 0
        offsetY = (canvas.height - drawHeight) / 2
      } else {
        // Image is taller - fit to height, crop width
        drawHeight = canvas.height
        drawWidth = canvas.height * imgAspect
        offsetX = (canvas.width - drawWidth) / 2
        offsetY = 0
      }

      // For 'cover' effect - fill the entire canvas
      if (imgAspect > canvasAspect) {
        drawHeight = canvas.height
        drawWidth = canvas.height * imgAspect
        offsetX = (canvas.width - drawWidth) / 2
        offsetY = 0
      } else {
        drawWidth = canvas.width
        drawHeight = canvas.width / imgAspect
        offsetX = 0
        offsetY = (canvas.height - drawHeight) / 2
      }

      ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight)

      // Convert to blob and download
      canvas.toBlob((exportBlob) => {
        if (!exportBlob) {
          toast.error('Failed to export image')
          return
        }

        const url = URL.createObjectURL(exportBlob)
        const a = document.createElement('a')
        a.href = url
        a.download = `render-${template.platform.toLowerCase()}-${template.width}x${template.height}.jpg`
        document.body.appendChild(a)
        a.click()
        URL.revokeObjectURL(url)
        document.body.removeChild(a)

        toast.success(`Exported for ${template.name}`)
      }, 'image/jpeg', 0.95)

      URL.revokeObjectURL(img.src)
    } catch (error) {
      console.error('Social export failed:', error)
      toast.error('Failed to export image')
    } finally {
      setIsExporting(false)
    }
  }

  // Group templates by platform
  const groupedTemplates = SOCIAL_TEMPLATES.reduce((acc, template) => {
    if (!acc[template.platform]) {
      acc[template.platform] = []
    }
    acc[template.platform].push(template)
    return acc
  }, {} as Record<string, SocialTemplate[]>)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" disabled={disabled || isExporting || !imageUrl}>
          {isExporting ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Share className="h-4 w-4 mr-2" />
          )}
          Social Export
          <ChevronDown className="h-4 w-4 ml-2" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48">
        {Object.entries(groupedTemplates).map(([platform, templates], index) => (
          <DropdownMenuGroup key={platform}>
            {index > 0 && <DropdownMenuSeparator />}
            <DropdownMenuLabel>{platform}</DropdownMenuLabel>
            {templates.map((template) => (
              <DropdownMenuItem
                key={`${template.platform}-${template.width}x${template.height}`}
                onClick={() => exportForSocial(template)}
              >
                <span className="flex-1">{template.name}</span>
                <span className="text-xs text-muted-foreground">
                  {template.width}×{template.height}
                </span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
