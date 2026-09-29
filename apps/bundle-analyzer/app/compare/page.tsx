import { AppShell } from '@/components/control-center/app-shell'
import { RepositoryFootprintAnalyzer } from '@/components/control-center/repository-footprint-analyzer'

export default function ComparePage() {
  return (
    <AppShell
      title="Compare bundles"
      titleAr="مقارنة الحزم"
      subtitle="Compare two live repository surfaces by size, file count and file-type distribution, with the original snapshot comparator preserved separately."
      subtitleAr="قارن بين سطحين حيين من المستودع من حيث الحجم وعدد الملفات وتوزيع الأنواع، مع الحفاظ على أداة مقارنة Snapshots الأصلية في صفحة منفصلة."
      eyebrow="Visual analysis"
      eyebrowAr="التحليل المرئي"
    >
      <RepositoryFootprintAnalyzer mode="compare" />
    </AppShell>
  )
}
