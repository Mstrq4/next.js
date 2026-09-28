import { AppShell } from '@/components/control-center/app-shell'
import { RepositoryFootprintAnalyzer } from '@/components/control-center/repository-footprint-analyzer'

export default function ComparePage() {
  return (
    <AppShell
      title={{ en: 'Compare bundles', ar: 'مقارنة الحزم' }}
      subtitle={{
        en: 'Compare two live repository surfaces by size, file count and file-type distribution, with the original snapshot comparator preserved separately.',
        ar: 'قارن بين سطحين حيين من المستودع من حيث الحجم وعدد الملفات وتوزيع الأنواع، مع الحفاظ على أداة مقارنة Snapshots الأصلية بشكل منفصل.',
      }}
      eyebrow={{ en: 'Visual tools', ar: 'أدوات التحليل' }}
    >
      <RepositoryFootprintAnalyzer mode="compare" />
    </AppShell>
  )
}
