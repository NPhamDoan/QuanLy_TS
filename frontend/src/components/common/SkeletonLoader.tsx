interface SkeletonLoaderProps {
  type: 'stat-cards' | 'table' | 'detail' | 'form';
}

function SkeletonBlock({ className }: { className?: string }) {
  return <div className={`animate-pulse bg-slate-200 rounded ${className ?? ''}`} />;
}

function StatCardsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="rounded-xl bg-white p-4 shadow space-y-3">
          <SkeletonBlock className="h-6 w-6 rounded-full" />
          <SkeletonBlock className="h-7 w-16" />
          <SkeletonBlock className="h-4 w-24" />
        </div>
      ))}
    </div>
  );
}

function TableSkeleton() {
  return (
    <div className="rounded-xl bg-white shadow overflow-hidden">
      {/* Header row */}
      <div className="flex gap-4 p-4 border-b border-slate-100">
        {Array.from({ length: 5 }).map((_, i) => (
          <SkeletonBlock key={i} className="h-4 flex-1" />
        ))}
      </div>
      {/* Body rows */}
      {Array.from({ length: 6 }).map((_, row) => (
        <div key={row} className="flex gap-4 p-4 border-b border-slate-50">
          {Array.from({ length: 5 }).map((_, col) => (
            <SkeletonBlock key={col} className="h-4 flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}

function DetailSkeleton() {
  return (
    <div className="space-y-6">
      {/* Section 1: Student info */}
      <div className="rounded-xl bg-white p-6 shadow space-y-4">
        <SkeletonBlock className="h-5 w-40" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <SkeletonBlock className="h-3 w-20" />
              <SkeletonBlock className="h-4 w-full" />
            </div>
          ))}
        </div>
      </div>
      {/* Section 2: Application info */}
      <div className="rounded-xl bg-white p-6 shadow space-y-4">
        <SkeletonBlock className="h-5 w-36" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <SkeletonBlock className="h-3 w-20" />
              <SkeletonBlock className="h-4 w-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function FormSkeleton() {
  return (
    <div className="space-y-6">
      {/* Section 1: Student fields */}
      <div className="rounded-xl bg-white p-6 shadow space-y-4">
        <SkeletonBlock className="h-5 w-44" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <SkeletonBlock className="h-3 w-24" />
              <SkeletonBlock className="h-10 w-full rounded-md" />
            </div>
          ))}
        </div>
      </div>
      {/* Section 2: Application fields */}
      <div className="rounded-xl bg-white p-6 shadow space-y-4">
        <SkeletonBlock className="h-5 w-36" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <SkeletonBlock className="h-3 w-24" />
              <SkeletonBlock className="h-10 w-full rounded-md" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function SkeletonLoader({ type }: SkeletonLoaderProps) {
  switch (type) {
    case 'stat-cards':
      return <StatCardsSkeleton />;
    case 'table':
      return <TableSkeleton />;
    case 'detail':
      return <DetailSkeleton />;
    case 'form':
      return <FormSkeleton />;
  }
}
