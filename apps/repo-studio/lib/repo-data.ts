import fs from 'node:fs'
import path from 'node:path'
import { cache } from 'react'

export type CatalogItem = {
  name: string
  subtitle: string
  path: string
  meta?: string
  source?: string
  href?: string
}

export type RepoSnapshot = {
  nextVersion: string
  nodeEngine: string
  packageManager: string
  packages: CatalogItem[]
  frameworkModules: CatalogItem[]
  agentSkills: CatalogItem[]
  publicSkills: CatalogItem[]
  scripts: CatalogItem[]
  tests: CatalogItem[]
  benchmarks: CatalogItem[]
  docs: CatalogItem[]
  examples: CatalogItem[]
  rustCrates: CatalogItem[]
  turbopackCrates: CatalogItem[]
  repoAreas: CatalogItem[]
  counts: {
    packages: number
    frameworkModules: number
    skills: number
    scripts: number
    tests: number
    benchmarks: number
    docs: number
    examples: number
    rustCrates: number
  }
}

const ignoredDirectories = new Set([
  '.git',
  '.next',
  '.next-studio',
  'dist',
  'node_modules',
  'out',
  'target',
])

function findRepoRoot(start = process.cwd()) {
  let current = start
  for (let i = 0; i < 7; i += 1) {
    if (
      fs.existsSync(path.join(current, 'pnpm-workspace.yaml')) &&
      fs.existsSync(path.join(current, 'packages', 'next'))
    ) {
      return current
    }
    const parent = path.dirname(current)
    if (parent === current) break
    current = parent
  }
  return path.resolve(start, '../..')
}

const repoRoot = findRepoRoot()

function absolute(relativePath: string) {
  return path.join(repoRoot, relativePath)
}

function readJson<T>(relativePath: string, fallback: T): T {
  try {
    return JSON.parse(fs.readFileSync(absolute(relativePath), 'utf8')) as T
  } catch {
    return fallback
  }
}

function readText(relativePath: string) {
  try {
    return fs.readFileSync(absolute(relativePath), 'utf8')
  } catch {
    return ''
  }
}

function listDirectories(relativePath: string) {
  try {
    return fs
      .readdirSync(absolute(relativePath), { withFileTypes: true })
      .filter((entry) => entry.isDirectory() && !ignoredDirectories.has(entry.name))
      .map((entry) => entry.name)
      .sort((a, b) => a.localeCompare(b))
  } catch {
    return []
  }
}

function countFiles(relativePath: string) {
  const start = absolute(relativePath)
  if (!fs.existsSync(start)) return 0
  let count = 0
  const stack = [start]

  while (stack.length) {
    const current = stack.pop()
    if (!current) continue
    let entries: fs.Dirent[] = []
    try {
      entries = fs.readdirSync(current, { withFileTypes: true })
    } catch {
      continue
    }
    for (const entry of entries) {
      if (ignoredDirectories.has(entry.name)) continue
      if (entry.isDirectory()) stack.push(path.join(current, entry.name))
      else if (entry.isFile()) count += 1
    }
  }

  return count
}

function githubUrl(relativePath: string) {
  return 'https://github.com/Mstrq4/next.js/tree/canary/' + relativePath
}

