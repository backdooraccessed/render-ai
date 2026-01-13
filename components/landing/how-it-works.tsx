import { Upload, MessageSquare, Sparkles } from 'lucide-react'

const steps = [
  {
    icon: Upload,
    step: '1',
    title: 'Upload Your Photo',
    description: 'Drag and drop any room photo, sketch, or 3D screenshot.',
  },
  {
    icon: MessageSquare,
    step: '2',
    title: 'Describe Your Vision',
    description: 'Tell us what you want in plain English. "Add modern furniture" or "make it brighter".',
  },
  {
    icon: Sparkles,
    step: '3',
    title: 'Get Your Render',
    description: 'Our AI transforms your image in seconds. Download and share.',
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight mb-4">
            How It Works
          </h2>
          <p className="text-muted-foreground">
            Three simple steps to transform any space.
          </p>
        </div>

        <div className="mx-auto max-w-4xl">
          <div className="grid gap-8 md:grid-cols-3">
            {steps.map((step, index) => (
              <div key={step.title} className="relative text-center">
                {/* Connector line */}
                {index < steps.length - 1 && (
                  <div className="absolute top-8 left-[60%] hidden h-0.5 w-[80%] bg-border md:block" />
                )}

                <div className="relative mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border-2 border-primary bg-background">
                  <step.icon className="h-7 w-7 text-primary" />
                  <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                    {step.step}
                  </span>
                </div>

                <h3 className="mb-2 font-semibold">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
