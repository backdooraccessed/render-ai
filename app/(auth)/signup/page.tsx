import Link from 'next/link'
import { SignupForm } from '@/components/auth/signup-form'
import { Sparkles, CheckCircle2 } from 'lucide-react'

export default function SignupPage() {
  return (
    <div className="min-h-screen flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-brand relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-1/4 -left-20 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-white/10 rounded-full blur-3xl" />

        <div className="relative z-10 flex flex-col justify-center px-12 text-white">
          <Link href="/" className="flex items-center gap-3 mb-12">
            <div className="h-12 w-12 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
              <Sparkles className="h-7 w-7 text-white" />
            </div>
            <span className="text-2xl font-bold">RenderAI</span>
          </Link>

          <h1 className="text-4xl font-bold mb-4">
            Start Creating<br />Beautiful Renders
          </h1>
          <p className="text-lg text-white/80 max-w-md">
            Get started free with 5 renders per day. No credit card required.
          </p>

          <div className="mt-12 space-y-4">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-6 w-6 text-white/90" />
              <span className="text-white/90">5 free renders every day</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-6 w-6 text-white/90" />
              <span className="text-white/90">All style presets included</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-6 w-6 text-white/90" />
              <span className="text-white/90">No watermarks on outputs</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-6 w-6 text-white/90" />
              <span className="text-white/90">Commercial use allowed</span>
            </div>
          </div>

          <div className="mt-12 p-4 rounded-xl bg-white/10 backdrop-blur">
            <p className="text-sm text-white/90 italic">
              &ldquo;RenderAI helped me sell a vacant listing in just 3 days. The AI staging made all the difference.&rdquo;
            </p>
            <p className="text-sm text-white/70 mt-2">— Sarah M., Real Estate Agent</p>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-background px-4 py-12">
        <SignupForm />
      </div>
    </div>
  )
}
