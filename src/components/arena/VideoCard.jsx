import { useRef, useEffect, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import Hls from 'hls.js'

// --- YouTube IFrame API loader ---
let ytApiPromise = null
function loadYouTubeAPI() {
  if (ytApiPromise) return ytApiPromise
  if (window.YT?.Player) return Promise.resolve()
  ytApiPromise = new Promise(resolve => {
    window.onYouTubeIframeAPIReady = resolve
    const tag = document.createElement('script')
    tag.src = 'https://www.youtube.com/iframe_api'
    document.head.appendChild(tag)
  })
  return ytApiPromise
}

// Eagerly load YouTube API on module import
loadYouTubeAPI()

// Preconnect to YouTube domains for faster iframe creation
for (const domain of ['https://www.youtube.com', 'https://i.ytimg.com', 'https://yt3.ggpht.com']) {
  const link = document.createElement('link')
  link.rel = 'preconnect'
  link.href = domain
  document.head.appendChild(link)
}

// --- HLS preload cache ---
const hlsPreloadCache = new Map()

function getYouTubeVideoId(url) {
  if (!url) return null
  if (url.includes('/embed/')) {
    const match = url.match(/\/embed\/([^?&/]+)/)
    return match?.[1] || null
  }
  const patterns = [
    /youtube\.com\/watch\?v=([^&]+)/,
    /youtu\.be\/([^?&]+)/,
  ]
  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) return match[1]
  }
  return null
}

function formatTime(seconds) {
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

function YouTubePlayer({ videoId, autoplay }) {
  const containerRef = useRef(null)
  const playerRef = useRef(null)
  const intervalRef = useRef(null)
  const hideTimerRef = useRef(null)
  const [playing, setPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [ready, setReady] = useState(false)
  const [hasPlayed, setHasPlayed] = useState(false)
  const [showControls, setShowControls] = useState(true)

  useEffect(() => {
    let destroyed = false

    loadYouTubeAPI().then(() => {
      if (destroyed || !containerRef.current) return

      playerRef.current = new window.YT.Player(containerRef.current, {
        host: 'https://www.youtube-nocookie.com',
        videoId,
        playerVars: {
          controls: 0,
          disablekb: 1,
          modestbranding: 1,
          rel: 0,
          showinfo: 0,
          iv_load_policy: 3,
          fs: 0,
          playsinline: 1,
          cc_load_policy: 0,
          origin: window.location.origin,
          autoplay: autoplay ? 1 : 0,
        },
        events: {
          onReady: (e) => {
            if (destroyed) return
            setReady(true)
            setDuration(e.target.getDuration())
            if (autoplay) e.target.playVideo()
          },
          onStateChange: (e) => {
            if (destroyed) return
            const isPlaying = e.data === window.YT.PlayerState.PLAYING
            setPlaying(isPlaying)
            if (isPlaying) {
              setHasPlayed(true)
              setDuration(e.target.getDuration())
            }
          },
        },
      })
    })

    return () => {
      destroyed = true
      if (intervalRef.current) clearInterval(intervalRef.current)
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current)
      if (playerRef.current?.destroy) {
        try { playerRef.current.destroy() } catch {}
      }
    }
  }, [videoId, autoplay])

  // Poll current time while playing
  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    if (playing && playerRef.current?.getCurrentTime) {
      intervalRef.current = setInterval(() => {
        setCurrentTime(playerRef.current.getCurrentTime())
      }, 250)
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [playing])

  // Auto-hide controls after 2.5s of no mouse movement while playing
  const resetHideTimer = useCallback(() => {
    setShowControls(true)
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current)
    if (playing) {
      hideTimerRef.current = setTimeout(() => setShowControls(false), 2500)
    }
  }, [playing])

  useEffect(() => {
    if (!playing) {
      setShowControls(true)
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current)
    } else {
      hideTimerRef.current = setTimeout(() => setShowControls(false), 2500)
    }
    return () => { if (hideTimerRef.current) clearTimeout(hideTimerRef.current) }
  }, [playing])

  const togglePlay = () => {
    if (!playerRef.current) return
    if (playing) {
      playerRef.current.pauseVideo()
    } else {
      playerRef.current.playVideo()
    }
  }

  const handleSeek = (e) => {
    if (!playerRef.current || !duration) return
    const rect = e.currentTarget.getBoundingClientRect()
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
    playerRef.current.seekTo(pct * duration, true)
    setCurrentTime(pct * duration)
  }

  const progress = duration > 0 ? currentTime / duration : 0

  return (
    <div className="absolute inset-0" onMouseMove={resetHideTimer}>
      {/* iframe wrapper: pointer-events:none on the iframe stops YouTube's
          hover UI (title bar, channel name, "Watch on YouTube" overlay) from
          ever firing — our overlay handles all clicks via the IFrame API. */}
      <div
        ref={containerRef}
        className="absolute inset-0 w-full h-full [&>iframe]:pointer-events-none"
      />

      {/* Black cover hides the YouTube poster/thumbnail before first play.
          Once the user has played the video at least once, the cover stays
          off — pausing mid-video shows the paused frame, not a black square. */}
      <div
        className="absolute inset-0 bg-black pointer-events-none"
        style={{
          opacity: hasPlayed ? 0 : 1,
          transition: 'opacity 0.15s ease',
        }}
      />

      {/* Persistent masks for YouTube branding that the iframe always shows
          (title bar at top, YouTube logo at bottom-right). pointer-events:none
          so our progress/play overlay still receives clicks. */}
      <div className="absolute top-0 inset-x-0 h-14 bg-black pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-28 h-10 bg-black pointer-events-none" />

      {/* Full overlay for custom controls */}
      <div
        className="absolute inset-0 flex flex-col justify-end cursor-pointer"
        onClick={togglePlay}
      >
        {/* Center play button when paused */}
        {ready && !playing && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-16 h-16 rounded-full bg-black/50 flex items-center justify-center">
              <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        )}

        {/* Bottom controls bar */}
        <div
          className="transition-opacity duration-300 pointer-events-auto"
          style={{ opacity: showControls ? 1 : 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Progress bar */}
          <div
            className="w-full h-6 flex items-center px-3 cursor-pointer group"
            onClick={handleSeek}
          >
            <div className="w-full h-1 group-hover:h-1.5 bg-white/20 rounded-full transition-all relative">
              <div
                className="absolute inset-y-0 left-0 bg-red-500 rounded-full"
                style={{ width: `${progress * 100}%` }}
              />
              <div
                className="absolute top-1/2 w-3 h-3 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ left: `${progress * 100}%`, transform: 'translate(-50%, -50%)' }}
              />
            </div>
          </div>

          {/* Time display */}
          <div className="flex items-center justify-between px-3 pb-2 pt-1">
            <button
              className="text-white/80 hover:text-white"
              onClick={(e) => { e.stopPropagation(); togglePlay() }}
            >
              {playing ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>
            <span className="text-xs text-white/60 font-mono">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

function isYouTube(url) {
  return url && (url.includes('youtube.com') || url.includes('youtu.be'))
}

function isHLS(url) {
  return url && url.endsWith('.m3u8')
}

function HLSPlayer({ src, title, autoplay }) {
  const videoRef = useRef(null)
  const hlsRef = useRef(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video || !src) return

    if (Hls.isSupported()) {
      // Check if we have a preloaded instance
      const cached = hlsPreloadCache.get(src)
      if (cached) {
        hlsPreloadCache.delete(src)
        const { hls } = cached
        cached.video.remove()
        hlsRef.current = hls
        hls.detachMedia()
        hls.attachMedia(video)
        if (autoplay) {
          hls.on(Hls.Events.MEDIA_ATTACHED, () => video.play().catch(() => {}))
        }
      } else {
        const hls = new Hls({
          capLevelToPlayerSize: true,
          startLevel: 0,
          maxBufferLength: 5,
          maxMaxBufferLength: 15,
          maxBufferSize: 10 * 1000 * 1000,
          enableWorker: true,
          backBufferLength: 0,
          startFragPrefetch: true,
        })
        hlsRef.current = hls
        hls.loadSource(src)
        hls.attachMedia(video)
        if (autoplay) {
          hls.on(Hls.Events.MANIFEST_PARSED, () => {
            video.play().catch(() => {})
          })
        }
      }
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = src
      if (autoplay) {
        video.addEventListener('loadedmetadata', () => video.play().catch(() => {}), { once: true })
      }
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy()
        hlsRef.current = null
      }
    }
  }, [src, autoplay])

  return (
    <video
      ref={videoRef}
      className="absolute inset-0 w-full h-full bg-black"
      controls
      playsInline
      title={title}
    />
  )
}

