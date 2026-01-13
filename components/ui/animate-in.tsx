'use client'

import { cn } from '@/lib/utils'
import { useEffect, useState, useRef } from 'react'

interface AnimateInProps {
  children: React.ReactNode
  className?: string
  animation?: 'fade-up' | 'scale' | 'slide-up'
  delay?: number
  duration?: 'fast' | 'normal' | 'slow'
  once?: boolean
}

export function AnimateIn({
  children,
  className,
  animation = 'fade-up',
  delay = 0,
  duration = 'normal',
  once = true,
}: AnimateInProps) {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          if (once && ref.current) {
            observer.unobserve(ref.current)
          }
        } else if (!once) {
          setIsVisible(false)
        }
      },
      { threshold: 0.1 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [once])

  const animationClass = {
    'fade-up': 'animate-fade-in-up',
    'scale': 'animate-scale-pop',
    'slide-up': 'animate-slide-in-up',
  }[animation]

  const durationStyle = {
    fast: 'var(--duration-fast)',
    normal: 'var(--duration-normal)',
    slow: 'var(--duration-slow)',
  }[duration]

  return (
    <div
      ref={ref}
      className={cn(className)}
      style={{
        opacity: isVisible ? undefined : 0,
        animationDelay: `${delay}ms`,
        animationDuration: durationStyle,
      }}
    >
      <div className={isVisible ? animationClass : ''}>
        {children}
      </div>
    </div>
  )
}

interface StaggerContainerProps {
  children: React.ReactNode
  className?: string
  staggerDelay?: number
}

export function StaggerContainer({
  children,
  className,
  staggerDelay = 50,
}: StaggerContainerProps) {
  return (
    <div
      className={cn('stagger-children', className)}
      style={{ '--stagger-delay': `${staggerDelay}ms` } as React.CSSProperties}
    >
      {children}
    </div>
  )
}
