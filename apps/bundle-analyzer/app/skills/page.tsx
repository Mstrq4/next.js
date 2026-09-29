import { AppShell } from '@/components/control-center/app-shell'
import { SkillCatalog } from '@/components/control-center/skill-catalog'
import { SkillInstallMatrix } from '@/components/control-center/skill-install-matrix'
import { GlassCard } from '@/components/control-center/ui'
import { getSkillBundles, getSkillCatalog } from '@/lib/control-center-data'

export default async function SkillsPage() {
  const [skills, bundles] = await Promise.all([getSkillCatalog(), getSkillBundles()])
  const agentCount = skills.filter((skill) => skill.group === 'Agent skill').length
  const frameworkCount = skills.length - agentCount

  return (
    <AppShell
      title="Skills library"
      titleAr="مكتبة المهارات"
      subtitle="Explore the real SKILL.md files shipped with Next.js, inspect their instructions, copy installation commands and download one skill, a bundle, or the complete catalog."
      subtitleAr="استعرض ملفات SKILL.md الحقيقية الموجودة في Next.js، واقرأ تعليماتها وانسخ أوامر تثبيتها ونزّل مهارة واحدة أو حزمة أو المكتبة كاملة."
      eyebrow="Agent intelligence"
      eyebrowAr="ذكاء الوكلاء"
    >
      <div className="mb-7 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <GlassCard className="p-5">
          <p className="text-xs text-muted-foreground">Total skills</p>
          <p className="mt-2 text-3xl font-semibold tracking-[-0.04em]">{skills.length}</p>
        </GlassCard>
        <GlassCard className="p-5">
          <p className="text-xs text-muted-foreground">Repository skills</p>
          <p className="mt-2 text-3xl font-semibold tracking-[-0.04em]">{agentCount}</p>
        </GlassCard>
        <GlassCard className="p-5">
          <p className="text-xs text-muted-foreground">Framework skills</p>
          <p className="mt-2 text-3xl font-semibold tracking-[-0.04em]">{frameworkCount}</p>
        </GlassCard>
        <GlassCard className="p-5">
          <p className="text-xs text-muted-foreground">Skill bundles</p>
          <p className="mt-2 text-3xl font-semibold tracking-[-0.04em]">{bundles.length}</p>
        </GlassCard>
      </div>

      <SkillInstallMatrix
        skills={skills.map(({ slug, path, bundle, name }) => ({ slug, path, bundle, name }))}
        bundles={bundles.map((item) => ({
          name: item.name,
          skills: item.skills.map(({ slug, path, bundle, name }) => ({ slug, path, bundle, name })),
        }))}
      />
      <SkillCatalog skills={skills} bundles={bundles} />
    </AppShell>
  )
}
