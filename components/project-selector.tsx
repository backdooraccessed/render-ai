'use client'

import { useState, useEffect } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { FolderOpen, Plus, X } from 'lucide-react'
import Link from 'next/link'
import type { Project } from '@/types'

interface ProjectSelectorProps {
  selectedProjectId: string | null
  onProjectSelect: (projectId: string | null) => void
  disabled?: boolean
}

export function ProjectSelector({
  selectedProjectId,
  onProjectSelect,
  disabled,
}: ProjectSelectorProps) {
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('/api/projects')
        const data = await response.json()

        if (data.success) {
          setProjects(data.projects)
        }
      } catch (error) {
        console.error('Failed to fetch projects:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProjects()
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <FolderOpen className="h-4 w-4" />
        Loading projects...
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <FolderOpen className="h-4 w-4 text-muted-foreground" />
      <Select
        value={selectedProjectId || 'none'}
        onValueChange={(value) => onProjectSelect(value === 'none' ? null : value)}
        disabled={disabled}
      >
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Select project" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">No project</SelectItem>
          {projects.map((project) => (
            <SelectItem key={project.id} value={project.id}>
              {project.name}
            </SelectItem>
          ))}
          {projects.length === 0 && (
            <div className="px-2 py-4 text-center text-sm text-muted-foreground">
              No projects yet
            </div>
          )}
        </SelectContent>
      </Select>

      {selectedProjectId && (
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => onProjectSelect(null)}
          disabled={disabled}
        >
          <X className="h-4 w-4" />
        </Button>
      )}

      <Button variant="ghost" size="sm" asChild>
        <Link href="/app/projects">
          <Plus className="mr-1 h-3 w-3" />
          New
        </Link>
      </Button>
    </div>
  )
}
