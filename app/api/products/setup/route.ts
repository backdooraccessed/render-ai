import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) {
    throw new Error('Supabase credentials not configured')
  }
  return createClient(url, key)
}

// Initial seed data
const seedProducts = [
  // SOFAS
  {
    name: 'Sven Charme Tan Sofa',
    description: 'Mid-century modern leather sofa with solid wood frame.',
    brand: 'Article',
    retailer: 'article',
    price: 1699,
    category: 'sofa',
    subcategory: 'leather_sofa',
    room_type: ['living_room'],
    styles: ['mid-century', 'modern'],
    colors: ['brown', 'tan'],
    materials: ['leather', 'wood'],
    width: 88, height: 34, depth: 38,
    image_url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800',
    product_url: 'https://www.article.com/product/sven-charme-tan-sofa',
    rating: 4.8, review_count: 2341,
  },
  {
    name: 'Cloud Modular Sectional',
    description: 'Deep, plush modular sofa with feather-blend cushions.',
    brand: 'Restoration Hardware',
    retailer: 'wayfair',
    price: 2499,
    category: 'sofa',
    subcategory: 'sectional',
    room_type: ['living_room'],
    styles: ['modern', 'contemporary'],
    colors: ['gray', 'beige'],
    materials: ['fabric', 'wood'],
    width: 120, height: 32, depth: 45,
    image_url: 'https://images.unsplash.com/photo-1550581190-9c1c48d21d6c?w=800',
    product_url: 'https://www.wayfair.com/cloud-sectional',
    rating: 4.7, review_count: 1892,
  },
  {
    name: 'Stockholm Velvet Sofa',
    description: 'Scandinavian-inspired velvet sofa with clean lines.',
    brand: 'IKEA',
    retailer: 'ikea',
    price: 899,
    category: 'sofa',
    subcategory: 'velvet_sofa',
    room_type: ['living_room'],
    styles: ['scandinavian', 'modern'],
    colors: ['green', 'blue', 'gray'],
    materials: ['velvet', 'wood'],
    width: 82, height: 32, depth: 35,
    image_url: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800',
    product_url: 'https://www.ikea.com/stockholm-sofa',
    rating: 4.5, review_count: 3421,
  },
  // CHAIRS
  {
    name: 'Eames Lounge Chair Replica',
    description: 'Iconic mid-century lounge chair with ottoman.',
    brand: 'Manhattan Home Design',
    retailer: 'wayfair',
    price: 1299,
    category: 'chair',
    subcategory: 'lounge_chair',
    room_type: ['living_room', 'office'],
    styles: ['mid-century', 'modern'],
    colors: ['black', 'brown', 'white'],
    materials: ['leather', 'wood'],
    width: 33, height: 32, depth: 32,
    image_url: 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=800',
    product_url: 'https://www.wayfair.com/eames-lounge',
    rating: 4.6, review_count: 892,
  },
  {
    name: 'POÄNG Armchair',
    description: 'Classic bentwood armchair with cushioned seat.',
    brand: 'IKEA',
    retailer: 'ikea',
    price: 149,
    category: 'chair',
    subcategory: 'armchair',
    room_type: ['living_room', 'bedroom', 'office'],
    styles: ['scandinavian', 'minimalist'],
    colors: ['beige', 'gray', 'black'],
    materials: ['fabric', 'wood'],
    width: 27, height: 39, depth: 32,
    image_url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800',
    product_url: 'https://www.ikea.com/poang',
    rating: 4.4, review_count: 8923,
  },
  {
    name: 'Velvet Accent Chair',
    description: 'Modern velvet armchair with brass legs.',
    brand: 'West Elm',
    retailer: 'west_elm',
    price: 599,
    category: 'chair',
    subcategory: 'accent_chair',
    room_type: ['living_room', 'bedroom'],
    styles: ['modern', 'bohemian'],
    colors: ['green', 'pink', 'blue', 'yellow'],
    materials: ['velvet', 'metal'],
    width: 30, height: 32, depth: 30,
    image_url: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=800',
    product_url: 'https://www.westelm.com/velvet-armchair',
    rating: 4.5, review_count: 672,
  },
  // TABLES
  {
    name: 'Mid-Century Coffee Table',
    description: 'Solid walnut coffee table with tapered legs.',
    brand: 'West Elm',
    retailer: 'west_elm',
    price: 449,
    category: 'table',
    subcategory: 'coffee_table',
    room_type: ['living_room'],
    styles: ['mid-century', 'modern'],
    colors: ['brown', 'walnut'],
    materials: ['wood'],
    width: 48, height: 16, depth: 24,
    image_url: 'https://images.unsplash.com/photo-1532372320572-cda25653a26d?w=800',
    product_url: 'https://www.westelm.com/mid-century-coffee-table',
    rating: 4.6, review_count: 1234,
  },
  {
    name: 'LACK Coffee Table',
    description: 'Simple, minimalist coffee table.',
    brand: 'IKEA',
    retailer: 'ikea',
    price: 29,
    category: 'table',
    subcategory: 'coffee_table',
    room_type: ['living_room'],
    styles: ['minimalist', 'modern'],
    colors: ['white', 'black', 'oak'],
    materials: ['wood'],
    width: 46, height: 18, depth: 30,
    image_url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800',
    product_url: 'https://www.ikea.com/lack-coffee-table',
    rating: 4.2, review_count: 15234,
  },
  {
    name: 'Marble Round Side Table',
    description: 'Elegant marble-top side table with gold base.',
    brand: 'CB2',
    retailer: 'cb2',
    price: 249,
    category: 'table',
    subcategory: 'side_table',
    room_type: ['living_room', 'bedroom'],
    styles: ['modern', 'contemporary'],
    colors: ['white', 'gold'],
    materials: ['marble', 'metal'],
    width: 16, height: 22, depth: 16,
    image_url: 'https://images.unsplash.com/photo-1499933374294-4584851497cc?w=800',
    product_url: 'https://www.cb2.com/marble-side-table',
    rating: 4.7, review_count: 432,
  },
  // RUGS
  {
    name: 'Moroccan Shag Area Rug',
    description: 'Plush shag rug with geometric Moroccan pattern.',
    brand: 'Rugs USA',
    retailer: 'wayfair',
    price: 299,
    category: 'rug',
    subcategory: 'area_rug',
    room_type: ['living_room', 'bedroom'],
    styles: ['bohemian', 'modern'],
    colors: ['white', 'cream', 'gray'],
    materials: ['wool'],
    width: 96, height: 1, depth: 120,
    image_url: 'https://images.unsplash.com/photo-1600166898405-da9535204843?w=800',
    product_url: 'https://www.wayfair.com/moroccan-shag-rug',
    rating: 4.5, review_count: 3421,
  },
  {
    name: 'Persian Vintage Rug',
    description: 'Machine-woven vintage-style Persian rug.',
    brand: 'Loloi',
    retailer: 'wayfair',
    price: 199,
    category: 'rug',
    subcategory: 'area_rug',
    room_type: ['living_room', 'dining_room', 'bedroom'],
    styles: ['traditional', 'bohemian'],
    colors: ['blue', 'red', 'beige'],
    materials: ['polypropylene'],
    width: 96, height: 1, depth: 120,
    image_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
    product_url: 'https://www.wayfair.com/persian-rug',
    rating: 4.6, review_count: 2134,
  },
  // LAMPS
  {
    name: 'Arc Floor Lamp',
    description: 'Modern arched floor lamp with marble base.',
    brand: 'West Elm',
    retailer: 'west_elm',
    price: 349,
    category: 'lamp',
    subcategory: 'floor_lamp',
    room_type: ['living_room', 'bedroom', 'office'],
    styles: ['modern', 'mid-century'],
    colors: ['brass', 'black', 'white'],
    materials: ['metal', 'marble'],
    width: 12, height: 72, depth: 40,
    image_url: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800',
    product_url: 'https://www.westelm.com/arc-floor-lamp',
    rating: 4.7, review_count: 892,
  },
  {
    name: 'Tripod Floor Lamp',
    description: 'Scandinavian tripod floor lamp with drum shade.',
    brand: 'IKEA',
    retailer: 'ikea',
    price: 79,
    category: 'lamp',
    subcategory: 'floor_lamp',
    room_type: ['living_room', 'bedroom'],
    styles: ['scandinavian', 'minimalist'],
    colors: ['white', 'gray', 'natural'],
    materials: ['wood', 'fabric'],
    width: 20, height: 60, depth: 20,
    image_url: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800',
    product_url: 'https://www.ikea.com/tripod-lamp',
    rating: 4.4, review_count: 2341,
  },
  // PLANTS
  {
    name: 'Fiddle Leaf Fig Tree',
    description: 'Artificial fiddle leaf fig tree, 6ft tall.',
    brand: 'Nearly Natural',
    retailer: 'amazon',
    price: 129,
    category: 'plant',
    subcategory: 'artificial_tree',
    room_type: ['living_room', 'office', 'bedroom'],
    styles: ['modern', 'bohemian', 'scandinavian'],
    colors: ['green'],
    materials: ['silk', 'plastic'],
    width: 24, height: 72, depth: 24,
    image_url: 'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=800',
    product_url: 'https://www.amazon.com/fiddle-leaf-fig',
    rating: 4.5, review_count: 4532,
  },
  {
    name: 'Snake Plant in Pot',
    description: 'Real snake plant in ceramic pot. Low maintenance.',
    brand: 'The Sill',
    retailer: 'amazon',
    price: 65,
    category: 'plant',
    subcategory: 'potted_plant',
    room_type: ['living_room', 'office', 'bedroom', 'bathroom'],
    styles: ['modern', 'minimalist', 'scandinavian'],
    colors: ['green'],
    materials: ['live_plant', 'ceramic'],
    width: 8, height: 24, depth: 8,
    image_url: 'https://images.unsplash.com/photo-1593482892290-f54927ae1bb6?w=800',
    product_url: 'https://www.amazon.com/snake-plant',
    rating: 4.7, review_count: 2341,
  },
  // DECOR
  {
    name: 'Decorative Throw Pillows Set',
    description: 'Set of 4 textured throw pillows.',
    brand: 'Threshold',
    retailer: 'target',
    price: 49,
    category: 'decor',
    subcategory: 'pillows',
    room_type: ['living_room', 'bedroom'],
    styles: ['modern', 'bohemian', 'farmhouse'],
    colors: ['beige', 'cream', 'gray', 'blue'],
    materials: ['cotton', 'linen'],
    width: 18, height: 18, depth: 4,
    image_url: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=800',
    product_url: 'https://www.target.com/throw-pillows',
    rating: 4.5, review_count: 3421,
  },
  {
    name: 'Chunky Knit Throw Blanket',
    description: 'Hand-knitted chunky throw blanket.',
    brand: 'Bearaby',
    retailer: 'amazon',
    price: 89,
    category: 'decor',
    subcategory: 'blanket',
    room_type: ['living_room', 'bedroom'],
    styles: ['scandinavian', 'modern', 'coastal'],
    colors: ['white', 'gray', 'beige', 'pink'],
    materials: ['acrylic'],
    width: 50, height: 60, depth: 2,
    image_url: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800',
    product_url: 'https://www.amazon.com/chunky-throw',
    rating: 4.7, review_count: 5678,
  },
  // ART & MIRROR
  {
    name: 'Abstract Wall Art Set',
    description: 'Set of 3 framed abstract prints.',
    brand: 'Deny Designs',
    retailer: 'wayfair',
    price: 149,
    category: 'art',
    subcategory: 'wall_art',
    room_type: ['living_room', 'bedroom', 'office'],
    styles: ['modern', 'minimalist', 'contemporary'],
    colors: ['neutral', 'beige', 'black', 'white'],
    materials: ['paper', 'wood_frame'],
    width: 24, height: 36, depth: 1,
    image_url: 'https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=800',
    product_url: 'https://www.wayfair.com/abstract-art',
    rating: 4.6, review_count: 892,
  },
  {
    name: 'Round Decorative Mirror',
    description: 'Large round mirror with thin gold frame. 36" diameter.',
    brand: 'West Elm',
    retailer: 'west_elm',
    price: 299,
    category: 'mirror',
    subcategory: 'wall_mirror',
    room_type: ['living_room', 'bedroom', 'bathroom'],
    styles: ['modern', 'minimalist', 'contemporary'],
    colors: ['gold', 'black', 'brass'],
    materials: ['glass', 'metal'],
    width: 36, height: 36, depth: 1,
    image_url: 'https://images.unsplash.com/photo-1618220179428-22790b461013?w=800',
    product_url: 'https://www.westelm.com/round-mirror',
    rating: 4.8, review_count: 1234,
  },
  // STORAGE
  {
    name: 'KALLAX Shelf Unit',
    description: 'Versatile cube storage unit.',
    brand: 'IKEA',
    retailer: 'ikea',
    price: 69,
    category: 'storage',
    subcategory: 'bookshelf',
    room_type: ['living_room', 'office', 'bedroom'],
    styles: ['modern', 'minimalist', 'scandinavian'],
    colors: ['white', 'black', 'oak'],
    materials: ['wood'],
    width: 57, height: 57, depth: 15,
    image_url: 'https://images.unsplash.com/photo-1594620302200-9a762244a156?w=800',
    product_url: 'https://www.ikea.com/kallax',
    rating: 4.6, review_count: 12345,
  },
].map(p => ({
  ...p,
  affiliate_url: `${p.product_url}?ref=renderai&utm_source=renderai`,
  affiliate_code: 'renderai',
  in_stock: true,
  currency: 'USD',
}))

export async function POST() {
  try {
    const supabase = getSupabaseAdmin()
    // Check if table exists by trying to select
    const { error: checkError } = await supabase
      .from('products')
      .select('id')
      .limit(1)

    if (checkError && checkError.code === '42P01') {
      // Table doesn't exist - need to run migration
      return NextResponse.json({
        success: false,
        error: 'Products table does not exist. Please run the migration first.',
        migration: '/supabase/migrations/20260115_create_products_table.sql',
      }, { status: 400 })
    }

    // Check if already seeded
    const { count } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })

    if (count && count > 0) {
      return NextResponse.json({
        success: true,
        message: `Products table already has ${count} products`,
        count,
      })
    }

    // Seed the products
    const { error: insertError } = await supabase
      .from('products')
      .insert(seedProducts)

    if (insertError) {
      return NextResponse.json({
        success: false,
        error: insertError.message,
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: `Successfully seeded ${seedProducts.length} products`,
      count: seedProducts.length,
    })

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'POST to this endpoint to seed the products database',
    productCount: seedProducts.length,
  })
}
