'use client'

import {
  Archive,
  Download,
  Filter,
  FolderArchive,
  Search,
  Sparkles,
} from 'lucide-react'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import type { SkillCatalogItem } from '@/lib/control-center-data'
import { downloadRepoFilesZip } from '@/lib/github-zip'
import { useLocale } from './locale-provider'
import { GlassCard, Pill } from './ui'

export function SkillCatalogClient({
  skills,
}: {
  skills: SkillCatalogItem[]
}) {
  const { text } = useLocale()
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<'all' | 'repository' | 'framework'>('all')
  const [busy, setBusy] = useState<string | null>(null)

  const visibleSkills = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return skills.filter((skill) => {
      if (filter !== 'all' && skill.source !== filter) return false
      if (!needle) return true
      return (
        skill.name.toLowerCase().includes(needle) ||
        skill.description.toLowerCase().includes(needle) ||
        skill.path.toLowerCase().includes(needle)
      )
    })
  }, [filter, query, skills])

  const download = async (
    id: string,
    filename: string,
    selected: SkillCatalogItem[]
  ) => {
    try {
      setBusy(id)
      await downloadRepoFilesZip({
        filename,
        files: Array.from(
          new Map(
            selected
              .flatMap((skill) => skill.files)
              .map((path) => [path, { path }])
          ).values()
        ),
      })
    } finally {
      setBusy(null)
    }
  }

  const bundles = [
    {
      id: 'repository',
      label: { en: 'Repository skills', ar: 'مهارات المستودع' },
      description: {
        en: 'All operational skills under .agents/skills.',
        ar: 'جميع مهارات العمل الموجودة داخل .agents/skills.',
      },
      skills: skills.filter((skill) => skill.source === 'repository'),
      filename: 'next-forge-repository-skills.zip',
    },
    {
      id: 'framework',
      label: { en: 'Framework skills', ar: 'مهارات الإطار' },
      description: {
        en: 'Official Next.js skills under skills/.',
        ar: 'مهارات Next.js الرسمية الموجودة داخل skills/.',
      },
      skills: skills.filter((skill) => skill.source === 'framework'),
      filename: 'next-forge-framework-skills.zip',
    },
    {
      id: 'all',
      label: { en: 'Complete skills bundle', ar: 'حزمة المهارات الكاملة' },
      description: {
        en: 'Repository and framework skills in one archive.',
        ar: 'مهارات المستودع والإطار في ملف واحد.',
      },
      skills,
      filename: 'next-forge-all-skills.zip',
    },
  ]

  return (
    <div>
      <div className="mb-7 grid gap-3 lg:grid-cols-3">
        {bundles.map((bundle) => (
          <GlassCard key={bundle.id} className="p-5">
            <div className="flex items-start justify-between gap-3">
              <span className="flex size-11 items-center justify-center rounded-[16px] bg-primary/10 text-primary">
                <FolderArchive className="size-5" />
              </span>
              <Pill tone="violet">{bundle.skills.length}</Pill>
            </div>
            <h3 className="mt-5 font-semibold">{text(bundle.label)}</h3>
            <p className="mt-2 min-h-10 text-sm leading-6 text-muted-foreground">
              {text(bundle.description)}
            </p>
            <button
              type="button"
              disabled={busy !== null}
              onClick={() =>
                download(bundle.id, bundle.filename, bundle.skills)
              }
              className="mt-5 inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-full border border-border bg-background/55 px-4 text-sm font-medium transition-colors hover:bg-muted disabled:cursor-wait disabled:opacity-60"
            >
              <Archive className="size-4" />
              {busy === bundle.id
                ? text({ en: 'Preparing ZIP…', ar: 'جارٍ تجهيز ZIP…' })
                : text({ en: 'Download ZIP', ar: 'تحميل ZIP' })}
            </button>
          </GlassCard>
        ))}
      </div>

      <div className="nf-glass mb-5 flex flex-col gap-3 rounded-[22px] p-3 sm:flex-row sm:items-center">
        <div className="flex min-h-11 flex-1 items-center gap-2 rounded-[16px] border border-border bg-background/55 px-3">
          <Search className="size-4 text-muted-foreground" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={text({
              en: 'Search skills, descriptions or paths…',
              ar: 'ابحث في المهارات أو الأوصاف أو المسارات…',
            })}
            className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>
        <div className="flex items-center gap-1 rounded-[16px] bg-muted/70 p-1">
          <Filter className="mx-2 size-3.5 text-muted-foreground" />
          {[
            ['all', { en: 'All', ar: 'الكل' }],
            ['repository', { en: 'Repository', ar: 'المستودع' }],
            ['framework', { en: 'Framework', ar: 'الإطار' }],
          ].map(([value, label]) => (
            <button
              key={value as string}
              type="button"
              onClick={() =>
                setFilter(value as 'all' | 'repository' | 'framework')
              }
              className={`rounded-[12px] px-3 py-2 text-xs font-medium transition-colors ${
                filter === value
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {text(label as { en: string; ar: string })}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4 flex items-center justify-between gap-4 px-1">
        <p className="text-xs text-muted-foreground">
          {text({
            en: `${visibleSkills.length} skills shown`,
            ar: `عرض ${visibleSkills.length} مهارة`,
          })}
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {visibleSkills.map((skill) => (
          <GlassCard key={skill.id} className="group flex min-h-[280px] flex-col p-5">
            <div className="flex items-start justify-between gap-3">
              <span className="flex size-10 items-center justify-center rounded-[15px] bg-primary/10 text-primary">
                <Sparkles className="size-4.5" />
              </span>
              <Pill tone={skill.source === 'framework' ? 'violet' : 'default'}>
                {skill.source === 'framework'
                  ? text({ en: 'Framework', ar: 'الإطار' })
                  : text({ en: 'Repository', ar: 'المستودع' })}
              </Pill>
            </div>

            <h3 className="mt-5 font-semibold tracking-[-0.02em]">
              {skill.name}
            </h3>
            <p className="mt-2 line-clamp-4 text-sm leading-6 text-muted-foreground">
              {skill.description}
            </p>

            <div className="mt-auto pt-5">
              <div
                dir="ltr"
                className="mb-3 truncate rounded-[12px] bg-muted/70 px-3 py-2 text-left font-mono text-[10px] text-muted-foreground"
              >
                {skill.path}
              </div>
              <div className="flex gap-2">
                <Link
                  href={`/skills/${encodeURIComponent(skill.id)}`}
                  className="inline-flex min-h-10 flex-1 items-center justify-center rounded-full bg-primary px-4 text-sm font-medium text-primary-foreground"
                >
                  {text({ en: 'Open skill', ar: 'عرض المهارة' })}
                </Link>
                <button
                  type="button"
                  aria-label={text({ en: 'Download skill', ar: 'تحميل المهارة' })}
                  disabled={busy !== null}
                  onClick={() => download(skill.id, `${skill.name}.zip`, [skill])}
                  className="flex size-10 shrink-0 items-center justify-center rounded-full border border-border bg-background/55 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-60"
                >
                  <Download className="size-4" />
                </button>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  )
}
