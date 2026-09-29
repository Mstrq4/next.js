import {
  Braces,
  CircuitBoard,
  GitBranch,
  Layers3,
  PackageOpen,
  Rocket,
  Sparkles,
  TestTube2,
  Workflow,
  Zap,
} from 'lucide-react'
import Link from 'next/link'
import { AppShell } from '@/components/control-center/app-shell'
import { CopyButton } from '@/components/control-center/copy-button'
import { Localized } from '@/components/control-center/i18n-provider'
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
    title: 'Framework Core',
    titleAr: 'نواة الإطار',
    detail: 'App Router, Pages Router, rendering, caching and runtime boundaries.',
    detailAr: 'App Router وPages Router والتصيير والتخزين المؤقت وحدود بيئة التشغيل.',
    icon: Layers3,
    href: '/packages',
    tone: 'from-[#dcbce8]/70 to-[#b77fc0]/20',
  },
  {
    title: 'Turbopack',
    titleAr: 'Turbopack',
    detail: 'Rust-powered compiler, bundler crates and development pipeline.',
    detailAr: 'مترجم وحازم مبني على Rust مع حزم التطوير وخط البناء.',
    icon: Zap,
    href: '/toolchain',
    tone: 'from-[#c690cc]/55 to-[#74317a]/15',
  },
  {
    title: 'Agent System',
    titleAr: 'نظام الوكلاء',
    detail: 'Repository-aware skills for PRs, debugging, releases and docs.',
    detailAr: 'مهارات واعية بالمستودع لطلبات الدمج والتصحيح والإصدارات والتوثيق.',
    icon: Braces,
    href: '/agents',
    tone: 'from-[#d7afd7]/60 to-[#4f1059]/10',
  },
  {
    title: 'Quality Lab',
    titleAr: 'مختبر الجودة',
    detail: 'Jest, Playwright, integration suites, evals and release tests.',
    detailAr: 'Jest وPlaywright واختبارات التكامل والتقييمات واختبارات الإصدار.',
    icon: TestTube2,
    href: '/testing',
    tone: 'from-[#e2c7ef]/75 to-[#ad78b0]/15',
  },
]

const quickCommands = [
  { label: 'Development', labelAr: 'التطوير', command: 'pnpm dev', icon: Rocket },
  { label: 'Turbopack tests', labelAr: 'اختبارات Turbopack', command: 'pnpm test-turbo', icon: Zap },
  { label: 'Agent evals', labelAr: 'تقييمات الوكلاء', command: 'pnpm eval', icon: Sparkles },
  { label: 'Full lint', labelAr: 'الفحص الكامل', command: 'pnpm lint', icon: Braces },
]

