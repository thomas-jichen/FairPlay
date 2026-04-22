import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const distDir = resolve(__dirname, '..', 'dist')
const indexPath = resolve(distDir, 'index.html')

if (!existsSync(indexPath)) {
  console.error(`[generate-og-html] ${indexPath} not found — run vite build first.`)
  process.exit(1)
}

const SITE_ORIGIN = 'https://fairplaylabs.org'

const routes = [
  {
    file: 'app.html',
    title: 'Fairplay — Try Pitching',
    description: 'Realistic AI-powered ISEF judging simulations. Pitch, get feedback, improve.',
    image: '/fairplay.png',
    url: `${SITE_ORIGIN}/app`,
  },
  {
    file: 'isefarena.html',
    title: 'ISEF Arena — Fairplay',
    description: 'Think you can spot a Grand Award winner? Judge every ISEF 2025 finalist and find out.',
    image: '/og-isefarena.png',
    url: `${SITE_ORIGIN}/isefarena`,
  },
]

const escapeAttr = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

const source = readFileSync(indexPath, 'utf8')

function rewriteTag(html, pattern, replacement) {
  if (!pattern.test(html)) {
    throw new Error(`[generate-og-html] expected pattern not found in index.html: ${pattern}`)
  }
  return html.replace(pattern, replacement)
}

for (const route of routes) {
  const imageAbsolute = route.image.startsWith('http') ? route.image : `${SITE_ORIGIN}${route.image}`
  let out = source

  out = rewriteTag(
    out,
    /<title>[^<]*<\/title>/,
    `<title>${escapeAttr(route.title)}</title>`,
  )
  out = rewriteTag(
    out,
    /<meta\s+property="og:title"[^>]*>/,
    `<meta property="og:title" content="${escapeAttr(route.title)}" />`,
  )
  out = rewriteTag(
    out,
    /<meta\s+property="og:description"[^>]*>/,
    `<meta property="og:description" content="${escapeAttr(route.description)}" />`,
  )
  out = rewriteTag(
    out,
    /<meta\s+property="og:image"[^>]*>/,
    `<meta property="og:image" content="${escapeAttr(imageAbsolute)}" />`,
  )
  out = rewriteTag(
    out,
    /<meta\s+name="twitter:title"[^>]*>/,
    `<meta name="twitter:title" content="${escapeAttr(route.title)}" />`,
  )
  out = rewriteTag(
    out,
    /<meta\s+name="twitter:description"[^>]*>/,
    `<meta name="twitter:description" content="${escapeAttr(route.description)}" />`,
  )
  out = rewriteTag(
    out,
    /<meta\s+name="twitter:image"[^>]*>/,
    `<meta name="twitter:image" content="${escapeAttr(imageAbsolute)}" />`,
  )

  if (/<meta\s+property="og:url"[^>]*>/.test(out)) {
    out = out.replace(
      /<meta\s+property="og:url"[^>]*>/,
      `<meta property="og:url" content="${escapeAttr(route.url)}" />`,
    )
  } else {
    out = out.replace(
      /(<meta\s+property="og:image"[^>]*>)/,
      `$1\n  <meta property="og:url" content="${escapeAttr(route.url)}" />`,
    )
  }

  const outPath = resolve(distDir, route.file)
  writeFileSync(outPath, out, 'utf8')
  console.log(`[generate-og-html] wrote ${outPath}`)
}
