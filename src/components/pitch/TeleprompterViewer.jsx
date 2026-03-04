import { motion, AnimatePresence, useDragControls, useMotionValue } from 'framer-motion'
import { useEffect, useState, useRef } from 'react'

export default function TeleprompterViewer({ text, isOpen, onClose }) {
    // Resizing state
    const isResizing = useRef(false)
    const width = useMotionValue(400)
    const height = useMotionValue(500)

    const dragControls = useDragControls()

    // Teleprompter state
    const [isPlaying, setIsPlaying] = useState(false)
    const [wpm, setWpm] = useState(130)
    const [fontSize, setFontSize] = useState(24) // Base font size
    const scrollContainerRef = useRef(null)
    const animationFrameRef = useRef(null)

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

            // Since it's anchored to the left now, increasing deltaX increases width
            const newWidth = Math.max(250, startWidth + (moveEvent.clientX - startX))
            const newHeight = Math.max(300, startHeight + (moveEvent.clientY - startY))

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

    // Auto-scroll loop based on WPM
    useEffect(() => {
        if (!isPlaying) {
            if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current)
            return
        }

        // Approximation: 1 word = ~5 characters on average + 1 space
        // Let's scroll dynamically based on the font size and estimated line heights
        // A simplified scroll formula: speed (pixels/sec) based on WPM.
        // 130 WPM = ~130 words / 60 = 2.16 words/sec. 
        const pixelsPerSecond = (wpm / 60) * (fontSize * 1.5) // Adjust multiplier to feel right
        let lastTime = performance.now()

        const scrollLoop = (time) => {
            const delta = (time - lastTime) / 1000 // elapsed seconds
            lastTime = time

            if (scrollContainerRef.current) {
                scrollContainerRef.current.scrollTop += pixelsPerSecond * delta
            }

            animationFrameRef.current = requestAnimationFrame(scrollLoop)
        }

        animationFrameRef.current = requestAnimationFrame(scrollLoop)

        return () => {
            if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current)
        }
    }, [isPlaying, wpm, fontSize])

    if (!text) return null

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 50 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}

                    drag
                    dragControls={dragControls}
                    dragListener={false}
                    dragMomentum={false}
                    dragElastic={0}

                    style={{ width, height, position: 'absolute', left: window.innerWidth > 768 ? window.innerWidth - 424 : 24, top: '15vh', zIndex: 50, touchAction: 'none' }}
                    className="pointer-events-auto"
                >
                    <div className="relative w-full h-full glass-panel no-shimmer rounded-3xl overflow-hidden shadow-2xl border border-white/60 flex flex-col bg-black/80 backdrop-blur-3xl">

                        {/* Draggable Header / Controls */}
                        <div
                            onPointerDown={(e) => dragControls.start(e)}
                            style={{ touchAction: 'none' }}
                            className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-black/40 cursor-grab active:cursor-grabbing shrink-0"
                        >
                            <div className="flex items-center gap-3">
                                <button
                                    onPointerDown={(e) => e.stopPropagation()}
                                    onClick={() => setIsPlaying(!isPlaying)}
                                    className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors ${isPlaying ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30' : 'bg-white/10 text-white hover:bg-white/20'}`}
                                >
                                    {isPlaying ? (
                                        <svg fill="currentColor" viewBox="0 0 24 24" className="w-3.5 h-3.5"><path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" /></svg>
                                    ) : (
                                        <svg fill="currentColor" viewBox="0 0 24 24" className="w-4 h-4 ml-0.5"><path d="M8 5v14l11-7z" /></svg>
                                    )}
                                </button>

                                <div
                                    onPointerDown={(e) => e.stopPropagation()}
                                    className="flex items-center gap-2 bg-white/5 rounded-full px-3 py-1 border border-white/10"
                                >
                                    <span className="type-caption text-[10px] text-white/50 w-8">{wpm} WPM</span>
                                    <input
                                        type="range"
                                        min="80"
                                        max="220"
                                        value={wpm}
                                        onChange={(e) => setWpm(parseInt(e.target.value))}
                                        className="w-20 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer"
                                    />
                                </div>
                            </div>

                            <button
                                onPointerDown={(e) => e.stopPropagation()}
                                onClick={onClose}
                                className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 text-white/50 hover:bg-white/20 hover:text-white transition-colors shrink-0"
                                aria-label="Close teleprompter"
                            >
                                <svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Scrolling Viewport */}
                        <div
                            ref={scrollContainerRef}
                            className="flex-1 w-full bg-transparent p-6 relative overflow-y-auto scrollbar-hide text-white"
                            onPointerDown={(e) => e.stopPropagation()}
                        >
                            {/* Padding top to start text lower down initially */}
                            <div className="h-1/3 w-full" />
                            <div
                                className="font-serif leading-relaxed"
                                style={{ fontSize: `${fontSize}px`, paddingBottom: '50vh' }}
                            >
                                {text.split('\n').map((para, i) => (
                                    <p key={i} className="mb-6 opacity-90 tracking-wide">{para}</p>
                                ))}
                            </div>
                        </div>

                        {/* Fade overlays for smooth entry/exit of text */}
                        <div className="absolute top-[52px] left-0 right-0 h-16 bg-gradient-to-b from-black/90 to-transparent pointer-events-none" />
                        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/90 to-transparent pointer-events-none" />

                        {/* Custom Resize Handle (Bottom Right) */}
                        <div
                            onPointerDown={handleResizePointerDown}
                            className="absolute bottom-0 right-0 w-8 h-8 cursor-se-resize flex items-end justify-end p-2 z-10"
                            style={{ touchAction: 'none' }}
                        >
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white/30">
                                <path d="M12 0L0 12H12V0Z" fill="currentColor" />
                            </svg>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
