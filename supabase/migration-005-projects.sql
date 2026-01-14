-- Sprint 5 Migration: Projects Feature
-- Run in Supabase SQL Editor

-- 1. Create projects table
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  client_name TEXT,
  address TEXT,
  default_style TEXT,
  default_room_type TEXT,
  cover_image_url TEXT,
  is_archived BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Add project_id to generations
ALTER TABLE public.generations
ADD COLUMN IF NOT EXISTS project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL;

-- 3. Create indexes
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON public.projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON public.projects(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_generations_project_id ON public.generations(project_id);

-- 4. Enable RLS on projects
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- 5. Projects RLS policies
CREATE POLICY "Users can view own projects" ON public.projects
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own projects" ON public.projects
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own projects" ON public.projects
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own projects" ON public.projects
  FOR DELETE USING (auth.uid() = user_id);

-- 6. Function to update project cover image (uses latest generation)
CREATE OR REPLACE FUNCTION public.update_project_cover()
RETURNS TRIGGER AS $$
BEGIN
  -- Update project cover to latest generation output
  IF NEW.project_id IS NOT NULL AND NEW.output_image_url IS NOT NULL THEN
    UPDATE public.projects
    SET cover_image_url = NEW.output_image_url,
        updated_at = NOW()
    WHERE id = NEW.project_id
    AND cover_image_url IS NULL;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Trigger to auto-update cover image
DROP TRIGGER IF EXISTS on_generation_complete ON public.generations;
CREATE TRIGGER on_generation_complete
  AFTER INSERT OR UPDATE OF output_image_url ON public.generations
  FOR EACH ROW
  WHEN (NEW.output_image_url IS NOT NULL)
  EXECUTE FUNCTION public.update_project_cover();

-- 8. Function to get project stats
CREATE OR REPLACE FUNCTION public.get_project_stats(project_uuid UUID)
RETURNS TABLE(
  total_generations BIGINT,
  completed_generations BIGINT,
  latest_generation TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(*)::BIGINT as total_generations,
    COUNT(*) FILTER (WHERE status = 'completed')::BIGINT as completed_generations,
    MAX(created_at) as latest_generation
  FROM public.generations
  WHERE project_id = project_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
