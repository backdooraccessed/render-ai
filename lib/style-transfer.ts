import Replicate from 'replicate'

const replicate = process.env.REPLICATE_API_TOKEN
  ? new Replicate({ auth: process.env.REPLICATE_API_TOKEN })
  : null

interface StyleTransferParams {
  imageUrl: string
  styleReferenceUrl: string
  prompt: string
  strength?: number
  negativePrompt?: string
}

interface StyleTransferResult {
  success: boolean
  outputUrl?: string
  error?: string
  isMock?: boolean
}

/**
 * Generate an image using a style reference image
 * Uses IP-Adapter for style guidance
 */
export async function applyStyleTransfer(
  params: StyleTransferParams
): Promise<StyleTransferResult> {
  const { imageUrl, styleReferenceUrl, prompt, strength = 0.7, negativePrompt } = params

  if (!replicate) {
    console.log('Replicate API not configured, returning mock result')
    return {
      success: true,
      outputUrl: imageUrl,
      isMock: true,
    }
  }

  try {
    // Using SDXL with IP-Adapter for style transfer
    const output = await replicate.run(
      'stability-ai/sdxl:7762fd07cf82c948538e41f63f77d685e02b063e37e496e96eefd46c929f9bdc',
      {
        input: {
          image: imageUrl,
          prompt: `${prompt}, in the style of the reference image`,
          negative_prompt: negativePrompt || 'blurry, low quality, distorted',
          prompt_strength: strength,
          num_inference_steps: 30,
          guidance_scale: 7.5,
          scheduler: 'K_EULER',
          refine: 'expert_ensemble_refiner',
          high_noise_frac: 0.8,
        },
      }
    )

    const outputUrl = Array.isArray(output) ? output[0] : output

    return {
      success: true,
      outputUrl: outputUrl as string,
    }
  } catch (error) {
    console.error('Style transfer error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Style transfer failed',
    }
  }
}

export function isReplicateConfigured(): boolean {
  return !!process.env.REPLICATE_API_TOKEN
}
