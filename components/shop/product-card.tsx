'use client'

import { useState } from 'react'
import { ExternalLink, Star, Tag } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Product } from '@/types'

interface ProductCardProps {
  product: Product
  generationId?: string
  onProductClick?: (product: Product) => void
  className?: string
}

export function ProductCard({
  product,
  generationId,
  onProductClick,
  className,
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [imageError, setImageError] = useState(false)

  const handleClick = async () => {
    // Track the click
    try {
      const response = await fetch('/api/products/click', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_id: product.id,
          generation_id: generationId,
        }),
      })

      const data = await response.json()

      if (data.success && data.redirect_url) {
        window.open(data.redirect_url, '_blank', 'noopener,noreferrer')
      }
    } catch (error) {
      // Fallback to direct link if tracking fails
      window.open(
        product.affiliate_url || product.product_url,
        '_blank',
        'noopener,noreferrer'
      )
    }

    onProductClick?.(product)
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: product.currency || 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  const retailerDisplayName: Record<string, string> = {
    wayfair: 'Wayfair',
    amazon: 'Amazon',
    ikea: 'IKEA',
    cb2: 'CB2',
    west_elm: 'West Elm',
    target: 'Target',
    overstock: 'Overstock',
    article: 'Article',
    pottery_barn: 'Pottery Barn',
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        'group relative flex flex-col bg-[var(--bg-elevated)] rounded-xl overflow-hidden',
        'border border-[var(--border)] hover:border-[var(--accent-muted)]',
        'transition-all duration-300 ease-out text-left w-full',
        'hover:shadow-lg hover:shadow-black/20',
        isHovered && 'transform scale-[1.02]',
        className
      )}
    >
      {/* Product Image */}
      <div className="relative aspect-square bg-[var(--bg-tertiary)] overflow-hidden">
        {!imageError ? (
          <img
            src={product.image_url}
            alt={product.name}
            className={cn(
              'w-full h-full object-cover transition-transform duration-500',
              isHovered && 'scale-110'
            )}
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[var(--text-muted)]">
            <Tag className="w-8 h-8" />
          </div>
        )}

        {/* Hover overlay */}
        <div
          className={cn(
            'absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent',
            'opacity-0 group-hover:opacity-100 transition-opacity duration-300',
            'flex items-end justify-center pb-4'
          )}
        >
          <span className="text-white text-sm font-medium flex items-center gap-1.5 px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-full">
            Shop Now
            <ExternalLink className="w-3.5 h-3.5" />
          </span>
        </div>

        {/* Sale badge */}
        {product.sale_price && product.sale_price < product.price && (
          <div className="absolute top-2 left-2 px-2 py-1 bg-[var(--error)] text-white text-xs font-medium rounded">
            Sale
          </div>
        )}

        {/* Retailer badge */}
        <div className="absolute top-2 right-2 px-2 py-1 bg-black/50 backdrop-blur-sm text-white text-xs rounded">
          {retailerDisplayName[product.retailer] || product.retailer}
        </div>
      </div>

      {/* Product Info */}
      <div className="p-3 flex flex-col gap-1.5">
        {/* Brand */}
        {product.brand && (
          <span className="text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
            {product.brand}
          </span>
        )}

        {/* Name */}
        <h3 className="text-sm font-medium text-[var(--text-primary)] line-clamp-2 leading-tight">
          {product.name}
        </h3>

        {/* Rating */}
        {product.rating && (
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 fill-[var(--warning)] text-[var(--warning)]" />
            <span className="text-xs text-[var(--text-secondary)]">
              {product.rating.toFixed(1)}
            </span>
            {product.review_count && (
              <span className="text-xs text-[var(--text-muted)]">
                ({product.review_count.toLocaleString()})
              </span>
            )}
          </div>
        )}

        {/* Price */}
        <div className="flex items-baseline gap-2 mt-1">
          {product.sale_price && product.sale_price < product.price ? (
            <>
              <span className="text-base font-semibold text-[var(--text-primary)]">
                {formatPrice(product.sale_price)}
              </span>
              <span className="text-sm text-[var(--text-muted)] line-through">
                {formatPrice(product.price)}
              </span>
            </>
          ) : (
            <span className="text-base font-semibold text-[var(--text-primary)]">
              {formatPrice(product.price)}
            </span>
          )}
        </div>
      </div>
    </button>
  )
}
