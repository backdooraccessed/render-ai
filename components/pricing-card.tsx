'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Check, Loader2, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

interface PricingCardProps {
  name: string
  price: string
  description: string
  features: string[]
  isCurrentPlan?: boolean
  isPro?: boolean
  isAuthenticated?: boolean
}

export function PricingCard({
  name,
  price,
  description,
  features,
  isCurrentPlan,
  isPro,
  isAuthenticated,
}: PricingCardProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleUpgrade = async () => {
    if (!isAuthenticated) {
      router.push('/signup')
      return
    }

    if (isPro && isCurrentPlan) {
      // Open billing portal
      setIsLoading(true)
      try {
        const response = await fetch('/api/stripe/portal', { method: 'POST' })
        const data = await response.json()

        if (data.success && data.url) {
          window.location.href = data.url
        } else {
          toast.error(data.error || 'Failed to open billing portal')
        }
      } catch (error) {
        toast.error('Failed to open billing portal')
      } finally {
        setIsLoading(false)
      }
      return
    }

    if (isPro && !isCurrentPlan) {
      // Create checkout session
      setIsLoading(true)
      try {
        const response = await fetch('/api/stripe/checkout', { method: 'POST' })
        const data = await response.json()

        if (data.success && data.url) {
          window.location.href = data.url
        } else {
          toast.error(data.error || 'Failed to start checkout')
        }
      } catch (error) {
        toast.error('Failed to start checkout')
      } finally {
        setIsLoading(false)
      }
    }
  }

  return (
    <Card className={cn(
      'relative',
      isPro && 'border-primary shadow-lg'
    )}>
      {isPro && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-medium">
            <Sparkles className="h-3 w-3" />
            Most Popular
          </span>
        </div>
      )}
      <CardHeader className="text-center pt-8">
        <CardTitle className="text-xl">{name}</CardTitle>
        <div className="mt-2">
          <span className="text-4xl font-bold">{price}</span>
          {isPro && <span className="text-muted-foreground">/month</span>}
        </div>
        <CardDescription className="mt-2">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-2">
              <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <span className="text-sm">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          variant={isPro ? 'default' : 'outline'}
          onClick={handleUpgrade}
          disabled={isLoading || (!isPro && isCurrentPlan)}
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isCurrentPlan
            ? isPro
              ? 'Manage Subscription'
              : 'Current Plan'
            : isPro
            ? 'Upgrade to Pro'
            : 'Get Started'}
        </Button>
      </CardFooter>
    </Card>
  )
}
