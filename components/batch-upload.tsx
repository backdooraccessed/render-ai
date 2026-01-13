'use client'

import { useCallback, useState } from 'react'
import { cn } from '@/lib/utils'
import { Upload, X, Image as ImageIcon, Loader2, Check, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'

interface BatchFile {
  file: File
  preview: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  result?: {
    outputUrl?: string
    error?: string
  }
}

interface BatchUploadProps {
  onBatchComplete: (results: BatchFile[]) => void
  prompt: string
  strength: number
  disabled?: boolean
  maxFiles?: number
}

const DEFAULT_MAX_FILES = 10
const ACCEPTED_FORMATS = ['image/jpeg', 'image/png', 'image/webp']
const MAX_SIZE_MB = 10

export function BatchUpload({
  onBatchComplete,
  prompt,
  strength,
  disabled = false,
  maxFiles = DEFAULT_MAX_FILES,
}: BatchUploadProps) {
  const [files, setFiles] = useState<BatchFile[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)

  const validateFile = (file: File): string | null => {
    if (!ACCEPTED_FORMATS.includes(file.type)) {
      return 'Invalid format'
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      return 'File too large'
    }
    return null
  }

  const addFiles = useCallback((newFiles: FileList | File[]) => {
    const validFiles: BatchFile[] = []
    const fileArray = Array.from(newFiles)

    for (const file of fileArray) {
      if (files.length + validFiles.length >= maxFiles) break
      if (validateFile(file)) continue

      validFiles.push({
        file,
        preview: URL.createObjectURL(file),
        status: 'pending',
      })
    }

    setFiles(prev => [...prev, ...validFiles])
  }, [files.length, maxFiles])

  const removeFile = (index: number) => {
    setFiles(prev => {
      const newFiles = [...prev]
      URL.revokeObjectURL(newFiles[index].preview)
      newFiles.splice(index, 1)
      return newFiles
    })
  }

  const clearAll = () => {
    files.forEach(f => URL.revokeObjectURL(f.preview))
    setFiles([])
    setProgress(0)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    if (!disabled) addFiles(e.dataTransfer.files)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) addFiles(e.target.files)
  }

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = reject
    })
  }

  const processBatch = async () => {
    if (!prompt.trim() || files.length === 0) return

    setIsProcessing(true)
    setProgress(0)

    const updatedFiles = [...files]
    let completed = 0

    for (let i = 0; i < updatedFiles.length; i++) {
      updatedFiles[i].status = 'processing'
      setFiles([...updatedFiles])

      try {
        const imageData = await fileToBase64(updatedFiles[i].file)
        const sessionId = typeof window !== 'undefined'
          ? localStorage.getItem('render-ai-session') || ''
          : ''

        const response = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            imageData,
            prompt: prompt.trim(),
            strength,
            numOutputs: 1,
            sessionId,
          }),
        })

        const data = await response.json()

        if (data.success) {
          updatedFiles[i].status = 'completed'
          updatedFiles[i].result = { outputUrl: data.generation.output_image_url }
        } else {
          updatedFiles[i].status = 'failed'
          updatedFiles[i].result = { error: data.error || 'Generation failed' }
        }
      } catch (error) {
        updatedFiles[i].status = 'failed'
        updatedFiles[i].result = { error: 'Network error' }
      }

      completed++
      setProgress((completed / updatedFiles.length) * 100)
      setFiles([...updatedFiles])
    }

    setIsProcessing(false)
    onBatchComplete(updatedFiles)
  }

  const pendingCount = files.filter(f => f.status === 'pending').length
  const completedCount = files.filter(f => f.status === 'completed').length
  const failedCount = files.filter(f => f.status === 'failed').length

  return (
    <div className="space-y-4">
      {/* Drop zone */}
      <label
        className={cn(
          'flex flex-col items-center justify-center w-full min-h-[120px] rounded-lg border-2 border-dashed cursor-pointer transition-colors',
          isDragging
            ? 'border-primary bg-primary/5'
            : 'border-muted-foreground/25 hover:border-muted-foreground/50 hover:bg-muted/50',
          (disabled || isProcessing) && 'opacity-50 cursor-not-allowed'
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center p-4 text-center">
          <Upload className="h-6 w-6 text-muted-foreground mb-2" />
          <p className="text-sm font-medium">
            {isDragging ? 'Drop images here' : 'Drop multiple images or click to browse'}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {files.length}/{maxFiles} images (JPG, PNG, WebP)
          </p>
        </div>
        <input
          type="file"
          className="hidden"
          accept={ACCEPTED_FORMATS.join(',')}
          onChange={handleInputChange}
          multiple
          disabled={disabled || isProcessing || files.length >= maxFiles}
        />
      </label>

      {/* File grid */}
      {files.length > 0 && (
        <div className="space-y-3">
          <div className="grid grid-cols-5 gap-2">
            {files.map((batchFile, index) => (
              <div
                key={index}
                className={cn(
                  "relative aspect-square rounded-md overflow-hidden border-2",
                  batchFile.status === 'completed' && "border-green-500",
                  batchFile.status === 'failed' && "border-destructive",
                  batchFile.status === 'processing' && "border-primary",
                  batchFile.status === 'pending' && "border-transparent"
                )}
              >
                <img
                  src={batchFile.result?.outputUrl || batchFile.preview}
                  alt={`Batch image ${index + 1}`}
                  className="w-full h-full object-cover"
                />

                {/* Status overlay */}
                {batchFile.status === 'processing' && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <Loader2 className="h-5 w-5 text-white animate-spin" />
                  </div>
                )}
                {batchFile.status === 'completed' && (
                  <div className="absolute top-1 right-1 bg-green-500 text-white p-0.5 rounded-full">
                    <Check className="h-3 w-3" />
                  </div>
                )}
                {batchFile.status === 'failed' && (
                  <div className="absolute top-1 right-1 bg-destructive text-white p-0.5 rounded-full">
                    <AlertCircle className="h-3 w-3" />
                  </div>
                )}

                {/* Remove button (only for pending files) */}
                {batchFile.status === 'pending' && !isProcessing && (
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="absolute top-1 right-1 bg-background/80 rounded-full p-0.5 hover:bg-destructive hover:text-white transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Progress bar */}
          {isProcessing && (
            <div className="space-y-1">
              <Progress value={progress} />
              <p className="text-xs text-muted-foreground text-center">
                Processing {completedCount + failedCount}/{files.length}...
              </p>
            </div>
          )}

          {/* Status summary */}
          {!isProcessing && (completedCount > 0 || failedCount > 0) && (
            <p className="text-xs text-muted-foreground text-center">
              {completedCount > 0 && <span className="text-green-600">{completedCount} completed</span>}
              {completedCount > 0 && failedCount > 0 && ' · '}
              {failedCount > 0 && <span className="text-destructive">{failedCount} failed</span>}
            </p>
          )}

          {/* Action buttons */}
          <div className="flex gap-2">
            <Button
              type="button"
              onClick={processBatch}
              disabled={disabled || isProcessing || pendingCount === 0 || !prompt.trim()}
              className="flex-1"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                `Process ${pendingCount} Image${pendingCount !== 1 ? 's' : ''}`
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={clearAll}
              disabled={isProcessing}
            >
              Clear All
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
