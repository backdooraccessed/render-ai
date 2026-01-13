'use client'

import { useState, useCallback } from 'react'
import { ImageUpload } from '@/components/image-upload'
import { PromptInput } from '@/components/prompt-input'
import { StylePresets } from '@/components/style-presets'
import { StrengthSlider } from '@/components/strength-slider'
import { OutputCountSelector } from '@/components/output-count-selector'
import { NegativePromptInput } from '@/components/negative-prompt-input'
import { PromptHistory } from '@/components/prompt-history'
import { SeedControl } from '@/components/seed-control'
import { ReferenceImageUpload } from '@/components/reference-image-upload'
import { GenerateButton } from '@/components/generate-button'
import { GenerationResult } from '@/components/generation-result'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { OnboardingTour } from '@/components/onboarding-tour'
import { FirstGenerationCelebration } from '@/components/ui/success-animation'
import { useFirstGeneration } from '@/lib/hooks/use-first-visit'
import { fileToBase64, getSessionId } from '@/lib/utils'
import type { Generation } from '@/types'
import { Info } from 'lucide-react'

export default function GeneratePage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [referenceFile, setReferenceFile] = useState<File | null>(null)
  const [referencePreviewUrl, setReferencePreviewUrl] = useState<string | null>(null)
  const [prompt, setPrompt] = useState('')
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null)
  const [strength, setStrength] = useState(0.5)
  const [numOutputs, setNumOutputs] = useState(1)
  const [negativePrompt, setNegativePrompt] = useState('')
  const [seed, setSeed] = useState<number | undefined>(undefined)
  const [isLoading, setIsLoading] = useState(false)
  const [generation, setGeneration] = useState<Generation | null>(null)
  const [isMock, setIsMock] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // First generation celebration
  const { showCelebration, markFirstGeneration, closeCelebration } = useFirstGeneration()

  const handleImageSelect = useCallback((file: File, preview: string) => {
    setSelectedFile(file)
    setPreviewUrl(preview)
    setGeneration(null)
    setError(null)
  }, [])

  const handleImageClear = useCallback(() => {
    setSelectedFile(null)
    setPreviewUrl(null)
    setGeneration(null)
    setError(null)
  }, [])

  const handleReferenceSelect = useCallback((file: File, preview: string) => {
    setReferenceFile(file)
    setReferencePreviewUrl(preview)
  }, [])

  const handleReferenceClear = useCallback(() => {
    setReferenceFile(null)
    setReferencePreviewUrl(null)
  }, [])

  const handleStyleSelect = useCallback((styleName: string, stylePrompt: string) => {
    setSelectedStyle(styleName)
    setPrompt(stylePrompt)
  }, [])

  const handleGenerate = useCallback(async () => {
    if (!selectedFile || !prompt.trim()) return

    setIsLoading(true)
    setError(null)
    setGeneration(null)

    try {
      const imageData = await fileToBase64(selectedFile)
      const referenceImageData = referenceFile ? await fileToBase64(referenceFile) : undefined
      const sessionId = getSessionId()

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageData,
          referenceImageData,
          prompt: prompt.trim(),
          strength,
          numOutputs,
          negativePrompt: negativePrompt.trim() || undefined,
          seed,
          sessionId,
        }),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        setError(data.error || 'Generation failed')
        return
      }

      setGeneration(data.generation)
      setIsMock(data.isMock || false)

      // Trigger first generation celebration
      markFirstGeneration()
    } catch (err) {
      console.error('Generation error:', err)
      setError('Failed to connect to server')
    } finally {
      setIsLoading(false)
    }
  }, [selectedFile, prompt, strength, numOutputs])

  const handleRegenerate = useCallback(() => {
    handleGenerate()
  }, [handleGenerate])

  const canGenerate = selectedFile && prompt.trim() && !isLoading

  return (
    <div className="bg-background">
      {/* Onboarding tour for first-time users */}
      <OnboardingTour />

      {/* First generation celebration modal */}
      <FirstGenerationCelebration show={showCelebration} onClose={closeCelebration} />

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            Generate Render
          </h1>
          <p className="text-muted-foreground">
            Transform your interior photos with natural language
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Input */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Upload Image</CardTitle>
                <CardDescription>
                  Upload a room photo, sketch, or 3D screenshot
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ImageUpload
                  onImageSelect={handleImageSelect}
                  onImageClear={handleImageClear}
                  selectedImage={previewUrl}
                  disabled={isLoading}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Style Reference</CardTitle>
                <CardDescription>
                  Optional: Upload an image to guide the style
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ReferenceImageUpload
                  onImageSelect={handleReferenceSelect}
                  onImageClear={handleReferenceClear}
                  selectedImage={referencePreviewUrl}
                  disabled={isLoading}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Describe Changes</CardTitle>
                <CardDescription>
                  Choose a style preset or describe changes in natural language
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <StylePresets
                  selectedStyle={selectedStyle}
                  onStyleSelect={handleStyleSelect}
                  disabled={isLoading}
                />
                <PromptInput
                  value={prompt}
                  onChange={(value) => {
                    setPrompt(value)
                    // Clear selected style when user manually edits
                    if (selectedStyle) setSelectedStyle(null)
                  }}
                  disabled={isLoading}
                />
                <NegativePromptInput
                  value={negativePrompt}
                  onChange={setNegativePrompt}
                  disabled={isLoading}
                />
                <PromptHistory
                  currentPrompt={prompt}
                  onSelectPrompt={setPrompt}
                  disabled={isLoading}
                />
                <StrengthSlider
                  value={strength}
                  onChange={setStrength}
                  disabled={isLoading}
                />
                <OutputCountSelector
                  value={numOutputs}
                  onChange={setNumOutputs}
                  disabled={isLoading}
                />
                <SeedControl
                  value={seed}
                  onChange={setSeed}
                  disabled={isLoading}
                />
              </CardContent>
            </Card>

            <GenerateButton
              onClick={handleGenerate}
              disabled={!canGenerate}
              isLoading={isLoading}
            />

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </div>

          {/* Right Column - Output */}
          <div className="space-y-6">
            <GenerationResult
              generation={generation}
              inputImageUrl={previewUrl}
              isLoading={isLoading}
              isMock={isMock}
              onRegenerate={generation ? handleRegenerate : undefined}
            />

            {/* Tips */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex gap-3">
                  <Info className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                  <div className="text-sm text-muted-foreground space-y-2">
                    <p className="font-medium text-foreground">Tips for best results:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Be specific about what you want to change</li>
                      <li>Lower strength preserves more of the original</li>
                      <li>Works best with clear, well-lit photos</li>
                      <li>Try prompts like &quot;add plants&quot; or &quot;change to wooden floors&quot;</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
