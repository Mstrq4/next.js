import { AppShell } from '@/components/control-center/app-shell'
import { AgentHub } from '@/components/control-center/agent-hub'
import { CommandBlock } from '@/components/control-center/copy-button'
import { GlassCard, SectionHeading } from '@/components/control-center/ui'
import { getAgentIntegrations, getSkillCatalog } from '@/lib/control-center-data'

export default async function AgentsPage() {
  const [agents, skills] = await Promise.all([getAgentIntegrations(), getSkillCatalog()])

  return (
    <AppShell
      title="Agent workspace"
      titleAr="مساحة عمل الوكلاء"
      subtitle="Understand every repository agent surface, copy launch and installation commands, and download configuration bundles for Claude Code, Codex, Hermes, Cursor and Conductor."
      subtitleAr="افهم كل أسطح الوكلاء داخل المستودع وانسخ أوامر التشغيل والتثبيت ونزّل حزم الإعداد لـ Claude Code وCodex وHermes وCursor وConductor."
      eyebrow="Agent operations"
      eyebrowAr="عمليات الوكلاء"
    >
      <div className="mb-7 grid gap-3 md:grid-cols-3">
        <GlassCard className="p-5">
          <p className="text-xs text-muted-foreground">Agent integrations</p>
          <p className="mt-2 text-3xl font-semibold tracking-[-0.04em]">{agents.length}</p>
        </GlassCard>
        <GlassCard className="p-5">
          <p className="text-xs text-muted-foreground">Shared skills</p>
          <p className="mt-2 text-3xl font-semibold tracking-[-0.04em]">{skills.length}</p>
        </GlassCard>
        <GlassCard className="p-5">
          <p className="text-xs text-muted-foreground">Canonical skills path</p>
          <p className="mt-3 truncate font-mono text-sm text-primary">.agents/skills</p>
        </GlassCard>
      </div>

      <div className="mb-8 grid gap-4 xl:grid-cols-[1fr_.85fr]">
        <GlassCard className="p-5 sm:p-6">
          <SectionHeading
            eyebrow="Enter the repository"
            title="Give any coding agent repository context"
            description="Clone canary, enter the checkout, then start the agent from the repository root so local guidance and skills can be discovered."
          />
          <CommandBlock command="git clone --branch canary https://github.com/vercel/next.js.git && cd next.js" />
        </GlassCard>
        <GlassCard className="p-5 sm:p-6">
          <SectionHeading
            eyebrow="Shared convention"
            title=".agents/skills"
            description="The repository keeps deep workflows in a cross-tool skill directory. Claude bridges to it and Hermes recognizes it as a project-local skills location."
          />
          <CommandBlock command="find .agents/skills -maxdepth 2 -name SKILL.md -print" />
        </GlassCard>
      </div>

      <AgentHub agents={agents} />
    </AppShell>
  )
}
