export default function Loading() {
  return (
    <>
      {/* Hero skeleton */}
      <section className="bg-warm-sand">
        <div className="container py-20 md:py-28">
          <div className="max-w-2xl space-y-6">
            <div className="h-12 w-3/4 animate-pulse rounded bg-muted" />
            <div className="h-12 w-1/2 animate-pulse rounded bg-muted" />
            <div className="space-y-2">
              <div className="h-4 w-full animate-pulse rounded bg-muted" />
              <div className="h-4 w-5/6 animate-pulse rounded bg-muted" />
            </div>
            <div className="flex gap-3">
              <div className="h-11 w-32 animate-pulse rounded bg-muted" />
              <div className="h-11 w-32 animate-pulse rounded bg-muted" />
            </div>
          </div>
        </div>
      </section>

      {/* Featured grid skeleton */}
      <section className="container py-16 md:py-20">
        <div className="mb-10 text-center space-y-2">
          <div className="mx-auto h-8 w-48 animate-pulse rounded bg-muted" />
          <div className="mx-auto h-4 w-64 animate-pulse rounded bg-muted" />
        </div>
        <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="overflow-hidden rounded-lg border bg-card"
            >
              <div className="aspect-[2/3] animate-pulse bg-muted" />
              <div className="p-4 space-y-2">
                <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
                <div className="h-3 w-1/2 animate-pulse rounded bg-muted" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
