import {
  BookOpen,
  Bot,
  Boxes,
  Braces,
  Download,
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
    title: 'Get the repository',
    titleAr: 'الحصول على المستودع',
    description: 'Clone the canonical Vercel repository and stay on the canary development branch.',
    descriptionAr: 'استنسخ مستودع Vercel الرسمي وابق على فرع التطوير canary.',
    commands: [
      'git clone --branch canary https://github.com/vercel/next.js.git',
      'cd next.js && corepack enable && pnpm install',
      'git pull --ff-only origin canary',
    ],
  },
  {
    icon: Bot,
    title: 'Start coding agents',
    titleAr: 'تشغيل وكلاء البرمجة',
    description: 'Start agents from the repository root so they can discover repository guidance and local skills.',
    descriptionAr: 'شغّل الوكلاء من جذر المستودع حتى يكتشفوا التعليمات والمهارات المحلية.',
    commands: [
      'codex',
      'claude',
      'hermes chat',
      'cursor .',
    ],
  },
  {
    icon: Boxes,
    title: 'Inspect and install skills',
    titleAr: 'فحص وتثبيت المهارات',
    description: 'List skill manifests and copy them into an agent-specific directory when you need a portable installation.',
    descriptionAr: 'اعرض ملفات المهارات وانسخها إلى مجلد الوكيل المناسب عند الحاجة إلى تثبيت مستقل.',
    commands: [
      'find .agents/skills -maxdepth 2 -name SKILL.md -print',
      'mkdir -p .claude/skills && cp -R .agents/skills/<skill-name> .claude/skills/',
      'mkdir -p ~/.hermes/skills/nextjs && cp -R .agents/skills/<skill-name> ~/.hermes/skills/nextjs/',
      'mkdir -p .agents/skills && cp -R /path/to/<skill-name> .agents/skills/',
    ],
  },
  {
    icon: PackageOpen,
    title: 'Build Next.js',
    titleAr: 'بناء Next.js',
    description: 'Use focused builds during iteration and a full build when switching branches or touching native code.',
    descriptionAr: 'استخدم البناء المحدد أثناء التطوير والبناء الكامل عند تبديل الفروع أو تعديل الكود الأصلي.',
    commands: [
      'pnpm --filter=next dev',
      'pnpm --filter=next build',
      'pnpm build-all',
      'pnpm --filter=next types',
    ],
  },
  {
    icon: TestTube2,
    title: 'Run tests',
    titleAr: 'تشغيل الاختبارات',
    description: 'Use the mode-specific test commands that match Turbopack, Webpack and production behavior.',
    descriptionAr: 'استخدم أوامر الاختبار المطابقة لوضع Turbopack أو Webpack أو الإنتاج.',
    commands: [
      'pnpm test-dev-turbo test/path/to/test.ts',
      'pnpm test-dev-webpack test/path/to/test.ts',
      'pnpm test-start-turbo test/path/to/test.ts',
      'pnpm test-start-webpack test/path/to/test.ts',
      'pnpm test-unit',
    ],
  },
  {
    icon: Workflow,
    title: 'GitHub workflows',
    titleAr: 'سير عمل GitHub',
    description: 'Inspect or dispatch workflows with the GitHub CLI when your account has permission.',
    descriptionAr: 'افحص أو شغّل سير العمل عبر GitHub CLI عندما يملك حسابك الصلاحية.',
    commands: [
      'gh workflow list --repo vercel/next.js',
      'gh run list --repo vercel/next.js --branch canary --limit 20',
      'gh workflow view <workflow-file> --repo vercel/next.js',
    ],
  },
  {
    icon: Braces,
    title: 'Agent guidance files',
    titleAr: 'ملفات إرشاد الوكلاء',
    description: 'Read the always-loaded repository policy before editing framework code.',
    descriptionAr: 'اقرأ سياسة المستودع الدائمة قبل تعديل كود الإطار.',
    commands: [
      'cat AGENTS.md',
      'cat .github/CLAUDE.md',
      'cat .agents/skills/README.md',
      'cat .conductor/README.md',
      'cat .cursor/commands/gt-workflow.md',
    ],
  },
]


