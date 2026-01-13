import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { upscaleImage, UpscaleScale } from '@/lib/upscale'

export const maxDuration = 120 // Upscaling can take longer

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { generationId, imageUrl, scale = 2 } = body

    // Validate inputs
    if (!imageUrl) {
      return NextResponse.json(
        { success: false, error: 'Image URL is required' },
        { status: 400 }
      )
    }

    if (![2, 4].includes(scale)) {
      return NextResponse.json(
        { success: false, error: 'Scale must be 2 or 4' },
        { status: 400 }
      )
    }

    // Upscale the image
    const result = await upscaleImage({
      imageUrl,
      scale: scale as UpscaleScale,
    })

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      )
    }

    // If we have a generation ID, upload to Supabase and update record
    let finalUrl = result.outputUrl

    if (generationId && result.outputUrl && !result.isMock) {
      const supabase = await createClient()

      try {
        // Download and re-upload to Supabase Storage
        const response = await fetch(result.outputUrl)
        const blob = await response.blob()
        const buffer = Buffer.from(await blob.arrayBuffer())
        const fileName = `upscaled-${generationId}-${scale}x-${Date.now()}.jpg`

        const { error: uploadError } = await supabase.storage
          .from('renders')
          .upload(fileName, buffer, {
            contentType: 'image/jpeg',
            upsert: false,
          })

        if (!uploadError) {
          const { data: publicUrl } = supabase.storage
            .from('renders')
            .getPublicUrl(fileName)
          finalUrl = publicUrl.publicUrl

          // Update generation record with upscaled URL
          await supabase
            .from('generations')
            .update({ upscaled_image_url: finalUrl })
            .eq('id', generationId)
        }
      } catch (e) {
        console.error('Failed to store upscaled image:', e)
        // Continue with original URL if storage fails
      }
    }

    return NextResponse.json({
      success: true,
      upscaledUrl: finalUrl,
      scale,
      isMock: result.isMock,
    })
  } catch (error) {
    console.error('Upscale API error:', error)
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}
