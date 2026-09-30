export default function Loading() {
  return (
    <div aria-busy="true" aria-label="Loading Next Studio">
      <div className="mb-8 max-w-3xl">
        <div className="skeleton h-3 w-36 rounded-full" />
        <div className="skeleton mt-5 h-10 w-[min(100%,620px)] rounded-2xl" />
        <div className="skeleton mt-4 h-4 w-[min(100%,520px)] rounded-xl" />
      </div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => <div key={index} className="skeleton h-[152px] rounded-[24px]" />)}
      </div>
      <div className="mt-5 grid gap-5 xl:grid-cols-2">
        <div className="skeleton h-80 rounded-[24px]" />
        <div className="skeleton h-80 rounded-[24px]" />
      </div>
    </div>
  )
}
