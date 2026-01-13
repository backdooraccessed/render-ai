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

/**
 * Map SDXL-style strength (0.2-0.8) to Flux denoising (0.6-0.95)
 * Flux requires higher denoising values for visible changes
 */
function mapStrengthToFluxDenoising(strength: number): number {
  // SDXL strength 0.2 → Flux 0.6 (minimal change)
  // SDXL strength 0.5 → Flux 0.75 (moderate change)
  // SDXL strength 0.8 → Flux 0.9 (significant change)
  const minFlux = 0.6
  const maxFlux = 0.92
  const normalized = Math.max(0, Math.min(1, strength))
  return minFlux + (normalized * (maxFlux - minFlux))
}

export async function generateInteriorRender(params: GenerationParams): Promise<GenerationResult> {
  const {
    imageUrl,
    userPrompt,
    strength = 0.5,
    numOutputs = 1,
    negativePrompt: customNegativePrompt,
    seed,
    referenceImageUrl,
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
    let { prompt } = buildNaturalPrompt(userPrompt)

    // Enhance prompt for interior design quality
    prompt = `${prompt}, professional interior photography, high quality, detailed, sharp focus, well-lit`

    // If reference image provided, enhance prompt for style transfer
    if (referenceImageUrl) {
      prompt = `${prompt}, with consistent style and aesthetic from the reference image, matching color palette and design elements`
    }

    // Map strength to Flux denoising value
    const denoising = mapStrengthToFluxDenoising(strength)

    // Generate multiple outputs sequentially (Flux model does 1 at a time)
    const outputUrls: string[] = []

    for (let i = 0; i < numOutputs; i++) {
      // Build input params for Flux img2img
      const inputParams: Record<string, unknown> = {
        image: imageUrl,
        positive_prompt: prompt,
        denoising: denoising,
        steps: 28, // Higher steps for better quality
        sampler_name: 'euler',
        scheduler: 'simple',
      }

      // Add seed if provided (increment for variations)
      if (seed !== undefined) {
        inputParams.seed = seed + i
      } else if (numOutputs > 1) {
        // Use random seeds for variations
        inputParams.seed = Math.floor(Math.random() * 1000000) + i
      }

      // Using Flux img2img for higher quality interior rendering
      const output = await replicate.run(
        'bxclib2/flux_img2img:0ce45202d83c6bd379dfe58f4c0c41e6cadf93ebbd9d938cc63cc0f2fcb729a5',
        {
          input: inputParams,
        }
      )

      // Output is a single URL string
      if (typeof output === 'string') {
        outputUrls.push(output)
      } else if (Array.isArray(output) && output.length > 0) {
        outputUrls.push(output[0] as string)
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
      predictionId: 'flux-' + Date.now(),
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
