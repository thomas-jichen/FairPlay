import { motion } from 'framer-motion'

const rubricScores = [
    { label: 'Research Question & Hypothesis', score: 91, color: 'emerald' },
    { label: 'Methodology & Experimental Design', score: 76, color: 'amber' },
    { label: 'Data Analysis & Interpretation', score: 88, color: 'emerald' },
    { label: 'Presentation & Communication', score: 84, color: 'emerald' },
    { label: 'Creativity & Innovation', score: 92, color: 'emerald' },
]

const conversationSnippets = [
    { role: 'judge', text: 'How did you control for temperature variation across your experimental trials?' },
    { role: 'student', text: 'We used a thermostatically-controlled incubation chamber maintained at 37°C ± 0.2°C throughout all trials, with continuous monitoring via embedded thermocouples.' },
    { role: 'judge', text: 'What statistical method did you use to validate the significance of your results?' },
    { role: 'student', text: 'We applied a two-tailed paired t-test with a significance threshold of p < 0.05, along with Bonferroni correction for multiple comparisons.' },
]

const feedbackItems = [
    { type: 'strength', title: 'Excellent Experimental Rigor', text: 'Clear articulation of control variables and reproducibility.' },
    { type: 'improvement', title: 'Expand Statistical Context', text: 'Consider discussing effect size alongside p-values for stronger quantitative claims.' },
]

