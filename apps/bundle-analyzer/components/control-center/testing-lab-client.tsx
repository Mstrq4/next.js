'use client'

import { Braces, Play, Settings2, TestTube2 } from 'lucide-react'
import { useMemo, useState } from 'react'
import { CommandBox } from './copy-button'
import { useLocale } from './locale-provider'
import { GlassCard, Pill } from './ui'

export function TestingLabClient({
  availableTests,
}: {
  availableTests: string[]
}) {
  const { text } = useLocale()
  const [mode, setMode] = useState<'dev' | 'start'>('dev')
  const [bundler, setBundler] = useState<'turbo' | 'webpack'>('turbo')
  const [testPath, setTestPath] = useState('test/e2e/app-dir/example/example.test.ts')

  const command = useMemo(
    () => `pnpm test-${mode}-${bundler} ${testPath.trim() || '<test-path>'}`,
    [bundler, mode, testPath]
  )

  const quick = availableTests
    .filter((test) => /dev|start|turbo|webpack|rspack|unit/.test(test))
    .slice(0, 12)

  return (
    <div className="space-y-4">
      <GlassCard className="p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-[16px] bg-primary/10 text-primary">
            <Settings2 className="size-5" />
          </span>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="font-semibold">
                {text({ en: 'Focused test command builder', ar: 'منشئ أوامر الاختبارات المركزة' })}
              </h2>
              <Pill tone="violet">
                {text({ en: 'Interactive', ar: 'تفاعلي' })}
              </Pill>
            </div>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              {text({
                en: 'Pick runtime mode and bundler, enter a test path, then copy the exact repository command.',
                ar: 'اختر وضع التشغيل وأداة الحزم وأدخل مسار الاختبار ثم انسخ أمر المستودع المطابق.',
              })}
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <div>
            <label className="mb-2 block text-xs font-medium text-muted-foreground">
              {text({ en: 'Runtime mode', ar: 'وضع التشغيل' })}
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(['dev', 'start'] as const).map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setMode(value)}
                  className={`rounded-[14px] border px-4 py-3 text-sm font-medium transition-colors ${
                    mode === value
                      ? 'border-primary/20 bg-primary/10 text-primary'
                      : 'border-border bg-background/40 text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {value === 'dev'
                    ? text({ en: 'Development', ar: 'التطوير' })
                    : text({ en: 'Production start', ar: 'تشغيل الإنتاج' })}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-2 block text-xs font-medium text-muted-foreground">
              {text({ en: 'Bundler', ar: 'أداة الحزم' })}
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(['turbo', 'webpack'] as const).map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setBundler(value)}
                  className={`rounded-[14px] border px-4 py-3 text-sm font-medium transition-colors ${
                    bundler === value
                      ? 'border-primary/20 bg-primary/10 text-primary'
                      : 'border-border bg-background/40 text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {value === 'turbo' ? 'Turbopack' : 'Webpack'}
                </button>
              ))}
            </div>
          </div>
        </div>

        <label className="mb-2 mt-5 block text-xs font-medium text-muted-foreground">
          {text({ en: 'Test file or directory', ar: 'ملف أو مجلد الاختبار' })}
        </label>
        <div className="flex min-h-11 items-center gap-2 rounded-[15px] border border-border bg-background/55 px-3">
          <TestTube2 className="size-4 text-muted-foreground" />
          <input
            dir="ltr"
            value={testPath}
            onChange={(event) => setTestPath(event.target.value)}
            className="min-w-0 flex-1 bg-transparent text-left font-mono text-xs outline-none"
          />
        </div>

        <div className="mt-5">
          <CommandBox
            label={{ en: 'Generated command', ar: 'الأمر الناتج' }}
            command={command}
          />
        </div>
      </GlassCard>

      <GlassCard className="p-5 sm:p-6">
        <div className="flex items-center gap-3">
          <Play className="size-4 text-primary" />
          <h3 className="font-semibold">
            {text({ en: 'Repository test entry points', ar: 'نقاط دخول الاختبارات في المستودع' })}
          </h3>
        </div>
        <div className="mt-5 grid gap-2 md:grid-cols-2">
          {quick.map((test) => (
            <div
              key={test}
              className="rounded-[15px] border border-border/70 bg-background/35 p-3"
            >
              <CommandBox command={`pnpm ${test}`} />
            </div>
          ))}
        </div>
      </GlassCard>

      <GlassCard className="p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <Braces className="mt-0.5 size-4 text-primary" />
          <div>
            <h3 className="font-semibold">
              {text({ en: 'Create a new test', ar: 'إنشاء اختبار جديد' })}
            </h3>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              {text({
                en: 'The repository requires pnpm new-test for new suites. Use the non-interactive form when an agent is creating the test.',
                ar: 'يشترط المستودع استخدام pnpm new-test لإنشاء مجموعات الاختبار. استخدم الصيغة غير التفاعلية عندما ينشئ الوكيل الاختبار.',
              })}
            </p>
          </div>
        </div>
        <div className="mt-4">
          <CommandBox command="pnpm new-test --args true my-feature e2e" />
        </div>
      </GlassCard>
    </div>
  )
}
