import Replicate from 'replicate'

const replicate = process.env.REPLICATE_API_TOKEN
  ? new Replicate({ auth: process.env.REPLICATE_API_TOKEN })
  : null

export type UpscaleScale = 2 | 4

interface UpscaleParams {
  imageUrl: string
  scale?: UpscaleScale
}

interface UpscaleResult {
  success: boolean
  outputUrl?: string
  error?: string
  isMock?: boolean
}

export async function upscaleImage(params: UpscaleParams): Promise<UpscaleResult> {
  const { imageUrl, scale = 2 } = params

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
    // Using Real-ESRGAN for upscaling
    // Model: nightmareai/real-esrgan
    const output = await replicate.run(
      'nightmareai/real-esrgan:f121d640bd286e1fdc67f9799164c1d5be36ff74576ee11c803ae5b665dd46aa',
      {
        input: {
          image: imageUrl,
          scale: scale,
          face_enhance: false, // Interior images don't need face enhancement
        },
      }
    )

    // Output is a single URL string
    const outputUrl = output as unknown as string

    return {
      success: true,
      outputUrl,
    }
  } catch (error) {
    console.error('Upscale error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Upscaling failed',
    }
  }
}

export function isReplicateConfigured(): boolean {
  return !!process.env.REPLICATE_API_TOKEN
}
