'use client'

import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Button } from '@/components/ui/button'
import { ImagePlus, X, Palette } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ReferenceImageUploadProps {
  onImageSelect: (file: File, preview: string) => void
  onImageClear: () => void
  selectedImage: string | null
  disabled?: boolean
}

export function ReferenceImageUpload({
  onImageSelect,
  onImageClear,
  selectedImage,
  disabled,
}: ReferenceImageUploadProps) {
  const [isDragActive, setIsDragActive] = useState(false)

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0]
        const preview = URL.createObjectURL(file)
        onImageSelect(file, preview)
      }
    },
    [onImageSelect]
  )

  const { getRootProps, getInputProps, open } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp'],
    },
    maxFiles: 1,
    disabled,
    noClick: !!selectedImage,
    onDragEnter: () => setIsDragActive(true),
    onDragLeave: () => setIsDragActive(false),
  })

  if (selectedImage) {
    return (
      <div className="relative">
        <div className="relative rounded-lg overflow-hidden border">
          <img
            src={selectedImage}
            alt="Style reference"
            className="w-full aspect-[4/3] object-cover"
          />
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 h-8 w-8"
            onClick={(e) => {
              e.stopPropagation()
              onImageClear()
            }}
            disabled={disabled}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2 text-center">
          Style from this image will be applied to your generation
        </p>
      </div>
    )
  }

  return (
    <div
      {...getRootProps()}
      className={cn(
        'border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors',
        isDragActive
          ? 'border-primary bg-primary/5'
          : 'border-muted-foreground/25 hover:border-primary/50',
        disabled && 'opacity-50 cursor-not-allowed'
      )}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center gap-2">
        <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
          <Palette className="h-5 w-5 text-muted-foreground" />
        </div>
        <div>
          <p className="text-sm font-medium">Add Style Reference</p>
          <p className="text-xs text-muted-foreground">
            Optional: Upload an image to guide the style
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={open}
          disabled={disabled}
        >
          <ImagePlus className="mr-2 h-4 w-4" />
          Browse
        </Button>
      </div>
    </div>
  )
}
