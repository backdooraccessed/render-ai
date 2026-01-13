// Keep these for backward compatibility with database
export const STYLES = [
  { id: 'modern', name: 'Modern', prompt_modifier: 'modern contemporary interior design' },
  { id: 'minimalist', name: 'Minimalist', prompt_modifier: 'minimalist interior design' },
  { id: 'scandinavian', name: 'Scandinavian', prompt_modifier: 'scandinavian interior design' },
  { id: 'industrial', name: 'Industrial', prompt_modifier: 'industrial interior design' },
  { id: 'luxury', name: 'Luxury', prompt_modifier: 'luxury interior design' },
  { id: 'japandi', name: 'Japandi', prompt_modifier: 'japandi interior design' },
  { id: 'mid_century', name: 'Mid-Century Modern', prompt_modifier: 'mid-century modern interior design' },
  { id: 'bohemian', name: 'Bohemian', prompt_modifier: 'bohemian interior design' },
] as const

export const ROOM_TYPES = [
  { id: 'living_room', name: 'Living Room', prompt_modifier: 'living room' },
  { id: 'bedroom', name: 'Bedroom', prompt_modifier: 'bedroom' },
  { id: 'kitchen', name: 'Kitchen', prompt_modifier: 'kitchen' },
  { id: 'bathroom', name: 'Bathroom', prompt_modifier: 'bathroom' },
  { id: 'office', name: 'Home Office', prompt_modifier: 'home office' },
  { id: 'dining_room', name: 'Dining Room', prompt_modifier: 'dining room' },
] as const

// New function for natural language prompts
export function buildNaturalPrompt(userPrompt: string): { prompt: string; negativePrompt: string } {
  // Base context to ensure interior design quality
  const baseContext = 'Interior design photograph, photorealistic, high quality, natural lighting, professional photography'

  // Combine user's request with quality modifiers
  const prompt = `${baseContext}, ${userPrompt}, detailed, sharp focus`

  const negativePrompt = 'ugly, blurry, low quality, distorted, cartoon, anime, painting, drawing, sketch, watermark, text, logo, oversaturated, underexposed, overexposed, grainy, noisy, artifacts, deformed, disfigured, people, humans, faces'

  return { prompt, negativePrompt }
}

// Legacy function for preset styles (kept for compatibility)
export function buildPrompt(styleId: string, roomTypeId: string): { prompt: string; negativePrompt: string } {
  const style = STYLES.find(s => s.id === styleId)
  const roomType = ROOM_TYPES.find(r => r.id === roomTypeId)

  if (!style || !roomType) {
    throw new Error('Invalid style or room type')
  }

  const prompt = `Professional interior design photograph, ${style.prompt_modifier}, ${roomType.prompt_modifier}, 8k resolution, architectural digest photography, natural lighting, photorealistic, award-winning interior design, high detail, beautiful composition`

  const negativePrompt = 'ugly, blurry, low quality, distorted, cartoon, anime, painting, drawing, sketch, watermark, text, logo, oversaturated, underexposed, overexposed, grainy, noisy, artifacts, deformed, disfigured, people, humans, faces'

  return { prompt, negativePrompt }
}
