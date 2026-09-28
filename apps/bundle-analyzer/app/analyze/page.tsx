import { AppShell } from '@/components/control-center/app-shell'
import { RepositoryFootprintAnalyzer } from '@/components/control-center/repository-footprint-analyzer'

export default function AnalyzePage() {
  return (
    <AppShell
      title={{ en: 'Bundle analyzer', ar: 'محلل الحزم' }}
      subtitle={{
        en: 'Run a live repository footprint analysis immediately, or switch to the native Next.js bundle-snapshot analyzer when generated analysis data is available.',
        ar: 'شغّل تحليلًا حيًا لحجم أسطح المستودع مباشرة أو انتقل إلى محلل Snapshot الأصلي لـNext.js عندما تتوفر بيانات التحليل المولدة.',
      }}
      eyebrow={{ en: 'Visual tools', ar: 'أدوات التحليل' }}
    >
      <RepositoryFootprintAnalyzer mode="analyze" />
    </AppShell>
  )
}
