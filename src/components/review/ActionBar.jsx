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
      `FairPlay Pitch Practice — Score: ${evaluationResult.overallScore}/100`,
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
    navigate('/')
  }, [resetSession, navigate])

  const secondaryBtnClass =
    'rounded-full bg-white/5 border border-white/10 px-5 py-2.5 text-sm font-medium text-text-secondary hover:bg-white/10 hover:text-white hover:border-white/20 transition-all duration-300 active:scale-[0.98]'

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/5 bg-black/60 backdrop-blur-2xl px-6 py-5 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
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
          className="shrink-0 ml-4 rounded-full bg-accent/90 px-8 py-3 text-sm font-bold tracking-wide text-white shadow-[0_0_20px_rgba(14,187,187,0.3)]
                     hover:bg-accent hover:shadow-[0_0_30px_rgba(14,187,187,0.5)] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
        >
          Practice Again
        </button>
      </div>
    </div>
  )
}
