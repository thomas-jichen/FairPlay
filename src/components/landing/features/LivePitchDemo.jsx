import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

const JUDGE_QUESTIONS = [
  "Can you walk me through the training split of your reinforcement learning model?",
  "What's your methodology for validating these results?",
  "How does this generalize beyond your test dataset?",
  "Walk me through the statistical significance of your findings.",
  "What's the most surprising result you found?",
]

const METRIC_CYCLE = [
  { confidence: 'green', engagement: 'yellow', approachability: 'green' },
  { confidence: 'green', engagement: 'green', approachability: 'yellow' },
  { confidence: 'yellow', engagement: 'green', approachability: 'green' },
  { confidence: 'green', engagement: 'green', approachability: 'green' },
]

const DOT_STYLES = {
  green: {
    background: 'rgba(52, 211, 153, 0.9)',
    boxShadow: '0 0 8px rgba(16, 185, 129, 0.55)',
  },
  yellow: {
    background: 'rgba(251, 191, 36, 0.9)',
    boxShadow: '0 0 8px rgba(245, 158, 11, 0.5)',
  },
  red: {
    background: 'rgba(248, 113, 113, 0.9)',
    boxShadow: '0 0 8px rgba(239, 68, 68, 0.55)',
  },
}

function MetricPill({ label, tone }) {
  return (
    <div className="flex items-center gap-1.5 rounded-full bg-white/10 border border-white/15 backdrop-blur-md px-3 py-1">
      <span
        className="h-1.5 w-1.5 rounded-full transition-all duration-500"
        style={DOT_STYLES[tone]}
      />
      <span className="type-caption text-[10px] tracking-widest text-white/90">
        {label}
      </span>
    </div>
  )
}

function PaceBar() {
  const thumbRef = useRef(null)
  const labelRef = useRef(null)
  const startRef = useRef(Date.now())

  useEffect(() => {
    let raf
    const tick = () => {
      const elapsed = (Date.now() - startRef.current) / 1000
      const base = 50 + Math.sin(elapsed * 0.7) * 8
      const burst = Math.sin(elapsed * 0.25) > 0.92
      const pos = burst ? 50 + Math.sin(elapsed * 0.7) * 18 : base
      const isIdeal = !burst
      const color = isIdeal ? '#34D399' : '#FBBF24'

      if (thumbRef.current) {
        thumbRef.current.style.left = `${pos}%`
        thumbRef.current.style.background = color
        thumbRef.current.style.boxShadow = `0 0 10px ${color}a0, 0 0 4px ${color}`
      }
      if (labelRef.current) {
        labelRef.current.textContent = isIdeal ? 'Pace: Ideal Pace' : 'Pace: Slight Deviation'
        labelRef.current.style.color = isIdeal ? 'rgb(110, 231, 183)' : 'rgb(252, 211, 77)'
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div className="w-full min-w-[220px]">
      <div className="flex items-center justify-between text-[9px] uppercase tracking-widest mb-1.5">
        <span className="text-white/40">Slow</span>
        <span ref={labelRef} className="font-semibold text-emerald-300">
          Pace: Ideal Pace
        </span>
        <span className="text-white/40">Fast</span>
      </div>
      <div className="relative h-1.5 rounded-full bg-white/10">
        <div
          ref={thumbRef}
          className="absolute top-1/2 h-3 w-3 rounded-full"
          style={{
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: '#34D399',
            boxShadow: '0 0 10px #34D399a0, 0 0 4px #34D399',
            border: '2px solid rgba(255,255,255,0.35)',
          }}
        />
      </div>
    </div>
  )
}

export default function LivePitchDemo() {
  const [questionIdx, setQuestionIdx] = useState(0)
  const [metricIdx, setMetricIdx] = useState(0)
  const [videoReady, setVideoReady] = useState(false)
  const videoRef = useRef(null)

  useEffect(() => {
    const qTimer = setInterval(() => {
      setQuestionIdx((i) => (i + 1) % JUDGE_QUESTIONS.length)
    }, 4500)
    return () => clearInterval(qTimer)
  }, [])

  useEffect(() => {
    const mTimer = setInterval(() => {
      setMetricIdx((i) => (i + 1) % METRIC_CYCLE.length)
    }, 2500)
    return () => clearInterval(mTimer)
  }, [])

  // Kick playback as soon as the component mounts; some browsers stall autoplay
  // until an explicit play() even for muted inline video.
  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    const tryPlay = () => {
      const p = v.play()
      if (p && typeof p.catch === 'function') p.catch(() => { })
    }
    tryPlay()

    // Seamlessly loop the first minute only: when playback crosses 60s, snap
    // back to the start without pausing. The file is preloaded so the seek
    // is effectively instant and playback continues uninterrupted.
    const LOOP_END = 60
    const onTimeUpdate = () => {
      if (v.currentTime >= LOOP_END) {
        v.currentTime = 0
      }
    }
    v.addEventListener('timeupdate', onTimeUpdate)
    return () => v.removeEventListener('timeupdate', onTimeUpdate)
  }, [])

  const metrics = METRIC_CYCLE[metricIdx]

  return (
    <div className="relative mx-auto w-full max-w-[820px] aspect-[16/11] rounded-3xl overflow-hidden bg-black shadow-2xl ring-1 ring-white/10">
      {/* Video */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover pointer-events-none scale-[1.10] origin-center translate-x-5"
        src="/demo.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        disablePictureInPicture
        onCanPlay={() => setVideoReady(true)}
      />

      {/* Startup cover: masks the first-frame flash until the video has buffered enough to play */}
      <div
        className="pointer-events-none absolute inset-0 bg-black transition-opacity duration-500"
        style={{ opacity: videoReady ? 0 : 1 }}
      />

      {/* Subtle vignette for overlay legibility */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/35 via-transparent to-black/45" />

      {/* Top overlay: AI judge question */}
      <div className="absolute top-4 md:top-6 left-4 right-4 flex justify-center pointer-events-none">
        <div className="w-full max-w-xl rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl px-5 py-3.5">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-2">
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-white/15 border border-white/25">
                <svg className="h-2.5 w-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <span className="type-caption text-[10px] text-white/80 tracking-widest">AI JUDGE</span>
            </div>
            <span className="rounded-full bg-white/10 border border-white/20 px-2 py-0.5 text-[10px] font-bold tabular-nums text-white/90">
              Q{questionIdx + 1}
            </span>
          </div>
          <AnimatePresence mode="wait">
            <motion.p
              key={questionIdx}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="text-sm md:text-base font-semibold text-white leading-snug tracking-tight drop-shadow-sm"
            >
              &ldquo;{JUDGE_QUESTIONS[questionIdx]}&rdquo;
            </motion.p>
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom overlay: metric pills + pace bar */}
      <div className="absolute bottom-4 md:bottom-6 left-4 right-4 flex justify-center pointer-events-none">
        <div className="rounded-full bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl px-5 py-3 flex flex-col items-center gap-2.5 min-w-[320px]">
          <div className="flex items-center gap-2">
            <MetricPill label="Confidence" tone={metrics.confidence} />
            <MetricPill label="Engagement" tone={metrics.engagement} />
            <MetricPill label="Approachability" tone={metrics.approachability} />
          </div>
          <PaceBar />
        </div>
      </div>
    </div>
  )
}
