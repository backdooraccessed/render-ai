'use client'

import { useState, useEffect, useCallback, use } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  ArrowLeft,
  Edit,
  Trash2,
  Archive,
  Plus,
  Image as ImageIcon,
  MapPin,
  User,
  Calendar,
  Download,
  ExternalLink,
  MoreVertical,
  Loader2,
  Sparkles,
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { toast } from 'sonner'
import type { Project, Generation } from '@/types'

export default function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const router = useRouter()

  const [project, setProject] = useState<Project | null>(null)
  const [generations, setGenerations] = useState<Generation[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Edit modal state
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [editForm, setEditForm] = useState({
    name: '',
    description: '',
    client_name: '',
    address: '',
  })

  const fetchProject = useCallback(async () => {
    try {
      const response = await fetch(`/api/projects/${id}`)
      const data = await response.json()

      if (data.success) {
        setProject(data.project)
        setGenerations(data.generations || [])
        setEditForm({
          name: data.project.name,
          description: data.project.description || '',
          client_name: data.project.client_name || '',
          address: data.project.address || '',
        })
      } else {
        toast.error('Project not found')
        router.push('/app/projects')
      }
    } catch (error) {
      console.error('Failed to fetch project:', error)
      toast.error('Failed to load project')
    } finally {
      setIsLoading(false)
    }
  }, [id, router])

  useEffect(() => {
    fetchProject()
  }, [fetchProject])

  const handleSaveProject = async () => {
    if (!editForm.name.trim()) {
      toast.error('Project name is required')
      return
    }

    setIsSaving(true)
    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      })

      const data = await response.json()

      if (data.success) {
        setProject(data.project)
        setIsEditOpen(false)
        toast.success('Project updated')
      } else {
        toast.error(data.error || 'Failed to update project')
      }
    } catch (error) {
      console.error('Failed to update project:', error)
      toast.error('Failed to update project')
    } finally {
      setIsSaving(false)
    }
  }

  const handleArchiveProject = async () => {
    if (!project) return

    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_archived: !project.is_archived }),
      })

      const data = await response.json()

      if (data.success) {
        setProject(data.project)
        toast.success(project.is_archived ? 'Project restored' : 'Project archived')
      }
    } catch (error) {
      console.error('Failed to archive project:', error)
      toast.error('Failed to update project')
    }
  }

  const handleDeleteProject = async () => {
    if (!confirm(`Delete "${project?.name}"? This cannot be undone.`)) return

    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (data.success) {
        toast.success('Project deleted')
        router.push('/app/projects')
      }
    } catch (error) {
      console.error('Failed to delete project:', error)
      toast.error('Failed to delete project')
    }
  }

  const handleRemoveGeneration = async (generationId: string) => {
    try {
      const response = await fetch(`/api/projects/${id}/generations`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ generationIds: [generationId] }),
      })

      const data = await response.json()

      if (data.success) {
        setGenerations(generations.filter(g => g.id !== generationId))
        toast.success('Removed from project')
      }
    } catch (error) {
      console.error('Failed to remove generation:', error)
      toast.error('Failed to remove from project')
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!project) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Back Button */}
      <Button variant="ghost" size="sm" asChild className="mb-6">
        <Link href="/app/projects">
          <ArrowLeft className="mr-2 h-4 w-4" />
          All Projects
        </Link>
      </Button>

      {/* Project Header */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-8">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold">{project.name}</h1>
            {project.is_archived && (
              <Badge variant="secondary">Archived</Badge>
            )}
          </div>

          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            {project.client_name && (
              <span className="flex items-center gap-1">
                <User className="h-4 w-4" />
                {project.client_name}
              </span>
            )}
            {project.address && (
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {project.address}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              Created {formatDate(project.created_at)}
            </span>
          </div>

          {project.description && (
            <p className="mt-3 text-muted-foreground">{project.description}</p>
          )}
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsEditOpen(true)}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button asChild>
            <Link href={`/app?project=${id}`}>
              <Sparkles className="mr-2 h-4 w-4" />
              Generate
            </Link>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleArchiveProject}>
                <Archive className="mr-2 h-4 w-4" />
                {project.is_archived ? 'Restore' : 'Archive'}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleDeleteProject}
                className="text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Project
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Generations Grid */}
      <div className="mb-4">
        <h2 className="text-xl font-semibold">
          Renders ({generations.length})
        </h2>
      </div>

      {generations.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <ImageIcon className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No renders yet</h3>
            <p className="text-muted-foreground text-center mb-4">
              Start generating renders for this project
            </p>
            <Button asChild>
              <Link href={`/app?project=${id}`}>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate Render
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {generations.map((generation) => (
            <Card key={generation.id} className="group overflow-hidden">
              <CardContent className="p-0">
                <div className="relative aspect-video bg-muted">
                  {generation.output_image_url ? (
                    <img
                      src={generation.output_image_url}
                      alt={`${generation.style} ${generation.room_type}`}
                      className="w-full h-full object-cover"
                    />
                  ) : generation.input_image_url ? (
                    <img
                      src={generation.input_image_url}
                      alt="Input"
                      className="w-full h-full object-cover opacity-50"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                  )}

                  {/* Hover Actions */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    {generation.output_image_url && (
                      <>
                        <Button size="sm" variant="secondary" asChild>
                          <a
                            href={generation.output_image_url}
                            download
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Download className="h-4 w-4" />
                          </a>
                        </Button>
                        <Button size="sm" variant="secondary" asChild>
                          <Link href={`/app/edit/${generation.id}`}>
                            <Edit className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button size="sm" variant="secondary" asChild>
                          <a
                            href={generation.output_image_url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </Button>
                      </>
                    )}
                  </div>
                </div>

                <div className="p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      <Badge variant="secondary">{generation.style}</Badge>
                      <Badge variant="outline">{generation.room_type}</Badge>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => handleRemoveGeneration(generation.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Remove from Project
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {formatDate(generation.created_at)}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Project</DialogTitle>
            <DialogDescription>Update project details</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Project Name *</Label>
              <Input
                id="edit-name"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-client">Client Name</Label>
              <Input
                id="edit-client"
                value={editForm.client_name}
                onChange={(e) => setEditForm({ ...editForm, client_name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-address">Property Address</Label>
              <Input
                id="edit-address"
                value={editForm.address}
                onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={editForm.description}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveProject} disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
