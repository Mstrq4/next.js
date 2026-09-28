import { CatalogGrid } from '@/components/catalog-grid'
import { Chip, GlassPanel, PageHeader, SectionTitle } from '@/components/ui'
import { getRepoSnapshot } from '@/lib/repo-data'

export const metadata = { title: 'Test Lab' }

export default function TestingPage() {
  const repo = getRepoSnapshot()
  const matrix = [
    ['Development', 'pnpm test-dev-turbo', 'pnpm test-dev-webpack', 'pnpm test-dev-rspack'],
    ['Production', 'pnpm test-start-turbo', 'pnpm test-start-webpack', 'pnpm test-start-rspack'],
    ['Deploy', 'pnpm test-deploy-turbo', 'pnpm test-deploy-webpack', '—'],
  ]

  return (
    <>
      <PageHeader
        eyebrow="Quality system"
        title="One framework, several runtime matrices."
        description="Next.js validates behavior across development, production and deployment modes with dedicated Turbopack, Webpack and Rspack paths."
        action={<Chip tone="accent">{repo.counts.tests.toLocaleString()} indexed test files</Chip>}
      />

      <GlassPanel className="mb-6 overflow-hidden p-5 sm:p-6">
        <SectionTitle title="Bundler test matrix" description="Primary mode-specific commands from package.json" icon="flask" />
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] border-separate border-spacing-y-2 text-left text-xs">
            <thead className="text-[10px] uppercase tracking-[0.12em] text-[var(--text-tertiary)]">
              <tr><th className="px-3 py-2">Mode</th><th className="px-3 py-2">Turbopack</th><th className="px-3 py-2">Webpack</th><th className="px-3 py-2">Rspack</th></tr>
            </thead>
            <tbody>
              {matrix.map((row) => (
                <tr key={row[0]} className="bg-[var(--surface-soft)] text-[var(--text-secondary)]">
                  {row.map((cell, index) => <td key={cell} className={'px-3 py-3 ' + (index === 0 ? 'rounded-l-xl font-semibold text-[var(--text-primary)]' : index === 3 ? 'rounded-r-xl' : '')}><code>{cell}</code></td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassPanel>

      <SectionTitle title="Test suite catalog" description="Top-level test areas with recursive file counts" icon="file" />
      <CatalogGrid items={repo.tests} placeholder="Search test suites" />
    </>
  )
}
