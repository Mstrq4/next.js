import { CatalogGrid } from '@/components/catalog-grid'
import { Chip, PageHeader } from '@/components/ui'
import { getRepoSnapshot } from '@/lib/repo-data'

export const metadata = { title: 'Packages' }

export default function PackagesPage() {
  const repo = getRepoSnapshot()
  return (
    <>
      <PageHeader
        eyebrow="Workspace"
        title="Packages that make up the Next.js ecosystem."
        description="Browse package manifests from packages/*, including the core framework, ESLint tooling, font infrastructure, SWC bindings and supporting integrations."
        action={<Chip tone="accent">{repo.counts.packages} packages</Chip>}
      />
      <CatalogGrid items={repo.packages} placeholder="Search workspace packages" />
    </>
  )
}
