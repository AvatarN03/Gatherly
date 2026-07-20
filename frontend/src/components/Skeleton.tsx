export const CardSkeleton = () => (
  <div className="bg-deep-ocean border border-slate rounded-xl overflow-hidden animate-pulse">
    <div className="w-full h-42 bg-slate" />
    <div className="p-4 space-y-2">
      <div className="h-4 bg-slate rounded w-2/3" />
      <div className="h-3 bg-slate rounded w-full" />
      <div className="h-3 bg-slate rounded w-4/5" />
      <div className="h-3 bg-slate rounded w-1/3 mt-3" />
    </div>
  </div>
)

export const CommunitySkeleton = () => (
  <div className="min-h-screen bg-night px-4 py-8 animate-pulse">
    <div className="mx-auto max-w-6xl space-y-4">
      <div className="h-10 w-full bg-slate rounded" />
      <div className="h-64 w-full bg-slate rounded-2xl" />
      <div className="grid grid-cols-4 gap-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-20 bg-slate rounded-xl" />
        ))}
      </div>
      <div className="h-48 bg-slate rounded-xl" />
    </div>
  </div>
)

export const EventSkeleton = () => (
  <div className="bg-night/50 min-h-screen flex items-center justify-center">
    <div className="w-5 h-5 rounded-full border-2 border-orchid border-t-transparent animate-spin" />
  </div>
)

