import { AppShell } from '@/components/control-center/app-shell'
import { CommandBlock } from '@/components/control-center/copy-button'
import { RepositoryExplorer } from '@/components/control-center/repository-explorer'
import { Localized } from '@/components/control-center/i18n-provider'
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
            eyebrow={<Localized en="Checkout" ar="نسخة العمل" />}
            title={<Localized en="Clone the canonical source" ar="استنسخ المصدر الرسمي" />}
            description={<Localized en="Use the official Vercel repository as the upstream source of truth." ar="استخدم مستودع Vercel الرسمي كمصدر أساسي للحقيقة." />}
          />
          <CommandBlock command="git clone --branch canary https://github.com/vercel/next.js.git" />
        </GlassCard>
        <GlassCard className="p-5">
          <Localized as="p" en="Indexed surfaces" ar="الأسطح المفهرسة" className="text-xs text-muted-foreground" />
          <p className="mt-2 text-4xl font-semibold tracking-[-0.05em]">{entries.length}</p>
          <Localized as="p" en="Agent, framework, tooling, docs and development directories highlighted from the repository root." ar="مجلدات الوكلاء والإطار والأدوات والتوثيق والتطوير المميزة من جذر المستودع." className="mt-2 text-sm leading-6 text-muted-foreground" />
        </GlassCard>
      </div>

      <RepositoryExplorer initialEntries={entries} />
    </AppShell>
  )
}
