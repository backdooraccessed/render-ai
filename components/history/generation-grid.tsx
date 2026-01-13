'use client'

import { useRouter } from 'next/navigation'
import { GenerationCard } from './generation-card'
import { Skeleton } from '@/components/ui/skeleton'
import { EmptyState } from '@/components/empty-state'
import type { Generation } from '@/types'

interface GenerationGridProps {
  generations: Generation[]
  isLoading?: boolean
  onDelete?: (id: string) => void
  emptyVariant?: 'history' | 'favorites'
}

export function GenerationGrid({
  generations,
  isLoading,
  onDelete,
  emptyVariant = 'history',
}: GenerationGridProps) {
  const router = useRouter()

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
      <EmptyState
        variant={emptyVariant}
        onAction={() => router.push('/app')}
      />
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 stagger-children">
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
