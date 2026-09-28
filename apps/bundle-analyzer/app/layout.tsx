import type { Metadata } from 'next'
import type React from 'react'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'Next Forge',
    template: '%s · Next Forge',
  },
  description:
    'A polished engineering control center for the Next.js repository, agents, skills, packages, tests, workflows and build toolchains.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const saved = localStorage.getItem('next-forge-theme');
                  const dark = saved ? saved === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
                  document.documentElement.classList.toggle('dark', dark);
                } catch (_) {}
              })();
            `,
          }}
        />
      </head>
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
