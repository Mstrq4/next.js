'use client'

import { AlertTriangle, RotateCcw } from 'lucide-react'
import { useEffect } from 'react'
import { useLocale } from '@/components/control-center/locale-provider'

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const { text } = useLocale()

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
          {text({ en: 'Runtime interruption', ar: 'انقطاع في Runtime' })}
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-[-0.04em]">
          {text({
            en: 'Next Forge hit an unexpected state.',
            ar: 'واجه Next Forge حالة غير متوقعة.',
          })}
        </h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          {text({
            en: 'Retry this view. If the issue persists, inspect the development console for the underlying error.',
            ar: 'أعد المحاولة. إذا استمرت المشكلة فراجع Console التطوير لمعرفة الخطأ الأساسي.',
          })}
        </p>
        <button
          onClick={reset}
          className="mt-7 inline-flex min-h-10 items-center gap-2 rounded-full bg-primary px-4 text-sm font-medium text-primary-foreground"
        >
          <RotateCcw className="size-4" />
          {text({ en: 'Retry view', ar: 'إعادة المحاولة' })}
        </button>
      </div>
    </div>
  )
}
