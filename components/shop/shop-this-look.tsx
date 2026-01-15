'use client'

import { useEffect, useState, useCallback } from 'react'
import { ShoppingBag, ChevronRight, Sparkles, RefreshCw, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ProductCard } from './product-card'
import { cn } from '@/lib/utils'
import type { Product } from '@/types'

interface ShopThisLookProps {
  style: string
  roomType: string
  generationId?: string
  className?: string
  defaultExpanded?: boolean
}

interface MatchResponse {
  success: boolean
  products: Product[]
  total_price: number
  product_count: number
  match: {
    style: string
    room_type: string
    matched_styles: string[]
  }
  error?: string
}

export function ShopThisLook({
  style,
  roomType,
  generationId,
  className,
  defaultExpanded = false,
}: ShopThisLookProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [totalPrice, setTotalPrice] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)
  const [hasLoaded, setHasLoaded] = useState(false)

  const fetchMatchingProducts = useCallback(async () => {
    if (!style) return

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/products/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          style,
          room_type: roomType,
          limit: 6,
        }),
      })

      const data: MatchResponse = await response.json()

      if (!data.success) {
        setError(data.error || 'Failed to load products')
        return
      }

      setProducts(data.products)
      setTotalPrice(data.total_price)
      setHasLoaded(true)
    } catch (err) {
      console.error('Failed to fetch matching products:', err)
      setError('Failed to connect to server')
    } finally {
      setIsLoading(false)
    }
  }, [style, roomType])

  // Load products when expanded for the first time
  useEffect(() => {
    if (isExpanded && !hasLoaded && !isLoading) {
      fetchMatchingProducts()
    }
  }, [isExpanded, hasLoaded, isLoading, fetchMatchingProducts])

  // Auto-expand and load if defaultExpanded is true
  useEffect(() => {
    if (defaultExpanded && !hasLoaded) {
      fetchMatchingProducts()
    }
  }, [defaultExpanded, hasLoaded, fetchMatchingProducts])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  return (
    <div
      className={cn(
        'bg-[var(--bg-secondary)] rounded-xl border border-[var(--border)] overflow-hidden',
        className
      )}
    >
      {/* Header - Always visible */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className={cn(
          'w-full flex items-center justify-between p-4',
          'hover:bg-[var(--bg-tertiary)] transition-colors duration-200'
        )}
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[var(--accent)]/10 rounded-lg">
            <ShoppingBag className="w-5 h-5 text-[var(--accent)]" />
          </div>
          <div className="text-left">
            <h3 className="text-sm font-semibold text-[var(--text-primary)] flex items-center gap-2">
              Shop This Look
              <Sparkles className="w-3.5 h-3.5 text-[var(--warning)]" />
            </h3>
            <p className="text-xs text-[var(--text-muted)]">
              {hasLoaded
                ? `${products.length} curated items matching your style`
                : 'AI-matched furniture and decor'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {hasLoaded && products.length > 0 && (
            <span className="text-sm font-medium text-[var(--text-secondary)]">
              {formatPrice(totalPrice)} total
            </span>
          )}
          <ChevronRight
            className={cn(
              'w-5 h-5 text-[var(--text-muted)] transition-transform duration-300',
              isExpanded && 'rotate-90'
            )}
          />
        </div>
      </button>

      {/* Expandable Content */}
      <div
        className={cn(
          'grid transition-all duration-300 ease-out',
          isExpanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        )}
      >
        <div className="overflow-hidden">
          <div className="p-4 pt-0 border-t border-[var(--border)]">
            {/* Loading State */}
            {isLoading && (
              <div className="py-12 flex flex-col items-center justify-center gap-3">
                <RefreshCw className="w-6 h-6 text-[var(--accent)] animate-spin" />
                <p className="text-sm text-[var(--text-muted)]">
                  Finding furniture that matches your style...
                </p>
              </div>
            )}

            {/* Error State */}
            {error && !isLoading && (
              <div className="py-8 flex flex-col items-center justify-center gap-3">
                <div className="p-3 bg-[var(--error)]/10 rounded-full">
                  <AlertCircle className="w-6 h-6 text-[var(--error)]" />
                </div>
                <p className="text-sm text-[var(--text-muted)]">{error}</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={fetchMatchingProducts}
                  className="mt-2"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Try Again
                </Button>
              </div>
            )}

            {/* Empty State */}
            {!isLoading && !error && hasLoaded && products.length === 0 && (
              <div className="py-8 flex flex-col items-center justify-center gap-3">
                <div className="p-3 bg-[var(--bg-tertiary)] rounded-full">
                  <ShoppingBag className="w-6 h-6 text-[var(--text-muted)]" />
                </div>
                <p className="text-sm text-[var(--text-muted)]">
                  No matching products found for this style
                </p>
              </div>
            )}

            {/* Products Grid */}
            {!isLoading && !error && products.length > 0 && (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-4">
                  {products.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      generationId={generationId}
                    />
                  ))}
                </div>

                {/* Total and CTA */}
                <div className="mt-4 pt-4 border-t border-[var(--border)] flex items-center justify-between">
                  <div>
                    <p className="text-xs text-[var(--text-muted)]">
                      Complete the look for
                    </p>
                    <p className="text-lg font-semibold text-[var(--text-primary)]">
                      {formatPrice(totalPrice)}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={fetchMatchingProducts}
                    className="gap-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Refresh Suggestions
                  </Button>
                </div>

                {/* Disclaimer */}
                <p className="mt-3 text-[10px] text-[var(--text-muted)] text-center">
                  Prices and availability may vary. We may earn a commission from purchases.
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
