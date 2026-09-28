'use client'

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

export type Locale = 'en' | 'ar'
export type Copy = string | { en: string; ar: string }

type LocaleContextValue = {
  locale: Locale
  isArabic: boolean
  setLocale: (locale: Locale) => void
  toggleLocale: () => void
  text: (value: Copy) => string
}

const LocaleContext = createContext<LocaleContextValue | null>(null)

export function resolveCopy(value: Copy, locale: Locale) {
  return typeof value === 'string' ? value : value[locale]
}

function applyLocale(locale: Locale) {
  document.documentElement.lang = locale
  document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr'
  document.documentElement.dataset.locale = locale
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en')

  useEffect(() => {
    const htmlLocale = document.documentElement.lang === 'ar' ? 'ar' : 'en'
    const saved = localStorage.getItem('next-forge-language')
    const nextLocale: Locale =
      saved === 'ar' || saved === 'en'
        ? saved
        : htmlLocale === 'ar' || navigator.language.toLowerCase().startsWith('ar')
          ? 'ar'
          : 'en'

    setLocaleState(nextLocale)
    applyLocale(nextLocale)
  }, [])

  const setLocale = (nextLocale: Locale) => {
    setLocaleState(nextLocale)
    applyLocale(nextLocale)
    localStorage.setItem('next-forge-language', nextLocale)
  }

  const value = useMemo<LocaleContextValue>(
    () => ({
      locale,
      isArabic: locale === 'ar',
      setLocale,
      toggleLocale: () => setLocale(locale === 'ar' ? 'en' : 'ar'),
      text: (copy) => resolveCopy(copy, locale),
    }),
    [locale]
  )

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
}

export function useLocale() {
  const value = useContext(LocaleContext)
  if (!value) throw new Error('useLocale must be used inside LocaleProvider')
  return value
}

export function LocalizedText({
  value,
  className,
}: {
  value: Copy
  className?: string
}) {
  const { text } = useLocale()
  return <span className={className}>{text(value)}</span>
}