function parseSkill(skillPath: string, source: string): CatalogItem {
  const content = readText(skillPath)
  const fallbackName = path.basename(path.dirname(skillPath))
  const nameMatch = content.match(/^name:\s*["']?([^"'\n]+)["']?\s*$/m)
  const lines = content.split('\n')
  const descriptionIndex = lines.findIndex((line) => line.trimStart().startsWith('description:'))
  let description = ''

  if (descriptionIndex >= 0) {
    const line = lines[descriptionIndex]
    const after = line.split('description:').slice(1).join('description:').trim()
    if (after && after !== '>' && after !== '|') {
      description = after.replace(/^["']|["']$/g, '')
    } else {
      const collected: string[] = []
      for (let i = descriptionIndex + 1; i < lines.length; i += 1) {
        const candidate = lines[i]
        if (!candidate.startsWith(' ') && candidate.trim() !== '') break
        if (candidate.trim()) collected.push(candidate.trim())
      }
      description = collected.join(' ')
    }
  }

  return {
    name: (nameMatch?.[1] || fallbackName).trim(),
    subtitle: description || 'Agent workflow and repository guidance.',
    path: skillPath,
    source,
    href: githubUrl(skillPath),
  }
}

function catalogFromDirectory(relativePath: string, subtitle: string) {
  return listDirectories(relativePath).map((name) => ({
    name,
    subtitle,
    path: relativePath + '/' + name,
    meta: countFiles(relativePath + '/' + name) + ' files',
    href: githubUrl(relativePath + '/' + name),
  }))
}

function buildSnapshot(): RepoSnapshot {
  const rootPackage = readJson<any>('package.json', {})
  const nextPackage = readJson<any>('packages/next/package.json', {})

  const packages = listDirectories('packages')
    .filter((name) => fs.existsSync(absolute('packages/' + name + '/package.json')))
    .map((name) => {
      const manifest = readJson<any>('packages/' + name + '/package.json', {})
      return {
        name: manifest.name || name,
        subtitle: manifest.description || (manifest.private ? 'Private workspace package' : 'Next.js workspace package'),
        path: 'packages/' + name,
        meta: manifest.version || (manifest.private ? 'private' : 'workspace'),
        href: githubUrl('packages/' + name),
      }
    })

  const frameworkModules = listDirectories('packages/next/src').map((name) => ({
    name,
    subtitle: 'Core Next.js source module',
    path: 'packages/next/src/' + name,
    meta: countFiles('packages/next/src/' + name) + ' files',
    href: githubUrl('packages/next/src/' + name),
  }))

  const agentSkills = listDirectories('.agents/skills')
    .filter((name) => fs.existsSync(absolute('.agents/skills/' + name + '/SKILL.md')))
    .map((name) => parseSkill('.agents/skills/' + name + '/SKILL.md', '.agents'))

  const publicSkills = listDirectories('skills')
    .filter((name) => fs.existsSync(absolute('skills/' + name + '/SKILL.md')))
    .map((name) => parseSkill('skills/' + name + '/SKILL.md', 'skills'))

  const scripts = Object.entries(rootPackage.scripts || {})
    .map(([name, command]) => ({
      name,
      subtitle: String(command),
      path: 'package.json#scripts',
      meta: name.includes('test') ? 'test' : name.includes('build') ? 'build' : name.includes('lint') ? 'quality' : 'script',
      href: githubUrl('package.json'),
    }))
    .sort((a, b) => a.name.localeCompare(b.name))

  const tests = catalogFromDirectory('test', 'Next.js test suite')
  const benchmarks = catalogFromDirectory('bench', 'Performance benchmark workspace')
  const docs = catalogFromDirectory('docs', 'Documentation section')
  const examples = catalogFromDirectory('examples', 'Example Next.js application')
  const rustCrates = catalogFromDirectory('crates', 'Rust crate used by Next.js tooling')
  const turbopackCrates = catalogFromDirectory('turbopack/crates', 'Turbopack Rust crate')

  const repoAreas = [
    ['packages', 'Published and internal JavaScript packages'],
    ['turbopack', 'Rust-based incremental bundler'],
    ['crates', 'Rust crates and native bindings'],
    ['test', 'Integration and regression suites'],
    ['examples', 'Example Next.js applications'],
    ['docs', 'Framework documentation'],
    ['scripts', 'Build and maintenance automation'],
    ['skills', 'Public agent skills'],
    ['.agents/skills', 'Repository engineering agent workflows'],
    ['apps', 'Repository-owned applications'],
  ].map(([name, subtitle]) => ({
    name,
    subtitle,
    path: name,
    meta: countFiles(name) + ' files',
    href: githubUrl(name),
  }))

  return {
    nextVersion: nextPackage.version || 'canary',
    nodeEngine: rootPackage.engines?.node || '>=20.9.0',
    packageManager: rootPackage.packageManager || 'pnpm',
    packages,
    frameworkModules,
    agentSkills,
    publicSkills,
    scripts,
    tests,
    benchmarks,
    docs,
    examples,
    rustCrates,
    turbopackCrates,
    repoAreas,
    counts: {
      packages: packages.length,
      frameworkModules: frameworkModules.length,
      skills: agentSkills.length + publicSkills.length,
      scripts: scripts.length,
      tests: tests.reduce((sum, item) => sum + Number.parseInt(item.meta || '0', 10), 0),
      benchmarks: benchmarks.length,
      docs: docs.length,
      examples: examples.length,
      rustCrates: rustCrates.length + turbopackCrates.length,
    },
  }
}

export const getRepoSnapshot = cache(buildSnapshot)
