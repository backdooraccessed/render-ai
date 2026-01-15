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

export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabaseAdmin()
    const body = await request.json()
    const { product_id, generation_id, user_id } = body

    if (!product_id) {
      return NextResponse.json({
        success: false,
        error: 'Product ID is required',
      }, { status: 400 })
    }

    // Get the product to return the affiliate URL
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('affiliate_url, product_url, name')
      .eq('id', product_id)
      .single()

    if (productError || !product) {
      return NextResponse.json({
        success: false,
        error: 'Product not found',
      }, { status: 404 })
    }

    // Record the click (only if product_clicks table exists)
    try {
      await supabase
        .from('product_clicks')
        .insert({
          product_id,
          generation_id: generation_id || null,
          user_id: user_id || null,
        })
    } catch {
      // Silently fail if table doesn't exist yet
      console.log('product_clicks table may not exist yet')
    }

    return NextResponse.json({
      success: true,
      redirect_url: product.affiliate_url || product.product_url,
      product_name: product.name,
    })

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 })
  }
}
