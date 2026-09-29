import { ArrowLeft, Bot, FileCode2, FolderCode, TerminalSquare } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { AppShell } from '@/components/control-center/app-shell'
import { CommandBlock } from '@/components/control-center/copy-button'
import { Localized } from '@/components/control-center/i18n-provider'
import { ZipDownloadButton } from '@/components/control-center/zip-download-button'
import { GlassCard, Pill, SectionHeading } from '@/components/control-center/ui'
import {
  getAgentIntegration,
  getAgentIntegrations,
} from '@/lib/control-center-data'

export async function generateStaticParams() {
  const agents = await getAgentIntegrations()
  return agents.map((agent) => ({ slug: agent.slug }))
}

export default async function AgentDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const agent = await getAgentIntegration(slug)
  if (!agent) notFound()

  return (
    <AppShell
      title={agent.name}
      titleAr={agent.name}
      subtitle={agent.description}
      subtitleAr={agent.descriptionAr}
      eyebrow="Agent integration"
      eyebrowAr="تكامل الوكيل"
    >
      <div className="mb-6 flex flex-wrap items-center gap-2">
        <Link
          href="/agents"
          className="inline-flex min-h-9 items-center gap-2 rounded-full bg-muted px-3 text-xs font-medium text-muted-foreground"
        >
          <ArrowLeft className="size-3.5 rtl:rotate-180" />
          <Localized en="Agents" ar="الوكلاء" />
        </Link>
        <Pill tone="violet">{agent.name}</Pill>
        <div className="ms-auto">
          <ZipDownloadButton
            files={agent.files}
            filename={'nextjs-' + agent.slug + '-bundle.zip'}
            label="Download integration ZIP"
          />
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.05fr_.95fr]">
        <GlassCard className="p-5 sm:p-6">
          <SectionHeading
            eyebrow="Setup & usage"
            title="Repository commands"
            description="These commands are derived from the integration files and repository conventions."
          />
          <div className="space-y-3">
            {agent.commands.map((item) => (
              <CommandBlock
                key={item.command}
                title={item.label}
                command={item.command}
              />
            ))}
          </div>
        </GlassCard>

        <div className="space-y-4">
          <GlassCard className="p-5">
            <div className="flex items-center gap-3">
              <Bot className="size-4 text-primary" />
              <Localized as="h3" en="Integration role" ar="دور التكامل" className="font-semibold" />
            </div>
            <Localized
              as="p"
              en={agent.role}
              ar={agent.roleAr}
              className="mt-3 text-sm font-medium text-primary/80"
            />
            <Localized
              as="p"
              en={agent.description}
              ar={agent.descriptionAr}
              className="mt-2 text-sm leading-6 text-muted-foreground"
            />
          </GlassCard>

          <GlassCard className="p-5">
            <div className="flex items-center gap-3">
              <FolderCode className="size-4 text-primary" />
              <Localized as="h3" en="Repository surfaces" ar="أسطح المستودع" className="font-semibold" />
            </div>
            <div className="mt-4 space-y-2">
              {agent.paths.map((path) => (
                <div
                  key={path}
                  className="flex items-center gap-2 rounded-[12px] bg-muted/55 px-3 py-2 font-mono text-[10px] text-muted-foreground"
                >
                  <FileCode2 className="size-3 shrink-0" />
                  <span className="truncate">{path}</span>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>

      <GlassCard className="mt-4 p-5 sm:p-6">
        <div className="flex items-center gap-3">
          <TerminalSquare className="size-4 text-primary" />
          <Localized as="h3" en="Files included in the downloadable bundle" ar="الملفات الموجودة في حزمة التنزيل" className="font-semibold" />
        </div>
        <div className="mt-4 grid gap-2 md:grid-cols-2 xl:grid-cols-3">
          {agent.files.map((file) => (
            <div
              key={file.path}
              className="rounded-[12px] bg-muted/55 px-3 py-2 font-mono text-[10px] text-muted-foreground"
            >
              {file.path}
            </div>
          ))}
        </div>
      </GlassCard>
    </AppShell>
  )
}