const directoryGuide = [
  {
    path: '.agents/skills',
    title: 'Shared Agent Skills',
    titleAr: 'مهارات الوكلاء المشتركة',
    description: 'Cross-tool skill definitions used by coding agents to understand repository workflows.',
    descriptionAr: 'تعريفات مهارات مشتركة بين أدوات الوكلاء لفهم سير العمل داخل المستودع.',
    command: 'find .agents/skills -maxdepth 2 -name SKILL.md -print',
  },
  {
    path: '.cargo',
    title: 'Rust / Cargo configuration',
    titleAr: 'إعدادات Rust وCargo',
    description: 'Cargo configuration used by native Rust crates and compiler tooling.',
    descriptionAr: 'إعدادات Cargo المستخدمة مع حزم Rust الأصلية وأدوات المترجم.',
    command: 'find .cargo -maxdepth 2 -type f -print',
  },
  {
    path: '.claude-plugin',
    title: 'Claude plugin metadata',
    titleAr: 'بيانات إضافة Claude',
    description: 'Plugin metadata that makes repository capabilities discoverable to Claude Code.',
    descriptionAr: 'بيانات الإضافة التي تجعل قدرات المستودع قابلة للاكتشاف من Claude Code.',
    command: 'find .claude-plugin -maxdepth 3 -type f -print',
  },
  {
    path: '.claude',
    title: 'Claude Code workspace',
    titleAr: 'مساحة Claude Code',
    description: 'Claude Code project configuration, skill bridges and repository-local instructions.',
    descriptionAr: 'إعدادات Claude Code داخل المشروع وجسور المهارات والتعليمات المحلية.',
    command: 'find .claude -maxdepth 3 -type f -print',
  },
  {
    path: '.conductor',
    title: 'Parallel agent worktrees',
    titleAr: 'مساحات عمل الوكلاء المتوازية',
    description: 'Conductor setup for isolated worktrees and parallel Claude Code execution.',
    descriptionAr: 'إعداد Conductor لإنشاء worktrees معزولة وتشغيل Claude Code بالتوازي.',
    command: 'cat .conductor/README.md',
  },
  {
    path: '.config',
    title: 'Repository configuration',
    titleAr: 'إعدادات المستودع',
    description: 'Project-specific configuration files consumed by development and automation tooling.',
    descriptionAr: 'ملفات إعداد خاصة بالمشروع تستخدمها أدوات التطوير والأتمتة.',
    command: 'find .config -maxdepth 2 -type f -print',
  },
  {
    path: '.cursor',
    title: 'Cursor workflows',
    titleAr: 'سير عمل Cursor',
    description: 'Cursor commands and repository workflows, including Graphite-oriented development guidance.',
    descriptionAr: 'أوامر Cursor وسير عمل المستودع بما في ذلك تعليمات التطوير المرتبطة بـGraphite.',
    command: 'find .cursor -maxdepth 3 -type f -print',
  },
  {
    path: '.devcontainer',
    title: 'Development container',
    titleAr: 'حاوية التطوير',
    description: 'Dev Container configuration for reproducible editor and container environments.',
    descriptionAr: 'إعداد Dev Container للحصول على بيئة محرر وحاوية قابلة للتكرار.',
    command: 'find .devcontainer -maxdepth 2 -type f -print',
  },
  {
    path: '.github',
    title: 'GitHub automation & policy',
    titleAr: 'أتمتة وسياسات GitHub',
    description: 'Actions workflows, issue/PR configuration and repository policy such as CLAUDE.md.',
    descriptionAr: 'سير عمل Actions وإعدادات القضايا وطلبات الدمج وسياسات المستودع مثل CLAUDE.md.',
    command: 'find .github/workflows -maxdepth 1 -type f -print',
  },
  {
    path: '.husky',
    title: 'Git hooks',
    titleAr: 'خطافات Git',
    description: 'Repository Git hooks used to enforce local checks around commits and pushes.',
    descriptionAr: 'خطافات Git المستخدمة لفرض فحوصات محلية حول عمليات commit وpush.',
    command: 'find .husky -maxdepth 2 -type f -print',
  },
  {
    path: '.vscode',
    title: 'VS Code workspace',
    titleAr: 'مساحة VS Code',
    description: 'Editor settings, tasks and recommendations for contributors using VS Code.',
    descriptionAr: 'إعدادات المحرر والمهام والتوصيات للمساهمين الذين يستخدمون VS Code.',
    command: 'find .vscode -maxdepth 2 -type f -print',
  },
  {
    path: 'skills',
    title: 'Next.js framework skills',
    titleAr: 'مهارات إطار Next.js',
    description: 'Framework-specific skills for Cache Components, development loops and partial prefetching.',
    descriptionAr: 'مهارات مخصصة للإطار تشمل Cache Components ودورة التطوير وPartial Prefetching.',
    command: 'find skills -maxdepth 2 -name SKILL.md -print',
  },
]

