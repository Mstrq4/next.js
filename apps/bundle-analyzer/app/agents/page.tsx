import {
  Bot,
  Boxes,
  GitBranch,
  Laptop2,
  Network,
  TerminalSquare,
} from 'lucide-react'
import { AppShell } from '@/components/control-center/app-shell'
import { GlassCard, SectionHeading } from '@/components/control-center/ui'
import { getRepoSnapshot } from '@/lib/control-center-data'

const environments = [
  {
    name: 'Claude Code',
    path: '.claude → .agents/skills',
    detail: 'Repository skills are exposed to Claude through a shared skill surface.',
    icon: Bot,
  },
  {
    name: 'Conductor',
    path: '.conductor/',
    detail: 'Parallel Claude Code worktrees with setup and run automation.',
    icon: Network,
  },
  {
    name: 'Agent skills',
    path: '.agents/skills/',
    detail: 'Operational knowledge for PRs, debugging, releases, testing and docs.',
    icon: Boxes,
  },
  {
    name: 'Developer shell',
    path: 'package.json scripts',
    detail: 'Common dev, test, lint, compiler and eval entry points.',
    icon: TerminalSquare,
  },
]

export default async function AgentsPage() {
  const data = await getRepoSnapshot()

  return (
    <AppShell
      title="Agent workspace"
      subtitle="The repository includes an operational layer for AI-assisted engineering: reusable skills, Claude integration and Conductor worktree orchestration."
      eyebrow="Agent operations"
    >
      <div className="grid gap-4 xl:grid-cols-[1.1fr_.9fr]">
        <GlassCard className="p-6">
          <SectionHeading
            eyebrow="Architecture"
            title="How agents enter the repository"
            description="One shared knowledge layer, multiple execution surfaces."
          />
          <div className="relative space-y-3">
            {environments.map((item) => {
              const Icon = item.icon
              return (
                <div
                  key={item.name}
                  className="relative flex gap-4 rounded-[20px] border border-border/70 bg-background/35 p-4"
                >
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-[15px] bg-primary/10 text-primary">
                    <Icon className="size-4.5" />
                  </span>
                  <div className="min-w-0">
                    <p className="font-medium">{item.name}</p>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">{item.detail}</p>
                    <p className="mt-2 font-mono text-[10px] text-primary/70">{item.path}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </GlassCard>

        <div className="space-y-4">
          <GlassCard className="p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary/70">
              Parallel development
            </p>
            <div className="mt-5 flex items-center gap-4">
              <span className="flex size-12 items-center justify-center rounded-[18px] bg-[#25002f] text-[#dfbce3]">
                <GitBranch className="size-5" />
              </span>
              <div>
                <p className="text-2xl font-semibold tracking-[-0.04em]">3–4 agents</p>
                <p className="text-sm text-muted-foreground">Recommended Conductor concurrency</p>
              </div>
            </div>
            <p className="mt-5 text-sm leading-6 text-muted-foreground">
              Each agent works in an isolated git worktree, keeping parallel tasks from colliding while sharing the same repository conventions.
            </p>
          </GlassCard>

          <GlassCard className="p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary/70">
              Knowledge surface
            </p>
            <p className="mt-3 text-4xl font-semibold tracking-[-0.05em]">
              {data.agentSkills.length}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">repository-native agent skills</p>
            <div className="mt-5 h-px bg-border" />
            <div className="mt-5 flex items-center gap-3 text-sm">
              <Laptop2 className="size-4 text-primary" />
              <span className="text-muted-foreground">
                Designed for local engineering workflows, not a remote admin service.
              </span>
            </div>
          </GlassCard>
        </div>
      </div>
    </AppShell>
  )
}
