export default function Loading() {
  return (
    <div className="container py-8 md:py-12">
      {/* Back link skeleton */}
      <div className="h-4 w-32 animate-pulse rounded bg-muted mb-8" />

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-12">
        {/* Cover skeleton */}
        <div className="aspect-[2/3] max-h-[500px] animate-pulse rounded-lg bg-muted" />

        {/* Info skeleton */}
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="h-8 w-3/4 animate-pulse rounded bg-muted" />
            <div className="h-5 w-1/2 animate-pulse rounded bg-muted" />
          </div>
          <div className="flex items-center gap-3">
            <div className="h-6 w-20 animate-pulse rounded bg-muted" />
            <div className="h-4 w-24 animate-pulse rounded bg-muted" />
          </div>
          <div className="h-8 w-24 animate-pulse rounded bg-muted" />
          <div className="space-y-2">
            <div className="h-4 w-full animate-pulse rounded bg-muted" />
            <div className="h-4 w-full animate-pulse rounded bg-muted" />
            <div className="h-4 w-4/5 animate-pulse rounded bg-muted" />
          </div>
          <div className="h-11 w-40 animate-pulse rounded bg-muted" />
        </div>
      </div>
    </div>
  );
}
