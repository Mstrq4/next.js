import { Icon } from '@/components/icons'

export default function NotFound() {
  return (
    <div className="glass-strong mx-auto flex min-h-[58vh] max-w-2xl flex-col items-center justify-center p-8 text-center sm:p-12">
      <div className="metric-icon h-12 w-12 rounded-2xl"><Icon name="file" className="h-5 w-5" /></div>
      <div className="mt-6 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--accent-strong)]">404 · Not found</div>
      <h1 className="mt-3 text-2xl font-semibold tracking-[-0.04em]">That studio surface does not exist.</h1>
      <p className="mt-3 max-w-lg text-sm leading-6 text-[var(--text-secondary)]">Use the control center navigation to return to a known repository area.</p>
      <a href="/" className="mt-7 inline-flex h-10 items-center gap-2 rounded-xl bg-[var(--brand-900)] px-4 text-xs font-semibold text-white">Return to overview <Icon name="chevron" className="h-3.5 w-3.5" /></a>
    </div>
  )
}