export default function DocumentationPage() {
  return (
    <AppShell
      title="Next.js engineering documentation"
      titleAr="توثيق هندسة Next.js"
      subtitle="A practical command-first guide for developers and coding agents: repository access, skills, agent setup, builds, tests, workflows and the configuration surfaces visible in the source tree."
      subtitleAr="دليل عملي يعتمد على الأوامر للمطورين ووكلاء البرمجة: دخول المستودع والمهارات وإعداد الوكلاء والبناء والاختبارات وسير العمل وملفات الإعداد الموجودة في شجرة المصدر."
      eyebrow="Documentation hub"
      eyebrowAr="مركز التوثيق"
    >
      <GlassCard className="mb-8 overflow-hidden p-6 sm:p-8">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_.9fr] lg:items-center">
          <div>
            <span className="flex size-12 items-center justify-center rounded-[18px] bg-primary/10 text-primary">
              <BookOpen className="size-5" />
            </span>
            <Localized
              as="h2"
              en="From clone to verified change"
              ar="من الاستنساخ إلى التغيير المتحقق"
              className="mt-5 text-2xl font-semibold tracking-[-0.035em]"
            />
            <Localized
              as="p"
              en="Next Forge turns the repository's own AGENTS.md, skills, scripts, workflows and agent configuration into a navigable operational manual."
              ar="يحوّل Next Forge ملفات AGENTS.md والمهارات والسكربتات وسير العمل وإعدادات الوكلاء داخل المستودع إلى دليل تشغيلي قابل للتصفح."
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
                  <Localized
                    as="h3"
                    en={section.title}
                    ar={section.titleAr}
                    className="mt-5 font-semibold"
                  />
                  <Localized
                    as="p"
                    en={section.description}
                    ar={section.descriptionAr}
                    className="mt-2 text-sm leading-6 text-muted-foreground"
                  />
                </GlassCard>
                <div className="space-y-2">
                  {section.commands.map((command) => (
                    <CommandBlock key={command} command={command} />
                  ))}
                </div>
              </div>
            </section>
          )
        })}
      </div>

      <section className="mt-10">
        <SectionHeading
          eyebrow={<Localized en="Repository map" ar="خريطة المستودع" />}
          title={<Localized en="Agent and tooling directories" ar="مجلدات الوكلاء والأدوات" />}
          description={<Localized en="These are the configuration surfaces visible in the repository tree you provided. Each entry explains what it is for and gives a command to inspect it directly." ar="هذه هي أسطح الإعداد الظاهرة في شجرة المستودع التي أرسلتها. يوضح كل عنصر وظيفته ويعطي أمرًا لفحصه مباشرة." />}
        />
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {directoryGuide.map((item) => (
            <GlassCard key={item.path} className="p-5">
              <p className="font-mono text-xs font-semibold text-primary">{item.path}</p>
              <Localized as="h3" en={item.title} ar={item.titleAr} className="mt-3 font-semibold" />
              <Localized as="p" en={item.description} ar={item.descriptionAr} className="mt-2 min-h-16 text-sm leading-6 text-muted-foreground" />
              <div className="mt-4">
                <CommandBlock command={item.command} />
              </div>
            </GlassCard>
          ))}
        </div>
      </section>
    </AppShell>
  )
}
