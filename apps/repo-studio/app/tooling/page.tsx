import { CatalogGrid } from '@/components/catalog-grid'
import { CommandList } from '@/components/command-list'
import { Chip, GlassPanel, PageHeader, SectionTitle } from '@/components/ui'
import { getRepoSnapshot } from '@/lib/repo-data'

export const metadata = { title: 'Toolchain' }

export default function ToolingPage() {
  const repo = getRepoSnapshot()
  const highlighted = repo.scripts
    .filter((item) => ['dev', 'build', 'build-all', 'lint', 'types', 'test-unit', 'storybook', 'eval'].includes(item.name))
    .map((item) => ({ label: item.name, command: item.subtitle }))

  return (
    <>
      <PageHeader
        eyebrow="Toolchain"
        title="Commands, compilers and developer workflows."
        description="The repository script surface is indexed from package.json and paired with the major build systems used across JavaScript and Rust."
        action={<Chip tone="accent">{repo.counts.scripts} scripts</Chip>}
      />

      <div className="mb-5 grid gap-5 xl:grid-cols-[.8fr_1.2fr]">
        <GlassPanel className="p-5 sm:p-6">
          <SectionTitle title="Core systems" description="Primary engineering tools in the monorepo" icon="cpu" />
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              ['Turbopack', 'Rust bundler', 'turbopack/'],
              ['SWC', 'Native transforms', 'crates/'],
              ['Rspack', 'Alternative bundler', 'rspack/'],
              ['Turbo', 'Task orchestration', 'turbo.json'],
              ['Playwright', 'Browser verification', 'test/'],
              ['Jest', 'Unit + integration', 'jest.config.js'],
            ].map(([name, type, path]) => (
              <div key={name} className="rounded-[18px] border border-[var(--border-subtle)] bg-[var(--surface-soft)] p-4">
                <div className="text-sm font-semibold text-[var(--text-primary)]">{name}</div>
                <div className="mt-1 text-xs text-[var(--text-secondary)]">{type}</div>
                <code className="mt-4 block text-[10px] text-[var(--text-tertiary)]">{path}</code>
              </div>
            ))}
          </div>
        </GlassPanel>

        <GlassPanel className="p-5 sm:p-6">
          <SectionTitle title="Highlighted commands" description="Copy-ready entry points" icon="terminal" />
          <CommandList commands={highlighted} />
        </GlassPanel>
      </div>

      <SectionTitle title="Complete script catalog" description="Generated from the root package.json" icon="code" />
      <CatalogGrid items={repo.scripts} placeholder="Search scripts and commands" />
    </>
  )
}
