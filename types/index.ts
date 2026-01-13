export type GenerationStatus = 'pending' | 'processing' | 'completed' | 'failed'

export interface Generation {
  id: string
  session_id: string | null
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
