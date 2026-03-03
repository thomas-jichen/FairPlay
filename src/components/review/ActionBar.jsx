import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router'
import useSessionStore from '../../stores/useSessionStore'
import { generatePdfReport } from '../../services/pdfExport'

export default function ActionBar({ evaluationResult, recordedBlob, category, crueltyLevel }) {
  const navigate = useNavigate()
  const resetSession = useSessionStore((s) => s.resetSession)
  const [copied, setCopied] = useState(false)

  const handleSaveVideo = useCallback(() => {
    if (!recordedBlob) return
    const url = URL.createObjectURL(recordedBlob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'fairplay-pitch.webm'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, [recordedBlob])

  const handleSaveReport = useCallback(() => {
    if (!evaluationResult) return
    generatePdfReport({ evaluationResult, category, crueltyLevel })
  }, [evaluationResult, category, crueltyLevel])

  const handleShareResults = useCallback(async () => {
    if (!evaluationResult) return
    const text = [
      `FAIRPLAY Pitch Practice — Score: ${evaluationResult.overallScore}/100`,
      '',
      'Key Strengths:',
      ...evaluationResult.feedback.keyStrengths.map((s) => `  - ${s}`),
      '',
      'Areas for Improvement:',
      ...evaluationResult.feedback.areasForImprovement.map((a) => `  - ${a}`),
    ].join('\n')

    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback for browsers that block clipboard
      const textarea = document.createElement('textarea')
      textarea.value = text
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }, [evaluationResult])

  const handlePracticeAgain = useCallback(() => {
    resetSession()
    navigate('/app')
  }, [resetSession, navigate])

  const secondaryBtnClass =
    'rounded-full bg-white border border-black/10 px-5 py-2.5 text-sm font-medium tracking-tight text-text-secondary shadow-sm hover:bg-surface-secondary hover:text-text-primary hover:border-black/15 transition-all duration-300 active:scale-[0.98]'

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/60 bg-white/30 backdrop-blur-3xl px-6 py-5 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
      <div className="mx-auto max-w-7xl flex items-center justify-between">
        <div className="flex items-center gap-3 md:gap-4 overflow-x-auto scrollbar-hide">
          {recordedBlob && (
            <button onClick={handleSaveVideo} className={secondaryBtnClass}>
              Save Video
            </button>
          )}
          <button onClick={handleSaveReport} className={secondaryBtnClass}>
            Save Report (PDF)
          </button>
          <button onClick={handleShareResults} className={secondaryBtnClass}>
            {copied ? 'Copied to Clipboard!' : 'Share Results'}
          </button>
        </div>
        <button
          onClick={handlePracticeAgain}
          className="shrink-0 ml-4 rounded-full bg-black px-8 py-3 text-sm font-semibold tracking-tight text-white shadow-md
                     hover:bg-black/80 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
        >
          Practice Again
        </button>
      </div>
    </div>
  )
}
