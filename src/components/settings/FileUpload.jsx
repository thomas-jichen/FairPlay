import { useRef, useState } from 'react'
import useSessionStore from '../../stores/useSessionStore'
import usePdfExtract from '../../hooks/usePdfExtract'
import { pdfToImage } from '../../services/pdfToImage'

const ACCEPTED_TYPES = [
  'application/pdf',
]

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export default function FileUpload({ uploadedFile, onFileChange }) {
  const inputRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState(null)
  const setPosterText = useSessionStore((s) => s.setPosterText)
  const setPosterBase64 = useSessionStore((s) => s.setPosterBase64)
  const setPosterMimeType = useSessionStore((s) => s.setPosterMimeType)
  const { extractText, isExtracting } = usePdfExtract()

  async function handleFile(file) {
    if (!file) return
    if (!ACCEPTED_TYPES.includes(file.type)) return
    setError(null)

    if (file.size > MAX_FILE_SIZE) {
      setError(`File too large (${formatSize(file.size)}). Maximum size is 10 MB.`)
      return
    }

    onFileChange({
      file,
      name: file.name,
      size: file.size,
      type: file.type,
      preview: null,
    })

    // Extract text for display and convert to image for Gemini in parallel
    const [text, imageResult] = await Promise.all([
      extractText(file),
      pdfToImage(file),
    ])

    setPosterText(text || '[PDF uploaded — text extraction failed]')

    if (imageResult) {
      setPosterBase64(imageResult.base64)
      setPosterMimeType(imageResult.mimeType)
    }
  }

  function handleDrop(e) {
    e.preventDefault()
    setIsDragging(false)
    handleFile(e.dataTransfer.files[0])
  }

  function handleDragOver(e) {
    e.preventDefault()
    setIsDragging(true)
  }

  function handleRemove() {
    if (uploadedFile?.preview) {
      URL.revokeObjectURL(uploadedFile.preview)
    }
    onFileChange(null)
    setPosterText('')
    setPosterBase64(null)
    setPosterMimeType(null)
    setError(null)
  }

  return (
    <div className="space-y-3 px-1 group">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-text-primary tracking-tight">
          Poster (single-page PDF)
        </label>
        <span className="text-xs text-text-muted">Optional</span>
      </div>

      {!uploadedFile ? (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={() => setIsDragging(false)}
          onClick={() => inputRef.current?.click()}
          className={`relative overflow-hidden group flex flex-col items-center justify-center rounded-2xl border-2 border-dashed
            px-6 py-10 cursor-pointer transition-all duration-300 ease-out
            ${isDragging
              ? 'border-black/30 bg-black/5 scale-[1.02]'
              : 'border-black/10 bg-black/[0.02] hover:border-black/20 hover:bg-black/[0.04]'
            }`}
        >
          <div className={`relative z-10 transition-transform duration-300 ${isDragging ? 'scale-110 translate-y-[-4px]' : 'group-hover:scale-110 group-hover:translate-y-[-4px]'}`}>
            <svg
              className={`h-10 w-10 mb-4 transition-colors duration-300 ${isDragging ? 'text-black' : 'text-text-muted group-hover:text-black/60'}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
            </svg>
          </div>

          <p className="relative z-10 text-sm font-medium text-text-primary mb-1">
            Drop your poster here
          </p>
          <p className="relative z-10 text-xs text-text-muted">
            Single-page PDF, max 10 MB
          </p>
        </div>
      ) : (
        <div className="group relative flex items-center gap-4 rounded-2xl border border-black/10 bg-white/60 backdrop-blur-sm p-4 overflow-hidden transition-all duration-300 hover:bg-white/90 hover:border-black/15 shadow-sm">
          {/* Subtle indicator strip */}
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-black/10 rounded-l-2xl group-hover:bg-black/20 transition-colors" />

          {uploadedFile.preview ? (
            <img
              src={uploadedFile.preview}
              alt="Upload preview"
              className="h-16 w-16 rounded-xl object-cover border border-black/5 shadow-sm"
            />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-black/5 border border-black/10 text-black text-sm font-semibold">
              PDF
            </div>
          )}
          <div className="flex-1 min-w-0 py-1 pl-1">
            <p className="text-sm font-medium text-text-primary truncate">
              {uploadedFile.name}
            </p>
            <div className="flex items-center mt-1">
              <p className="text-xs text-text-muted">
                {formatSize(uploadedFile.size)}
              </p>
              {isExtracting && (
                <div className="ml-3 flex items-center text-xs text-text-primary animate-pulse">
                  <div className="w-3 h-3 border-2 border-text-muted border-t-transparent rounded-full animate-spin mr-1.5" />
                  Extracting text
                </div>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={handleRemove}
            className="rounded-full p-2 text-text-muted hover:bg-black/5 hover:text-black transition-all duration-200"
            aria-label="Remove file"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {error && (
        <p className="text-xs text-red-500 font-medium px-1">{error}</p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept=".pdf"
        onChange={(e) => {
          handleFile(e.target.files[0])
          e.target.value = ''
        }}
        className="hidden"
      />
    </div>
  )
}
