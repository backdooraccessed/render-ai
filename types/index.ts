export type GenerationStatus = 'pending' | 'processing' | 'completed' | 'failed'

export interface Generation {
  id: string
  session_id: string | null
  user_id?: string
  project_id?: string | null
  input_image_url: string
  output_image_url: string | null
  output_image_urls?: string[] // Multiple outputs support
  style: string
  room_type: string
  status: GenerationStatus
  replicate_prediction_id: string | null
  error_message: string | null
  created_at: string
  completed_at: string | null
  is_favorite?: boolean
  prompt?: string
  negative_prompt?: string
  seed?: number
  strength?: number
  // Sprint 3: Upscaling & Gallery
  upscaled_image_url?: string
  is_public?: boolean
  is_featured?: boolean
  view_count?: number
  share_token?: string
  // Sprint 5: Projects
  project?: Project
}

export interface Project {
  id: string
  user_id: string
  name: string
  description?: string | null
  client_name?: string | null
  address?: string | null
  default_style?: string | null
  default_room_type?: string | null
  cover_image_url?: string | null
  is_archived: boolean
  created_at: string
  updated_at: string
  // Computed fields
  generation_count?: number
  latest_generation?: string | null
}

export interface Style {
  id: string
  name: string
  prompt_modifier: string
  sort_order: number
}

export interface RoomType {
  id: string
  name: string
  prompt_modifier: string
  sort_order: number
}

export interface GenerateRequest {
  imageData: string
  style: string
  roomType: string
  sessionId?: string
}

export interface GenerateResponse {
  success: boolean
  generation?: Generation
  error?: string
}

// Shoppable Staging Types
export type ProductCategory =
  | 'sofa'
  | 'chair'
  | 'table'
  | 'rug'
  | 'lamp'
  | 'plant'
  | 'decor'
  | 'storage'
  | 'bed'
  | 'desk'
  | 'mirror'
  | 'curtain'
  | 'art'

export type ProductStyle =
  | 'modern'
  | 'scandinavian'
  | 'industrial'
  | 'bohemian'
  | 'traditional'
  | 'minimalist'
  | 'mid-century'
  | 'coastal'
  | 'farmhouse'
  | 'contemporary'

export type RoomTypeTag =
  | 'living_room'
  | 'bedroom'
  | 'dining_room'
  | 'office'
  | 'kitchen'
  | 'bathroom'
  | 'outdoor'

export type Retailer =
  | 'wayfair'
  | 'amazon'
  | 'ikea'
  | 'cb2'
  | 'west_elm'
  | 'target'
  | 'overstock'
  | 'article'
  | 'pottery_barn'

export interface Product {
  id: string
  name: string
  description?: string
  brand?: string
  retailer: Retailer

  // Pricing
  price: number
  currency: string
  sale_price?: number

  // Categorization
  category: ProductCategory
  subcategory?: string
  room_type: RoomTypeTag[]

  // Style tags
  styles: ProductStyle[]
  colors?: string[]
  materials?: string[]

  // Dimensions (inches)
  width?: number
  height?: number
  depth?: number

  // Images
  image_url: string
  image_cutout_url?: string
  thumbnail_url?: string
  additional_images?: string[]

  // Links
  product_url: string
  affiliate_url?: string

  // Metadata
  rating?: number
  review_count?: number
  in_stock?: boolean
  external_id?: string

  created_at: string
  updated_at: string
}

export interface ProductClick {
  id: string
  product_id: string
  generation_id?: string
  user_id?: string
  clicked_at: string
  converted: boolean
  conversion_value?: number
}

export interface ShoppableLook {
  generation_id: string
  products: Product[]
  total_price: number
}
