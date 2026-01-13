import { nanoid } from 'nanoid'

/**
 * Generate a unique share token for a generation
 * Uses nanoid for URL-safe, short, unique IDs
 */
export function generateShareToken(): string {
  return nanoid(12) // 12 characters is short enough for URLs but unique enough
}

/**
 * Build the full share URL for a generation
 */
export function buildShareUrl(token: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  return `${baseUrl}/share/${token}`
}

/**
 * Validate a share token format
 */
export function isValidShareToken(token: string): boolean {
  // nanoid uses A-Za-z0-9_- characters
  return /^[A-Za-z0-9_-]{12}$/.test(token)
}
