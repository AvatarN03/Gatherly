const Skeleton = () => (
  <div className="bg-[#0D1B22] border border-[#182F3D] rounded-xl overflow-hidden animate-pulse">
    <div className="w-full h-40 bg-[#182F3D]" />
    <div className="p-4 space-y-2">
      <div className="h-4 bg-[#182F3D] rounded w-2/3" />
      <div className="h-3 bg-[#182F3D] rounded w-full" />
      <div className="h-3 bg-[#182F3D] rounded w-4/5" />
      <div className="h-3 bg-[#182F3D] rounded w-1/3 mt-3" />
    </div>
  </div>
)

export const CommunitySkeleton = () => (
  <div className="min-h-screen bg-[#0C1926] px-4 py-8 animate-pulse">
    <div className="mx-auto max-w-4xl space-y-4">
      <div className="h-4 w-32 bg-[#182F3D] rounded" />
      <div className="h-64 w-full bg-[#182F3D] rounded-2xl" />
      <div className="grid grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-20 bg-[#182F3D] rounded-xl" />
        ))}
      </div>
      <div className="h-10 bg-[#182F3D] rounded-xl" />
      <div className="h-48 bg-[#182F3D] rounded-xl" />
    </div>
  </div>
)

export default Skeleton