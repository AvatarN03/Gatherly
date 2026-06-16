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

export default Skeleton