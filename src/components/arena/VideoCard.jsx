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

// Browsers block unmuted autoplay before the first user gesture in the tab.
// Rather than muting the first video, we skip its autoplay entirely — the
// user clicks play, that gesture unlocks the tab, and every subsequent
// video in the session autoplays normally with sound.
let hasUserPlayedAVideo = false
let userPrefersUnmuted = false

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
  const [showControls, setShowControls] = useState(true)
  const [iframeMounted, setIframeMounted] = useState(autoplay && hasUserPlayedAVideo)
  const [showPoster, setShowPoster] = useState(true)
  const [muted, setMuted] = useState(false)

  // Reset transient state when the video changes
  useEffect(() => {
    setIframeMounted(autoplay && hasUserPlayedAVideo)
    setShowPoster(true)
    setReady(false)
    setPlaying(false)
    setCurrentTime(0)
    setDuration(0)
    setMuted(false)
  }, [videoId, autoplay])

  // YouTube serves thumbnails at a few resolutions; maxres isn't always present,
  // so fall back to sd → hq when the higher-res variant 404s.
  const handlePosterError = (e) => {
    const src = e.target.src
    if (src.includes('maxresdefault')) {
      e.target.src = `https://i.ytimg.com/vi/${videoId}/sddefault.jpg`
    } else if (src.includes('sddefault')) {
      e.target.src = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`
    }
  }

  useEffect(() => {
    if (!iframeMounted) return
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
          // Always autoplay: the iframe is only mounted on user intent (or
          // round autoplay after the first gesture has unlocked the tab).
          // Starting in PLAYING also prevents YouTube's title-bar splash.
          autoplay: 1,
        },
        events: {
          onReady: (e) => {
            if (destroyed) return
            setReady(true)
            setDuration(e.target.getDuration())
            e.target.playVideo()
          },
          onStateChange: (e) => {
            if (destroyed) return
            const state = e.data
            const isPlaying = state === window.YT.PlayerState.PLAYING
            setPlaying(isPlaying)
            if (isPlaying) {
              setDuration(e.target.getDuration())
              setShowPoster(false)
            } else if (
              state === window.YT.PlayerState.PAUSED ||
              state === window.YT.PlayerState.ENDED
            ) {
              // Re-cover with the poster so YouTube's title bar / related-videos
              // grid never gets a chance to flash on pause or end.
              setShowPoster(true)
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
      playerRef.current = null
    }
  }, [iframeMounted, videoId])

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
    if (!iframeMounted) {
      // First click in the session = the gesture that unlocks autoplay
      // for every subsequent video.
      hasUserPlayedAVideo = true
      setIframeMounted(true)
      return
    }
    if (!playerRef.current) return
    if (playing) {
      playerRef.current.pauseVideo()
    } else {
      playerRef.current.playVideo()
    }
  }

  const toggleMute = () => {
    if (!playerRef.current) return
    if (muted) {
      playerRef.current.unMute()
      setMuted(false)
    } else {
      playerRef.current.mute()
      setMuted(true)
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
  const showBigPlay = showPoster
  const controlsAvailable = ready && !showPoster

  return (
    <div className="absolute inset-0 overflow-hidden bg-black" onMouseMove={resetHideTimer}>
      {/* iframe at natural size — no scale, no offset, so video content is
          never cropped on any viewport. pointer-events:none keeps YouTube's
          hover UI from firing; our overlay handles all clicks. */}
      {iframeMounted && (
        <div className="absolute inset-0 [&>iframe]:absolute [&>iframe]:inset-0 [&>iframe]:w-full [&>iframe]:h-full [&>iframe]:pointer-events-none [&>iframe]:border-0">
          <div ref={containerRef} />
        </div>
      )}

      {/* Custom poster — covers the YouTube splash before play and re-covers
          on pause/end so the title bar and related-videos grid never appear. */}
      <img
        src={`https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`}
        onError={handlePosterError}
        alt=""
        aria-hidden="true"
        draggable="false"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none transition-opacity duration-200"
        style={{ opacity: showPoster ? 1 : 0 }}
      />

      {/* Persistent top mask — fully opaque across the full top edge so
          YouTube's title bar, channel name, and avatar are never visible at
          any point during playback (start, mid-video, on hover, on resume).
          Solid black for the upper portion, then a soft fade so the
          transition into the video frame isn't a hard line. */}
      {iframeMounted && !showPoster && (
        <div
          className="absolute top-0 left-0 right-0 h-[16%] pointer-events-none"
          style={{
            background:
              'linear-gradient(to bottom, #000 0%, #000 65%, rgba(0,0,0,0.7) 85%, rgba(0,0,0,0) 100%)',
          }}
        />
      )}

      {/* Persistent bottom mask — fully opaque across the full bottom edge
          so the "Watch on YouTube" badge, end-screen credits, and presenter
          credit overlays are never visible. The custom controls bar renders
          above this and is fully readable against the dark backing. */}
      {iframeMounted && !showPoster && (
        <div
          className="absolute bottom-0 left-0 right-0 h-[14%] pointer-events-none"
          style={{
            background:
              'linear-gradient(to top, #000 0%, #000 60%, rgba(0,0,0,0.7) 85%, rgba(0,0,0,0) 100%)',
          }}
        />
      )}

      {/* Full overlay for custom controls */}
      <div
        className="absolute inset-0 flex flex-col justify-end cursor-pointer"
        onClick={togglePlay}
      >
        {/* Center play button — shown whenever the poster is up
            (initial state, paused, ended) */}
        {showBigPlay && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-16 h-16 rounded-full bg-black/50 flex items-center justify-center">
              <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        )}

        {/* Bottom controls bar — only meaningful once the player is ready
            and we're past the poster state */}
        {controlsAvailable && (
          <div
            className="transition-opacity duration-300 pointer-events-auto relative z-10"
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
              <div className="flex items-center gap-3">
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
                <button
                  className="text-white/80 hover:text-white"
                  onClick={(e) => { e.stopPropagation(); toggleMute() }}
                  aria-label={muted ? 'Unmute' : 'Mute'}
                >
                  {muted ? (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                    </svg>
                  )}
                </button>
              </div>
              <span className="text-xs text-white/60 font-mono">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>
          </div>
        )}
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

    // Mirror the YouTube muted-autoplay default so HLS videos also start
    // reliably. Native <video controls> exposes a mute toggle, and we
    // listen for the user toggling it to update the session preference.
    video.muted = !userPrefersUnmuted
    const handleVolumeChange = () => {
      if (!video.muted) userPrefersUnmuted = true
      else userPrefersUnmuted = false
    }
    video.addEventListener('volumechange', handleVolumeChange)

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
      video.removeEventListener('volumechange', handleVolumeChange)
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
