import { useState, useCallback } from 'react'
import * as pdfjsLib from 'pdfjs-dist'

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`

export default function usePdfExtract() {
  const [isExtracting, setIsExtracting] = useState(false)

  const extractText = useCallback(async (file) => {
    if (!file || file.type !== 'application/pdf') return null

    setIsExtracting(true)

    try {
      const arrayBuffer = await file.arrayBuffer()
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise

      let fullText = ''
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i)
        const content = await page.getTextContent()
        const pageText = content.items.map((item) => item.str).join(' ')
        fullText += pageText + '\n'
      }

      setIsExtracting(false)
      return fullText.trim()
    } catch (err) {
      console.warn('PDF text extraction failed:', err)
      setIsExtracting(false)
      return null
    }
  }, [])

  return { extractText, isExtracting }
}
