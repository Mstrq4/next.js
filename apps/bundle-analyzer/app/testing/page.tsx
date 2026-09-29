import { Activity, Bug, FlaskConical, TestTube2 } from 'lucide-react'
import { AppShell } from '@/components/control-center/app-shell'
import { Localized } from '@/components/control-center/i18n-provider'
import { LiveSmokeChecks } from '@/components/control-center/live-smoke-checks'
import { TestingLabClient } from '@/components/control-center/testing-lab-client'
import { GlassCard } from '@/components/control-center/ui'
import { getRepoSnapshot } from '@/lib/control-center-data'

export default async function TestingPage() {
  const data = await getRepoSnapshot()

  return (
    <AppShell
      title="Quality & testing laboratory"
      titleAr="مختبر الجودة والاختبارات"
      subtitle="Build focused test commands interactively from the repository's real scripts, then copy and run them in your local checkout or coding-agent session."
      subtitleAr="أنشئ أوامر اختبار مركزة تفاعليًا من سكربتات المستودع الحقيقية، ثم انسخها وشغّلها في نسختك المحلية أو جلسة وكيل البرمجة."
      eyebrow="Quality engineering"
      eyebrowAr="هندسة الجودة"
    >
      <div className="mb-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <GlassCard className="p-5">
          <TestTube2 className="size-5 text-primary" />
          <p className="mt-5 text-3xl font-semibold tracking-[-0.04em]">{data.tests.length}</p>
          <Localized as="p" en="root test commands" ar="أوامر اختبار رئيسية" className="mt-1 text-sm text-muted-foreground" />
        </GlassCard>
        <GlassCard className="p-5">
          <FlaskConical className="size-5 text-primary" />
          <p className="mt-5 text-3xl font-semibold tracking-[-0.04em]">Jest</p>
          <Localized as="p" en="primary test runner" ar="مشغل الاختبارات الأساسي" className="mt-1 text-sm text-muted-foreground" />
        </GlassCard>
        <GlassCard className="p-5">
          <Bug className="size-5 text-primary" />
          <p className="mt-5 text-3xl font-semibold tracking-[-0.04em]">Playwright</p>
          <Localized as="p" en="browser verification" ar="التحقق عبر المتصفح" className="mt-1 text-sm text-muted-foreground" />
        </GlassCard>
        <GlassCard className="p-5">
          <Activity className="size-5 text-primary" />
          <p className="mt-5 text-3xl font-semibold tracking-[-0.04em]">Turbo / Webpack / Rspack</p>
          <Localized as="p" en="multiple verification paths" ar="مسارات تحقق متعددة" className="mt-1 text-sm text-muted-foreground" />
        </GlassCard>
      </div>

      <div className="mb-6"><LiveSmokeChecks /></div>

      <TestingLabClient availableTests={data.tests} />
    </AppShell>
  )
}