export default function ReportMock() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-5xl mx-auto mt-16 px-4"
        >
            <div className="glass-panel rounded-3xl overflow-hidden shadow-2xl border border-white/50">

                {/* Top Bar */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-black/[0.06]">
                    <div className="flex items-center gap-3">
                        <div className="flex gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-red-400/60" />
                            <div className="w-3 h-3 rounded-full bg-amber-400/60" />
                            <div className="w-3 h-3 rounded-full bg-emerald-400/60" />
                        </div>
                        <span className="text-xs font-medium text-text-muted tracking-wide ml-2" style={{ fontFamily: '"Montserrat", sans-serif' }}>
                            FairPlay — Session Report
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-[11px] font-medium text-emerald-500 bg-emerald-50 border border-emerald-200 rounded-full px-2.5 py-0.5">
                            Completed
                        </span>
                    </div>
                </div>

                {/* Report Body */}
                <div className="p-6 md:p-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">

                        {/* Left Column */}
                        <div className="lg:col-span-7 space-y-6">

                            {/* Score Header */}
                            <div className="flex items-center gap-6">
                                <div className="relative shrink-0">
                                    <svg width="80" height="80" viewBox="0 0 80 80" className="-rotate-90">
                                        <circle cx="40" cy="40" r="34" fill="none" stroke="rgba(0,0,0,0.04)" strokeWidth="5" />
                                        <circle
                                            cx="40" cy="40" r="34"
                                            fill="none"
                                            stroke="#10b981"
                                            strokeWidth="5"
                                            strokeLinecap="round"
                                            strokeDasharray={2 * Math.PI * 34}
                                            strokeDashoffset={2 * Math.PI * 34 * (1 - 0.86)}
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <span className="text-2xl font-light text-emerald-500 tracking-tight" style={{ fontVariantNumeric: 'tabular-nums' }}>86</span>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-lg font-medium text-text-primary tracking-tight" style={{ fontFamily: '"Montserrat", sans-serif' }}>
                                        Overall Score
                                    </h3>
                                    <p className="text-sm text-text-secondary mt-0.5">
                                        Behavioral Sciences — ISEF Rubric
                                    </p>
                                    <div className="flex items-center gap-2 mt-2">
                                        <span className="text-[11px] font-medium rounded-full bg-black/[0.04] border border-black/[0.06] px-2.5 py-0.5 text-text-secondary">
                                            Cruelty: 7/10
                                        </span>
                                        <span className="text-[11px] font-medium rounded-full bg-black/[0.04] border border-black/[0.06] px-2.5 py-0.5 text-text-secondary">
                                            Duration: 8 min
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Rubric Breakdown */}
                            <div className="glass-panel-inner rounded-2xl p-5 space-y-3.5">
                                <h4 className="text-sm font-medium text-text-primary tracking-tight" style={{ fontFamily: '"Montserrat", sans-serif' }}>
                                    Rubric Breakdown
                                </h4>
                                {rubricScores.map((item) => (
                                    <div key={item.label}>
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-xs text-text-secondary" style={{ letterSpacing: '-0.01em' }}>{item.label}</span>
                                            <span className="text-xs font-medium text-text-primary tabular-nums">{item.score}</span>
                                        </div>
                                        <div className="h-1.5 bg-black/[0.04] rounded-full overflow-hidden">
                                            <div
                                                className={`h-full rounded-full ${item.score >= 80 ? 'bg-emerald-500' : 'bg-amber-500'}`}
                                                style={{ width: `${item.score}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Feedback Cards */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {feedbackItems.map((item) => (
                                    <div key={item.title} className="glass-panel-inner rounded-2xl p-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className={`w-5 h-5 rounded-full flex items-center justify-center ${item.type === 'strength'
                                                ? 'bg-emerald-50 border border-emerald-200'
                                                : 'bg-amber-50 border border-amber-200'
                                                }`}>
                                                {item.type === 'strength' ? (
                                                    <svg className="w-3 h-3 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                                    </svg>
                                                ) : (
                                                    <svg className="w-3 h-3 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                                    </svg>
                                                )}
                                            </div>
                                            <span className="text-xs font-medium text-text-primary">{item.title}</span>
                                        </div>
                                        <p className="text-[11px] text-text-secondary leading-relaxed">{item.text}</p>
                                    </div>
                                ))}
                            </div>

                            {/* System Verdict */}
                            <div className="glass-panel-inner rounded-2xl p-5">
                                <h4 className="text-sm font-medium text-text-primary tracking-tight mb-3" style={{ fontFamily: '"Montserrat", sans-serif' }}>
                                    System Verdict
                                </h4>
                                <p className="text-xs text-text-secondary leading-relaxed">
                                    Strong command of experimental methodology with clear articulation of controls and variables.
                                    Statistical reasoning is solid but would benefit from discussing effect sizes.
                                    Presentation delivery showed confident posture and good eye contact throughout.
                                    Recommend expanding on real-world applications during the Q&A segment for maximum impact.
                                </p>
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="lg:col-span-5 space-y-5">

                            {/* Video Placeholder */}
                            <div className="rounded-2xl bg-black/90 aspect-video relative overflow-hidden">
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
                                        <svg className="w-5 h-5 text-white/60 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M8 5v14l11-7z" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="absolute bottom-3 left-3 right-3 flex items-center gap-2">
                                    <div className="h-1 bg-white/20 rounded-full flex-1">
                                        <div className="h-full bg-white/60 rounded-full" style={{ width: '100%' }} />
                                    </div>
                                    <span className="text-[10px] text-white/50 tabular-nums">8:24</span>
                                </div>
                            </div>

                            {/* Real-time Metrics */}
                            <div className="glass-panel-inner rounded-2xl p-4">
                                <h4 className="text-xs font-medium text-text-primary tracking-tight mb-3" style={{ fontFamily: '"Montserrat", sans-serif' }}>
                                    Real-time Metrics
                                </h4>
                                <div className="grid grid-cols-3 gap-2">
                                    {[
                                        { label: 'Confidence', value: '87%', color: 'text-emerald-500' },
                                        { label: 'Pace', value: '142 WPM', color: 'text-text-primary' },
                                        { label: 'Eye Contact', value: '91%', color: 'text-emerald-500' },
                                    ].map((m) => (
                                        <div key={m.label} className="text-center py-2 rounded-xl bg-black/[0.02] border border-black/[0.04]">
                                            <div className={`text-base font-light tabular-nums ${m.color}`}>{m.value}</div>
                                            <div className="text-[10px] text-text-muted mt-0.5">{m.label}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Conversation Log */}
                            <div className="glass-panel-inner rounded-2xl p-4">
                                <h4 className="text-xs font-medium text-text-primary tracking-tight mb-3" style={{ fontFamily: '"Montserrat", sans-serif' }}>
                                    Q&A Transcript
                                </h4>
                                <div className="space-y-3">
                                    {conversationSnippets.map((msg, i) => (
                                        <div key={i} className={`flex gap-2.5 ${msg.role === 'student' ? '' : ''}`}>
                                            <div className={`w-5 h-5 rounded-full shrink-0 mt-0.5 flex items-center justify-center text-[9px] font-medium ${msg.role === 'judge'
                                                ? 'bg-black/[0.06] text-text-secondary border border-black/[0.08]'
                                                : 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                                                }`}>
                                                {msg.role === 'judge' ? 'J' : 'S'}
                                            </div>
                                            <p className="text-[11px] text-text-secondary leading-relaxed flex-1">{msg.text}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Fade-out gradient at the bottom */}
            <div className="h-24 bg-gradient-to-t from-surface-primary to-transparent -mt-24 relative z-10 pointer-events-none" />
        </motion.div>
    )
}
