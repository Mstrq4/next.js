import { notFound } from 'next/navigation'
import { AppShell } from '@/components/control-center/app-shell'
import { MarkdownDocument } from '@/components/control-center/markdown-document'
import { SkillInstallPanel } from '@/components/control-center/skill-detail-client'
import { GlassCard, SectionHeading } from '@/components/control-center/ui'
import { getAllSkillIds, getSkillDetail } from '@/lib/control-center-data'

export const dynamicParams = false

export async function generateStaticParams() {
  const ids = await getAllSkillIds()
  return ids.map((skill) => ({ skill }))
}

export default async function SkillDetailPage({
  params,
}: {
  params: Promise<{ skill: string }>
}) {
  const { skill: id } = await params
  const skill = await getSkillDetail(decodeURIComponent(id))
  if (!skill) notFound()

  return (
    <AppShell
      title={skill.name}
      subtitle={{
        en: 'Full source documentation, installation paths, agent compatibility and downloadable files for this skill.',
        ar: 'التوثيق الكامل للمهارة ومسارات تثبيتها وتوافقها مع الوكلاء وملفاتها القابلة للتحميل.',
      }}
      eyebrow={{ en: 'Skill detail', ar: 'تفاصيل المهارة' }}
    >
      <SkillInstallPanel skill={skill} />

      <div className="mt-10">
        <SectionHeading
          eyebrow="SKILL.md"
          title={{ en: 'Skill source', ar: 'محتوى المهارة' }}
          description={{
            en: 'Rendered directly from the repository’s SKILL.md file.',
            ar: 'معروض مباشرة من ملف SKILL.md الموجود في المستودع.',
          }}
        />
        <GlassCard className="p-5 sm:p-7 lg:p-8">
          <MarkdownDocument source={skill.sourceContent} />
        </GlassCard>
      </div>
    </AppShell>
  )
}
