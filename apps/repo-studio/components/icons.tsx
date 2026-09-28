import type { ReactNode, SVGProps } from 'react'
import type { IconName } from '@/lib/site'

type IconProps = SVGProps<SVGSVGElement> & { name: IconName }

const paths: Record<IconName, ReactNode> = {
  home: <><path d="M3 10.8 12 3l9 7.8"/><path d="M5 9.8V21h14V9.8"/><path d="M9 21v-7h6v7"/></>,
  layers: <><path d="m12 2 9 5-9 5-9-5 9-5Z"/><path d="m3 12 9 5 9-5"/><path d="m3 17 9 5 9-5"/></>,
  package: <><path d="m21 8-9 5-9-5 9-5 9 5Z"/><path d="M3 8v8l9 5 9-5V8"/><path d="M12 13v8"/></>,
  terminal: <><path d="m4 6 5 5-5 5"/><path d="M11 18h9"/></>,
  sparkles: <><path d="m12 3 1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6L12 3Z"/><path d="m19 15 .8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15Z"/><path d="m5 13 .8 2.2L8 16l-2.2.8L5 19l-.8-2.2L2 16l2.2-.8L5 13Z"/></>,
  flask: <><path d="M9 3h6"/><path d="M10 3v6l-5.5 9.2A1.8 1.8 0 0 0 6 21h12a1.8 1.8 0 0 0 1.5-2.8L14 9V3"/><path d="M7.5 16h9"/></>,
  gauge: <><path d="M4.9 19a9 9 0 1 1 14.2 0"/><path d="M12 12 16 8"/><path d="M12 12h.01"/></>,
  book: <><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5Z"/></>,
  git: <><circle cx="6" cy="5" r="2"/><circle cx="18" cy="6" r="2"/><circle cx="18" cy="18" r="2"/><path d="M8 5h4a6 6 0 0 1 6 6v5"/><path d="M6 7v10a3 3 0 0 0 3 3h7"/></>,
  search: <><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></>,
  sun: <><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></>,
  moon: <path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8Z"/>,
  menu: <><path d="M4 7h16M4 12h16M4 17h16"/></>,
  x: <><path d="M6 6l12 12M18 6 6 18"/></>,
  chevron: <path d="m9 18 6-6-6-6"/>,
  copy: <><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M15 9V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h3"/></>,
  check: <path d="m5 12 4 4L19 6"/>,
  external: <><path d="M14 4h6v6"/><path d="M20 4 10 14"/><path d="M18 13v6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h6"/></>,
  cpu: <><rect x="7" y="7" width="10" height="10" rx="2"/><path d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 14h3M1 9h3M1 14h3"/></>,
  box: <><path d="M4 6h16v12H4z"/><path d="M8 10h8"/></>,
  code: <><path d="m8 9-4 3 4 3M16 9l4 3-4 3M14 5l-4 14"/></>,
  branch: <><circle cx="6" cy="5" r="2"/><circle cx="18" cy="6" r="2"/><circle cx="6" cy="19" r="2"/><path d="M6 7v10M8 8c6 0 4-2 8-2"/></>,
  activity: <path d="M3 12h4l2-6 4 12 2-6h6"/>,
  file: <><path d="M6 2h8l4 4v16H6z"/><path d="M14 2v5h5"/></>,
}

export function Icon({ name, className = '', ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
      {...props}
    >
      {paths[name]}
    </svg>
  )
}
