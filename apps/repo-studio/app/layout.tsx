import type { Metadata } from 'next'
import { AppShell } from '@/components/app-shell'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'Next Studio',
    template: '%s · Next Studio',
  },
  description: 'A visual control center for the Next.js framework repository.',
}

const themeBoot = `
  try {
    const saved = localStorage.getItem('next-studio-theme');
    const preferred = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    document.documentElement.dataset.theme = saved === 'light' || saved === 'dark' ? saved : preferred;
  } catch {}
`

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBoot }} />
      </head>
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  )
}
