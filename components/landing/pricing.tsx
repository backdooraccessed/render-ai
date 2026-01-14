'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Check } from 'lucide-react'

const plans = [
  {
    name: 'Free',
    description: 'Perfect for trying out',
    price: '$0',
    period: 'forever',
    features: [
      '5 renders per day',
      'All style presets',
      'Standard resolution',
      'Community support',
    ],
    cta: 'Get Started',
    href: '/signup',
    featured: false,
  },
  {
    name: 'Pro',
    description: 'For active professionals',
    price: '$10',
    period: '/month',
    features: [
      '100 renders per month',
      'All style presets',
      'High resolution output',
      'Priority processing',
      'No watermarks',
      'Email support',
    ],
    cta: 'Start Pro Trial',
    href: '/signup?plan=pro',
    featured: true,
  },
  {
    name: 'Business',
    description: 'For teams and agencies',
    price: '$29',
    period: '/month',
    features: [
      '500 renders per month',
      'Everything in Pro',
      'Team accounts (5 users)',
      'API access',
      'Priority queue',
      'Dedicated support',
    ],
    cta: 'Contact Sales',
    href: '/contact',
    featured: false,
  },
]

export function Pricing() {
  return (
    <section id="pricing" className="py-24 md:py-32 bg-[var(--bg-secondary)]">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="max-w-2xl mx-auto text-center mb-20">
          <span className="badge-studio animate-fade-up">Pricing</span>
          <h2 className="mt-6 text-4xl md:text-5xl font-semibold tracking-tight text-[var(--surface-light)] animate-fade-up delay-1">
            Simple, transparent pricing.
          </h2>
          <p className="mt-4 text-[var(--text-secondary)] text-lg animate-fade-up delay-2">
            Start free, upgrade when you need more. No hidden fees.
          </p>
        </div>

        {/* Pricing cards */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl p-8 animate-fade-up ${
                plan.featured
                  ? 'bg-[var(--bg-elevated)] border-2 border-[var(--accent)]/30 shadow-[0_0_60px_var(--accent-glow)]'
                  : 'bg-[var(--bg-elevated)] border border-white/5'
              }`}
              style={{ animationDelay: `${(index + 3) * 100}ms` }}
            >
              {/* Featured badge */}
              {plan.featured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="px-4 py-1 text-xs font-medium tracking-wide uppercase bg-[var(--accent)] text-[var(--bg-primary)] rounded-full">
                    Most Popular
                  </span>
                </div>
              )}

              {/* Plan header */}
              <div className="mb-6">
                <h3 className="text-2xl font-semibold text-[var(--surface-light)]">
                  {plan.name}
                </h3>
                <p className="text-sm text-[var(--text-muted)] mt-1">
                  {plan.description}
                </p>
              </div>

              {/* Price */}
              <div className="mb-8">
                <span className="text-5xl font-semibold text-[var(--surface-light)]">
                  {plan.price}
                </span>
                <span className="text-[var(--text-muted)] ml-1">
                  {plan.period}
                </span>
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <div className={`mt-0.5 rounded-full p-0.5 ${plan.featured ? 'bg-[var(--accent)]' : 'bg-[var(--success)]'}`}>
                      <Check className="h-3 w-3 text-[var(--bg-primary)]" />
                    </div>
                    <span className="text-sm text-[var(--text-secondary)]">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Button
                asChild
                className={`w-full h-11 rounded-lg ${
                  plan.featured
                    ? 'btn-accent'
                    : 'bg-white/5 text-[var(--text-primary)] hover:bg-white/10 border border-white/10'
                }`}
              >
                <Link href={plan.href}>{plan.cta}</Link>
              </Button>
            </div>
          ))}
        </div>

        {/* Guarantee */}
        <p className="text-center text-sm text-[var(--text-muted)] mt-10 animate-fade-up delay-6">
          14-day money-back guarantee. Cancel anytime.
        </p>
      </div>
    </section>
  )
}
