'use client'

import { Archive, Download, LoaderCircle } from 'lucide-react'
import { useState } from 'react'
import { useI18n } from './i18n-provider'

export type ZipSourceFile = {
  path: string
  url: string
}

function crc32(bytes: Uint8Array) {
  let crc = 0xffffffff
  for (const byte of bytes) {
    crc ^= byte
    for (let bit = 0; bit < 8; bit++) {
      crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1))
    }
  }
  return (crc ^ 0xffffffff) >>> 0
}

function u16(value: number) {
  const out = new Uint8Array(2)
  new DataView(out.buffer).setUint16(0, value, true)
  return out
}

function u32(value: number) {
  const out = new Uint8Array(4)
  new DataView(out.buffer).setUint32(0, value >>> 0, true)
  return out
}

function concat(parts: Uint8Array[]) {
  const length = parts.reduce((sum, part) => sum + part.length, 0)
  const output = new Uint8Array(length)
  let offset = 0
  for (const part of parts) {
    output.set(part, offset)
    offset += part.length
  }
  return output
}

async function buildZip(files: Array<{ path: string; bytes: Uint8Array }>) {
  const encoder = new TextEncoder()
  const localParts: Uint8Array[] = []
  const centralParts: Uint8Array[] = []
  let offset = 0

  for (const file of files) {
    const name = encoder.encode(file.path.replaceAll('\\', '/'))
    const checksum = crc32(file.bytes)
    const flags = 0x0800

    const localHeader = concat([
      u32(0x04034b50),
      u16(20),
      u16(flags),
      u16(0),
      u16(0),
      u16(0),
      u32(checksum),
      u32(file.bytes.length),
      u32(file.bytes.length),
      u16(name.length),
      u16(0),
      name,
    ])

    localParts.push(localHeader, file.bytes)

    const centralHeader = concat([
      u32(0x02014b50),
      u16(20),
      u16(20),
      u16(flags),
      u16(0),
      u16(0),
      u16(0),
      u32(checksum),
      u32(file.bytes.length),
      u32(file.bytes.length),
      u16(name.length),
      u16(0),
      u16(0),
      u16(0),
      u16(0),
      u32(0),
      u32(offset),
      name,
    ])

    centralParts.push(centralHeader)
    offset += localHeader.length + file.bytes.length
  }

  const central = concat(centralParts)
  const end = concat([
    u32(0x06054b50),
    u16(0),
    u16(0),
    u16(files.length),
    u16(files.length),
    u32(central.length),
    u32(offset),
    u16(0),
  ])

  return concat([...localParts, central, end])
}

export function ZipDownloadButton({
  files,
  filename,
  label,
  compact = false,
}: {
  files: ZipSourceFile[]
  filename: string
  label?: string
  compact?: boolean
}) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { t } = useI18n()

  const download = async () => {
    if (!files.length || loading) return
    setLoading(true)
    setError(null)

    try {
      const downloaded = await Promise.all(
        files.map(async (file) => {
          const response = await fetch(file.url)
          if (!response.ok) throw new Error(`Failed to download ${file.path}`)
          return {
            path: file.path,
            bytes: new Uint8Array(await response.arrayBuffer()),
          }
        })
      )

      const zip = await buildZip(downloaded)
      const blob = new Blob([zip], { type: 'application/zip' })
      const url = URL.createObjectURL(blob)
      const anchor = document.createElement('a')
      anchor.href = url
      anchor.download = filename.endsWith('.zip') ? filename : `${filename}.zip`
      document.body.appendChild(anchor)
      anchor.click()
      anchor.remove()
      URL.revokeObjectURL(url)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Download failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={compact ? '' : 'inline-flex flex-col items-start gap-1'}>
      <button
        type="button"
        onClick={download}
        disabled={loading || !files.length}
        className={`inline-flex items-center justify-center gap-2 rounded-full bg-primary font-medium text-primary-foreground shadow-[0_8px_24px_rgba(111,47,125,.16)] transition-all hover:opacity-90 active:scale-95 disabled:cursor-not-allowed disabled:opacity-45 ${
          compact ? 'size-9' : 'min-h-10 px-4 text-sm'
        }`}
        title={t('Download ZIP', 'تنزيل ZIP')}
      >
        {loading ? (
          <LoaderCircle className="size-4 animate-spin" />
        ) : compact ? (
          <Download className="size-4" />
        ) : (
          <Archive className="size-4" />
        )}
        {!compact ? <span>{label ?? t('Download ZIP', 'تنزيل ZIP')}</span> : null}
      </button>
      {error && !compact ? <p className="max-w-xs text-[10px] text-destructive">{error}</p> : null}
    </div>
  )
}
