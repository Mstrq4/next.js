import { Box, LockKeyhole, PackageOpen } from 'lucide-react'
import { AppShell } from '@/components/control-center/app-shell'
import { Localized } from '@/components/control-center/i18n-provider'
import { GlassCard, Pill, SectionHeading } from '@/components/control-center/ui'
import { getPackageCatalog } from '@/lib/control-center-data'

export default async function PackagesPage() {
  const packages = await getPackageCatalog()

  return (
    <AppShell
      title="Workspace packages"
      titleAr="حزم مساحة العمل"
      subtitle="The public framework is assembled from focused workspace packages: Next.js core, SWC bindings, routing, linting, fonts, codemods, testing integrations and more."
      subtitleAr="يتكون إطار Next.js من حزم مساحة عمل متخصصة تشمل النواة وروابط SWC والتوجيه والفحص والخطوط وأدوات التحويل وتكاملات الاختبار وغيرها."
      eyebrow="Monorepo packages"
      eyebrowAr="حزم المستودع الأحادي"
    >
      <SectionHeading
        eyebrow={<Localized en="packages/" ar="packages/ · حزم المصدر" />}
        title={<Localized en={`${packages.length} package surfaces`} ar={`${packages.length} سطح حزمة`} />}
        description={<Localized en="Package metadata is read directly from the monorepo at build time." ar="تُقرأ بيانات الحزم مباشرة من المستودع الأحادي أثناء البناء." />}
      />

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {packages.map((pkg) => (
          <GlassCard key={pkg.directory} className="p-5">
            <div className="flex items-start justify-between gap-3">
              <span className="flex size-10 items-center justify-center rounded-[15px] bg-primary/10 text-primary">
                <PackageOpen className="size-4.5" />
              </span>
              {pkg.private ? (
                <Pill>
                  <LockKeyhole className="me-1 size-3" />
                  <Localized en="private" ar="خاصة" />
                </Pill>
              ) : (
                <Pill tone="success"><Localized en="publishable" ar="قابلة للنشر" /></Pill>
              )}
            </div>
            <p className="mt-5 truncate text-sm font-semibold">{pkg.name}</p>
            <p className="mt-2 min-h-12 text-sm leading-6 text-muted-foreground">
              {pkg.description}
            </p>
            <div className="mt-5 flex items-center justify-between gap-3 border-t border-border pt-4 text-[11px] text-muted-foreground">
              <span className="flex min-w-0 items-center gap-1.5 font-mono">
                <Box className="size-3.5 shrink-0" />
                <span className="truncate">{pkg.directory}</span>
              </span>
              <span className="font-mono">{pkg.version}</span>
            </div>
          </GlassCard>
        ))}
      </div>
    </AppShell>
  )
}
