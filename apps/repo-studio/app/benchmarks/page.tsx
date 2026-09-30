import { CatalogGrid } from '@/components/catalog-grid'
import { Chip, GlassPanel, PageHeader, SectionTitle } from '@/components/ui'
import { getRepoSnapshot } from '@/lib/repo-data'

export const metadata = { title: 'Benchmarks' }

export default function BenchmarksPage() {
  const repo = getRepoSnapshot()

  return (
    <>
      <PageHeader
        eyebrow="Performance"
        title="Benchmark labs for the framework and its toolchain."
        description="Benchmark workspaces are discovered from bench/* and presented alongside the performance loop used to compare build, render and development behavior."
        action={<Chip tone="accent">{repo.counts.benchmarks} benchmark areas</Chip>}
      />

      <GlassPanel className="mb-6 p-5 sm:p-6">
        <SectionTitle title="Performance loop" description="A repeatable way to reason about regressions" icon="gauge" />
        <div className="grid gap-3 md:grid-cols-4">
          {[
            ['01', 'Capture', 'Establish a clean baseline'],
            ['02', 'Change', 'Apply one isolated variable'],
            ['03', 'Measure', 'Run the same scenario'],
            ['04', 'Compare', 'Inspect delta and variance'],
          ].map(([step, title, detail]) => (
            <div key={step} className="rounded-[18px] border border-[var(--border-subtle)] bg-[var(--surface-soft)] p-4">
              <div className="text-[10px] font-semibold tracking-[0.16em] text-[var(--accent-strong)]">{step}</div>
              <div className="mt-4 text-sm font-semibold text-[var(--text-primary)]">{title}</div>
              <div className="mt-1 text-xs text-[var(--text-tertiary)]">{detail}</div>
            </div>
          ))}
        </div>
      </GlassPanel>

      <SectionTitle title="Benchmark catalog" description="Generated from bench/*" icon="gauge" />
      <CatalogGrid items={repo.benchmarks} placeholder="Search benchmark workspaces" />
    </>
  )
}
