import { CatalogGrid } from '@/components/catalog-grid'
import { Chip, GlassPanel, PageHeader, SectionTitle } from '@/components/ui'
import { getRepoSnapshot } from '@/lib/repo-data'

export const metadata = { title: 'Docs & Examples' }

export default function DocsPage() {
  const repo = getRepoSnapshot()
  return (
    <>
      <PageHeader
        eyebrow="Learning surfaces"
        title="Documentation and examples, indexed together."
        description="Use the documentation tree to understand concepts, then move directly into example applications that demonstrate framework behavior."
        action={<div className="flex gap-2"><Chip>{repo.counts.docs} doc areas</Chip><Chip tone="accent">{repo.counts.examples} examples</Chip></div>}
      />

      <div className="mb-7 grid gap-4 sm:grid-cols-2">
        <GlassPanel className="p-5 sm:p-6">
          <SectionTitle title="Documentation" description="Guides, references and architecture material" icon="book" />
          <div className="text-4xl font-semibold tracking-[-0.05em]">{repo.counts.docs}</div>
          <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">Top-level documentation sections discovered from docs/.</p>
        </GlassPanel>
        <GlassPanel className="p-5 sm:p-6">
          <SectionTitle title="Examples" description="Runnable Next.js application patterns" icon="box" />
          <div className="text-4xl font-semibold tracking-[-0.05em]">{repo.counts.examples}</div>
          <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">Example directories discovered from examples/.</p>
        </GlassPanel>
      </div>

      <SectionTitle title="Documentation areas" icon="book" />
      <CatalogGrid items={repo.docs} placeholder="Search documentation areas" />

      <div className="mt-9">
        <SectionTitle title="Example applications" icon="box" />
        <CatalogGrid items={repo.examples} placeholder="Search examples" />
      </div>
    </>
  )
}
