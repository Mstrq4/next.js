import {
  BookOpen,
  Bot,
  Boxes,
  Braces,
  FolderTree,
  GitBranch,
  PackageOpen,
  TestTube2,
  Workflow,
} from 'lucide-react'
import { AppShell } from '@/components/control-center/app-shell'
import { CommandBlock } from '@/components/control-center/copy-button'
import { Localized } from '@/components/control-center/i18n-provider'
import { GlassCard, SectionHeading } from '@/components/control-center/ui'

const sections = [
  {
    icon: GitBranch,
    title: 'Get and bootstrap the repository',
    titleAr: 'الحصول على المستودع وتجهيزه',
    description: 'Clone the canonical Vercel source, stay on canary and install the monorepo dependencies.',
    descriptionAr: 'استنسخ مصدر Vercel الرسمي وابق على فرع canary وثبّت تبعيات المستودع الأحادي.',
    commands: [
      { title: 'Bash / macOS / Linux', command: 'git clone --branch canary https://github.com/vercel/next.js.git && cd next.js && corepack enable && pnpm install' },
      { title: 'PowerShell / Windows', command: 'git clone --branch canary https://github.com/vercel/next.js.git; Set-Location next.js; corepack enable; pnpm install' },
      { title: 'Update canary', command: 'git pull --ff-only origin canary' },
      { title: 'Bootstrap after branch changes', command: 'pnpm build-all' },
    ],
  },
  {
    icon: Bot,
    title: 'Enter with coding agents',
    titleAr: 'الدخول بواسطة وكلاء البرمجة',
    description: 'Launch agents from the repository root so they can discover AGENTS.md, project skills and tool-specific configuration.',
    descriptionAr: 'شغّل الوكلاء من جذر المستودع حتى يكتشفوا AGENTS.md ومهارات المشروع وإعدادات كل أداة.',
    commands: [
      { title: 'Codex', command: 'codex' },
      { title: 'Claude Code', command: 'claude' },
      { title: 'Hermes', command: 'hermes chat' },
      { title: 'Cursor', command: 'cursor .' },
      { title: 'Read universal guidance', command: 'cat AGENTS.md' },
    ],
  },
  {
    icon: Boxes,
    title: 'Skills and Claude plugin',
    titleAr: 'المهارات وإضافة Claude',
    description: 'The repository exposes shared Agent Skills plus an official Claude Code plugin marketplace backed by the skills/ directory.',
    descriptionAr: 'يوفر المستودع مهارات Agent Skills مشتركة، إضافة إلى متجر Claude Code رسمي مبني على مجلد skills/.',
    commands: [
      { title: 'List repository Agent Skills', command: 'find .agents/skills -maxdepth 2 -name SKILL.md -print' },
      { title: 'Claude marketplace', command: '/plugin marketplace add vercel/next.js' },
      { title: 'Claude Next.js plugin', command: '/plugin install nextjs@nextjs' },
      { title: 'Codex user skills', command: 'mkdir -p ~/.codex/skills && cp -R .agents/skills/* ~/.codex/skills/' },
      { title: 'Claude project skills', command: 'mkdir -p .claude/skills && cp -R .agents/skills/* .claude/skills/' },
      { title: 'Trust Hermes project skills', command: 'hermes skills trust' },\n      { title: 'Hermes user skills', command: 'mkdir -p ~/.hermes/skills/nextjs && cp -R .agents/skills/* ~/.hermes/skills/nextjs/' },\n      { title: 'List Hermes skills', command: 'hermes skills list' },
      { title: 'Windows Codex skills', command: 'New-Item -ItemType Directory -Force -Path "$HOME\.codex\skills" | Out-Null; Copy-Item -Recurse -Force ".agents\skills\*" "$HOME\.codex\skills\"' },
    ],
  },
  {
    icon: PackageOpen,
    title: 'Build Next.js',
    titleAr: 'بناء Next.js',
    description: 'Use watch mode for fast framework iteration, focused builds for core changes, and build-all for a full bootstrap.',
    descriptionAr: 'استخدم وضع المراقبة للتطوير السريع، والبناء المحدد لتغييرات النواة، وbuild-all للتجهيز الكامل.',
    commands: [
      { title: 'Watch framework', command: 'pnpm --filter=next dev' },
      { title: 'Build Next.js package', command: 'pnpm --filter=next build' },
      { title: 'Build JavaScript + Rust', command: 'pnpm build-all' },
      { title: 'Type check core', command: 'pnpm --filter=next types' },
      { title: 'Webpack production build', command: 'pnpm --filter=next exec next build --webpack' },
    ],
  },
  {
    icon: TestTube2,
    title: 'Testing and verification',
    titleAr: 'الاختبارات والتحقق',
    description: 'Match test mode to the runtime and bundler being changed. New test suites are generated with pnpm new-test.',
    descriptionAr: 'طابق وضع الاختبار مع بيئة التشغيل وأداة الحزم التي تعدّلها. تُنشأ الاختبارات الجديدة بواسطة pnpm new-test.',
    commands: [
      { title: 'Dev + Turbopack', command: 'pnpm test-dev-turbo test/path/to/test.ts' },
      { title: 'Dev + Webpack', command: 'pnpm test-dev-webpack test/path/to/test.ts' },
      { title: 'Production + Turbopack', command: 'pnpm test-start-turbo test/path/to/test.ts' },
      { title: 'Production + Webpack', command: 'pnpm test-start-webpack test/path/to/test.ts' },
      { title: 'Unit tests', command: 'pnpm test-unit' },
      { title: 'Generate E2E test', command: 'pnpm new-test --args true my-feature e2e' },
    ],
  },
  {
    icon: TestTube2,
    title: 'Next Forge live diagnostics',
    titleAr: 'تشخيصات Next Forge الحية',
    description: 'Use the deployed control center as a real operational surface: live repository analysis, side-by-side source comparison, route smoke checks and the original Next.js snapshot analyzer.',
    descriptionAr: 'استخدم لوحة التحكم المنشورة كسطح تشغيلي حقيقي: تحليل حي للمستودع، مقارنة جانبية للمصدر، فحوصات حية للمسارات، ومحلل Snapshot الأصلي في Next.js.',
    commands: [
      { title: 'Production control center', command: 'https://next-js-bundle-analyzer-umber.vercel.app/' },
      { title: 'Live repository analyzer', command: 'https://next-js-bundle-analyzer-umber.vercel.app/analyze' },
      { title: 'Live repository comparison', command: 'https://next-js-bundle-analyzer-umber.vercel.app/compare' },
      { title: 'Live browser smoke checks', command: 'https://next-js-bundle-analyzer-umber.vercel.app/testing' },
      { title: 'Skills catalog and ZIP downloads', command: 'https://next-js-bundle-analyzer-umber.vercel.app/skills' },
      { title: 'Agents and integration bundles', command: 'https://next-js-bundle-analyzer-umber.vercel.app/agents' },
      { title: 'Run Next Forge locally', command: 'pnpm --filter @next/bundle-analyzer-ui dev' },
      { title: 'Build Next Forge locally', command: 'pnpm --filter @next/bundle-analyzer-ui build' },
      { title: 'Production HTTP smoke', command: 'curl -I https://next-js-bundle-analyzer-umber.vercel.app/' },
    ],
  },
  {
    icon: Workflow,
    title: 'GitHub Actions and PR operations',
    titleAr: 'GitHub Actions وعمليات PR',
    description: 'Inspect current runs and workflows with GitHub CLI. Dispatch only workflows that support manual workflow_dispatch and when you have permission.',
    descriptionAr: 'افحص التشغيلات الحالية وسير العمل عبر GitHub CLI. شغّل يدويًا فقط ما يدعم workflow_dispatch وعندما تملك الصلاحية.',
    commands: [
      { title: 'List workflows', command: 'gh workflow list --repo vercel/next.js' },
      { title: 'Latest canary runs', command: 'gh run list --repo vercel/next.js --branch canary --limit 20' },
      { title: 'Inspect workflow', command: 'gh workflow view <workflow-file> --repo vercel/next.js' },
      { title: 'PR status skill', command: 'cat .agents/skills/pr-status-triage/SKILL.md' },
    ],
  },
  {
    icon: Braces,
    title: 'Agent guidance and parallel work',
    titleAr: 'إرشادات الوكلاء والعمل المتوازي',
    description: 'Read tool-specific instructions before editing. Conductor orchestrates parallel Claude Code worktrees and Cursor includes a Graphite workflow.',
    descriptionAr: 'اقرأ تعليمات كل أداة قبل التعديل. يدير Conductor مساحات Claude Code المتوازية، ويتضمن Cursor سير عمل Graphite.',
    commands: [
      { title: 'Agent Skills authoring guide', command: 'cat .agents/skills/README.md' },
      { title: 'Claude bridge', command: 'cat .github/CLAUDE.md' },
      { title: 'Claude marketplace manifest', command: 'cat .claude-plugin/marketplace.json' },
      { title: 'Cursor Graphite workflow', command: 'cat .cursor/commands/gt-workflow.md' },
      { title: 'Conductor guide', command: 'cat .conductor/README.md' },
      { title: 'Conductor setup', command: './.conductor/scripts/setup.sh' },
      { title: 'Conductor run', command: './.conductor/scripts/run.sh' },
      { title: 'List worktrees', command: 'git worktree list' },
    ],
  },
]

