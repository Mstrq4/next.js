'use client'

import {
  CheckCircle2,
  CircleDashed,
  ExternalLink,
  LoaderCircle,
  RefreshCw,
  ShieldCheck,
  XCircle,
} from 'lucide-react'
import { useMemo, useState } from 'react'
import { useI18n } from './i18n-provider'
import { GlassCard, Pill } from './ui'

type CheckStatus = 'idle' | 'running' | 'pass' | 'fail'

type CheckResult = {
  id: string
  name: string
  nameAr: string
  target: string
  status: CheckStatus
  statusCode?: number
  latency?: number
  detail?: string
}

const checks: Array<Omit<CheckResult, 'status'>> = [
  {
    id: 'home',
    name: 'Next Forge home',
    nameAr: 'الصفحة الرئيسية',
    target: '/',
  },
  {
    id: 'skills',
    name: 'Skills catalog',
    nameAr: 'كتالوج المهارات',
    target: '/skills',
  },
  {
    id: 'agents',
    name: 'Agents catalog',
    nameAr: 'كتالوج الوكلاء',
    target: '/agents',
  },
  {
    id: 'docs',
    name: 'Documentation',
    nameAr: 'التوثيق',
    target: '/docs',
  },
  {
    id: 'repository',
    name: 'Repository explorer',
    nameAr: 'مستكشف المستودع',
    target: '/repository',
  },
  {
    id: 'github',
    name: 'Vercel Next.js GitHub API',
    nameAr: 'واجهة GitHub لمستودع Vercel',
    target: 'https://api.github.com/repos/vercel/next.js',
  },
]

function StatusIcon({ status }: { status: CheckStatus }) {
  if (status === 'running') {
    return <LoaderCircle className="size-4 animate-spin text-amber-500" />
  }
  if (status === 'pass') {
    return <CheckCircle2 className="size-4 text-emerald-500" />
  }
  if (status === 'fail') {
    return <XCircle className="size-4 text-destructive" />
  }
  return <CircleDashed className="size-4 text-muted-foreground" />
}

export function LiveSmokeChecks() {
  const { t } = useI18n()
  const [results, setResults] = useState<CheckResult[]>(
    checks.map((check) => ({ ...check, status: 'idle' }))
  )
  const [running, setRunning] = useState(false)

  const summary = useMemo(() => {
    const pass = results.filter((item) => item.status === 'pass').length
    const fail = results.filter((item) => item.status === 'fail').length
    return { pass, fail, total: results.length }
  }, [results])

  const runChecks = async () => {
    if (running) return
    setRunning(true)
    setResults((current) =>
      current.map((item) => ({ ...item, status: 'running', detail: undefined }))
    )

    const next: CheckResult[] = []
    for (const check of checks) {
      const start = performance.now()
      try {
        const response = await fetch(check.target, {
          cache: 'no-store',
          headers: check.target.startsWith('https://api.github.com')
            ? { Accept: 'application/vnd.github+json' }
            : undefined,
        })
        const latency = Math.max(0, performance.now() - start)
        next.push({
          ...check,
          status: response.ok ? 'pass' : 'fail',
          statusCode: response.status,
          latency,
          detail: response.ok
            ? t('Endpoint responded successfully.', 'استجاب المسار بنجاح.')
            : t(
                'Endpoint returned a non-success status.',
                'أعاد المسار حالة غير ناجحة.'
              ),
        })
      } catch (cause) {
        next.push({
          ...check,
          status: 'fail',
          latency: Math.max(0, performance.now() - start),
          detail:
            cause instanceof Error
              ? cause.message
              : t('Request failed.', 'فشل الطلب.'),
        })
      }
      setResults((current) =>
        current.map((item) =>
          item.id === next[next.length - 1].id
            ? next[next.length - 1]
            : item
        )
      )
    }

    setRunning(false)
  }

  return (
    <GlassCard className="overflow-hidden">
      <div className="flex flex-col gap-4 border-b border-border p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <ShieldCheck className="size-4 text-primary" />
            <h2 className="font-semibold">
              {t('Live browser smoke checks', 'فحوصات متصفح حية')}
            </h2>
            <Pill tone={summary.fail ? 'default' : summary.pass === summary.total ? 'success' : 'violet'}>
              {summary.pass}/{summary.total} PASS
            </Pill>
          </div>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            {t(
              'Run real network checks from this browser against the deployed Next Forge routes and the public Vercel Next.js GitHub API. This does not replace the repository test suite; it verifies that the launch surfaces are reachable now.',
              'شغّل فحوصات شبكة حقيقية من هذا المتصفح على صفحات Next Forge المنشورة وواجهة GitHub العامة لمستودع Vercel. هذا لا يستبدل اختبارات المستودع؛ بل يتحقق من أن أسطح الإطلاق متاحة الآن.'
            )}
          </p>
        </div>

        <button
          type="button"
          onClick={() => void runChecks()}
          disabled={running}
          className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary px-4 text-xs font-semibold text-primary-foreground disabled:opacity-60"
        >
          <RefreshCw className={`size-3.5 ${running ? 'animate-spin' : ''}`} />
          {running
            ? t('Running checks…', 'جارٍ تشغيل الفحوصات…')
            : t('Run live checks', 'تشغيل الفحوصات الحية')}
        </button>
      </div>

      <div className="divide-y divide-border/70">
        {results.map((result) => (
          <div
            key={result.id}
            className="grid gap-3 px-4 py-4 sm:grid-cols-[1fr_auto] sm:items-center sm:px-5"
          >
            <div className="flex min-w-0 items-start gap-3">
              <span className="mt-0.5">
                <StatusIcon status={result.status} />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-medium">
                  {t(result.name, result.nameAr)}
                </p>
                <p
                  dir="ltr"
                  className="mt-1 truncate text-left font-mono text-[10px] text-muted-foreground"
                >
                  {result.target}
                </p>
                {result.detail ? (
                  <p className="mt-1 text-xs text-muted-foreground">
                    {result.detail}
                  </p>
                ) : null}
              </div>
            </div>

            <div className="flex items-center gap-2 sm:justify-end">
              {typeof result.statusCode === 'number' ? (
                <span className="rounded-full bg-muted px-2.5 py-1 font-mono text-[10px] text-muted-foreground">
                  HTTP {result.statusCode}
                </span>
              ) : null}
              {typeof result.latency === 'number' ? (
                <span className="rounded-full bg-muted px-2.5 py-1 font-mono text-[10px] text-muted-foreground">
                  {result.latency.toFixed(0)} ms
                </span>
              ) : null}
              <a
                href={result.target}
                target={result.target.startsWith('http') ? '_blank' : undefined}
                rel={result.target.startsWith('http') ? 'noreferrer' : undefined}
                className="flex size-8 items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors hover:text-foreground"
                aria-label={t('Open target', 'فتح الهدف')}
              >
                <ExternalLink className="size-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </GlassCard>
  )
}
