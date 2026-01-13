'use client'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { ImageIcon, Sparkles, History, Heart, FolderOpen } from 'lucide-react'

type EmptyStateVariant = 'generations' | 'history' | 'favorites' | 'gallery' | 'default'

interface EmptyStateProps {
  variant?: EmptyStateVariant
  title?: string
  description?: string
  actionLabel?: string
  onAction?: () => void
  className?: string
}

const variants: Record<EmptyStateVariant, {
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
  actionLabel?: string
}> = {
  generations: {
    icon: ImageIcon,
    title: 'No render yet',
    description: 'Upload an image and describe your vision to create your first AI-generated interior render.',
    actionLabel: 'Upload Image',
  },
  history: {
    icon: History,
    title: 'No generations yet',
    description: 'Your design history will appear here once you create your first render.',
    actionLabel: 'Start Creating',
  },
  favorites: {
    icon: Heart,
    title: 'No favorites yet',
    description: 'Heart your favorite renders to save them here for quick access.',
  },
  gallery: {
    icon: Sparkles,
    title: 'Gallery is empty',
    description: 'Be the first to share your creations with the community!',
    actionLabel: 'Create & Share',
  },
  default: {
    icon: FolderOpen,
    title: 'Nothing here yet',
    description: 'Content will appear here once available.',
  },
}

export function EmptyState({
  variant = 'default',
  title,
  description,
  actionLabel,
  onAction,
  className,
}: EmptyStateProps) {
  const config = variants[variant]
  const Icon = config.icon

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center py-12 px-4 text-center animate-fade-in-up',
        className
      )}
    >
      {/* Illustrated icon */}
      <div className="relative mb-6">
        <div className="w-20 h-20 rounded-2xl bg-muted flex items-center justify-center">
          <Icon className="h-10 w-10 text-muted-foreground" />
        </div>
        {/* Decorative dots */}
        <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-primary/30" />
        <div className="absolute -bottom-2 -left-2 w-2 h-2 rounded-full bg-primary/20" />
      </div>

      {/* Text content */}
      <h3 className="text-lg font-semibold mb-2">
        {title || config.title}
      </h3>
      <p className="text-muted-foreground max-w-sm mb-6">
        {description || config.description}
      </p>

      {/* Action button */}
      {(actionLabel || config.actionLabel) && onAction && (
        <Button onClick={onAction}>
          <Sparkles className="h-4 w-4 mr-2" />
          {actionLabel || config.actionLabel}
        </Button>
      )}
    </div>
  )
}
