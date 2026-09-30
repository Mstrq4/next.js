export type IconName =
  | 'home'
  | 'layers'
  | 'package'
  | 'terminal'
  | 'sparkles'
  | 'flask'
  | 'gauge'
  | 'book'
  | 'git'
  | 'search'
  | 'sun'
  | 'moon'
  | 'menu'
  | 'x'
  | 'chevron'
  | 'copy'
  | 'check'
  | 'external'
  | 'cpu'
  | 'box'
  | 'code'
  | 'branch'
  | 'activity'
  | 'file'

export type NavItem = {
  href: string
  label: string
  shortLabel: string
  description: string
  icon: IconName
}

export const navItems: NavItem[] = [
  { href: '/', label: 'Overview', shortLabel: 'Home', description: 'Repository pulse and architecture summary', icon: 'home' },
  { href: '/framework', label: 'Framework', shortLabel: 'Core', description: 'Next.js source modules and runtime layers', icon: 'layers' },
  { href: '/packages', label: 'Packages', shortLabel: 'Packages', description: 'Workspace packages and published surfaces', icon: 'package' },
  { href: '/tooling', label: 'Toolchain', shortLabel: 'Tools', description: 'Scripts, compilers, bundlers and developer commands', icon: 'terminal' },
  { href: '/skills', label: 'Agents & Skills', shortLabel: 'Skills', description: 'Repository agent workflows and public skills', icon: 'sparkles' },
  { href: '/evals', label: 'Evals', shortLabel: 'Evals', description: 'Agent evaluation suites and upgrade scenarios', icon: 'activity' },
  { href: '/automation', label: 'Automation', shortLabel: 'CI', description: 'GitHub workflows, local actions and repository automation', icon: 'branch' },
  { href: '/testing', label: 'Test Lab', shortLabel: 'Tests', description: 'Test suites, modes and bundler coverage', icon: 'flask' },
  { href: '/benchmarks', label: 'Benchmarks', shortLabel: 'Bench', description: 'Performance labs and benchmark projects', icon: 'gauge' },
  { href: '/docs', label: 'Docs & Examples', shortLabel: 'Docs', description: 'Documentation areas and example applications', icon: 'book' },
  { href: '/repository', label: 'Repository Map', shortLabel: 'Repo', description: 'Monorepo anatomy, Rust crates and source areas', icon: 'git' },
]

export const quickCommands = [
  { label: 'Development', command: 'pnpm dev' },
  { label: 'Build all', command: 'pnpm build-all' },
  { label: 'Type check', command: 'pnpm types' },
  { label: 'Lint', command: 'pnpm lint' },
  { label: 'Unit tests', command: 'pnpm test-unit' },
  { label: 'Turbopack tests', command: 'pnpm test-dev-turbo' },
]
