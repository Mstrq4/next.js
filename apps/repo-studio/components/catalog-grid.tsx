'use client'

import { useMemo, useState } from 'react'
import type { CatalogItem } from '@/lib/repo-data'
import { Icon } from '@/components/icons'

export function CatalogGrid({
  items,
  placeholder = 'Search this catalog',
  emptyLabel = 'No matching items',
}: {
  items: CatalogItem[]
  placeholder?: string
  emptyLabel?: string
}) {
  const [query, setQuery] = useState('')
  const normalized = query.trim().toLowerCase()

  const filtered = useMemo(() => {
    if (!normalized) return items
    return items.filter((item) =>
      [item.name, item.subtitle, item.path, item.meta, item.source]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(normalized)
    )
  }, [items, normalized])

  return (
    <div>
      <label className="search-field mb-5">
        <Icon name="search" className="h-4 w-4 shrink-0" />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={placeholder}
          aria-label={placeholder}
        />
        <span className="text-[11px] tabular-nums text-[var(--text-tertiary)]">{filtered.length}</span>
      </label>

      {filtered.length ? (
        <div className="catalog-grid">
          {filtered.map((item) => (
            <article key={item.source + ':' + item.path} className="glass catalog-card">
              <div className="flex min-w-0 items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="truncate text-sm font-semibold text-[var(--text-primary)]">{item.name}</h3>
                  <p className="mt-1 line-clamp-2 text-xs leading-5 text-[var(--text-secondary)]">{item.subtitle}</p>
                </div>
                {item.meta ? <span className="chip shrink-0">{item.meta}</span> : null}
              </div>
              <div className="mt-5 flex items-end justify-between gap-4">
                <code className="truncate text-[11px] text-[var(--text-tertiary)]">{item.path}</code>
                {item.href ? (
                  <a href={item.href} target="_blank" rel="noreferrer" className="icon-button h-8 w-8 shrink-0" aria-label={'Open ' + item.name + ' on GitHub'}>
                    <Icon name="external" className="h-3.5 w-3.5" />
                  </a>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="glass flex min-h-44 items-center justify-center p-8 text-sm text-[var(--text-secondary)]">{emptyLabel}</div>
      )}
    </div>
  )
}
