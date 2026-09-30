import { CatalogGrid } from '@/components/catalog-grid'
import { Chip, GlassPanel, PageHeader, SectionTitle } from '@/components/ui'
import { getRepoSnapshot } from '@/lib/repo-data'

export const metadata = { title: 'Automation' }

export default function AutomationPage() {
  const repo = getRepoSnapshot()
  const workflowCount = repo.automation.filter((item) => item.meta === 'workflow').length
  const actionCount = repo.automation.filter((item) => item.meta === 'local action').length

  return (
    <>
      <PageHeader
        eyebrow="Automation"
        title="CI, release, triage and maintenance in one map."
        description="GitHub workflows and local reusable Actions are indexed directly from .github so the automation layer is visible beside the source it protects."
        action={<div className="flex gap-2"><Chip tone="accent">{workflowCount} workflows</Chip><Chip>{actionCount} local actions</Chip></div>}
      />

      <div className="mb-6 grid gap-4 md:grid-cols-3">
        {[
          ['Quality gates', 'Build, lint, test and integration verification across framework modes.'],
          ['Release system', 'Canary, stable, backport, preview tarball and package publication flows.'],
          ['Repository ops', 'Triage, labeling, dependency refreshes and scheduled maintenance.'],
        ].map(([title, description]) => (
          <GlassPanel key={title} className="p-5 sm:p-6">
            <SectionTitle title={title} icon="branch" />
            <p className="text-sm leading-6 text-[var(--text-secondary)]">{description}</p>
          </GlassPanel>
        ))}
      </div>

      <SectionTitle title="Automation catalog" description="Generated from .github/workflows and .github/actions" icon="branch" />
      <CatalogGrid items={repo.automation} placeholder="Search workflows and local actions" />
    </>
  )
}
