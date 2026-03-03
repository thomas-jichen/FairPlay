import { useEffect } from 'react'

export default function WebcamFeed({ videoRef, isActive, error, onRequestCamera }) {
  useEffect(() => {
    onRequestCamera()
  }, [onRequestCamera])

  if (error) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-surface-secondary">
        <div className="text-center px-8">
          <p className="text-lg font-medium text-red-400 mb-2">
            Camera Unavailable
          </p>
          <p className="text-sm text-text-muted max-w-sm">{error}</p>
          <button
            type="button"
            onClick={onRequestCamera}
            className="mt-4 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white
                       hover:bg-accent-light transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  if (!isActive) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-surface-secondary">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent mb-3" />
          <p className="text-sm text-text-muted">Requesting camera access...</p>
        </div>
      </div>
    )
  }

  return (
    <video
      ref={videoRef}
      autoPlay
      playsInline
      muted
      onLoadedMetadata={(e) => e.target.play().catch(() => { })}
      className="absolute inset-0 h-full w-full object-cover z-0"
      style={{ transform: 'scaleX(-1)' }}
    />
  )
}
