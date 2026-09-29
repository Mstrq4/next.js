'use client'

import {
  CheckCircle2,
  CircleDashed,
  ExternalLink,
  LoaderCircle,
  RefreshCw,
  XCircle,
} from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { useI18n } from './i18n-provider'
import { GlassCard, Pill } from './ui'

type Run = {
  id: number
  name: string
  display_title?: string
  status: string
  conclusion?: string | null
  html_url: string
  head_sha?: string
  event?: string
}

function RunIcon({ run }: { run: Run }) {
  if (run.status !== 'completed') return <LoaderCircle className="size-4 animate-spin text-amber-500" />
  if (run.conclusion === 'success') return <CheckCircle2 className="size-4 text-emerald-500" />
  if (run.conclusion === 'failure' || run.conclusion === 'cancelled') return <XCircle className="size-4 text-destructive" />
  return <CircleDashed className="size-4 text-muted-foreground" />
}

export function LiveActionsStatus() {
  const { t } = useI18n()
  const [runs, setRuns] = useState<Run[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const refresh = useCallback(async () => {
    try {
      setLoading(true)
      setError('')
      const response = await fetch(
        'https://api.github.com/repos/vercel/next.js/actions/runs?branch=canary&per_page=8',
        { headers: { Accept: 'application/vnd.github+json' } }
      )
      if (!response.ok) throw new Error(`GitHub Actions API ${response.status}`)
      const data = (await response.json()) as { workflow_runs: Run[] }
      setRuns(data.workflow_runs ?? [])
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { void refresh() }, [refresh])

  return (
    <GlassCard className="mb-8 overflow-hidden">
      <div className="flex items-center justify-between gap-4 border-b border-border p-4 sm:p-5">
        <div>
          <p className="text-sm font-semibold">{t('Live canary activity', 'نشاط canary الحي')}</p>
          <p className="mt-1 text-xs text-muted-foreground">{t('Latest public GitHub Actions runs from vercel/next.js', 'أحدث تشغيلات GitHub Actions العامة من vercel/next.js')}</p>
        </div>
        <button
          type="button"
          onClick={() => void refresh()}
          disabled={loading}
          className="flex size-9 items-center justify-center rounded-full bg-muted text-muted-foreground disabled:opacity-60"
          aria-label={t('Refresh workflows', 'تحديث سير العمل')}
        >
          <RefreshCw className={`size-3.5 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {error ? <div className="m-4 rounded-[14px] border border-destructive/20 bg-destructive/5 p-3 text-xs text-destructive">{error}</div> : null}

      <div className="divide-y divide-border/70">
        {loading && !runs.length
          ? Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="flex items-center gap-3 px-4 py-3.5">
                <div className="nf-skeleton size-4 rounded-full" />
                <div className="min-w-0 flex-1">
                  <div className="nf-skeleton h-3 w-44 rounded-full" />
                  <div className="nf-skeleton mt-2 h-2.5 w-28 rounded-full" />
                </div>
              </div>
            ))
          : runs.map((run) => (
              <a key={run.id} href={run.html_url} target="_blank" rel="noreferrer" className="flex items-center gap-3 px-4 py-3.5 transition-colors hover:bg-primary/[0.04]">
                <RunIcon run={run} />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-xs font-medium">{run.name || run.display_title || 'Workflow'}</span>
                  <span dir="ltr" className="mt-1 block truncate text-left font-mono text-[10px] text-muted-foreground">
                    {run.event ?? 'event'} · {run.head_sha?.slice(0, 7) ?? '—'}
                  </span>
                </span>
                <Pill tone={run.conclusion === 'success' ? 'success' : run.status !== 'completed' ? 'violet' : 'default'}>
                  {run.status === 'completed' ? run.conclusion ?? 'completed' : run.status}
                </Pill>
                <ExternalLink className="size-3.5 shrink-0 text-muted-foreground" />
              </a>
            ))}
      </div>
    </GlassCard>
  )
}
