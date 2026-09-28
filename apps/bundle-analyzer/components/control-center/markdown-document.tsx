import type { ReactNode } from 'react'

function inlineCode(text: string): ReactNode[] {
  const parts = text.split(/(`[^`]+`)/g)
  return parts.map((part, index) => {
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code
          key={index}
          dir="ltr"
          className="rounded-md bg-primary/8 px-1.5 py-0.5 font-mono text-[0.88em] text-primary"
        >
          {part.slice(1, -1)}
        </code>
      )
    }
    return part
  })
}

export function MarkdownDocument({ source }: { source: string }) {
  const body = source.replace(/^---\n[\s\S]*?\n---\n?/, '')
  const lines = body.split('\n')
  const nodes: ReactNode[] = []
  let code: string[] | null = null
  let codeLang = ''
  let list: string[] = []

  const flushList = () => {
    if (!list.length) return
    nodes.push(
      <ul key={`list-${nodes.length}`} className="my-4 space-y-2 ps-5 text-sm leading-7 text-muted-foreground">
        {list.map((item, index) => (
          <li key={index} className="list-disc">
            {inlineCode(item)}
          </li>
        ))}
      </ul>
    )
    list = []
  }

  const flushCode = () => {
    if (!code) return
    nodes.push(
      <div key={`code-${nodes.length}`} className="my-5 overflow-hidden rounded-[18px] border border-border bg-[#120017]">
        {codeLang ? (
          <div className="border-b border-white/10 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.12em] text-[#cdb7d1]/65">
            {codeLang}
          </div>
        ) : null}
        <pre dir="ltr" className="overflow-x-auto p-4 text-left font-mono text-[12px] leading-6 text-[#eadcef]">
          <code>{code.join('\n')}</code>
        </pre>
      </div>
    )
    code = null
    codeLang = ''
  }

  for (const line of lines) {
    if (line.startsWith('```')) {
      flushList()
      if (code) flushCode()
      else {
        code = []
        codeLang = line.slice(3).trim()
      }
      continue
    }
    if (code) {
      code.push(line)
      continue
    }
    if (/^[-*] /.test(line)) {
      list.push(line.replace(/^[-*] /, ''))
      continue
    }
    flushList()

    if (line.startsWith('### ')) {
      nodes.push(
        <h3 key={nodes.length} className="mb-2 mt-7 text-lg font-semibold tracking-[-0.02em]">
          {inlineCode(line.slice(4))}
        </h3>
      )
    } else if (line.startsWith('## ')) {
      nodes.push(
        <h2 key={nodes.length} className="mb-2 mt-9 text-xl font-semibold tracking-[-0.025em]">
          {inlineCode(line.slice(3))}
        </h2>
      )
    } else if (line.startsWith('# ')) {
      nodes.push(
        <h1 key={nodes.length} className="mb-4 mt-2 text-2xl font-semibold tracking-[-0.035em] sm:text-3xl">
          {inlineCode(line.slice(2))}
        </h1>
      )
    } else if (line.startsWith('> ')) {
      nodes.push(
        <blockquote key={nodes.length} className="my-4 border-s-2 border-primary/40 ps-4 text-sm italic leading-7 text-muted-foreground">
          {inlineCode(line.slice(2))}
        </blockquote>
      )
    } else if (line.trim()) {
      nodes.push(
        <p key={nodes.length} className="my-3 text-sm leading-7 text-muted-foreground">
          {inlineCode(line)}
        </p>
      )
    }
  }

  flushList()
  flushCode()

  return <div className="min-w-0">{nodes}</div>
}
