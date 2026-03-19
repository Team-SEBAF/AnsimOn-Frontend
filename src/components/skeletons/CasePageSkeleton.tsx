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
        {/* CaseProgress: 4개 스텝 + dash 연결선 */}
        <div className="flex items-center gap-6 px-12 py-3">
          {[1, 2, 3, 4].map((step, index) => (
            <div key={step} className="contents">
              {index > 0 && <div className="h-px flex-1 bg-gray-200" />}
              <div className="flex w-30 flex-col items-center gap-1">
                <Skeleton className="h-4 w-14" />
                <Skeleton className="h-6 w-20" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
