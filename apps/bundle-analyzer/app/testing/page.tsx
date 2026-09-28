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
import { GlassCard, Pill, SectionHeading } from '@/components/control-center/ui'
import { getRepoSnapshot } from '@/lib/control-center-data'

function groupTests(keys: string[]) {
  return [
    {
      name: 'Development',
      description: 'Interactive dev-mode framework tests across bundlers.',
      keys: keys.filter((key) => key.includes('dev')),
      icon: PlayCircle,
    },
    {
      name: 'Production / start',
      description: 'Production server and start-mode behavior.',
      keys: keys.filter((key) => key.includes('start')),
      icon: CheckCircle2,
    },
    {
      name: 'Turbopack',
      description: 'Tests explicitly exercising the Turbopack path.',
      keys: keys.filter((key) => key.includes('turbo')),
      icon: Gauge,
    },
    {
      name: 'Rspack',
      description: 'Alternative bundler integration and regression coverage.',
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
      subtitle="Next.js validates behavior across multiple runtimes and bundlers. This view turns the root test matrix into a readable map of the most important verification surfaces."
      eyebrow="Quality engineering"
    >
      <div className="mb-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <GlassCard className="p-5">
          <TestTube2 className="size-5 text-primary" />
          <p className="mt-5 text-3xl font-semibold tracking-[-0.04em]">{data.tests.length}</p>
          <p className="mt-1 text-sm text-muted-foreground">root test commands</p>
        </GlassCard>
        <GlassCard className="p-5">
          <FlaskConical className="size-5 text-primary" />
          <p className="mt-5 text-3xl font-semibold tracking-[-0.04em]">Jest</p>
          <p className="mt-1 text-sm text-muted-foreground">primary test runner</p>
        </GlassCard>
        <GlassCard className="p-5">
          <Bug className="size-5 text-primary" />
          <p className="mt-5 text-3xl font-semibold tracking-[-0.04em]">Playwright</p>
          <p className="mt-1 text-sm text-muted-foreground">browser verification</p>
        </GlassCard>
        <GlassCard className="p-5">
          <Activity className="size-5 text-primary" />
          <p className="mt-5 text-3xl font-semibold tracking-[-0.04em]">3</p>
          <p className="mt-1 text-sm text-muted-foreground">bundler paths</p>
        </GlassCard>
      </div>

      <SectionHeading
        eyebrow="Test matrix"
        title="Verification surfaces"
        description="The same framework behavior is exercised through distinct development and bundler modes."
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
                    <h3 className="font-semibold">{group.name}</h3>
                    <Pill>{group.keys.length} commands</Pill>
                  </div>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    {group.description}
                  </p>
                </div>
              </div>
              <div className="mt-5 space-y-2">
                {group.keys.slice(0, 6).map((key) => (
                  <div
                    key={key}
                    className="flex items-center gap-2 rounded-[14px] border border-border/70 bg-background/35 px-3 py-2.5"
                  >
                    <span className="size-1.5 rounded-full bg-emerald-500" />
                    <code className="truncate text-[11px] text-muted-foreground">pnpm {key}</code>
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
