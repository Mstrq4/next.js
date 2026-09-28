import {
  Braces,
  CircuitBoard,
  GitBranch,
  Layers3,
  PackageOpen,
  Sparkles,
  TestTube2,
  Workflow,
  Zap,
} from 'lucide-react'
import Link from 'next/link'
import { AppShell } from '@/components/control-center/app-shell'
import { CommandBox } from '@/components/control-center/copy-button'
import { LocalizedText } from '@/components/control-center/locale-provider'
import {
  GlassCard,
  MetricBar,
  Pill,
  SectionHeading,
  StatCard,
} from '@/components/control-center/ui'
import { getRepoSnapshot } from '@/lib/control-center-data'

const architecture = [
  {
    title: { en: 'Framework Core', ar: 'نواة الإطار' },
    detail: {
      en: 'App Router, Pages Router, rendering, caching and runtime boundaries.',
      ar: 'App Router وPages Router والتصيير والتخزين المؤقت وحدود Runtime.',
    },
    icon: Layers3,
    href: '/packages',
    tone: 'from-[#dcbce8]/70 to-[#b77fc0]/20',
  },
  {
    title: { en: 'Turbopack', ar: 'Turbopack' },
    detail: {
      en: 'Rust-powered compiler, bundler crates and development pipeline.',
      ar: 'مترجم وحزم Rust ومسار تطوير Turbopack.',
    },
    icon: Zap,
    href: '/toolchain',
    tone: 'from-[#c690cc]/55 to-[#74317a]/15',
  },
  {
    title: { en: 'Agent System', ar: 'نظام الوكلاء' },
    detail: {
      en: 'Repository-aware skills, agent integrations and portable workflows.',
      ar: 'مهارات واعية بالمستودع وتكاملات للوكلاء وWorkflows قابلة للنقل.',
    },
    icon: Braces,
    href: '/agents',
    tone: 'from-[#d7afd7]/60 to-[#4f1059]/10',
  },
  {
    title: { en: 'Quality Lab', ar: 'مختبر الجودة' },
    detail: {
      en: 'Jest, Playwright, integration suites and live CI activity.',
      ar: 'Jest وPlaywright واختبارات التكامل وحالة CI الحية.',
    },
    icon: TestTube2,
    href: '/testing',
    tone: 'from-[#e2c7ef]/75 to-[#ad78b0]/15',
  },
]

