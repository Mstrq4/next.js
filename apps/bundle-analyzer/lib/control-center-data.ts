import fs from 'node:fs/promises'
import path from 'node:path'

const repoRoot = path.resolve(process.cwd(), '../..')
export const upstreamRepo = 'vercel/next.js'
export const upstreamBranch = 'canary'

function repoPath(relativePath: string) {
  return path.join(/* turbopackIgnore: true */ repoRoot, relativePath)
}

async function listDirectories(relativePath: string) {
  try {
    const entries = await fs.readdir(repoPath(relativePath), { withFileTypes: true })
    return entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name).sort()
  } catch {
    return []
  }
}

async function listFiles(relativePath: string, extension?: string) {
  try {
    const entries = await fs.readdir(repoPath(relativePath), { withFileTypes: true })
    return entries
      .filter((entry) => entry.isFile() && (!extension || entry.name.endsWith(extension)))
      .map((entry) => entry.name)
      .sort()
  } catch {
    return []
  }
}

async function readJson<T>(relativePath: string): Promise<T | null> {
  try {
    const source = await fs.readFile(repoPath(relativePath), 'utf8')
    return JSON.parse(source) as T
  } catch {
    return null
  }
}

async function readText(relativePath: string): Promise<string | null> {
  try {
    return await fs.readFile(repoPath(relativePath), 'utf8')
  } catch {
    return null
  }
}

async function walkFiles(relativePath: string): Promise<string[]> {
  try {
    const entries = await fs.readdir(repoPath(relativePath), { withFileTypes: true })
    const nested = await Promise.all(
      entries.map(async (entry) => {
        const child = path.posix.join(relativePath, entry.name)
        if (entry.isDirectory()) return walkFiles(child)
        if (entry.isFile() || entry.isSymbolicLink()) return [child]
        return []
      })
    )
    return nested.flat().sort()
  } catch {
    return []
  }
}

