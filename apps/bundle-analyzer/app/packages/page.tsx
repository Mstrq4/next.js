import { Box, ExternalLink, LockKeyhole, PackageOpen } from 'lucide-react'
import { AppShell } from '@/components/control-center/app-shell'
import { LocalizedText } from '@/components/control-center/locale-provider'
import { GlassCard, Pill, SectionHeading } from '@/components/control-center/ui'
import { getPackageCatalog } from '@/lib/control-center-data'

export default async function PackagesPage() {
  const packages = await getPackageCatalog()

  return (
    <AppShell
      title={{ en: 'Workspace packages', ar: 'حزم مساحة العمل' }}
      subtitle={{
        en: 'Browse package metadata read from the monorepo and jump directly to each package source on canary.',
        ar: 'استعرض بيانات الحزم المقروءة من الـMonorepo وانتقل مباشرة إلى مصدر كل حزمة على canary.',
      }}
      eyebrow={{ en: 'Monorepo packages', ar: 'حزم Monorepo' }}
    >
      <SectionHeading
        eyebrow="packages/"
        title={{ en: `${packages.length} package surfaces`, ar: `${packages.length} سطح حزمة` }}
        description={{
          en: 'Package names, versions and visibility come from each package.json at build time.',
          ar: 'تُقرأ أسماء الحزم وإصداراتها وحالتها من package.json الخاص بكل حزمة أثناء البناء.',
        }}
      />

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {packages.map((pkg) => (
          <GlassCard key={pkg.directory} className="flex min-h-64 flex-col p-5">
            <div className="flex items-start justify-between gap-3">
              <span className="flex size-10 items-center justify-center rounded-[15px] bg-primary/10 text-primary">
                <PackageOpen className="size-4.5" />
              </span>
              {pkg.private ? (
                <Pill>
                  <LockKeyhole className="me-1 size-3" />
                  <LocalizedText value={{ en: 'private', ar: 'خاص' }} />
                </Pill>
              ) : (
                <Pill tone="success">
                  <LocalizedText value={{ en: 'publishable', ar: 'قابل للنشر' }} />
                </Pill>
              )}
            </div>
            <p dir="ltr" className="mt-5 truncate text-left text-sm font-semibold">{pkg.name}</p>
            <p className="mt-2 min-h-12 text-sm leading-6 text-muted-foreground">
              {pkg.description}
            </p>
            <div className="mt-auto pt-5">
              <div className="flex items-center justify-between gap-3 border-t border-border pt-4 text-[11px] text-muted-foreground">
                <span dir="ltr" className="flex min-w-0 items-center gap-1.5 text-left font-mono">
                  <Box className="size-3.5 shrink-0" />
                  <span className="truncate">{pkg.directory}</span>
                </span>
                <span dir="ltr" className="font-mono">{pkg.version}</span>
              </div>
              <a
                href={`https://github.com/Mstrq4/next.js/tree/canary/${pkg.path}`}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex min-h-9 w-full items-center justify-center gap-2 rounded-full border border-border bg-background/50 px-3 text-xs font-medium"
              >
                <ExternalLink className="size-3.5" />
                <LocalizedText value={{ en: 'Open package source', ar: 'فتح مصدر الحزمة' }} />
              </a>
            </div>
          </GlassCard>
        ))}
      </div>
    </AppShell>
  )
}
