import { CatalogGrid } from '@/components/catalog-grid'
import { Chip, GlassPanel, PageHeader, SectionTitle } from '@/components/ui'
import { getRepoSnapshot } from '@/lib/repo-data'

export const metadata = { title: 'Agents & Skills' }

export default function SkillsPage() {
  const repo = getRepoSnapshot()

  return (
    <>
      <PageHeader
        eyebrow="Agent intelligence"
        title="The repository already contains an AI engineering operating system."
        description="Browse internal .agents workflows and public Next.js skills from one surface. Descriptions are extracted directly from SKILL.md frontmatter."
        action={<Chip tone="accent">{repo.counts.skills} skills</Chip>}
      />

      <div className="mb-6 grid gap-4 md:grid-cols-2">
        <GlassPanel className="p-5 sm:p-6">
          <SectionTitle title=".agents/skills" description="Repository engineering workflows" icon="sparkles" />
          <div className="text-4xl font-semibold tracking-[-0.05em] text-[var(--text-primary)]">{repo.agentSkills.length}</div>
          <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">PR operations, runtime debugging, release tests, docs automation, benchmark tooling and framework maintenance.</p>
        </GlassPanel>
        <GlassPanel className="p-5 sm:p-6">
          <SectionTitle title="skills/" description="Public framework workflows" icon="layers" />
          <div className="text-4xl font-semibold tracking-[-0.05em] text-[var(--text-primary)]">{repo.publicSkills.length}</div>
          <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">Cache Components, development loops, Partial Prefetching and other reusable Next.js agent guidance.</p>
        </GlassPanel>
      </div>

      <SectionTitle title="Repository agent skills" description="Internal workflows used to work on Next.js itself" icon="sparkles" />
      <CatalogGrid items={repo.agentSkills} placeholder="Search repository agent skills" />

      <div className="mt-9">
        <SectionTitle title="Public Next.js skills" description="Framework workflows under skills/" icon="layers" />
        <CatalogGrid items={repo.publicSkills} placeholder="Search public Next.js skills" />
      </div>
    </>
  )
}
