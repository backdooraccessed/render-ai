import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import Replicate from 'replicate'

export const maxDuration = 60

const replicate = process.env.REPLICATE_API_TOKEN
  ? new Replicate({ auth: process.env.REPLICATE_API_TOKEN })
  : null

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { imageUrl, prompt, roomType, style } = body

    // Validate inputs
    if (!imageUrl) {
      return NextResponse.json(
        { success: false, error: 'Image URL is required' },
        { status: 400 }
      )
    }

    if (!prompt) {
      return NextResponse.json(
        { success: false, error: 'Staging prompt is required' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Get authenticated user
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Please sign in to use virtual staging' },
        { status: 401 }
      )
    }

    // Check if Replicate is configured
    if (!replicate) {
      return NextResponse.json({
        success: true,
        outputUrl: imageUrl,
        isMock: true,
      })
    }

    // Use adirik/interior-design for structure-preserving staging
    // This model uses ControlNet (segmentation + MLSD) to preserve room layout
    const output = await replicate.run(
      'adirik/interior-design:76604baddc85b1b4616e1c6475eca080da339c8875bd4996705440484a6eac38',
      {
        input: {
          image: imageUrl,
          prompt: prompt,
          negative_prompt: 'lowres, watermark, banner, logo, distorted, blurry, bad anatomy, wrong proportions, floating furniture, clipping, unrealistic',
          num_inference_steps: 50,
          guidance_scale: 15,
          prompt_strength: 0.8, // 0.8 = preserve 20% of original structure
        },
      }
    )

    // Parse output
    let outputUrl: string | null = null

    if (Array.isArray(output) && output.length > 0) {
      const firstOutput = output[0]
      if (firstOutput && typeof firstOutput === 'object' && 'toString' in firstOutput) {
        outputUrl = firstOutput.toString()
      } else if (typeof firstOutput === 'string') {
        outputUrl = firstOutput
      }
    } else if (typeof output === 'string') {
      outputUrl = output
    } else if (output && typeof output === 'object' && 'toString' in output) {
      outputUrl = output.toString()
    }

    if (!outputUrl) {
      return NextResponse.json(
        { success: false, error: 'No output generated' },
        { status: 500 }
      )
    }

    // Upload to Supabase Storage
    let finalUrl = outputUrl

    try {
      const response = await fetch(outputUrl)
      const blob = await response.blob()
      const buffer = Buffer.from(await blob.arrayBuffer())
      const fileName = `staged-${Date.now()}-${Math.random().toString(36).substring(7)}.png`

      const { error: uploadError } = await supabase.storage
        .from('renders')
        .upload(fileName, buffer, {
          contentType: 'image/png',
          upsert: false,
        })

      if (!uploadError) {
        const { data: publicUrl } = supabase.storage
          .from('renders')
          .getPublicUrl(fileName)
        finalUrl = publicUrl.publicUrl
      }
    } catch (e) {
      console.error('Failed to store staged image:', e)
    }

    // Create generation record
    await supabase.from('generations').insert({
      user_id: user.id,
      input_image_url: imageUrl,
      output_image_url: finalUrl,
      style: style || 'staged',
      room_type: roomType || 'unknown',
      status: 'completed',
      completed_at: new Date().toISOString(),
    })

    return NextResponse.json({
      success: true,
      outputUrl: finalUrl,
    })
  } catch (error) {
    console.error('Staging API error:', error)
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}
