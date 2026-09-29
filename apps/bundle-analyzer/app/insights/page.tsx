import {
  Activity,
  BarChart3,
  Boxes,
  Braces,
  CircuitBoard,
  FileCode2,
  PackageOpen,
  TestTube2,
  Workflow,
  Zap,
} from 'lucide-react'
import Link from 'next/link'
import { AppShell } from '@/components/control-center/app-shell'
import { LiveActionsStatus } from '@/components/control-center/live-actions-status'
import { Localized } from '@/components/control-center/i18n-provider'
import { GlassCard, MetricBar, Pill, SectionHeading } from '@/components/control-center/ui'
import {
  getAgentIntegrations,
  getRepoSnapshot,
  getSkillCatalog,
  getWorkflowCatalog,
} from '@/lib/control-center-data'

export default async function InsightsPage() {
  const [snapshot, skills, agents, workflows] = await Promise.all([
    getRepoSnapshot(),
    getSkillCatalog(),
    getAgentIntegrations(),
    getWorkflowCatalog(),
  ])

  const totalSkills = skills.length
  const agentSkills = skills.filter((skill) => skill.group === 'Agent skill').length
  const frameworkSkills = totalSkills - agentSkills
  const workflowCategories = workflows.reduce<Record<string, number>>((acc, workflow) => {
    acc[workflow.category] = (acc[workflow.category] ?? 0) + 1
    return acc
  }, {})

  const maxSurface = Math.max(
    snapshot.packages.length,
    snapshot.turbopackCrates.length,
    snapshot.rustCrates.length,
    totalSkills,
    snapshot.workflows.length,
    1
  )

  const surfaceRows = [
    {
      label: 'Workspace packages',
      labelAr: 'حزم مساحة العمل',
      value: snapshot.packages.length,
      icon: PackageOpen,
    },
    {
      label: 'Turbopack crates',
      labelAr: 'حزم Turbopack',
      value: snapshot.turbopackCrates.length,
      icon: Zap,
    },
    {
      label: 'Native Rust crates',
      labelAr: 'حزم Rust الأصلية',
      value: snapshot.rustCrates.length,
      icon: CircuitBoard,
    },
    {
      label: 'Agent + framework skills',
      labelAr: 'مهارات الوكلاء والإطار',
      value: totalSkills,
      icon: Braces,
    },
    {
      label: 'GitHub workflows',
      labelAr: 'سير عمل GitHub',
      value: snapshot.workflows.length,
      icon: Workflow,
    },
  ]

  return (
    <AppShell
      title="Repository insights"
      titleAr="تحليلات المستودع"
      subtitle="A compact intelligence layer over the live Next.js workspace: package concentration, agent knowledge, compiler surfaces, tests and public canary automation."
      subtitleAr="طبقة تحليل مركزة فوق مساحة عمل Next.js الحقيقية: توزيع الحزم ومعرفة الوكلاء ومكونات المترجم والاختبارات وأتمتة canary العامة."
      eyebrow="Engineering analytics"
      eyebrowAr="التحليلات الهندسية"
    >
      <div className="mb-8 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        {[
          [snapshot.packages.length, 'Packages', 'الحزم', PackageOpen],
          [totalSkills, 'Skills', 'المهارات', Braces],
          [agents.length, 'Agent integrations', 'تكاملات الوكلاء', Boxes],
          [snapshot.tests.length, 'Test entry points', 'نقاط الاختبار', TestTube2],
          [snapshot.workflows.length, 'Workflows', 'سير العمل', Workflow],
          [snapshot.turbopackCrates.length, 'Turbopack crates', 'حزم Turbopack', Zap],
        ].map(([value, en, ar, Icon]) => (
          <GlassCard key={String(en)} className="p-4 sm:p-5">
            <Icon className="size-4 text-primary" />
            <p className="mt-5 text-2xl font-semibold tracking-[-0.04em]">{String(value)}</p>
            <Localized as="p" en={String(en)} ar={String(ar)} className="mt-1 text-xs text-muted-foreground" />
          </GlassCard>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.05fr_.95fr]">
        <GlassCard className="p-5 sm:p-6">
          <SectionHeading
            eyebrow={<Localized en="Repository footprint" ar="بصمة المستودع" />}
            title={<Localized en="Engineering surface concentration" ar="تركيز الأسطح الهندسية" />}
            description={<Localized en="Relative counts from the current checkout. Use these bars to see where the repository concentrates packages, native code, skills and automation." ar="أعداد نسبية من النسخة الحالية. استخدم هذه المؤشرات لمعرفة أين يتركز المستودع بين الحزم والكود الأصلي والمهارات والأتمتة." />}
          />
          <div className="space-y-5">
            {surfaceRows.map((item) => {
              const Icon = item.icon
              return (
                <div key={item.label}>
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <span className="flex min-w-0 items-center gap-2 text-sm font-medium">
                      <Icon className="size-4 shrink-0 text-primary" />
                      <Localized en={item.label} ar={item.labelAr} />
                    </span>
                    <span className="font-mono text-xs text-muted-foreground">{item.value}</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-primary/10">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#4f1059] via-[#74317a] to-[#d7afd7]"
                      style={{ width: `${Math.max(4, (item.value / maxSurface) * 100)}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </GlassCard>

        <GlassCard className="p-5 sm:p-6">
          <SectionHeading
            eyebrow={<Localized en="Agent knowledge" ar="معرفة الوكلاء" />}
            title={<Localized en="Skill coverage" ar="تغطية المهارات" />}
            description={<Localized en="How the reusable knowledge layer is distributed between repository engineering and portable Next.js framework workflows." ar="كيف تتوزع طبقة المعرفة القابلة لإعادة الاستخدام بين هندسة المستودع ومهارات Next.js المحمولة." />}
          />
          <div className="space-y-5">
            <MetricBar
              label={<Localized en="Repository agent skills" ar="مهارات وكلاء المستودع" />}
              value={`${agentSkills} / ${totalSkills}`}
              percent={totalSkills ? (agentSkills / totalSkills) * 100 : 0}
            />
            <MetricBar
              label={<Localized en="Portable framework skills" ar="مهارات الإطار المحمولة" />}
              value={`${frameworkSkills} / ${totalSkills}`}
              percent={totalSkills ? (frameworkSkills / totalSkills) * 100 : 0}
            />
            <MetricBar
              label={<Localized en="Agent integrations" ar="تكاملات الوكلاء" />}
              value={String(agents.length)}
              percent={Math.min(100, agents.length * 18)}
            />
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {Object.entries(workflowCategories).map(([category, count]) => (
              <Pill key={category} tone={category === 'Release' ? 'violet' : 'default'}>
                {category} · {count}
              </Pill>
            ))}
          </div>
        </GlassCard>
      </div>

      <div className="mt-8">
        <SectionHeading
          eyebrow={<Localized en="Interactive analysis" ar="التحليل التفاعلي" />}
          title={<Localized en="Move from overview to live repository analysis" ar="انتقل من النظرة العامة إلى التحليل الحي للمستودع" />}
          description={<Localized en="Next Forge includes live source-size analysis and comparison tools backed by the public vercel/next.js canary Git tree." ar="يتضمن Next Forge أدوات حية لتحليل حجم المصدر ومقارنته اعتمادًا على شجرة Git العامة لفرع canary في vercel/next.js." />}
        />
        <div className="grid gap-3 md:grid-cols-3">
          <Link href="/analyze" className="group">
            <GlassCard className="h-full p-5 transition-transform duration-300 group-hover:-translate-y-0.5">
              <BarChart3 className="size-5 text-primary" />
              <Localized as="h3" en="Analyze repository surface" ar="تحليل سطح من المستودع" className="mt-5 font-semibold" />
              <Localized as="p" en="Measure file count, source size, extensions and largest files for a selected directory." ar="قس عدد الملفات وحجم المصدر والامتدادات وأكبر الملفات داخل مجلد تختاره." className="mt-2 text-sm leading-6 text-muted-foreground" />
            </GlassCard>
          </Link>
          <Link href="/compare" className="group">
            <GlassCard className="h-full p-5 transition-transform duration-300 group-hover:-translate-y-0.5">
              <Activity className="size-5 text-primary" />
              <Localized as="h3" en="Compare two surfaces" ar="مقارنة سطحين" className="mt-5 font-semibold" />
              <Localized as="p" en="Compare size, file count and extension distribution between two repository directories." ar="قارن الحجم وعدد الملفات وتوزيع الامتدادات بين مجلدين من المستودع." className="mt-2 text-sm leading-6 text-muted-foreground" />
            </GlassCard>
          </Link>
          <Link href="/repository" className="group">
            <GlassCard className="h-full p-5 transition-transform duration-300 group-hover:-translate-y-0.5">
              <FileCode2 className="size-5 text-primary" />
              <Localized as="h3" en="Explore repository" ar="استكشاف المستودع" className="mt-5 font-semibold" />
              <Localized as="p" en="Browse important agent, tooling, package, compiler and documentation directories." ar="تصفح مجلدات الوكلاء والأدوات والحزم والمترجمات والتوثيق المهمة." className="mt-2 text-sm leading-6 text-muted-foreground" />
            </GlassCard>
          </Link>
        </div>
      </div>

      <div className="mt-8">
        <LiveActionsStatus />
      </div>
    </AppShell>
  )
}
