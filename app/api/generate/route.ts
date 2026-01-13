import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { generateInteriorRender, isReplicateConfigured } from '@/lib/replicate'
import { checkGenerationLimit, incrementGenerationCount } from '@/lib/auth'

export const maxDuration = 60 // Allow up to 60 seconds for generation

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      imageData,
      referenceImageData,
      prompt,
      strength = 0.5,
      sessionId,
      numOutputs = 1,
      negativePrompt,
      seed,
    } = body

    // Validate required fields
    if (!imageData) {
      return NextResponse.json(
        { success: false, error: 'Image data is required' },
        { status: 400 }
      )
    }

    if (!prompt || prompt.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'Please describe what changes you want' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Get authenticated user
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Please sign in to generate images' },
        { status: 401 }
      )
    }

    // Check generation limit
    const { allowed, remaining, isPro } = await checkGenerationLimit(user.id)

    if (!allowed) {
      return NextResponse.json(
        {
          success: false,
          error: 'Daily limit reached. Upgrade to Pro for unlimited generations.',
          limitReached: true,
          remaining: 0,
        },
        { status: 429 }
      )
    }

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

    // Upload reference image if provided
    let referenceImageUrl: string | undefined
    if (referenceImageData) {
      const refBuffer = Buffer.from(referenceImageData.split(',')[1], 'base64')
      const refFileName = `reference-${Date.now()}-${Math.random().toString(36).substring(7)}.jpg`

      const { error: refUploadError } = await supabase.storage
        .from('renders')
        .upload(refFileName, refBuffer, {
          contentType: 'image/jpeg',
          upsert: false,
        })

      if (!refUploadError) {
        const { data: refPublicUrl } = supabase.storage
          .from('renders')
          .getPublicUrl(refFileName)
        referenceImageUrl = refPublicUrl.publicUrl
      }
    }

    // Create generation record
    const { data: generation, error: insertError } = await supabase
      .from('generations')
      .insert({
        user_id: user.id,
        session_id: sessionId || null,
        input_image_url: inputImageUrl,
        style: 'custom', // Mark as custom prompt
        room_type: 'custom',
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

    // Generate the interior render(s)
    const result = await generateInteriorRender({
      imageUrl: inputImageUrl,
      userPrompt: prompt.trim(),
      strength: Math.max(0.2, Math.min(0.8, strength)), // Clamp between 0.2-0.8
      numOutputs: Math.max(1, Math.min(4, numOutputs)), // Clamp between 1-4
      negativePrompt: negativePrompt?.trim() || undefined,
      seed: seed !== undefined ? seed : undefined,
      referenceImageUrl,
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

    // Upload output images to Supabase Storage (for non-mock results)
    let outputImageUrls: string[] = result.outputUrls || []

    if (result.outputUrls && result.outputUrls.length > 0 && !result.isMock) {
      outputImageUrls = await Promise.all(
        result.outputUrls.map(async (outputUrl, index) => {
          try {
            const outputResponse = await fetch(outputUrl)
            const outputBlob = await outputResponse.blob()
            const outputBuffer = Buffer.from(await outputBlob.arrayBuffer())
            const outputFileName = `output-${Date.now()}-${index}-${Math.random().toString(36).substring(7)}.jpg`

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
              return outputPublicUrl.publicUrl
            }
            return outputUrl // Fallback to original URL
          } catch (e) {
            console.error('Failed to upload output image:', e)
            return outputUrl // Continue with original URL if upload fails
          }
        })
      )
    }

    // Update generation with outputs
    const { data: updatedGeneration, error: updateError } = await supabase
      .from('generations')
      .update({
        output_image_url: outputImageUrls[0] || null, // Primary output for backward compatibility
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

    // Increment generation count for free users
    if (!isPro) {
      await incrementGenerationCount(user.id)
    }

    // Add output_image_urls to response (not stored in DB, but returned to client)
    const generationWithUrls = {
      ...(updatedGeneration || generation),
      output_image_urls: outputImageUrls,
      prompt: prompt.trim(),
      negative_prompt: negativePrompt?.trim() || null,
      seed: seed ?? null,
      strength,
    }

    // Calculate new remaining count
    const newRemaining = isPro ? Infinity : remaining - 1

    return NextResponse.json({
      success: true,
      generation: generationWithUrls,
      isMock: result.isMock,
      credits: {
        remaining: newRemaining,
        isPro,
      },
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
