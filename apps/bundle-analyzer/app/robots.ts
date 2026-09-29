import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: 'https://next-js-bundle-analyzer-umber.vercel.app/sitemap.xml',
    host: 'https://next-js-bundle-analyzer-umber.vercel.app',
  }
}
