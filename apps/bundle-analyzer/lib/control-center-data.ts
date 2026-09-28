import fs from 'node:fs/promises'
import path from 'node:path'

const repoRoot = path.resolve(process.cwd(), '../..')

async function listDirectories(relativePath: string) {
  try {
    const entries = await fs.readdir(path.join(/* turbopackIgnore: true */ repoRoot, relativePath), {
      withFileTypes: true,
    })
    return entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name).sort()
  } catch {
    return []
  }
}

async function listFiles(relativePath: string, extension?: string) {
  try {
    const entries = await fs.readdir(path.join(/* turbopackIgnore: true */ repoRoot, relativePath), {
      withFileTypes: true,
    })
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
    const source = await fs.readFile(path.join(/* turbopackIgnore: true */ repoRoot, relativePath), 'utf8')
    return JSON.parse(source) as T
  } catch {
    return null
  }
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

const skillDescriptions: Record<string, string> = {
  'authoring-skills': 'Create and maintain agent skills with repository conventions.',
  'backport-pr': 'Backport selected pull requests across release branches.',
  'create-pr': 'Prepare and create review-ready pull requests.',
  'dce-edge': 'Debug dead-code elimination behavior in edge builds.',
  'deploy-release-test': 'Exercise release artifacts through deployment tests.',
  flags: 'Inspect and work with framework feature flags.',
  'gate-tests': 'Choose and run the correct test gates for a change.',
  'gh-stack': 'Work with stacked GitHub pull-request workflows.',
  'insight-error-page': 'Diagnose and improve framework error experiences.',
  'next-rspack': 'Develop and validate the Next.js Rspack integration.',
  'pr-status-triage': 'Triage pull-request CI and status checks.',
  'react-sync': 'Synchronize React canary versions used by Next.js.',
  'react-vendoring': 'Maintain React vendoring and built-in package boundaries.',
  'router-act': 'Work on router actions and navigation behavior.',
  'runtime-debug': 'Debug framework runtime behavior and regressions.',
  'sandbox-bench': 'Benchmark isolated sandbox and development scenarios.',
  'update-docs': 'Keep documentation aligned with implementation changes.',
  'v8-jit': 'Investigate JavaScript JIT and V8-sensitive performance.',
  'write-api-reference': 'Author API reference documentation.',
  'write-guide': 'Author high-quality framework guides.',
  'next-cache-components-adoption': 'Adopt Cache Components safely in App Router projects.',
  'next-cache-components-optimizer': 'Increase the useful static shell produced by Cache Components.',
  'next-dev-loop': 'Verify framework work against a live Next.js development loop.',
  'next-partial-prefetching-adoption': 'Adopt partial prefetching while preserving navigation behavior.',
  'next-partial-prefetching-optimizer': 'Optimize selected prefetch contracts after adoption.',
}

export async function getSkillCatalog() {
  const snapshot = await getRepoSnapshot()

  return [
    ...snapshot.agentSkills
      .filter((name) => name !== 'README.md')
      .map((name) => ({
        name,
        group: 'Agent skill',
        description: skillDescriptions[name] ?? 'Repository-aware development workflow.',
        path: `.agents/skills/${name}`,
      })),
    ...snapshot.frameworkSkills.map((name) => ({
      name,
      group: 'Framework skill',
      description: skillDescriptions[name] ?? 'Next.js framework workflow.',
      path: `skills/${name}`,
    })),
  ]
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
  }))
}
