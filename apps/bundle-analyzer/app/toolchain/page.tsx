import {
  Box,
  Boxes,
  Braces,
  CircuitBoard,
  Cpu,
  Layers3,
  PackageCheck,
  Zap,
} from 'lucide-react'
import { AppShell } from '@/components/control-center/app-shell'
import { LocalizedText } from '@/components/control-center/locale-provider'
import { GlassCard, MetricBar, Pill, SectionHeading } from '@/components/control-center/ui'
import { getRepoSnapshot } from '@/lib/control-center-data'

export default async function ToolchainPage() {
  const data = await getRepoSnapshot()

  const layers = [
    {
      name: 'Next.js',
      value: 'workspace',
      detail: { en: 'Framework core, router, server rendering and build pipeline.', ar: 'نواة الإطار والـRouter والتصيير على الخادم ومسار البناء.' },
      icon: Layers3,
      status: { en: 'Core', ar: 'النواة' },
    },
    {
      name: 'React',
      value: data.versions.react,
      detail: { en: 'Canary React runtime synchronized into the framework workspace.', ar: 'React Runtime من canary متزامن داخل مساحة عمل الإطار.' },
      icon: Braces,
      status: { en: 'Runtime', ar: 'Runtime' },
    },
    {
      name: 'Turbopack',
      value: `${data.turbopackCrates.length} crates`,
      detail: { en: 'Rust compiler and bundler surface used for fast development and builds.', ar: 'سطح مترجم وحزم Rust للتطوير والبناء السريع.' },
      icon: Zap,
      status: { en: 'Native', ar: 'أصلي' },
    },
    {
      name: 'SWC',
      value: `${data.rustCrates.length} root crates`,
      detail: { en: 'Native transforms, minification and framework-specific compiler work.', ar: 'تحويلات أصلية وتصغير وكود مترجم خاص بالإطار.' },
      icon: Cpu,
      status: { en: 'Compiler', ar: 'المترجم' },
    },
    {
      name: 'Rspack',
      value: data.versions.rspack,
      detail: { en: 'Alternative bundler integration with dedicated test and release paths.', ar: 'تكامل Bundler بديل مع مسارات اختبار وإصدار مستقلة.' },
      icon: Boxes,
      status: { en: 'Integration', ar: 'تكامل' },
    },
    {
      name: 'TypeScript',
      value: data.versions.typescript,
      detail: { en: 'Repository type system for packages, tests and development tooling.', ar: 'نظام الأنواع للحزم والاختبارات وأدوات التطوير.' },
      icon: CircuitBoard,
      status: { en: 'Language', ar: 'اللغة' },
    },
  ]

  return (
    <AppShell
      title={{ en: 'Compiler & runtime toolchain', ar: 'سلسلة المترجم وRuntime' }}
      subtitle={{
        en: 'A layered view of the technologies that build, execute and validate Next.js—from React and TypeScript to native Rust crates, Turbopack, SWC and Rspack.',
        ar: 'عرض طبقي للتقنيات التي تبني وتشغل وتتحقق من Next.js من React وTypeScript إلى Rust وTurbopack وSWC وRspack.',
      }}
      eyebrow={{ en: 'Engineering toolchain', ar: 'سلسلة الأدوات الهندسية' }}
    >
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {layers.map((layer) => {
          const Icon = layer.icon
          return (
            <GlassCard key={layer.name} className="p-5 sm:p-6">
              <div className="flex items-start justify-between gap-3">
                <span className="flex size-11 items-center justify-center rounded-[17px] bg-primary/10 text-primary">
                  <Icon className="size-5" strokeWidth={1.7} />
                </span>
                <Pill tone="violet"><LocalizedText value={layer.status} /></Pill>
              </div>
              <h3 dir="ltr" className="mt-6 text-left text-lg font-semibold tracking-[-0.025em]">{layer.name}</h3>
              <p dir="ltr" className="mt-1 text-left font-mono text-xs text-primary/75">{layer.value}</p>
              <p className="mt-3 text-sm leading-6 text-muted-foreground"><LocalizedText value={layer.detail} /></p>
            </GlassCard>
          )
        })}
      </div>

      <div className="mt-8 grid gap-4 xl:grid-cols-[1.1fr_.9fr]">
        <GlassCard className="p-5 sm:p-6">
          <SectionHeading
            eyebrow={{ en: 'Native surface', ar: 'السطح الأصلي' }}
            title={{ en: 'Rust workspace concentration', ar: 'تركيز مساحة عمل Rust' }}
            description={{ en: 'Next.js combines TypeScript orchestration with substantial native compiler infrastructure.', ar: 'يجمع Next.js تنسيق TypeScript مع بنية مترجم أصلية كبيرة.' }}
          />
          <div className="space-y-5">
            <MetricBar label={{ en: 'Turbopack crates', ar: 'حزم Turbopack' }} value={String(data.turbopackCrates.length)} percent={100} />
            <MetricBar label={{ en: 'Root native crates', ar: 'حزم Rust الجذرية' }} value={String(data.rustCrates.length)} percent={42} />
            <MetricBar label={{ en: 'JavaScript packages', ar: 'حزم JavaScript' }} value={String(data.packages.length)} percent={64} />
          </div>
        </GlassCard>

        <GlassCard className="p-5 sm:p-6">
          <SectionHeading
            eyebrow={{ en: 'Workspace foundation', ar: 'أساس مساحة العمل' }}
            title={{ en: 'Package manager & orchestration', ar: 'مدير الحزم والتنسيق' }}
            description={{ en: 'The repository is orchestrated as a pnpm + Turbo monorepo.', ar: 'المستودع منظم كـpnpm + Turbo monorepo.' }}
          />
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-[18px] border border-border/70 bg-background/35 p-4">
              <PackageCheck className="size-4 text-primary" />
              <p className="mt-4 text-xs text-muted-foreground"><LocalizedText value={{ en: 'Package manager', ar: 'مدير الحزم' }} /></p>
              <p dir="ltr" className="mt-1 text-left font-mono text-sm font-medium">{data.packageManager}</p>
            </div>
            <div className="rounded-[18px] border border-border/70 bg-background/35 p-4">
              <Box className="size-4 text-primary" />
              <p className="mt-4 text-xs text-muted-foreground">Turbo</p>
              <p dir="ltr" className="mt-1 text-left font-mono text-sm font-medium">{data.versions.turbo}</p>
            </div>
          </div>
        </GlassCard>
      </div>
    </AppShell>
  )
}
