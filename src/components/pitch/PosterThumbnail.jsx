export default function PosterThumbnail({ uploadedFile }) {
  if (!uploadedFile) return null

  return (
    <div className="group relative">
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
    </div>
  )
}
