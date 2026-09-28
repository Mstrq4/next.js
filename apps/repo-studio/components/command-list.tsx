'use client'

import { useState } from 'react'
import { Icon } from '@/components/icons'

export function CommandList({
  commands,
}: {
  commands: Array<{ label: string; command: string }>
}) {
  const [copied, setCopied] = useState<string | null>(null)

  const copy = async (command: string) => {
    await navigator.clipboard.writeText(command)
    setCopied(command)
    window.setTimeout(() => setCopied((value) => (value === command ? null : value)), 1400)
  }

  return (
    <div className="grid gap-2">
      {commands.map((item) => (
        <div key={item.command} className="flex min-w-0 items-center gap-3 rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-soft)] p-3">
          <span className="section-icon shrink-0"><Icon name="terminal" className="h-4 w-4" /></span>
          <div className="min-w-0 flex-1">
            <div className="text-[11px] font-medium text-[var(--text-tertiary)]">{item.label}</div>
            <code className="mt-0.5 block truncate text-xs text-[var(--text-primary)]">{item.command}</code>
          </div>
          <button className="icon-button h-8 w-8 shrink-0" onClick={() => copy(item.command)} aria-label={'Copy ' + item.command}>
            <Icon name={copied === item.command ? 'check' : 'copy'} className="h-3.5 w-3.5" />
          </button>
        </div>
      ))}
    </div>
  )
}
