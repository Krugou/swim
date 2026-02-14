import { Skeleton } from '@/components/ui/Skeleton';

export default function Loading() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Skeleton Header */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur flex-none">
        <div className="container mx-auto flex h-14 sm:h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <Skeleton className="h-6 w-32 sm:w-48" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-9 w-9 rounded-md" />
            <Skeleton className="h-9 w-9 rounded-md" />
            <Skeleton className="h-9 w-9 rounded-md" />
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-10">
        {/* Hero Section */}
        <div className="flex flex-col items-center space-y-4 max-w-2xl mx-auto text-center">
          <Skeleton className="h-8 sm:h-10 w-3/4" />
          <Skeleton className="h-4 sm:h-5 w-2/3" />

          <div className="flex gap-4 mt-4 pt-2">
            <Skeleton className="h-11 w-40 rounded-lg" />
            <Skeleton className="h-11 w-40 rounded-lg" />
          </div>
        </div>

        {/* Cards Grid */}
        <div className="max-w-4xl mx-auto w-full space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:gap-8">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="neo-card h-64 w-full flex flex-col gap-4">
                <div className="flex justify-between items-start">
                  <Skeleton className="h-6 w-1/3" />
                  <div className="flex gap-2">
                    <Skeleton className="h-8 w-8" />
                    <Skeleton className="h-8 w-8" />
                  </div>
                </div>
                {/* Content */}
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Skeleton className="h-full w-full rounded-md" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                    <Skeleton className="h-4 w-4/6" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Simple Footer Skeleton */}
      <footer className="border-t py-6 flex-none">
        <div className="container mx-auto flex justify-center">
          <Skeleton className="h-4 w-48" />
        </div>
      </footer>
    </div>
  );
}
