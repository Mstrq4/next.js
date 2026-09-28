'use client'

import {
  Archive,
  Bot,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Download,
  GitBranch,
  Laptop2,
  Network,
  Terminal,
  Workflow,
} from 'lucide-react'
import { useMemo, useState } from 'react'
import { downloadRepoFilesZip } from '@/lib/github-zip'
import { CommandBox } from './copy-button'
import { useLocale } from './locale-provider'
import { GlassCard, Pill } from './ui'

type AgentProfile = {
  id: string
  name: string
  icon: typeof Bot
  status: { en: string; ar: string }
  description: { en: string; ar: string }
  install: Array<{ label: { en: string; ar: string }; command: string }>
  enter: string[]
  paths: string[]
  notes: Array<{ en: string; ar: string }>
}

export function AgentHubClient({
  agentFiles,
  allSkillFiles,
}: {
  agentFiles: string[]
  allSkillFiles: string[]
}) {
  const { text } = useLocale()
  const [open, setOpen] = useState<string>('codex')
  const [busy, setBusy] = useState<string | null>(null)

  const clone = 'git clone --branch canary https://github.com/Mstrq4/next.js.git && cd next.js'

  const agents: AgentProfile[] = [
    {
      id: 'codex',
      name: 'OpenAI Codex',
      icon: Terminal,
      status: { en: 'AGENTS.md + Agent Skills', ar: 'AGENTS.md + مهارات الوكلاء' },
      description: {
        en: 'Codex can enter the repository with AGENTS.md as the durable project guide and install individual SKILL.md workflows into $CODEX_HOME/skills.',
        ar: 'يستطيع Codex الدخول إلى المستودع مع AGENTS.md كدليل دائم للمشروع وتثبيت مهارات SKILL.md منفردة داخل $CODEX_HOME/skills.',
      },
      install: [
        {
          label: { en: 'Windows installer', ar: 'تثبيت Windows' },
          command: 'powershell -ExecutionPolicy ByPass -c "irm https://chatgpt.com/codex/install.ps1 | iex"',
        },
        {
          label: { en: 'npm alternative', ar: 'بديل npm' },
          command: 'npm install -g @openai/codex',
        },
      ],
      enter: [clone, 'codex'],
      paths: ['AGENTS.md', '.github/AGENTS.md'],
      notes: [
        {
          en: 'Use the Skills page to install one workflow, a category, or the complete skills bundle.',
          ar: 'استخدم صفحة المهارات لتثبيت Workflow واحد أو فئة أو حزمة المهارات الكاملة.',
        },
      ],
    },
    {
      id: 'claude',
      name: 'Claude Code',
      icon: Bot,
      status: { en: 'Native repo integration', ar: 'تكامل أصلي مع المستودع' },
      description: {
        en: 'This repository exposes .agents/skills through .claude/skills and also contains a Claude plugin marketplace for the official framework skills.',
        ar: 'يكشف هذا المستودع .agents/skills إلى Claude عبر .claude/skills ويحتوي كذلك على Claude plugin marketplace لمهارات الإطار الرسمية.',
      },
      install: [
        {
          label: { en: 'Install Claude Code', ar: 'تثبيت Claude Code' },
          command: 'npm install -g @anthropic-ai/claude-code',
        },
        {
          label: { en: 'Next.js plugin marketplace', ar: 'سوق إضافة Next.js' },
          command: '/plugin marketplace add Mstrq4/next.js',
        },
        {
          label: { en: 'Install plugin bundle', ar: 'تثبيت حزمة الإضافة' },
          command: '/plugin install nextjs@nextjs',
        },
      ],
      enter: [clone, 'claude'],
      paths: ['.claude/', '.claude-plugin/', '.agents/skills/'],
      notes: [
        {
          en: 'The project-level shared skill surface means cloning the repository is enough for repository skills.',
          ar: 'سطح المهارات المشترك على مستوى المشروع يعني أن استنساخ المستودع يكفي لمهارات المستودع.',
        },
      ],
    },
    {
      id: 'cursor',
      name: 'Cursor Agent',
      icon: Laptop2,
      status: { en: 'Auto-discovers .agents/skills', ar: 'يكتشف .agents/skills تلقائيًا' },
      description: {
        en: 'Cursor discovers .agents/skills project-wide and also understands .cursor/commands and worktree configuration.',
        ar: 'يكتشف Cursor مهارات .agents/skills على مستوى المشروع ويفهم كذلك .cursor/commands وإعدادات worktree.',
      },
      install: [
        {
          label: { en: 'Windows PowerShell', ar: 'Windows PowerShell' },
          command: "irm 'https://cursor.com/install?win32=true' | iex",
        },
        {
          label: { en: 'macOS / Linux / WSL', ar: 'macOS / Linux / WSL' },
          command: 'curl https://cursor.com/install -fsS | bash',
        },
      ],
      enter: [clone, 'agent'],
      paths: ['.cursor/', '.agents/skills/'],
      notes: [
        {
          en: 'No skill-copy step is required for the cloned project because Cursor scans .agents/skills automatically.',
          ar: 'لا تحتاج إلى نسخ المهارات بعد الاستنساخ لأن Cursor يفحص .agents/skills تلقائيًا.',
        },
      ],
    },
    {
      id: 'hermes',
      name: 'Hermes Agent',
      icon: CheckCircle2,
      status: { en: 'Agent Skills compatible', ar: 'متوافق مع Agent Skills' },
      description: {
        en: 'Hermes stores installed skills under ~/.hermes/skills and can install a public SKILL.md directly from HTTPS.',
        ar: 'يخزن Hermes المهارات داخل ~/.hermes/skills ويمكنه تثبيت SKILL.md عام مباشرة من HTTPS.',
      },
      install: [
        {
          label: { en: 'Windows PowerShell', ar: 'Windows PowerShell' },
          command: 'iex (irm https://hermes-agent.nousresearch.com/install.ps1)',
        },
        {
          label: { en: 'Linux / macOS / WSL2', ar: 'Linux / macOS / WSL2' },
          command: 'curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash',
        },
      ],
      enter: [clone, 'hermes'],
      paths: ['.agents/skills/'],
      notes: [
        {
          en: 'Open any skill detail page for its one-command Hermes installer.',
          ar: 'افتح صفحة أي مهارة للحصول على أمر تثبيت Hermes الخاص بها.',
        },
      ],
    },
    {
      id: 'conductor',
      name: 'Conductor',
      icon: Network,
      status: { en: 'Parallel Claude worktrees', ar: 'مساحات Claude متوازية' },
      description: {
        en: 'The repository includes Conductor setup and run scripts for isolated Claude Code worktrees and parallel feature development.',
        ar: 'يحتوي المستودع على سكربتات إعداد وتشغيل Conductor لمساحات Claude Code المعزولة والعمل المتوازي.',
      },
      install: [],
      enter: [
        'git worktree add ../next.js-worktrees/my-feature -b my-feature-branch canary',
        'cd ../next.js-worktrees/my-feature',
        './.conductor/scripts/setup.sh',
      ],
      paths: ['.conductor/'],
      notes: [
        {
          en: 'The repository guide recommends 3–4 concurrent agents to avoid resource and API pressure.',
          ar: 'يوصي دليل المستودع بـ3–4 وكلاء متزامنين لتجنب ضغط الموارد وواجهات API.',
        },
      ],
    },
  ]

  const integrationFiles = useMemo(
    () => ({
      codex: agentFiles.filter((file) => file === 'AGENTS.md' || file === '.github/AGENTS.md'),
      claude: agentFiles.filter((file) => file.startsWith('.claude') || file === '.agents/skills/README.md'),
      cursor: agentFiles.filter((file) => file.startsWith('.cursor') || file === '.agents/skills/README.md'),
      hermes: allSkillFiles,
      conductor: agentFiles.filter((file) => file.startsWith('.conductor')),
      all: Array.from(new Set([...agentFiles, ...allSkillFiles])),
    }),
    [agentFiles, allSkillFiles]
  )

  const download = async (id: keyof typeof integrationFiles, label: string) => {
    try {
      setBusy(id)
      await downloadRepoFilesZip({
        filename: `next-forge-${label}.zip`,
        files: integrationFiles[id].map((path) => ({ path })),
      })
    } finally {
      setBusy(null)
    }
  }

  return (
    <div>
      <GlassCard className="mb-6 overflow-hidden p-5 sm:p-6">
        <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <Pill tone="violet">
              {text({ en: 'Portable agent layer', ar: 'طبقة وكلاء قابلة للنقل' })}
            </Pill>
            <h2 className="mt-4 text-xl font-semibold sm:text-2xl">
              {text({ en: 'One repository, multiple coding agents', ar: 'مستودع واحد لعدة وكلاء برمجة' })}
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-7 text-muted-foreground">
              {text({
                en: 'Clone once, then choose the agent surface you prefer. Repository instructions, skills, Claude marketplace files, Cursor commands and Conductor worktrees remain versioned together.',
                ar: 'استنسخ المستودع مرة واحدة ثم اختر الوكيل الذي تفضله. تبقى تعليمات المستودع والمهارات وملفات سوق Claude وأوامر Cursor ومساحات Conductor محفوظة بإصداراتها معًا.',
              })}
            </p>
          </div>
          <button
            type="button"
            disabled={busy !== null}
            onClick={() => download('all', 'all-agent-integrations')}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground disabled:opacity-60"
          >
            <Archive className="size-4" />
            {busy === 'all'
              ? text({ en: 'Preparing…', ar: 'جارٍ التجهيز…' })
              : text({ en: 'Download all integrations', ar: 'تحميل جميع التكاملات' })}
          </button>
        </div>
        <div className="mt-5">
          <CommandBox
            label={{ en: 'Clone the workspace', ar: 'استنساخ مساحة العمل' }}
            command={clone}
          />
        </div>
      </GlassCard>

      <div className="space-y-3">
        {agents.map((agent) => {
          const Icon = agent.icon
          const expanded = open === agent.id
          const fileKey = agent.id as keyof typeof integrationFiles
          return (
            <GlassCard key={agent.id} className="overflow-hidden">
              <button
                type="button"
                onClick={() => setOpen(expanded ? '' : agent.id)}
                className="flex w-full items-center gap-4 p-5 text-start sm:p-6"
              >
                <span className="flex size-11 shrink-0 items-center justify-center rounded-[16px] bg-primary/10 text-primary">
                  <Icon className="size-5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold">{agent.name}</span>
                    <Pill>{text(agent.status)}</Pill>
                  </span>
                  <span className="mt-1 block text-sm leading-6 text-muted-foreground">
                    {text(agent.description)}
                  </span>
                </span>
                {expanded ? (
                  <ChevronUp className="size-4 shrink-0 text-muted-foreground" />
                ) : (
                  <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
                )}
              </button>

              {expanded ? (
                <div className="border-t border-border px-5 pb-6 pt-5 sm:px-6">
                  <div className="grid gap-5 xl:grid-cols-2">
                    <div>
                      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.15em] text-primary/70">
                        {text({ en: 'Install agent', ar: 'تثبيت الوكيل' })}
                      </p>
                      {agent.install.length ? (
                        <div className="space-y-3">
                          {agent.install.map((item) => (
                            <CommandBox
                              key={item.command}
                              command={item.command}
                              label={item.label}
                            />
                          ))}
                        </div>
                      ) : (
                        <p className="rounded-[18px] border border-border bg-background/40 p-4 text-sm leading-6 text-muted-foreground">
                          {text({
                            en: 'Conductor is a desktop orchestration app. The repository-side worktree workflow is shown below.',
                            ar: 'Conductor تطبيق مكتبي للتنسيق. أوامر worktree الخاصة بالمستودع موضحة أدناه.',
                          })}
                        </p>
                      )}
                    </div>

                    <div>
                      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.15em] text-primary/70">
                        {text({ en: 'Enter this repository', ar: 'الدخول إلى هذا المستودع' })}
                      </p>
                      <div className="space-y-3">
                        {agent.enter.map((command) => (
                          <CommandBox key={command} command={command} />
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 grid gap-3 md:grid-cols-[1fr_auto] md:items-end">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">
                        {text({ en: 'Repository surfaces', ar: 'أسطح التكامل داخل المستودع' })}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {agent.paths.map((path) => (
                          <span
                            key={path}
                            dir="ltr"
                            className="rounded-full bg-muted px-2.5 py-1 font-mono text-[10px] text-muted-foreground"
                          >
                            {path}
                          </span>
                        ))}
                      </div>
                      {agent.notes.map((note, index) => (
                        <p key={index} className="mt-3 text-xs leading-5 text-muted-foreground">
                          {text(note)}
                        </p>
                      ))}
                    </div>

                    <button
                      type="button"
                      disabled={busy !== null || integrationFiles[fileKey].length === 0}
                      onClick={() => download(fileKey, `${agent.id}-integration`)}
                      className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full border border-border bg-background/55 px-4 text-sm font-medium disabled:opacity-50"
                    >
                      <Download className="size-4" />
                      {text({ en: 'Download integration ZIP', ar: 'تحميل تكامل ZIP' })}
                    </button>
                  </div>
                </div>
              ) : null}
            </GlassCard>
          )
        })}
      </div>

      <div className="mt-6 grid gap-3 md:grid-cols-3">
        {[
          {
            icon: GitBranch,
            title: { en: 'Versioned', ar: 'محفوظ بالإصدارات' },
            detail: { en: 'Agent configuration travels with Git history.', ar: 'إعدادات الوكلاء تتحرك مع تاريخ Git.' },
          },
          {
            icon: Workflow,
            title: { en: 'Composable', ar: 'قابل للتركيب' },
            detail: { en: 'Install one skill, one bundle, or the complete catalog.', ar: 'ثبّت مهارة واحدة أو حزمة أو الكتالوج بالكامل.' },
          },
          {
            icon: Archive,
            title: { en: 'Portable', ar: 'قابل للنقل' },
            detail: { en: 'Download ZIP archives without a server-side exporter.', ar: 'حمّل ملفات ZIP مباشرة دون خدمة تصدير خلفية.' },
          },
        ].map((item) => {
          const Icon = item.icon
          return (
            <GlassCard key={item.title.en} className="p-5">
              <Icon className="size-4 text-primary" />
              <p className="mt-4 text-sm font-semibold">{text(item.title)}</p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">{text(item.detail)}</p>
            </GlassCard>
          )
        })}
      </div>
    </div>
  )
}