export function preloadVideo(url) {
  if (!url) return null

  if (isYouTube(url)) {
    const link = document.createElement('link')
    link.rel = 'preconnect'
    link.href = 'https://www.youtube-nocookie.com'
    document.head.appendChild(link)
    return () => link.remove()
  }

  if (isHLS(url) && Hls.isSupported()) {
    const hls = new Hls({
      startLevel: 0,
      maxBufferLength: 10,
      enableWorker: true,
      startFragPrefetch: true,
    })
    const video = document.createElement('video')
    video.muted = true
    video.preload = 'auto'
    hls.loadSource(url)
    hls.attachMedia(video)
    hlsPreloadCache.set(url, { hls, video })
    return () => {
      if (hlsPreloadCache.get(url)?.hls === hls) {
        hlsPreloadCache.delete(url)
        hls.destroy()
      }
      video.remove()
    }
  }

  return null
}

export default function VideoCard({ project, autoplay = false }) {
  const { videoUrl } = project

  const renderVideo = () => {
    if (!videoUrl) {
      return (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-white/30">
          <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" />
          </svg>
          <span className="text-sm">No video available</span>
        </div>
      )
    }

    if (isYouTube(videoUrl)) {
      const videoId = getYouTubeVideoId(videoUrl)
      if (videoId) {
        return <YouTubePlayer videoId={videoId} autoplay={autoplay} />
      }
    }

    if (isHLS(videoUrl)) {
      return <HLSPlayer src={videoUrl} title={project.title} autoplay={autoplay} />
    }

    return (
      <video
        className="absolute inset-0 w-full h-full bg-black"
        controls
        playsInline
        autoPlay={autoplay}
        title={project.title}
        src={videoUrl}
      />
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="stage-card relative w-full aspect-video overflow-hidden">
        {renderVideo()}
      </div>

      <div className="mt-5 flex flex-col gap-2">
        <div className="flex items-center gap-2 type-caption text-xs sm:text-sm text-white/40">
          <span>{project.category}</span>
          <span className="text-white/20">·</span>
          <span>{project.year}</span>
          <span className="text-white/20">·</span>
          <span className="tabular-nums">{project.id}</span>
        </div>
        <h2 className="type-title text-xl sm:text-2xl text-white/95 leading-tight">
          {project.title}
        </h2>
      </div>
    </motion.div>
  )
}
