export default function Loading() {
  return (
    <div className="min-h-screen lg:pl-[284px]">
      <aside className="fixed inset-y-4 left-4 hidden w-[252px] rounded-[28px] border border-border bg-sidebar/70 p-4 backdrop-blur-3xl lg:block">
        <div className="nf-skeleton h-12 w-40 rounded-[18px]" />
        <div className="mt-8 space-y-3">
          {Array.from({ length: 7 }).map((_, index) => (
            <div key={index} className="nf-skeleton h-10 rounded-[14px]" />
          ))}
        </div>
      </aside>
      <main className="mx-auto w-full max-w-[1720px] px-4 py-4 sm:px-6 lg:px-7">
        <div className="nf-skeleton h-16 rounded-[22px]" />
        <div className="mt-8 max-w-3xl">
          <div className="nf-skeleton h-3 w-28 rounded-full" />
          <div className="nf-skeleton mt-4 h-10 w-3/4 rounded-[14px]" />
          <div className="nf-skeleton mt-3 h-4 w-full max-w-2xl rounded-full" />
        </div>
        <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="nf-skeleton h-40 rounded-[24px]" />
          ))}
        </div>
        <div className="mt-8 grid gap-4 xl:grid-cols-2">
          <div className="nf-skeleton h-80 rounded-[28px]" />
          <div className="nf-skeleton h-80 rounded-[28px]" />
        </div>
      </main>
    </div>
  )
}
