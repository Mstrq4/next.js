import { AppShell } from '@/components/control-center/app-shell'
import { DocumentationContent } from '@/components/control-center/documentation-content'
import { GlassCard, SectionHeading } from '@/components/control-center/ui'
import { MarkdownDocument } from '@/components/control-center/markdown-document'
import { getRepositoryGuides, getRepositoryRootCatalog } from '@/lib/control-center-data'

export default async function DocumentationPage() {
  const [rootCatalog, guides] = await Promise.all([
    getRepositoryRootCatalog(),
    getRepositoryGuides(),
  ])

  return (
    <AppShell
      title={{ en: 'Next Forge documentation', ar: 'توثيق Next Forge' }}
      subtitle={{
        en: 'A practical guide to the Next.js repository, Agent Skills, coding agents, worktrees, testing and development commands—with copy-ready workflows.',
        ar: 'دليل عملي لمستودع Next.js وAgent Skills ووكلاء البرمجة وworktrees والاختبارات وأوامر التطوير مع Workflows جاهزة للنسخ.',
      }}
      eyebrow={{ en: 'Documentation', ar: 'التوثيق' }}
    >
      <DocumentationContent rootCatalog={rootCatalog} />

      <div className="mt-12">
        <SectionHeading
          eyebrow={{ en: 'Source documents', ar: 'مستندات المصدر' }}
          title={{ en: 'Repository-native guides', ar: 'أدلة مأخوذة من المستودع' }}
          description={{
            en: 'These sections are rendered directly from the repository so the documentation stays aligned with source control.',
            ar: 'تُعرض هذه الأقسام مباشرة من المستودع حتى يبقى التوثيق متوافقًا مع المصدر.',
          }}
        />
        <div className="grid gap-4 xl:grid-cols-2">
          <GlassCard className="max-h-[760px] overflow-y-auto p-5 sm:p-7">
            <MarkdownDocument source={guides.skillGuide} />
          </GlassCard>
          <GlassCard className="max-h-[760px] overflow-y-auto p-5 sm:p-7">
            <MarkdownDocument source={guides.conductorGuide} />
          </GlassCard>
        </div>
      </div>
    </AppShell>
  )
}
