'use client'

import {
  Archive,
  Bot,
  CheckCircle2,
  Download,
  ExternalLink,
  FolderCode,
  Laptop2,
  Terminal,
} from 'lucide-react'
import { useState } from 'react'
import type { SkillCatalogItem } from '@/lib/control-center-data'
import { downloadRepoFilesZip } from '@/lib/github-zip'
import { CommandBox } from './copy-button'
import { useLocale } from './locale-provider'
import { GlassCard, Pill, SectionHeading } from './ui'

type SkillDetail = SkillCatalogItem & { sourceContent: string }

export function SkillInstallPanel({ skill }: { skill: SkillDetail }) {
  const { text } = useLocale()
  const [busy, setBusy] = useState(false)

  const repoUrl = `https://github.com/Mstrq4/next.js/tree/canary/${skill.path}`
  const rawUrl = `https://raw.githubusercontent.com/Mstrq4/next.js/canary/${skill.mainFile}`

  const codexPrompt =
    `$skill-installer Install the skill from ${repoUrl}`
  const codexScript =
    `python ~/.codex/skills/.system/skill-installer/scripts/install-skill-from-github.py --repo Mstrq4/next.js --ref canary --path ${skill.path}`
  const hermesCommand =
    `hermes skills install ${rawUrl} --name ${skill.name}`

  const powershellSource = skill.path.replaceAll('/', '\\')
  const claudeDestination = `$HOME\\.claude\\skills\\${skill.name}`
  const cursorDestination = `$HOME\\.cursor\\skills\\${skill.name}`
  const claudePowerShell =
    `New-Item -ItemType Directory -Force "$HOME\\.claude\\skills" | Out-Null; Copy-Item -Recurse -Force "${powershellSource}" "${claudeDestination}"`
  const cursorPowerShell =
    `New-Item -ItemType Directory -Force "$HOME\\.cursor\\skills" | Out-Null; Copy-Item -Recurse -Force "${powershellSource}" "${cursorDestination}"`

  const download = async () => {
    try {
      setBusy(true)
      await downloadRepoFilesZip({
        filename: `${skill.name}.zip`,
        files: skill.files.map((path) => ({ path })),
      })
    } finally {
      setBusy(false)
    }
  }

  const agents = [
    {
      id: 'codex',
      name: 'Codex',
      icon: Terminal,
      detail: {
        en: 'Install through Codex’s built-in skill installer, or run the installer helper directly.',
        ar: 'ثبّت عبر skill-installer المدمج في Codex أو شغّل مساعد التثبيت مباشرة.',
      },
      commands: [
        { label: { en: 'Codex prompt', ar: 'أمر Codex' }, command: codexPrompt },
        { label: { en: 'Installer helper', ar: 'مساعد التثبيت' }, command: codexScript },
      ],
    },
    {
      id: 'claude',
      name: 'Claude Code',
      icon: Bot,
      detail: {
        en: 'Inside this repository Claude discovers the shared skill surface. Use this command only for a personal/global copy.',
        ar: 'داخل هذا المستودع يكتشف Claude سطح المهارات المشترك تلقائيًا. استخدم الأمر التالي فقط للنسخة الشخصية العامة.',
      },
      commands: [
        { label: { en: 'PowerShell global install', ar: 'تثبيت عام عبر PowerShell' }, command: claudePowerShell },
      ],
    },
    {
      id: 'cursor',
      name: 'Cursor',
      icon: Laptop2,
      detail: {
        en: 'Cursor auto-discovers .agents/skills in the cloned repository. Use the global path only when you want the skill available everywhere.',
        ar: 'يكتشف Cursor تلقائيًا .agents/skills داخل المستودع. استخدم المسار العام فقط لجعل المهارة متاحة في كل المشاريع.',
      },
      commands: [
        { label: { en: 'PowerShell global install', ar: 'تثبيت عام عبر PowerShell' }, command: cursorPowerShell },
      ],
    },
    {
      id: 'hermes',
      name: 'Hermes Agent',
      icon: CheckCircle2,
      detail: {
        en: 'Hermes can install a SKILL.md from an HTTPS URL into its local skills directory.',
        ar: 'يستطيع Hermes تثبيت SKILL.md مباشرة من رابط HTTPS إلى مجلد المهارات المحلي.',
      },
      commands: [
        { label: { en: 'Hermes CLI', ar: 'أمر Hermes' }, command: hermesCommand },
      ],
    },
  ]

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center gap-2">
        <Pill tone={skill.source === 'framework' ? 'violet' : 'default'}>
          {skill.source === 'framework'
            ? text({ en: 'Framework skill', ar: 'مهارة الإطار' })
            : text({ en: 'Repository skill', ar: 'مهارة المستودع' })}
        </Pill>
        <Pill>{skill.fileCount} {text({ en: 'files', ar: 'ملفات' })}</Pill>
        <span dir="ltr" className="rounded-full bg-muted px-2.5 py-1 font-mono text-[10px] text-muted-foreground">
          {skill.path}
        </span>
      </div>

      <GlassCard className="mb-7 p-5 sm:p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-3xl">
            <div className="flex size-11 items-center justify-center rounded-[16px] bg-primary/10 text-primary">
              <FolderCode className="size-5" />
            </div>
            <h2 className="mt-5 text-xl font-semibold sm:text-2xl">{skill.name}</h2>
            <p className="mt-2 text-sm leading-7 text-muted-foreground">
              {skill.description}
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-2">
            <button
              type="button"
              onClick={download}
              disabled={busy}
              className="inline-flex min-h-10 items-center gap-2 rounded-full bg-primary px-4 text-sm font-medium text-primary-foreground disabled:opacity-60"
            >
              <Download className="size-4" />
              {busy
                ? text({ en: 'Preparing…', ar: 'جارٍ التجهيز…' })
                : text({ en: 'Download ZIP', ar: 'تحميل ZIP' })}
            </button>
            <a
              href={repoUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-10 items-center gap-2 rounded-full border border-border bg-background/55 px-4 text-sm font-medium"
            >
              <ExternalLink className="size-4" />
              GitHub
            </a>
          </div>
        </div>
      </GlassCard>

      <SectionHeading
        eyebrow={{ en: 'Install anywhere', ar: 'التثبيت على الوكلاء' }}
        title={{ en: 'Agent-specific installation', ar: 'تثبيت مخصص لكل وكيل' }}
        description={{
          en: 'Choose the surface that matches your coding agent. Commands are copy-ready.',
          ar: 'اختر البيئة المطابقة لوكيلك. جميع الأوامر جاهزة للنسخ.',
        }}
      />

      <div className="grid gap-4 xl:grid-cols-2">
        {agents.map((agent) => {
          const Icon = agent.icon
          return (
            <GlassCard key={agent.id} className="p-5">
              <div className="flex items-start gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-[15px] bg-primary/10 text-primary">
                  <Icon className="size-4.5" />
                </span>
                <div>
                  <h3 className="font-semibold">{agent.name}</h3>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    {text(agent.detail)}
                  </p>
                </div>
              </div>
              <div className="mt-5 space-y-3">
                {agent.commands.map((item) => (
                  <CommandBox key={item.command} command={item.command} label={item.label} />
                ))}
              </div>
            </GlassCard>
          )
        })}
      </div>

      {skill.source === 'framework' ? (
        <GlassCard className="mt-4 p-5 sm:p-6">
          <div className="flex items-start gap-3">
            <Archive className="mt-0.5 size-5 text-primary" />
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold">
                {text({ en: 'Claude Code Next.js plugin bundle', ar: 'حزمة إضافة Next.js لـClaude Code' })}
              </h3>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                {text({
                  en: 'The repository includes .claude-plugin/marketplace.json, so the full official framework-skill set can be installed as one plugin.',
                  ar: 'يحتوي المستودع على .claude-plugin/marketplace.json، لذلك يمكن تثبيت مجموعة مهارات الإطار الرسمية كاملة كإضافة واحدة.',
                })}
              </p>
              <div className="mt-4 space-y-3">
                <CommandBox command="/plugin marketplace add Mstrq4/next.js" />
                <CommandBox command="/plugin install nextjs@nextjs" />
              </div>
            </div>
          </div>
        </GlassCard>
      ) : null}
    </div>
  )
}
