import Replicate from 'replicate'

const replicate = process.env.REPLICATE_API_TOKEN
  ? new Replicate({ auth: process.env.REPLICATE_API_TOKEN })
  : null

interface InpaintParams {
  imageUrl: string
  maskUrl: string
  prompt: string
  negativePrompt?: string
}

interface InpaintResult {
  success: boolean
  outputUrl?: string
  error?: string
  isMock?: boolean
}

export async function inpaintImage(params: InpaintParams): Promise<InpaintResult> {
  const { imageUrl, maskUrl, prompt, negativePrompt } = params

  // Check if Replicate is configured
  if (!replicate) {
    console.log('Replicate API not configured, returning mock result')
    return {
      success: true,
      outputUrl: imageUrl, // Return same image as mock
      isMock: true,
    }
  }

  try {
    // Using SDXL inpainting model
    const output = await replicate.run(
      'stability-ai/sdxl:7762fd07cf82c948538e41f63f77d685e02b063e37e496e96eefd46c929f9bdc',
      {
        input: {
          image: imageUrl,
          mask: maskUrl,
          prompt: prompt,
          negative_prompt: negativePrompt || 'blurry, low quality, distorted',
          num_inference_steps: 30,
          guidance_scale: 7.5,
          scheduler: 'K_EULER',
          refine: 'expert_ensemble_refiner',
          high_noise_frac: 0.8,
        },
      }
    )

    // Output is typically an array with one URL
    const outputUrl = Array.isArray(output) ? output[0] : output

    return {
      success: true,
      outputUrl: outputUrl as string,
    }
  } catch (error) {
    console.error('Inpaint error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Inpainting failed',
    }
  }
}
