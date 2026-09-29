'use client'

import { Bot, Boxes, Code2, TerminalSquare } from 'lucide-react'
import { useMemo, useState } from 'react'
import { CommandBlock } from './copy-button'
import { useI18n } from './i18n-provider'

type SkillLite = {
  slug: string
  path: string
  bundle: string
  name: string
}

type BundleLite = {
  name: string
  skills: SkillLite[]
}

const targets = [
  {
    id: 'codex',
    name: 'Codex / Agent Skills',
    nameAr: 'Codex / Agent Skills',
    icon: Code2,
    target: '.agents/skills',
  },
  {
    id: 'claude',
    name: 'Claude Code',
    nameAr: 'Claude Code',
    icon: Bot,
    target: '.claude/skills',
  },
  {
    id: 'hermes',
    name: 'Hermes',
    nameAr: 'Hermes',
    icon: Boxes,
    target: '$HOME/.hermes/skills/nextjs',
  },
  {
    id: 'portable',
    name: 'Portable Agent Skills',
    nameAr: 'مهارات محمولة للوكلاء',
    icon: TerminalSquare,
    target: './skills',
  },
] as const

function buildInstallCommand(paths: string[], target: string) {
  const sparse = paths.join(' ')
  const copies = paths
    .map((source) => {
      const name = source.split('/').filter(Boolean).at(-1) ?? 'skill'
      return 'cp -R "$SRC/' + source + '" "$TARGET/' + name + '"'
    })
    .join('\n')

  return [
    'set -euo pipefail',
    'SRC="$(mktemp -d)"',
    'TARGET="' + target + '"',
    'git clone --depth 1 --filter=blob:none --sparse --branch canary https://github.com/vercel/next.js.git "$SRC"',
    'git -C "$SRC" sparse-checkout set ' + sparse,
    'mkdir -p "$TARGET"',
    copies,
    'rm -rf "$SRC"',
  ].join('\n')
}

export function SkillInstallMatrix({
  skills,
  bundles,
}: {
  skills: SkillLite[]
  bundles: BundleLite[]
}) {
  const { t } = useI18n()
  const [scope, setScope] = useState('all')
  const [target, setTarget] = useState<(typeof targets)[number]['id']>('codex')

  const selectedPaths = useMemo(() => {
    if (scope === 'all') return skills.map((skill) => skill.path)
    return bundles.find((bundle) => bundle.name === scope)?.skills.map((skill) => skill.path) ?? []
  }, [skills, bundles, scope])

  const selectedTarget = targets.find((item) => item.id === target) ?? targets[0]
  const command = buildInstallCommand(selectedPaths, selectedTarget.target)

  return (
    <section className="nf-glass mb-8 rounded-[26px] p-5 sm:p-6">
      <div className="grid gap-6 xl:grid-cols-[.8fr_1.2fr]">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.17em] text-primary/70">
            {t('Install matrix', 'مصفوفة التثبيت')}
          </p>
          <h2 className="mt-2 text-xl font-semibold tracking-[-0.03em]">
            {t('Install skills by bundle or all at once', 'ثبّت المهارات حسب الحزمة أو كلها دفعة واحدة')}
          </h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {t(
              'Choose a skill bundle and the target agent. Next Forge generates a reproducible sparse-checkout command from the official Vercel canary branch.',
              'اختر حزمة المهارات والوكيل المستهدف، وسيولد Next Forge أمر sparse-checkout قابلًا للتكرار من فرع canary الرسمي لدى Vercel.'
            )}
          </p>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <label className="text-xs font-medium text-muted-foreground">
              {t('Skill scope', 'نطاق المهارات')}
              <select
                value={scope}
                onChange={(event) => setScope(event.target.value)}
                className="mt-2 h-11 w-full rounded-[14px] border border-border bg-background/65 px-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring/40"
              >
                <option value="all">{t('All skills', 'جميع المهارات')} · {skills.length}</option>
                {bundles.map((bundle) => (
                  <option key={bundle.name} value={bundle.name}>
                    {bundle.name} · {bundle.skills.length}
                  </option>
                ))}
              </select>
            </label>

            <label className="text-xs font-medium text-muted-foreground">
              {t('Target agent', 'الوكيل المستهدف')}
              <select
                value={target}
                onChange={(event) => setTarget(event.target.value as (typeof targets)[number]['id'])}
                className="mt-2 h-11 w-full rounded-[14px] border border-border bg-background/65 px-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring/40"
              >
                {targets.map((item) => (
                  <option key={item.id} value={item.id}>
                    {t(item.name, item.nameAr)}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {targets.map((item) => {
              const Icon = item.icon
              return (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => setTarget(item.id)}
                  className={
                    'flex min-h-20 flex-col items-center justify-center gap-2 rounded-[16px] border text-center text-[11px] font-medium transition-colors ' +
                    (target === item.id
                      ? 'border-primary/30 bg-primary/10 text-primary'
                      : 'border-border bg-background/35 text-muted-foreground hover:bg-muted')
                  }
                >
                  <Icon className="size-4" />
                  <span>{t(item.name, item.nameAr)}</span>
                </button>
              )
            })}
          </div>
        </div>

        <div>
          <p className="mb-2 text-xs font-semibold text-foreground">
            {t('Generated install command', 'أمر التثبيت المولد')}
          </p>
          <CommandBlock command={command} />
          <p className="mt-3 text-[11px] leading-5 text-muted-foreground">
            {t(
              'Individual skill installation commands are available inside every skill detail page.',
              'أوامر تثبيت المهارات الفردية متاحة داخل صفحة تفاصيل كل مهارة.'
            )}
          </p>
        </div>
      </div>
    </section>
  )
}
