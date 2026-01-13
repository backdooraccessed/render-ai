'use client'

import { useEffect, useState, useCallback } from 'react'
import { GenerationGrid } from '@/components/history/generation-grid'
import { Button } from '@/components/ui/button'
import { getSessionId } from '@/lib/utils'
import type { Generation } from '@/types'
import { RefreshCw, Heart } from 'lucide-react'
import { cn } from '@/lib/utils'
import { PDFExportButton } from '@/components/pdf-export-button'

type FilterMode = 'all' | 'favorites'

export default function HistoryPage() {
  const [generations, setGenerations] = useState<Generation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filterMode, setFilterMode] = useState<FilterMode>('all')

  const fetchGenerations = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const sessionId = getSessionId()
      const response = await fetch(`/api/generations?sessionId=${sessionId}`)
      const data = await response.json()

      if (!response.ok || !data.success) {
        setError(data.error || 'Failed to load generations')
        return
      }

      setGenerations(data.generations)
    } catch (err) {
      console.error('Failed to fetch generations:', err)
      setError('Failed to connect to server')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchGenerations()
  }, [fetchGenerations])

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/generations/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setGenerations((prev) => prev.filter((g) => g.id !== id))
      }
    } catch (err) {
      console.error('Failed to delete generation:', err)
    }
  }

  return (
    <div className="bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">
              Generation History
            </h1>
            <p className="text-muted-foreground">
              View and download your past renders
            </p>
          </div>
          <div className="flex gap-2">
            <PDFExportButton
              images={generations
                .filter(g => g.output_image_url)
                .map(g => g.output_image_url!)}
              title="RenderAI History"
              disabled={isLoading || generations.length === 0}
            />
            <Button
              variant="outline"
              size="sm"
              onClick={fetchGenerations}
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-lg bg-destructive/10 text-destructive text-sm">
            {error}
          </div>
        )}

        {/* Filter tabs */}
        <div className="flex gap-2 mb-6">
          <Button
            variant={filterMode === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterMode('all')}
          >
            All ({generations.length})
          </Button>
          <Button
            variant={filterMode === 'favorites' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterMode('favorites')}
            className={cn(filterMode === 'favorites' && "bg-red-500 hover:bg-red-600")}
          >
            <Heart className="h-4 w-4 mr-1" />
            Favorites ({generations.filter(g => g.is_favorite).length})
          </Button>
        </div>

        <GenerationGrid
          generations={filterMode === 'favorites'
            ? generations.filter(g => g.is_favorite)
            : generations}
          isLoading={isLoading}
          onDelete={handleDelete}
          emptyVariant={filterMode === 'favorites' ? 'favorites' : 'history'}
        />
      </div>
    </div>
  )
}
