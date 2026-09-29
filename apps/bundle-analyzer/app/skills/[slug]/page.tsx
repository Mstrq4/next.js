import {
  ArrowLeft,
  ExternalLink,
  FileText,
  FolderCode,
  TerminalSquare,
} from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { AppShell } from '@/components/control-center/app-shell'
import { CommandBlock } from '@/components/control-center/copy-button'
import { Localized } from '@/components/control-center/i18n-provider'
import { ZipDownloadButton } from '@/components/control-center/zip-download-button'
import { GlassCard, Pill } from '@/components/control-center/ui'
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
  const sourceUrl =
    'https://github.com/vercel/next.js/tree/canary/' + sourcePath

  const sharedCommand =
    'mkdir -p .agents/skills && tmp="$(mktemp -d)" && git clone --depth 1 --filter=blob:none --sparse https://github.com/vercel/next.js.git "$tmp/next.js" && git -C "$tmp/next.js" sparse-checkout set ' +
    sourcePath +
    ' && cp -R "$tmp/next.js/' +
    sourcePath +
    '" .agents/skills/' +
    skill.slug +
    ' && rm -rf "$tmp"'

  const claudeCommand =
    'mkdir -p .claude/skills && cp -R .agents/skills/' +
    skill.slug +
    ' .claude/skills/' +
    skill.slug

  const codexCommand =
    'mkdir -p ~/.codex/skills && cp -R .agents/skills/' +
    skill.slug +
    ' ~/.codex/skills/' +
    skill.slug

  const hermesCommand =
    'mkdir -p ~/.hermes/skills/nextjs && cp -R .agents/skills/' +
    skill.slug +
    ' ~/.hermes/skills/nextjs/' +
    skill.slug

  const powershellCommand =
    '$src = Join-Path $env:TEMP ("nextjs-skill-" + [guid]::NewGuid()); git clone --depth 1 --filter=blob:none --sparse https://github.com/vercel/next.js.git $src; git -C $src sparse-checkout set "' +
    sourcePath +
    '"; New-Item -ItemType Directory -Force -Path ".agents\\skills" | Out-Null; Copy-Item -Recurse -Force (Join-Path $src "' +
    sourcePath +
    '") ".agents\\skills\\' +
    skill.slug +
    '"; Remove-Item -Recurse -Force $src'

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
          <ArrowLeft className="size-3.5 rtl:rotate-180" />
          <Localized en="Skills" ar="المهارات" />
        </Link>
        <Pill tone="violet">{skill.bundle}</Pill>
        <Pill>{skill.group}</Pill>
        <a
          href={sourceUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex min-h-9 items-center gap-2 rounded-full border border-border bg-background/55 px-3 text-xs font-medium text-muted-foreground"
        >
          <ExternalLink className="size-3.5" />
          <Localized en="Open source" ar="فتح المصدر" />
        </a>
        <div className="ms-auto">
          <ZipDownloadButton
            files={skill.files}
            filename={skill.slug + '.zip'}
            label="Download skill ZIP"
          />
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
            <Localized
              as="h3"
              en="Install this skill"
              ar="تثبيت هذه المهارة"
              className="font-semibold"
            />
            <Localized
              as="p"
              en="Install to the shared Agent Skills directory first, then expose the same skill to the agent-specific library you use."
              ar="ثبّت المهارة أولًا داخل مجلد Agent Skills المشترك، ثم انقلها إلى مكتبة الوكيل الذي تستخدمه."
              className="mt-2 text-sm leading-6 text-muted-foreground"
            />
            <div className="mt-4 space-y-3">
              <CommandBlock title="Bash · shared project skill" command={sharedCommand} />
              <CommandBlock title="PowerShell · shared project skill" command={powershellCommand} />
              <CommandBlock title="Claude Code project skills" command={claudeCommand} />
              <CommandBlock title="Codex user skills" command={codexCommand} />
              <CommandBlock title="Hermes user skills" command={hermesCommand} />
            </div>
          </GlassCard>

          <GlassCard className="p-5">
            <div className="flex items-center gap-3">
              <FolderCode className="size-4 text-primary" />
              <Localized as="h3" en="Included files" ar="الملفات المضمنة" className="font-semibold" />
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
