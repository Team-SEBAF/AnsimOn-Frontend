import { Skeleton } from '@/components/ui/skeleton';

export function EvidenceCardSkeleton() {
  return (
    <div className="flex min-h-40 flex-col gap-6 rounded-2xl border border-gray-200 px-7 py-6 shadow-[0px_20px_50px_-5px_#4040400D]">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-40" />
        </div>
      </div>
      {/* Content */}
      <Skeleton className="h-24 w-full rounded-xl" />
      {/* Footer */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-10 w-28 rounded-lg" />
      </div>
    </div>
  );
}
