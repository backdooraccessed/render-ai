'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

export function Header() {
  const pathname = usePathname()
  const isApp = pathname?.startsWith('/app')

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
            </>
          ) : (
            <>
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
          <Button asChild size="sm">
            <Link href="/app">
              {isApp ? 'New Generation' : 'Try Now'}
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  )
}
