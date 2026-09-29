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
import { Localized } from '@/components/control-center/i18n-provider'
import { GlassCard, MetricBar, Pill, SectionHeading } from '@/components/control-center/ui'
import { getRepoSnapshot } from '@/lib/control-center-data'

export default async function ToolchainPage() {
  const data = await getRepoSnapshot()

  const layers = [
    {
      name: 'Next.js',
      value: 'workspace',
      detail: 'Framework core, router, server rendering and build pipeline.',
      detailAr: 'نواة الإطار والموجّه والتصيير على الخادم وخط البناء.',
      icon: Layers3,
      status: 'Core',
      statusAr: 'النواة',
    },
    {
      name: 'React',
      value: data.versions.react,
      detail: 'Canary React runtime synchronized into the framework workspace.',
      detailAr: 'بيئة React canary متزامنة داخل مساحة عمل الإطار.',
      icon: Braces,
      status: 'Runtime',
      statusAr: 'تشغيل',
    },
    {
      name: 'Turbopack',
      value: `${data.turbopackCrates.length} crates`,
      detail: 'Rust compiler and bundler surface used for fast development and builds.',
      detailAr: 'سطح مترجم وتجميع مبني بـRust للتطوير والبناء السريع.',
      icon: Zap,
      status: 'Native',
      statusAr: 'أصلي',
    },
    {
      name: 'SWC',
      value: `${data.rustCrates.length} root crates`,
      detail: 'Native transforms, minification and framework-specific compiler work.',
      detailAr: 'تحويلات أصلية وتصغير وكود مترجم مخصص للإطار.',
      icon: Cpu,
      status: 'Compiler',
      statusAr: 'مترجم',
    },
    {
      name: 'Rspack',
      value: data.versions.rspack,
      detail: 'Alternative bundler integration with dedicated test and release paths.',
      detailAr: 'تكامل أداة تجميع بديلة مع مسارات اختبار وإصدار مخصصة.',
      icon: Boxes,
      status: 'Integration',
      statusAr: 'تكامل',
    },
    {
      name: 'TypeScript',
      value: data.versions.typescript,
      detail: 'Repository type system for packages, tests and development tooling.',
      detailAr: 'نظام الأنواع للحزم والاختبارات وأدوات التطوير في المستودع.',
      icon: CircuitBoard,
      status: 'Language',
      statusAr: 'لغة',
    },
  ]

  return (
    <AppShell
      title="Compiler & runtime toolchain"
      titleAr="سلسلة المترجم وبيئة التشغيل"
      subtitle="A layered view of the technologies that build, execute and validate Next.js—from React and TypeScript to native Rust crates, Turbopack, SWC and Rspack."
      subtitleAr="عرض طبقي للتقنيات التي تبني Next.js وتشغله وتتحقق منه، من React وTypeScript إلى حزم Rust الأصلية وTurbopack وSWC وRspack."
      eyebrow="Engineering toolchain"
      eyebrowAr="سلسلة الأدوات الهندسية"
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
                <Pill tone="violet"><Localized en={layer.status} ar={layer.statusAr} /></Pill>
              </div>
              <h3 className="mt-6 text-lg font-semibold tracking-[-0.025em]">{layer.name}</h3>
              <p className="mt-1 font-mono text-xs text-primary/75">{layer.value}</p>
              <Localized as="p" en={layer.detail} ar={layer.detailAr} className="mt-3 text-sm leading-6 text-muted-foreground" />
            </GlassCard>
          )
        })}
      </div>

      <div className="mt-8 grid gap-4 xl:grid-cols-[1.1fr_.9fr]">
        <GlassCard className="p-5 sm:p-6">
          <SectionHeading
            eyebrow={<Localized en="Native surface" ar="السطح الأصلي" />}
            title={<Localized en="Rust workspace concentration" ar="تركيز مساحة عمل Rust" />}
            description={<Localized en="The framework combines TypeScript orchestration with substantial native compiler infrastructure." ar="يجمع الإطار بين تنسيق TypeScript وبنية مترجم أصلية واسعة." />}
          />
          <div className="space-y-5">
            <MetricBar label={<Localized en="Turbopack crates" ar="حزم Turbopack" />} value={String(data.turbopackCrates.length)} percent={100} />
            <MetricBar label={<Localized en="Root native crates" ar="الحزم الأصلية الجذرية" />} value={String(data.rustCrates.length)} percent={42} />
            <MetricBar label={<Localized en="JavaScript packages" ar="حزم JavaScript" />} value={String(data.packages.length)} percent={64} />
          </div>
        </GlassCard>

        <GlassCard className="p-5 sm:p-6">
          <SectionHeading
            eyebrow={<Localized en="Package manager" ar="مدير الحزم" />}
            title={<Localized en="Workspace foundation" ar="أساس مساحة العمل" />}
            description={<Localized en="The repository is orchestrated as a pnpm + Turbo monorepo." ar="يُدار المستودع كمستودع أحادي باستخدام pnpm وTurbo." />}
          />
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-[18px] border border-border/70 bg-background/35 p-4">
              <PackageCheck className="size-4 text-primary" />
              <Localized as="p" en="Package manager" ar="مدير الحزم" className="mt-4 text-xs text-muted-foreground" />
              <p className="mt-1 font-mono text-sm font-medium">{data.packageManager}</p>
            </div>
            <div className="rounded-[18px] border border-border/70 bg-background/35 p-4">
              <Box className="size-4 text-primary" />
              <p className="mt-4 text-xs text-muted-foreground">Turbo</p>
              <p className="mt-1 font-mono text-sm font-medium">{data.versions.turbo}</p>
            </div>
          </div>
        </GlassCard>
      </div>
    </AppShell>
  )
}
