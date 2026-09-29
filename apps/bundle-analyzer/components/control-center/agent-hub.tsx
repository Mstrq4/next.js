'use client'

import {
  Bot,
  Boxes,
  ChevronDown,
  ChevronUp,
  Code2,
  FolderCode,
  Network,
  TerminalSquare,
  ArrowUpRight,
} from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import type { AgentIntegration } from '@/lib/control-center-data'
import { CommandBlock } from './copy-button'
import { useI18n } from './i18n-provider'
import { ZipDownloadButton } from './zip-download-button'

const iconMap = {
  'claude-code': Bot,
  codex: Code2,
  hermes: Boxes,
  cursor: TerminalSquare,
  conductor: Network,
}

export function AgentHub({ agents }: { agents: AgentIntegration[] }) {
  const { t } = useI18n()
  const [expanded, setExpanded] = useState<string | null>('codex')
  const allFiles = Array.from(
    new Map(
      agents.flatMap((agent) => agent.files).map((file) => [file.path, file])
    ).values()
  )

  return (
    <>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-[22px] border border-border bg-primary/[0.045] p-4">
        <div>
          <p className="text-sm font-semibold">{t('Agent integration bundle', 'حزمة تكامل الوكلاء')}</p>
          <p className="mt-1 text-xs leading-5 text-muted-foreground">
            {t(
              'Download repository guidance, agent skills, Claude plugin files, Cursor commands and Conductor configuration together.',
              'نزّل تعليمات المستودع والمهارات وملفات إضافة Claude وأوامر Cursor وإعدادات Conductor معًا.'
            )}
          </p>
        </div>
        <ZipDownloadButton
          files={allFiles}
          filename="nextjs-agent-integrations.zip"
          label={t('Download agent bundle', 'تنزيل حزمة الوكلاء')}
        />
      </div>

      <div className="space-y-3">
        {agents.map((agent) => {
          const Icon = iconMap[agent.slug as keyof typeof iconMap] ?? Bot
          const open = expanded === agent.slug
          return (
            <article key={agent.slug} className="nf-glass overflow-hidden rounded-[24px]">
              <button
                type="button"
                onClick={() => setExpanded(open ? null : agent.slug)}
                className="flex w-full items-start gap-4 p-5 text-start sm:p-6"
              >
                <span className="flex size-11 shrink-0 items-center justify-center rounded-[17px] bg-primary/10 text-primary">
                  <Icon className="size-5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-base font-semibold">{agent.name}</span>
                  <span className="mt-1 block text-xs font-medium text-primary/75">
                    {t(agent.role, agent.roleAr)}
                  </span>
                  <span className="mt-2 block max-w-3xl text-sm leading-6 text-muted-foreground">
                    {t(agent.description, agent.descriptionAr)}
                  </span>
                </span>
                {open ? (
                  <ChevronUp className="mt-1 size-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="mt-1 size-4 text-muted-foreground" />
                )}
              </button>

              {open ? (
                <div className="border-t border-border px-5 pb-5 pt-4 sm:px-6 sm:pb-6">
                  <div className="grid gap-4 xl:grid-cols-[1fr_.75fr]">
                    <div>
                      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.15em] text-primary/70">
                        {t('Commands', 'الأوامر')}
                      </p>
                      <div className="space-y-2">
                        {agent.commands.map((item) => (
                          <CommandBlock
                            key={item.command}
                            title={t(item.label, item.labelAr ?? item.label)}
                            command={item.command}
                          />
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="mb-3 flex items-center justify-between gap-3">
                        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-primary/70">
                          {t('Repository files', 'ملفات المستودع')}
                        </p>
                        <ZipDownloadButton
                          files={agent.files}
                          filename={'nextjs-' + agent.slug + '-bundle.zip'}
                          compact
                        />
                      </div>
                      <div className="max-h-64 space-y-1 overflow-y-auto">
                        {agent.paths.map((path) => (
                          <div
                            key={path}
                            className="flex items-center gap-2 rounded-[12px] bg-muted/60 px-3 py-2 font-mono text-[10px] text-muted-foreground"
                          >
                            <FolderCode className="size-3 shrink-0" />
                            <span className="truncate">{path}</span>
                          </div>
                        ))}
                      </div>
                      <Link
                        href={'/agents/' + agent.slug}
                        className="mt-4 inline-flex min-h-9 items-center gap-2 rounded-full bg-primary px-3 text-xs font-medium text-primary-foreground"
                      >
                        {t('View agent integration', 'عرض تكامل الوكيل')}
                        <ArrowUpRight className="size-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              ) : null}
            </article>
          )
        })}
      </div>
    </>
  )
}
