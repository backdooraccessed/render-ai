'use client'

const stats = [
  { value: '50,000+', label: 'Renders Generated' },
  { value: '5,000+', label: 'Active Users' },
  { value: '30+', label: 'Countries' },
  { value: '4.9/5', label: 'User Rating' },
]

export function SocialProof() {
  return (
    <section className="relative py-16 bg-[var(--bg-secondary)] border-y border-white/5">
      {/* Accent line at top */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-px bg-gradient-to-r from-transparent via-[var(--accent)]/50 to-transparent" />

      <div className="container mx-auto px-4">
        <p className="text-center text-sm text-[var(--text-muted)] tracking-wide uppercase mb-10">
          Trusted by professionals worldwide
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 max-w-4xl mx-auto">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className="text-center animate-fade-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="stat-number">{stat.value}</div>
              <div className="mt-2 text-sm text-[var(--text-muted)]">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
