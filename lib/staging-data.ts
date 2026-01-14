// Furniture categories and items for virtual staging

export interface FurnitureItem {
  id: string
  name: string
  category: string
  promptKeywords: string
  icon: string
}

export interface StyleBundle {
  id: string
  name: string
  description: string
  promptPrefix: string
  color: string
}

export interface RoomType {
  id: string
  name: string
  icon: string
}

export const ROOM_TYPES: RoomType[] = [
  { id: 'living', name: 'Living Room', icon: '🛋️' },
  { id: 'bedroom', name: 'Bedroom', icon: '🛏️' },
  { id: 'dining', name: 'Dining Room', icon: '🍽️' },
  { id: 'office', name: 'Home Office', icon: '💼' },
  { id: 'kitchen', name: 'Kitchen', icon: '🍳' },
  { id: 'bathroom', name: 'Bathroom', icon: '🚿' },
]

export const FURNITURE_ITEMS: FurnitureItem[] = [
  // Living Room
  { id: 'sofa', name: 'Sofa', category: 'living', promptKeywords: 'comfortable sofa, couch', icon: '🛋️' },
  { id: 'armchair', name: 'Armchair', category: 'living', promptKeywords: 'accent armchair, lounge chair', icon: '🪑' },
  { id: 'coffee-table', name: 'Coffee Table', category: 'living', promptKeywords: 'coffee table, center table', icon: '🪵' },
  { id: 'tv-stand', name: 'TV Stand', category: 'living', promptKeywords: 'TV stand, media console, entertainment center', icon: '📺' },
  { id: 'bookshelf', name: 'Bookshelf', category: 'living', promptKeywords: 'bookshelf, bookcase, shelving unit', icon: '📚' },
  { id: 'floor-lamp', name: 'Floor Lamp', category: 'living', promptKeywords: 'floor lamp, standing lamp', icon: '🪔' },
  { id: 'rug', name: 'Area Rug', category: 'living', promptKeywords: 'area rug, carpet', icon: '🟫' },
  { id: 'curtains', name: 'Curtains', category: 'living', promptKeywords: 'curtains, drapes, window treatments', icon: '🪟' },

  // Bedroom
  { id: 'bed', name: 'Bed', category: 'bedroom', promptKeywords: 'bed, bed frame with headboard', icon: '🛏️' },
  { id: 'nightstand', name: 'Nightstand', category: 'bedroom', promptKeywords: 'nightstand, bedside table', icon: '🪑' },
  { id: 'dresser', name: 'Dresser', category: 'bedroom', promptKeywords: 'dresser, chest of drawers', icon: '🗄️' },
  { id: 'wardrobe', name: 'Wardrobe', category: 'bedroom', promptKeywords: 'wardrobe, armoire, closet', icon: '🚪' },
  { id: 'vanity', name: 'Vanity', category: 'bedroom', promptKeywords: 'vanity table, makeup desk with mirror', icon: '🪞' },

  // Dining
  { id: 'dining-table', name: 'Dining Table', category: 'dining', promptKeywords: 'dining table', icon: '🍽️' },
  { id: 'dining-chairs', name: 'Dining Chairs', category: 'dining', promptKeywords: 'dining chairs, set of chairs', icon: '🪑' },
  { id: 'sideboard', name: 'Sideboard', category: 'dining', promptKeywords: 'sideboard, buffet, credenza', icon: '🗄️' },
  { id: 'chandelier', name: 'Chandelier', category: 'dining', promptKeywords: 'chandelier, pendant light, dining light fixture', icon: '💡' },

  // Office
  { id: 'desk', name: 'Desk', category: 'office', promptKeywords: 'office desk, work desk', icon: '🖥️' },
  { id: 'office-chair', name: 'Office Chair', category: 'office', promptKeywords: 'ergonomic office chair', icon: '🪑' },
  { id: 'filing-cabinet', name: 'Filing Cabinet', category: 'office', promptKeywords: 'filing cabinet, storage cabinet', icon: '🗄️' },
  { id: 'desk-lamp', name: 'Desk Lamp', category: 'office', promptKeywords: 'desk lamp, task lamp', icon: '💡' },

  // Decor (all rooms)
  { id: 'plants', name: 'Plants', category: 'decor', promptKeywords: 'indoor plants, potted plants, greenery', icon: '🪴' },
  { id: 'wall-art', name: 'Wall Art', category: 'decor', promptKeywords: 'wall art, framed artwork, paintings', icon: '🖼️' },
  { id: 'mirror', name: 'Mirror', category: 'decor', promptKeywords: 'decorative mirror, wall mirror', icon: '🪞' },
  { id: 'vase', name: 'Vases', category: 'decor', promptKeywords: 'decorative vases, flower vases', icon: '🏺' },
  { id: 'throw-pillows', name: 'Throw Pillows', category: 'decor', promptKeywords: 'throw pillows, decorative pillows, cushions', icon: '🛋️' },
]

