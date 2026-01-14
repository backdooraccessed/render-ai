'use client'

import { Star, Quote } from 'lucide-react'

const testimonials = [
  {
    quote: "Sold a vacant listing in just 3 days after adding AI-staged renders to the photos. The buyers said the staging helped them visualize the space perfectly.",
    author: "Sarah Mitchell",
    role: "Real Estate Agent",
    company: "Compass Realty",
    rating: 5,
  },
  {
    quote: "I used to spend $500+ per room on professional staging photos. Now I get better results in 30 seconds for a fraction of the cost. Game changer for my business.",
    author: "Michael Chen",
    role: "Property Investor",
    company: "Chen Properties",
    rating: 5,
  },
  {
    quote: "My clients love seeing design concepts before committing to furniture purchases. RenderAI has transformed how I present ideas and close deals faster.",
    author: "Emma Rodriguez",
    role: "Interior Designer",
    company: "Studio ER Design",
    rating: 5,
  },
]

export function Testimonials() {
  return (
    <section className="py-20 md:py-28 bg-background">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm mb-4">
            <span className="text-gradient-brand font-medium">Testimonials</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Loved by{' '}
            <span className="text-gradient-brand">Professionals</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            See what real estate agents and designers are saying about RenderAI.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3 max-w-6xl mx-auto">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.author}
              className="relative bg-card rounded-2xl border p-8 card-hover"
            >
              {/* Quote icon */}
              <div className="absolute -top-4 left-6">
                <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gradient-brand shadow-lg">
                  <Quote className="h-4 w-4 text-white" />
                </div>
              </div>

              {/* Rating */}
              <div className="flex gap-0.5 mb-4 mt-2">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-foreground mb-6 leading-relaxed">
                &ldquo;{testimonial.quote}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t">
                <div className="h-10 w-10 rounded-full bg-gradient-brand flex items-center justify-center text-white font-semibold">
                  {testimonial.author.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <div className="font-semibold text-sm">{testimonial.author}</div>
                  <div className="text-sm text-muted-foreground">
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
