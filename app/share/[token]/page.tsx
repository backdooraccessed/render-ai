import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { isValidShareToken } from '@/lib/share'
import { SharePageClient } from './share-page-client'

interface SharePageProps {
  params: Promise<{ token: string }>
}

export async function generateMetadata({ params }: SharePageProps): Promise<Metadata> {
  const { token } = await params

  if (!token || !isValidShareToken(token)) {
    return {
      title: 'Not Found - RenderAI',
    }
  }

  const supabase = await createClient()
  const { data: generation } = await supabase
    .from('generations')
    .select('style, room_type, output_image_url')
    .eq('share_token', token)
    .single()

  if (!generation) {
    return {
      title: 'Not Found - RenderAI',
    }
  }

  const title = `${generation.style} ${generation.room_type} Render - RenderAI`
  const description = `Check out this AI-generated ${generation.style.toLowerCase()} ${generation.room_type.toLowerCase()} render created with RenderAI`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: generation.output_image_url ? [generation.output_image_url] : [],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: generation.output_image_url ? [generation.output_image_url] : [],
    },
  }
}

export default async function SharePage({ params }: SharePageProps) {
  const { token } = await params

  if (!token || !isValidShareToken(token)) {
    notFound()
  }

  const supabase = await createClient()

  const { data: generation, error } = await supabase
    .from('generations')
    .select('*')
    .eq('share_token', token)
    .single()

  if (error || !generation) {
    notFound()
  }

  // Increment view count (fire and forget)
  supabase
    .from('generations')
    .update({ view_count: (generation.view_count || 0) + 1 })
    .eq('id', generation.id)
    .then(() => {})

  return <SharePageClient generation={generation} />
}
