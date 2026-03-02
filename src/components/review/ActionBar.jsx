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
    'rounded-lg border border-border-default bg-surface-tertiary px-4 py-2 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors'

  return (
    <div className="sticky bottom-0 border-t border-border-default bg-surface-primary/95 backdrop-blur-sm px-6 py-4">
      <div className="mx-auto max-w-7xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          {recordedBlob && (
            <button onClick={handleSaveVideo} className={secondaryBtnClass}>
              Save Video
            </button>
          )}
          <button onClick={handleSaveReport} className={secondaryBtnClass}>
            Save Report (PDF)
          </button>
          <button onClick={handleShareResults} className={secondaryBtnClass}>
            {copied ? 'Copied!' : 'Share Results'}
          </button>
        </div>
        <button
          onClick={handlePracticeAgain}
          className="rounded-lg bg-accent px-6 py-2 text-sm font-semibold text-white
                     hover:bg-accent-light transition-colors shadow-lg shadow-accent/20"
        >
          Practice Again
        </button>
      </div>
    </div>
  )
}
