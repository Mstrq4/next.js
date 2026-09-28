'use client'

import {
  BookOpen,
  Bot,
  Box,
  Braces,
  FolderTree,
  GitBranch,
  Layers3,
  ShieldCheck,
  Sparkles,
  TestTube2,
  Workflow,
} from 'lucide-react'
import Link from 'next/link'
import { CommandBox } from './copy-button'
import { useLocale } from './locale-provider'
import { GlassCard, Pill } from './ui'

type RootItem = {
  name: string
  path: string
  description: { en: string; ar: string }
  highlighted: boolean
}

export function DocumentationContent({
  rootCatalog,
}: {
  rootCatalog: RootItem[]
}) {
  const { text } = useLocale()

  const clone = 'git clone --branch canary https://github.com/Mstrq4/next.js.git && cd next.js'

  const sections = [
    {
      icon: GitBranch,
      title: { en: '1. Clone and bootstrap', ar: '1. الاستنساخ وتجهيز المشروع' },
      description: {
        en: 'Start from canary, install workspace dependencies, then run the repository bootstrap build before development.',
        ar: 'ابدأ من فرع canary وثبّت تبعيات مساحة العمل ثم نفّذ بناء التجهيز قبل بدء التطوير.',
      },
      commands: [
        clone,
        'corepack enable',
        'pnpm install',
        'pnpm build-all',
      ],
    },
    {
      icon: Bot,
      title: { en: '2. Enter with a coding agent', ar: '2. الدخول بواسطة وكيل برمجة' },
      description: {
        en: 'The cloned repository contains durable instructions and discoverable skills. Launch the agent from the repository root.',
        ar: 'يحتوي المستودع المستنسخ على تعليمات دائمة ومهارات قابلة للاكتشاف. شغّل الوكيل من جذر المستودع.',
      },
      commands: ['codex', 'claude', 'agent', 'hermes'],
    },
    {
      icon: Layers3,
      title: { en: '3. Fast development loop', ar: '3. دورة التطوير السريعة' },
      description: {
        en: 'The repository guide prefers the Next.js watch build for framework work, followed by the matching focused test command.',
        ar: 'يفضل دليل المستودع تشغيل بناء Next.js بالمراقبة ثم استخدام أمر الاختبار المطابق لنوع العمل.',
      },
      commands: [
        'pnpm --filter=next dev',
        'pnpm test-dev-turbo test/path/to/test.ts',
        'pnpm test-dev-webpack test/path/to/test.ts',
      ],
    },
    {
      icon: TestTube2,
      title: { en: '4. Production verification', ar: '4. التحقق في وضع الإنتاج' },
      description: {
        en: 'Choose the bundler explicitly when reproducing production behavior.',
        ar: 'اختر أداة الحزم صراحة عند إعادة إنتاج سلوك وضع الإنتاج.',
      },
      commands: [
        'pnpm test-start-turbo test/path/to/test.ts',
        'pnpm test-start-webpack test/path/to/test.ts',
        'pnpm --filter=next types',
      ],
    },
  ]

  const agentMatrix = [
    {
      name: 'Codex',
      path: 'AGENTS.md + $CODEX_HOME/skills',
      detail: {
        en: 'Reads repository instructions and supports installable Agent Skills.',
        ar: 'يقرأ تعليمات المستودع ويدعم مهارات Agent Skills القابلة للتثبيت.',
      },
      href: '/agents',
    },
    {
      name: 'Claude Code',
      path: '.claude/skills → .agents/skills',
      detail: {
        en: 'The repository exposes a shared skill surface and a Next.js plugin marketplace.',
        ar: 'يوفر المستودع سطح مهارات مشتركًا وسوق إضافة Next.js.',
      },
      href: '/agents',
    },
    {
      name: 'Cursor Agent',
      path: '.agents/skills + .cursor/',
      detail: {
        en: 'Discovers project skills automatically and adds Cursor-specific commands.',
        ar: 'يكتشف مهارات المشروع تلقائيًا ويضيف أوامر Cursor الخاصة.',
      },
      href: '/agents',
    },
    {
      name: 'Hermes Agent',
      path: '~/.hermes/skills',
      detail: {
        en: 'Can install individual public SKILL.md files directly from HTTPS.',
        ar: 'يمكنه تثبيت ملفات SKILL.md العامة منفردة مباشرة من HTTPS.',
      },
      href: '/agents',
    },
    {
      name: 'Conductor',
      path: '.conductor/',
      detail: {
        en: 'Parallel Claude Code worktrees with repository-provided setup/run scripts.',
        ar: 'مساحات Claude Code متوازية مع سكربتات إعداد وتشغيل من المستودع.',
      },
      href: '/agents',
    },
  ]

  return (
    <div className="space-y-10">
      <section>
        <GlassCard className="overflow-hidden p-6 sm:p-8">
          <div className="grid gap-7 xl:grid-cols-[1.25fr_.75fr] xl:items-end">
            <div>
              <Pill tone="violet">
                {text({ en: 'Start here', ar: 'ابدأ من هنا' })}
              </Pill>
              <h2 className="mt-4 text-2xl font-semibold tracking-[-0.035em] sm:text-3xl">
                {text({
                  en: 'From clone to a working agent session',
                  ar: 'من الاستنساخ إلى جلسة وكيل تعمل فعليًا',
                })}
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
                {text({
                  en: 'The commands below follow the repository’s own AGENTS.md guidance. Use the dedicated Skills and Agents pages when you need portable installations.',
                  ar: 'الأوامر أدناه مبنية على AGENTS.md الخاص بالمستودع نفسه. استخدم صفحات المهارات والوكلاء عندما تحتاج إلى تثبيتات قابلة للنقل.',
                })}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Link
                href="/skills"
                className="rounded-[18px] border border-border bg-background/45 p-4 text-sm font-medium transition-colors hover:bg-muted"
              >
                <Sparkles className="mb-4 size-4 text-primary" />
                {text({ en: 'Skills catalog', ar: 'كتالوج المهارات' })}
              </Link>
              <Link
                href="/agents"
                className="rounded-[18px] border border-border bg-background/45 p-4 text-sm font-medium transition-colors hover:bg-muted"
              >
                <Bot className="mb-4 size-4 text-primary" />
                {text({ en: 'Agent hub', ar: 'مركز الوكلاء' })}
              </Link>
              <Link
                href="/repository"
                className="rounded-[18px] border border-border bg-background/45 p-4 text-sm font-medium transition-colors hover:bg-muted"
              >
                <FolderTree className="mb-4 size-4 text-primary" />
                {text({ en: 'Repository explorer', ar: 'مستكشف المستودع' })}
              </Link>
              <Link
                href="/testing"
                className="rounded-[18px] border border-border bg-background/45 p-4 text-sm font-medium transition-colors hover:bg-muted"
              >
                <TestTube2 className="mb-4 size-4 text-primary" />
                {text({ en: 'Testing lab', ar: 'مختبر الاختبارات' })}
              </Link>
            </div>
          </div>
        </GlassCard>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        {sections.map((section) => {
          const Icon = section.icon
          return (
            <GlassCard key={section.title.en} className="p-5 sm:p-6">
              <div className="flex items-start gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-[15px] bg-primary/10 text-primary">
                  <Icon className="size-4.5" />
                </span>
                <div>
                  <h3 className="font-semibold">{text(section.title)}</h3>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    {text(section.description)}
                  </p>
                </div>
              </div>
              <div className="mt-5 space-y-3">
                {section.commands.map((command) => (
                  <CommandBox key={command} command={command} />
                ))}
              </div>
            </GlassCard>
          )
        })}
      </section>

      <section>
        <div className="mb-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary/70">
            {text({ en: 'Agent compatibility', ar: 'توافق الوكلاء' })}
          </p>
          <h2 className="mt-1 text-xl font-semibold sm:text-2xl">
            {text({ en: 'How agents consume this repository', ar: 'كيف تستخدم الوكلاء هذا المستودع' })}
          </h2>
        </div>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          {agentMatrix.map((agent) => (
            <Link key={agent.name} href={agent.href} className="group">
              <GlassCard className="h-full p-5 transition-transform group-hover:-translate-y-0.5">
                <Bot className="size-4 text-primary" />
                <h3 className="mt-4 text-sm font-semibold">{agent.name}</h3>
                <p dir="ltr" className="mt-2 break-all text-left font-mono text-[10px] text-primary/75">
                  {agent.path}
                </p>
                <p className="mt-3 text-xs leading-5 text-muted-foreground">
                  {text(agent.detail)}
                </p>
              </GlassCard>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary/70">
            {text({ en: 'Skill architecture', ar: 'بنية المهارات' })}
          </p>
          <h2 className="mt-1 text-xl font-semibold sm:text-2xl">
            {text({ en: 'Project skills and framework skills', ar: 'مهارات المشروع ومهارات الإطار' })}
          </h2>
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          <GlassCard className="p-5 sm:p-6">
            <Braces className="size-5 text-primary" />
            <h3 className="mt-5 font-semibold">.agents/skills/</h3>
            <p className="mt-2 text-sm leading-7 text-muted-foreground">
              {text({
                en: 'Repository-specific workflows for pull requests, runtime debugging, release testing, flags, Rspack, React vendoring, documentation and more. Each skill is a folder centered on SKILL.md.',
                ar: 'Workflows خاصة بالمستودع للـPRs وتصحيح Runtime واختبارات الإصدارات والـflags وRspack وReact vendoring والتوثيق وغيرها. كل مهارة عبارة عن مجلد محوره SKILL.md.',
              })}
            </p>
            <CommandBox command=".agents/skills/<skill-name>/SKILL.md" />
          </GlassCard>
          <GlassCard className="p-5 sm:p-6">
            <Box className="size-5 text-primary" />
            <h3 className="mt-5 font-semibold">skills/</h3>
            <p className="mt-2 text-sm leading-7 text-muted-foreground">
              {text({
                en: 'Official Next.js framework skills packaged for portable use and exposed through the Claude plugin marketplace.',
                ar: 'مهارات Next.js الرسمية المجهزة للاستخدام القابل للنقل والمكشوفة عبر سوق إضافات Claude.',
              })}
            </p>
            <CommandBox command="/plugin marketplace add Mstrq4/next.js" />
            <div className="mt-3">
              <CommandBox command="/plugin install nextjs@nextjs" />
            </div>
          </GlassCard>
        </div>
      </section>

      <section>
        <div className="mb-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary/70">
            {text({ en: 'Parallel engineering', ar: 'الهندسة المتوازية' })}
          </p>
          <h2 className="mt-1 text-xl font-semibold sm:text-2xl">
            {text({ en: 'Worktrees and Conductor', ar: 'Worktrees وConductor' })}
          </h2>
        </div>
        <GlassCard className="p-5 sm:p-6">
          <p className="max-w-3xl text-sm leading-7 text-muted-foreground">
            {text({
              en: 'For isolated parallel changes, use the repository’s .conductor workflow or create worktrees manually. The repository recommends keeping concurrency around 3–4 agents.',
              ar: 'للتعديلات المتوازية المعزولة استخدم Workflow الموجود داخل .conductor أو أنشئ worktrees يدويًا. يوصي المستودع بإبقاء التزامن في حدود 3–4 وكلاء.',
            })}
          </p>
          <div className="mt-5 grid gap-3 lg:grid-cols-2">
            <CommandBox command="git worktree add ../next.js-worktrees/my-feature -b my-feature-branch canary" />
            <CommandBox command="./.conductor/scripts/setup.sh" />
            <CommandBox command="git worktree list" />
            <CommandBox command="git worktree remove ../next.js-worktrees/my-feature" />
          </div>
        </GlassCard>
      </section>

      <section>
        <div className="mb-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary/70">
            {text({ en: 'Repository map', ar: 'خريطة المستودع' })}
          </p>
          <h2 className="mt-1 text-xl font-semibold sm:text-2xl">
            {text({ en: 'Configuration and engineering directories', ar: 'مجلدات الإعداد والهندسة' })}
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
            {text({
              en: 'This includes the agent and configuration directories shown in the repository tree, with live browsing available in Repository Explorer.',
              ar: 'يتضمن ذلك مجلدات الوكلاء والإعدادات الظاهرة في شجرة المستودع، ويمكن تصفحها فعليًا من مستكشف المستودع.',
            })}
          </p>
        </div>
        <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
          {rootCatalog.map((item) => (
            <Link
              key={item.path}
              href={`/repository?path=${encodeURIComponent(item.path)}`}
              className="group flex items-start gap-3 rounded-[18px] border border-border/70 bg-background/35 p-4 transition-colors hover:bg-muted/60"
            >
              <FolderTree className="mt-0.5 size-4 shrink-0 text-primary" />
              <span className="min-w-0">
                <span dir="ltr" className="block truncate text-left font-mono text-xs font-semibold">
                  {item.name}
                </span>
                <span className="mt-1 block text-xs leading-5 text-muted-foreground">
                  {text(item.description)}
                </span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <GlassCard className="p-5 sm:p-6">
          <ShieldCheck className="size-5 text-primary" />
          <h3 className="mt-5 font-semibold">
            {text({ en: 'Quality gates', ar: 'بوابات الجودة' })}
          </h3>
          <p className="mt-2 text-sm leading-7 text-muted-foreground">
            {text({
              en: 'Do not replace repository checks with hand-rolled TypeScript or source-text checks. Use the repository scripts and matching test mode.',
              ar: 'لا تستبدل فحوصات المستودع بفحوصات TypeScript يدوية أو تحليل نص المصدر. استخدم سكربتات المستودع ووضع الاختبار المطابق.',
            })}
          </p>
          <div className="mt-4 space-y-3">
            <CommandBox command="pnpm lint" />
            <CommandBox command="pnpm types" />
          </div>
        </GlassCard>

        <GlassCard className="p-5 sm:p-6">
          <Workflow className="size-5 text-primary" />
          <h3 className="mt-5 font-semibold">
            {text({ en: 'Automation', ar: 'الأتمتة' })}
          </h3>
          <p className="mt-2 text-sm leading-7 text-muted-foreground">
            {text({
              en: 'GitHub workflow definitions live under .github/workflows and are surfaced in the Workflows page with current status links.',
              ar: 'توجد تعريفات GitHub Actions داخل .github/workflows وتظهر في صفحة Workflows مع روابط الحالة الحالية.',
            })}
          </p>
          <Link
            href="/workflows"
            className="mt-4 inline-flex min-h-10 items-center rounded-full bg-primary px-4 text-sm font-medium text-primary-foreground"
          >
            {text({ en: 'Open workflows', ar: 'فتح سير العمل' })}
          </Link>
        </GlassCard>
      </section>
    </div>
  )
}
