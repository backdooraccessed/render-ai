import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { generateShareToken, buildShareUrl } from '@/lib/share'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Generation ID is required' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Check if generation exists and get current share token
    const { data: generation, error: fetchError } = await supabase
      .from('generations')
      .select('id, share_token')
      .eq('id', id)
      .single()

    if (fetchError || !generation) {
      return NextResponse.json(
        { success: false, error: 'Generation not found' },
        { status: 404 }
      )
    }

    // If already has a share token, return it
    if (generation.share_token) {
      return NextResponse.json({
        success: true,
        shareToken: generation.share_token,
        shareUrl: buildShareUrl(generation.share_token),
      })
    }

    // Generate new share token
    const shareToken = generateShareToken()

    // Update generation with share token
    const { error: updateError } = await supabase
      .from('generations')
      .update({ share_token: shareToken })
      .eq('id', id)

    if (updateError) {
      console.error('Failed to save share token:', updateError)
      return NextResponse.json(
        { success: false, error: 'Failed to create share link' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      shareToken,
      shareUrl: buildShareUrl(shareToken),
    })
  } catch (error) {
    console.error('Share generation API error:', error)
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}
