import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Next Forge',
    short_name: 'Next Forge',
    description:
      'Bilingual engineering intelligence, documentation, skills, agents, workflows and analysis tools for the Next.js repository.',
    start_url: '/',
    display: 'standalone',
    background_color: '#130018',
    theme_color: '#25002f',
    orientation: 'any',
    icons: [
      {
        src: '/next-forge-mark.png',
        sizes: '128x128',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/next-forge-mark.png',
        sizes: '128x128',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  }
}
