import type { ReactNode } from 'react'
import { ArrowUpRight, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { LocalizedText, type Copy } from './locale-provider'

export function GlassCard({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  return <section className={`nf-glass rounded-[24px] ${className}`}>{children}</section>
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: Copy
  title: Copy
  description?: Copy
  action?: { href: string; label: Copy }
}) {
  return (
    <div className="mb-5 flex items-end justify-between gap-4">
      <div className="min-w-0">
        {eyebrow ? (
          <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary/70">
            <LocalizedText value={eyebrow} />
          </p>
        ) : null}
        <h2 className="text-xl font-semibold tracking-[-0.025em] sm:text-2xl">
          <LocalizedText value={title} />
        </h2>
        {description ? (
          <p className="mt-1.5 max-w-2xl text-sm leading-6 text-muted-foreground">
            <LocalizedText value={description} />
          </p>
        ) : null}
      </div>
      {action ? (
        <Link
          href={action.href}
          className="hidden items-center gap-1 text-sm font-medium text-primary transition-opacity hover:opacity-70 sm:flex"
        >
          <LocalizedText value={action.label} />
          <ChevronRight className="size-4 rtl:rotate-180" />
        </Link>
      ) : null}
    </div>
  )
}

export function StatCard({
  label,
  value,
  detail,
  icon,
}: {
  label: Copy
  value: string | number
  detail: Copy
  icon: ReactNode
}) {
  return (
    <GlassCard className="group p-4 sm:p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex size-10 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-105">
          {icon}
        </div>
        <ArrowUpRight className="size-4 text-muted-foreground/50 rtl:-scale-x-100" />
      </div>
      <p className="mt-6 text-2xl font-semibold tracking-[-0.04em] sm:text-3xl">{value}</p>
      <p className="mt-1 text-sm font-medium"><LocalizedText value={label} /></p>
      <p className="mt-1 text-xs leading-5 text-muted-foreground"><LocalizedText value={detail} /></p>
    </GlassCard>
  )
}

export function Pill({
  children,
  tone = 'default',
}: {
  children: ReactNode
  tone?: 'default' | 'success' | 'violet'
}) {
  const tones = {
    default: 'bg-muted text-muted-foreground',
    success: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-300',
    violet: 'bg-primary/10 text-primary',
  }

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium ${tones[tone]}`}>
      {children}
    </span>
  )
}

export function MetricBar({
  label,
  value,
  percent,
}: {
  label: Copy
  value: string
  percent: number
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-4 text-sm">
        <span className="font-medium"><LocalizedText value={label} /></span>
        <span dir="ltr" className="font-mono text-xs text-muted-foreground">{value}</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-primary/10">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#4f1059] via-[#74317a] to-[#c99dce]"
          style={{ width: `${Math.max(5, Math.min(percent, 100))}%` }}
        />
      </div>
    </div>
  )
}

export function EmptyState({
  icon,
  title,
  description,
}: {
  icon: ReactNode
  title: Copy
  description: Copy
}) {
  return (
    <GlassCard className="flex min-h-72 flex-col items-center justify-center p-8 text-center">
      <div className="mb-4 flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        {icon}
      </div>
      <h3 className="font-semibold"><LocalizedText value={title} /></h3>
      <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
        <LocalizedText value={description} />
      </p>
    </GlassCard>
  )
}
