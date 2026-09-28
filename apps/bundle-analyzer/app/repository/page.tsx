import { Suspense } from 'react'
import { AppShell } from '@/components/control-center/app-shell'
import { RepositoryExplorerClient } from '@/components/control-center/repository-explorer-client'
import { GlassCard, SectionHeading } from '@/components/control-center/ui'
import { getRepositoryRootCatalog } from '@/lib/control-center-data'

export default async function RepositoryPage() {
  const rootCatalog = await getRepositoryRootCatalog()

  return (
    <AppShell
      title={{ en: 'Repository explorer', ar: 'مستكشف المستودع' }}
      subtitle={{
        en: 'Browse the live canary tree, open agent/configuration folders, preview source files and copy paths without leaving Next Forge.',
        ar: 'تصفح شجرة canary الحية وافتح مجلدات الوكلاء والإعدادات وعاين الملفات وانسخ المسارات دون مغادرة Next Forge.',
      }}
      eyebrow={{ en: 'Source browser', ar: 'متصفح المصدر' }}
    >
      <SectionHeading
        eyebrow="Mstrq4/next.js · canary"
        title={{ en: 'Live GitHub tree', ar: 'شجرة GitHub الحية' }}
        description={{
          en: 'Directory navigation is fetched from GitHub in the browser, so this page reflects repository changes without rebuilding the static catalog.',
          ar: 'يتم جلب التنقل بين المجلدات من GitHub داخل المتصفح، لذلك تعكس الصفحة تغييرات المستودع دون الحاجة لإعادة بناء الكتالوج الثابت.',
        }}
      />
      <Suspense
        fallback={
          <GlassCard className="h-[520px] p-5">
            <div className="nf-skeleton h-full rounded-[18px]" />
          </GlassCard>
        }
      >
        <RepositoryExplorerClient rootCatalog={rootCatalog} />
      </Suspense>
    </AppShell>
  )
}
