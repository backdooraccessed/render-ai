'use client'

import { Users, Globe, Star, Zap } from 'lucide-react'

const stats = [
  {
    icon: Zap,
    value: '50,000+',
    label: 'Renders Generated',
  },
  {
    icon: Users,
    value: '5,000+',
    label: 'Happy Users',
  },
  {
    icon: Globe,
    value: '30+',
    label: 'Countries',
  },
  {
    icon: Star,
    value: '4.9/5',
    label: 'User Rating',
  },
]

export function SocialProof() {
  return (
    <section className="py-12 border-y bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center">
          {/* Trust statement */}
          <p className="text-sm text-muted-foreground mb-8 text-center">
            Trusted by real estate agents and interior designers worldwide
          </p>

          {/* Stats grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 w-full max-w-3xl">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gradient-brand mb-3">
                  <stat.icon className="h-5 w-5 text-white" />
                </div>
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
