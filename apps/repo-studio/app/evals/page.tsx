import { CatalogGrid } from '@/components/catalog-grid'
import { Chip, GlassPanel, PageHeader, SectionTitle } from '@/components/ui'
import { getRepoSnapshot } from '@/lib/repo-data'

export const metadata = { title: 'Evals' }

export default function EvalsPage() {
  const repo = getRepoSnapshot()

  return (
    <>
      <PageHeader
        eyebrow="Agent evaluation"
        title="Evaluation suites for AI-assisted framework work."
        description="The eval system exercises agent behavior against curated Next.js tasks, including upgrade scenarios and repository-specific engineering workflows."
        action={<Chip tone="accent">{repo.counts.evals} eval suites</Chip>}
      />

      <GlassPanel className="mb-6 p-5 sm:p-6">
        <SectionTitle title="Evaluation pipeline" description="The repository exposes a dedicated eval runner and scenario configuration." icon="activity" />
        <div className="grid gap-3 md:grid-cols-4">
          {[
            ['Scenario', 'Select the repository task and expected behavior.'],
            ['Agent', 'Run the configured coding agent against the task.'],
            ['Judge', 'Score outcomes and inspect evidence.'],
            ['Iterate', 'Use failures to improve Skills and framework guidance.'],
          ].map(([title, description], index) => (
            <div key={title} className="rounded-[18px] border border-[var(--border-subtle)] bg-[var(--surface-soft)] p-4">
              <div className="text-[10px] font-semibold tracking-[0.16em] text-[var(--accent-strong)]">0{index + 1}</div>
              <div className="mt-4 text-sm font-semibold text-[var(--text-primary)]">{title}</div>
              <p className="mt-1.5 text-xs leading-5 text-[var(--text-secondary)]">{description}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <Chip>pnpm eval</Chip>
          <Chip>pnpm eval:upgrade</Chip>
          <Chip>evals/eval.config.json</Chip>
        </div>
      </GlassPanel>

      <SectionTitle title="Eval suite catalog" description="Generated from evals/evals" icon="activity" />
      <CatalogGrid items={repo.evals} placeholder="Search evaluation suites" />
    </>
  )
}
