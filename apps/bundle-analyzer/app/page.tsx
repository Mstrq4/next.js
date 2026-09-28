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
    detail: 'App Router, Pages Router, rendering, caching and runtime boundaries.',
    icon: Layers3,
    href: '/packages',
    tone: 'from-[#dcbce8]/70 to-[#b77fc0]/20',
  },
  {
    title: 'Turbopack',
    detail: 'Rust-powered compiler, bundler crates and development pipeline.',
    icon: Zap,
    href: '/toolchain',
    tone: 'from-[#c690cc]/55 to-[#74317a]/15',
  },
  {
    title: 'Agent System',
    detail: 'Repository-aware skills for PRs, debugging, releases and docs.',
    icon: Braces,
    href: '/agents',
    tone: 'from-[#d7afd7]/60 to-[#4f1059]/10',
  },
  {
    title: 'Quality Lab',
    detail: 'Jest, Playwright, integration suites, evals and release tests.',
    icon: TestTube2,
    href: '/testing',
    tone: 'from-[#e2c7ef]/75 to-[#ad78b0]/15',
  },
]

const quickCommands = [
  { label: 'Development', command: 'pnpm dev', icon: Rocket },
  { label: 'Turbopack tests', command: 'pnpm test-turbo', icon: Zap },
  { label: 'Agent evals', command: 'pnpm eval', icon: Sparkles },
  { label: 'Full lint', command: 'pnpm lint', icon: Braces },
]

