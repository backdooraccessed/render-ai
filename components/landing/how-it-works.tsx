'use client'

import { Upload, Palette, Download } from 'lucide-react'

const steps = [
  {
    icon: Upload,
    step: '01',
    title: 'Upload',
    description: 'Drop any room photo, sketch, or 3D screenshot. We support all common image formats.',
  },
  {
    icon: Palette,
    step: '02',
    title: 'Describe',
    description: 'Choose a style preset or describe your vision in plain language. Be as specific as you like.',
  },
  {
    icon: Download,
    step: '03',
    title: 'Download',
    description: 'Get your photorealistic render in 30 seconds. High resolution, ready for any use.',
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 md:py-32 bg-[var(--bg-primary)]">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="max-w-2xl mx-auto text-center mb-20">
          <span className="badge-studio animate-fade-up">How It Works</span>
          <h2 className="mt-6 text-4xl md:text-5xl font-semibold tracking-tight text-[var(--surface-light)] animate-fade-up delay-1">
            Three steps to stunning.
          </h2>
          <p className="mt-4 text-[var(--text-secondary)] text-lg animate-fade-up delay-2">
            No design skills required. Just upload, describe, and download.
          </p>
        </div>

        {/* Steps */}
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 md:gap-6">
            {steps.map((step, index) => (
              <div
                key={step.step}
                className="relative animate-fade-up"
                style={{ animationDelay: `${(index + 3) * 100}ms` }}
              >
                {/* Connector line */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-px bg-gradient-to-r from-white/10 to-transparent" />
                )}

                <div className="card-studio p-8 h-full">
                  {/* Step number */}
                  <div className="flex items-center gap-4 mb-6">
                    <span className="text-xs font-mono text-[var(--accent)] tracking-wider">{step.step}</span>
                    <div className="flex-1 h-px bg-white/10" />
                  </div>

                  {/* Icon */}
                  <div className="mb-6 h-14 w-14 rounded-xl bg-[var(--bg-tertiary)] border border-white/5 flex items-center justify-center">
                    <step.icon className="h-7 w-7 text-[var(--accent)]" />
                  </div>

                  <h3 className="text-2xl font-semibold text-[var(--surface-light)] mb-3">
                    {step.title}
                  </h3>
                  <p className="text-[var(--text-secondary)] leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
