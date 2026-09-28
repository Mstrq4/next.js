export type RepoFile = {
  path: string
  archivePath?: string
}

const encoder = new TextEncoder()

function makeCrcTable() {
  const table = new Uint32Array(256)
  for (let n = 0; n < 256; n++) {
    let c = n
    for (let k = 0; k < 8; k++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
    }
    table[n] = c >>> 0
  }
  return table
}

const crcTable = makeCrcTable()

function crc32(data: Uint8Array) {
  let crc = 0xffffffff
  for (const byte of data) {
    crc = crcTable[(crc ^ byte) & 0xff] ^ (crc >>> 8)
  }
  return (crc ^ 0xffffffff) >>> 0
}

function u16(value: number) {
  return new Uint8Array([value & 0xff, (value >>> 8) & 0xff])
}

function u32(value: number) {
  return new Uint8Array([
    value & 0xff,
    (value >>> 8) & 0xff,
    (value >>> 16) & 0xff,
    (value >>> 24) & 0xff,
  ])
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

function dosTimestamp(date = new Date()) {
  const year = Math.max(1980, date.getFullYear())
  const time =
    (date.getHours() << 11) |
    (date.getMinutes() << 5) |
    Math.floor(date.getSeconds() / 2)
  const day = ((year - 1980) << 9) | ((date.getMonth() + 1) << 5) | date.getDate()
  return { time, day }
}

function createZip(entries: Array<{ name: string; data: Uint8Array }>) {
  const localParts: Uint8Array[] = []
  const centralParts: Uint8Array[] = []
  let localOffset = 0
  const stamp = dosTimestamp()

  for (const entry of entries) {
    const name = encoder.encode(entry.name.replaceAll('\\', '/'))
    const crc = crc32(entry.data)
    const flags = 0x0800

    const localHeader = concat([
      u32(0x04034b50),
      u16(20),
      u16(flags),
      u16(0),
      u16(stamp.time),
      u16(stamp.day),
      u32(crc),
      u32(entry.data.length),
      u32(entry.data.length),
      u16(name.length),
      u16(0),
      name,
    ])

    localParts.push(localHeader, entry.data)

    const centralHeader = concat([
      u32(0x02014b50),
      u16(20),
      u16(20),
      u16(flags),
      u16(0),
      u16(stamp.time),
      u16(stamp.day),
      u32(crc),
      u32(entry.data.length),
      u32(entry.data.length),
      u16(name.length),
      u16(0),
      u16(0),
      u16(0),
      u16(0),
      u32(0),
      u32(localOffset),
      name,
    ])

    centralParts.push(centralHeader)
    localOffset += localHeader.length + entry.data.length
  }

  const local = concat(localParts)
  const central = concat(centralParts)
  const end = concat([
    u32(0x06054b50),
    u16(0),
    u16(0),
    u16(entries.length),
    u16(entries.length),
    u32(central.length),
    u32(local.length),
    u16(0),
  ])

  return concat([local, central, end])
}

export async function downloadRepoFilesZip({
  files,
  filename,
  repo = 'Mstrq4/next.js',
  ref = 'canary',
}: {
  files: RepoFile[]
  filename: string
  repo?: string
  ref?: string
}) {
  const entries = await Promise.all(
    files.map(async (file) => {
      const url =
        `https://raw.githubusercontent.com/${repo}/${encodeURIComponent(ref)}/${file.path
          .split('/')
          .map(encodeURIComponent)
          .join('/')}`
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`Failed to download ${file.path}: ${response.status}`)
      }

      return {
        name: file.archivePath ?? file.path,
        data: new Uint8Array(await response.arrayBuffer()),
      }
    })
  )

  const bytes = createZip(entries)
  const blob = new Blob([bytes], { type: 'application/zip' })
  const href = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = href
  anchor.download = filename.endsWith('.zip') ? filename : `${filename}.zip`
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
  window.setTimeout(() => URL.revokeObjectURL(href), 1000)
}
