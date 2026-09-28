import { ArrowLeft, FileText, FolderCode, TerminalSquare } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { AppShell } from '@/components/control-center/app-shell'
import { CommandBlock } from '@/components/control-center/copy-button'
import { ZipDownloadButton } from '@/components/control-center/zip-download-button'
import { GlassCard, Pill, SectionHeading } from '@/components/control-center/ui'
import { getSkillCatalog, getSkillDetail } from '@/lib/control-center-data'

export async function generateStaticParams() {
  const skills = await getSkillCatalog()
  return skills.map((skill) => ({ slug: skill.slug }))
}

export default async function SkillDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const skill = await getSkillDetail(slug)
  if (!skill) notFound()

  const sourcePath = skill.path
  const codexCommand =
    'mkdir -p .agents/skills && git clone --depth 1 --filter=blob:none --sparse https://github.com/vercel/next.js.git .nextjs-skill-source && cd .nextjs-skill-source && git sparse-checkout set ' +
    sourcePath +
    ' && cd .. && cp -R .nextjs-skill-source/' +
    sourcePath +
    ' .agents/skills/' +
    skill.slug

  const claudeCommand =
    'mkdir -p .claude/skills && cp -R .agents/skills/' +
    skill.slug +
    ' .claude/skills/' +
    skill.slug

  const hermesCommand =
    'mkdir -p ~/.hermes/skills/nextjs && cp -R .agents/skills/' +
    skill.slug +
    ' ~/.hermes/skills/nextjs/' +
    skill.slug

  return (
    <AppShell
      title={skill.name}
      titleAr={skill.name}
      subtitle={skill.description}
      subtitleAr={skill.description}
      eyebrow="Skill detail"
      eyebrowAr="تفاصيل المهارة"
    >
      <div className="mb-6 flex flex-wrap items-center gap-2">
        <Link
          href="/skills"
          className="inline-flex min-h-9 items-center gap-2 rounded-full bg-muted px-3 text-xs font-medium text-muted-foreground"
        >
          <ArrowLeft className="size-3.5" />
          Skills
        </Link>
        <Pill tone="violet">{skill.bundle}</Pill>
        <Pill>{skill.group}</Pill>
        <div className="ms-auto">
          <ZipDownloadButton files={skill.files} filename={skill.slug + '.zip'} label="Download skill ZIP" />
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.05fr_.95fr]">
        <GlassCard className="overflow-hidden">
          <div className="flex items-center gap-3 border-b border-border p-4">
            <FileText className="size-4 text-primary" />
            <p className="font-mono text-xs">{sourcePath}/SKILL.md</p>
          </div>
          <pre
            dir="ltr"
            className="max-h-[72vh] overflow-auto whitespace-pre-wrap break-words p-5 text-left font-mono text-[11px] leading-6 text-muted-foreground"
          >
            {skill.content}
          </pre>
        </GlassCard>

        <div className="space-y-4">
          <GlassCard className="p-5">
            <SectionHeading
              eyebrow="Install"
              title="Use this skill with multiple agents"
              description="Copy the command that matches the agent or download the ZIP and place the folder in the agent's skill directory."
            />
            <div className="space-y-3">
              <CommandBlock title="Codex / shared Agent Skills" command={codexCommand} />
              <CommandBlock title="Claude Code project skills" command={claudeCommand} />
              <CommandBlock title="Hermes user skills" command={hermesCommand} />
            </div>
          </GlassCard>

          <GlassCard className="p-5">
            <div className="flex items-center gap-3">
              <FolderCode className="size-4 text-primary" />
              <h3 className="font-semibold">Included files</h3>
            </div>
            <div className="mt-4 max-h-72 space-y-1 overflow-y-auto">
              {skill.files.map((file) => (
                <div
                  key={file.path}
                  className="flex items-center gap-2 rounded-[12px] bg-muted/55 px-3 py-2 font-mono text-[10px] text-muted-foreground"
                >
                  <TerminalSquare className="size-3 shrink-0" />
                  <span className="truncate">{file.path}</span>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </AppShell>
  )
}
