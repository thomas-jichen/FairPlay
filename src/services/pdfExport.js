import { jsPDF } from 'jspdf'
import { ISEF_CATEGORIES } from '../constants/categories'
import { CRUELTY_CONFIG } from '../constants/crueltyConfig'

export function generatePdfReport({ evaluationResult, category, crueltyLevel }) {
  const doc = new jsPDF()
  const categoryLabel = ISEF_CATEGORIES.find((c) => c.value === category)?.label || category
  const judgeLabel = CRUELTY_CONFIG[crueltyLevel]?.label || 'Standard'
  const pageWidth = doc.internal.pageSize.getWidth()
  const margin = 20
  const contentWidth = pageWidth - margin * 2

  let y = 20

  function checkPageBreak(needed = 20) {
    if (y + needed > 275) {
      doc.addPage()
      y = 20
    }
  }

  function addSection(title, yOffset = 4) {
    checkPageBreak(25)
    y += yOffset
    doc.setFontSize(13)
    doc.setFont('helvetica', 'bold')
    doc.text(title, margin, y)
    y += 8
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
  }

  function addWrappedText(text, indent = 0) {
    const lines = doc.splitTextToSize(text, contentWidth - indent)
    checkPageBreak(lines.length * 5)
    doc.text(lines, margin + indent, y)
    y += lines.length * 5 + 2
  }

  // Title
  doc.setFontSize(22)
  doc.setFont('helvetica', 'bold')
  doc.text('FAIRPLAY Session Report', pageWidth / 2, y, { align: 'center' })
  y += 10

  // Meta
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text(
    `${categoryLabel}  |  ${evaluationResult.trackType === 'science' ? 'Science' : 'Engineering'} Track  |  ${judgeLabel} Judge`,
    pageWidth / 2, y, { align: 'center' }
  )
  y += 6
  doc.text(`Date: ${new Date().toLocaleDateString()}`, pageWidth / 2, y, { align: 'center' })
  y += 12

  // Overall score
  doc.setFontSize(18)
  doc.setFont('helvetica', 'bold')
  doc.text(`Overall Score: ${evaluationResult.overallScore} / 100`, margin, y)
  y += 14

  // Rubric breakdown
  addSection('Rubric Breakdown', 0)

  for (const section of evaluationResult.rubricScores) {
    checkPageBreak(20)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(10)
    doc.text(`${section.section}. ${section.title}: ${section.score} / ${section.maxScore}`, margin + 5, y)
    y += 5
    doc.setFont('helvetica', 'normal')
    addWrappedText(section.justification, 10)
    y += 2
  }

  // Key Strengths
  addSection('Key Strengths')
  for (const s of evaluationResult.feedback.keyStrengths) {
    checkPageBreak(10)
    const lines = doc.splitTextToSize(`• ${s}`, contentWidth - 5)
    doc.text(lines, margin + 5, y)
    y += lines.length * 5 + 1
  }

  // Areas for Improvement
  addSection('Areas for Improvement')
  for (const a of evaluationResult.feedback.areasForImprovement) {
    checkPageBreak(10)
    const lines = doc.splitTextToSize(`• ${a}`, contentWidth - 5)
    doc.text(lines, margin + 5, y)
    y += lines.length * 5 + 1
  }

  // Pitch Content
  addSection('Pitch Content')
  addWrappedText(evaluationResult.feedback.pitchContent, 5)

  // Q&A Performance
  addSection('Q&A Performance')
  addWrappedText(evaluationResult.feedback.qaPerformance, 5)

  // Presentation Skills
  addSection('Presentation Skills')
  addWrappedText(evaluationResult.feedback.presentationSkills, 5)

  // Suggested Practice Focus
  addSection('Suggested Practice Focus')
  addWrappedText(evaluationResult.feedback.suggestedPracticeFocus, 5)

  // Judge Impression
  addSection("Judge's Overall Impression")
  doc.setFont('helvetica', 'italic')
  addWrappedText(`"${evaluationResult.judgeImpression}"`, 5)

  doc.save('fairplay-report.pdf')
}
