import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { SingleAnalyzer } from '@/components/analyzer'

export default function AnalyzePage() {
  return (
    <div className="min-h-screen">
      <div className="pointer-events-none fixed left-4 top-4 z-50">
        <Link
          href="/"
          className="nf-glass pointer-events-auto inline-flex min-h-10 items-center gap-2 rounded-full px-4 text-xs font-medium text-foreground"
        >
          <ArrowLeft className="size-3.5" />
          Next Forge
        </Link>
      </div>
      <SingleAnalyzer />
    </div>
  )
}
