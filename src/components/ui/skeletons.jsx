import { Skeleton } from "@/components/ui/skeleton";

// Generic loading skeletons for different sections
export function FormSkeleton() {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Skeleton className="h-4 w-[100px]" />
        <Skeleton className="h-10 w-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-[100px]" />
        <Skeleton className="h-10 w-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-[100px]" />
        <Skeleton className="h-10 w-full" />
      </div>
      <Skeleton className="h-10 w-[150px]" />
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div className="space-y-6 p-6">
      <Skeleton className="h-8 w-[250px]" />
      <div className="space-y-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-[80%]" />
        <Skeleton className="h-4 w-[60%]" />
      </div>
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="rounded-lg border p-4 space-y-3">
      <Skeleton className="h-4 w-[200px]" />
      <Skeleton className="h-4 w-[150px]" />
      <Skeleton className="h-4 w-[100px]" />
    </div>
  );
}

export function ListSkeleton({ count = 3 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}

export function BookingHistorySkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-6 w-[200px]" />
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-lg border p-4 space-y-3">
            <div className="flex justify-between">
              <Skeleton className="h-5 w-[150px]" />
              <Skeleton className="h-5 w-[100px]" />
            </div>
            <Skeleton className="h-4 w-[250px]" />
            <div className="flex justify-between">
              <Skeleton className="h-4 w-[100px]" />
              <Skeleton className="h-4 w-[80px]" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function SeatSelectionSkeleton() {
  return (
    <div className="space-y-6 p-4">
      <Skeleton className="h-8 w-[200px] mx-auto" />

      {/* Bus layout skeleton */}
      <div className="space-y-4">
        <div className="grid grid-cols-4 gap-2 max-w-sm mx-auto">
          {Array.from({ length: 16 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-8 rounded" />
          ))}
        </div>
      </div>

      {/* Legend skeleton */}
      <div className="flex justify-center space-x-4">
        <div className="flex items-center space-x-2">
          <Skeleton className="h-4 w-4 rounded" />
          <Skeleton className="h-4 w-[60px]" />
        </div>
        <div className="flex items-center space-x-2">
          <Skeleton className="h-4 w-4 rounded" />
          <Skeleton className="h-4 w-[60px]" />
        </div>
        <div className="flex items-center space-x-2">
          <Skeleton className="h-4 w-4 rounded" />
          <Skeleton className="h-4 w-[60px]" />
        </div>
      </div>

      {/* Continue button skeleton */}
      <Skeleton className="h-12 w-full max-w-xs mx-auto" />
    </div>
  );
}

export function LoadingSpinnerSkeleton() {
  return (
    <div className="flex items-center justify-center h-[200px]">
      <div className="space-y-4 text-center">
        <Skeleton className="h-16 w-16 rounded-full mx-auto" />
        <Skeleton className="h-4 w-[150px] mx-auto" />
      </div>
    </div>
  );
}

export function BusSearchSkeleton() {
  return (
    <div className="bg-gray-100 min-h-screen">
      <main className="w-full max-w-screen-xl mx-auto pt-[90px] pb-[50px] px-2">
        <div className="space-y-6">
          {/* Search results header skeleton */}
          <div className="bg-white rounded-lg p-4 space-y-3">
            <Skeleton className="h-6 w-[200px]" />
            <Skeleton className="h-4 w-[150px]" />
          </div>

          {/* Bus cards skeleton */}
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-lg p-6 space-y-4 shadow-sm"
              >
                <div className="flex justify-between items-start">
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-6 w-[180px]" />
                    <Skeleton className="h-4 w-[120px]" />
                  </div>
                  <div className="space-y-2 text-right">
                    <Skeleton className="h-6 w-[80px]" />
                    <Skeleton className="h-4 w-[60px]" />
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex space-x-4">
                    <div className="space-y-1">
                      <Skeleton className="h-4 w-[60px]" />
                      <Skeleton className="h-4 w-[80px]" />
                    </div>
                    <div className="space-y-1">
                      <Skeleton className="h-4 w-[60px]" />
                      <Skeleton className="h-4 w-[80px]" />
                    </div>
                  </div>
                  <Skeleton className="h-10 w-[120px]" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
