'use client'

import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-[var(--bg-primary)]">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            {/* The Frame logo mark */}
            <div className="relative h-7 w-7">
              <div className="absolute inset-0 rounded-md border border-[var(--accent)]/30" />
              <div className="absolute inset-1 rounded-sm border border-[var(--accent)]/50" />
              <div className="absolute inset-2 rounded-[2px] bg-[var(--accent)]" />
            </div>
            <span className="text-sm font-semibold tracking-tight">
              RenderAI
            </span>
          </Link>

          {/* Nav links */}
          <nav className="flex items-center gap-6">
            <Link
              href="/app"
              className="text-sm text-[var(--text-muted)] hover:text-[var(--surface-light)] transition-colors"
            >
              Generate
            </Link>
            <Link
              href="/app/stage"
              className="text-sm text-[var(--text-muted)] hover:text-[var(--surface-light)] transition-colors"
            >
              Stage
            </Link>
            <Link
              href="/app/projects"
              className="text-sm text-[var(--text-muted)] hover:text-[var(--surface-light)] transition-colors"
            >
              Projects
            </Link>
            <Link
              href="/app/history"
              className="text-sm text-[var(--text-muted)] hover:text-[var(--surface-light)] transition-colors"
            >
              History
            </Link>
          </nav>

          {/* Copyright */}
          <p className="text-sm text-[var(--text-muted)]">
            {new Date().getFullYear()} RenderAI
          </p>
        </div>
      </div>
    </footer>
  )
}
