'use client'

import { Zap, Wand2, Sliders, Download, Layers, Lock } from 'lucide-react'

const features = [
  {
    icon: Wand2,
    title: 'Natural Language',
    description: 'Simply describe what you want in plain English. No complex settings or design skills needed.',
    gradient: 'from-pink-500 to-violet-500',
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Get photorealistic renders in under 30 seconds. No waiting for hours or days.',
    gradient: 'from-violet-500 to-purple-500',
  },
  {
    icon: Sliders,
    title: 'Full Control',
    description: 'Adjust transformation strength to preserve your original layout or go bold with changes.',
    gradient: 'from-purple-500 to-indigo-500',
  },
  {
    icon: Download,
    title: 'High Quality Output',
    description: 'Download high-resolution images ready for listings, presentations, or social media.',
    gradient: 'from-indigo-500 to-blue-500',
  },
  {
    icon: Layers,
    title: 'Project Organization',
    description: 'Organize renders by property or client. Keep your work structured and accessible.',
    gradient: 'from-blue-500 to-teal-500',
  },
  {
    icon: Lock,
    title: 'Privacy First',
    description: 'Your images are processed securely. No data is shared or used for training.',
    gradient: 'from-teal-500 to-emerald-500',
  },
]

export function Features() {
  return (
    <section id="features" className="py-20 md:py-28 bg-background">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm mb-4">
            <span className="text-gradient-brand font-medium">Features</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Everything You Need to{' '}
            <span className="text-gradient-brand">Transform Spaces</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Professional interior visualization made simple, fast, and affordable.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group relative rounded-2xl border bg-card p-6 transition-all duration-300 hover:shadow-lg hover:border-primary/20 card-hover"
            >
              {/* Gradient accent */}
              <div className={`absolute inset-x-0 top-0 h-1 rounded-t-2xl bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity`} />

              <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${feature.gradient}`}>
                <feature.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