const folders = [
  { path: '.agents/skills', en: 'Deep repository workflows and reusable SKILL.md instructions.', ar: 'سير عمل متعمق للمستودع وتعليمات SKILL.md قابلة لإعادة الاستخدام.' },
  { path: '.cargo', en: 'Cargo configuration for the Rust workspace.', ar: 'إعدادات Cargo لمساحة عمل Rust.' },
  { path: '.claude-plugin', en: 'Official Claude Code plugin marketplace manifest for Next.js skills.', ar: 'بيان متجر إضافة Claude Code الرسمي لمهارات Next.js.' },
  { path: '.claude', en: 'Claude Code project integration; its skills bridge points to shared repository skills.', ar: 'تكامل Claude Code للمشروع، ويتصل بمجلد المهارات المشتركة.' },
  { path: '.conductor', en: 'Parallel Claude Code worktree orchestration, setup and run scripts.', ar: 'إدارة worktrees متوازية لـClaude Code مع سكربتات الإعداد والتشغيل.' },
  { path: '.config', en: 'Repository tooling configuration including ast-grep, nextest and Vercel approvers.', ar: 'إعدادات أدوات المستودع مثل ast-grep وnextest وإعدادات Vercel.' },
  { path: '.cursor', en: 'Cursor commands and worktree configuration, including the Graphite workflow.', ar: 'أوامر Cursor وإعدادات worktree بما فيها سير عمل Graphite.' },
  { path: '.devcontainer', en: 'Development container configuration.', ar: 'إعداد بيئة التطوير بالحاويات.' },
  { path: '.github', en: 'GitHub Actions, templates, scripts, agent guidance and repository automation.', ar: 'GitHub Actions والقوالب والسكربتات وإرشادات الوكلاء والأتمتة.' },
  { path: '.husky', en: 'Repository Git hooks.', ar: 'Git hooks الخاصة بالمستودع.' },
  { path: '.vscode', en: 'VS Code workspace recommendations and settings.', ar: 'إعدادات وتوصيات مساحة عمل VS Code.' },
  { path: 'skills', en: 'Portable official Next.js framework skills exposed by the Claude plugin.', ar: 'مهارات Next.js الرسمية القابلة للنقل والمكشوفة عبر إضافة Claude.' },
]

