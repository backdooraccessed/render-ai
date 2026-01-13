-- Migration: Add favorites support
-- Run this in the Supabase SQL Editor

-- Add is_favorite column to generations table
ALTER TABLE public.generations
ADD COLUMN IF NOT EXISTS is_favorite BOOLEAN DEFAULT FALSE;

-- Create index for favorites filtering
CREATE INDEX IF NOT EXISTS idx_generations_is_favorite ON public.generations(is_favorite);

-- Allow public delete for generations
CREATE POLICY IF NOT EXISTS "Allow public delete" ON public.generations
  FOR DELETE USING (true);
