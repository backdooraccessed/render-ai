'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { ImageUpload } from '@/components/image-upload'
import { RoomTypePicker } from '@/components/staging/room-type-picker'
import { StyleBundles } from '@/components/staging/style-bundles'
import { FurnitureSelector } from '@/components/staging/furniture-selector'
import { ImageCompareSlider } from '@/components/ui/image-compare-slider'
import {
  buildStagingPrompt,
  type StyleBundle,
  type FurnitureItem,
  STYLE_BUNDLES,
} from '@/lib/staging-data'
import { fileToBase64 } from '@/lib/utils'
import {
  ArrowLeft,
  Loader2,
  Sparkles,
  Download,
  RefreshCw,
  Home,
} from 'lucide-react'
import { toast } from 'sonner'

export default function StagingPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null)

  const [roomType, setRoomType] = useState<string>('living')
  const [selectedStyle, setSelectedStyle] = useState<StyleBundle>(STYLE_BUNDLES[0])
  const [selectedFurniture, setSelectedFurniture] = useState<FurnitureItem[]>([])
  const [customPrompt, setCustomPrompt] = useState('')

  const [isLoading, setIsLoading] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [resultUrl, setResultUrl] = useState<string | null>(null)

  const handleImageSelect = useCallback(async (file: File, preview: string) => {
    setSelectedFile(file)
    setPreviewUrl(preview)
    setResultUrl(null)

    // Upload image to get URL for staging API
    setIsUploading(true)
    try {
      const imageData = await fileToBase64(file)

      const response = await fetch('/api/generations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageData,
          type: 'upload-only',
        }),
      })

      const data = await response.json()
      if (data.success && data.imageUrl) {
        setUploadedImageUrl(data.imageUrl)
      }
    } catch (error) {
      console.error('Upload error:', error)
    } finally {
      setIsUploading(false)
    }
  }, [])

  const handleImageClear = useCallback(() => {
    setSelectedFile(null)
    setPreviewUrl(null)
    setUploadedImageUrl(null)
    setResultUrl(null)
  }, [])

  const handleStage = async () => {
    if (!previewUrl || !selectedStyle) {
      toast.error('Please upload an image and select a style')
      return
    }

    setIsLoading(true)
    setResultUrl(null)

    try {
      // Build the staging prompt
      const prompt = buildStagingPrompt(
        roomType,
        selectedStyle,
        selectedFurniture,
        customPrompt
      )

      // If we have an uploaded URL, use it; otherwise upload the image first
      let imageUrl = uploadedImageUrl

      if (!imageUrl) {
        const imageData = await fileToBase64(selectedFile!)
        // Upload directly in the staging request
        const uploadResponse = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            imageData,
            prompt,
          }),
        })

        const uploadData = await uploadResponse.json()
        if (uploadData.success && uploadData.generation?.output_image_url) {
          setResultUrl(uploadData.generation.output_image_url)
          toast.success('Staging complete!')
          return
        }
      }

      // Use staging API
      const response = await fetch('/api/stage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageUrl: imageUrl || previewUrl,
          prompt,
          roomType,
          style: selectedStyle.name,
        }),
      })

      const data = await response.json()

      if (data.success && data.outputUrl) {
        setResultUrl(data.outputUrl)
        toast.success('Staging complete!')
      } else {
        toast.error(data.error || 'Staging failed')
      }
    } catch (error) {
      console.error('Staging error:', error)
      toast.error('Failed to stage room')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDownload = async () => {
    if (!resultUrl) return

    try {
      const response = await fetch(resultUrl)
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `staged-${roomType}-${selectedStyle.id}-${Date.now()}.jpg`
      document.body.appendChild(a)
      a.click()
      URL.revokeObjectURL(url)
      document.body.removeChild(a)
      toast.success('Downloaded')
    } catch (error) {
      console.error('Download failed:', error)
      toast.error('Download failed')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/app">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div className="flex items-center gap-2">
              <Home className="h-5 w-5 text-primary" />
              <span className="font-semibold">Virtual Staging</span>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Image & Result */}
          <div className="space-y-6">
            {/* Image Upload */}
            <Card>
              <CardHeader>
                <CardTitle>Upload Empty Room</CardTitle>
                <CardDescription>
                  Upload a photo of an empty or unfurnished room to stage
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!previewUrl ? (
                  <ImageUpload
                    onImageSelect={handleImageSelect}
                    onImageClear={handleImageClear}
                    selectedImage={previewUrl}
                  />
                ) : resultUrl ? (
                  <div className="space-y-4">
                    <ImageCompareSlider
                      beforeImage={previewUrl}
                      afterImage={resultUrl}
                      beforeLabel="Empty"
                      afterLabel="Staged"
                    />
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={handleDownload}
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setResultUrl(null)}
                      >
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Try Again
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="relative aspect-[4/3] rounded-lg overflow-hidden border">
                      <img
                        src={previewUrl}
                        alt="Room to stage"
                        className="w-full h-full object-cover"
                      />
                      {isUploading && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <Loader2 className="h-8 w-8 animate-spin text-white" />
                        </div>
                      )}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleImageClear}
                    >
                      Change Image
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Staging Options */}
          <div className="space-y-6">
            {/* Room Type */}
            <Card>
              <CardHeader>
                <CardTitle>Room Type</CardTitle>
                <CardDescription>
                  What type of room is this?
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RoomTypePicker
                  selectedRoom={roomType}
                  onRoomSelect={setRoomType}
                  disabled={isLoading}
                />
              </CardContent>
            </Card>

            {/* Style Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Design Style</CardTitle>
                <CardDescription>
                  Choose a style for your staged room
                </CardDescription>
              </CardHeader>
              <CardContent>
                <StyleBundles
                  selectedStyle={selectedStyle}
                  onStyleSelect={setSelectedStyle}
                  disabled={isLoading}
                />
              </CardContent>
            </Card>

            {/* Furniture Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Furniture (Optional)</CardTitle>
                <CardDescription>
                  Select specific items to add to the room
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FurnitureSelector
                  roomType={roomType}
                  selectedItems={selectedFurniture}
                  onSelectionChange={setSelectedFurniture}
                  disabled={isLoading}
                />
              </CardContent>
            </Card>

            {/* Custom Instructions */}
            <Card>
              <CardHeader>
                <CardTitle>Custom Instructions (Optional)</CardTitle>
                <CardDescription>
                  Add any specific requirements
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="e.g., Large windows with natural light, keep the fireplace visible..."
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  disabled={isLoading}
                  rows={3}
                />
              </CardContent>
            </Card>

            {/* Generate Button */}
            <Button
              className="w-full h-12 text-lg"
              onClick={handleStage}
              disabled={isLoading || !previewUrl || !selectedStyle}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Staging Room...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" />
                  Stage This Room
                </>
              )}
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
