import * as pdfjsLib from 'pdfjs-dist'

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`

/**
 * Renders page 1 of a PDF file to a base64 JPEG string.
 * Returns { base64, mimeType } or null on failure.
 */
export async function pdfToImage(file) {
  if (!file || file.type !== 'application/pdf') return null

  try {
    const arrayBuffer = await file.arrayBuffer()
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
    const page = await pdf.getPage(1)

    const scale = 1.5
    const viewport = page.getViewport({ scale })

    const canvas = document.createElement('canvas')
    canvas.width = viewport.width
    canvas.height = viewport.height

    const ctx = canvas.getContext('2d')
    await page.render({ canvasContext: ctx, viewport }).promise

    const dataUrl = canvas.toDataURL('image/jpeg', 0.85)
    const base64 = dataUrl.replace(/^data:image\/jpeg;base64,/, '')

    return { base64, mimeType: 'image/jpeg' }
  } catch (err) {
    console.warn('PDF to image conversion failed:', err)
    return null
  }
}
