export default function PosterThumbnail({ uploadedFile, onClick }) {
  const hasFile = !!uploadedFile;

  return (
    <button
      onClick={hasFile ? onClick : undefined}
      className={`group relative flex flex-col h-full w-full outline-none transition-all duration-300 focus:ring-2 focus:ring-white/50 ${!hasFile ? 'cursor-not-allowed opacity-50' : ''}`}
      title={hasFile ? "Open Poster Viewer" : "No Poster Uploaded"}
    >
      <div className="glass-panel no-shimmer relative flex h-full w-full items-center justify-center rounded-2xl shadow-xl opacity-90 transition-all duration-300
                      group-hover:opacity-100 group-hover:scale-[1.02] group-hover:border-white">

        {/* Poster Icon */}
        <div className="flex flex-col items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-black/5 border border-black/10">
            {hasFile && (uploadedFile.type?.includes('pdf') || !uploadedFile.preview) ? (
              <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-text-primary">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
            ) : (
              <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-text-primary">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
            )}
          </div>
          <span className="type-caption text-[10px] text-text-secondary tracking-widest uppercase truncate max-w-[100px] px-2 text-center">
            {hasFile ? (uploadedFile.name || "Poster") : "No Poster"}
          </span>
        </div>

        {/* Expand Icon Overlay on Hover */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-full bg-black/50 backdrop-blur-md p-1 shadow-sm text-white border border-white/20">
          <svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
          </svg>
        </div>
      </div>
    </button>
  )
}