export const STYLE_BUNDLES: StyleBundle[] = [
  {
    id: 'modern',
    name: 'Modern',
    description: 'Clean lines, neutral colors, minimalist',
    promptPrefix: 'modern contemporary style, clean lines, neutral colors, minimalist furniture, sleek design',
    color: 'bg-slate-500',
  },
  {
    id: 'scandinavian',
    name: 'Scandinavian',
    description: 'Light wood, white walls, cozy textiles',
    promptPrefix: 'scandinavian style, light oak wood, white walls, cozy textiles, hygge aesthetic, natural materials',
    color: 'bg-amber-100',
  },
  {
    id: 'industrial',
    name: 'Industrial',
    description: 'Exposed brick, metal accents, raw materials',
    promptPrefix: 'industrial style, exposed brick, metal accents, raw materials, urban loft aesthetic, dark tones',
    color: 'bg-zinc-600',
  },
  {
    id: 'bohemian',
    name: 'Bohemian',
    description: 'Eclectic patterns, rich colors, layered textiles',
    promptPrefix: 'bohemian style, eclectic patterns, rich warm colors, layered textiles, plants, global influences',
    color: 'bg-orange-400',
  },
  {
    id: 'mid-century',
    name: 'Mid-Century Modern',
    description: 'Retro furniture, warm wood, iconic shapes',
    promptPrefix: 'mid-century modern style, retro furniture, warm walnut wood, iconic shapes, 1950s aesthetic',
    color: 'bg-amber-600',
  },
  {
    id: 'coastal',
    name: 'Coastal',
    description: 'Beach vibes, light blues, natural textures',
    promptPrefix: 'coastal style, beach vibes, light blue and white, natural textures, rattan, nautical elements',
    color: 'bg-sky-400',
  },
  {
    id: 'luxury',
    name: 'Luxury',
    description: 'Premium materials, elegant details, sophisticated',
    promptPrefix: 'luxury style, premium materials, elegant details, sophisticated design, marble, gold accents, velvet',
    color: 'bg-yellow-500',
  },
  {
    id: 'farmhouse',
    name: 'Farmhouse',
    description: 'Rustic charm, shiplap, vintage touches',
    promptPrefix: 'farmhouse style, rustic charm, shiplap walls, vintage touches, barn wood, cozy country aesthetic',
    color: 'bg-stone-400',
  },
]

export function buildStagingPrompt(
  roomType: string,
  style: StyleBundle,
  selectedFurniture: FurnitureItem[],
  customPrompt?: string
): string {
  const roomName = ROOM_TYPES.find(r => r.id === roomType)?.name || 'room'
  const furnitureList = selectedFurniture.map(f => f.promptKeywords).join(', ')

  let prompt = `Transform this empty ${roomName} into a beautifully staged ${roomName}. ${style.promptPrefix}`

  if (furnitureList) {
    prompt += `. Add ${furnitureList}`
  }

  if (customPrompt) {
    prompt += `. ${customPrompt}`
  }

  prompt += '. Professional interior photography, high quality, photorealistic, well-lit, magazine quality'

  return prompt
}
