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
    strength = 0.5,
    numOutputs = 1,
    negativePrompt: customNegativePrompt,
    seed,
  } = params

  // Check if Replicate is configured
  if (!replicate) {
    console.log('Replicate API not configured, returning mock result')
    // Return mock outputs based on numOutputs
    const mockOutputs = Array.from({ length: numOutputs }, () => imageUrl)
    return {
      success: true,
      outputUrls: mockOutputs,
      predictionId: 'mock-' + Date.now(),
      isMock: true,
    }
  }

  try {
    const { prompt, negativePrompt: defaultNegativePrompt } = buildNaturalPrompt(userPrompt)

    // Combine custom negative prompt with defaults
    const negativePrompt = customNegativePrompt
      ? `${customNegativePrompt}, ${defaultNegativePrompt}`
      : defaultNegativePrompt

    // Build input params
    const inputParams: Record<string, unknown> = {
      image: imageUrl,
      prompt: prompt,
      negative_prompt: negativePrompt,
      num_inference_steps: 30,
      guidance_scale: 7.5,
      prompt_strength: strength,
      scheduler: 'K_EULER',
      num_outputs: numOutputs,
    }

    // Add seed if provided (for reproducibility)
    if (seed !== undefined) {
      inputParams.seed = seed
    }

    // Using SDXL img2img for interior rendering
    const output = await replicate.run(
      'stability-ai/sdxl:7762fd07cf82c948538e41f63f77d685e02b063e37e496e96eefd46c929f9bdc',
      {
        input: inputParams,
      }
    )

    // Output is an array of URLs
    const outputUrls = Array.isArray(output) ? (output as unknown as string[]) : [output as unknown as string]

    return {
      success: true,
      outputUrls,
      predictionId: 'replicate-' + Date.now(),
    }
  } catch (error) {
    console.error('Replicate generation error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Generation failed',
    }
  }
}

export function isReplicateConfigured(): boolean {
  return !!process.env.REPLICATE_API_TOKEN
}
