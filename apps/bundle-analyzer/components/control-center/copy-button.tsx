'use client'

import { Check, Copy } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useI18n } from './i18n-provider'

export function CopyButton({
  value,
  compact = false,
  label,
}: {
  value: string
  compact?: boolean
  label?: string
}) {
  const [copied, setCopied] = useState(false)
  const { t } = useI18n()

  useEffect(() => {
    if (!copied) return
    const timer = window.setTimeout(() => setCopied(false), 1800)
    return () => window.clearTimeout(timer)
  }, [copied])

  const copy = async () => {
    await navigator.clipboard.writeText(value)
    setCopied(true)
  }

  return (
    <button
      type="button"
      onClick={copy}
      className={`inline-flex items-center justify-center gap-2 rounded-full border border-border bg-background/55 font-medium text-muted-foreground transition-all hover:bg-muted hover:text-foreground active:scale-95 ${
        compact ? 'size-8' : 'min-h-9 px-3 text-xs'
      }`}
      aria-label={t('Copy command', 'نسخ الأمر')}
      title={t('Copy command', 'نسخ الأمر')}
    >
      {copied ? <Check className="size-3.5 text-emerald-500" /> : <Copy className="size-3.5" />}
      {!compact ? <span>{label ?? (copied ? t('Copied', 'تم النسخ') : t('Copy', 'نسخ'))}</span> : null}
    </button>
  )
}

export function CommandBlock({
  command,
  title,
  titleAr,
  description,
  descriptionAr,
}: {
  command: string
  title?: string
  titleAr?: string
  description?: string
  descriptionAr?: string
}) {
  const { t } = useI18n()
  const resolvedTitle = title ? t(title, titleAr ?? title) : null
  const resolvedDescription = description
    ? t(description, descriptionAr ?? description)
    : null

  return (
    <div className="rounded-[18px] border border-border/70 bg-[#17051d] p-3 text-white dark:bg-black/25">
      {resolvedTitle ? <p className="mb-1 text-xs font-medium text-[#eaddeb]">{resolvedTitle}</p> : null}
      {resolvedDescription ? <p className="mb-3 text-[11px] leading-5 text-[#bfaec3]">{resolvedDescription}</p> : null}
      <div className="flex items-start gap-3">
        <code className="min-w-0 flex-1 overflow-x-auto whitespace-pre-wrap break-all font-mono text-[11px] leading-5 text-[#e6d5e9]">
          {command}
        </code>
        <CopyButton value={command} compact />
      </div>
    </div>
  )
}
