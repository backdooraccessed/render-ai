import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { generateInteriorRender, isReplicateConfigured } from '@/lib/replicate'
import { STYLES, ROOM_TYPES } from '@/lib/prompts'

export const maxDuration = 60 // Allow up to 60 seconds for generation

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { imageData, style, roomType, sessionId } = body

    // Validate required fields
    if (!imageData) {
      return NextResponse.json(
        { success: false, error: 'Image data is required' },
        { status: 400 }
      )
    }

    if (!style || !STYLES.find(s => s.id === style)) {
      return NextResponse.json(
        { success: false, error: 'Invalid style' },
        { status: 400 }
      )
    }

    if (!roomType || !ROOM_TYPES.find(r => r.id === roomType)) {
      return NextResponse.json(
        { success: false, error: 'Invalid room type' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Upload input image to Supabase Storage
    const imageBuffer = Buffer.from(imageData.split(',')[1], 'base64')
    const fileName = `input-${Date.now()}-${Math.random().toString(36).substring(7)}.jpg`

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('renders')
      .upload(fileName, imageBuffer, {
        contentType: 'image/jpeg',
        upsert: false,
      })

    if (uploadError) {
      console.error('Upload error:', uploadError)
      return NextResponse.json(
        { success: false, error: 'Failed to upload image' },
        { status: 500 }
      )
    }

    // Get public URL for the uploaded image
    const { data: publicUrlData } = supabase.storage
      .from('renders')
      .getPublicUrl(fileName)

    const inputImageUrl = publicUrlData.publicUrl

    // Create generation record
    const { data: generation, error: insertError } = await supabase
      .from('generations')
      .insert({
        session_id: sessionId || null,
        input_image_url: inputImageUrl,
        style,
        room_type: roomType,
        status: 'processing',
      })
      .select()
      .single()

    if (insertError) {
      console.error('Insert error:', insertError)
      return NextResponse.json(
        { success: false, error: 'Failed to create generation record' },
        { status: 500 }
      )
    }

    // Generate the interior render
    const result = await generateInteriorRender({
      imageUrl: inputImageUrl,
      style,
      roomType,
    })

    if (!result.success) {
      // Update generation status to failed
      await supabase
        .from('generations')
        .update({
          status: 'failed',
          error_message: result.error,
        })
        .eq('id', generation.id)

      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      )
    }

    // If we have an output URL, upload it to Supabase Storage (for non-mock results)
    let outputImageUrl = result.outputUrl

    if (result.outputUrl && !result.isMock) {
      try {
        const outputResponse = await fetch(result.outputUrl)
        const outputBlob = await outputResponse.blob()
        const outputBuffer = Buffer.from(await outputBlob.arrayBuffer())
        const outputFileName = `output-${Date.now()}-${Math.random().toString(36).substring(7)}.jpg`

        const { error: outputUploadError } = await supabase.storage
          .from('renders')
          .upload(outputFileName, outputBuffer, {
            contentType: 'image/jpeg',
            upsert: false,
          })

        if (!outputUploadError) {
          const { data: outputPublicUrl } = supabase.storage
            .from('renders')
            .getPublicUrl(outputFileName)
          outputImageUrl = outputPublicUrl.publicUrl
        }
      } catch (e) {
        console.error('Failed to upload output image:', e)
        // Continue with original URL if upload fails
      }
    }

    // Update generation with output
    const { data: updatedGeneration, error: updateError } = await supabase
      .from('generations')
      .update({
        output_image_url: outputImageUrl,
        replicate_prediction_id: result.predictionId,
        status: 'completed',
        completed_at: new Date().toISOString(),
      })
      .eq('id', generation.id)
      .select()
      .single()

    if (updateError) {
      console.error('Update error:', updateError)
    }

    return NextResponse.json({
      success: true,
      generation: updatedGeneration || generation,
      isMock: result.isMock,
    })
  } catch (error) {
    console.error('Generation error:', error)
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    configured: isReplicateConfigured(),
    message: isReplicateConfigured()
      ? 'Replicate API is configured'
      : 'Replicate API is not configured. Generations will run in mock mode.',
  })
}
