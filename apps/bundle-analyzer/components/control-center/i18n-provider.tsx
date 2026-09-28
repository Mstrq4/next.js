'use client'

import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'

type Language = 'en' | 'ar'

type I18nContextValue = {
  language: Language
  dir: 'ltr' | 'rtl'
  setLanguage: (language: Language) => void
  toggleLanguage: () => void
  t: (en: string, ar: string) => string
}

const I18nContext = createContext<I18nContextValue | null>(null)

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en')

  useEffect(() => {
    const saved = localStorage.getItem('next-forge-language')
    const initial: Language = saved === 'ar' ? 'ar' : 'en'
    setLanguageState(initial)
    document.documentElement.lang = initial
    document.documentElement.dir = initial === 'ar' ? 'rtl' : 'ltr'
  }, [])

  const setLanguage = (next: Language) => {
    setLanguageState(next)
    localStorage.setItem('next-forge-language', next)
    document.documentElement.lang = next
    document.documentElement.dir = next === 'ar' ? 'rtl' : 'ltr'
  }

  const value = useMemo<I18nContextValue>(
    () => ({
      language,
      dir: language === 'ar' ? 'rtl' : 'ltr',
      setLanguage,
      toggleLanguage: () => setLanguage(language === 'ar' ? 'en' : 'ar'),
      t: (en, ar) => (language === 'ar' ? ar : en),
    }),
    [language]
  )

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n() {
  const value = useContext(I18nContext)
  if (!value) throw new Error('useI18n must be used within I18nProvider')
  return value
}

export function Localized({
  en,
  ar,
  as: Tag = 'span',
  className,
}: {
  en: string
  ar: string
  as?: 'span' | 'p' | 'div' | 'h2' | 'h3'
  className?: string
}) {
  const { t } = useI18n()
  return <Tag className={className}>{t(en, ar)}</Tag>
}
