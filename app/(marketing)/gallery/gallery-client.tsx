'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { GalleryGrid } from '@/components/gallery/gallery-grid'
import { GalleryFilters } from '@/components/gallery/gallery-filters'
import { Sparkles, ChevronLeft, ChevronRight } from 'lucide-react'

interface Generation {
  id: string
  input_image_url: string
  output_image_url: string
  style: string
  room_type: string
  view_count?: number
  share_token?: string
  is_featured?: boolean
}

interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

export function GalleryPageClient() {
  const [generations, setGenerations] = useState<Generation[]>([])
  const [featuredGenerations, setFeaturedGenerations] = useState<Generation[]>([])
  const [pagination, setPagination] = useState<Pagination | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [style, setStyle] = useState('all')
  const [roomType, setRoomType] = useState('all')
  const [sort, setSort] = useState('recent')
  const [page, setPage] = useState(1)

  // Fetch featured generations
  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const response = await fetch('/api/gallery?featured=true&limit=4')
        const data = await response.json()
        if (data.success) {
          setFeaturedGenerations(data.generations)
        }
      } catch (error) {
        console.error('Failed to fetch featured:', error)
      }
    }
    fetchFeatured()
  }, [])

  // Fetch gallery
  useEffect(() => {
    const fetchGallery = async () => {
      setIsLoading(true)
      try {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: '12',
          sort,
        })
        if (style !== 'all') params.set('style', style)
        if (roomType !== 'all') params.set('roomType', roomType)

        const response = await fetch(`/api/gallery?${params}`)
        const data = await response.json()

        if (data.success) {
          setGenerations(data.generations)
          setPagination(data.pagination)
        }
      } catch (error) {
        console.error('Failed to fetch gallery:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchGallery()
  }, [style, roomType, sort, page])

  const handleFilterChange = () => {
    setPage(1)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <span className="font-semibold text-lg">RenderAI</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/gallery"
              className="text-sm font-medium text-primary"
            >
              Gallery
            </Link>
            <Button asChild>
              <Link href="/app">Create</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Hero */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Community Gallery
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Explore stunning interior renders created by our community.
            Hover over any image to see the before/after transformation.
          </p>
        </div>

        {/* Featured Section */}
        {featuredGenerations.length > 0 && (
          <section className="mb-12">
            <h2 className="text-xl font-semibold mb-4">Featured Renders</h2>
            <GalleryGrid generations={featuredGenerations} />
          </section>
        )}

        {/* All Renders */}
        <section>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <h2 className="text-xl font-semibold">All Renders</h2>
            <GalleryFilters
              style={style}
              roomType={roomType}
              sort={sort}
              onStyleChange={(v) => {
                setStyle(v)
                handleFilterChange()
              }}
              onRoomTypeChange={(v) => {
                setRoomType(v)
                handleFilterChange()
              }}
              onSortChange={(v) => {
                setSort(v)
                handleFilterChange()
              }}
            />
          </div>

          <GalleryGrid generations={generations} isLoading={isLoading} />

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <span className="text-sm text-muted-foreground px-4">
                Page {page} of {pagination.totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(page + 1)}
                disabled={page === pagination.totalPages}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </section>

        {/* CTA */}
        <section className="mt-16 text-center py-12 bg-muted/50 rounded-lg">
          <h2 className="text-2xl font-semibold mb-2">
            Ready to Transform Your Space?
          </h2>
          <p className="text-muted-foreground mb-6">
            Upload a photo and see it transformed in seconds with AI
          </p>
          <Button size="lg" asChild>
            <Link href="/app">
              <Sparkles className="mr-2 h-4 w-4" />
              Start Creating
            </Link>
          </Button>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t mt-16 py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>RenderAI - AI-Powered Interior Design</p>
        </div>
      </footer>
    </div>
  )
}
