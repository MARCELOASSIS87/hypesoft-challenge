import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardSkeleton() {
  return (
    <div className="p-6 space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-72" />
      </div>

      {/* cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-gray-200/50 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="mt-3 h-6 w-24" />
            <Skeleton className="mt-2 h-3 w-20" />
          </div>
        ))}
      </div>

      {/* gráfico + lista */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-2xl border border-gray-200/50 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <Skeleton className="h-4 w-40 mb-3" />
          <Skeleton className="h-64 w-full" />
        </div>

        <div className="rounded-2xl border border-gray-200/50 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <Skeleton className="h-4 w-32 mb-3" />
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between py-2 border-b last:border-0 border-gray-200/60 dark:border-zinc-800">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-4 w-16" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
