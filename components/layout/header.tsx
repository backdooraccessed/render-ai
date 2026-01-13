'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { UserMenu } from '@/components/auth/user-menu'
import { createClient } from '@/lib/supabase/client'
import { Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { User } from '@supabase/supabase-js'
import type { Profile } from '@/lib/auth'

export function Header() {
  const pathname = usePathname()
  const isApp = pathname?.startsWith('/app') || pathname?.startsWith('/settings') || pathname?.startsWith('/pricing')
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()

    // Get initial session
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)

      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()
        setProfile(profile)
      }

      setIsLoading(false)
    }

    getUser()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null)

        if (session?.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single()
          setProfile(profile)
        } else {
          setProfile(null)
        }
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 items-center px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Sparkles className="h-5 w-5 text-primary" />
          <span>RenderAI</span>
        </Link>

        <nav className="ml-auto flex items-center gap-4">
          {isApp ? (
            <>
              <Link
                href="/app"
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  pathname === '/app' ? 'text-primary' : 'text-muted-foreground'
                )}
              >
                Generate
              </Link>
              <Link
                href="/app/batch"
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  pathname === '/app/batch' ? 'text-primary' : 'text-muted-foreground'
                )}
              >
                Batch
              </Link>
              <Link
                href="/app/history"
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  pathname === '/app/history' ? 'text-primary' : 'text-muted-foreground'
                )}
              >
                History
              </Link>
              <Link
                href="/gallery"
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  pathname === '/gallery' ? 'text-primary' : 'text-muted-foreground'
                )}
              >
                Gallery
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/gallery"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                Gallery
              </Link>
              <Link
                href="#features"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                Features
              </Link>
              <Link
                href="#how-it-works"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                How it Works
              </Link>
            </>
          )}

          {!isLoading && (
            user ? (
              <UserMenu user={{ email: user.email }} profile={profile} />
            ) : (
              <Button asChild size="sm">
                <Link href="/login">Sign In</Link>
              </Button>
            )
          )}
        </nav>
      </div>
    </header>
  )
}
