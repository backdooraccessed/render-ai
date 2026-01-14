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
    answer: 'Yes! All renders you create with RenderAI are yours to use commercially. You can use them in real estate listings, marketing materials, social media, and presentations without any additional licensing.',
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
    question: 'What\'s the difference between Pro and Business?',
    answer: 'Pro is designed for individual agents and designers who need more renders (100/month) and high-resolution output. Business adds team accounts (5 users), API access, and priority support—perfect for brokerages and agencies.',
  },
]

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section id="faq" className="py-20 md:py-28 bg-background">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm mb-4">
            <span className="text-gradient-brand font-medium">FAQ</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Frequently Asked{' '}
            <span className="text-gradient-brand">Questions</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Everything you need to know about RenderAI.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="border rounded-xl bg-card overflow-hidden"
              >
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between gap-4 hover:bg-muted/50 transition-colors"
                >
                  <span className="font-medium">{faq.question}</span>
                  <ChevronDown
                    className={`h-5 w-5 text-muted-foreground shrink-0 transition-transform duration-200 ${
                      openIndex === index ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                <div
                  className={`px-6 overflow-hidden transition-all duration-200 ${
                    openIndex === index ? 'pb-4' : 'max-h-0'
                  }`}
                >
                  <p className="text-muted-foreground">{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
