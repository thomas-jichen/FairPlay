#!/usr/bin/env node
/**
 * ISEF 2025 Scraper - Final approach
 * 1. Navigate to each category page, intercept API responses for project data
 * 2. Visit each project page to extract YouTube video ID
 * 3. Filter "Project Approved" from awards (it's a status, not an award)
 */

import puppeteer from 'puppeteer'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUTPUT_PATH = path.join(__dirname, '..', 'src', 'data', 'isef-projects.json')
const CHECKPOINT_PATH = path.join(__dirname, '..', 'src', 'data', '.isef-checkpoint.json')
const ANOMALY_PATH = path.join(__dirname, '..', 'src', 'data', '.video-anomalies.json')

function loadBaseline() {
  try {
    if (fs.existsSync(OUTPUT_PATH)) {
      const arr = JSON.parse(fs.readFileSync(OUTPUT_PATH, 'utf8'))
      const byId = new Map()
      for (const p of arr) byId.set(p.id, p)
      return byId
    }
  } catch {}
  return new Map()
}

const delay = ms => new Promise(r => setTimeout(r, ms))

const CATEGORIES = [
  { value: 'ANIM', label: 'Animal Sciences' },
  { value: 'BEHA', label: 'Behavioral and Social Sciences' },
  { value: 'BCHM', label: 'Biochemistry' },
  { value: 'BMED', label: 'Biomedical and Health Sciences' },
  { value: 'ENBM', label: 'Biomedical Engineering' },
  { value: 'CELL', label: 'Cellular and Molecular Biology' },
  { value: 'CHEM', label: 'Chemistry' },
  { value: 'CBIO', label: 'Computational Biology and Bioinformatics' },
  { value: 'EAEV', label: 'Earth and Environmental Sciences' },
  { value: 'EBED', label: 'Embedded Systems' },
  { value: 'EGSD', label: 'Energy: Sustainable Materials and Design' },
  { value: 'ETSD', label: 'Engineering Technology: Statics and Dynamics' },
  { value: 'ENEV', label: 'Environmental Engineering' },
  { value: 'MATS', label: 'Materials Science' },
  { value: 'MATH', label: 'Mathematics' },
  { value: 'MCRO', label: 'Microbiology' },
  { value: 'PHYS', label: 'Physics and Astronomy' },
  { value: 'PLNT', label: 'Plant Sciences' },
  { value: 'ROBO', label: 'Robotics and Intelligent Machines' },
  { value: 'SOFT', label: 'Systems Software' },
  { value: 'TECA', label: 'Technology Enhances the Arts' },
  { value: 'TMED', label: 'Translational Medical Science' },
]

function loadCheckpoint() {
  try {
    if (fs.existsSync(CHECKPOINT_PATH)) {
      return JSON.parse(fs.readFileSync(CHECKPOINT_PATH, 'utf8'))
    }
  } catch {}
  return { projects: [], completedCategories: [], videosScraped: 0 }
}

function saveCheckpoint(data) {
  fs.writeFileSync(CHECKPOINT_PATH, JSON.stringify(data, null, 2))
}