export default async function HomePage() {
  const data = await getRepoSnapshot()
  const totalSkills = data.agentSkills.length + data.frameworkSkills.length

  return (
    <AppShell
      title="Repository intelligence, in one place."
      titleAr="ذكاء المستودع في مكان واحد."
      subtitle="A visual engineering console for the Next.js monorepo—framework packages, agent skills, compilers, tests, workflows and repository commands without digging through hundreds of folders."
      subtitleAr="لوحة هندسية مرئية لمستودع Next.js الأحادي: الحزم والمهارات والمترجمات والاختبارات وسير العمل والأوامر دون البحث يدويًا داخل مئات المجلدات."
      eyebrow="Next Forge · Control Center"
      eyebrowAr="Next Forge · مركز التحكم"
    >
      <div className="relative mb-8 overflow-hidden rounded-[30px] border border-border bg-[#25002f] p-6 text-white shadow-[0_28px_90px_rgba(55,7,65,.22)] sm:p-8 lg:p-10">
        <div className="nf-grid pointer-events-none absolute inset-0 opacity-35" />
        <div className="absolute -right-16 -top-20 size-72 rounded-full bg-[#c996ce]/25 blur-3xl" />
        <div className="absolute bottom-[-7rem] left-[22%] size-64 rounded-full bg-[#74317a]/35 blur-3xl" />

        <div className="relative grid gap-8 xl:grid-cols-[1.45fr_.8fr] xl:items-end">
          <div>
            <Pill tone="violet">
              <Localized en="Next.js canary workspace" ar="مساحة عمل Next.js canary" />
            </Pill>
            <h2 className="mt-5 max-w-3xl text-3xl font-semibold tracking-[-0.05em] text-white sm:text-4xl lg:text-5xl">
              <Localized en="The framework workshop," ar="ورشة عمل الإطار،" />
              <span className="block text-[#ddbce2]">
                <Localized en="made visible." ar="أصبحت مرئية." />
              </span>
            </h2>
            <Localized
              as="p"
              en="Next Forge turns the repository itself into a navigable product: see what exists, understand where it lives, and move from system overview to the exact engineering surface you need."
              ar="يحوّل Next Forge المستودع نفسه إلى منتج قابل للتصفح: اعرف ما الموجود وأين يوجد وانتقل من الصورة العامة إلى الجزء الهندسي الذي تحتاجه مباشرة."
              className="mt-4 max-w-2xl text-sm leading-7 text-[#ddcfe1]/80 sm:text-[15px]"
            />
            <div className="mt-7 flex flex-wrap gap-2.5">
              <Link
                href="/skills"
                className="inline-flex min-h-10 items-center gap-2 rounded-full bg-white px-4 text-sm font-semibold text-[#32103b] transition-transform active:scale-95"
              >
                <Sparkles className="size-4" />
                <Localized en="Explore skills" ar="استعراض المهارات" />
              </Link>
              <Link
                href="/docs"
                className="inline-flex min-h-10 items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 text-sm font-medium text-white backdrop-blur-xl transition-colors hover:bg-white/15"
              >
                <CircuitBoard className="size-4" />
                <Localized en="Open documentation" ar="فتح التوثيق" />
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-[22px] border border-white/10 bg-white/[0.07] p-4 backdrop-blur-xl">
              <Localized as="p" en="Runtime" ar="بيئة التشغيل" className="text-[10px] uppercase tracking-[0.16em] text-[#dcbfe1]/65" />
              <p className="mt-2 font-mono text-sm text-white">React {data.versions.react}</p>
            </div>
            <div className="rounded-[22px] border border-white/10 bg-white/[0.07] p-4 backdrop-blur-xl">
              <Localized as="p" en="Tooling" ar="الأدوات" className="text-[10px] uppercase tracking-[0.16em] text-[#dcbfe1]/65" />
              <p className="mt-2 font-mono text-sm text-white">{data.packageManager}</p>
            </div>
            <div className="col-span-2 rounded-[22px] border border-white/10 bg-white/[0.07] p-4 backdrop-blur-xl">
              <div className="flex items-center gap-2 text-xs text-[#e9d8ed]/75">
                <GitBranch className="size-3.5" />
                canary
              </div>
              <Localized as="p" en="Active development branch" ar="فرع التطوير النشط" className="mt-2 text-sm font-medium" />
              <Localized
                as="p"
                en="Framework, compiler and agent workflows share one monorepo."
                ar="الإطار والمترجم وسير عمل الوكلاء تشترك في مستودع أحادي واحد."
                className="mt-1 text-xs text-[#dcbfe1]/60"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mb-9 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        <StatCard
          label={<Localized en="Workspace packages" ar="حزم مساحة العمل" />}
          value={data.packages.length}
          detail={<Localized en="Core packages under packages/" ar="الحزم الأساسية داخل packages/" />}
          icon={<PackageOpen className="size-5" />}
        />
        <StatCard
          label={<Localized en="Agent skills" ar="مهارات الوكلاء" />}
          value={totalSkills}
          detail={<Localized en="Repository + framework skills" ar="مهارات المستودع + الإطار" />}
          icon={<Sparkles className="size-5" />}
        />
        <StatCard
          label={<Localized en="Workflows" ar="سير العمل" />}
          value={data.workflows.length}
          detail={<Localized en="GitHub automation pipelines" ar="مسارات أتمتة GitHub" />}
          icon={<Workflow className="size-5" />}
        />
        <StatCard
          label={<Localized en="Test commands" ar="أوامر الاختبار" />}
          value={data.tests.length}
          detail={<Localized en="Root test entry points" ar="نقاط تشغيل الاختبارات" />}
          icon={<TestTube2 className="size-5" />}
        />
        <StatCard
          label={<Localized en="Rust crates" ar="حزم Rust" />}
          value={data.rustCrates.length}
          detail={<Localized en="Framework native crates" ar="الحزم الأصلية للإطار" />}
          icon={<CircuitBoard className="size-5" />}
        />
        <StatCard
          label={<Localized en="Turbopack crates" ar="حزم Turbopack" />}
          value={data.turbopackCrates.length}
          detail={<Localized en="Bundler/compiler workspace" ar="مساحة الحازم والمترجم" />}
          icon={<Zap className="size-5" />}
        />
      </div>

      <div className="mb-10">
        <SectionHeading
          eyebrow={<Localized en="System map" ar="خريطة النظام" />}
          title={<Localized en="Major engineering surfaces" ar="الأسطح الهندسية الرئيسية" />}
          description={
            <Localized
              en="The repository is not one application. It is a network of framework packages, native compiler crates, agent workflows, test infrastructure and release automation."
              ar="المستودع ليس تطبيقًا واحدًا؛ بل شبكة من حزم الإطار والمترجمات الأصلية وسير عمل الوكلاء وبنية الاختبارات وأتمتة الإصدارات."
            />
          }
        />
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {architecture.map((item) => {
            const Icon = item.icon
            return (
              <Link key={item.title} href={item.href} className="group block">
                <GlassCard className="h-full overflow-hidden p-5 transition-transform duration-300 group-hover:-translate-y-0.5">
                  <div className={`mb-6 flex size-12 items-center justify-center rounded-[18px] bg-gradient-to-br ${item.tone} text-primary`}>
                    <Icon className="size-5" strokeWidth={1.7} />
                  </div>
                  <Localized as="h3" en={item.title} ar={item.titleAr} className="font-semibold tracking-[-0.02em]" />
                  <Localized as="p" en={item.detail} ar={item.detailAr} className="mt-2 text-sm leading-6 text-muted-foreground" />
                </GlassCard>
              </Link>
            )
          })}
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.2fr_.8fr]">
        <GlassCard className="p-5 sm:p-6">
          <SectionHeading
            eyebrow={<Localized en="Toolchain" ar="سلسلة الأدوات" />}
            title={<Localized en="Compiler & runtime profile" ar="ملف المترجم وبيئة التشغيل" />}
            description={<Localized en="Current versions and workspace concentration." ar="الإصدارات الحالية وتوزيع مكونات مساحة العمل." />}
            action={{ href: '/toolchain', label: <Localized en="Inspect stack" ar="فحص التقنيات" /> }}
          />
          <div className="space-y-5">
            <MetricBar
              label={<Localized en="Turbopack native surface" ar="سطح Turbopack الأصلي" />}
              value={data.turbopackCrates.length + ' crates'}
              percent={92}
            />
            <MetricBar
              label={<Localized en="Core workspace packages" ar="حزم مساحة العمل الأساسية" />}
              value={data.packages.length + ' packages'}
              percent={68}
            />
            <MetricBar
              label={<Localized en="Automation coverage" ar="تغطية الأتمتة" />}
              value={data.workflows.length + ' workflows'}
              percent={78}
            />
            <MetricBar
              label={<Localized en="Agent workflows" ar="سير عمل الوكلاء" />}
              value={totalSkills + ' skills'}
              percent={72}
            />
          </div>
        </GlassCard>

        <GlassCard className="p-5 sm:p-6">
          <SectionHeading
            eyebrow={<Localized en="Daily loop" ar="الدورة اليومية" />}
            title={<Localized en="Fast paths" ar="المسارات السريعة" />}
            description={<Localized en="Common entry points already defined by the repository." ar="نقاط تشغيل شائعة يعرّفها المستودع مسبقًا." />}
          />
          <div className="space-y-2">
            {quickCommands.map((item) => {
              const Icon = item.icon
              return (
                <div key={item.command} className="flex items-center gap-3 rounded-[18px] border border-border/70 bg-background/35 p-3.5">
                  <span className="flex size-9 items-center justify-center rounded-[13px] bg-primary/10 text-primary">
                    <Icon className="size-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <Localized as="p" en={item.label} ar={item.labelAr} className="text-sm font-medium" />
                    <p className="mt-0.5 truncate font-mono text-[11px] text-muted-foreground">{item.command}</p>
                  </div>
                  <CopyButton value={item.command} compact />
                </div>
              )
            })}
          </div>
        </GlassCard>
      </div>
    </AppShell>
  )
}
