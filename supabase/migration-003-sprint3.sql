-- Sprint 3 Migration: Advanced AI & Growth Features
-- Run in Supabase SQL Editor

-- Upscaling support
ALTER TABLE public.generations
ADD COLUMN IF NOT EXISTS upscaled_image_url TEXT;

-- Public gallery support
ALTER TABLE public.generations
ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS share_token TEXT UNIQUE;

-- Indexes for gallery performance
CREATE INDEX IF NOT EXISTS idx_generations_is_public ON public.generations(is_public);
CREATE INDEX IF NOT EXISTS idx_generations_is_featured ON public.generations(is_featured);
CREATE INDEX IF NOT EXISTS idx_generations_share_token ON public.generations(share_token);
CREATE INDEX IF NOT EXISTS idx_generations_view_count ON public.generations(view_count DESC);

-- Composite index for gallery queries
CREATE INDEX IF NOT EXISTS idx_generations_public_created
ON public.generations(is_public, created_at DESC)
WHERE is_public = true;
