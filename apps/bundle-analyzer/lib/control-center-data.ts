import fs from 'node:fs/promises'
import path from 'node:path'

const repoRoot = path.resolve(process.cwd(), '../..')

async function listEntries(relativePath: string) {
  try {
    const entries = await fs.readdir(
      path.join(/* turbopackIgnore: true */ repoRoot, relativePath),
      { withFileTypes: true }
    )
    return entries.sort((a, b) => a.name.localeCompare(b.name))
  } catch {
    return []
  }
}

async function listDirectories(relativePath: string) {
  const entries = await listEntries(relativePath)
  return entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name)
}

async function listFiles(relativePath: string, extension?: string) {
  const entries = await listEntries(relativePath)
  return entries
    .filter((entry) => entry.isFile() && (!extension || entry.name.endsWith(extension)))
    .map((entry) => entry.name)
}

async function readText(relativePath: string): Promise<string | null> {
  try {
    return await fs.readFile(
      path.join(/* turbopackIgnore: true */ repoRoot, relativePath),
      'utf8'
    )
  } catch {
    return null
  }
}

async function readJson<T>(relativePath: string): Promise<T | null> {
  const source = await readText(relativePath)
  if (!source) return null
  try {
    return JSON.parse(source) as T
  } catch {
    return null
  }
}

async function pathExists(relativePath: string) {
  try {
    await fs.access(path.join(/* turbopackIgnore: true */ repoRoot, relativePath))
    return true
  } catch {
    return false
  }
}

async function walkFiles(relativePath: string, limit = 400): Promise<string[]> {
  const output: string[] = []

  async function walk(current: string) {
    if (output.length >= limit) return
    const entries = await listEntries(current)

    for (const entry of entries) {
      if (output.length >= limit) break
      const child = `${current}/${entry.name}`
      if (entry.isDirectory()) await walk(child)
      else if (entry.isFile() || entry.isSymbolicLink()) output.push(child)
    }
  }

  await walk(relativePath)
  return output
}

