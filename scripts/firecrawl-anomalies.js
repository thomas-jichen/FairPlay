#!/usr/bin/env node
/**
 * Firecrawl fallback for projects whose video URL Puppeteer couldn't extract.
 * Reads src/data/.video-anomalies.json, runs `firecrawl scrape --wait-for 8000`
 * on each entry, and parses the resulting HTML for the same media patterns
 * the main extractor checks. Recovered videos are merged into
 * src/data/isef-projects.json; the anomalies file is rewritten with the
 * still-unrecoverable entries.
 */

import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DATA_PATH = path.join(__dirname, '..', 'src', 'data', 'isef-projects.json')
const ANOMALY_PATH = path.join(__dirname, '..', 'src', 'data', '.video-anomalies.json')
const OUT_DIR = path.join(__dirname, '..', '.firecrawl', 'isef')

function extractMedia(html) {
  // 1) CloudFront / Akamai HLS
  let m = html.match(/https:\/\/[a-z0-9.-]+\.cloudfront\.net\/[^"'\s<>]+\.m3u8/i)
  if (m) return { videoUrl: m[0], videoType: 'hls' }

  m = html.match(/https?:\/\/[^"'\s<>]+\.m3u8(?:\?[^"'\s<>]*)?/i)
  if (m) return { videoUrl: m[0], videoType: 'hls' }

  // 2) Firebase Storage MP4 (filter out poster/asset paths)
  m = html.match(/https:\/\/firebasestorage\.googleapis\.com\/[^"'\s<>]+\.mp4[^"'\s<>]*/i)
  if (m) return { videoUrl: m[0].replace(/&amp;/g, '&'), videoType: 'mp4' }

  // 3) YouTube
  m = html.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/)
  if (m) return { videoUrl: `https://www.youtube.com/embed/${m[1]}`, videoType: 'youtube', videoId: m[1] }

  m = html.match(/ytimg\.com\/vi\/([A-Za-z0-9_-]{11})\//)
  if (m) return { videoUrl: `https://www.youtube.com/embed/${m[1]}`, videoType: 'youtube', videoId: m[1] }

  // 4) Other CDN MP4 patterns
  m = html.match(/https?:\/\/[^"'\s<>]+\.mp4(?:\?[^"'\s<>]*)?/i)
  if (m && !/icon|logo|sponsor|nebula|navbar/i.test(m[0])) {
    return { videoUrl: m[0], videoType: 'mp4' }
  }

  return null
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true })
  const anomalies = JSON.parse(fs.readFileSync(ANOMALY_PATH, 'utf8'))
  const projects = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'))
  const projById = new Map(projects.map(p => [p.id, p]))

  console.log(`🔧 Firecrawl fallback for ${anomalies.length} anomalies`)
  let recovered = 0
  const stillMissing = []

  for (const a of anomalies) {
    if (!a.url) {
      console.log(`   ⏭ ${a.id} — no URL, skipping`)
      stillMissing.push(a)
      continue
    }
    const outFile = path.join(OUT_DIR, `${a.id}.html`)
    try {
      execSync(`firecrawl scrape "${a.url}" --wait-for 8000 --format html -o "${outFile}"`, {
        stdio: 'pipe', timeout: 90000,
      })
    } catch (err) {
      console.log(`   ⚠ ${a.id} — firecrawl error: ${err.message.slice(0, 100)}`)
      stillMissing.push({ ...a, reason: 'firecrawl scrape error' })
      continue
    }
    if (!fs.existsSync(outFile)) {
      stillMissing.push({ ...a, reason: 'firecrawl produced no file' })
      continue
    }
    const html = fs.readFileSync(outFile, 'utf8')
    const media = extractMedia(html)
    if (media && media.videoUrl) {
      const p = projById.get(a.id)
      if (p) {
        p.videoUrl = media.videoUrl
        p.videoType = media.videoType
        if (media.videoId) p.videoId = media.videoId
      }
      console.log(`   ✅ ${a.id} — recovered ${media.videoType}`)
      recovered++
    } else {
      stillMissing.push({ ...a, reason: 'no media URL even with firecrawl' })
      console.log(`   ⬜ ${a.id} — no media`)
    }
  }

  fs.writeFileSync(DATA_PATH, JSON.stringify(projects, null, 2))
  fs.writeFileSync(ANOMALY_PATH, JSON.stringify(stillMissing, null, 2))

  console.log(`\n📊 Recovered ${recovered}/${anomalies.length} via Firecrawl`)
  console.log(`   📋 ${stillMissing.length} still missing — written to ${ANOMALY_PATH}`)
}

main().catch(err => {
  console.error('Fatal:', err)
  process.exit(1)
})
