'use client'

import {
  Archive,
  BookOpen,
  Check,
  Download,
  FolderCode,
  Layers3,
  Search,
  Sparkles,
  TerminalSquare,
  X,
} from 'lucide-react'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import type { SkillCatalogItem } from '@/lib/control-center-data'
import { CommandBlock, CopyButton } from './copy-button'
import { ZipDownloadButton } from './zip-download-button'
import { useI18n } from './i18n-provider'
import { GlassCard, Pill } from './ui'

type Bundle = {
  name: string
  skills: SkillCatalogItem[]
  files: Array<{ path: string; url: string }>
}

type InstallTarget = 'shared' | 'claude' | 'codex' | 'hermes'
type Shell = 'bash' | 'powershell'

function targetPath(target: InstallTarget, shell: Shell) {
  if (target === 'shared') return '.agents/skills'
  if (target === 'claude') return '.claude/skills'
  if (target === 'codex') return shell === 'powershell' ? '$HOME\\.codex\\skills' : '$HOME/.codex/skills'
  return shell === 'powershell' ? '$HOME\\.hermes\\skills\\nextjs' : '$HOME/.hermes/skills/nextjs'
}

function bashInstall(items: SkillCatalogItem[], target: InstallTarget) {
  const paths = items.map((item) => `'${item.path}'`).join(' ')
  const destination = targetPath(target, 'bash')
  const copies = items
    .map((item) => `cp -R "$tmp/next.js/${item.path}" "${destination}/${item.slug}"`)
    .join(' && ')
  return `tmp="$(mktemp -d)" && git clone --depth 1 --filter=blob:none --sparse https://github.com/vercel/next.js.git "$tmp/next.js" && git -C "$tmp/next.js" sparse-checkout set ${paths} && mkdir -p "${destination}" && ${copies} && rm -rf "$tmp"`
}

