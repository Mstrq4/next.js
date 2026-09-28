'use client'

import { Check, Copy as CopyIcon } from 'lucide-react'
import { useState } from 'react'
import { type Copy, useLocale } from './locale-provider'

export function CopyButton({
  value,
  label = { en: 'Copy', ar: 'نسخ' },
  copiedLabel = { en: 'Copied', ar: 'تم النسخ' },
  className = '',
}: {
  value: string
  label?: Copy
  copiedLabel?: Copy
  className?: string
}) {
  const { text } = useLocale()
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    await navigator.clipboard.writeText(value)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1600)
  }

  return (
    <button
      type="button"
      onClick={copy}
      className={`inline-flex min-h-9 items-center gap-2 rounded-full border border-border bg-background/60 px-3 text-xs font-medium text-muted-foreground transition-all hover:bg-muted hover:text-foreground active:scale-95 ${className}`}
    >
      {copied ? <Check className="size-3.5 text-emerald-500" /> : <CopyIcon className="size-3.5" />}
      {copied ? text(copiedLabel) : text(label)}
    </button>
  )
}

export function CommandBox({
  command,
  label,
}: {
  command: string
  label?: Copy
}) {
  const { text } = useLocale()

  return (
    <div className="rounded-[18px] border border-border/70 bg-[#120017]/[0.96] p-3 text-[#f5eaf7] shadow-inner dark:bg-black/25">
      {label ? (
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#d6badb]/65">
          {text(label)}
        </p>
      ) : null}
      <div className="flex items-start gap-3">
        <code
          dir="ltr"
          className="min-w-0 flex-1 overflow-x-auto whitespace-pre-wrap break-all font-mono text-[11px] leading-5 text-[#eadcef]"
        >
          {command}
        </code>
        <CopyButton
          value={command}
          className="shrink-0 border-white/10 bg-white/5 text-[#d9c6dc] hover:bg-white/10 hover:text-white"
        />
      </div>
    </div>
  )
}
