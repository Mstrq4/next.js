'use client'

import { useEffect, useState } from 'react'
import { useLocale } from './locale-provider'

export function SplashScreen() {
  const { isArabic } = useLocale()
  const [visible, setVisible] = useState(false)
  const [leaving, setLeaving] = useState(false)

  useEffect(() => {
    if (sessionStorage.getItem('next-forge-splash-seen') === '1') return

    setVisible(true)
    sessionStorage.setItem('next-forge-splash-seen', '1')

    const leaveTimer = window.setTimeout(() => setLeaving(true), 1350)
    const removeTimer = window.setTimeout(() => setVisible(false), 1780)

    return () => {
      window.clearTimeout(leaveTimer)
      window.clearTimeout(removeTimer)
    }
  }, [])

  if (!visible) return null

  return (
    <div
      className={`nf-splash fixed inset-0 z-[200] flex items-center justify-center px-6 ${
        leaving ? 'nf-splash-leaving' : ''
      }`}
      role="status"
      aria-live="polite"
    >
      <div className="pointer-events-none absolute inset-0 nf-grid opacity-35" />
      <div className="pointer-events-none absolute left-[12%] top-[8%] size-72 rounded-full bg-[#ad78b0]/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-[4%] right-[8%] size-80 rounded-full bg-[#74317a]/24 blur-3xl" />

      <div className="relative flex flex-col items-center text-center">
        <div className="nf-splash-mark relative flex size-24 items-center justify-center rounded-[30px] border border-white/10 bg-[#25002f]/90 shadow-[0_30px_100px_rgba(37,0,47,.38)] backdrop-blur-3xl sm:size-28">
          {/* eslint-disable-next-line @next/next/no-img-element -- local brand mark */}
          <img
            src="/next-forge-mark.png"
            alt=""
            width={82}
            height={82}
            className="size-[72%] object-contain"
          />
          <span className="absolute inset-0 rounded-[30px] ring-1 ring-inset ring-white/10" />
        </div>

        <p className="mt-7 text-[11px] font-semibold uppercase tracking-[0.24em] text-primary/70">
          Next Forge
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-[-0.04em] sm:text-3xl">
          {isArabic ? 'مركز هندسة Next.js' : 'Next.js Engineering Console'}
        </h1>
        <p className="mt-2 max-w-md text-sm text-muted-foreground">
          {isArabic
            ? 'المهارات، الوكلاء، الاختبارات، الأدوات والتوثيق في مساحة واحدة.'
            : 'Skills, agents, tests, tooling and documentation in one workspace.'}
        </p>

        <div className="mt-7 h-1 w-48 overflow-hidden rounded-full bg-primary/10">
          <span className="nf-splash-progress block h-full rounded-full bg-gradient-to-r from-[#4f1059] via-[#ad78b0] to-[#dec0ef]" />
        </div>
      </div>
    </div>
  )
}
