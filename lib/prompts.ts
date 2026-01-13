export const STYLES = [
  {
    id: 'modern',
    name: 'Modern',
    prompt_modifier: 'modern contemporary interior design, clean lines, minimalist furniture, neutral color palette, sophisticated',
  },
  {
    id: 'minimalist',
    name: 'Minimalist',
    prompt_modifier: 'minimalist interior design, very clean and sparse, white and neutral tones, zen-like simplicity, open space',
  },
  {
    id: 'scandinavian',
    name: 'Scandinavian',
    prompt_modifier: 'scandinavian interior design, light wood tones, cozy textiles, hygge atmosphere, natural light, warm and inviting',
  },
  {
    id: 'industrial',
    name: 'Industrial',
    prompt_modifier: 'industrial interior design, exposed brick walls, metal accents, raw materials, loft style, urban aesthetic',
  },
  {
    id: 'luxury',
    name: 'Luxury',
    prompt_modifier: 'luxury high-end interior design, elegant furniture, marble surfaces, gold accents, crystal chandeliers, sophisticated opulence',
  },
  {
    id: 'japandi',
    name: 'Japandi',
    prompt_modifier: 'japandi interior design, japanese minimalism meets scandinavian warmth, natural materials, calm and serene, balanced',
  },
  {
    id: 'mid_century',
    name: 'Mid-Century Modern',
    prompt_modifier: 'mid-century modern interior design, retro 1950s-60s furniture, organic shapes, warm wood tones, vintage aesthetic',
  },
  {
    id: 'bohemian',
    name: 'Bohemian',
    prompt_modifier: 'bohemian interior design, eclectic mix of patterns, colorful textiles, indoor plants, artistic and layered',
  },
] as const

export const ROOM_TYPES = [
  {
    id: 'living_room',
    name: 'Living Room',
    prompt_modifier: 'spacious living room, comfortable sofa, coffee table, ambient lighting, cozy seating arrangement',
  },
  {
    id: 'bedroom',
    name: 'Bedroom',
    prompt_modifier: 'serene bedroom, luxurious bed, soft bedding, nightstands, relaxing atmosphere',
  },
  {
    id: 'kitchen',
    name: 'Kitchen',
    prompt_modifier: 'modern kitchen, sleek cabinets, stone countertops, high-end appliances, functional layout',
  },
  {
    id: 'bathroom',
    name: 'Bathroom',
    prompt_modifier: 'spa-like bathroom, elegant vanity, large mirror, quality fixtures, clean tiles',
  },
  {
    id: 'office',
    name: 'Home Office',
    prompt_modifier: 'professional home office, ergonomic desk setup, comfortable chair, organized workspace, good lighting',
  },
  {
    id: 'dining_room',
    name: 'Dining Room',
    prompt_modifier: 'elegant dining room, beautiful dining table, stylish chairs, pendant lighting, inviting atmosphere',
  },
] as const

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
