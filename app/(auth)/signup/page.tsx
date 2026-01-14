import Link from 'next/link'
import { SignupForm } from '@/components/auth/signup-form'
import { Check } from 'lucide-react'

export default function SignupPage() {
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
            <span className="text-2xl font-semibold tracking-tight">
              RenderAI
            </span>
          </Link>

          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-[var(--surface-light)] mb-6">
            Start creating.
          </h1>
          <p className="text-lg text-[var(--text-secondary)] leading-relaxed max-w-md">
            Get started free with 5 renders per day. No credit card required.
          </p>

          <div className="mt-12 space-y-4">
            {[
              '5 free renders every day',
              'All style presets included',
              'No watermarks on outputs',
              'Commercial use allowed',
            ].map((feature) => (
              <div key={feature} className="flex items-center gap-3">
                <div className="h-6 w-6 rounded-full bg-[var(--accent)] flex items-center justify-center">
                  <Check className="h-3.5 w-3.5 text-[var(--bg-primary)]" />
                </div>
                <span className="text-[var(--text-secondary)]">{feature}</span>
              </div>
            ))}
          </div>

          {/* Testimonial */}
          <div className="mt-16 p-6 rounded-xl bg-[var(--bg-elevated)] border border-white/5">
            <p className="text-lg text-[var(--surface-light)] leading-relaxed">
              &ldquo;RenderAI helped me sell a vacant listing in just 3 days. The AI staging made all the difference.&rdquo;
            </p>
            <div className="flex items-center gap-3 mt-4 pt-4 border-t border-white/5">
              <div className="h-8 w-8 rounded-full bg-[var(--accent)]/10 flex items-center justify-center">
                <span className="text-xs font-medium text-[var(--accent)]">SM</span>
              </div>
              <div>
                <p className="text-sm text-[var(--surface-light)]">Sarah Mitchell</p>
                <p className="text-xs text-[var(--text-muted)]">Real Estate Agent</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-4 py-12 bg-[var(--bg-primary)]">
        <SignupForm />
      </div>
    </div>
  )
}
