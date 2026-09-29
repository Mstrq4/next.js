import type { Metadata, Viewport } from 'next'
import type React from 'react'
import { I18nProvider } from '@/components/control-center/i18n-provider'
import { SplashScreen } from '@/components/control-center/splash-screen'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://next-js-bundle-analyzer-umber.vercel.app'),
  applicationName: 'Next Forge',
  title: {
    default: 'Next Forge',
    template: '%s · Next Forge',
  },
  description:
    'A bilingual engineering control center and documentation hub for the Next.js repository, agents, skills, packages, tests, workflows and build toolchains.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    url: '/',
    title: 'Next Forge',
    description:
      'Engineering intelligence, skills, agents, repository analysis and operational documentation for Next.js.',
    siteName: 'Next Forge',
    images: [
      {
        url: '/next-forge-mark.png',
        width: 128,
        height: 128,
        alt: 'Next Forge',
      },
    ],
  },
  twitter: {
    card: 'summary',
    title: 'Next Forge',
    description:
      'Engineering intelligence, skills, agents, repository analysis and operational documentation for Next.js.',
    images: ['/next-forge-mark.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
  manifest: '/manifest.webmanifest',
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/next-forge-mark.png',
  },
  appleWebApp: {
    capable: true,
    title: 'Next Forge',
    statusBarStyle: 'black-translucent',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#fbf8fc' },
    { media: '(prefers-color-scheme: dark)', color: '#130018' },
  ],
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