function parseFrontmatter(source: string) {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  if (!match) return {} as Record<string, string>

  const lines = match[1].split(/\r?\n/)
  const result: Record<string, string> = {}

  for (let index = 0; index < lines.length; index++) {
    const line = lines[index]
    const keyMatch = line.match(/^([a-zA-Z0-9_-]+):\s*(.*)$/)
    if (!keyMatch) continue

    const [, key, raw] = keyMatch
    if (raw === '>' || raw === '|') {
      const chunks: string[] = []
      let cursor = index + 1
      while (cursor < lines.length && (/^\s+/.test(lines[cursor]) || !lines[cursor].trim())) {
        chunks.push(lines[cursor].trim())
        cursor++
      }
      result[key] = chunks.filter(Boolean).join(raw === '>' ? ' ' : '\n')
      index = cursor - 1
    } else {
      result[key] = raw.replace(/^['"]|['"]$/g, '')
    }
  }

  return result
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
  id: string
  name: string
  source: 'repository' | 'framework'
  group: 'Agent skill' | 'Framework skill'
  description: string
  path: string
  mainFile: string
  files: string[]
  fileCount: number
  sourceContent?: string
}

async function readSkillDirectory(
  directory: string,
  source: SkillCatalogItem['source']
): Promise<SkillCatalogItem | null> {
  const mainFile = `${directory}/SKILL.md`
  const sourceContent = await readText(mainFile)
  if (!sourceContent) return null

  const meta = parseFrontmatter(sourceContent)
  const name = meta.name || path.basename(directory)
  const files = await walkFiles(directory)

  return {
    id: `${source}--${name}`,
    name,
    source,
    group: source === 'repository' ? 'Agent skill' : 'Framework skill',
    description:
      meta.description ||
      (source === 'repository'
        ? 'Repository-aware engineering workflow.'
        : 'Next.js framework workflow.'),
    path: directory,
    mainFile,
    files,
    fileCount: files.length,
  }
}

export async function getRepoSnapshot() {
  const [
    agentSkillDirs,
    frameworkSkillDirs,
    packages,
    workflows,
    rustCrates,
    turbopackCrates,
    rootPackage,
  ] = await Promise.all([
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
  const agentSkills = agentSkillDirs.filter((name) => !name.startsWith('.'))
  const frameworkSkills = frameworkSkillDirs.filter((name) => !name.startsWith('.'))

  return {
    agentSkills,
    frameworkSkills,
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

  const repositorySkills = await Promise.all(
    snapshot.agentSkills.map((name) =>
      readSkillDirectory(`.agents/skills/${name}`, 'repository')
    )
  )
  const frameworkSkills = await Promise.all(
    snapshot.frameworkSkills.map((name) =>
      readSkillDirectory(`skills/${name}`, 'framework')
    )
  )

  return [...repositorySkills, ...frameworkSkills]
    .filter((skill): skill is SkillCatalogItem => Boolean(skill))
    .sort((a, b) => a.name.localeCompare(b.name))
}

export async function getSkillDetail(id: string) {
  const catalog = await getSkillCatalog()
  const skill = catalog.find((item) => item.id === id)
  if (!skill) return null

  return {
    ...skill,
    sourceContent: (await readText(skill.mainFile)) ?? '',
  }
}

export async function getAllSkillIds() {
  return (await getSkillCatalog()).map((skill) => skill.id)
}

export async function getAllSkillFiles() {
  const skills = await getSkillCatalog()
  return Array.from(new Set(skills.flatMap((skill) => skill.files))).sort()
}

export async function getPackageCatalog() {
  const packageDirs = await listDirectories('packages')

  return Promise.all(
    packageDirs.map(async (directory) => {
      const pkg = await readJson<WorkspacePackage>(`packages/${directory}/package.json`)
      return {
        directory,
        name: pkg?.name ?? directory,
        version: pkg?.version ?? 'workspace',
        description: pkg?.description ?? 'Core Next.js workspace package.',
        private: Boolean(pkg?.private),
        path: `packages/${directory}`,
      }
    })
  )
}

export async function getWorkflowCatalog() {
  const files = await listFiles('.github/workflows', '.yml')
  return files.map((file) => ({
    file,
    path: `.github/workflows/${file}`,
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
  }))
}

const rootDescriptions: Record<string, { en: string; ar: string }> = {
  '.agents': {
    en: 'Repository-native Agent Skills used by coding agents.',
    ar: 'مهارات الوكلاء الأصلية الخاصة بالمستودع.',
  },
  '.cargo': {
    en: 'Cargo configuration for Rust crates and native tooling.',
    ar: 'إعدادات Cargo لحزم Rust والأدوات الأصلية.',
  },
  '.claude-plugin': {
    en: 'Claude Code plugin marketplace metadata for the Next.js skills.',
    ar: 'بيانات سوق إضافة Claude Code لمهارات Next.js.',
  },
  '.claude': {
    en: 'Claude Code project integration and shared skill discovery.',
    ar: 'تكامل Claude Code واكتشاف المهارات المشتركة.',
  },
  '.conductor': {
    en: 'Parallel Claude Code worktree orchestration.',
    ar: 'تنسيق مساحات العمل المتوازية لـClaude Code.',
  },
  '.config': {
    en: 'Repository-level lint, test and tooling configuration.',
    ar: 'إعدادات الفحص والاختبار والأدوات على مستوى المستودع.',
  },
  '.cursor': {
    en: 'Cursor commands and worktree configuration.',
    ar: 'أوامر Cursor وإعدادات مساحات العمل.',
  },
  '.devcontainer': {
    en: 'Development-container configuration.',
    ar: 'إعدادات حاوية التطوير.',
  },
  '.github': {
    en: 'GitHub Actions, repository policies, templates and automation.',
    ar: 'GitHub Actions والسياسات والقوالب والأتمتة.',
  },
  '.husky': {
    en: 'Git hooks managed with Husky.',
    ar: 'خطافات Git المدارة بواسطة Husky.',
  },
  '.vscode': {
    en: 'VS Code workspace configuration.',
    ar: 'إعدادات مساحة عمل VS Code.',
  },
  'apps': {
    en: 'Applications and internal developer tools.',
    ar: 'التطبيقات وأدوات المطور الداخلية.',
  },
  'crates': {
    en: 'Rust crates used by Next.js native components.',
    ar: 'حزم Rust المستخدمة في المكونات الأصلية لـNext.js.',
  },
  'docs': {
    en: 'Framework documentation source.',
    ar: 'مصدر توثيق إطار العمل.',
  },
  'examples': {
    en: 'Next.js example applications.',
    ar: 'تطبيقات أمثلة Next.js.',
  },
  'packages': {
    en: 'Published and internal JavaScript packages.',
    ar: 'حزم JavaScript المنشورة والداخلية.',
  },
  'scripts': {
    en: 'Build, release and repository maintenance scripts.',
    ar: 'سكربتات البناء والإصدار وصيانة المستودع.',
  },
  'skills': {
    en: 'Official Next.js framework skills and Claude plugin content.',
    ar: 'مهارات Next.js الرسمية ومحتوى إضافة Claude.',
  },
  'test': {
    en: 'Framework integration, development and production tests.',
    ar: 'اختبارات التكامل والتطوير والإنتاج للإطار.',
  },
  'turbopack': {
    en: 'Turbopack Rust workspace and compiler implementation.',
    ar: 'مساحة عمل Turbopack بلغة Rust وتنفيذ المترجم.',
  },
}

export async function getRepositoryRootCatalog() {
  const entries = await listEntries('.')

  return entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => ({
      name: entry.name,
      path: entry.name,
      description:
        rootDescriptions[entry.name] ?? {
          en: 'Repository directory.',
          ar: 'مجلد في المستودع.',
        },
      highlighted: Boolean(rootDescriptions[entry.name]),
    }))
    .sort((a, b) => {
      if (a.highlighted !== b.highlighted) return a.highlighted ? -1 : 1
      return a.name.localeCompare(b.name)
    })
}

export async function getAgentArtifactManifest() {
  const directories = [
    '.claude-plugin',
    '.claude',
    '.conductor',
    '.cursor',
  ]
  const individualFiles = ['AGENTS.md', '.github/AGENTS.md', '.agents/skills/README.md']

  const directoryFiles = await Promise.all(directories.map((directory) => walkFiles(directory)))
  const files = [...directoryFiles.flat(), ...individualFiles]

  return files.filter((file, index) => files.indexOf(file) === index && Boolean(file))
}

export async function getRepositoryGuides() {
  const [agentsGuide, skillGuide, conductorGuide, marketplace] = await Promise.all([
    readText('AGENTS.md'),
    readText('.agents/skills/README.md'),
    readText('.conductor/README.md'),
    readText('.claude-plugin/marketplace.json'),
  ])

  return {
    agentsGuide: agentsGuide ?? '',
    skillGuide: skillGuide ?? '',
    conductorGuide: conductorGuide ?? '',
    marketplace: marketplace ?? '',
  }
}

export async function getRepositoryCapabilityFlags() {
  return {
    claudeMarketplace: await pathExists('.claude-plugin/marketplace.json'),
    claudeSkillLink: await pathExists('.claude/skills'),
    cursorCommands: await pathExists('.cursor/commands'),
    conductor: await pathExists('.conductor/README.md'),
    agentSkills: await pathExists('.agents/skills/README.md'),
    frameworkSkills: await pathExists('skills'),
  }
}
