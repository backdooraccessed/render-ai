'use client'

import { useState, useEffect } from 'react'

const STORAGE_KEY_PREFIX = 'renderai_'

interface UseFirstVisitOptions {
  key: string
  onFirstVisit?: () => void
}

export function useFirstVisit({ key, onFirstVisit }: UseFirstVisitOptions) {
  const [isFirstVisit, setIsFirstVisit] = useState(false)
  const storageKey = `${STORAGE_KEY_PREFIX}${key}`

  useEffect(() => {
    const hasVisited = localStorage.getItem(storageKey)
    if (!hasVisited) {
      setIsFirstVisit(true)
      onFirstVisit?.()
    }
  }, [storageKey, onFirstVisit])

  const markVisited = () => {
    localStorage.setItem(storageKey, 'true')
    setIsFirstVisit(false)
  }

  const resetFirstVisit = () => {
    localStorage.removeItem(storageKey)
    setIsFirstVisit(true)
  }

  return { isFirstVisit, markVisited, resetFirstVisit }
}

export function useFirstGeneration() {
  const [hasGenerated, setHasGenerated] = useState(false)
  const [showCelebration, setShowCelebration] = useState(false)
  const storageKey = `${STORAGE_KEY_PREFIX}first_generation_complete`

  useEffect(() => {
    const hasCompletedFirst = localStorage.getItem(storageKey)
    setHasGenerated(!!hasCompletedFirst)
  }, [])

  const markFirstGeneration = () => {
    const hasCompletedFirst = localStorage.getItem(storageKey)
    if (!hasCompletedFirst) {
      setShowCelebration(true)
      localStorage.setItem(storageKey, 'true')
      setHasGenerated(true)
    }
  }

  const closeCelebration = () => {
    setShowCelebration(false)
  }

  return {
    hasGenerated,
    showCelebration,
    markFirstGeneration,
    closeCelebration,
  }
}

export function useOnboardingComplete() {
  const storageKey = `${STORAGE_KEY_PREFIX}onboarding_complete`

  const isComplete = () => {
    if (typeof window === 'undefined') return false
    return !!localStorage.getItem(storageKey)
  }

  const markComplete = () => {
    localStorage.setItem(storageKey, 'true')
  }

  const reset = () => {
    localStorage.removeItem(storageKey)
  }

  return { isComplete, markComplete, reset }
}
