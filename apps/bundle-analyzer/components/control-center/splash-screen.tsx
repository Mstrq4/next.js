'use client'

import { useEffect, useState } from 'react'
import { useI18n } from './i18n-provider'

export function SplashScreen() {
  const [visible, setVisible] = useState(false)
  const [leaving, setLeaving] = useState(false)
  const { t } = useI18n()

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const seen = sessionStorage.getItem('next-forge-splash')
    if (seen) return

    sessionStorage.setItem('next-forge-splash', '1')
    setVisible(true)

    const leaveTimer = window.setTimeout(() => setLeaving(true), reduceMotion ? 350 : 1450)
    const hideTimer = window.setTimeout(() => setVisible(false), reduceMotion ? 550 : 1850)

    return () => {
      window.clearTimeout(leaveTimer)
      window.clearTimeout(hideTimer)
    }
  }, [])

  if (!visible) return null

  return (
    <div
      className={`fixed inset-0 z-[200] flex items-center justify-center overflow-hidden bg-[#130018] text-white transition-all duration-500 ${
        leaving ? 'pointer-events-none scale-[1.015] opacity-0 blur-sm' : 'opacity-100'
      }`}
      role="status"
      aria-label={t('Loading Next Forge', 'جارٍ تشغيل Next Forge')}
    >
      <div className="nf-grid absolute inset-0 opacity-25" />
      <div className="absolute left-[12%] top-[10%] size-72 rounded-full bg-[#74317a]/25 blur-3xl" />
      <div className="absolute bottom-[5%] right-[10%] size-80 rounded-full bg-[#d7afd7]/15 blur-3xl" />

      <div className="relative flex w-full max-w-sm flex-col items-center px-8 text-center">
        <div className="relative flex size-24 items-center justify-center rounded-[32px] border border-white/10 bg-white/[0.06] shadow-[0_30px_100px_rgba(0,0,0,.35)] backdrop-blur-3xl">
          <div className="absolute inset-2 rounded-[26px] border border-white/5" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/next-forge-mark.png"
            alt=""
            width={74}
            height={74}
            className="relative size-[74px] object-contain drop-shadow-[0_12px_32px_rgba(222,192,239,.3)]"
          />
        </div>
        <h1 className="mt-6 text-2xl font-semibold tracking-[-0.045em]">Next Forge</h1>
        <p className="mt-2 text-xs tracking-[0.12em] text-[#d9c7dd]/65">
          {t('ENGINEERING INTELLIGENCE', 'ذكاء هندسي للمستودع')}
        </p>
        <div className="mt-8 h-1 w-44 overflow-hidden rounded-full bg-white/10">
          <div className="h-full w-full origin-left animate-[nf-splash-progress_1.4s_cubic-bezier(.22,1,.36,1)_forwards] rounded-full bg-gradient-to-r from-[#74317a] via-[#ad78b0] to-[#dec0ef]" />
        </div>
      </div>
    </div>
  )
}
