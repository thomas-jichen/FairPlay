export default function PosterThumbnail({ uploadedFile }) {
  if (!uploadedFile) return null

  return (
    <div className="absolute bottom-6 right-6 z-20">
      {uploadedFile.preview ? (
        <img
          src={uploadedFile.preview}
          alt="Poster"
          className="h-40 w-auto rounded-lg border border-border-default/50 shadow-lg
                     opacity-80 hover:opacity-100 transition-opacity object-contain
                     bg-black/30 backdrop-blur-sm"
        />
      ) : (
        <div className="flex items-center gap-2 rounded-lg border border-border-default/50
                        bg-black/30 backdrop-blur-sm px-3 py-2 opacity-80">
          <span className="text-accent text-xs font-mono font-bold">PDF</span>
          <span className="text-xs text-text-muted truncate max-w-[100px]">
            {uploadedFile.name}
          </span>
        </div>
      )}
    </div>
  )
}
