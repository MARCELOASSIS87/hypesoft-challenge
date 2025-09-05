// src/components/skeletons/TableSkeleton.tsx
import { Skeleton } from "@/components/ui/skeleton";

export default function TableSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="px-4 py-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="grid grid-cols-12 items-center py-3 gap-4">
          <div className="col-span-4"><Skeleton className="h-4 w-40" /></div>
          <div className="col-span-2"><Skeleton className="h-4 w-24" /></div>
          <div className="col-span-2"><Skeleton className="h-4 w-16" /></div>
          <div className="col-span-2"><Skeleton className="h-4 w-10" /></div>
          <div className="col-span-2 justify-self-end"><Skeleton className="h-8 w-24" /></div>
        </div>
      ))}
    </div>
  );
}
