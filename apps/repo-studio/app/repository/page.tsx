import { CatalogGrid } from '@/components/catalog-grid'
import { Chip, GlassPanel, PageHeader, SectionTitle } from '@/components/ui'
import { getRepoSnapshot } from '@/lib/repo-data'

export const metadata = { title: 'Repository Map' }

export default function RepositoryPage() {
  const repo = getRepoSnapshot()

  return (
    <>
      <PageHeader
        eyebrow="Monorepo anatomy"
        title="A map of the codebase from JavaScript to Rust."
        description="Understand the physical repository layout, native crates, Turbopack internals and the high-level areas that make up the framework."
        action={<Chip tone="accent">{repo.counts.rustCrates} Rust crate areas</Chip>}
      />

      <GlassPanel className="mb-6 p-5 sm:p-6">
        <SectionTitle title="Architecture bands" description="How the repository is organized conceptually" icon="git" />
        <div className="grid gap-3 lg:grid-cols-4">
          {[
            ['Product API', 'packages/next', 'Framework package, routing, rendering and build output'],
            ['Compiler', 'crates', 'SWC transforms and native Next.js bindings'],
            ['Bundler', 'turbopack', 'Rust incremental graph, tasks and bundling'],
            ['Verification', 'test + bench', 'Behavior suites, deployment checks and performance labs'],
          ].map(([title, path, description]) => (
            <div key={title} className="rounded-[20px] border border-[var(--border-subtle)] bg-[var(--surface-soft)] p-4">
              <div className="text-sm font-semibold text-[var(--text-primary)]">{title}</div>
              <code className="mt-1.5 block text-[10px] text-[var(--accent-strong)]">{path}</code>
              <p className="mt-4 text-xs leading-5 text-[var(--text-secondary)]">{description}</p>
            </div>
          ))}
        </div>
      </GlassPanel>

      <SectionTitle title="Repository areas" description="Recursive counts exclude generated output and node_modules" icon="layers" />
      <CatalogGrid items={repo.repoAreas} placeholder="Search repository areas" />

      <div className="mt-9 grid gap-7 xl:grid-cols-2">
        <div>
          <SectionTitle title="Next.js Rust crates" description="crates/*" icon="cpu" />
          <CatalogGrid items={repo.rustCrates} placeholder="Search Next.js Rust crates" />
        </div>
        <div>
          <SectionTitle title="Turbopack crates" description="turbopack/crates/*" icon="cpu" />
          <CatalogGrid items={repo.turbopackCrates} placeholder="Search Turbopack crates" />
        </div>
      </div>
    </>
  )
}
