'use client'

import { GenerationCard } from './generation-card'
import { Skeleton } from '@/components/ui/skeleton'
import type { Generation } from '@/types'

interface GenerationGridProps {
  generations: Generation[]
  isLoading?: boolean
  onDelete?: (id: string) => void
}

export function GenerationGrid({ generations, isLoading, onDelete }: GenerationGridProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="aspect-[4/3] w-full rounded-lg" />
            <Skeleton className="h-4 w-20" />
          </div>
        ))}
      </div>
    )
  }

  if (generations.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No generations yet.</p>
        <p className="text-sm text-muted-foreground mt-1">
          Create your first render to see it here.
        </p>
      </div>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {generations.map((generation) => (
        <GenerationCard
          key={generation.id}
          generation={generation}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}
