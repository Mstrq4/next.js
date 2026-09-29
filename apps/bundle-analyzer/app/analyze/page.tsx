import { AppShell } from '@/components/control-center/app-shell'
import { RepositoryFootprintAnalyzer } from '@/components/control-center/repository-footprint-analyzer'

export default function AnalyzePage() {
  return (
    <AppShell
      title="Bundle analyzer"
      titleAr="محلل الحزم"
      subtitle="Run a live repository footprint analysis immediately, or switch to the native Next.js bundle-snapshot analyzer when generated analysis data is available."
      subtitleAr="شغّل تحليلًا حيًا لحجم أسطح المستودع مباشرة، أو انتقل إلى محلل Snapshot الأصلي في Next.js عندما تتوفر بيانات التحليل المولدة."
      eyebrow="Visual analysis"
      eyebrowAr="التحليل المرئي"
    >
      <RepositoryFootprintAnalyzer mode="analyze" />
    </AppShell>
  )
}
