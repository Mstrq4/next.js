'use client'

import { Play, TerminalSquare } from 'lucide-react'
import { useMemo, useState } from 'react'
import { CommandBlock } from './copy-button'
import { useI18n } from './i18n-provider'

export function TestCommandBuilder() {
  const { t } = useI18n()
  const [mode, setMode] = useState<'dev' | 'start' | 'unit'>('dev')
  const [bundler, setBundler] = useState<'turbo' | 'webpack'>('turbo')
  const [testPath, setTestPath] = useState('test/e2e/app-dir/')
  const [headless, setHeadless] = useState(true)

  const command = useMemo(() => {
    const prefix = headless ? 'HEADLESS=true ' : ''
    if (mode === 'unit') {
      return prefix + 'pnpm test-unit' + (testPath.trim() ? ' ' + testPath.trim() : '')
    }
    return (
      prefix +
      'pnpm test-' +
      mode +
      '-' +
      bundler +
      (testPath.trim() ? ' ' + testPath.trim() : '')
    )
  }, [mode, bundler, testPath, headless])

  return (
    <section className="nf-glass mb-8 rounded-[26px] p-5 sm:p-6">
      <div className="grid gap-6 xl:grid-cols-[.9fr_1.1fr]">
        <div>
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-[15px] bg-primary/10 text-primary">
              <Play className="size-4" />
            </span>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.17em] text-primary/70">
                {t('Interactive test runner', 'مولد الاختبارات التفاعلي')}
              </p>
              <h2 className="mt-1 font-semibold">
                {t('Build the exact repository test command', 'كوّن أمر الاختبار المناسب للمستودع')}
              </h2>
            </div>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <label className="text-xs font-medium text-muted-foreground">
              {t('Mode', 'الوضع')}
              <select
                value={mode}
                onChange={(event) => setMode(event.target.value as 'dev' | 'start' | 'unit')}
                className="mt-2 h-11 w-full rounded-[14px] border border-border bg-background/65 px-3 text-sm text-foreground"
              >
                <option value="dev">{t('Development', 'التطوير')}</option>
                <option value="start">{t('Production start', 'تشغيل الإنتاج')}</option>
                <option value="unit">{t('Unit tests', 'اختبارات الوحدة')}</option>
              </select>
            </label>

            <label className="text-xs font-medium text-muted-foreground">
              {t('Bundler', 'الحازم')}
              <select
                value={bundler}
                disabled={mode === 'unit'}
                onChange={(event) => setBundler(event.target.value as 'turbo' | 'webpack')}
                className="mt-2 h-11 w-full rounded-[14px] border border-border bg-background/65 px-3 text-sm text-foreground disabled:opacity-45"
              >
                <option value="turbo">Turbopack</option>
                <option value="webpack">Webpack</option>
              </select>
            </label>
          </div>

          <label className="mt-3 block text-xs font-medium text-muted-foreground">
            {t('Test path or pattern', 'مسار الاختبار أو النمط')}
            <input
              value={testPath}
              onChange={(event) => setTestPath(event.target.value)}
              dir="ltr"
              className="mt-2 h-11 w-full rounded-[14px] border border-border bg-background/65 px-3 text-left font-mono text-xs text-foreground outline-none focus:ring-2 focus:ring-ring/40"
              placeholder="test/e2e/app-dir/my-test/"
            />
          </label>

          <label className="mt-4 inline-flex min-h-10 cursor-pointer items-center gap-3 rounded-full bg-muted/70 px-4 text-xs text-muted-foreground">
            <input
              type="checkbox"
              checked={headless}
              onChange={(event) => setHeadless(event.target.checked)}
              className="accent-primary"
            />
            {t('Run browser tests headlessly', 'تشغيل اختبارات المتصفح دون واجهة')}
          </label>
        </div>

        <div>
          <div className="mb-2 flex items-center gap-2 text-xs font-semibold">
            <TerminalSquare className="size-4 text-primary" />
            {t('Ready command', 'الأمر الجاهز')}
          </div>
          <CommandBlock command={command} />
          <CommandBlock
            title={t('Generate a new repository test', 'إنشاء اختبار جديد في المستودع')}
            command="pnpm new-test --args true my-feature e2e"
          />
        </div>
      </div>
    </section>
  )
}
