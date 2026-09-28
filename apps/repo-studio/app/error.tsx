'use client'

import { Icon } from '@/components/icons'

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="glass-strong mx-auto flex min-h-[58vh] max-w-2xl flex-col items-center justify-center p-8 text-center sm:p-12">
      <div className="metric-icon h-12 w-12 rounded-2xl"><Icon name="activity" className="h-5 w-5" /></div>
      <div className="mt-6 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--accent-strong)]">Recoverable error</div>
      <h1 className="mt-3 text-2xl font-semibold tracking-[-0.04em]">This repository view could not be rendered.</h1>
      <p className="mt-3 max-w-lg text-sm leading-6 text-[var(--text-secondary)]">The surrounding studio is still available. Retry the view or return to the overview.</p>
      <div className="mt-7 flex flex-wrap justify-center gap-2">
        <button onClick={reset} className="inline-flex h-10 items-center rounded-xl bg-[var(--brand-900)] px-4 text-xs font-semibold text-white">Retry</button>
        <a href="/" className="inline-flex h-10 items-center rounded-xl border border-[var(--border-default)] bg-[var(--surface)] px-4 text-xs font-semibold">Overview</a>
      </div>
    </div>
  )
}
