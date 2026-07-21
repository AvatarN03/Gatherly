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

export const ItemSkeleton = () => (
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

export const EventTeamAssignmentSkeleton = () => (
  <div className="space-y-3 animate-pulse">
    {Array.from({ length: 3 }).map((_, i) => (
      <div key={i} className="h-14 bg-slate rounded-md relative p-2 flex justify-between items-center">
        <div className="flex gap-3">
          <div className="w-10 rounded-full aspect-square bg-night/40" />
          <div className="space-y-2">
            <div className="w-32 h-4 mb-1 bg-night/40" />
            <div className="w-18 h-3 bg-night/40" />
          </div>
        </div>

        <div className="w-40 h-full bg-orchid/10 delay-100" />
      </div>
    ))}
  </div>

)
