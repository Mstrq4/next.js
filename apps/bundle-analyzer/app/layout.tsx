import type { Metadata } from 'next'
import type React from 'react'
import { I18nProvider } from '@/components/control-center/i18n-provider'
import { SplashScreen } from '@/components/control-center/splash-screen'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'Next Forge',
    template: '%s · Next Forge',
  },
  description:
    'A bilingual engineering control center and documentation hub for the Next.js repository, agents, skills, packages, tests, workflows and build toolchains.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const savedTheme = localStorage.getItem('next-forge-theme');
                  const dark = savedTheme ? savedTheme === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
                  document.documentElement.classList.toggle('dark', dark);
                  const savedLanguage = localStorage.getItem('next-forge-language');
                  const lang = savedLanguage === 'ar' ? 'ar' : 'en';
                  document.documentElement.lang = lang;
                  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
                } catch (_) {}
              })();
            `,
          }}
        />
      </head>
      <body className="font-sans antialiased">
        <I18nProvider>
          <SplashScreen />
          {children}
        </I18nProvider>
      </body>
    </html>
  )
}
