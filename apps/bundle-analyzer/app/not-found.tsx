import { ArrowLeft, SearchX } from 'lucide-react'
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="nf-glass-strong w-full max-w-lg rounded-[30px] p-8 text-center">
        <span className="mx-auto flex size-14 items-center justify-center rounded-[20px] bg-primary/10 text-primary">
          <SearchX className="size-6" />
        </span>
        <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary/70">
          404 · Missing surface
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-[-0.04em]">
          This engineering view does not exist.
        </h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          Return to the control center and choose a repository surface from the navigation.
        </p>
        <Link
          href="/"
          className="mt-7 inline-flex min-h-10 items-center gap-2 rounded-full bg-primary px-4 text-sm font-medium text-primary-foreground"
        >
          <ArrowLeft className="size-4" />
          Back to overview
        </Link>
      </div>
    </div>
  )
}
