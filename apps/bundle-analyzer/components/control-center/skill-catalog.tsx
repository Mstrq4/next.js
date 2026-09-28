'use client'

import {
  Archive,
  BookOpen,
  Download,
  FolderCode,
  Search,
  Sparkles,
} from 'lucide-react'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import type { SkillCatalogItem } from '@/lib/control-center-data'
import { ZipDownloadButton } from './zip-download-button'
import { useI18n } from './i18n-provider'

type Bundle = {
  name: string
  skills: SkillCatalogItem[]
  files: Array<{ path: string; url: string }>
}

export function SkillCatalog({
  skills,
  bundles,
}: {
  skills: SkillCatalogItem[]
  bundles: Bundle[]
}) {
  const { t } = useI18n()
  const [query, setQuery] = useState('')
  const [bundle, setBundle] = useState('All')

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return skills.filter((skill) => {
      const matchesBundle = bundle === 'All' || skill.bundle === bundle
      const matchesQuery =
        !needle ||
        skill.name.toLowerCase().includes(needle) ||
        skill.description.toLowerCase().includes(needle) ||
        skill.path.toLowerCase().includes(needle)
      return matchesBundle && matchesQuery
    })
  }, [skills, query, bundle])

  const allFiles = skills.flatMap((skill) => skill.files)

  return (
    <>
      <div className="mb-6 grid gap-3 xl:grid-cols-[1fr_auto]">
        <div className="nf-glass flex items-center gap-3 rounded-[20px] px-4">
          <Search className="size-4 text-muted-foreground" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t('Search skills, descriptions and paths…', 'ابحث في المهارات والأوصاف والمسارات…')}
            className="h-12 min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
          <span className="rounded-full bg-muted px-2.5 py-1 font-mono text-[10px] text-muted-foreground">
            {filtered.length}/{skills.length}
          </span>
        </div>

        <ZipDownloadButton
          files={allFiles}
          filename="nextjs-all-skills.zip"
          label={t('Download all skills', 'تنزيل جميع المهارات')}
        />
      </div>

      <div className="mb-7 flex gap-2 overflow-x-auto pb-1">
        <button
          type="button"
          onClick={() => setBundle('All')}
          className={`shrink-0 rounded-full px-3.5 py-2 text-xs font-medium transition-colors ${
            bundle === 'All' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
          }`}
        >
          {t('All', 'الكل')}
        </button>
        {bundles.map((item) => (
          <button
            type="button"
            key={item.name}
            onClick={() => setBundle(item.name)}
            className={`shrink-0 rounded-full px-3.5 py-2 text-xs font-medium transition-colors ${
              bundle === item.name ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
            }`}
          >
            {item.name} · {item.skills.length}
          </button>
        ))}
      </div>

      {bundle !== 'All' ? (
        <div className="mb-5 flex items-center justify-between gap-4 rounded-[20px] border border-border bg-primary/[0.045] p-4">
          <div>
            <p className="text-sm font-semibold">{bundle}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {t('Download this complete skill bundle as one ZIP archive.', 'نزّل حزمة المهارات كاملة في ملف ZIP واحد.')}
            </p>
          </div>
          <ZipDownloadButton
            files={bundles.find((item) => item.name === bundle)?.files ?? []}
            filename={'nextjs-' + bundle.toLowerCase().replaceAll(' ', '-') + '-skills.zip'}
            compact
          />
        </div>
      ) : null}

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((skill) => (
          <article key={skill.path} className="nf-glass group flex min-h-[280px] flex-col rounded-[24px] p-5">
            <div className="flex items-start justify-between gap-3">
              <span className="flex size-10 items-center justify-center rounded-[15px] bg-primary/10 text-primary">
                <Sparkles className="size-4.5" />
              </span>
              <span className="rounded-full bg-muted px-2.5 py-1 text-[10px] font-medium text-muted-foreground">
                {skill.bundle}
              </span>
            </div>

            <h3 className="mt-5 font-semibold tracking-[-0.02em]">{skill.name}</h3>
            <p className="mt-2 line-clamp-4 text-sm leading-6 text-muted-foreground">
              {skill.description}
            </p>

            <div className="mt-auto pt-5">
              <div className="mb-3 flex items-center gap-2 rounded-[14px] bg-muted/70 px-3 py-2 font-mono text-[10px] text-muted-foreground">
                <FolderCode className="size-3.5 shrink-0" />
                <span className="truncate">{skill.path}</span>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  href={'/skills/' + skill.slug}
                  className="inline-flex min-h-9 flex-1 items-center justify-center gap-2 rounded-full bg-primary px-3 text-xs font-medium text-primary-foreground"
                >
                  <BookOpen className="size-3.5" />
                  {t('View skill', 'عرض المهارة')}
                </Link>
                <ZipDownloadButton
                  files={skill.files}
                  filename={skill.slug + '.zip'}
                  compact
                />
              </div>
            </div>
          </article>
        ))}
      </div>
    </>
  )
}