export default async function HomePage() {
  const data = await getRepoSnapshot()
  const totalSkills = data.agentSkills.length + data.frameworkSkills.length

  return (
    <AppShell
      title="Repository intelligence, in one place."
      subtitle="A visual engineering console for the Next.js monorepo—framework packages, agent skills, compilers, tests, workflows and repository commands without digging through hundreds of folders."
      eyebrow="Next Forge · Control Center"
    >
      <div className="relative mb-8 overflow-hidden rounded-[30px] border border-border bg-[#25002f] p-6 text-white shadow-[0_28px_90px_rgba(55,7,65,.22)] sm:p-8 lg:p-10">
        <div className="nf-grid pointer-events-none absolute inset-0 opacity-35" />
        <div className="absolute -right-16 -top-20 size-72 rounded-full bg-[#c996ce]/25 blur-3xl" />
        <div className="absolute bottom-[-7rem] left-[22%] size-64 rounded-full bg-[#74317a]/35 blur-3xl" />

        <div className="relative grid gap-8 xl:grid-cols-[1.45fr_.8fr] xl:items-end">
          <div>
            <Pill tone="violet">Next.js canary workspace</Pill>
            <h2 className="mt-5 max-w-3xl text-3xl font-semibold tracking-[-0.05em] text-white sm:text-4xl lg:text-5xl">
              The framework workshop,
              <span className="block text-[#ddbce2]">made visible.</span>
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-[#ddcfe1]/80 sm:text-[15px]">
              Next Forge turns the repository itself into a navigable product:
              see what exists, understand where it lives, and move from system
              overview to the exact engineering surface you need.
            </p>
            <div className="mt-7 flex flex-wrap gap-2.5">
              <Link
                href="/skills"
                className="inline-flex min-h-10 items-center gap-2 rounded-full bg-white px-4 text-sm font-semibold text-[#32103b] transition-transform active:scale-95"
              >
                <Sparkles className="size-4" />
                Explore skills
              </Link>
              <Link
                href="/toolchain"
                className="inline-flex min-h-10 items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 text-sm font-medium text-white backdrop-blur-xl transition-colors hover:bg-white/15"
              >
                <CircuitBoard className="size-4" />
                Open toolchain
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-[22px] border border-white/10 bg-white/[0.07] p-4 backdrop-blur-xl">
              <p className="text-[10px] uppercase tracking-[0.16em] text-[#dcbfe1]/65">Runtime</p>
              <p className="mt-2 font-mono text-sm text-white">React {data.versions.react}</p>
            </div>
            <div className="rounded-[22px] border border-white/10 bg-white/[0.07] p-4 backdrop-blur-xl">
              <p className="text-[10px] uppercase tracking-[0.16em] text-[#dcbfe1]/65">Tooling</p>
              <p className="mt-2 font-mono text-sm text-white">{data.packageManager}</p>
            </div>
            <div className="col-span-2 rounded-[22px] border border-white/10 bg-white/[0.07] p-4 backdrop-blur-xl">
              <div className="flex items-center gap-2 text-xs text-[#e9d8ed]/75">
                <GitBranch className="size-3.5" />
                canary
              </div>
              <p className="mt-2 text-sm font-medium">Active development branch</p>
              <p className="mt-1 text-xs text-[#dcbfe1]/60">
                Framework, compiler and agent workflows share one monorepo.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-9 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        <StatCard
          label="Workspace packages"
          value={data.packages.length}
          detail="Core packages under packages/"
          icon={<PackageOpen className="size-5" />}
        />
        <StatCard
          label="Agent skills"
          value={totalSkills}
          detail="Repository + framework skills"
          icon={<Sparkles className="size-5" />}
        />
        <StatCard
          label="Workflows"
          value={data.workflows.length}
          detail="GitHub automation pipelines"
          icon={<Workflow className="size-5" />}
        />
        <StatCard
          label="Test commands"
          value={data.tests.length}
          detail="Root test entry points"
          icon={<TestTube2 className="size-5" />}
        />
        <StatCard
          label="Rust crates"
          value={data.rustCrates.length}
          detail="Framework native crates"
          icon={<CircuitBoard className="size-5" />}
        />
        <StatCard
          label="Turbopack crates"
          value={data.turbopackCrates.length}
          detail="Bundler/compiler workspace"
          icon={<Zap className="size-5" />}
        />
      </div>

      <div className="mb-10">
        <SectionHeading
          eyebrow="System map"
          title="Major engineering surfaces"
          description="The repository is not one application. It is a network of framework packages, native compiler crates, agent workflows, test infrastructure and release automation."
        />
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {architecture.map((item) => {
            const Icon = item.icon
            return (
              <Link key={item.title} href={item.href} className="group block">
                <GlassCard className="h-full overflow-hidden p-5 transition-transform duration-300 group-hover:-translate-y-0.5">
                  <div
                    className={`mb-6 flex size-12 items-center justify-center rounded-[18px] bg-gradient-to-br ${item.tone} text-primary`}
                  >
                    <Icon className="size-5" strokeWidth={1.7} />
                  </div>
                  <h3 className="font-semibold tracking-[-0.02em]">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {item.detail}
                  </p>
                </GlassCard>
              </Link>
            )
          })}
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.2fr_.8fr]">
        <GlassCard className="p-5 sm:p-6">
          <SectionHeading
            eyebrow="Toolchain"
            title="Compiler & runtime profile"
            description="Current versions and workspace concentration."
            action={{ href: '/toolchain', label: 'Inspect stack' }}
          />
          <div className="space-y-5">
            <MetricBar
              label="Turbopack native surface"
              value={`${data.turbopackCrates.length} crates`}
              percent={92}
            />
            <MetricBar
              label="Core workspace packages"
              value={`${data.packages.length} packages`}
              percent={68}
            />
            <MetricBar
              label="Automation coverage"
              value={`${data.workflows.length} workflows`}
              percent={78}
            />
            <MetricBar
              label="Agent workflows"
              value={`${totalSkills} skills`}
              percent={72}
            />
          </div>
        </GlassCard>

        <GlassCard className="p-5 sm:p-6">
          <SectionHeading
            eyebrow="Daily loop"
            title="Fast paths"
            description="Common entry points already defined by the repository."
          />
          <div className="space-y-2">
            {quickCommands.map((item) => {
              const Icon = item.icon
              return (
                <div
                  key={item.command}
                  className="flex items-center gap-3 rounded-[18px] border border-border/70 bg-background/35 p-3.5"
                >
                  <span className="flex size-9 items-center justify-center rounded-[13px] bg-primary/10 text-primary">
                    <Icon className="size-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">{item.label}</p>
                    <p className="mt-0.5 truncate font-mono text-[11px] text-muted-foreground">
                      {item.command}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </GlassCard>
      </div>
    </AppShell>
  )
}
