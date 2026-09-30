import { CatalogGrid } from '@/components/catalog-grid'
import { Chip, GlassPanel, PageHeader, SectionTitle } from '@/components/ui'
import { getRepoSnapshot } from '@/lib/repo-data'

export const metadata = { title: 'Framework' }

export default function FrameworkPage() {
  const repo = getRepoSnapshot()
  const layers = [
    ['CLI', 'packages/next/src/cli', 'Entry commands for dev, build, start and auxiliary tooling.'],
    ['Build', 'packages/next/src/build', 'Compilation, traces, static generation and production output.'],
    ['Server', 'packages/next/src/server', 'Routing, rendering, request handling and development server internals.'],
    ['Client', 'packages/next/src/client', 'Browser runtime, navigation, hydration and client integrations.'],
    ['Shared', 'packages/next/src/shared', 'Runtime utilities used across server and client boundaries.'],
    ['Telemetry', 'packages/next/src/telemetry', 'Framework usage diagnostics and event plumbing.'],
  ]

  return (
    <>
      <PageHeader
        eyebrow="Framework"
        title="The Next.js runtime as a navigable system."
        description="Explore source modules, runtime boundaries and the main compilation surfaces without digging through the tree manually."
        action={<Chip tone="accent">{repo.counts.frameworkModules} source modules</Chip>}
      />

      <div className="mb-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {layers.map(([title, path, description]) => (
          <GlassPanel key={title} className="p-5">
            <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--accent-strong)]">{title}</div>
            <p className="mt-4 text-sm leading-6 text-[var(--text-secondary)]">{description}</p>
            <code className="mt-5 block truncate text-[11px] text-[var(--text-tertiary)]">{path}</code>
          </GlassPanel>
        ))}
      </div>

      <GlassPanel className="mb-5 p-5 sm:p-6">
        <SectionTitle title="Bundler constellation" description="Three compilation paths coexist for development, compatibility and experimentation." icon="cpu" />
        <div className="grid gap-3 md:grid-cols-3">
          {[
            ['Turbopack', 'Rust-first incremental bundler and the default Next.js development/build path.'],
            ['Rspack', 'Compatibility and ecosystem validation path used by dedicated test modes.'],
            ['Webpack', 'Established compatibility surface with its own development and production suites.'],
          ].map(([name, text]) => (
            <div key={name} className="rounded-[20px] border border-[var(--border-subtle)] bg-[var(--surface-soft)] p-4">
              <div className="text-sm font-semibold text-[var(--text-primary)]">{name}</div>
              <p className="mt-1.5 text-xs leading-5 text-[var(--text-secondary)]">{text}</p>
            </div>
          ))}
        </div>
      </GlassPanel>

      <SectionTitle title="Source module catalog" description="Generated from packages/next/src at build time" icon="layers" />
      <CatalogGrid items={repo.frameworkModules} placeholder="Search framework modules" />

      <div className="mt-9">
        <SectionTitle title="Framework error catalog" description="Error guidance and diagnostic messages under errors/" icon="activity" />
        <CatalogGrid items={repo.errors} placeholder="Search framework errors" />
      </div>
    </>
  )
}
