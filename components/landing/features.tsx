import { Zap, Wand2, Sliders, Download } from 'lucide-react'

const features = [
  {
    icon: Wand2,
    title: 'Natural Language',
    description: 'Simply describe what you want. No complex settings or design skills needed.',
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Get photorealistic renders in 15-30 seconds. No waiting for hours.',
  },
  {
    icon: Sliders,
    title: 'Full Control',
    description: 'Adjust transformation strength to preserve your original or go bold.',
  },
  {
    icon: Download,
    title: 'High Quality',
    description: 'Download high-resolution images ready for presentations or sharing.',
  },
]

export function Features() {
  return (
    <section id="features" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight mb-4">
            Everything You Need
          </h2>
          <p className="text-muted-foreground">
            Professional interior visualization made simple and accessible.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-xl border bg-background p-6 transition-shadow hover:shadow-md"
            >
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 font-semibold">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
