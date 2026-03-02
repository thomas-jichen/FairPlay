import { useRef, useState } from 'react'

const ACCEPTED_TYPES = [
  'application/pdf',
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/webp',
]

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export default function FileUpload({ uploadedFile, onFileChange }) {
  const inputRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)

  function handleFile(file) {
    if (!file) return
    if (!ACCEPTED_TYPES.includes(file.type)) {
      return
    }

    const isImage = file.type.startsWith('image/')
    const preview = isImage ? URL.createObjectURL(file) : null

    onFileChange({
      file,
      name: file.name,
      size: file.size,
      type: file.type,
      preview,
    })
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
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-text-secondary">
        Project Materials
        <span className="ml-2 text-xs text-text-muted">(optional)</span>
      </label>

      {!uploadedFile ? (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={() => setIsDragging(false)}
          onClick={() => inputRef.current?.click()}
          className={`flex flex-col items-center justify-center rounded-lg border-2 border-dashed
            px-6 py-8 cursor-pointer transition-colors
            ${isDragging
              ? 'border-accent bg-accent-muted'
              : 'border-border-default hover:border-accent/50 bg-surface-secondary'
            }`}
        >
          <svg
            className="h-8 w-8 text-text-muted mb-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
            />
          </svg>
          <p className="text-sm text-text-secondary">
            Drop a file here or click to browse
          </p>
          <p className="text-xs text-text-muted mt-1">
            PDF or images (PNG, JPEG, WebP)
          </p>
        </div>
      ) : (
        <div className="flex items-center gap-4 rounded-lg border border-border-default bg-surface-secondary p-4">
          {uploadedFile.preview ? (
            <img
              src={uploadedFile.preview}
              alt="Upload preview"
              className="h-16 w-16 rounded object-cover border border-border-default"
            />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded bg-surface-tertiary text-accent text-xs font-mono font-bold">
              PDF
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-text-primary truncate">
              {uploadedFile.name}
            </p>
            <p className="text-xs text-text-muted">
              {formatSize(uploadedFile.size)}
            </p>
          </div>
          <button
            type="button"
            onClick={handleRemove}
            className="text-text-muted hover:text-red-400 transition-colors p-1"
            aria-label="Remove file"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept=".pdf,image/*"
        onChange={(e) => {
          handleFile(e.target.files[0])
          e.target.value = ''
        }}
        className="hidden"
      />
    </div>
  )
}
