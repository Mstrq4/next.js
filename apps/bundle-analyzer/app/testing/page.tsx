import {
  Activity,
  Bug,
  FlaskConical,
  TestTube2,
} from 'lucide-react'
import { AppShell } from '@/components/control-center/app-shell'
import { LiveActionsStatus } from '@/components/control-center/live-actions-status'
import { TestingLabClient } from '@/components/control-center/testing-lab-client'
import { GlassCard, SectionHeading } from '@/components/control-center/ui'
import { getRepoSnapshot } from '@/lib/control-center-data'

export default async function TestingPage() {
  const data = await getRepoSnapshot()

  return (
    <AppShell
      title={{ en: 'Quality & testing laboratory', ar: 'مختبر الجودة والاختبارات' }}
      subtitle={{
        en: 'Generate focused test commands for the exact runtime/bundler combination, inspect repository test entry points and watch current canary CI activity.',
        ar: 'أنشئ أوامر اختبار مركزة حسب وضع التشغيل وأداة الحزم واستعرض نقاط دخول الاختبارات وراقب نشاط CI الحالي لفرع canary.',
      }}
      eyebrow={{ en: 'Quality engineering', ar: 'هندسة الجودة' }}
    >
      <div className="mb-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <GlassCard className="p-5">
          <TestTube2 className="size-5 text-primary" />
          <p className="mt-5 text-3xl font-semibold">{data.tests.length}</p>
          <p className="mt-1 text-xs text-muted-foreground">root test commands</p>
        </GlassCard>
        <GlassCard className="p-5">
          <FlaskConical className="size-5 text-primary" />
          <p className="mt-5 text-2xl font-semibold">Jest</p>
          <p className="mt-1 text-xs text-muted-foreground">primary runner</p>
        </GlassCard>
        <GlassCard className="p-5">
          <Bug className="size-5 text-primary" />
          <p className="mt-5 text-2xl font-semibold">Playwright</p>
          <p className="mt-1 text-xs text-muted-foreground">browser layer</p>
        </GlassCard>
        <GlassCard className="p-5">
          <Activity className="size-5 text-primary" />
          <p className="mt-5 text-2xl font-semibold">Turbo / Webpack</p>
          <p className="mt-1 text-xs text-muted-foreground">explicit modes</p>
        </GlassCard>
      </div>

      <SectionHeading
        eyebrow={{ en: 'Command lab', ar: 'مختبر الأوامر' }}
        title={{ en: 'Build the right test invocation', ar: 'أنشئ أمر الاختبار الصحيح' }}
        description={{
          en: 'This page does not fake remote execution. It generates the repository-supported command and pairs it with live GitHub Actions status.',
          ar: 'هذه الصفحة لا تدّعي تشغيلًا بعيدًا وهميًا؛ بل تنتج الأمر المدعوم من المستودع وتعرض بجانبه حالة GitHub Actions الحية.',
        }}
      />

      <div className="grid gap-4 xl:grid-cols-[1.25fr_.75fr]">
        <TestingLabClient availableTests={data.tests} />
        <LiveActionsStatus />
      </div>
    </AppShell>
  )
}
