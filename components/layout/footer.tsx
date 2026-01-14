'use client'

import Link from 'next/link'
import { Sparkles } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="h-7 w-7 rounded-lg bg-gradient-brand flex items-center justify-center">
              <Sparkles className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="text-sm font-semibold">
              Render<span className="text-gradient-brand">AI</span>
            </span>
          </Link>

          {/* Nav links */}
          <nav className="flex items-center gap-6">
            <Link
              href="/app"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Generate
            </Link>
            <Link
              href="/app/stage"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Stage
            </Link>
            <Link
              href="/app/projects"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Projects
            </Link>
            <Link
              href="/app/history"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              History
            </Link>
          </nav>

          {/* Copyright */}
          <p className="text-sm text-muted-foreground">
            {new Date().getFullYear()} RenderAI
          </p>
        </div>
      </div>
    </footer>
  )
}