async function main() {
  const skipVideos = process.argv.includes('--skip-videos')
  const onlyIdx = process.argv.indexOf('--only-category')
  const onlyCategory = onlyIdx > -1 ? process.argv[onlyIdx + 1] : null
  const dryRun = process.argv.includes('--dry-run')
  const append = process.argv.includes('--append')
  const activeCategories = onlyCategory ? CATEGORIES.filter(c => c.value === onlyCategory) : CATEGORIES

  console.log('🚀 ISEF 2025 Final Scraper')
  if (onlyCategory) console.log(`   🎯 Single category mode: ${onlyCategory}`)
  if (append) console.log(`   ➕ Append mode: merging into live data, preserving non-${onlyCategory} entries`)
  if (dryRun) console.log(`   🧪 Dry run: writes to /tmp/isef-dry-run.json instead of overwriting data`)
  const baseline = loadBaseline()
  const baselineWithVideo = [...baseline.values()].filter(p => p.videoUrl).length
  console.log(`   📦 Baseline: ${baseline.size} projects, ${baselineWithVideo} with existing videoUrl (will be preserved)`)
  console.log()

  let browser = await puppeteer.launch({ headless: 'new' })
  let page = await browser.newPage()
  await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36')
  await page.setViewport({ width: 1440, height: 900 })

  async function recreateBrowser() {
    try { await browser.close() } catch {}
    browser = await puppeteer.launch({ headless: 'new' })
    page = await browser.newPage()
    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36')
    await page.setViewport({ width: 1440, height: 900 })
    console.log(`   🔁 relaunched browser`)
  }

  async function recreatePage() {
    // If browser is still alive, just open a fresh page; else relaunch the whole browser.
    try {
      try { await page.close({ runBeforeUnload: false }) } catch {}
      page = await browser.newPage()
      await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36')
      await page.setViewport({ width: 1440, height: 900 })
    } catch (err) {
      console.log(`   ⚠ page recreate failed (${err.message}); relaunching browser`)
      await recreateBrowser()
    }
  }

  let checkpoint = loadCheckpoint()
  let allProjects = [...checkpoint.projects]

  // Phase 1: Get project data from each category listing
  for (const cat of activeCategories) {
    if (checkpoint.completedCategories.includes(cat.value)) {
      console.log(`⏭ Skipping ${cat.label} (already done)`)
      continue
    }

    console.log(`📂 ${cat.label} (${cat.value})...`)

    const capturedProjects = new Map()

    const handler = async (res) => {
      const url = res.url()
      if (url.includes(`/api/projects/category/${cat.value}`) && url.includes('limit=')) {
        try {
          const json = await res.json()
          if (json.result?.projects) {
            for (const p of json.result.projects) {
              capturedProjects.set(p.slug || p.id, p)
            }
          }
        } catch {}
      }
    }

    page.on('response', handler)

    try {
      await page.goto(`https://isef.net/viewAll?category=${cat.value}&page=home`, {
        waitUntil: 'networkidle2',
        timeout: 30000,
      })
      await delay(5000)

      // Scroll-until-stable: keep scrolling until project count stops growing
      let prevSize = capturedProjects.size
      let stableChecks = 0
      const MAX_SCROLLS = 60
      const STABLE_THRESHOLD = 3
      let scrolls = 0
      while (scrolls < MAX_SCROLLS && stableChecks < STABLE_THRESHOLD) {
        await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
        await delay(2500)
        scrolls += 1
        if (capturedProjects.size === prevSize) {
          stableChecks += 1
        } else {
          stableChecks = 0
          prevSize = capturedProjects.size
        }
      }
      console.log(`   📜 ${cat.value}: ${capturedProjects.size} projects after ${scrolls} scrolls`)
    } catch (err) {
      console.log(`   ⚠ Error: ${err.message}`)
    }

    page.off('response', handler)

    // Process captured projects
    for (const p of capturedProjects.values()) {
      const realAwards = (p.awards || []).filter(a => a.name !== 'Project Approved')
      let awardType = 'none'
      if (realAwards.length > 0) {
        const hasGrand = realAwards.some(a => a.name === 'Grand Award' || a.name === 'Top Award')
        awardType = hasGrand ? 'grand' : 'special'
      }

      const idMatch = (p.title || '').match(/^([A-Z]{4}\d{3}T?)\s*-/)
      // Fallback: use slug-derived suffix so IDs don't collide across projects in the same category
      const slugSuffix = (p.slug || '').replace(/[^a-z0-9]/gi, '').slice(0, 12).toUpperCase()
      const id = idMatch ? idMatch[1] : `${cat.value}-${slugSuffix || Math.random().toString(36).slice(2, 8).toUpperCase()}`
      const titleMatch = (p.title || '').match(/^[A-Z]{4}\d{3}T?\s*-\s*(.+)/)
      const title = titleMatch ? titleMatch[1].trim() : p.title || 'Untitled'

      allProjects.push({
        id,
        title,
        category: cat.label,
        categoryCode: cat.value,
        url: p.url || `https://isef.net/project/${p.slug}`,
        videoId: null,
        year: 2025,
        awardType,
      })
    }

    checkpoint.completedCategories.push(cat.value)
    checkpoint.projects = allProjects
    saveCheckpoint(checkpoint)

    console.log(`   ✅ ${capturedProjects.size} projects`)
    await delay(1000)
  }

  console.log(`\n📊 Phase 1 complete: ${allProjects.length} projects`)

  // Phase 2: Visit project pages for video IDs
  if (!skipVideos) {
    console.log('\n🎬 Phase 2: Scraping video IDs...')

    const startIdx = checkpoint.videosScraped || 0
    for (let i = startIdx; i < allProjects.length; i++) {
      const project = allProjects[i]
      if (project.videoId || project.videoUrl) continue

      // BASELINE PRESERVATION: if this project already has a videoUrl in the
      // live data file, copy it forward and skip the page visit entirely.
      const base = baseline.get(project.id)
      if (base && base.videoUrl) {
        project.videoUrl = base.videoUrl
        project.videoType = base.videoType || (base.videoUrl.includes('youtube') ? 'youtube' : null)
        project.posterUrl = base.posterUrl || null
        project.videoId = base.videoId || null
        console.log(`   [${i + 1}/${allProjects.length}] ⏩ ${project.id} — kept existing video`)
        continue
      }

      try {
        // Network interceptor: capture media URLs the page fetches via XHR/fetch
        let netVideoUrl = null
        let netVideoType = null
        const netHandler = (req) => {
          if (netVideoUrl) return
          const u = req.url()
          if (/\.m3u8(\?|$)/i.test(u) && /cloudfront\.net|amazonaws\.com|akamai/i.test(u)) {
            netVideoUrl = u
            netVideoType = 'hls'
          } else if (/firebasestorage\.googleapis\.com\/.*\.mp4/i.test(u)) {
            netVideoUrl = u
            netVideoType = 'mp4'
          } else if (/\.mp4(\?|$)/i.test(u) && !u.includes('icon') && !u.includes('logo')) {
            netVideoUrl = u
            netVideoType = 'mp4'
          }
        }
        page.on('request', netHandler)

        await page.goto(project.url, { waitUntil: 'networkidle2', timeout: 20000 })
        await delay(1500)

        // Try to trigger video player by scrolling/clicking the play button
        try {
          await page.evaluate(() => {
            const btn = document.querySelector('.content-video .image, .content-video button, .video-player, video')
            if (btn) {
              btn.scrollIntoView({ behavior: 'instant', block: 'center' })
              if (btn.click) btn.click()
            }
          })
          await delay(2500)
        } catch {}

        page.off('request', netHandler)

        const media = await page.evaluate(() => {
          const out = { videoUrl: null, videoType: null, posterUrl: null, videoId: null }
          const html = document.documentElement.outerHTML

          // 1) YouTube thumbnail in content-video element
          const videoImg = document.querySelector('.content-video .image')
          if (videoImg) {
            const bg = videoImg.style.backgroundImage || ''
            const yt = bg.match(/ytimg\.com\/vi\/([^/]+)\//)
            if (yt) {
              out.videoId = yt[1]
              out.videoUrl = `https://www.youtube.com/embed/${yt[1]}`
              out.videoType = 'youtube'
              return out
            }
            // Capture poster URL even if not YouTube (Firebase Storage etc.)
            const fb = bg.match(/(https:\/\/firebasestorage\.googleapis\.com\/[^"')]+)/)
            if (fb) out.posterUrl = decodeURIComponent(fb[1].replace(/\\u002F/g, '/'))
          }

          // 2) CloudFront HLS m3u8 anywhere in document
          const hls = html.match(/https:\/\/[a-z0-9.-]+\.cloudfront\.net\/[^"'\s<>]+\.m3u8/i)
          if (hls) {
            out.videoUrl = hls[0]
            out.videoType = 'hls'
            return out
          }

          // 3) Firebase Storage MP4
          const fbMp4 = html.match(/https:\/\/firebasestorage\.googleapis\.com\/[^"'\s<>]+\.mp4[^"'\s<>]*/i)
          if (fbMp4) {
            out.videoUrl = fbMp4[0].replace(/&amp;/g, '&')
            out.videoType = 'mp4'
            return out
          }

          // 4) YouTube watch / youtu.be / embed link as a secondary path
          const yt2 = html.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/)
          if (yt2) {
            out.videoId = yt2[1]
            out.videoUrl = `https://www.youtube.com/embed/${yt2[1]}`
            out.videoType = 'youtube'
            return out
          }

          // 5) Direct <video src> or <source src>
          const v = document.querySelector('video[src], video source[src]')
          if (v) {
            const src = v.getAttribute('src')
            if (src && /\.m3u8(\?|$)/i.test(src)) { out.videoUrl = src; out.videoType = 'hls'; return out }
            if (src && /\.mp4(\?|$)/i.test(src)) { out.videoUrl = src; out.videoType = 'mp4'; return out }
          }

          return out
        })

        // Prefer YouTube DOM result (cleanest); else use network-captured HLS/MP4; else any DOM fallback
        if (media.videoType === 'youtube') {
          project.videoUrl = media.videoUrl
          project.videoType = media.videoType
          project.videoId = media.videoId
        } else if (netVideoUrl) {
          project.videoUrl = netVideoUrl
          project.videoType = netVideoType
        } else if (media.videoUrl) {
          project.videoUrl = media.videoUrl
          project.videoType = media.videoType
          project.videoId = media.videoId
        }
        project.posterUrl = media.posterUrl
        const finalType = project.videoType
        const status = project.videoUrl ? (finalType === 'youtube' ? '🎥' : finalType === 'hls' ? '📺' : '🎬') : '⬜'
        console.log(`   [${i + 1}/${allProjects.length}] ${status} ${project.id} - ${project.title.substring(0, 50)}`)
      } catch (err) {
        console.log(`   [${i + 1}/${allProjects.length}] ⚠ ${project.id} - ${err.message}`)
        if (/detached Frame|Target closed|Session closed|Protocol error/i.test(err.message)) {
          console.log(`   ♻ recreating browser page after fatal error`)
          await recreatePage()
        }
      }

      if ((i + 1) % 25 === 0) {
        checkpoint.projects = allProjects
        checkpoint.videosScraped = i + 1
        saveCheckpoint(checkpoint)
        console.log(`   💾 Checkpoint saved at ${i + 1}`)
      }

      // Periodic browser restart to dodge memory/connection leaks
      if ((i + 1) % 150 === 0) {
        console.log(`   🔁 periodic browser restart at ${i + 1}`)
        await recreateBrowser()
      }

      await delay(1500)
    }
  }

  await browser.close()

  // Build final output
  const output = allProjects.map(p => ({
    id: p.id,
    title: p.title,
    category: p.category,
    categoryCode: p.categoryCode,
    videoUrl: p.videoUrl || (p.videoId ? `https://www.youtube.com/embed/${p.videoId}` : null),
    videoType: p.videoType || (p.videoId ? 'youtube' : null),
    posterUrl: p.posterUrl || null,
    year: p.year,
    awards: p.awardType === 'grand' ? ['Grand Award'] : p.awardType === 'special' ? ['Special Award'] : [],
    placedGrandAward: p.awardType === 'grand',
  }))

  // Deduplicate
  const seen = new Set()
  const deduped = output.filter(p => {
    if (seen.has(p.id)) return false
    seen.add(p.id)
    return true
  })

  // Decide write path:
  //  --append + --only-category X  → merge X-rows into live data, write to OUTPUT_PATH
  //  --dry-run OR (--only-category without --append) → /tmp/isef-dry-run.json (smoke test)
  //  default                                          → OUTPUT_PATH
  let finalRows = deduped
  let writePath = OUTPUT_PATH
  if (append && onlyCategory) {
    // Take every baseline entry whose categoryCode !== target, then add scrape rows.
    const kept = [...baseline.values()].filter(p => p.categoryCode !== onlyCategory)
    const newIds = new Set(deduped.map(p => p.id))
    // Defensive: if baseline already had any rows for this category, drop them so the new scrape wins.
    // (kept already excludes them via categoryCode filter, so this is a no-op safety check.)
    finalRows = [...kept.filter(p => !newIds.has(p.id)), ...deduped]
    console.log(`\n   ➕ Merged: ${kept.length} preserved + ${deduped.length} from ${onlyCategory} = ${finalRows.length}`)
  } else if (dryRun || onlyCategory) {
    writePath = '/tmp/isef-dry-run.json'
  }
  fs.writeFileSync(writePath, JSON.stringify(finalRows, null, 2))
  if (writePath !== OUTPUT_PATH) console.log(`\n   📝 Wrote smoke-test output to ${writePath} (main data untouched)`)

  const withVideo = finalRows.filter(p => p.videoUrl).length
  const withGrand = finalRows.filter(p => p.placedGrandAward).length
  const withSpecial = finalRows.filter(p => p.awards?.includes('Special Award')).length
  const noAward = finalRows.filter(p => (p.awards || []).length === 0).length

  console.log(`\n✅ Done! Wrote ${finalRows.length} projects to ${writePath}`)
  console.log(`   🎥 With video: ${withVideo}`)
  console.log(`   🏆 Grand Awards: ${withGrand}`)
  console.log(`   ⭐ Special Awards: ${withSpecial}`)
  console.log(`   ⬜ No Award: ${noAward}`)

  // Anomaly export — projects without a videoUrl, with their slug URL for Firecrawl follow-up
  const projectById = Object.fromEntries(allProjects.map(p => [p.id, p]))
  // In append mode, only consider rows we actually scraped this run (deduped).
  // In full mode, consider every row written to disk.
  const anomalySource = (append && onlyCategory) ? deduped : finalRows
  const anomalies = anomalySource
    .filter(p => !p.videoUrl)
    .map(p => ({
      id: p.id,
      title: p.title,
      categoryCode: p.categoryCode,
      url: projectById[p.id]?.url || null,
      reason: 'no media URL captured',
    }))

  if (writePath === OUTPUT_PATH) {
    let merged = anomalies
    // In append mode, merge with existing anomalies (drop ones for the target category, since we just rescraped it).
    if (append && onlyCategory && fs.existsSync(ANOMALY_PATH)) {
      try {
        const prev = JSON.parse(fs.readFileSync(ANOMALY_PATH, 'utf8'))
        const keptPrev = prev.filter(a => a.categoryCode !== onlyCategory)
        const newIds = new Set(anomalies.map(a => a.id))
        merged = [...keptPrev.filter(a => !newIds.has(a.id)), ...anomalies]
      } catch {}
    }
    fs.writeFileSync(ANOMALY_PATH, JSON.stringify(merged, null, 2))
    console.log(`   📋 Wrote ${merged.length} anomalies to ${ANOMALY_PATH}`)
  }

  if (fs.existsSync(CHECKPOINT_PATH)) {
    fs.unlinkSync(CHECKPOINT_PATH)
    console.log('   🧹 Checkpoint cleaned up')
  }
}

main().catch(err => {
  console.error('Fatal error:', err)
  process.exit(1)
})
