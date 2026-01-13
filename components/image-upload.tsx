'use client'

import { useCallback, useState } from 'react'
import { cn, formatFileSize } from '@/lib/utils'
import { Upload, X, Image as ImageIcon, Link, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface ImageUploadProps {
  onImageSelect: (file: File, previewUrl: string) => void
  onImageClear: () => void
  selectedImage: string | null
  disabled?: boolean
  maxSizeMB?: number
  acceptedFormats?: string[]
  onUrlSelect?: (url: string) => void
}

const DEFAULT_MAX_SIZE_MB = 10
const DEFAULT_ACCEPTED_FORMATS = ['image/jpeg', 'image/png', 'image/webp']

type InputMode = 'upload' | 'url'

export function ImageUpload({
  onImageSelect,
  onImageClear,
  selectedImage,
  disabled = false,
  maxSizeMB = DEFAULT_MAX_SIZE_MB,
  acceptedFormats = DEFAULT_ACCEPTED_FORMATS,
  onUrlSelect,
}: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [inputMode, setInputMode] = useState<InputMode>('upload')
  const [urlInput, setUrlInput] = useState('')
  const [isLoadingUrl, setIsLoadingUrl] = useState(false)

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
    setUrlInput('')
    onImageClear()
  }, [onImageClear])

  const handleUrlSubmit = useCallback(async () => {
    if (!urlInput.trim()) {
      setError('Please enter a URL')
      return
    }

    // Basic URL validation
    try {
      new URL(urlInput)
    } catch {
      setError('Please enter a valid URL')
      return
    }

    setIsLoadingUrl(true)
    setError(null)

    try {
      // Fetch the image to validate it
      const response = await fetch(urlInput)
      if (!response.ok) {
        throw new Error('Failed to fetch image')
      }

      const contentType = response.headers.get('content-type')
      if (!contentType?.startsWith('image/')) {
        throw new Error('URL does not point to a valid image')
      }

      const blob = await response.blob()

      // Check file size
      if (blob.size > maxSizeMB * 1024 * 1024) {
        throw new Error(`Image too large. Maximum size: ${maxSizeMB}MB`)
      }

      // Create a file from the blob
      const file = new File([blob], 'image-from-url', { type: contentType })
      const previewUrl = URL.createObjectURL(blob)

      onImageSelect(file, previewUrl)
      if (onUrlSelect) {
        onUrlSelect(urlInput)
      }
    } catch (err) {
      console.error('URL fetch error:', err)
      setError(err instanceof Error ? err.message : 'Failed to load image from URL')
    } finally {
      setIsLoadingUrl(false)
    }
  }, [urlInput, maxSizeMB, onImageSelect, onUrlSelect])

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
      {/* Input Mode Tabs */}
      <div className="flex gap-1 mb-3 p-1 bg-muted rounded-lg w-fit">
        <button
          type="button"
          onClick={() => {
            setInputMode('upload')
            setError(null)
          }}
          className={cn(
            "px-3 py-1.5 text-xs font-medium rounded-md transition-colors",
            inputMode === 'upload'
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
          disabled={disabled}
        >
          <Upload className="h-3 w-3 inline mr-1" />
          Upload
        </button>
        <button
          type="button"
          onClick={() => {
            setInputMode('url')
            setError(null)
          }}
          className={cn(
            "px-3 py-1.5 text-xs font-medium rounded-md transition-colors",
            inputMode === 'url'
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
          disabled={disabled}
        >
          <Link className="h-3 w-3 inline mr-1" />
          URL
        </button>
      </div>

      {inputMode === 'upload' ? (
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
      ) : (
        <div className="w-full aspect-[4/3] rounded-lg border-2 border-dashed border-muted-foreground/25 flex flex-col items-center justify-center p-6">
          <div className="p-3 rounded-full bg-muted mb-4">
            <Link className="h-8 w-8 text-muted-foreground" />
          </div>
          <p className="text-sm font-medium text-foreground mb-4">
            Enter an image URL
          </p>
          <div className="w-full max-w-sm space-y-3">
            <Input
              type="url"
              placeholder="https://example.com/image.jpg"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              disabled={disabled || isLoadingUrl}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  handleUrlSubmit()
                }
              }}
            />
            <Button
              type="button"
              onClick={handleUrlSubmit}
              disabled={disabled || isLoadingUrl || !urlInput.trim()}
              className="w-full"
              size="sm"
            >
              {isLoadingUrl ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Loading...
                </>
              ) : (
                'Load Image'
              )}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            Supports: JPG, PNG, WebP (max {maxSizeMB}MB)
          </p>
        </div>
      )}

      {error && (
        <p className="mt-2 text-sm text-destructive">{error}</p>
      )}
    </div>
  )
}
