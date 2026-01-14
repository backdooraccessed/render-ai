'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Check, Sparkles } from 'lucide-react'

const plans = [
  {
    name: 'Free',
    description: 'Perfect for trying out RenderAI',
    price: '$0',
    period: 'forever',
    features: [
      '5 renders per day',
      'All style presets',
      'Standard resolution',
      'Community support',
    ],
    cta: 'Get Started Free',
    href: '/signup',
    popular: false,
  },
  {
    name: 'Pro',
    description: 'For active real estate agents',
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
    popular: true,
  },
  {
    name: 'Business',
    description: 'For teams and brokerages',
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
    popular: false,
  },
]

export function Pricing() {
  return (
    <section id="pricing" className="py-20 md:py-28 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border bg-background px-3 py-1 text-sm mb-4">
            <span className="text-gradient-brand font-medium">Pricing</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Simple,{' '}
            <span className="text-gradient-brand">Transparent Pricing</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Start free, upgrade when you need more. No hidden fees.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative bg-card rounded-2xl border p-8 flex flex-col ${
                plan.popular
                  ? 'border-2 border-primary shadow-lg shadow-primary/10'
                  : ''
              }`}
            >
              {/* Popular badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-gradient-brand px-4 py-1.5 text-sm text-white font-medium shadow-lg">
                    <Sparkles className="h-4 w-4" />
                    Most Popular
                  </div>
                </div>
              )}

              {/* Plan header */}
              <div className="mb-6">
                <h3 className="text-xl font-bold mb-1">{plan.name}</h3>
                <p className="text-sm text-muted-foreground">{plan.description}</p>
              </div>

              {/* Price */}
              <div className="mb-6">
                <span className="text-4xl font-bold">{plan.price}</span>
                <span className="text-muted-foreground">{plan.period}</span>
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-8 flex-grow">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <div className={`mt-0.5 rounded-full p-0.5 ${plan.popular ? 'bg-gradient-brand' : 'bg-teal-500'}`}>
                      <Check className="h-3.5 w-3.5 text-white" />
                    </div>
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Button
                asChild
                size="lg"
                className={`w-full ${
                  plan.popular
                    ? 'btn-gradient'
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                }`}
              >
                <Link href={plan.href}>{plan.cta}</Link>
              </Button>
            </div>
          ))}
        </div>

        {/* Money back guarantee */}
        <p className="text-center text-sm text-muted-foreground mt-8">
          14-day money-back guarantee. Cancel anytime.
        </p>
      </div>
    </section>
  )
}
