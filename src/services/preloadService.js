import { FilesetResolver } from '@mediapipe/tasks-vision'
import { summarizeJudgeContext } from './judgeService'
import useSessionStore from '../stores/useSessionStore'

const WASM_BASE = 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
const POSE_MODEL_URL =
  'https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task'

let mediaPipeStarted = false

export function preloadMediaPipeAssets() {
  if (mediaPipeStarted) return
  mediaPipeStarted = true

  FilesetResolver.forVisionTasks(WASM_BASE).catch((err) => {
    console.warn('[preload] FilesetResolver warm-up failed:', err)
  })

  fetch(POSE_MODEL_URL, { cache: 'force-cache', mode: 'cors' }).catch((err) => {
    console.warn('[preload] pose model fetch failed:', err)
  })
}

let lastFingerprint = null
let inFlight = null

function fingerprintInputs({ abstractText, posterBase64, posterMimeType }) {
  const a = abstractText || ''
  const p = posterBase64 || ''
  const m = posterMimeType || ''
  return `${a.length}|${a.slice(0, 32)}|${a.slice(-32)}|${p.length}|${p.slice(0, 32)}|${m}`
}

export function preloadJudgeContext({ abstractText, posterBase64, posterMimeType }) {
  if (!abstractText && !posterBase64) return

  const fp = fingerprintInputs({ abstractText, posterBase64, posterMimeType })
  if (fp === lastFingerprint) return
  lastFingerprint = fp

  inFlight = summarizeJudgeContext({ abstractText, posterBase64, posterMimeType })
    .then((summary) => {
      if (summary) {
        useSessionStore.getState().setContextSummary(summary)
      }
    })
    .catch((err) => {
      console.warn('[preload] judge context summary failed:', err)
      lastFingerprint = null
    })
    .finally(() => {
      inFlight = null
    })
}
