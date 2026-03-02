export default function PosterThumbnail({ uploadedFile }) {
  if (!uploadedFile) return null

  return (
    <div className="group relative">
      {/* Hover glow effect */}
      <div className="absolute inset-0 bg-accent/20 rounded-xl blur-xl transition-opacity duration-500 opacity-0 group-hover:opacity-100 pointer-events-none" />

      {uploadedFile.preview ? (
        <img
          src={uploadedFile.preview}
          alt="Poster"
          className="relative h-[220px] w-auto max-w-[300px] rounded-xl border border-white/20 shadow-2xl object-cover
                     bg-black/40 backdrop-blur-md opacity-80 transition-all duration-300 ease-out
                     group-hover:opacity-100 group-hover:scale-[1.02] group-hover:border-white/40 group-hover:-translate-y-1"
        />
      ) : (
        <div className="relative flex items-center gap-3 rounded-xl border border-white/20 shadow-2xl
                        bg-black/40 backdrop-blur-md px-4 py-3 opacity-80 transition-all duration-300
                        group-hover:opacity-100 group-hover:scale-[1.02] group-hover:border-white/40 group-hover:-translate-y-1">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/20">
            <span className="text-[10px] font-mono font-bold text-accent tracking-widest">PDF</span>
          </div>
          <span className="text-sm font-medium text-white truncate max-w-[120px] drop-shadow-sm">
            {uploadedFile.name}
          </span>
        </div>
      )}
    </div>
  )
}
