'use client'

import { Upload, Palette, Download, ArrowRight } from 'lucide-react'

const steps = [
  {
    icon: Upload,
    step: '01',
    title: 'Upload Your Photo',
    description: 'Drag and drop any room photo, sketch, or 3D screenshot. We support JPG, PNG, and WebP formats.',
    color: 'from-pink-500 to-rose-500',
  },
  {
    icon: Palette,
    step: '02',
    title: 'Choose Your Style',
    description: 'Pick from preset styles like Modern, Scandinavian, or Industrial—or describe your vision in your own words.',
    color: 'from-violet-500 to-purple-500',
  },
  {
    icon: Download,
    step: '03',
    title: 'Download & Share',
    description: 'Get your photorealistic render in 30 seconds. Download in high resolution, ready for listings or presentations.',
    color: 'from-teal-500 to-emerald-500',
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 md:py-28 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border bg-background px-3 py-1 text-sm mb-4">
            <span className="text-gradient-brand font-medium">How It Works</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Transform Any Space in{' '}
            <span className="text-gradient-brand">3 Simple Steps</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            No design skills needed. Just upload, describe, and download.
          </p>
        </div>

        <div className="mx-auto max-w-5xl">
          <div className="grid gap-8 md:grid-cols-3">
            {steps.map((step, index) => (
              <div key={step.title} className="relative">
                {/* Connector arrow */}
                {index < steps.length - 1 && (
                  <div className="absolute top-12 -right-4 hidden md:flex items-center justify-center z-10">
                    <ArrowRight className="h-6 w-6 text-muted-foreground/30" />
                  </div>
                )}

                <div className="relative bg-card rounded-2xl border p-8 h-full card-hover">
                  {/* Step number badge */}
                  <div className={`absolute -top-4 left-8 inline-flex h-8 px-3 items-center justify-center rounded-full bg-gradient-to-r ${step.color} text-white text-sm font-bold shadow-lg`}>
                    {step.step}
                  </div>

                  <div className={`mt-4 mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${step.color}`}>
                    <step.icon className="h-7 w-7 text-white" />
                  </div>

                  <h3 className="mb-3 text-xl font-semibold">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
