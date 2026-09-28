'use client'

import { AlertTriangle, RotateCcw } from 'lucide-react'
import { useEffect } from 'react'

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="nf-glass-strong w-full max-w-lg rounded-[30px] p-7 text-center sm:p-9">
        <span className="mx-auto flex size-14 items-center justify-center rounded-[20px] bg-destructive/10 text-destructive">
          <AlertTriangle className="size-6" />
        </span>
        <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.18em] text-destructive/80">
          Runtime interruption
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-[-0.04em]">
          Next Forge hit an unexpected state.
        </h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          The repository is safe. Retry this view; if the issue persists, inspect the development console for the underlying error.
        </p>
        <button
          onClick={reset}
          className="mt-7 inline-flex min-h-10 items-center gap-2 rounded-full bg-primary px-4 text-sm font-medium text-primary-foreground"
        >
          <RotateCcw className="size-4" />
          Retry view
        </button>
      </div>
    </div>
  )
}
