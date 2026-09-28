import { AppShell } from '@/components/control-center/app-shell'
import { CommandBlock } from '@/components/control-center/copy-button'
import { RepositoryExplorer } from '@/components/control-center/repository-explorer'
import { GlassCard, SectionHeading } from '@/components/control-center/ui'
import { getRepositorySurface } from '@/lib/control-center-data'

export default async function RepositoryPage() {
  const entries = await getRepositorySurface()

  return (
    <AppShell
      title="Repository explorer"
      titleAr="مستكشف المستودع"
      subtitle="Browse the official Vercel Next.js canary repository, inspect files, understand important folders and copy common checkout commands."
      subtitleAr="تصفح مستودع Next.js الرسمي من Vercel على فرع canary، وافحص الملفات وافهم المجلدات المهمة وانسخ أوامر العمل الشائعة."
      eyebrow="Source intelligence"
      eyebrowAr="ذكاء المصدر"
    >
      <div className="mb-7 grid gap-3 lg:grid-cols-3">
        <GlassCard className="p-5 lg:col-span-2">
          <SectionHeading
            eyebrow="Checkout"
            title="Clone the canonical source"
            description="Use the official Vercel repository as the upstream source of truth."
          />
          <CommandBlock command="git clone --branch canary https://github.com/vercel/next.js.git" />
        </GlassCard>
        <GlassCard className="p-5">
          <p className="text-xs text-muted-foreground">Indexed surfaces</p>
          <p className="mt-2 text-4xl font-semibold tracking-[-0.05em]">{entries.length}</p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Agent, framework, tooling, docs and development directories highlighted from the repository root.
          </p>
        </GlassCard>
      </div>

      <RepositoryExplorer initialEntries={entries} />
    </AppShell>
  )
}
