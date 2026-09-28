import {
  Boxes,
  ExternalLink,
  GitPullRequest,
  Rocket,
  ShieldCheck,
  Workflow,
  Zap,
} from 'lucide-react'
import { AppShell } from '@/components/control-center/app-shell'
import { CopyButton } from '@/components/control-center/copy-button'
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
      titleAr="أتمتة GitHub"
      subtitle="Inspect every workflow, open its live Actions page and copy the GitHub CLI command used to dispatch it when your account has permission."
      subtitleAr="افحص كل سير عمل وافتح صفحة Actions الفعلية وانسخ أمر GitHub CLI لتشغيله عندما يملك حسابك الصلاحية."
      eyebrow="CI & automation"
      eyebrowAr="التكامل المستمر والأتمتة"
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
                <span className="min-w-0 flex-1 truncate">{workflow.file}</span>
                <CopyButton value={workflow.command} compact />
              </div>
              <div className="mt-3 flex items-center gap-2">
                <a
                  href={workflow.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-9 flex-1 items-center justify-center gap-2 rounded-full border border-border bg-background/45 px-3 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <ExternalLink className="size-3.5" />
                  Open workflow
                </a>
                <CopyButton value={workflow.command} label="Copy run command" />
              </div>
            </GlassCard>
          )
        })}
      </div>
    </AppShell>
  )
}
