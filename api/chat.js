const GROQ_BASE_URL = 'https://api.groq.com/openai/v1/chat/completions'

const ALLOWED_MODELS = [
  'moonshotai/kimi-k2-instruct',
  'qwen/qwen3-32b',
]

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) {
    return res.status(500).json({ error: 'GROQ_API_KEY not configured on server' })
  }

  const { model, messages, temperature = 0.7, max_tokens = 512 } = req.body

  if (!model || !messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Missing required fields: model, messages' })
  }

  if (!ALLOWED_MODELS.includes(model)) {
    return res.status(400).json({ error: 'Model not allowed' })
  }

  try {
    const startTime = Date.now()
    console.log(`\n[Server:Groq] 🚀 Outgoing request to ${model}...`)
    
    const response = await fetch(GROQ_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ model, messages, temperature, max_tokens }),
    })

    const data = await response.json()

    if (!response.ok) {
      console.error(`[Server:Groq] ❌ Error ${response.status}:`, data)
      return res.status(response.status).json(data)
    }

    console.log(`[Server:Groq] ✅ Success (${Date.now() - startTime}ms). Tokens used:`, data.usage)
    return res.status(200).json(data)
  } catch (err) {
    return res.status(502).json({ error: 'Failed to reach Groq API' })
  }
}
