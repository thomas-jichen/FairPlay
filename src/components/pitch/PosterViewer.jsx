import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'

export default function PosterViewer({ uploadedFile, isOpen, onClose }) {
    const [objectUrl, setObjectUrl] = useState(null)

    // Create an object URL from the raw File blob for PDFs
    useEffect(() => {
        if (!uploadedFile || !uploadedFile.file || uploadedFile.preview) return

        // Since `preview` is null for PDFs, we create an object URL specifically for the iframe
        const url = URL.createObjectURL(uploadedFile.file)
        setObjectUrl(url)

        // Cleanup
        return () => {
            URL.revokeObjectURL(url)
        }
    }, [uploadedFile])

    if (!uploadedFile) return null

    const fileUrl = uploadedFile.preview || objectUrl

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, x: -40, scale: 0.95 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: -20, scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    className="absolute left-6 bottom-32 top-32 z-40 w-[30vw] min-w-[300px] max-w-lg pointer-events-auto"
                >
                    <div className="relative w-full h-full glass-panel rounded-3xl overflow-hidden shadow-2xl border border-white/60 flex flex-col bg-white/70 backdrop-blur-3xl">

                        {/* Header */}
                        <div className="flex items-center justify-between px-4 py-3 border-b border-black/[0.05] bg-white/40">
                            <div className="flex items-center gap-2 overflow-hidden">
                                <div className="flex h-6 w-6 items-center justify-center rounded bg-black/5 border border-black/10 shrink-0">
                                    <span className="text-[8px] font-bold tracking-widest uppercase text-text-secondary">
                                        {uploadedFile.type.includes('pdf') ? 'PDF' : 'IMG'}
                                    </span>
                                </div>
                                <span className="text-sm font-medium text-text-primary truncate">
                                    {uploadedFile.name}
                                </span>
                            </div>
                            <button
                                onClick={onClose}
                                className="w-8 h-8 flex items-center justify-center rounded-full bg-black/5 text-text-secondary hover:bg-black/10 hover:text-text-primary transition-colors shrink-0"
                                aria-label="Close poster viewer"
                            >
                                <svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Viewer Content */}
                        <div className="flex-1 w-full h-full bg-black/[0.02] p-4 relative overflow-auto">
                            {fileUrl ? (
                                uploadedFile.type.includes('pdf') ? (
                                    <iframe
                                        src={`${fileUrl}#toolbar=0&view=FitH`}
                                        type="application/pdf"
                                        className="w-full h-full rounded-xl border border-black/10 shadow-sm bg-white"
                                        title="PDF Viewer"
                                    />
                                ) : (
                                    <img
                                        src={fileUrl}
                                        alt="Poster Preview"
                                        className="w-full h-auto rounded-xl border border-black/10 shadow-sm"
                                    />
                                )
                            ) : (
                                <div className="flex h-full w-full items-center justify-center">
                                    <span className="type-body text-sm text-text-muted">Loading preview...</span>
                                </div>
                            )}
                        </div>

                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
