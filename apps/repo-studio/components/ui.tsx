import type { ReactNode } from 'react'
import { Icon } from '@/components/icons'
import type { IconName } from '@/lib/site'

export function PageHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string
  title: string
  description: string
  action?: ReactNode
}) {
  return (
    <header className="mb-8 flex flex-col gap-5 xl:mb-10 xl:flex-row xl:items-end xl:justify-between">
      <div className="max-w-3xl">
        <div className="mb-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--accent-strong)]">
          {eyebrow}
        </div>
        <h1 className="text-balance text-3xl font-semibold tracking-[-0.045em] text-[var(--text-primary)] sm:text-4xl xl:text-[44px]">
          {title}
        </h1>
        <p className="mt-3 max-w-2xl text-pretty text-[15px] leading-7 text-[var(--text-secondary)] sm:text-base">
          {description}
        </p>
      </div>
      {action}
    </header>
  )
}

export function GlassPanel({
  children,
  className = '',
  strong = false,
}: {
  children: ReactNode
  className?: string
  strong?: boolean
}) {
  return (
    <section className={(strong ? 'glass-strong ' : 'glass ') + className}>
      {children}
    </section>
  )
}

export function MetricCard({
  label,
  value,
  detail,
  icon,
}: {
  label: string
  value: string | number
  detail: string
  icon: IconName
}) {
  return (
    <GlassPanel className="group min-h-[152px] p-5 sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="metric-icon">
          <Icon name={icon} className="h-[18px] w-[18px]" />
        </div>
        <span className="status-dot" />
      </div>
      <div className="mt-6 text-3xl font-semibold tracking-[-0.05em] text-[var(--text-primary)]">{value}</div>
      <div className="mt-1 text-sm font-medium text-[var(--text-primary)]">{label}</div>
      <div className="mt-1 text-xs leading-5 text-[var(--text-tertiary)]">{detail}</div>
    </GlassPanel>
  )
}

export function SectionTitle({
  title,
  description,
  icon,
}: {
  title: string
  description?: string
  icon?: IconName
}) {
  return (
    <div className="mb-4 flex items-center gap-3">
      {icon ? (
        <div className="section-icon">
          <Icon name={icon} className="h-4 w-4" />
        </div>
      ) : null}
      <div>
        <h2 className="text-[15px] font-semibold tracking-[-0.02em] text-[var(--text-primary)]">{title}</h2>
        {description ? <p className="mt-0.5 text-xs text-[var(--text-tertiary)]">{description}</p> : null}
      </div>
    </div>
  )
}

export function Chip({
  children,
  tone = 'default',
}: {
  children: ReactNode
  tone?: 'default' | 'accent' | 'success' | 'warning'
}) {
  return <span className={'chip chip-' + tone}>{children}</span>
}

export function ExternalLink({ href, label = 'Open' }: { href: string; label?: string }) {
  return (
    <a className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--accent-strong)] hover:text-[var(--text-primary)]" href={href} target="_blank" rel="noreferrer">
      {label}
      <Icon name="external" className="h-3.5 w-3.5" />
    </a>
  )
}
