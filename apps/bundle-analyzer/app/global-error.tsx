'use client'

import { AlertOctagon, RotateCcw } from 'lucide-react'

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="en">
      <body>
        <div className="flex min-h-screen items-center justify-center bg-[#130018] p-4 text-[#f7eef9]">
          <div className="w-full max-w-lg rounded-[30px] border border-white/10 bg-white/[0.06] p-8 text-center shadow-2xl backdrop-blur-3xl">
            <span className="mx-auto flex size-14 items-center justify-center rounded-[20px] bg-[#e26083]/10 text-[#f08aa4]">
              <AlertOctagon className="size-6" />
            </span>
            <h1 className="mt-6 text-2xl font-semibold tracking-[-0.04em]">
              The console could not start.
            </h1>
            <p dir="rtl" className="mt-2 text-lg font-semibold">
              تعذّر تشغيل المنصة.
            </p>
            <p className="mt-3 text-sm leading-6 text-[#cdbbd1]">
              Retry the application shell. / أعد تشغيل واجهة التطبيق.
            </p>
            <button
              onClick={reset}
              className="mt-7 inline-flex min-h-10 items-center gap-2 rounded-full bg-[#d2a8d5] px-4 text-sm font-medium text-[#25002f]"
            >
              <RotateCcw className="size-4" />
              Restart / إعادة التشغيل
            </button>
          </div>
        </div>
      </body>
    </html>
  )
}
