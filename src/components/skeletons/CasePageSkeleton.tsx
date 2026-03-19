import { Skeleton } from '@/components/ui/skeleton';

export function CasePageSkeleton() {
  return (
    <div>
      {/* CaseHeader */}
      <div className="flex w-full justify-between border-b border-gray-100 p-6">
        <div className="flex flex-col gap-1">
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-10 w-14" />
          <Skeleton className="h-10 w-14" />
          <Skeleton className="h-10 w-24" />
        </div>
      </div>
      {/* CaseProgress + 컨텐츠 */}
      <div className="space-y-6 p-6">
        <Skeleton className="h-2 w-full rounded-full" />
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    </div>
  );
}
