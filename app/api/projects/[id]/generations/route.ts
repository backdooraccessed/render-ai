import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// POST /api/projects/[id]/generations - Add generations to a project
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: projectId } = await params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Verify project belongs to user
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('id')
      .eq('id', projectId)
      .eq('user_id', user.id)
      .single()

    if (projectError || !project) {
      return NextResponse.json(
        { success: false, error: 'Project not found' },
        { status: 404 }
      )
    }

    const body = await request.json()
    const { generationIds } = body

    if (!Array.isArray(generationIds) || generationIds.length === 0) {
      return NextResponse.json(
        { success: false, error: 'generationIds array is required' },
        { status: 400 }
      )
    }

    // Update generations to add to project
    const { error: updateError } = await supabase
      .from('generations')
      .update({ project_id: projectId })
      .in('id', generationIds)
      .eq('user_id', user.id)

    if (updateError) {
      console.error('Error adding generations to project:', updateError)
      return NextResponse.json(
        { success: false, error: 'Failed to add generations to project' },
        { status: 500 }
      )
    }

    // Update project's updated_at
    await supabase
      .from('projects')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', projectId)

    return NextResponse.json({
      success: true,
      message: `Added ${generationIds.length} generation(s) to project`,
    })
  } catch (error) {
    console.error('Project generations API error:', error)
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}

// DELETE /api/projects/[id]/generations - Remove generations from a project
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: projectId } = await params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { generationIds } = body

    if (!Array.isArray(generationIds) || generationIds.length === 0) {
      return NextResponse.json(
        { success: false, error: 'generationIds array is required' },
        { status: 400 }
      )
    }

    // Remove generations from project (set project_id to null)
    const { error: updateError } = await supabase
      .from('generations')
      .update({ project_id: null })
      .in('id', generationIds)
      .eq('project_id', projectId)
      .eq('user_id', user.id)

    if (updateError) {
      console.error('Error removing generations from project:', updateError)
      return NextResponse.json(
        { success: false, error: 'Failed to remove generations from project' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: `Removed ${generationIds.length} generation(s) from project`,
    })
  } catch (error) {
    console.error('Project generations API error:', error)
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}