function parseFrontmatter(source: string) {
  const match = source.match(/^---\s*\n([\s\S]*?)\n---\s*\n?/)
  const fields: Record<string, string> = {}
  if (!match) return { fields, body: source }

  const lines = match[1].split('\n')
  for (let index = 0; index < lines.length; index++) {
    const line = lines[index]
    const field = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/)
    if (!field) continue
    const key = field[1]
    let value = field[2].trim()

    if (value === '>' || value === '|') {
      const parts: string[] = []
      for (index += 1; index < lines.length; index++) {
        const continuation = lines[index]
        if (/^[A-Za-z0-9_-]+:\s*/.test(continuation)) {
          index -= 1
          break
        }
        parts.push(continuation.trim())
      }
      value = parts.filter(Boolean).join(' ')
    }

    fields[key] = value.replace(/^['"]|['"]$/g, '')
  }

  return { fields, body: source.slice(match[0].length).trim() }
}

function firstParagraph(markdown: string) {
  const clean = markdown
    .replace(/^#.*$/gm, '')
    .replace(/\x60\x60\x60[\s\S]*?\x60\x60\x60/g, '')
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')
    .replace(/[*_>#-]/g, '')
    .trim()
  return clean.split(/\n\s*\n/)[0]?.replace(/\s+/g, ' ').trim() ?? ''
}

function rawUrl(filePath: string) {
  return 'https://raw.githubusercontent.com/' + upstreamRepo + '/' + upstreamBranch + '/' + filePath
}

type RootPackage = {
  packageManager?: string
  scripts?: Record<string, string>
  devDependencies?: Record<string, string>
}

type WorkspacePackage = {
  name?: string
  version?: string
  description?: string
  private?: boolean
}

export type SkillCatalogItem = {
  slug: string
  name: string
  group: 'Agent skill' | 'Framework skill'
  bundle: string
  description: string
  descriptionAr: string
  path: string
  content: string
  files: Array<{ path: string; url: string }>
}

const bundles: Record<string, string[]> = {
  Delivery: ['backport-pr', 'create-pr', 'deploy-release-test', 'gh-stack', 'pr-status-triage'],
  Runtime: [
    'dce-edge',
    'flags',
    'gate-tests',
    'next-rspack',
    'react-sync',
    'react-vendoring',
    'router-act',
    'runtime-debug',
    'sandbox-bench',
    'v8-jit',
  ],
  Documentation: ['authoring-skills', 'insight-error-page', 'update-docs', 'write-api-reference', 'write-guide'],
}

const skillDescriptionsAr: Record<string, string> = {
  'authoring-skills': 'إرشادات إنشاء وصيانة مهارات الوكلاء داخل مستودع Next.js وفق بنية SKILL.md المعتمدة.',
  'backport-pr': 'سير عمل لنقل تغييرات Pull Request محددة إلى فروع إصدارات سابقة بأمان.',
  'create-pr': 'إرشادات تجهيز Pull Request قابل للمراجعة مع الوصف والفحوصات والأدلة المطلوبة.',
  'dce-edge': 'تشخيص سلوك إزالة الكود غير المستخدم في بيئات Edge والبناء المرتبط بها.',
  'deploy-release-test': 'اختبار مخرجات الإصدارات من خلال مسارات نشر وتجارب إصدار فعلية.',
  flags: 'فحص والعمل مع Feature Flags الخاصة بإطار Next.js.',
  'gate-tests': 'اختيار وتشغيل بوابات الاختبار المناسبة بحسب نوع التغيير في المستودع.',
  'gh-stack': 'العمل مع Pull Requests متسلسلة ومكدسة باستخدام GitHub وGraphite.',
  'insight-error-page': 'تشخيص وتحسين تجربة صفحات الخطأ في Next.js وأدوات التطوير.',
  'next-rspack': 'تطوير واختبار تكامل Next.js مع Rspack ومسارات التحقق المرتبطة به.',
  'pr-status-triage': 'تحليل حالات Pull Request ونتائج CI وتحديد سبب الفشل والخطوة التالية.',
  'react-sync': 'مزامنة إصدارات React canary المستخدمة داخل مساحة عمل Next.js.',
  'react-vendoring': 'صيانة حدود حزم React المضمنة وآلية vendoring داخل الإطار.',
  'router-act': 'العمل على Router Actions وسلوك التنقل والتحديث داخل Next.js.',
  'runtime-debug': 'تشخيص أخطاء بيئة تشغيل الإطار والانحدارات السلوكية أثناء التطوير.',
  'sandbox-bench': 'تشغيل وقياس سيناريوهات Sandbox والتطوير المعزولة ومقارنة الأداء.',
  'update-docs': 'تحديث توثيق Next.js بحيث يظل متوافقًا مع التغييرات البرمجية الحالية.',
  'v8-jit': 'تحليل تأثيرات V8 وJIT على الأداء والسلوك الحساس لتحسينات JavaScript.',
  'write-api-reference': 'إنشاء مراجع API واضحة ومتوافقة مع أسلوب توثيق Next.js.',
  'write-guide': 'إنشاء أدلة استخدام عملية عالية الجودة لمزايا وسلوكيات Next.js.',
  'next-cache-components-adoption': 'اعتماد Cache Components بأمان داخل مشاريع App Router مع الحفاظ على السلوك المتوقع.',
  'next-cache-components-optimizer': 'تحسين Cache Components لزيادة الجزء الثابت المفيد وتقليل العمل الديناميكي غير الضروري.',
  'next-dev-loop': 'التحقق من تطوير Next.js عبر دورة تطوير حية تشمل التشغيل والملاحظة وإعادة الاختبار.',
  'next-partial-prefetching-adoption': 'اعتماد Partial Prefetching مع الحفاظ على سلوك التنقل والتحميل المتوقع.',
  'next-partial-prefetching-optimizer': 'تحسين عقود Partial Prefetching بعد الاعتماد لرفع الكفاءة وتقليل الجلب غير الضروري.',
}

function skillDescriptionAr(slug: string) {
  return skillDescriptionsAr[slug] ?? 'سير عمل هندسي واعٍ بالمستودع ومخصص لتطوير Next.js والعمل مع أدواته ووكلائه.'
}

function bundleForSkill(name: string, group: SkillCatalogItem['group']) {
  if (group === 'Framework skill') return 'Next.js application'
  for (const [bundle, names] of Object.entries(bundles)) {
    if (names.includes(name)) return bundle
  }
  return 'Repository'
}

async function loadSkill(
  slug: string,
  group: SkillCatalogItem['group'],
  basePath: string
): Promise<SkillCatalogItem> {
  const skillPath = basePath + '/' + slug
  const source = (await readText(skillPath + '/SKILL.md')) ?? ''
  const parsed = parseFrontmatter(source)
  const files = await walkFiles(skillPath)

  return {
    slug,
    name: parsed.fields.name || slug,
    group,
    bundle: bundleForSkill(slug, group),
    description:
      parsed.fields.description ||
      firstParagraph(parsed.body) ||
      'Repository-aware development workflow.',
    descriptionAr: skillDescriptionAr(slug),
    path: skillPath,
    content: source,
    files: files.map((filePath) => ({ path: filePath, url: rawUrl(filePath) })),
  }
}

export async function getRepoSnapshot() {
  const [agentSkills, frameworkSkills, packages, workflows, rustCrates, turbopackCrates, rootPackage] =
    await Promise.all([
      listDirectories('.agents/skills'),
      listDirectories('skills'),
      listDirectories('packages'),
      listFiles('.github/workflows', '.yml'),
      listDirectories('crates'),
      listDirectories('turbopack/crates'),
      readJson<RootPackage>('package.json'),
    ])

  const scripts = rootPackage?.scripts ?? {}
  const tests = Object.keys(scripts).filter((key) => key.startsWith('test'))

  return {
    agentSkills,
    frameworkSkills: frameworkSkills.filter((name) => !name.startsWith('.')),
    packages,
    workflows,
    rustCrates,
    turbopackCrates,
    scripts,
    tests,
    packageManager: rootPackage?.packageManager ?? 'pnpm',
    versions: {
      next: rootPackage?.devDependencies?.next ?? 'workspace:*',
      react: rootPackage?.devDependencies?.react ?? '19',
      typescript: rootPackage?.devDependencies?.typescript ?? '6',
      turbo: rootPackage?.devDependencies?.turbo ?? '2',
      rspack: rootPackage?.devDependencies?.['@rspack/core'] ?? '1',
    },
  }
}

export async function getSkillCatalog(): Promise<SkillCatalogItem[]> {
  const snapshot = await getRepoSnapshot()
  const skills = await Promise.all([
    ...snapshot.agentSkills.map((name) => loadSkill(name, 'Agent skill', '.agents/skills')),
    ...snapshot.frameworkSkills.map((name) => loadSkill(name, 'Framework skill', 'skills')),
  ])
  return skills.sort((a, b) => a.name.localeCompare(b.name))
}

export async function getSkillDetail(slug: string) {
  const skills = await getSkillCatalog()
  return skills.find((skill) => skill.slug === slug) ?? null
}

export async function getSkillBundles() {
  const skills = await getSkillCatalog()
  const grouped = new Map<string, SkillCatalogItem[]>()
  for (const skill of skills) {
    const current = grouped.get(skill.bundle) ?? []
    current.push(skill)
    grouped.set(skill.bundle, current)
  }
  return [...grouped.entries()].map(([name, items]) => ({
    name,
    skills: items,
    files: items.flatMap((skill) => skill.files),
  }))
}

export type AgentIntegration = {
  slug: string
  name: string
  role: string
  roleAr: string
  description: string
  descriptionAr: string
  paths: string[]
  files: Array<{ path: string; url: string }>
  commands: Array<{ label: string; labelAr?: string; command: string }>
}

const agentCommandLabelsAr: Record<string, string> = {
  'Start Claude in the repository': 'تشغيل Claude داخل المستودع',
  'Inspect repository guidance': 'قراءة تعليمات المستودع',
  'Add the official Next.js plugin marketplace': 'إضافة متجر Next.js الرسمي',
  'Install the official Next.js plugin': 'تثبيت إضافة Next.js الرسمية',
  'List project skills': 'عرض مهارات المشروع',
  'Open Codex in the checkout': 'تشغيل Codex داخل نسخة المستودع',
  'Read repository guidance': 'قراءة تعليمات المستودع',
  'List repository skills': 'عرض مهارات المستودع',
  'Install project skills into the Codex user library': 'تثبيت مهارات المشروع في مكتبة Codex للمستخدم',
  'Trust repository-local Agent Skills': 'السماح بمهارات Agent Skills المحلية',
  'Start Hermes in the repository': 'تشغيل Hermes داخل المستودع',
  'List available Hermes skills': 'عرض مهارات Hermes المتاحة',
  'Install project skills into Hermes': 'تثبيت مهارات المشروع داخل Hermes',
  'Open the repository in Cursor': 'فتح المستودع في Cursor',
  'Read the Graphite workflow': 'قراءة سير عمل Graphite',
  'List shared Agent Skills': 'عرض Agent Skills المشتركة',
  'Inspect Cursor project commands': 'فحص أوامر مشروع Cursor',
  'Run workspace setup': 'تشغيل إعداد مساحة العمل',
  'Run the development workspace': 'تشغيل مساحة عمل التطوير',
  'List worktrees': 'عرض worktrees',
  'Prune stale worktrees': 'تنظيف worktrees القديمة',
}

async function filesForPaths(paths: string[]) {
  const files = (
    await Promise.all(
      paths.map(async (item) => {
        try {
          const stat = await fs.lstat(repoPath(item))
          if (stat.isDirectory()) return walkFiles(item)
          return [item]
        } catch {
          return []
        }
      })
    )
  ).flat()
  return files.map((filePath) => ({ path: filePath, url: rawUrl(filePath) }))
}

export async function getAgentIntegrations(): Promise<AgentIntegration[]> {
  const definitions: Omit<AgentIntegration, 'files'>[] = [
    {
      slug: 'claude-code',
      name: 'Claude Code',
      role: 'Native repository skills + plugin marketplace',
      roleAr: 'مهارات المستودع الأصلية + متجر الإضافة',
      description:
        'Uses the repository-local .claude/skills bridge, the Next.js Claude plugin marketplace, and CLAUDE.md guidance.',
      descriptionAr:
        'يستخدم جسر .claude/skills المحلي ومتجر إضافة Next.js وإرشادات CLAUDE.md.',
      paths: ['.claude', '.claude-plugin', '.github/CLAUDE.md'],
      commands: [
        { label: 'Start Claude in the repository', command: 'claude' },
        { label: 'Inspect repository guidance', command: 'cat AGENTS.md && cat .github/CLAUDE.md' },
        { label: 'Add the official Next.js plugin marketplace', command: '/plugin marketplace add vercel/next.js' },
        { label: 'Install the official Next.js plugin', command: '/plugin install nextjs@nextjs' },
        { label: 'List project skills', command: 'find .claude/skills -maxdepth 2 -name SKILL.md -print' },
      ],
    },
    {
      slug: 'codex',
      name: 'Codex',
      role: 'AGENTS.md + shared Agent Skills',
      roleAr: 'AGENTS.md + مهارات Agent Skills المشتركة',
      description:
        'Reads repository guidance from AGENTS.md and can use the cross-tool .agents/skills convention for reusable workflows.',
      descriptionAr:
        'يقرأ تعليمات المستودع من AGENTS.md ويمكنه استخدام .agents/skills كسطح مشترك للمهارات.',
      paths: ['AGENTS.md', '.agents/skills'],
      commands: [
        { label: 'Open Codex in the checkout', command: 'codex' },
        { label: 'Read repository guidance', command: 'cat AGENTS.md' },
        { label: 'List repository skills', command: 'find .agents/skills -maxdepth 2 -name SKILL.md -print' },
        { label: 'Install project skills into the Codex user library', command: 'mkdir -p ~/.codex/skills && cp -R .agents/skills/* ~/.codex/skills/' },
      ],
    },
    {
      slug: 'hermes',
      name: 'Hermes Agent',
      role: 'Project-local Agent Skills interoperability',
      roleAr: 'توافق مباشر مع مهارات المشروع المحلية',
      description:
        'Hermes recognizes project-local .agents/skills and can also scan shared external skill directories.',
      descriptionAr:
        'يتعرف Hermes على .agents/skills داخل المشروع ويمكنه كذلك فحص مجلدات مهارات مشتركة خارجية.',
      paths: ['.agents/skills', 'AGENTS.md'],
      commands: [
        { label: 'Trust repository-local Agent Skills', command: 'hermes skills trust' },
        { label: 'Start Hermes in the repository', command: 'hermes chat' },
        { label: 'List available Hermes skills', command: 'hermes skills list' },
        { label: 'Install project skills into Hermes', command: 'mkdir -p ~/.hermes/skills/nextjs && cp -R .agents/skills/* ~/.hermes/skills/nextjs/' },
      ],
    },
    {
      slug: 'cursor',
      name: 'Cursor',
      role: 'Repository commands and worktree configuration',
      roleAr: 'أوامر المستودع وإعدادات worktree',
      description:
        'Uses repository-local Cursor commands and worktree configuration, including the Graphite workflow command.',
      descriptionAr:
        'يستخدم أوامر Cursor وإعدادات worktree الموجودة داخل المستودع بما فيها سير عمل Graphite.',
      paths: ['.cursor'],
      commands: [
        { label: 'Open the repository in Cursor', command: 'cursor .' },
        { label: 'Read the Graphite workflow', command: 'cat .cursor/commands/gt-workflow.md' },
        { label: 'List shared Agent Skills', command: 'find .agents/skills -maxdepth 2 -name SKILL.md -print' },
        { label: 'Inspect Cursor project commands', command: 'find .cursor/commands -maxdepth 2 -type f -print' },
      ],
    },
    {
      slug: 'conductor',
      name: 'Conductor',
      role: 'Parallel Claude Code worktrees',
      roleAr: 'مساحات عمل متوازية لـ Claude Code',
      description:
        'Creates isolated worktrees for multiple Claude Code agents with repository setup and run scripts.',
      descriptionAr:
        'ينشئ worktrees معزولة لعدة وكلاء Claude Code مع سكربتات إعداد وتشغيل خاصة بالمستودع.',
      paths: ['.conductor'],
      commands: [
        { label: 'Run workspace setup', command: './.conductor/scripts/setup.sh' },
        { label: 'Run the development workspace', command: './.conductor/scripts/run.sh' },
        { label: 'List worktrees', command: 'git worktree list' },
        { label: 'Prune stale worktrees', command: 'git worktree prune' },
      ],
    },
  ]

  return Promise.all(
    definitions.map(async (definition) => ({
      ...definition,
      commands: definition.commands.map((item) => ({
        ...item,
        labelAr: agentCommandLabelsAr[item.label] ?? item.label,
      })),
      files: await filesForPaths(definition.paths),
    }))
  )
}

export async function getAgentIntegration(slug: string) {
  const agents = await getAgentIntegrations()
  return agents.find((agent) => agent.slug === slug) ?? null
}

export async function getRepositorySurface() {
  const entries = await fs.readdir(repoRoot, { withFileTypes: true })
  const important = new Set([
    '.agents',
    '.cargo',
    '.claude-plugin',
    '.claude',
    '.conductor',
    '.config',
    '.cursor',
    '.devcontainer',
    '.github',
    '.husky',
    '.vscode',
    'apps',
    'crates',
    'docs',
    'examples',
    'packages',
    'scripts',
    'skills',
    'test',
    'turbopack',
    'AGENTS.md',
    'package.json',
    'pnpm-workspace.yaml',
    'turbo.json',
  ])

  return entries
    .filter((entry) => important.has(entry.name))
    .map((entry) => ({
      name: entry.name,
      type: entry.isDirectory() ? ('dir' as const) : ('file' as const),
      path: entry.name,
    }))
    .sort((a, b) => {
      if (a.type !== b.type) return a.type === 'dir' ? -1 : 1
      return a.name.localeCompare(b.name)
    })
}

export async function getPackageCatalog() {
  const packageDirs = await listDirectories('packages')
  return Promise.all(
    packageDirs.map(async (directory) => {
      const pkg = await readJson<WorkspacePackage>('packages/' + directory + '/package.json')
      return {
        directory,
        name: pkg?.name ?? directory,
        version: pkg?.version ?? 'workspace',
        description: pkg?.description ?? 'Core Next.js workspace package.',
        private: Boolean(pkg?.private),
      }
    })
  )
}

export async function getWorkflowCatalog() {
  const files = await listFiles('.github/workflows', '.yml')
  return files.map((file) => ({
    file,
    name: file
      .replace(/\.yml$/, '')
      .replaceAll('_', ' ')
      .replace(/\b\w/g, (letter) => letter.toUpperCase()),
    category:
      file.includes('release') || file.includes('deploy')
        ? 'Release'
        : file.includes('rspack')
          ? 'Rspack'
          : file.includes('turbo')
            ? 'Turbopack'
            : file.includes('test') || file.includes('build')
              ? 'CI'
              : 'Automation',
    githubUrl: 'https://github.com/' + upstreamRepo + '/actions/workflows/' + file,
    command: 'gh workflow run ' + file + ' --repo ' + upstreamRepo,
  }))
}
