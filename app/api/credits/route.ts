import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { checkGenerationLimit } from '@/lib/auth'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      )
    }

    const { allowed, remaining, isPro } = await checkGenerationLimit(user.id)

    return NextResponse.json({
      success: true,
      credits: {
        remaining,
        isPro,
        canGenerate: allowed,
        dailyLimit: isPro ? null : 5,
      },
    })
  } catch (error) {
    console.error('Credits check error:', error)
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}
