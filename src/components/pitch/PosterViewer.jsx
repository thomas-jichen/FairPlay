import { motion, AnimatePresence, useDragControls, useMotionValue } from 'framer-motion'
import { useEffect, useState, useRef } from 'react'

export default function PosterViewer({ uploadedFile, isOpen, onClose }) {
    const [objectUrl, setObjectUrl] = useState(null)

    // Resizing state
    const containerRef = useRef(null)
    const isResizing = useRef(false)

    // Default dimensions
    const [dimensions, setDimensions] = useState({ width: 450, height: 600 })
    const width = useMotionValue(450)
    const height = useMotionValue(600)

    const dragControls = useDragControls()

    // Create an object URL from the raw File blob for PDFs
    useEffect(() => {
        if (!uploadedFile || !uploadedFile.file || uploadedFile.preview) return

        const url = URL.createObjectURL(uploadedFile.file)
        setObjectUrl(url)

        return () => URL.revokeObjectURL(url)
    }, [uploadedFile])

    // Sync motion values to state for re-renders if needed, though motion styles are inherently reactive
    useEffect(() => {
        const unsubscribeW = width.on("change", (v) => setDimensions(prev => ({ ...prev, width: v })))
        const unsubscribeH = height.on("change", (v) => setDimensions(prev => ({ ...prev, height: v })))
        return () => {
            unsubscribeW()
            unsubscribeH()
        }
    }, [width, height])

    // Handle manual resize drag
    const handleResizePointerDown = (e) => {
        e.preventDefault()
        e.stopPropagation()
        isResizing.current = true

        const startX = e.clientX
        const startY = e.clientY
        const startWidth = width.get()
        const startHeight = height.get()

        const onPointerMove = (moveEvent) => {
            if (!isResizing.current) return

            const deltaX = moveEvent.clientX - startX
            const deltaY = moveEvent.clientY - startY

            // Calculate new dimensions (enforce minimums)
            const newWidth = Math.max(300, startWidth + deltaX)
            const newHeight = Math.max(400, startHeight + deltaY)

            width.set(newWidth)
            height.set(newHeight)
        }

        const onPointerUp = () => {
            isResizing.current = false
            window.removeEventListener('pointermove', onPointerMove)
            window.removeEventListener('pointerup', onPointerUp)
        }

        window.addEventListener('pointermove', onPointerMove)
        window.addEventListener('pointerup', onPointerUp)
    }

    if (!uploadedFile) return null
    const fileUrl = uploadedFile.preview || objectUrl

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    ref={containerRef}
                    // Initial appearance
                    initial={{ opacity: 0, scale: 0.95, y: 50 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}

                    // Drag behavior
                    drag
                    dragControls={dragControls}
                    dragListener={false} // Only drag using the header handle
                    dragMomentum={false}
                    dragElastic={0}

                    // Apply dynamic explicit bounds via framer-motion style
                    style={{ width, height, position: 'absolute', left: 24, top: '15vh', zIndex: 50, touchAction: 'none' }}
                    className="pointer-events-auto"
                >
                    <div className="relative w-full h-full glass-panel rounded-3xl overflow-hidden shadow-2xl border border-white/60 flex flex-col bg-white/70 backdrop-blur-3xl">

                        {/* Draggable Header */}
                        <div
                            onPointerDown={(e) => dragControls.start(e)}
                            style={{ touchAction: 'none' }}
                            className="flex items-center justify-between px-4 py-3 border-b border-black/[0.05] bg-white/40 cursor-grab active:cursor-grabbing shrink-0"
                        >
                            <div className="flex items-center gap-2 overflow-hidden pointer-events-none">
                                <div className="flex h-6 w-6 items-center justify-center rounded bg-black/5 border border-black/10 shrink-0">
                                    <span className="text-[8px] font-bold tracking-widest uppercase text-text-secondary">
                                        {uploadedFile.type.includes('pdf') ? 'PDF' : 'IMG'}
                                    </span>
                                </div>
                                <span className="text-sm font-medium text-text-primary truncate">
                                    {uploadedFile.name}
                                </span>
                            </div>

                            <div className="flex items-center gap-2">
                                {/* Drag Indicator (Visual Only) */}
                                <div className="flex gap-1 opacity-40 px-2">
                                    <div className="w-1 h-1 rounded-full bg-black/60"></div>
                                    <div className="w-1 h-1 rounded-full bg-black/60"></div>
                                    <div className="w-1 h-1 rounded-full bg-black/60"></div>
                                </div>

                                <button
                                    onPointerDown={(e) => e.stopPropagation()}
                                    onClick={onClose}
                                    className="w-8 h-8 flex items-center justify-center rounded-full bg-black/5 text-text-secondary hover:bg-black/10 hover:text-text-primary transition-colors shrink-0"
                                    aria-label="Close poster viewer"
                                >
                                    <svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* Viewer Content */}
                        <div className="flex-1 w-full bg-black/[0.02] p-4 relative overflow-hidden" onPointerDown={(e) => e.stopPropagation()}>
                            {fileUrl ? (
                                uploadedFile.type.includes('pdf') ? (
                                    <iframe
                                        src={`${fileUrl}#toolbar=0&view=FitH`}
                                        type="application/pdf"
                                        className="w-full h-full rounded-xl border border-black/10 shadow-sm bg-white"
                                        title="PDF Viewer"
                                    />
                                ) : (
                                    <div className="w-full h-full overflow-auto rounded-xl border border-black/10 shadow-sm bg-black/5">
                                        <img
                                            src={fileUrl}
                                            alt="Poster Preview"
                                            className="w-full h-auto"
                                        />
                                    </div>
                                )
                            ) : (
                                <div className="flex h-full w-full items-center justify-center">
                                    <span className="type-body text-sm text-text-muted">Loading preview...</span>
                                </div>
                            )}
                        </div>

                        {/* Custom Resize Handle (Bottom Right Corner) */}
                        <div
                            onPointerDown={handleResizePointerDown}
                            className="absolute bottom-0 right-0 w-8 h-8 cursor-se-resize flex items-end justify-end p-2 z-10"
                            style={{ touchAction: 'none' }}
                        >
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-black/30">
                                <path d="M12 0L0 12H12V0Z" fill="currentColor" />
                            </svg>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
