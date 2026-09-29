const CACHE_NAME = 'next-forge-analyzer-data-v1'
const memoryFiles = new Map<string, Blob>()

function normalizeAnalyzerKey(relativePath: string) {
  const normalized = relativePath.replaceAll('\\', '/').replace(/^\/+/, '')
  const candidates = ['data/', 'history/']

  for (const candidate of candidates) {
    if (normalized.startsWith(candidate)) return '/' + normalized
    const marker = '/' + candidate
    const index = normalized.indexOf(marker)
    if (index >= 0) return normalized.slice(index)
  }

  return null
}

function requestKey(url: string) {
  if (typeof window === 'undefined') return null
  const parsed = new URL(url, window.location.origin)
  if (parsed.origin !== window.location.origin) return null
  if (!parsed.pathname.startsWith('/data/') && !parsed.pathname.startsWith('/history/')) {
    return null
  }
  return parsed.origin + parsed.pathname
}

export async function registerLocalAnalyzerFiles(files: File[]) {
  const mapped: Array<{ key: string; file: File }> = []

  for (const file of files) {
    const relative = file.webkitRelativePath || file.name
    const key = normalizeAnalyzerKey(relative)
    if (key) mapped.push({ key, file })
  }

  memoryFiles.clear()
  if (typeof window !== 'undefined' && 'caches' in window) {
    await window.caches.delete(CACHE_NAME)
  }

  const cache =
    typeof window !== 'undefined' && 'caches' in window
      ? await window.caches.open(CACHE_NAME)
      : null

  for (const item of mapped) {
    const absolute = window.location.origin + item.key
    memoryFiles.set(absolute, item.file)
    if (cache) {
      const headers = new Headers()
      if (item.key.endsWith('.json')) headers.set('content-type', 'application/json')
      else headers.set('content-type', 'application/octet-stream')
      await cache.put(absolute, new Response(item.file, { status: 200, headers }))
    }
  }

  localStorage.setItem(
    'next-forge-analyzer-local',
    JSON.stringify({ count: mapped.length, loadedAt: new Date().toISOString() })
  )

  return {
    count: mapped.length,
    paths: mapped.map((item) => item.key),
    hasData:
      mapped.some((item) => item.key === '/data/routes.json') &&
      mapped.some((item) => item.key === '/data/modules.data'),
    hasHistory: mapped.some((item) => item.key === '/history/history.json'),
  }
}

export async function getLocalAnalyzerResponse(url: string) {
  const key = requestKey(url)
  if (!key) return null

  const memory = memoryFiles.get(key)
  if (memory) return new Response(memory)

  if (typeof window !== 'undefined' && 'caches' in window) {
    const cache = await window.caches.open(CACHE_NAME)
    const cached = await cache.match(key)
    if (cached) return cached
  }

  return null
}

export async function clearLocalAnalyzerFiles() {
  memoryFiles.clear()
  if (typeof window !== 'undefined' && 'caches' in window) {
    await window.caches.delete(CACHE_NAME)
  }
  if (typeof window !== 'undefined') {
    localStorage.removeItem('next-forge-analyzer-local')
  }
}

export function getLocalAnalyzerMetadata() {
  if (typeof window === 'undefined') return null
  try {
    const value = localStorage.getItem('next-forge-analyzer-local')
    return value ? (JSON.parse(value) as { count: number; loadedAt: string }) : null
  } catch {
    return null
  }
}
