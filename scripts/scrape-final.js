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
  { value: 'SFTD', label: 'Software Design' },
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

  console.log('🚀 ISEF 2025 Final Scraper\n')

  const browser = await puppeteer.launch({ headless: 'new' })
  const page = await browser.newPage()
  await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36')
  await page.setViewport({ width: 1440, height: 900 })

  let checkpoint = loadCheckpoint()
  let allProjects = [...checkpoint.projects]

  // Phase 1: Get project data from each category listing
  for (const cat of CATEGORIES) {
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

      // Scroll to trigger additional API calls
      for (let i = 0; i < 15; i++) {
        await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
        await delay(3000)
      }
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
      const id = idMatch ? idMatch[1] : `${cat.value}XXX`
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
      if (project.videoId) continue

      try {
        await page.goto(project.url, { waitUntil: 'networkidle2', timeout: 20000 })
        await delay(1500)

        const videoId = await page.evaluate(() => {
          // Check .content-video .image for YouTube thumbnail
          const videoImg = document.querySelector('.content-video .image')
          if (videoImg) {
            const bgImage = videoImg.style.backgroundImage || ''
            const match = bgImage.match(/ytimg\.com\/vi\/([^/]+)\//)
            if (match) return match[1]
          }
          return null
        })

        project.videoId = videoId
        const status = videoId ? '🎥' : '⬜'
        console.log(`   [${i + 1}/${allProjects.length}] ${status} ${project.id} - ${project.title.substring(0, 50)}`)
      } catch (err) {
        console.log(`   [${i + 1}/${allProjects.length}] ⚠ ${project.id} - ${err.message}`)
      }

      if ((i + 1) % 25 === 0) {
        checkpoint.projects = allProjects
        checkpoint.videosScraped = i + 1
        saveCheckpoint(checkpoint)
        console.log(`   💾 Checkpoint saved at ${i + 1}`)
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
    videoUrl: p.videoId ? `https://www.youtube.com/embed/${p.videoId}` : null,
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

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(deduped, null, 2))

  const withVideo = deduped.filter(p => p.videoUrl).length
  const withGrand = deduped.filter(p => p.placedGrandAward).length
  const withSpecial = deduped.filter(p => p.awards.includes('Special Award')).length
  const noAward = deduped.filter(p => p.awards.length === 0).length

  console.log(`\n✅ Done! Wrote ${deduped.length} projects to ${OUTPUT_PATH}`)
  console.log(`   🎥 With video: ${withVideo}`)
  console.log(`   🏆 Grand Awards: ${withGrand}`)
  console.log(`   ⭐ Special Awards: ${withSpecial}`)
  console.log(`   ⬜ No Award: ${noAward}`)

  if (fs.existsSync(CHECKPOINT_PATH)) {
    fs.unlinkSync(CHECKPOINT_PATH)
    console.log('   🧹 Checkpoint cleaned up')
  }
}

main().catch(err => {
  console.error('Fatal error:', err)
  process.exit(1)
})
