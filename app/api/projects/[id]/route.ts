import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET /api/projects/[id] - Get a single project with its generations
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get project with generation count
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single()

    if (projectError || !project) {
      return NextResponse.json(
        { success: false, error: 'Project not found' },
        { status: 404 }
      )
    }

    // Get generations for this project
    const { data: generations, error: genError } = await supabase
      .from('generations')
      .select('*')
      .eq('project_id', id)
      .order('created_at', { ascending: false })

    if (genError) {
      console.error('Error fetching generations:', genError)
    }

    return NextResponse.json({
      success: true,
      project: {
        ...project,
        generation_count: generations?.length || 0,
      },
      generations: generations || [],
    })
  } catch (error) {
    console.error('Project API error:', error)
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}

// PUT /api/projects/[id] - Update a project
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const {
      name,
      description,
      client_name,
      address,
      default_style,
      default_room_type,
      is_archived,
      cover_image_url,
    } = body

    // Build update object with only provided fields
    const updates: Record<string, unknown> = { updated_at: new Date().toISOString() }

    if (name !== undefined) updates.name = name.trim()
    if (description !== undefined) updates.description = description?.trim() || null
    if (client_name !== undefined) updates.client_name = client_name?.trim() || null
    if (address !== undefined) updates.address = address?.trim() || null
    if (default_style !== undefined) updates.default_style = default_style || null
    if (default_room_type !== undefined) updates.default_room_type = default_room_type || null
    if (is_archived !== undefined) updates.is_archived = is_archived
    if (cover_image_url !== undefined) updates.cover_image_url = cover_image_url || null

    const { data: project, error } = await supabase
      .from('projects')
      .update(updates)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single()

    if (error) {
      console.error('Error updating project:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to update project' },
        { status: 500 }
      )
    }

    if (!project) {
      return NextResponse.json(
        { success: false, error: 'Project not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      project,
    })
  } catch (error) {
    console.error('Project API error:', error)
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}

// DELETE /api/projects/[id] - Delete a project
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // First, unlink all generations from this project
    await supabase
      .from('generations')
      .update({ project_id: null })
      .eq('project_id', id)

    // Then delete the project
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)

    if (error) {
      console.error('Error deleting project:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to delete project' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Project deleted',
    })
  } catch (error) {
    console.error('Project API error:', error)
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}
