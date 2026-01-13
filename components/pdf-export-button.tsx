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
} from '@/components/ui/dropdown-menu'
import { FileText, Loader2, ChevronDown } from 'lucide-react'
import { exportToPDF } from '@/lib/pdf-export'
import { toast } from 'sonner'

interface PDFExportButtonProps {
  images: string[]
  title?: string
  disabled?: boolean
}

export function PDFExportButton({ images, title = 'RenderAI Export', disabled }: PDFExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false)

  const handleExport = async (layout: 'single' | 'grid') => {
    if (images.length === 0) {
      toast.error('No images to export')
      return
    }

    setIsExporting(true)
    try {
      await exportToPDF({
        title,
        images: images.map((url, index) => ({
          url,
          title: `Render ${index + 1}`,
        })),
        layout,
      })
      toast.success('PDF exported successfully')
    } catch (error) {
      console.error('PDF export failed:', error)
      toast.error('Failed to export PDF')
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" disabled={disabled || isExporting || images.length === 0}>
          {isExporting ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <FileText className="h-4 w-4 mr-2" />
          )}
          Export PDF
          <ChevronDown className="h-4 w-4 ml-2" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Layout</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => handleExport('single')}>
          Full Page (1 per page)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport('grid')}>
          Grid Layout (4 per page)
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
