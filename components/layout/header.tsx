'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { UserMenu } from '@/components/auth/user-menu'
import { createClient } from '@/lib/supabase/client'
import { Sparkles, Menu, X, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { User } from '@supabase/supabase-js'
import type { Profile } from '@/lib/auth'

type NavLink = {
  href: string
  label: string
  matchPrefix?: boolean
}

const marketingLinks: NavLink[] = [
  { href: '#features', label: 'Features' },
  { href: '#how-it-works', label: 'How it Works' },
  { href: '#pricing', label: 'Pricing' },
  { href: '/gallery', label: 'Gallery' },
]

const appLinks: NavLink[] = [
  { href: '/app', label: 'Generate' },
  { href: '/app/stage', label: 'Stage' },
  { href: '/app/batch', label: 'Batch' },
  { href: '/app/projects', label: 'Projects', matchPrefix: true },
  { href: '/app/history', label: 'History' },
  { href: '/gallery', label: 'Gallery' },
]

export function Header() {
  const pathname = usePathname()
  const isApp = pathname?.startsWith('/app') || pathname?.startsWith('/settings') || pathname?.startsWith('/pricing')
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

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

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  const links = isApp ? appLinks : marketingLinks

  const isActiveLink = (href: string, matchPrefix?: boolean) => {
    if (matchPrefix) {
      return pathname?.startsWith(href)
    }
    return pathname === href
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-lg supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="h-9 w-9 rounded-xl bg-gradient-brand flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold">
            Render<span className="text-gradient-brand">AI</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "px-4 py-2 text-sm font-medium rounded-lg transition-colors",
                isActiveLink(link.href, link.matchPrefix)
                  ? 'text-foreground bg-muted'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Auth */}
        <div className="hidden md:flex items-center gap-3">
          {!isLoading && (
            user ? (
              <UserMenu user={{ email: user.email }} profile={profile} />
            ) : (
              <>
                <Button asChild variant="ghost" size="sm" className="text-muted-foreground">
                  <Link href="/login">Sign In</Link>
                </Button>
                <Button asChild size="sm" className="btn-gradient gap-1.5 rounded-lg">
                  <Link href="/signup">
                    Get Started
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </>
            )
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-background">
          <div className="container mx-auto px-4 py-4 space-y-2">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "block px-4 py-3 text-sm font-medium rounded-lg transition-colors",
                  isActiveLink(link.href, link.matchPrefix)
                    ? 'text-foreground bg-muted'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                )}
              >
                {link.label}
              </Link>
            ))}

            {/* Mobile Auth */}
            <div className="pt-4 border-t mt-4 space-y-2">
              {!isLoading && (
                user ? (
                  <div className="px-4 py-2 text-sm text-muted-foreground">
                    Signed in as {user.email}
                  </div>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="block px-4 py-3 text-sm font-medium text-muted-foreground rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/signup"
                      className="block px-4 py-3 text-sm font-medium text-white rounded-lg bg-gradient-brand text-center"
                    >
                      Get Started Free
                    </Link>
                  </>
                )
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
