import {
  Activity,
  Bug,
  CheckCircle2,
  FlaskConical,
  Gauge,
  PlayCircle,
  TestTube2,
} from 'lucide-react'
import { AppShell } from '@/components/control-center/app-shell'
import { TestCommandBuilder } from '@/components/control-center/test-command-builder'
import { CopyButton, CommandBlock } from '@/components/control-center/copy-button'
import { Localized } from '@/components/control-center/i18n-provider'
import { GlassCard, Pill, SectionHeading } from '@/components/control-center/ui'
import { getRepoSnapshot } from '@/lib/control-center-data'

function groupTests(keys: string[]) {
  return [
    {
      name: 'Development',
      nameAr: 'التطوير',
      description: 'Interactive dev-mode framework tests across bundlers.',
      descriptionAr: 'اختبارات تفاعلية لوضع التطوير عبر الحوازم المختلفة.',
      keys: keys.filter((key) => key.includes('dev')),
      icon: PlayCircle,
    },
    {
      name: 'Production / start',
      nameAr: 'الإنتاج / start',
      description: 'Production server and start-mode behavior.',
      descriptionAr: 'سلوك خادم الإنتاج ووضع start.',
      keys: keys.filter((key) => key.includes('start')),
      icon: CheckCircle2,
    },
    {
      name: 'Turbopack',
      nameAr: 'Turbopack',
      description: 'Tests explicitly exercising the Turbopack path.',
      descriptionAr: 'اختبارات تستهدف مسار Turbopack مباشرة.',
      keys: keys.filter((key) => key.includes('turbo')),
      icon: Gauge,
    },
    {
      name: 'Rspack',
      nameAr: 'Rspack',
      description: 'Alternative bundler integration and regression coverage.',
      descriptionAr: 'تكامل الحازم البديل وتغطية الانحدارات.',
      keys: keys.filter((key) => key.includes('rspack')),
      icon: Activity,
    },
  ]
}

export default async function TestingPage() {
  const data = await getRepoSnapshot()
  const groups = groupTests(data.tests)

  return (
    <AppShell
      title="Quality & testing laboratory"
      titleAr="مختبر الجودة والاختبارات"
      subtitle="Next.js validates behavior across multiple runtimes and bundlers. Copy the exact repository commands for focused testing, browser verification and production-mode checks."
      subtitleAr="يتحقق Next.js من السلوك عبر بيئات تشغيل وحزم متعددة. انسخ أوامر المستودع الدقيقة للاختبارات المركزة والتحقق عبر المتصفح واختبارات وضع الإنتاج."
      eyebrow="Quality engineering"
      eyebrowAr="هندسة الجودة"
    >
      <TestCommandBuilder />
      <div className="mb-6 grid gap-3 lg:grid-cols-2">
        <CommandBlock title="Generate a new test" command="pnpm new-test --args true my-feature e2e" />
        <CommandBlock title="Fast unit verification" command="pnpm test-unit" />
      </div>
      <div className="mb-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <GlassCard className="p-5">
          <TestTube2 className="size-5 text-primary" />
          <p className="mt-5 text-3xl font-semibold tracking-[-0.04em]">{data.tests.length}</p>
          <Localized as="p" en="root test commands" ar="أوامر الاختبار الجذرية" className="mt-1 text-sm text-muted-foreground" />
        </GlassCard>
        <GlassCard className="p-5">
          <FlaskConical className="size-5 text-primary" />
          <p className="mt-5 text-3xl font-semibold tracking-[-0.04em]">Jest</p>
          <Localized as="p" en="primary test runner" ar="مشغل الاختبارات الأساسي" className="mt-1 text-sm text-muted-foreground" />
        </GlassCard>
        <GlassCard className="p-5">
          <Bug className="size-5 text-primary" />
          <p className="mt-5 text-3xl font-semibold tracking-[-0.04em]">Playwright</p>
          <Localized as="p" en="browser verification" ar="التحقق عبر المتصفح" className="mt-1 text-sm text-muted-foreground" />
        </GlassCard>
        <GlassCard className="p-5">
          <Activity className="size-5 text-primary" />
          <p className="mt-5 text-3xl font-semibold tracking-[-0.04em]">3</p>
          <Localized as="p" en="bundler paths" ar="مسارات الحزم" className="mt-1 text-sm text-muted-foreground" />
        </GlassCard>
      </div>

      <SectionHeading
        eyebrow={<Localized en="Test matrix" ar="مصفوفة الاختبار" />}
        title={<Localized en="Verification surfaces" ar="أسطح التحقق" />}
        description={<Localized en="The same framework behavior is exercised through distinct development and bundler modes." ar="يُختبر السلوك نفسه عبر أوضاع تطوير وحزم مختلفة." />}
      />
      <div className="grid gap-3 md:grid-cols-2">
        {groups.map((group) => {
          const Icon = group.icon
          return (
            <GlassCard key={group.name} className="p-5 sm:p-6">
              <div className="flex items-start gap-4">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-[17px] bg-primary/10 text-primary">
                  <Icon className="size-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <Localized as="h3" en={group.name} ar={group.nameAr} className="font-semibold" />
                    <Pill>{group.keys.length} commands</Pill>
                  </div>
                  <Localized as="p" en={group.description} ar={group.descriptionAr} className="mt-1 text-sm leading-6 text-muted-foreground" />
                </div>
              </div>
              <div className="mt-5 space-y-2">
                {group.keys.slice(0, 6).map((key) => (
                  <div
                    key={key}
                    className="flex items-center gap-2 rounded-[14px] border border-border/70 bg-background/35 px-3 py-2.5"
                  >
                    <span className="size-1.5 rounded-full bg-emerald-500" />
                    <code className="min-w-0 flex-1 truncate text-[11px] text-muted-foreground">pnpm {key}</code>
                    <CopyButton value={'pnpm ' + key} compact />
                  </div>
                ))}
              </div>
            </GlassCard>
          )
        })}
      </div>
    </AppShell>
  )
}
