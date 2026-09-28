import {
  Boxes,
  ExternalLink,
  Rocket,
  ShieldCheck,
  Workflow,
  Zap,
} from 'lucide-react'
import { AppShell } from '@/components/control-center/app-shell'
import { LiveActionsStatus } from '@/components/control-center/live-actions-status'
import { GlassCard, Pill, SectionHeading } from '@/components/control-center/ui'
import { getWorkflowCatalog } from '@/lib/control-center-data'

const categoryIcon = {
  CI: ShieldCheck,
  Release: Rocket,
  Rspack: Boxes,
  Turbopack: Zap,
  Automation: Workflow,
} as const

export default async function WorkflowsPage() {
  const workflows = await getWorkflowCatalog()
  const counts = workflows.reduce<Record<string, number>>((acc, workflow) => {
    acc[workflow.category] = (acc[workflow.category] ?? 0) + 1
    return acc
  }, {})

  return (
    <AppShell
      title={{ en: 'GitHub automation', ar: 'أتمتة GitHub' }}
      subtitle={{
        en: 'Browse the actual workflow definitions in .github/workflows and monitor the latest canary runs directly from GitHub.',
        ar: 'استعرض ملفات سير العمل الفعلية داخل .github/workflows وراقب أحدث تشغيلات canary مباشرة من GitHub.',
      }}
      eyebrow={{ en: 'CI & automation', ar: 'CI والأتمتة' }}
    >
      <div className="mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {['CI', 'Release', 'Rspack', 'Turbopack', 'Automation'].map((category) => {
          const Icon = categoryIcon[category as keyof typeof categoryIcon]
          return (
            <GlassCard key={category} className="p-4">
              <Icon className="size-4 text-primary" />
              <p className="mt-4 text-2xl font-semibold">{counts[category] ?? 0}</p>
              <p className="mt-1 text-xs text-muted-foreground">{category}</p>
            </GlassCard>
          )
        })}
      </div>

      <div className="mb-8">
        <LiveActionsStatus />
      </div>

      <SectionHeading
        eyebrow=".github/workflows"
        title={{ en: 'Workflow catalog', ar: 'كتالوج سير العمل' }}
        description={{
          en: 'Every item below maps to a real workflow definition on canary and opens the source file on GitHub.',
          ar: 'كل عنصر أدناه مرتبط بملف Workflow حقيقي على canary ويمكن فتح مصدره على GitHub.',
        }}
      />

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {workflows.map((workflow) => {
          const Icon =
            categoryIcon[workflow.category as keyof typeof categoryIcon] ?? Workflow
          return (
            <GlassCard key={workflow.file} className="flex min-h-52 flex-col p-5">
              <div className="flex items-start justify-between gap-3">
                <span className="flex size-10 items-center justify-center rounded-[15px] bg-primary/10 text-primary">
                  <Icon className="size-4.5" />
                </span>
                <Pill tone={workflow.category === 'Release' ? 'violet' : 'default'}>
                  {workflow.category}
                </Pill>
              </div>
              <h3 className="mt-5 text-sm font-semibold">{workflow.name}</h3>
              <div
                dir="ltr"
                className="mt-3 truncate rounded-[12px] bg-muted/70 px-3 py-2 text-left font-mono text-[10px] text-muted-foreground"
              >
                {workflow.path}
              </div>
              <a
                href={`https://github.com/Mstrq4/next.js/blob/canary/${workflow.path}`}
                target="_blank"
                rel="noreferrer"
                className="mt-auto inline-flex min-h-9 items-center justify-center gap-2 rounded-full border border-border bg-background/50 px-3 text-xs font-medium"
              >
                <ExternalLink className="size-3.5" />
                Open workflow
              </a>
            </GlassCard>
          )
        })}
      </div>
    </AppShell>
  )
}
