export default function HomeLoading() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] animate-pulse">
      <div className="max-w-3xl mx-auto px-4 pt-24 pb-16 text-center">
        <div className="w-48 h-8 bg-[#13131a] rounded-lg mx-auto mb-6" />
        <div className="w-24 h-6 bg-[#13131a] rounded-full mx-auto mb-8" />
        <div className="w-full max-w-xl h-12 bg-[#13131a] rounded-lg mx-auto mb-4" />
        <div className="w-3/4 h-6 bg-[#13131a] rounded-lg mx-auto" />
      </div>
      <div className="max-w-4xl mx-auto px-4 grid grid-cols-2 sm:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-24 bg-[#13131a] rounded-xl" />
        ))}
      </div>
    </div>
  )
}
