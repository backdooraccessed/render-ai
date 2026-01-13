import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { inpaintImage } from '@/lib/inpaint'

export const maxDuration = 120 // Inpainting can take longer

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { generationId, imageUrl, maskDataUrl, prompt, negativePrompt } = body

    // Validate inputs
    if (!imageUrl) {
      return NextResponse.json(
        { success: false, error: 'Image URL is required' },
        { status: 400 }
      )
    }

    if (!maskDataUrl) {
      return NextResponse.json(
        { success: false, error: 'Mask is required' },
        { status: 400 }
      )
    }

    if (!prompt) {
      return NextResponse.json(
        { success: false, error: 'Prompt is required' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Upload mask to Supabase storage (needs to be a URL for Replicate)
    const maskBuffer = Buffer.from(maskDataUrl.split(',')[1], 'base64')
    const maskFileName = `masks/mask-${Date.now()}.png`

    const { error: maskUploadError } = await supabase.storage
      .from('renders')
      .upload(maskFileName, maskBuffer, {
        contentType: 'image/png',
        upsert: false,
      })

    if (maskUploadError) {
      console.error('Mask upload error:', maskUploadError)
      return NextResponse.json(
        { success: false, error: 'Failed to upload mask' },
        { status: 500 }
      )
    }

    const { data: maskPublicUrl } = supabase.storage
      .from('renders')
      .getPublicUrl(maskFileName)

    // Inpaint the image
    const result = await inpaintImage({
      imageUrl,
      maskUrl: maskPublicUrl.publicUrl,
      prompt,
      negativePrompt,
    })

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      )
    }

    // If we have an output, upload to Supabase
    let finalUrl = result.outputUrl

    if (result.outputUrl && !result.isMock) {
      try {
        const response = await fetch(result.outputUrl)
        const blob = await response.blob()
        const buffer = Buffer.from(await blob.arrayBuffer())
        const fileName = `inpainted-${generationId || 'new'}-${Date.now()}.jpg`

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
        }
      } catch (e) {
        console.error('Failed to store inpainted image:', e)
        // Continue with original URL if storage fails
      }
    }

    // Clean up mask file
    await supabase.storage.from('renders').remove([maskFileName])

    return NextResponse.json({
      success: true,
      outputUrl: finalUrl,
      isMock: result.isMock,
    })
  } catch (error) {
    console.error('Inpaint API error:', error)
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}
