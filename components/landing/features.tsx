'use client'

import { Zap, Wand2, Sliders, Download, Layers, Lock } from 'lucide-react'

const features = [
  {
    icon: Wand2,
    title: 'Natural Language',
    description: 'Describe changes in plain English. No complex settings or design jargon required.',
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Photorealistic renders in under 30 seconds. No waiting hours or days.',
  },
  {
    icon: Sliders,
    title: 'Full Control',
    description: 'Adjust transformation strength. Preserve your layout or go bold.',
  },
  {
    icon: Download,
    title: 'High Resolution',
    description: 'Download publication-ready images for listings or presentations.',
  },
  {
    icon: Layers,
    title: 'Project Organization',
    description: 'Organize renders by property or client. Keep your work structured.',
  },
  {
    icon: Lock,
    title: 'Privacy First',
    description: 'Your images are processed securely. Never shared or used for training.',
  },
]

export function Features() {
  return (
    <section id="features" className="py-24 md:py-32 bg-[var(--bg-secondary)]">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="max-w-2xl mx-auto text-center mb-20">
          <span className="badge-studio animate-fade-up">Features</span>
          <h2 className="mt-6 text-4xl md:text-5xl font-semibold tracking-tight text-[var(--surface-light)] animate-fade-up delay-1">
            Everything you need to transform.
          </h2>
          <p className="mt-4 text-[var(--text-secondary)] text-lg animate-fade-up delay-2">
            Professional interior visualization made simple, fast, and affordable.
          </p>
        </div>

        {/* Features grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="card-studio p-6 animate-fade-up"
              style={{ animationDelay: `${(index + 3) * 100}ms` }}
            >
              <div className="mb-4 h-12 w-12 rounded-lg bg-[var(--bg-tertiary)] border border-white/5 flex items-center justify-center">
                <feature.icon className="h-6 w-6 text-[var(--accent)]" />
              </div>
              <h3 className="text-xl font-semibold text-[var(--surface-light)] mb-2">
                {feature.title}
              </h3>
              <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
