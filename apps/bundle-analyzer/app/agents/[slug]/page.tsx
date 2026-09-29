import { ArrowLeft, ExternalLink, FileCode2 } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { AppShell } from '@/components/control-center/app-shell'
import { CommandBlock } from '@/components/control-center/copy-button'
import { Localized } from '@/components/control-center/i18n-provider'
import { ZipDownloadButton } from '@/components/control-center/zip-download-button'
import { GlassCard, SectionHeading } from '@/components/control-center/ui'
import { getAgentDetail, getAgentIntegrations } from '@/lib/control-center-data'

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
  const agent = await getAgentDetail(slug)
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
        <div className="ms-auto">
          <ZipDownloadButton
            files={agent.files}
            filename={'nextjs-' + agent.slug + '-integration.zip'}
            label="Download integration ZIP"
          />
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[.9fr_1.1fr]">
        <GlassCard className="p-5 sm:p-6">
          <SectionHeading
            eyebrow="Setup"
            title="Launch and inspect"
            description="Use the repository-local configuration and commands below from the Next.js checkout."
          />
          <div className="space-y-3">
            {agent.commands.map((item) => (
              <CommandBlock key={item.command} title={item.label} command={item.command} />
            ))}
          </div>
        </GlassCard>

        <GlassCard className="p-5 sm:p-6">
          <SectionHeading
            eyebrow="Files"
            title="Integration surface"
            description="Open the exact repository files used by this integration or download them together."
          />
          <div className="max-h-[62vh] space-y-1 overflow-y-auto">
            {agent.files.map((file) => (
              <a
                key={file.path}
                href={file.url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 rounded-[14px] px-3 py-2.5 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <FileCode2 className="size-3.5 shrink-0 text-primary" />
                <span className="min-w-0 flex-1 truncate font-mono">{file.path}</span>
                <ExternalLink className="size-3.5 shrink-0" />
              </a>
            ))}
          </div>
        </GlassCard>
      </div>
    </AppShell>
  )
}
