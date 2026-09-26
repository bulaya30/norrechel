import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading dashboard"
      className="space-y-8"
    >
      <span className="sr-only">Loading...</span>

      {/* Page header */}
      <header className="space-y-3 border-b border-slate-200 pb-6">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-10 w-64 max-w-full" />
        <Skeleton className="h-5 w-full max-w-2xl" />
      </header>

      {/* Statistics */}
      <section
        aria-label="Loading dashboard statistics"
        className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5"
      >
        {Array.from({ length: 5 }).map((_, index) => (
          <article
            key={index}
            className="
              rounded-2xl border border-slate-200
              bg-white p-5 shadow-sm
            "
          >
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-3">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-9 w-20" />
              </div>

              <Skeleton className="size-12 rounded-2xl" />
            </div>

            <div className="mt-5 border-t border-slate-100 pt-4">
              <Skeleton className="h-4 w-32" />
            </div>
          </article>
        ))}
      </section>

      {/* Recent content */}
      <div className="grid gap-6 xl:grid-cols-2">
        {Array.from({ length: 2 }).map((_, sectionIndex) => (
          <section
            key={sectionIndex}
            className="
              overflow-hidden rounded-2xl
              border border-slate-200
              bg-white shadow-sm
            "
          >
            <header
              className="
                flex items-center justify-between
                border-b border-slate-200
                px-5 py-4
              "
            >
              <div className="space-y-2">
                <Skeleton className="h-6 w-36" />
                <Skeleton className="h-4 w-20" />
              </div>

              <Skeleton className="h-4 w-16" />
            </header>

            <div className="divide-y divide-slate-100">
              {Array.from({ length: 4 }).map((_, itemIndex) => (
                <article
                  key={itemIndex}
                  className="space-y-3 px-5 py-4"
                >
                  <Skeleton className="h-5 w-3/4" />

                  <div className="flex flex-wrap gap-3">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}