function powershellInstall(items: SkillCatalogItem[], target: InstallTarget) {
  const paths = items.map((item) => `"${item.path}"`).join(' ')
  const destination = targetPath(target, 'powershell')
  const copies = items
    .map(
      (item) =>
        `Copy-Item -Recurse -Force (Join-Path $src "${item.path}") (Join-Path "${destination}" "${item.slug}")`
    )
    .join('; ')
  return `$src = Join-Path $env:TEMP ("nextjs-skills-" + [guid]::NewGuid()); git clone --depth 1 --filter=blob:none --sparse https://github.com/vercel/next.js.git $src; git -C $src sparse-checkout set ${paths}; New-Item -ItemType Directory -Force -Path "${destination}" | Out-Null; ${copies}; Remove-Item -Recurse -Force $src`
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
  const [target, setTarget] = useState<InstallTarget>('shared')
  const [shell, setShell] = useState<Shell>('bash')
  const [selected, setSelected] = useState<Set<string>>(() => new Set())

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return skills.filter((skill) => {
      const matchesBundle = bundle === 'All' || skill.bundle === bundle
      const matchesQuery =
        !needle ||
        skill.name.toLowerCase().includes(needle) ||
        skill.description.toLowerCase().includes(needle) ||
        skill.descriptionAr.toLowerCase().includes(needle) ||
        skill.path.toLowerCase().includes(needle)
      return matchesBundle && matchesQuery
    })
  }, [skills, query, bundle])

  const installItems =
    bundle === 'All'
      ? skills
      : bundles.find((item) => item.name === bundle)?.skills ?? filtered
  const installCommand =
    shell === 'bash'
      ? bashInstall(installItems, target)
      : powershellInstall(installItems, target)
  const allFiles = skills.flatMap((skill) => skill.files)
  const selectedItems = skills.filter((skill) => selected.has(skill.slug))
  const selectedFiles = selectedItems.flatMap((skill) => skill.files)
  const selectedCommand =
    selectedItems.length === 0
      ? ''
      : shell === 'bash'
        ? bashInstall(selectedItems, target)
        : powershellInstall(selectedItems, target)

  const toggleSelected = (slug: string) => {
    setSelected((current) => {
      const next = new Set(current)
      if (next.has(slug)) next.delete(slug)
      else next.add(slug)
      return next
    })
  }

  const selectFiltered = () => {
    setSelected((current) => {
      const next = new Set(current)
      for (const skill of filtered) next.add(skill.slug)
      return next
    })
  }

  const clearSelected = () => setSelected(new Set())

  const targetLabels: Array<{ id: InstallTarget; en: string; ar: string }> = [
    { id: 'shared', en: 'Project / Cursor shared', ar: 'المشروع / Cursor مشترك' },
    { id: 'claude', en: 'Claude Code project', ar: 'مشروع Claude Code' },
    { id: 'codex', en: 'Codex user skills', ar: 'مهارات Codex للمستخدم' },
    { id: 'hermes', en: 'Hermes user skills', ar: 'مهارات Hermes للمستخدم' },
  ]

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

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={selectFiltered}
          className="inline-flex min-h-9 items-center gap-2 rounded-full border border-border bg-background/55 px-3 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <Layers3 className="size-3.5" />
          {t('Select visible skills', 'تحديد المهارات الظاهرة')}
        </button>
        {selected.size > 0 ? (
          <>
            <span className="rounded-full bg-primary/10 px-3 py-2 text-xs font-medium text-primary">
              {t(`${selected.size} selected`, `${selected.size} محددة`)}
            </span>
            <button
              type="button"
              onClick={clearSelected}
              className="inline-flex min-h-9 items-center gap-2 rounded-full bg-muted px-3 text-xs font-medium text-muted-foreground"
            >
              <X className="size-3.5" />
              {t('Clear selection', 'مسح التحديد')}
            </button>
          </>
        ) : null}
      </div>

      {selectedItems.length > 0 ? (
        <GlassCard className="mb-7 border-primary/15 p-5 sm:p-6">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2">
                <Check className="size-4 text-primary" />
                <h2 className="font-semibold">{t('Custom skill bundle', 'حزمة مهارات مخصصة')}</h2>
                <Pill tone="violet">
                  {t(`${selectedItems.length} skills`, `${selectedItems.length} مهارة`)}
                </Pill>
              </div>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {t(
                  'Install or download exactly the skills you selected. The same agent target and shell choices below are reused here.',
                  'ثبّت أو نزّل المهارات التي حددتها فقط. يتم استخدام نفس الوكيل ونوع الطرفية المحددين أدناه.'
                )}
              </p>
            </div>
            <ZipDownloadButton
              files={selectedFiles}
              filename="nextjs-custom-skills.zip"
              label={t('Download selected', 'تنزيل المحدد')}
            />
          </div>
          <div className="mt-4">
            <CommandBlock
              title={t('Install selected skills', 'تثبيت المهارات المحددة')}
              command={selectedCommand}
            />
          </div>
        </GlassCard>
      ) : null}

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

      <GlassCard className="mb-7 p-5 sm:p-6">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2">
              <TerminalSquare className="size-4 text-primary" />
              <h2 className="font-semibold">{t('Install selected skill scope', 'تثبيت نطاق المهارات المحدد')}</h2>
              <Pill tone="violet">{bundle === 'All' ? t('All skills', 'كل المهارات') : bundle}</Pill>
            </div>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {t(
                'Choose an agent target and shell. The command sparse-checks out only the required skill folders from the official Vercel repository, copies them to the target skill directory, then removes the temporary checkout.',
                'اختر الوكيل ونوع الطرفية. يقوم الأمر بجلب مجلدات المهارات المطلوبة فقط من مستودع Vercel الرسمي ثم ينسخها إلى مجلد مهارات الوكيل ويحذف النسخة المؤقتة.'
              )}
            </p>
          </div>
          {bundle !== 'All' ? (
            <ZipDownloadButton
              files={bundles.find((item) => item.name === bundle)?.files ?? []}
              filename={'nextjs-' + bundle.toLowerCase().replaceAll(' ', '-') + '-skills.zip'}
              label={t('Download this bundle', 'تنزيل هذه الحزمة')}
            />
          ) : null}
        </div>

        <div className="mt-5 grid gap-3 lg:grid-cols-[1fr_auto]">
          <div className="flex flex-wrap gap-2">
            {targetLabels.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setTarget(item.id)}
                className={`rounded-full px-3 py-2 text-xs font-medium transition-colors ${
                  target === item.id
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {t(item.en, item.ar)}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            {(['bash', 'powershell'] as const).map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setShell(value)}
                className={`rounded-full px-3 py-2 font-mono text-[11px] transition-colors ${
                  shell === value
                    ? 'bg-primary/10 text-primary'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {value === 'bash' ? 'Bash' : 'PowerShell'}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4">
          <CommandBlock
            title={t(
              `Install ${installItems.length} skill(s)`,
              `تثبيت ${installItems.length} مهارة`
            )}
            command={installCommand}
          />
        </div>

        <div className="mt-4 grid gap-2 md:grid-cols-2">
          <CommandBlock title="Claude Code marketplace" command="/plugin marketplace add vercel/next.js" />
          <CommandBlock title="Claude Code Next.js plugin" command="/plugin install nextjs@nextjs" />
        </div>
      </GlassCard>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((skill) => (
          <article key={skill.path} className="nf-glass group flex min-h-[280px] flex-col rounded-[24px] p-5">
            <div className="flex items-start justify-between gap-3">
              <button
                type="button"
                onClick={() => toggleSelected(skill.slug)}
                aria-pressed={selected.has(skill.slug)}
                aria-label={selected.has(skill.slug) ? t('Remove from selection', 'إزالة من التحديد') : t('Add to selection', 'إضافة إلى التحديد')}
                className={`flex size-10 items-center justify-center rounded-[15px] transition-colors ${
                  selected.has(skill.slug)
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-primary/10 text-primary'
                }`}
              >
                {selected.has(skill.slug) ? <Check className="size-4.5" /> : <Sparkles className="size-4.5" />}
              </button>
              <span className="rounded-full bg-muted px-2.5 py-1 text-[10px] font-medium text-muted-foreground">
                {skill.bundle}
              </span>
            </div>

            <h3 className="mt-5 font-semibold tracking-[-0.02em]">{skill.name}</h3>
            <p className="mt-2 line-clamp-4 text-sm leading-6 text-muted-foreground">
              {t(skill.description, skill.descriptionAr)}
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
                <CopyButton
                  value={shell === 'bash' ? bashInstall([skill], target) : powershellInstall([skill], target)}
                  compact
                />
                <ZipDownloadButton files={skill.files} filename={skill.slug + '.zip'} compact />
              </div>
            </div>
          </article>
        ))}
      </div>
    </>
  )
}
