import type { MetadataRoute } from 'next'

const routes = [
  '',
  '/skills',
  '/agents',
  '/packages',
  '/repository',
  '/toolchain',
  '/testing',
  '/workflows',
  '/docs',
  '/analyze',
  '/compare',
]

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://next-js-bundle-analyzer-umber.vercel.app'
  return routes.map((route) => ({
    url: base + route,
    changeFrequency: route === '' ? 'daily' : 'weekly',
    priority: route === '' ? 1 : 0.8,
  }))
}
