'use client'

import { useCallback, useState } from 'react'
import { cn, formatFileSize } from '@/lib/utils'
import { Upload, X, Image as ImageIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ImageUploadProps {
  onImageSelect: (file: File, previewUrl: string) => void
  onImageClear: () => void
  selectedImage: string | null
  disabled?: boolean
  maxSizeMB?: number
  acceptedFormats?: string[]
}

const DEFAULT_MAX_SIZE_MB = 10
const DEFAULT_ACCEPTED_FORMATS = ['image/jpeg', 'image/png', 'image/webp']

export function ImageUpload({
  onImageSelect,
  onImageClear,
  selectedImage,
  disabled = false,
  maxSizeMB = DEFAULT_MAX_SIZE_MB,
  acceptedFormats = DEFAULT_ACCEPTED_FORMATS,
}: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const validateFile = useCallback(
    (file: File): string | null => {
      if (!acceptedFormats.includes(file.type)) {
        return `Invalid file type. Accepted formats: ${acceptedFormats.map(f => f.split('/')[1].toUpperCase()).join(', ')}`
      }
      if (file.size > maxSizeMB * 1024 * 1024) {
        return `File too large. Maximum size: ${maxSizeMB}MB`
      }
      return null
    },
    [acceptedFormats, maxSizeMB]
  )

  const handleFile = useCallback(
    (file: File) => {
      const validationError = validateFile(file)
      if (validationError) {
        setError(validationError)
        return
      }
      setError(null)
      const previewUrl = URL.createObjectURL(file)
      onImageSelect(file, previewUrl)
    },
    [validateFile, onImageSelect]
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragging(false)

      if (disabled) return

      const file = e.dataTransfer.files[0]
      if (file) {
        handleFile(file)
      }
    },
    [disabled, handleFile]
  )

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) {
        handleFile(file)
      }
    },
    [handleFile]
  )

  const handleClear = useCallback(() => {
    setError(null)
    onImageClear()
  }, [onImageClear])

  if (selectedImage) {
    return (
      <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden border border-border">
        <img
          src={selectedImage}
          alt="Selected interior"
          className="w-full h-full object-cover"
        />
        <Button
          variant="secondary"
          size="icon"
          className="absolute top-2 right-2 h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background"
          onClick={handleClear}
          disabled={disabled}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    )
  }

  return (
    <div className="w-full">
      <label
        className={cn(
          'flex flex-col items-center justify-center w-full aspect-[4/3] rounded-lg border-2 border-dashed cursor-pointer transition-colors',
          isDragging
            ? 'border-primary bg-primary/5'
            : 'border-muted-foreground/25 hover:border-muted-foreground/50 hover:bg-muted/50',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center p-6 text-center">
          <div className="p-3 rounded-full bg-muted mb-4">
            {isDragging ? (
              <Upload className="h-8 w-8 text-primary" />
            ) : (
              <ImageIcon className="h-8 w-8 text-muted-foreground" />
            )}
          </div>
          <p className="text-sm font-medium text-foreground mb-1">
            {isDragging ? 'Drop your image here' : 'Drag and drop your image'}
          </p>
          <p className="text-xs text-muted-foreground mb-3">
            or click to browse
          </p>
          <p className="text-xs text-muted-foreground">
            Supports: JPG, PNG, WebP (max {maxSizeMB}MB)
          </p>
        </div>
        <input
          type="file"
          className="hidden"
          accept={acceptedFormats.join(',')}
          onChange={handleInputChange}
          disabled={disabled}
        />
      </label>
      {error && (
        <p className="mt-2 text-sm text-destructive">{error}</p>
      )}
    </div>
  )
}
