export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
}

const GEMINI_MODEL = 'gemini-3.1-flash-lite-preview'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    return res.status(500).json({ error: 'GEMINI_API_KEY not configured on server' })
  }

  const { contents, generationConfig, systemInstruction } = req.body

  if (!contents || !Array.isArray(contents)) {
    return res.status(400).json({ error: 'Missing required field: contents' })
  }

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`

    const body = { contents, generationConfig }
    if (systemInstruction) body.systemInstruction = systemInstruction

    const startTime = Date.now()
    console.log(`\n[Server:Gemini] 🚀 Outgoing request to ${GEMINI_MODEL}...`)

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    const data = await response.json()

    if (!response.ok) {
      console.error(`[Server:Gemini] ❌ Error ${response.status}:`, data)
      return res.status(response.status).json(data)
    }

    console.log(`[Server:Gemini] ✅ Success (${Date.now() - startTime}ms). Tokens:`, data.usageMetadata)
    return res.status(200).json(data)
  } catch (err) {
    return res.status(502).json({ error: 'Failed to reach Gemini API' })
  }
}
