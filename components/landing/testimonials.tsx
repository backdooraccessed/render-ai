'use client'

import { Quote } from 'lucide-react'

const testimonials = [
  {
    quote: "Sold a vacant listing in just 3 days after adding AI-staged renders. The buyers said the staging helped them visualize the space perfectly.",
    author: "Sarah Mitchell",
    role: "Real Estate Agent",
    company: "Compass Realty",
  },
  {
    quote: "I used to spend $500+ per room on professional staging photos. Now I get better results in 30 seconds for a fraction of the cost.",
    author: "Michael Chen",
    role: "Property Investor",
    company: "Chen Properties",
  },
  {
    quote: "My clients love seeing design concepts before committing to furniture purchases. RenderAI has transformed how I present ideas.",
    author: "Emma Rodriguez",
    role: "Interior Designer",
    company: "Studio ER Design",
  },
]

export function Testimonials() {
  return (
    <section className="py-24 md:py-32 bg-[var(--bg-primary)]">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="max-w-2xl mx-auto text-center mb-20">
          <span className="badge-studio animate-fade-up">Testimonials</span>
          <h2 className="mt-6 font-display text-4xl md:text-5xl tracking-tight animate-fade-up delay-1">
            <span className="text-[var(--surface-light)]">Loved by </span>
            <span className="italic text-[var(--accent)]">professionals.</span>
          </h2>
          <p className="mt-4 text-[var(--text-secondary)] text-lg animate-fade-up delay-2">
            See what real estate agents and designers are saying.
          </p>
        </div>

        {/* Testimonials grid */}
        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.author}
              className="card-studio p-8 animate-fade-up"
              style={{ animationDelay: `${(index + 3) * 100}ms` }}
            >
              {/* Quote icon */}
              <Quote className="h-8 w-8 text-[var(--accent)]/30 mb-6" />

              {/* Quote text */}
              <blockquote className="font-display text-lg text-[var(--surface-light)] leading-relaxed mb-8">
                &ldquo;{testimonial.quote}&rdquo;
              </blockquote>

              {/* Author */}
              <div className="flex items-center gap-4 pt-6 border-t border-white/5">
                <div className="h-10 w-10 rounded-full bg-[var(--accent)]/10 flex items-center justify-center">
                  <span className="text-sm font-medium text-[var(--accent)]">
                    {testimonial.author.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <div className="text-sm font-medium text-[var(--surface-light)]">
                    {testimonial.author}
                  </div>
                  <div className="text-xs text-[var(--text-muted)]">
                    {testimonial.role}, {testimonial.company}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
