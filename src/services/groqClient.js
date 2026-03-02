const GROQ_BASE_URL = 'https://api.groq.com/openai/v1/chat/completions'

export const MODELS = {
  KIMI_K2: 'moonshotai/kimi-k2-instruct',
  QWEN3_32B: 'qwen/qwen3-32b',
}

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

const rateLimiter = new RateLimiter(55, 60_000) // 55 RPM to stay safely under 60

export class GroqError extends Error {
  constructor(message, status, retryable) {
    super(message)
    this.name = 'GroqError'
    this.status = status
    this.retryable = retryable
  }
}

export async function chatCompletion({ model, messages, temperature = 0.7, maxTokens = 512 }) {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY
  if (!apiKey) {
    throw new GroqError('VITE_GROQ_API_KEY not set in .env', 0, false)
  }

  await rateLimiter.waitForCapacity()

  let lastError = null
  for (let attempt = 0; attempt < 3; attempt++) {
    if (attempt > 0) {
      await new Promise((resolve) => setTimeout(resolve, 1000 * Math.pow(2, attempt)))
    }

    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 30_000)

    try {
      const res = await fetch(GROQ_BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({ model, messages, temperature, max_tokens: maxTokens }),
        signal: controller.signal,
      })

      clearTimeout(timeout)

      if (!res.ok) {
        const body = await res.text().catch(() => '')
        const retryable = res.status === 429 || res.status >= 500
        lastError = new GroqError(`Groq API ${res.status}: ${body}`, res.status, retryable)
        if (!retryable) throw lastError
        continue
      }

      rateLimiter.record()
      const data = await res.json()
      const choice = data.choices?.[0]

      return {
        content: choice?.message?.content || '',
        usage: data.usage,
      }
    } catch (err) {
      clearTimeout(timeout)
      if (err instanceof GroqError) {
        lastError = err
        if (!err.retryable) throw err
      } else if (err.name === 'AbortError') {
        lastError = new GroqError('Request timed out', 0, true)
      } else {
        lastError = new GroqError(err.message, 0, true)
      }
    }
  }

  throw lastError || new GroqError('Max retries exceeded', 0, false)
}
