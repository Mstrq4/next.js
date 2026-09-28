import { AppShell } from '@/components/control-center/app-shell'
import { SkillCatalogClient } from '@/components/control-center/skill-catalog-client'
import { SectionHeading } from '@/components/control-center/ui'
import { getSkillCatalog } from '@/lib/control-center-data'

export default async function SkillsPage() {
  const skills = await getSkillCatalog()

  return (
    <AppShell
      title={{ en: 'Skills library', ar: 'مكتبة المهارات' }}
      subtitle={{
        en: 'Browse the real SKILL.md catalog from this repository, inspect each workflow, install it into your preferred coding agent, or download individual and bundled ZIP archives.',
        ar: 'استعرض كتالوج SKILL.md الحقيقي من المستودع، وافتح كل مهارة وثبّتها في وكيل البرمجة الذي تستخدمه أو حمّلها منفردة أو ضمن حزم ZIP.',
      }}
      eyebrow={{ en: 'Agent intelligence', ar: 'ذكاء الوكلاء' }}
    >
      <SectionHeading
        eyebrow={{ en: 'Live catalog', ar: 'كتالوج فعلي' }}
        title={{ en: 'Repository-native skills', ar: 'مهارات المستودع الأصلية' }}
        description={{
          en: 'Names, descriptions and file manifests are extracted from the skill directories at build time.',
          ar: 'تُستخرج الأسماء والأوصاف وقوائم الملفات من مجلدات المهارات نفسها أثناء البناء.',
        }}
      />
      <SkillCatalogClient skills={skills} />
    </AppShell>
  )
}
