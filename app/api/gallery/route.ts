import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const style = searchParams.get('style')
    const roomType = searchParams.get('roomType')
    const sort = searchParams.get('sort') || 'recent'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const featured = searchParams.get('featured') === 'true'

    const supabase = await createClient()

    let query = supabase
      .from('generations')
      .select('id, input_image_url, output_image_url, style, room_type, created_at, view_count, share_token, is_featured')
      .eq('is_public', true)
      .eq('status', 'completed')
      .not('output_image_url', 'is', null)

    // Filter by featured
    if (featured) {
      query = query.eq('is_featured', true)
    }

    // Filter by style
    if (style && style !== 'all') {
      query = query.eq('style', style)
    }

    // Filter by room type
    if (roomType && roomType !== 'all') {
      query = query.eq('room_type', roomType)
    }

    // Sort
    switch (sort) {
      case 'popular':
        query = query.order('view_count', { ascending: false, nullsFirst: false })
        break
      case 'oldest':
        query = query.order('created_at', { ascending: true })
        break
      case 'recent':
      default:
        query = query.order('created_at', { ascending: false })
        break
    }

    // Pagination
    const offset = (page - 1) * limit
    query = query.range(offset, offset + limit - 1)

    const { data: generations, error } = await query

    if (error) {
      console.error('Gallery fetch error:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to fetch gallery' },
        { status: 500 }
      )
    }

    // Get total count for pagination
    const { count } = await supabase
      .from('generations')
      .select('*', { count: 'exact', head: true })
      .eq('is_public', true)
      .eq('status', 'completed')
      .not('output_image_url', 'is', null)

    return NextResponse.json({
      success: true,
      generations: generations || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    })
  } catch (error) {
    console.error('Gallery API error:', error)
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}
