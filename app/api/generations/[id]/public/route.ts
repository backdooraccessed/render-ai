import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

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

    // Get current public status
    const { data: generation, error: fetchError } = await supabase
      .from('generations')
      .select('id, is_public')
      .eq('id', id)
      .single()

    if (fetchError || !generation) {
      return NextResponse.json(
        { success: false, error: 'Generation not found' },
        { status: 404 }
      )
    }

    // Toggle public status
    const newIsPublic = !generation.is_public

    const { error: updateError } = await supabase
      .from('generations')
      .update({ is_public: newIsPublic })
      .eq('id', id)

    if (updateError) {
      console.error('Failed to update public status:', updateError)
      return NextResponse.json(
        { success: false, error: 'Failed to update public status' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      is_public: newIsPublic,
    })
  } catch (error) {
    console.error('Public toggle API error:', error)
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}
