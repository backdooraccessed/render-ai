import Link from 'next/link'
import { LoginForm } from '@/components/auth/login-form'

export default function LoginPage() {
  return (
    <div className="min-h-screen flex bg-[var(--bg-primary)]">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-[var(--bg-secondary)] relative overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[var(--accent)]/5 rounded-full blur-3xl" />

        {/* Film grain overlay */}
        <div className="absolute inset-0 opacity-[0.015] pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PC9maWx0ZXI+PHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSIzMDAiIGZpbHRlcj0idXJsKCNhKSIgb3BhY2l0eT0iMSIvPjwvc3ZnPg==')]" />

        <div className="relative z-10 flex flex-col justify-center px-16 max-w-xl">
          <Link href="/" className="flex items-center gap-3 mb-16">
            {/* The Frame logo mark */}
            <div className="relative h-12 w-12">
              <div className="absolute inset-0 rounded-lg border border-[var(--accent)]/30" />
              <div className="absolute inset-2 rounded-md border border-[var(--accent)]/50" />
              <div className="absolute inset-4 rounded-sm bg-[var(--accent)]" />
            </div>
            <span className="text-2xl tracking-tight">
              <span className="font-display">Render</span>
              <span className="font-display italic text-[var(--accent)]">AI</span>
            </span>
          </Link>

          <h1 className="font-display text-4xl md:text-5xl tracking-tight mb-6">
            <span className="text-[var(--surface-light)]">Welcome </span>
            <span className="italic text-[var(--accent)]">back.</span>
          </h1>
          <p className="text-lg text-[var(--text-secondary)] leading-relaxed max-w-md">
            Continue transforming spaces into photorealistic renders. Your projects are waiting.
          </p>

          <div className="mt-16 space-y-6">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-lg border border-white/10 flex items-center justify-center">
                <span className="text-sm font-medium text-[var(--accent)]">01</span>
              </div>
              <span className="text-[var(--text-secondary)]">Upload any room photo</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-lg border border-white/10 flex items-center justify-center">
                <span className="text-sm font-medium text-[var(--accent)]">02</span>
              </div>
              <span className="text-[var(--text-secondary)]">Describe your vision</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-lg border border-white/10 flex items-center justify-center">
                <span className="text-sm font-medium text-[var(--accent)]">03</span>
              </div>
              <span className="text-[var(--text-secondary)]">Get stunning renders in seconds</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-4 py-12 bg-[var(--bg-primary)]">
        <LoginForm />
      </div>
    </div>
  )
}
