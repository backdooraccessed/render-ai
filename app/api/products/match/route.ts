import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import type { Product, ProductCategory } from '@/types'

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) {
    throw new Error('Supabase credentials not configured')
  }
  return createClient(url, key)
}

// Map generation styles to product styles
const styleMapping: Record<string, string[]> = {
  'modern': ['modern', 'contemporary', 'minimalist'],
  'scandinavian': ['scandinavian', 'minimalist', 'modern'],
  'industrial': ['industrial', 'modern', 'mid-century'],
  'bohemian': ['bohemian', 'traditional', 'coastal'],
  'traditional': ['traditional', 'farmhouse'],
  'minimalist': ['minimalist', 'modern', 'scandinavian'],
  'mid-century': ['mid-century', 'modern', 'contemporary'],
  'coastal': ['coastal', 'farmhouse', 'bohemian'],
  'farmhouse': ['farmhouse', 'traditional', 'coastal'],
  'contemporary': ['contemporary', 'modern', 'minimalist'],
  'luxury': ['modern', 'contemporary'],
  'zen': ['minimalist', 'scandinavian', 'modern'],
}

// Map room types to product room_type tags
const roomTypeMapping: Record<string, string> = {
  'living-room': 'living_room',
  'living_room': 'living_room',
  'bedroom': 'bedroom',
  'dining-room': 'dining_room',
  'dining_room': 'dining_room',
  'office': 'office',
  'kitchen': 'kitchen',
  'bathroom': 'bathroom',
  'outdoor': 'outdoor',
}

// Categories to include for a complete room look
const essentialCategories: ProductCategory[] = ['sofa', 'table', 'rug', 'lamp', 'plant', 'decor']
const bedroomCategories: ProductCategory[] = ['bed', 'lamp', 'rug', 'decor', 'mirror', 'storage']
const officeCategories: ProductCategory[] = ['desk', 'chair', 'lamp', 'storage', 'plant', 'decor']
const diningCategories: ProductCategory[] = ['table', 'chair', 'lamp', 'rug', 'decor', 'art']

export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabaseAdmin()
    const body = await request.json()
    const { style, room_type, budget, limit = 8 } = body

    if (!style) {
      return NextResponse.json({
        success: false,
        error: 'Style is required',
      }, { status: 400 })
    }

    // Get matching product styles
    const productStyles = styleMapping[style.toLowerCase()] || ['modern']

    // Get room type tag
    const roomTypeTag = roomTypeMapping[room_type?.toLowerCase()] || 'living_room'

    // Determine categories based on room type
    let targetCategories: ProductCategory[]
    switch (roomTypeTag) {
      case 'bedroom':
        targetCategories = bedroomCategories
        break
      case 'office':
        targetCategories = officeCategories
        break
      case 'dining_room':
        targetCategories = diningCategories
        break
      default:
        targetCategories = essentialCategories
    }

    // Fetch products for each category
    const productPromises = targetCategories.map(async (category) => {
      let query = supabase
        .from('products')
        .select('*')
        .eq('category', category)
        .eq('in_stock', true)
        .contains('room_type', [roomTypeTag])
        .order('rating', { ascending: false })
        .limit(3)

      // Filter by style (at least one matching style)
      // Using overlaps for array intersection
      query = query.overlaps('styles', productStyles)

      // Optional budget filter
      if (budget) {
        query = query.lte('price', budget)
      }

      const { data, error } = await query

      if (error || !data || data.length === 0) {
        // Fallback: get any product in this category
        const fallback = await supabase
          .from('products')
          .select('*')
          .eq('category', category)
          .eq('in_stock', true)
          .order('rating', { ascending: false })
          .limit(1)

        return fallback.data?.[0] || null
      }

      // Return the highest-rated match
      return data[0]
    })

    const products = await Promise.all(productPromises)
    const validProducts = products.filter((p): p is Product => p !== null)

    // Calculate total price
    const totalPrice = validProducts.reduce((sum, p) => sum + (p.price || 0), 0)

    return NextResponse.json({
      success: true,
      match: {
        style,
        room_type: roomTypeTag,
        matched_styles: productStyles,
      },
      products: validProducts.slice(0, limit),
      total_price: totalPrice,
      product_count: validProducts.length,
    })

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 })
  }
}
