import {
  Boxes,
  GitPullRequest,
  Rocket,
  ShieldCheck,
  Workflow,
  Zap,
} from 'lucide-react'
import { AppShell } from '@/components/control-center/app-shell'
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
      title="GitHub automation"
      subtitle="Builds, integration tests, release jobs, Rspack verification, Turbopack benchmarks and repository triage are coordinated by a broad Actions surface."
      eyebrow="CI & automation"
    >
      <div className="mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {['CI', 'Release', 'Rspack', 'Turbopack', 'Automation'].map((category) => {
          const Icon = categoryIcon[category as keyof typeof categoryIcon]
          return (
            <GlassCard key={category} className="p-4">
              <Icon className="size-4 text-primary" />
              <p className="mt-4 text-2xl font-semibold tracking-[-0.04em]">
                {counts[category] ?? 0}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">{category}</p>
            </GlassCard>
          )
        })}
      </div>

      <SectionHeading
        eyebrow=".github/workflows"
        title="Workflow catalog"
        description="Every card maps to an existing workflow definition on the canary branch."
      />
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {workflows.map((workflow) => {
          const Icon = categoryIcon[workflow.category as keyof typeof categoryIcon] ?? Workflow
          return (
            <GlassCard key={workflow.file} className="p-5">
              <div className="flex items-start justify-between gap-3">
                <span className="flex size-10 items-center justify-center rounded-[15px] bg-primary/10 text-primary">
                  <Icon className="size-4.5" />
                </span>
                <Pill tone={workflow.category === 'Release' ? 'violet' : 'default'}>
                  {workflow.category}
                </Pill>
              </div>
              <h3 className="mt-5 text-sm font-semibold">{workflow.name}</h3>
              <div className="mt-4 flex items-center gap-2 rounded-[14px] bg-muted/70 px-3 py-2 font-mono text-[10px] text-muted-foreground">
                <GitPullRequest className="size-3.5" />
                <span className="truncate">{workflow.file}</span>
              </div>
            </GlassCard>
          )
        })}
      </div>
    </AppShell>
  )
}
