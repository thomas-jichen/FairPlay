const GEMINI_DIRECT_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite-preview:generateContent'

class RateLimiter {
  constructor(maxRequests, windowMs) {
    this.maxRequests = maxRequests
    this.windowMs = windowMs
    this.timestamps = []
  }

  async waitForCapacity() {
    const now = Date.now()
    this.timestamps = this.timestamps.filter((t) => now - t < this.windowMs)

    if (this.timestamps.length < this.maxRequests) return

    const oldest = this.timestamps[0]
    const waitMs = this.windowMs - (now - oldest) + 50
    await new Promise((resolve) => setTimeout(resolve, waitMs))
  }

  record() {
    this.timestamps.push(Date.now())
  }
}

const rateLimiter = new RateLimiter(15, 60_000)

const useProxy = import.meta.env.PROD

export class GeminiError extends Error {
  constructor(message, status, retryable) {
    super(message)
    this.name = 'GeminiError'
    this.status = status
    this.retryable = retryable
  }
}

export async function geminiGenerate({ contents, generationConfig, systemInstruction }) {
  if (!useProxy) {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY
    if (!apiKey) {
      throw new GeminiError('VITE_GEMINI_API_KEY not set in .env', 0, false)
    }
  }

  const hasImage = contents?.some((c) => c.parts?.some((p) => p.inlineData))
  console.log(`%c[Gemini] ➤ gemini-3.1-flash-lite-preview`, 'color: #8b5cf6; font-weight: bold', {
    hasImage,
    temperature: generationConfig?.temperature,
    maxTokens: generationConfig?.maxOutputTokens,
    systemInstruction, // Full prompt for debugging
    contents, // Full contents for debugging
  })
  const startTime = Date.now()

  await rateLimiter.waitForCapacity()

  let lastError = null
  for (let attempt = 0; attempt < 4; attempt++) {
    if (attempt > 0) {
      await new Promise((resolve) => setTimeout(resolve, 1000 * Math.pow(2, attempt - 1)))
    }

    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 30_000)

    try {
      let fetchUrl, headers
      const body = { contents, generationConfig }
      if (systemInstruction) body.systemInstruction = systemInstruction

      if (useProxy) {
        fetchUrl = '/api/gemini'
        headers = { 'Content-Type': 'application/json' }
      } else {
        const apiKey = import.meta.env.VITE_GEMINI_API_KEY
        fetchUrl = `${GEMINI_DIRECT_URL}?key=${apiKey}`
        headers = { 'Content-Type': 'application/json' }
      }

      const res = await fetch(fetchUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
        signal: controller.signal,
      })

      clearTimeout(timeout)

      if (!res.ok) {
        const errorBody = await res.text().catch(() => '')
        const retryable = res.status === 429 || res.status >= 500
        lastError = new GeminiError(`Gemini API ${res.status}: ${errorBody}`, res.status, retryable)
        if (!retryable) throw lastError
        continue
      }

      rateLimiter.record()
      const data = await res.json()

      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || ''

      console.log(`%c[Gemini] ✓ (${Date.now() - startTime}ms)`, 'color: #22c55e; font-weight: bold', {
        tokens: data.usageMetadata,
        response: text,
      })

      return { content: text, usage: data.usageMetadata }
    } catch (err) {
      clearTimeout(timeout)
      if (err instanceof GeminiError) {
        lastError = err
        if (!err.retryable) throw err
      } else if (err.name === 'AbortError') {
        lastError = new GeminiError('Request timed out', 0, true)
      } else {
        lastError = new GeminiError(err.message, 0, true)
      }
    }
  }

  throw lastError || new GeminiError('Max retries exceeded', 0, false)
}
