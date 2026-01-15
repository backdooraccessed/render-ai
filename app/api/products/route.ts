import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) {
    throw new Error('Supabase credentials not configured')
  }
  return createClient(url, key)
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams

    // Filter parameters
    const category = searchParams.get('category')
    const style = searchParams.get('style')
    const roomType = searchParams.get('room_type')
    const retailer = searchParams.get('retailer')
    const minPrice = searchParams.get('min_price')
    const maxPrice = searchParams.get('max_price')
    const inStock = searchParams.get('in_stock')
    const limit = searchParams.get('limit')
    const offset = searchParams.get('offset')

    // Build query
    const supabase = getSupabaseAdmin()
    let query = supabase
      .from('products')
      .select('*')

    // Apply filters
    if (category) {
      query = query.eq('category', category)
    }

    if (style) {
      // styles is an array, use contains
      query = query.contains('styles', [style])
    }

    if (roomType) {
      // room_type is an array, use contains
      query = query.contains('room_type', [roomType])
    }

    if (retailer) {
      query = query.eq('retailer', retailer)
    }

    if (minPrice) {
      query = query.gte('price', parseFloat(minPrice))
    }

    if (maxPrice) {
      query = query.lte('price', parseFloat(maxPrice))
    }

    if (inStock === 'true') {
      query = query.eq('in_stock', true)
    }

    // Pagination
    const pageLimit = limit ? parseInt(limit) : 20
    const pageOffset = offset ? parseInt(offset) : 0

    query = query
      .order('rating', { ascending: false })
      .range(pageOffset, pageOffset + pageLimit - 1)

    const { data, error, count } = await query

    if (error) {
      return NextResponse.json({
        success: false,
        error: error.message,
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      products: data,
      count: data?.length || 0,
      pagination: {
        limit: pageLimit,
        offset: pageOffset,
      },
    })

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 })
  }
}
