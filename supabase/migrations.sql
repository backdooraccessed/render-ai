-- RenderAI Database Schema
-- Run this in the Supabase SQL Editor

-- Generations table (no user association for prototype)
CREATE TABLE IF NOT EXISTS public.generations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT,
  input_image_url TEXT NOT NULL,
  output_image_url TEXT,
  style TEXT NOT NULL,
  room_type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  replicate_prediction_id TEXT,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- Enable Row Level Security
ALTER TABLE public.generations ENABLE ROW LEVEL SECURITY;

-- Allow public read/write for prototype (no auth)
CREATE POLICY "Allow public read" ON public.generations
  FOR SELECT USING (true);

CREATE POLICY "Allow public insert" ON public.generations
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update" ON public.generations
  FOR UPDATE USING (true);

-- Styles reference table
CREATE TABLE IF NOT EXISTS public.styles (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  prompt_modifier TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0
);

-- Room types reference table
CREATE TABLE IF NOT EXISTS public.room_types (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  prompt_modifier TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0
);

-- Insert default styles
INSERT INTO public.styles (id, name, prompt_modifier, sort_order) VALUES
  ('modern', 'Modern', 'modern contemporary interior design, clean lines, minimalist furniture, neutral color palette, sophisticated', 1),
  ('minimalist', 'Minimalist', 'minimalist interior design, very clean and sparse, white and neutral tones, zen-like simplicity, open space', 2),
  ('scandinavian', 'Scandinavian', 'scandinavian interior design, light wood tones, cozy textiles, hygge atmosphere, natural light, warm and inviting', 3),
  ('industrial', 'Industrial', 'industrial interior design, exposed brick walls, metal accents, raw materials, loft style, urban aesthetic', 4),
  ('luxury', 'Luxury', 'luxury high-end interior design, elegant furniture, marble surfaces, gold accents, crystal chandeliers, sophisticated opulence', 5),
  ('japandi', 'Japandi', 'japandi interior design, japanese minimalism meets scandinavian warmth, natural materials, calm and serene, balanced', 6),
  ('mid_century', 'Mid-Century Modern', 'mid-century modern interior design, retro 1950s-60s furniture, organic shapes, warm wood tones, vintage aesthetic', 7),
  ('bohemian', 'Bohemian', 'bohemian interior design, eclectic mix of patterns, colorful textiles, indoor plants, artistic and layered', 8)
ON CONFLICT (id) DO NOTHING;

-- Insert default room types
INSERT INTO public.room_types (id, name, prompt_modifier, sort_order) VALUES
  ('living_room', 'Living Room', 'spacious living room, comfortable sofa, coffee table, ambient lighting, cozy seating arrangement', 1),
  ('bedroom', 'Bedroom', 'serene bedroom, luxurious bed, soft bedding, nightstands, relaxing atmosphere', 2),
  ('kitchen', 'Kitchen', 'modern kitchen, sleek cabinets, stone countertops, high-end appliances, functional layout', 3),
  ('bathroom', 'Bathroom', 'spa-like bathroom, elegant vanity, large mirror, quality fixtures, clean tiles', 4),
  ('office', 'Home Office', 'professional home office, ergonomic desk setup, comfortable chair, organized workspace, good lighting', 5),
  ('dining_room', 'Dining Room', 'elegant dining room, beautiful dining table, stylish chairs, pendant lighting, inviting atmosphere', 6)
ON CONFLICT (id) DO NOTHING;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_generations_session_id ON public.generations(session_id);
CREATE INDEX IF NOT EXISTS idx_generations_status ON public.generations(status);
CREATE INDEX IF NOT EXISTS idx_generations_created_at ON public.generations(created_at DESC);

-- Storage bucket for images (run this separately in Storage section)
-- Create a bucket named 'renders' with public access
