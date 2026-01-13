import Replicate from 'replicate'
import { buildNaturalPrompt } from './prompts'

const replicate = process.env.REPLICATE_API_TOKEN
  ? new Replicate({ auth: process.env.REPLICATE_API_TOKEN })
  : null

interface GenerationParams {
  imageUrl: string
  userPrompt: string
  strength?: number
}

interface GenerationResult {
  success: boolean
  outputUrl?: string
  predictionId?: string
  error?: string
  isMock?: boolean
}

export async function generateInteriorRender(params: GenerationParams): Promise<GenerationResult> {
  const { imageUrl, userPrompt, strength = 0.5 } = params

  // Check if Replicate is configured
  if (!replicate) {
    console.log('Replicate API not configured, returning mock result')
    return {
      success: true,
      outputUrl: imageUrl, // Return input image as mock output
      predictionId: 'mock-' + Date.now(),
      isMock: true,
    }
  }

  try {
    const { prompt, negativePrompt } = buildNaturalPrompt(userPrompt)

    // Using SDXL img2img for interior rendering
    // Lower prompt_strength (0.5) preserves more of the original image structure
    const output = await replicate.run(
      'stability-ai/sdxl:7762fd07cf82c948538e41f63f77d685e02b063e37e496e96eefd46c929f9bdc',
      {
        input: {
          image: imageUrl,
          prompt: prompt,
          negative_prompt: negativePrompt,
          num_inference_steps: 30,
          guidance_scale: 7.5,
          prompt_strength: strength, // User-controlled: lower = preserve more original
          scheduler: 'K_EULER',
        },
      }
    )

    // Output is an array of URLs
    const outputUrl = Array.isArray(output) ? output[0] : output

    return {
      success: true,
      outputUrl: outputUrl as string,
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
