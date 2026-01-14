'use client'

import Link from 'next/link'
import { Twitter, Linkedin, Instagram, Mail } from 'lucide-react'

const footerLinks = {
  product: [
    { label: 'Features', href: '#features' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'FAQ', href: '#faq' },
  ],
  company: [
    { label: 'About', href: '/about' },
    { label: 'Blog', href: '/blog' },
    { label: 'Careers', href: '/careers' },
    { label: 'Contact', href: '/contact' },
  ],
  legal: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Cookie Policy', href: '/cookies' },
  ],
}

const socialLinks = [
  { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
  { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
  { icon: Instagram, href: 'https://instagram.com', label: 'Instagram' },
  { icon: Mail, href: 'mailto:hello@renderai.com', label: 'Email' },
]

export function Footer() {
  return (
    <footer className="bg-[var(--bg-primary)] border-t border-white/5">
      <div className="container mx-auto px-4 py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-3 mb-6">
              {/* Logo mark */}
              <div className="relative h-8 w-8">
                <div className="absolute inset-0 rounded-md border border-[var(--accent)]/30" />
                <div className="absolute inset-1 rounded-sm border border-[var(--accent)]/50" />
                <div className="absolute inset-2 rounded-[2px] bg-[var(--accent)]" />
              </div>
              <span className="text-lg font-semibold tracking-tight">
                RenderAI
              </span>
            </Link>
            <p className="text-[var(--text-secondary)] mb-6 max-w-xs leading-relaxed">
              Transform empty spaces into photorealistic renders with AI. Built for real estate professionals.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-10 w-10 rounded-lg border border-white/10 flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--accent)] hover:border-[var(--accent)]/30 transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Product links */}
          <div>
            <h3 className="text-xs font-medium uppercase tracking-wider text-[var(--text-muted)] mb-4">
              Product
            </h3>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-[var(--text-secondary)] hover:text-[var(--surface-light)] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company links */}
          <div>
            <h3 className="text-xs font-medium uppercase tracking-wider text-[var(--text-muted)] mb-4">
              Company
            </h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-[var(--text-secondary)] hover:text-[var(--surface-light)] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal links */}
          <div>
            <h3 className="text-xs font-medium uppercase tracking-wider text-[var(--text-muted)] mb-4">
              Legal
            </h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-[var(--text-secondary)] hover:text-[var(--surface-light)] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-[var(--text-muted)]">
            {new Date().getFullYear()} RenderAI. All rights reserved.
          </p>
          <p className="text-sm text-[var(--text-muted)]">
            Crafted for real estate professionals.
          </p>
        </div>
      </div>
    </footer>
  )
}
