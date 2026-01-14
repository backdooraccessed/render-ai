import Replicate from 'replicate'
import { buildNaturalPrompt } from './prompts'

const replicate = process.env.REPLICATE_API_TOKEN
  ? new Replicate({ auth: process.env.REPLICATE_API_TOKEN })
  : null

interface GenerationParams {
  imageUrl: string
  userPrompt: string
  strength?: number
  numOutputs?: number
  negativePrompt?: string
  seed?: number
  referenceImageUrl?: string
}

interface GenerationResult {
  success: boolean
  outputUrls?: string[]
  predictionId?: string
  error?: string
  isMock?: boolean
}

export async function generateInteriorRender(params: GenerationParams): Promise<GenerationResult> {
  const {
    imageUrl,
    userPrompt,
    numOutputs = 1,
    seed,
  } = params

  // Check if Replicate is configured
  if (!replicate) {
    console.log('Replicate API not configured, returning mock result')
    const mockOutputs = Array.from({ length: numOutputs }, () => imageUrl)
    return {
      success: true,
      outputUrls: mockOutputs,
      predictionId: 'mock-' + Date.now(),
      isMock: true,
    }
  }

  try {
    let { prompt } = buildNaturalPrompt(userPrompt)

    // Enhance prompt for interior design editing
    prompt = `Transform this room: ${prompt}. Professional interior photography, high quality, detailed, sharp focus, well-lit, photorealistic`

    // Build input params for P-Image-Edit (fast ~2 second generation)
    const inputParams: Record<string, unknown> = {
      images: [imageUrl],
      prompt: prompt,
      turbo: true,
      aspect_ratio: 'match_input_image',
    }

    // Add seed if provided
    if (seed !== undefined) {
      inputParams.seed = seed
    }

    // Generate outputs (run multiple times for multiple outputs)
    const outputUrls: string[] = []

    for (let i = 0; i < numOutputs; i++) {
      // Add variation to seed for multiple outputs
      if (numOutputs > 1 && seed === undefined) {
        inputParams.seed = Math.floor(Math.random() * 1000000) + i
      } else if (seed !== undefined && i > 0) {
        inputParams.seed = seed + i
      }

      // Using P-Image-Edit for fast img2img (~2 seconds)
      const output = await replicate.run(
        'prunaai/p-image-edit',
        {
          input: inputParams,
        }
      )

      // Parse output
      if (Array.isArray(output)) {
        for (const item of output) {
          if (item && typeof item === 'object' && 'toString' in item) {
            outputUrls.push(item.toString())
          } else if (typeof item === 'string') {
            outputUrls.push(item)
          }
        }
      } else if (typeof output === 'string') {
        outputUrls.push(output)
      } else if (output && typeof output === 'object' && 'toString' in output) {
        outputUrls.push(output.toString())
      }
    }

    if (outputUrls.length === 0) {
      return {
        success: false,
        error: 'No output generated',
      }
    }

    return {
      success: true,
      outputUrls,
      predictionId: 'p-image-edit-' + Date.now(),
    }
  } catch (error) {
    console.error('Replicate generation error:', error)
    const errorMessage = error instanceof Error
      ? error.message
      : typeof error === 'object' && error !== null
        ? JSON.stringify(error)
        : 'Generation failed'
    return {
      success: false,
      error: errorMessage,
    }
  }
}

export function isReplicateConfigured(): boolean {
  return !!process.env.REPLICATE_API_TOKEN
}
