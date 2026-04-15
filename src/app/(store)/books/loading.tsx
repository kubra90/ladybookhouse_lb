export default function Loading() {
  return (
    <div className="container py-8 md:py-12">
      {/* Page header skeleton */}
      <div className="mb-8 space-y-2">
        <div className="h-10 w-56 animate-pulse rounded bg-muted" />
        <div className="h-4 w-32 animate-pulse rounded bg-muted" />
      </div>

      {/* Search bar skeleton */}
      <div className="mb-6">
        <div className="h-10 w-full animate-pulse rounded bg-muted" />
      </div>

      <div className="flex gap-8">
        {/* Sidebar skeleton (desktop only) */}
        <aside className="hidden md:block w-56 shrink-0 space-y-4">
          <div className="h-16 animate-pulse rounded bg-muted" />
          <div className="h-16 animate-pulse rounded bg-muted" />
          <div className="h-16 animate-pulse rounded bg-muted" />
        </aside>

        {/* Grid skeleton */}
        <div className="flex-1 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="overflow-hidden rounded-lg border bg-card"
            >
              <div className="aspect-[3/4] animate-pulse bg-muted" />
              <div className="p-4 space-y-2">
                <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
                <div className="h-3 w-1/2 animate-pulse rounded bg-muted" />
                <div className="flex items-center justify-between pt-1">
                  <div className="h-4 w-12 animate-pulse rounded bg-muted" />
                  <div className="h-8 w-16 animate-pulse rounded bg-muted" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
