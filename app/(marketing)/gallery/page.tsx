import { Metadata } from 'next'
import { GalleryPageClient } from './gallery-client'

export const metadata: Metadata = {
  title: 'Gallery - RenderAI',
  description: 'Browse stunning AI-generated interior design renders created by our community. Get inspired for your next project.',
  openGraph: {
    title: 'Gallery - RenderAI',
    description: 'Browse stunning AI-generated interior design renders created by our community.',
    type: 'website',
  },
}

export default function GalleryPage() {
  return <GalleryPageClient />
}
