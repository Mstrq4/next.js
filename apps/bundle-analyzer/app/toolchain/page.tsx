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
import { GlassCard, MetricBar, Pill, SectionHeading } from '@/components/control-center/ui'
import { getRepoSnapshot } from '@/lib/control-center-data'

export default async function ToolchainPage() {
  const data = await getRepoSnapshot()

  const layers = [
    {
      name: 'Next.js',
      value: 'workspace',
      detail: 'Framework core, router, server rendering and build pipeline.',
      icon: Layers3,
      status: 'Core',
    },
    {
      name: 'React',
      value: data.versions.react,
      detail: 'Canary React runtime synchronized into the framework workspace.',
      icon: Braces,
      status: 'Runtime',
    },
    {
      name: 'Turbopack',
      value: `${data.turbopackCrates.length} crates`,
      detail: 'Rust compiler and bundler surface used for fast development and builds.',
      icon: Zap,
      status: 'Native',
    },
    {
      name: 'SWC',
      value: `${data.rustCrates.length} root crates`,
      detail: 'Native transforms, minification and framework-specific compiler work.',
      icon: Cpu,
      status: 'Compiler',
    },
    {
      name: 'Rspack',
      value: data.versions.rspack,
      detail: 'Alternative bundler integration with dedicated test and release paths.',
      icon: Boxes,
      status: 'Integration',
    },
    {
      name: 'TypeScript',
      value: data.versions.typescript,
      detail: 'Repository type system for packages, tests and development tooling.',
      icon: CircuitBoard,
      status: 'Language',
    },
  ]

  return (
    <AppShell
      title="Compiler & runtime toolchain"
      subtitle="A layered view of the technologies that build, execute and validate Next.js—from React and TypeScript to native Rust crates, Turbopack, SWC and Rspack."
      eyebrow="Engineering toolchain"
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
                <Pill tone="violet">{layer.status}</Pill>
              </div>
              <h3 className="mt-6 text-lg font-semibold tracking-[-0.025em]">
                {layer.name}
              </h3>
              <p className="mt-1 font-mono text-xs text-primary/75">{layer.value}</p>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                {layer.detail}
              </p>
            </GlassCard>
          )
        })}
      </div>

      <div className="mt-8 grid gap-4 xl:grid-cols-[1.1fr_.9fr]">
        <GlassCard className="p-5 sm:p-6">
          <SectionHeading
            eyebrow="Native surface"
            title="Rust workspace concentration"
            description="The framework combines TypeScript orchestration with substantial native compiler infrastructure."
          />
          <div className="space-y-5">
            <MetricBar
              label="Turbopack crates"
              value={String(data.turbopackCrates.length)}
              percent={100}
            />
            <MetricBar
              label="Root native crates"
              value={String(data.rustCrates.length)}
              percent={42}
            />
            <MetricBar
              label="JavaScript packages"
              value={String(data.packages.length)}
              percent={64}
            />
          </div>
        </GlassCard>

        <GlassCard className="p-5 sm:p-6">
          <SectionHeading
            eyebrow="Package manager"
            title="Workspace foundation"
            description="The repository is orchestrated as a pnpm + Turbo monorepo."
          />
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-[18px] border border-border/70 bg-background/35 p-4">
              <PackageCheck className="size-4 text-primary" />
              <p className="mt-4 text-xs text-muted-foreground">Package manager</p>
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
