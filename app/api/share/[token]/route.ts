import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { isValidShareToken } from '@/lib/share'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params

    if (!token || !isValidShareToken(token)) {
      return NextResponse.json(
        { success: false, error: 'Invalid share token' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Fetch generation by share token
    const { data: generation, error } = await supabase
      .from('generations')
      .select('*')
      .eq('share_token', token)
      .single()

    if (error || !generation) {
      return NextResponse.json(
        { success: false, error: 'Generation not found' },
        { status: 404 }
      )
    }

    // Increment view count
    await supabase
      .from('generations')
      .update({ view_count: (generation.view_count || 0) + 1 })
      .eq('id', generation.id)

    return NextResponse.json({
      success: true,
      generation: {
        id: generation.id,
        input_image_url: generation.input_image_url,
        output_image_url: generation.output_image_url,
        output_image_urls: generation.output_image_urls,
        upscaled_image_url: generation.upscaled_image_url,
        style: generation.style,
        room_type: generation.room_type,
        created_at: generation.created_at,
        view_count: (generation.view_count || 0) + 1,
      },
    })
  } catch (error) {
    console.error('Share API error:', error)
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}
