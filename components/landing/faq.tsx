'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

const faqs = [
  {
    question: 'What image formats are supported?',
    answer: 'RenderAI supports JPG, PNG, and WebP formats. For best results, use images with a minimum resolution of 512x512 pixels. Maximum file size is 10MB.',
  },
  {
    question: 'How long does it take to generate a render?',
    answer: 'Most renders are completed in 15-30 seconds. Processing time may vary slightly based on image complexity and current server load. Pro and Business users get priority processing.',
  },
  {
    question: 'Can I use the renders commercially?',
    answer: 'Yes! All renders you create with RenderAI are yours to use commercially. You can use them in real estate listings, marketing materials, social media, and presentations.',
  },
  {
    question: 'What happens to my uploaded images?',
    answer: 'Your privacy is important to us. Uploaded images are processed securely and only stored temporarily for generation. We do not use your images for AI training or share them with third parties.',
  },
  {
    question: 'Can I try before I buy?',
    answer: 'Absolutely! Our free tier gives you 5 renders per day with no credit card required. This lets you experience the full power of RenderAI before deciding to upgrade.',
  },
  {
    question: "What's the difference between Pro and Business?",
    answer: 'Pro is designed for individual agents and designers who need more renders (100/month) and high-resolution output. Business adds team accounts (5 users), API access, and priority support—perfect for brokerages and agencies.',
  },
]

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section id="faq" className="py-24 md:py-32 bg-[var(--bg-primary)]">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="max-w-2xl mx-auto text-center mb-20">
          <span className="badge-studio animate-fade-up">FAQ</span>
          <h2 className="mt-6 font-display text-4xl md:text-5xl tracking-tight animate-fade-up delay-1">
            <span className="text-[var(--surface-light)]">Common </span>
            <span className="italic text-[var(--accent)]">questions.</span>
          </h2>
          <p className="mt-4 text-[var(--text-secondary)] text-lg animate-fade-up delay-2">
            Everything you need to know about RenderAI.
          </p>
        </div>

        {/* FAQ items */}
        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="card-studio overflow-hidden animate-fade-up"
              style={{ animationDelay: `${(index + 3) * 50}ms` }}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 hover:bg-white/[0.02] transition-colors"
              >
                <span className="font-medium text-[var(--surface-light)]">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`h-5 w-5 text-[var(--text-muted)] shrink-0 transition-transform duration-300 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? 'max-h-48' : 'max-h-0'
                }`}
              >
                <p className="px-6 pb-5 text-[var(--text-secondary)] leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
