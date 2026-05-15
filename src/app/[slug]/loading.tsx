export default function CardLoading() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-4">
      <div className="w-full max-w-sm mx-auto space-y-4 animate-pulse">
        <div className="h-16 bg-[#13131a] rounded-xl" />
        <div className="bg-[#13131a] rounded-3xl overflow-hidden border border-[#1e293b] p-6 space-y-5">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-2xl bg-[#1e293b]" />
            <div className="flex-1 space-y-2">
              <div className="h-5 w-3/4 bg-[#1e293b] rounded" />
              <div className="h-4 w-1/2 bg-[#1e293b] rounded" />
              <div className="h-3 w-1/3 bg-[#1e293b] rounded" />
            </div>
          </div>
          <div className="h-px bg-[#1e293b]" />
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-14 bg-[#1e293b] rounded-xl" />
          ))}
          <div className="h-px bg-[#1e293b]" />
          <div className="grid grid-cols-3 gap-2.5">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-[#1e293b] rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
