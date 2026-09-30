import { CommandList } from '@/components/command-list'
import { Icon } from '@/components/icons'
import { Chip, GlassPanel, MetricCard, PageHeader, SectionTitle } from '@/components/ui'
import { getRepoSnapshot } from '@/lib/repo-data'
import { quickCommands } from '@/lib/site'

export default function OverviewPage() {
  const repo = getRepoSnapshot()

  const pillars = [
    { title: 'Next.js Core', description: 'CLI, build pipeline, client runtime, server runtime and shared internals.', href: '/framework', icon: 'layers' as const, meta: repo.counts.frameworkModules + ' modules' },
    { title: 'Agent Intelligence', description: 'Repository engineering workflows plus public framework skills.', href: '/skills', icon: 'sparkles' as const, meta: repo.counts.skills + ' skills' },
    { title: 'Toolchain', description: 'Turbopack, Rspack, SWC, Rust, Playwright, Jest and maintenance scripts.', href: '/tooling', icon: 'terminal' as const, meta: repo.counts.scripts + ' commands' },
    { title: 'Quality Lab', description: 'Development, production, deployment and bundler-specific test surfaces.', href: '/testing', icon: 'flask' as const, meta: repo.counts.tests.toLocaleString() + ' files' },
  ]

  return (
    <>
      <PageHeader
        eyebrow="Next.js repository cockpit"
        title="Everything in the framework, organized as a product."
        description="Next Studio turns the monorepo into a browsable control center for framework internals, packages, agent skills, tests, benchmarks, docs, examples and developer workflows."
        action={<div className="flex flex-wrap items-center gap-2"><Chip tone="accent">v{repo.nextVersion}</Chip><Chip>{repo.packageManager}</Chip><Chip>Node {repo.nodeEngine}</Chip></div>}
      />

      <GlassPanel strong className="relative mb-5 overflow-hidden p-6 sm:p-8 xl:p-10">
        <div className="pointer-events-none absolute -right-12 -top-20 h-72 w-72 rounded-full bg-[rgba(171,125,165,.16)] blur-3xl" />
        <div className="relative grid gap-8 xl:grid-cols-[1.25fr_.75fr] xl:items-center">
          <div>
            <div className="mb-5 flex items-center gap-4">
              <span className="brand-mark-shell h-16 w-16 rounded-[20px]">
                <span className="brand-mark-glyph h-14 w-10" aria-hidden="true" />
              </span>
              <div>
                <div className="text-[12px] font-semibold tracking-[0.2em] text-[var(--accent-strong)]">NEXT STUDIO</div>
                <div className="mt-1 text-sm text-[var(--text-tertiary)]">Framework Control Center</div>
              </div>
            </div>
            <h2 className="max-w-3xl text-balance text-2xl font-semibold tracking-[-0.04em] text-[var(--text-primary)] sm:text-3xl">
              A calmer way to understand a 49k-file framework repository.
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--text-secondary)]">
              The dashboard is generated from the repository itself at build time, so package lists, skills, scripts and source areas stay aligned with the branch you build.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              <a href="/framework" className="inline-flex h-10 items-center gap-2 rounded-xl bg-[var(--brand-900)] px-4 text-xs font-semibold text-white shadow-lg shadow-[rgba(40,10,48,.16)]">
                Explore framework
                <Icon name="chevron" className="h-3.5 w-3.5" />
              </a>
              <a href="/repository" className="inline-flex h-10 items-center gap-2 rounded-xl border border-[var(--border-default)] bg-[var(--surface)] px-4 text-xs font-semibold text-[var(--text-primary)]">
                Repository map
              </a>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              ['Packages', repo.counts.packages],
              ['Skills', repo.counts.skills],
              ['Bench labs', repo.counts.benchmarks],
              ['Rust crates', repo.counts.rustCrates],
            ].map(([label, value]) => (
              <div key={String(label)} className="rounded-[20px] border border-[var(--border-subtle)] bg-[var(--surface-soft)] p-4 sm:p-5">
                <div className="text-2xl font-semibold tracking-[-0.04em] text-[var(--text-primary)]">{value}</div>
                <div className="mt-1 text-xs text-[var(--text-tertiary)]">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </GlassPanel>

      <div className="mb-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Workspace packages" value={repo.counts.packages} detail="packages/* manifests discovered" icon="package" />
        <MetricCard label="Framework modules" value={repo.counts.frameworkModules} detail="packages/next/src areas" icon="layers" />
        <MetricCard label="Agent skills" value={repo.counts.skills} detail=".agents + public skills" icon="sparkles" />
        <MetricCard label="Examples" value={repo.counts.examples} detail="example applications indexed" icon="box" />
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.15fr_.85fr]">
        <GlassPanel className="p-5 sm:p-6">
          <SectionTitle title="Framework surfaces" description="Major product areas exposed as navigable views" icon="layers" />
          <div className="grid gap-3 sm:grid-cols-2">
            {pillars.map((pillar) => (
              <a key={pillar.title} href={pillar.href} className="group rounded-[20px] border border-[var(--border-subtle)] bg-[var(--surface-soft)] p-4 transition hover:-translate-y-0.5 hover:border-[var(--border-default)]">
                <div className="flex items-start justify-between gap-3">
                  <span className="metric-icon"><Icon name={pillar.icon} className="h-4 w-4" /></span>
                  <Chip>{pillar.meta}</Chip>
                </div>
                <h3 className="mt-5 text-sm font-semibold text-[var(--text-primary)]">{pillar.title}</h3>
                <p className="mt-1.5 text-xs leading-5 text-[var(--text-secondary)]">{pillar.description}</p>
                <div className="mt-4 flex items-center gap-1.5 text-[11px] font-semibold text-[var(--accent-strong)]">
                  Open surface <Icon name="chevron" className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                </div>
              </a>
            ))}
          </div>
        </GlassPanel>

        <GlassPanel className="p-5 sm:p-6">
          <SectionTitle title="Fast lane" description="Frequently used repository commands" icon="terminal" />
          <CommandList commands={quickCommands} />
        </GlassPanel>
      </div>

      <GlassPanel className="mt-5 p-5 sm:p-6">
        <SectionTitle title="Build journey" description="The high-level path from source to verified framework output" icon="activity" />
        <div className="grid gap-3 md:grid-cols-5">
          {[
            ['01', 'Source', 'TypeScript + Rust'],
            ['02', 'Compile', 'SWC + Turbopack'],
            ['03', 'Build', 'Next.js pipeline'],
            ['04', 'Verify', 'Jest + Playwright'],
            ['05', 'Ship', 'Packages + docs'],
          ].map(([step, title, detail], index) => (
            <div key={step} className="relative rounded-[18px] border border-[var(--border-subtle)] bg-[var(--surface-soft)] p-4">
              <div className="text-[10px] font-semibold tracking-[0.16em] text-[var(--accent-strong)]">{step}</div>
              <div className="mt-4 text-sm font-semibold text-[var(--text-primary)]">{title}</div>
              <div className="mt-1 text-xs text-[var(--text-tertiary)]">{detail}</div>
              {index < 4 ? <div className="absolute -right-2 top-1/2 hidden h-px w-4 bg-[var(--border-default)] md:block" /> : null}
            </div>
          ))}
        </div>
      </GlassPanel>
    </>
  )
}