export default async function HomePage() {
  const data = await getRepoSnapshot()
  const totalSkills = data.agentSkills.length + data.frameworkSkills.length

  return (
    <AppShell
      title={{
        en: 'Repository intelligence, in one place.',
        ar: 'كل معرفة المستودع في مكان واحد.',
      }}
      subtitle={{
        en: 'A bilingual engineering console for the Next.js monorepo—packages, Agent Skills, coding agents, compilers, tests, workflows, documentation and live repository tools.',
        ar: 'منصة هندسية ثنائية اللغة لمستودع Next.js تجمع الحزم وAgent Skills والوكلاء والمترجمات والاختبارات وWorkflows والتوثيق وأدوات المستودع الحية.',
      }}
      eyebrow={{ en: 'Next Forge · Control Center', ar: 'Next Forge · مركز التحكم' }}
    >
      <div className="relative mb-8 overflow-hidden rounded-[30px] border border-border bg-[#25002f] p-6 text-white shadow-[0_28px_90px_rgba(55,7,65,.22)] sm:p-8 lg:p-10">
        <div className="nf-grid pointer-events-none absolute inset-0 opacity-35" />
        <div className="absolute -right-16 -top-20 size-72 rounded-full bg-[#c996ce]/25 blur-3xl" />
        <div className="absolute bottom-[-7rem] left-[22%] size-64 rounded-full bg-[#74317a]/35 blur-3xl" />

        <div className="relative grid gap-8 xl:grid-cols-[1.45fr_.8fr] xl:items-end">
          <div>
            <Pill tone="violet">Next.js · canary</Pill>
            <h2 className="mt-5 max-w-3xl text-3xl font-semibold tracking-[-0.05em] text-white sm:text-4xl lg:text-5xl">
              <LocalizedText
                value={{
                  en: 'The framework workshop, made visible.',
                  ar: 'ورشة عمل Next.js أصبحت مرئية.',
                }}
              />
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-[#ddcfe1]/80 sm:text-[15px]">
              <LocalizedText
                value={{
                  en: 'Navigate the real repository, inspect skills, install agent workflows, build test commands and analyze source surfaces without digging through thousands of files.',
                  ar: 'تنقل داخل المستودع الحقيقي واستعرض المهارات وثبّت Workflows للوكلاء وأنشئ أوامر الاختبار وحلّل أسطح المصدر دون البحث يدويًا داخل آلاف الملفات.',
                }}
              />
            </p>
            <div className="mt-7 flex flex-wrap gap-2.5">
              <Link
                href="/docs"
                className="inline-flex min-h-10 items-center gap-2 rounded-full bg-white px-4 text-sm font-semibold text-[#32103b]"
              >
                <Sparkles className="size-4" />
                <LocalizedText value={{ en: 'Open documentation', ar: 'فتح التوثيق' }} />
              </Link>
              <Link
                href="/repository"
                className="inline-flex min-h-10 items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 text-sm font-medium text-white backdrop-blur-xl hover:bg-white/15"
              >
                <CircuitBoard className="size-4" />
                <LocalizedText value={{ en: 'Browse repository', ar: 'تصفح المستودع' }} />
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-[22px] border border-white/10 bg-white/[0.07] p-4 backdrop-blur-xl">
              <p className="text-[10px] uppercase tracking-[0.16em] text-[#dcbfe1]/65">
                <LocalizedText value={{ en: 'Runtime', ar: 'Runtime' }} />
              </p>
              <p dir="ltr" className="mt-2 text-left font-mono text-sm text-white">
                React {data.versions.react}
              </p>
            </div>
            <div className="rounded-[22px] border border-white/10 bg-white/[0.07] p-4 backdrop-blur-xl">
              <p className="text-[10px] uppercase tracking-[0.16em] text-[#dcbfe1]/65">
                <LocalizedText value={{ en: 'Tooling', ar: 'الأدوات' }} />
              </p>
              <p dir="ltr" className="mt-2 text-left font-mono text-sm text-white">
                {data.packageManager}
              </p>
            </div>
            <div className="col-span-2 rounded-[22px] border border-white/10 bg-white/[0.07] p-4 backdrop-blur-xl">
              <div className="flex items-center gap-2 text-xs text-[#e9d8ed]/75">
                <GitBranch className="size-3.5" />
                canary
              </div>
              <p className="mt-2 text-sm font-medium">
                <LocalizedText value={{ en: 'Active development branch', ar: 'فرع التطوير النشط' }} />
              </p>
              <p className="mt-1 text-xs text-[#dcbfe1]/60">
                <LocalizedText
                  value={{
                    en: 'Framework, compiler, skills and agent workflows share one monorepo.',
                    ar: 'الإطار والمترجم والمهارات وWorkflows الوكلاء داخل Monorepo واحد.',
                  }}
                />
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-9 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        <StatCard
          label={{ en: 'Workspace packages', ar: 'حزم مساحة العمل' }}
          value={data.packages.length}
          detail={{ en: 'Core packages under packages/', ar: 'الحزم الأساسية داخل packages/' }}
          icon={<PackageOpen className="size-5" />}
        />
        <StatCard
          label={{ en: 'Agent skills', ar: 'مهارات الوكلاء' }}
          value={totalSkills}
          detail={{ en: 'Repository + framework skills', ar: 'مهارات المستودع + الإطار' }}
          icon={<Sparkles className="size-5" />}
        />
        <StatCard
          label={{ en: 'Workflows', ar: 'Workflows' }}
          value={data.workflows.length}
          detail={{ en: 'GitHub automation pipelines', ar: 'مسارات أتمتة GitHub' }}
          icon={<Workflow className="size-5" />}
        />
        <StatCard
          label={{ en: 'Test commands', ar: 'أوامر الاختبار' }}
          value={data.tests.length}
          detail={{ en: 'Root test entry points', ar: 'نقاط دخول الاختبارات' }}
          icon={<TestTube2 className="size-5" />}
        />
        <StatCard
          label={{ en: 'Rust crates', ar: 'حزم Rust' }}
          value={data.rustCrates.length}
          detail={{ en: 'Framework native crates', ar: 'حزم الإطار الأصلية' }}
          icon={<CircuitBoard className="size-5" />}
        />
        <StatCard
          label={{ en: 'Turbopack crates', ar: 'حزم Turbopack' }}
          value={data.turbopackCrates.length}
          detail={{ en: 'Bundler/compiler workspace', ar: 'مساحة المترجم والحزم' }}
          icon={<Zap className="size-5" />}
        />
      </div>

      <div className="mb-10">
        <SectionHeading
          eyebrow={{ en: 'System map', ar: 'خريطة النظام' }}
          title={{ en: 'Major engineering surfaces', ar: 'الأسطح الهندسية الرئيسية' }}
          description={{
            en: 'Move from a high-level map to the exact package, skill, agent or testing surface you need.',
            ar: 'انتقل من الخريطة العامة إلى الحزمة أو المهارة أو الوكيل أو سطح الاختبار الذي تحتاجه.',
          }}
        />
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {architecture.map((item) => {
            const Icon = item.icon
            return (
              <Link key={item.title.en} href={item.href} className="group block">
                <GlassCard className="h-full overflow-hidden p-5 transition-transform duration-300 group-hover:-translate-y-0.5">
                  <div className={`mb-6 flex size-12 items-center justify-center rounded-[18px] bg-gradient-to-br ${item.tone} text-primary`}>
                    <Icon className="size-5" strokeWidth={1.7} />
                  </div>
                  <h3 className="font-semibold tracking-[-0.02em]">
                    <LocalizedText value={item.title} />
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    <LocalizedText value={item.detail} />
                  </p>
                </GlassCard>
              </Link>
            )
          })}
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.1fr_.9fr]">
        <GlassCard className="p-5 sm:p-6">
          <SectionHeading
            eyebrow={{ en: 'Workspace profile', ar: 'ملف مساحة العمل' }}
            title={{ en: 'Repository concentration', ar: 'تركيز مكونات المستودع' }}
            description={{ en: 'A quick structural profile from the current checkout.', ar: 'ملف بنيوي سريع من النسخة الحالية للمستودع.' }}
          />
          <div className="space-y-5">
            <MetricBar label={{ en: 'Turbopack native surface', ar: 'سطح Turbopack الأصلي' }} value={`${data.turbopackCrates.length} crates`} percent={92} />
            <MetricBar label={{ en: 'Core workspace packages', ar: 'حزم مساحة العمل الأساسية' }} value={`${data.packages.length} packages`} percent={68} />
            <MetricBar label={{ en: 'Automation coverage', ar: 'تغطية الأتمتة' }} value={`${data.workflows.length} workflows`} percent={78} />
            <MetricBar label={{ en: 'Agent workflows', ar: 'Workflows الوكلاء' }} value={`${totalSkills} skills`} percent={72} />
          </div>
        </GlassCard>

        <GlassCard className="p-5 sm:p-6">
          <SectionHeading
            eyebrow={{ en: 'Daily loop', ar: 'الدورة اليومية' }}
            title={{ en: 'Copy-ready commands', ar: 'أوامر جاهزة للنسخ' }}
            description={{ en: 'Common entry points defined by the repository.', ar: 'نقاط الدخول الشائعة المعرفة في المستودع.' }}
          />
          <div className="space-y-3">
            <CommandBox command="pnpm --filter=next dev" />
            <CommandBox command="pnpm test-dev-turbo test/path/to/test.ts" />
            <CommandBox command="pnpm lint" />
            <CommandBox command="pnpm eval" />
          </div>
        </GlassCard>
      </div>
    </AppShell>
  )
}