export default function DocumentationPage() {
  return (
    <AppShell
      title="Next.js engineering documentation"
      titleAr="توثيق هندسة Next.js"
      subtitle="A command-first operational manual for developers and coding agents: repository access, skills, agent setup, builds, tests, workflows and configuration surfaces."
      subtitleAr="دليل تشغيلي يعتمد على الأوامر للمطورين ووكلاء البرمجة: الوصول إلى المستودع والمهارات وإعداد الوكلاء والبناء والاختبارات وسير العمل وملفات الإعداد."
      eyebrow="Documentation hub"
      eyebrowAr="مركز التوثيق"
    >
      <GlassCard className="mb-8 overflow-hidden p-6 sm:p-8">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_.9fr] lg:items-center">
          <div>
            <span className="flex size-12 items-center justify-center rounded-[18px] bg-primary/10 text-primary">
              <BookOpen className="size-5" />
            </span>
            <Localized as="h2" en="From clone to verified change" ar="من الاستنساخ إلى التغيير المتحقق" className="mt-5 text-2xl font-semibold tracking-[-0.035em]" />
            <Localized
              as="p"
              en="Next Forge turns AGENTS.md, real skills, scripts, workflows and agent-specific configuration into a navigable operational manual with copy-ready commands."
              ar="يحوّل Next Forge ملفات AGENTS.md والمهارات الحقيقية والسكربتات وسير العمل وإعدادات الوكلاء إلى دليل تشغيلي قابل للتصفح مع أوامر جاهزة للنسخ."
              className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground"
            />
          </div>
          <CommandBlock command="git clone --branch canary https://github.com/vercel/next.js.git && cd next.js" />
        </div>
      </GlassCard>

      <div className="space-y-8">
        {sections.map((section) => {
          const Icon = section.icon
          return (
            <section key={section.title}>
              <SectionHeading
                eyebrow={<Localized en="Runbook" ar="دليل التشغيل" />}
                title={<Localized en={section.title} ar={section.titleAr} />}
                description={<Localized en={section.description} ar={section.descriptionAr} />}
              />
              <div className="grid gap-3 lg:grid-cols-[.7fr_1.3fr]">
                <GlassCard className="p-5">
                  <span className="flex size-10 items-center justify-center rounded-[15px] bg-primary/10 text-primary">
                    <Icon className="size-4.5" />
                  </span>
                  <Localized as="h3" en={section.title} ar={section.titleAr} className="mt-5 font-semibold" />
                  <Localized as="p" en={section.description} ar={section.descriptionAr} className="mt-2 text-sm leading-6 text-muted-foreground" />
                </GlassCard>
                <div className="space-y-2">
                  {section.commands.map((item) => (
                    <CommandBlock key={item.title + item.command} title={item.title} command={item.command} />
                  ))}
                </div>
              </div>
            </section>
          )
        })}
      </div>

      <GlassCard className="mt-10 p-6">
        <div className="flex items-center gap-3">
          <FolderTree className="size-5 text-primary" />
          <Localized as="h2" en="Agent and tooling directories" ar="مجلدات الوكلاء والأدوات" className="text-xl font-semibold tracking-[-0.025em]" />
        </div>
        <Localized
          as="p"
          en="These are the repository surfaces highlighted in the screenshots and used by Next.js development tooling."
          ar="هذه هي أسطح المستودع الظاهرة في الصور والمستخدمة بواسطة أدوات تطوير Next.js."
          className="mt-2 text-sm leading-6 text-muted-foreground"
        />
        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {folders.map((item) => (
            <div key={item.path} className="rounded-[18px] border border-border/70 bg-background/35 p-4">
              <p dir="ltr" className="text-left font-mono text-xs font-semibold text-primary">{item.path}</p>
              <Localized as="p" en={item.en} ar={item.ar} className="mt-2 text-xs leading-5 text-muted-foreground" />
            </div>
          ))}
        </div>
      </GlassCard>
    </AppShell>
  )
}
