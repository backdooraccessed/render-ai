'use client'

import { useState } from 'react'
import { BatchUpload } from '@/components/batch-upload'
import { PromptInput } from '@/components/prompt-input'
import { StylePresets } from '@/components/style-presets'
import { StrengthSlider } from '@/components/strength-slider'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Download, Info } from 'lucide-react'
import { toast } from 'sonner'

interface BatchResult {
  file: File
  preview: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  result?: {
    outputUrl?: string
    error?: string
  }
}

export default function BatchPage() {
  const [prompt, setPrompt] = useState('')
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null)
  const [strength, setStrength] = useState(0.5)
  const [results, setResults] = useState<BatchResult[]>([])

  const handleStyleSelect = (styleName: string, stylePrompt: string) => {
    setSelectedStyle(styleName)
    setPrompt(stylePrompt)
  }

  const handleBatchComplete = (batchResults: BatchResult[]) => {
    setResults(batchResults)
    const successCount = batchResults.filter(r => r.status === 'completed').length
    const failCount = batchResults.filter(r => r.status === 'failed').length

    if (successCount > 0) {
      toast.success(`${successCount} image${successCount !== 1 ? 's' : ''} processed successfully`)
    }
    if (failCount > 0) {
      toast.error(`${failCount} image${failCount !== 1 ? 's' : ''} failed`)
    }
  }

  const downloadAll = async () => {
    const completedResults = results.filter(r => r.status === 'completed' && r.result?.outputUrl)

    for (let i = 0; i < completedResults.length; i++) {
      const result = completedResults[i]
      if (!result.result?.outputUrl) continue

      try {
        const response = await fetch(result.result.outputUrl)
        const blob = await response.blob()
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `batch-render-${i + 1}.jpg`
        document.body.appendChild(a)
        a.click()
        URL.revokeObjectURL(url)
        document.body.removeChild(a)

        // Small delay between downloads
        await new Promise(resolve => setTimeout(resolve, 200))
      } catch (error) {
        console.error('Download failed:', error)
      }
    }

    toast.success('Downloads started')
  }

  const completedResults = results.filter(r => r.status === 'completed')

  return (
    <div className="bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            Batch Processing
          </h1>
          <p className="text-muted-foreground">
            Transform multiple images at once with the same style
          </p>
        </div>

        <div className="space-y-6">
          {/* Style and Prompt */}
          <Card>
            <CardHeader>
              <CardTitle>Style Settings</CardTitle>
              <CardDescription>
                Choose a style to apply to all images
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <StylePresets
                selectedStyle={selectedStyle}
                onStyleSelect={handleStyleSelect}
                disabled={false}
              />
              <PromptInput
                value={prompt}
                onChange={(value) => {
                  setPrompt(value)
                  if (selectedStyle) setSelectedStyle(null)
                }}
                disabled={false}
              />
              <StrengthSlider
                value={strength}
                onChange={setStrength}
                disabled={false}
              />
            </CardContent>
          </Card>

          {/* Batch Upload */}
          <Card>
            <CardHeader>
              <CardTitle>Upload Images</CardTitle>
              <CardDescription>
                Upload up to 10 images for batch processing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BatchUpload
                prompt={prompt}
                strength={strength}
                onBatchComplete={handleBatchComplete}
                disabled={false}
                maxFiles={10}
              />
            </CardContent>
          </Card>

          {/* Results */}
          {completedResults.length > 0 && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Results</CardTitle>
                    <CardDescription>
                      {completedResults.length} image{completedResults.length !== 1 ? 's' : ''} completed
                    </CardDescription>
                  </div>
                  <Button onClick={downloadAll} size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Download All
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {completedResults.map((result, index) => (
                    <div
                      key={index}
                      className="aspect-[4/3] rounded-lg overflow-hidden border"
                    >
                      <img
                        src={result.result?.outputUrl}
                        alt={`Result ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Tips */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex gap-3">
                <Info className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                <div className="text-sm text-muted-foreground space-y-2">
                  <p className="font-medium text-foreground">Batch Processing Tips:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>All images will use the same prompt and settings</li>
                    <li>Processing time depends on the number of images</li>
                    <li>Failed images can be retried individually</li>
                    <li>Download all results at once when complete</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
