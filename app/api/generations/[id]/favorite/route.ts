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

    // Get current favorite status
    const { data: generation, error: fetchError } = await supabase
      .from('generations')
      .select('is_favorite')
      .eq('id', id)
      .single()

    if (fetchError) {
      console.error('Fetch error:', fetchError)
      return NextResponse.json(
        { success: false, error: 'Generation not found' },
        { status: 404 }
      )
    }

    // Toggle favorite status
    const newStatus = !generation.is_favorite

    const { error: updateError } = await supabase
      .from('generations')
      .update({ is_favorite: newStatus })
      .eq('id', id)

    if (updateError) {
      console.error('Update error:', updateError)
      return NextResponse.json(
        { success: false, error: 'Failed to update favorite status' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      is_favorite: newStatus,
    })
  } catch (error) {
    console.error('Favorite API error:', error)
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}
