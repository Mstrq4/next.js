import type { Metadata } from 'next'
import type React from 'react'
import { LocaleProvider } from '@/components/control-center/locale-provider'
import { SplashScreen } from '@/components/control-center/splash-screen'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'Next Forge',
    template: '%s · Next Forge',
  },
  description:
    'A bilingual engineering control center for the Next.js repository, agents, skills, packages, tests, workflows and build toolchains.',
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
                  const language = savedLanguage === 'ar' || savedLanguage === 'en'
                    ? savedLanguage
                    : (navigator.language || '').toLowerCase().startsWith('ar') ? 'ar' : 'en';
                  document.documentElement.lang = language;
                  document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
                  document.documentElement.dataset.locale = language;
                } catch (_) {}
              })();
            `,
          }}
        />
      </head>
      <body className="font-sans antialiased">
        <LocaleProvider>
          <SplashScreen />
          {children}
        </LocaleProvider>
      </body>
    </html>
  )
}
