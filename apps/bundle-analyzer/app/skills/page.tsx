import { FolderCode, Sparkles } from 'lucide-react'
import { AppShell } from '@/components/control-center/app-shell'
import { GlassCard, Pill, SectionHeading } from '@/components/control-center/ui'
import { getSkillCatalog } from '@/lib/control-center-data'

export default async function SkillsPage() {
  const skills = await getSkillCatalog()
  const agentCount = skills.filter((skill) => skill.group === 'Agent skill').length
  const frameworkCount = skills.length - agentCount

  return (
    <AppShell
      title="Skills library"
      subtitle="Repository-native instructions that teach coding agents how to work on Next.js safely—from PR operations and runtime debugging to cache components and partial prefetching."
      eyebrow="Agent intelligence"
    >
      <div className="mb-7 grid gap-3 sm:grid-cols-3">
        <GlassCard className="p-5">
          <p className="text-xs text-muted-foreground">Total skills</p>
          <p className="mt-2 text-3xl font-semibold tracking-[-0.04em]">{skills.length}</p>
        </GlassCard>
        <GlassCard className="p-5">
          <p className="text-xs text-muted-foreground">Repository skills</p>
          <p className="mt-2 text-3xl font-semibold tracking-[-0.04em]">{agentCount}</p>
        </GlassCard>
        <GlassCard className="p-5">
          <p className="text-xs text-muted-foreground">Framework skills</p>
          <p className="mt-2 text-3xl font-semibold tracking-[-0.04em]">{frameworkCount}</p>
        </GlassCard>
      </div>

      <SectionHeading
        eyebrow="Catalog"
        title="Available agent workflows"
        description="Each card maps to a real skill directory in the repository."
      />

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {skills.map((skill) => (
          <GlassCard key={skill.path} className="group p-5">
            <div className="flex items-start justify-between gap-3">
              <span className="flex size-10 items-center justify-center rounded-[15px] bg-primary/10 text-primary">
                <Sparkles className="size-4.5" />
              </span>
              <Pill tone={skill.group === 'Framework skill' ? 'violet' : 'default'}>
                {skill.group}
              </Pill>
            </div>
            <h3 className="mt-5 font-semibold tracking-[-0.02em]">{skill.name}</h3>
            <p className="mt-2 min-h-12 text-sm leading-6 text-muted-foreground">
              {skill.description}
            </p>
            <div className="mt-5 flex items-center gap-2 rounded-[14px] bg-muted/70 px-3 py-2 font-mono text-[10px] text-muted-foreground">
              <FolderCode className="size-3.5 shrink-0" />
              <span className="truncate">{skill.path}</span>
            </div>
          </GlassCard>
        ))}
      </div>
    </AppShell>
  )
}
