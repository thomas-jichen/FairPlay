export default function PosterThumbnail({ uploadedFile, onClick }) {
  if (!uploadedFile) return null

  return (
    <button
      onClick={onClick}
      className="group relative text-left outline-none transition-all duration-300 focus:ring-2 focus:ring-white/50 rounded-2xl"
      title="Click to view full poster"
    >
      {uploadedFile.preview ? (
        <img
          src={uploadedFile.preview}
          alt="Poster"
          className="relative h-[220px] w-auto max-w-[300px] rounded-2xl border border-white/60 shadow-xl object-cover
                     bg-white/40 backdrop-blur-3xl opacity-90 transition-all duration-300 ease-out
                     group-hover:opacity-100 group-hover:scale-[1.02] group-hover:border-white group-hover:-translate-y-1"
        />
      ) : (
        <div className="glass-panel relative flex items-center gap-3 rounded-2xl shadow-xl px-4 py-3 opacity-90 transition-all duration-300
                        group-hover:opacity-100 group-hover:scale-[1.02] group-hover:-translate-y-1">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-black/5 border border-black/10">
            <span className="text-[10px] font-bold text-text-primary tracking-widest uppercase">PDF</span>
          </div>
          <span className="text-sm font-semibold text-text-primary truncate max-w-[120px]">
            {uploadedFile.name}
          </span>
        </div>
      )}

      {/* Expand Icon Overlay on Hover */}
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-full bg-black/50 backdrop-blur-md p-1.5 shadow-sm text-white border border-white/20">
        <svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
        </svg>
      </div>
    </button>
  )
}
