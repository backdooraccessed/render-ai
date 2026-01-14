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
