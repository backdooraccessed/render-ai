'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { InpaintCanvas } from '@/components/inpaint-canvas'
import { ArrowLeft, Loader2, Sparkles, Wand2 } from 'lucide-react'
import { toast } from 'sonner'
import type { Generation } from '@/types'

interface EditPageProps {
  params: Promise<{ id: string }>
}

export default function EditPage({ params }: EditPageProps) {
  const { id } = use(params)
  const router = useRouter()
  const [generation, setGeneration] = useState<Generation | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isInpainting, setIsInpainting] = useState(false)
  const [maskDataUrl, setMaskDataUrl] = useState<string | null>(null)
  const [prompt, setPrompt] = useState('')
  const [negativePrompt, setNegativePrompt] = useState('')
  const [resultUrl, setResultUrl] = useState<string | null>(null)

  // Fetch generation
  useEffect(() => {
    const fetchGeneration = async () => {
      try {
        const response = await fetch(`/api/generations/${id}`)
        const data = await response.json()

        if (data.success && data.generation) {
          setGeneration(data.generation)
        } else {
          toast.error('Generation not found')
          router.push('/app')
        }
      } catch (error) {
        console.error('Failed to fetch generation:', error)
        toast.error('Failed to load generation')
        router.push('/app')
      } finally {
        setIsLoading(false)
      }
    }

    fetchGeneration()
  }, [id, router])

  const handleInpaint = async () => {
    if (!generation?.output_image_url || !maskDataUrl || !prompt.trim()) {
      toast.error('Please draw a mask and enter a prompt')
      return
    }

    setIsInpainting(true)
    setResultUrl(null)

    try {
      const response = await fetch('/api/inpaint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          generationId: generation.id,
          imageUrl: generation.output_image_url,
          maskDataUrl,
          prompt,
          negativePrompt: negativePrompt || undefined,
        }),
      })

      const data = await response.json()

      if (data.success && data.outputUrl) {
        setResultUrl(data.outputUrl)
        toast.success('Inpainting complete!')
      } else {
        toast.error(data.error || 'Inpainting failed')
      }
    } catch (error) {
      console.error('Inpaint error:', error)
      toast.error('Failed to inpaint image')
    } finally {
      setIsInpainting(false)
    }
  }

  const handleDownloadResult = async () => {
    if (!resultUrl) return

    try {
      const response = await fetch(resultUrl)
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `render-edited-${generation?.id?.slice(0, 8) || 'image'}.jpg`
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!generation) {
    return null
  }

  const imageUrl = generation.output_image_url

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
              <Wand2 className="h-5 w-5 text-primary" />
              <span className="font-semibold">Edit Mode</span>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Canvas Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Draw Mask</CardTitle>
            </CardHeader>
            <CardContent>
              {imageUrl && (
                <InpaintCanvas
                  imageUrl={imageUrl}
                  onMaskChange={setMaskDataUrl}
                  disabled={isInpainting}
                />
              )}
            </CardContent>
          </Card>

          {/* Controls Section */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Describe Changes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    What should appear in the masked area?
                  </label>
                  <Textarea
                    placeholder="e.g., A modern leather sofa, A large window with city view, A fireplace..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    disabled={isInpainting}
                    rows={3}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    What to avoid (optional)
                  </label>
                  <Textarea
                    placeholder="e.g., blurry, low quality, cartoon..."
                    value={negativePrompt}
                    onChange={(e) => setNegativePrompt(e.target.value)}
                    disabled={isInpainting}
                    rows={2}
                  />
                </div>

                <Button
                  className="w-full"
                  onClick={handleInpaint}
                  disabled={isInpainting || !maskDataUrl || !prompt.trim()}
                >
                  {isInpainting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Apply Changes
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Result Section */}
            {resultUrl && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Result</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="rounded-lg overflow-hidden border mb-4">
                    <img
                      src={resultUrl}
                      alt="Edited result"
                      className="w-full"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={handleDownloadResult}
                    >
                      Download Result
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setMaskDataUrl(null)
                        setResultUrl(null)
                        setPrompt('')
                      }}
                    >
                      Edit Again
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
