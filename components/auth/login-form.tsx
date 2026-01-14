'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { GoogleButton } from '@/components/auth/google-button'
import { createClient } from '@/lib/supabase/client'
import { Loader2, ArrowRight } from 'lucide-react'

export function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    const supabase = createClient()

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
      setIsLoading(false)
      return
    }

    router.push('/app')
    router.refresh()
  }

  return (
    <div className="w-full max-w-md">
      {/* Mobile logo */}
      <div className="lg:hidden flex justify-center mb-8">
        <Link href="/" className="flex items-center gap-2.5">
          {/* The Frame logo mark */}
          <div className="relative h-10 w-10">
            <div className="absolute inset-0 rounded-lg border border-[var(--accent)]/30" />
            <div className="absolute inset-1.5 rounded-md border border-[var(--accent)]/50" />
            <div className="absolute inset-3 rounded-sm bg-[var(--accent)]" />
          </div>
          <span className="text-xl tracking-tight">
            <span className="font-display">Render</span>
            <span className="font-display italic text-[var(--accent)]">AI</span>
          </span>
        </Link>
      </div>

      <div className="text-center mb-8">
        <h1 className="font-display text-2xl text-[var(--surface-light)] mb-2">Welcome back</h1>
        <p className="text-[var(--text-secondary)]">Sign in to your RenderAI account</p>
      </div>

      <div className="space-y-6">
        <GoogleButton />

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-white/10" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-[var(--bg-primary)] px-2 text-[var(--text-muted)]">
              Or continue with email
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-[var(--text-secondary)]">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
              className="h-11 bg-[var(--bg-elevated)] border-white/10 text-[var(--surface-light)] placeholder:text-[var(--text-muted)] focus:border-[var(--accent)]/50 focus:ring-[var(--accent)]/20"
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-[var(--text-secondary)]">Password</Label>
              <Link
                href="/forgot-password"
                className="text-sm text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors"
              >
                Forgot password?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="Your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
              className="h-11 bg-[var(--bg-elevated)] border-white/10 text-[var(--surface-light)] placeholder:text-[var(--text-muted)] focus:border-[var(--accent)]/50 focus:ring-[var(--accent)]/20"
            />
          </div>

          {error && (
            <Alert variant="destructive" className="bg-red-500/10 border-red-500/20 text-red-400">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button
            type="submit"
            className="w-full h-11 btn-accent gap-2"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                Sign In
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </form>

        <p className="text-center text-sm text-[var(--text-muted)]">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="text-[var(--accent)] font-medium hover:underline">
            Sign up free
          </Link>
        </p>
      </div>
    </div>
  )
}
