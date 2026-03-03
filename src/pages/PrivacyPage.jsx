import { Link } from 'react-router'
import { motion } from 'framer-motion'

const fadeIn = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }

const SECTIONS = [
    {
        number: '01',
        title: 'Scope and Purpose',
        subsections: [
            {
                body: 'This Intellectual Property and Uploaded Materials Policy ("Policy") governs the treatment, handling, storage, and use of any materials, content, or data uploaded or submitted by end users ("Users") to this platform ("Platform"). This Policy is distinct from and supplementary to any general Privacy Policy governing the collection of personal data. This Policy applies exclusively to research materials, including, without limitation, academic abstracts, research posters, presentation slides, and related scholarly content, submitted by Users for use with the Platform\'s pitch feedback services.',
            },
            {
                body: 'By uploading or submitting any materials to the Platform, the User acknowledges and agrees to the terms set forth herein.',
            },
        ],
    },
    {
        number: '02',
        title: 'Definitions',
        intro: 'For the purposes of this Policy, the following terms shall have the meanings described below:',
        definitions: [
            { term: 'Uploaded Materials', definition: 'refers to any files, documents, images, data, text, audio, or video content submitted or uploaded by a User to the Platform, including but not limited to research abstracts, academic posters, and presentation slides.' },
            { term: 'Session', definition: 'refers to a single, continuous interactive engagement between a User and the Platform\'s system, initiated upon the User\'s commencement of a feedback session and terminated upon the User\'s conclusion thereof.' },
            { term: 'Real-Time Transcription', definition: 'refers to the automated, live conversion of spoken audio into text occurring concurrently with a Session, without post-hoc processing or retention.' },
            { term: 'Input Tokens', definition: 'refers to discrete units of data processed by the Platform\'s ML models solely for the purpose of generating responsive outputs during an active Session.' },
            { term: 'Third-Party LLM Provider', definition: 'refers to any external AI service provider whose LLMs are integrated into the Platform to generate feedback, analysis, or interactive response.' },
        ],
    },
    {
        number: '03',
        title: 'Storage and Retention',
        subsections: [
            { subtitle: '3.1 No Persistent Storage', body: 'The Platform does not store, archive, upload, or transmit Uploaded Materials to any external online database, cloud-based repository, or hardware-linked storage system. Uploaded Materials are processed exclusively as Input Tokens to proprietary models within the active Session and are not retained beyond the duration of that Session.' },
            { subtitle: '3.2 Transient Processing', body: 'All Uploaded Materials are held in transient, in-memory processing environments solely for the purpose of providing real-time feedback and analysis to the User during an active Session. Upon termination of a Session, all Uploaded Materials processed during that Session are permanently purged from the Platform\'s processing environment.' },
            { subtitle: '3.3 No Secondary Use', body: 'Uploaded Materials will not be accessed, reviewed, distributed, disclosed, sold, licensed, or otherwise transferred to any third party, except as required by applicable law or judicial order.' },
        ],
    },
    {
        number: '04',
        title: 'Video and Audio Data',
        subsections: [
            { subtitle: '4.1 No Storage', body: 'Any video or audio recorded or captured through the Platform in the course of a pitch feedback session is not saved, stored, or retained in any form. Such recordings are processed solely in real time for the purposes of providing interactive feedback and are permanently and automatically deleted upon termination of the applicable Session.' },
            { subtitle: '4.2 Real-Time Transcription Only', body: 'Audio-to-text transcription performed by the Platform occurs exclusively in real time during an active Session. No post-processing, deferred transcription, or retrospective analysis of video or audio content takes place. All transcription data generated during a Session is discarded upon Session termination and is not retained in any database, log, or storage system.' },
            { subtitle: '4.3 No Secondary Recording', body: 'The Platform does not create, retain, or transmit secondary copies or derivatives of any video or audio data submitted by Users.' },
        ],
    },
    {
        number: '05',
        title: 'AI and Large Language Models',
        subsections: [
            { subtitle: '5.1 No Model Training', body: 'The Platform\'s LLMs, and any Third-Party LLM Provider models integrated into the Platform, shall not be trained, fine-tuned, retrained, or otherwise optimized using Uploaded Materials or any data derived therefrom. User-submitted content will not be used, directly or indirectly, to update, modify, or improve the parameters, weights, or outputs of any machine learning model.' },
            { subtitle: '5.2 Inference-Only Use', body: 'Uploaded Materials and Session data are utilized exclusively for inference-time processing: for generating real-time responses, feedback, and analysis during an active Session. Such use does not constitute or enable model training, and no gradient updates or parameter adjustments are performed based on User data.' },
            { subtitle: '5.3 Third-Party Providers', body: 'To the extent the Platform integrates Third-Party LLM Providers, the Platform requires such providers adhere to data use restrictions consistent with this Policy, including the prohibition on using User-submitted data for model training. Users are encouraged to review the applicable terms of service of any identified Third-Party LLM Provider.' },
        ],
    },
    {
        number: '06',
        title: 'Intellectual Property Rights',
        subsections: [
            { subtitle: '6.1 Retention of User Rights', body: 'Users retain all intellectual property rights, including but not limited to copyright, in and to their Uploaded Materials. Nothing in this Policy or in the User\'s use of the Platform shall be construed as a transfer, assignment, license, or waiver of any intellectual property rights held by the User with respect to their Uploaded Materials.' },
            { subtitle: '6.2 Limited License Grant', body: 'By uploading materials to the Platform, the User grants the Platform a limited, non-exclusive, royalty-free, revocable, non-sublicensable license to access and process the Uploaded Materials solely for the purpose of providing the Platform\'s services during the active Session. This license terminates automatically upon conclusion of the applicable Session.' },
            { subtitle: '6.3 No Proprietary Claims', body: 'The Platform makes no claim of ownership over any Uploaded Materials. The Platform shall not assert any proprietary interest in, or derive any commercial benefit from, the intellectual content of Users\' research materials.' },
        ],
    },
    {
        number: '07',
        title: 'Feedback and Improvement',
        subsections: [
            { body: 'While the Platform does not use Uploaded Materials for model training, the Platform welcomes voluntary feedback from Users regarding the quality and accuracy of the services provided. Any feedback voluntarily submitted by Users regarding the Platform\'s performance may be used to improve the Platform\'s services, subject to the User\'s express consent. Feedback submissions are entirely optional and do not include Uploaded Materials unless expressly provided by the User for that purpose.' },
        ],
    },
    {
        number: '08',
        title: 'Security',
        subsections: [
            { body: 'The Platform implements reasonable and industry-standard technical and organizational measures to protect Uploaded Materials against unauthorized access, disclosure, alteration, or destruction during the period of active processing. Notwithstanding the foregoing, no method of electronic transmission or processing is entirely secure, and the Platform does not warrant absolute security of Uploaded Materials during transmission or processing.' },
        ],
    },
    {
        number: '09',
        title: 'Modifications to This Policy',
        subsections: [
            { body: 'The Platform reserves the right to amend or update this Policy at any time. Material changes to this Policy will be communicated to Users via posting of an updated Policy on the Platform with a revised effective date. Continued use of the Platform following the posting of changes constitutes acceptance of such changes. Users are encouraged to review this Policy periodically.' },
        ],
    },
    {
        number: '10',
        title: 'Contact Information',
        subsections: [
            { body: 'Questions or concerns regarding this Policy may be directed to the Platform\'s designated contact at thomaswang@joinsilicon.org. The Platform will endeavor to respond to all inquiries within a reasonable time.', hasEmail: true },
        ],
    },
]

function PolicySection({ section, index }) {
    return (
        <motion.div
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, delay: index * 0.03 }}
            className="glass-panel rounded-3xl p-8 md:p-10 space-y-6 relative overflow-hidden"
        >
            {/* Section header */}
            <div className="flex items-start gap-5 border-b border-black/[0.05] pb-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/60 border border-white shadow-sm shrink-0">
                    <span className="type-caption text-text-secondary">{section.number}</span>
                </div>
                <h2 className="type-title text-xl text-text-primary pt-1.5">{section.title}</h2>
            </div>

            {/* Intro text */}
            {section.intro && (
                <p className="type-body text-sm text-text-secondary leading-[1.85]">
                    {section.intro}
                </p>
            )}

            {/* Definitions list */}
            {section.definitions && (
                <ul className="space-y-4">
                    {section.definitions.map((def, i) => (
                        <li key={i} className="flex items-start gap-3">
                            <span className="shrink-0 mt-2 h-1.5 w-1.5 rounded-full bg-text-muted" />
                            <p className="type-body text-sm text-text-secondary leading-[1.85]">
                                <strong className="type-cta text-text-primary">&ldquo;{def.term}&rdquo;</strong>{' '}
                                {def.definition}
                            </p>
                        </li>
                    ))}
                </ul>
            )}

            {/* Subsections */}
            {section.subsections && (
                <div className="space-y-6">
                    {section.subsections.map((sub, i) => (
                        <div key={i} className="space-y-2">
                            {sub.subtitle && (
                                <h3 className="type-cta text-sm text-text-primary">{sub.subtitle}</h3>
                            )}
                            <p className="type-body text-sm text-text-secondary leading-[1.85]">
                                {sub.hasEmail ? (
                                    <>
                                        Questions or concerns regarding this Policy may be directed to the Platform&apos;s designated contact at{' '}
                                        <a
                                            href="mailto:thomaswang@joinsilicon.org"
                                            className="text-text-primary underline underline-offset-2 decoration-text-muted/40 hover:decoration-text-primary transition-colors duration-300"
                                        >
                                            thomaswang@joinsilicon.org
                                        </a>
                                        . The Platform will endeavor to respond to all inquiries within a reasonable time.
                                    </>
                                ) : sub.body}
                            </p>
                        </div>
                    ))}
                </div>
            )}

            {/* Decorative glass accent */}
            <div className="absolute top-[-60%] right-[-15%] w-[50%] h-[160%] bg-gradient-to-bl from-white/30 to-transparent blur-2xl pointer-events-none -z-10 rotate-12" />
        </motion.div>
    )
}

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-surface-primary text-text-primary relative overflow-x-hidden">
            {/* Ambient liquid glass blob layer — same as landing page */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0" aria-hidden="true">
                <div className="liquid-blob liquid-blob-1 -top-[15%] -left-[10%] w-[55%] h-[55%] bg-[rgba(251,191,146,0.40)]" />
                <div className="liquid-blob liquid-blob-2 top-[25%] -right-[12%] w-[45%] h-[50%] bg-[rgba(167,199,231,0.35)]" />
                <div className="liquid-blob liquid-blob-3 -bottom-[15%] left-[15%] w-[50%] h-[55%] bg-[rgba(232,180,191,0.32)]" />
                <div className="liquid-blob liquid-blob-4 top-[50%] left-[30%] w-[40%] h-[45%] bg-[rgba(196,181,228,0.28)]" />
            </div>

            <div className="relative z-10 max-w-3xl mx-auto px-6 pt-12 pb-20">

                {/* Back link */}
                <motion.div
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4 }}
                >
                    <Link
                        to="/"
                        className="type-cta text-xs text-text-muted hover:text-text-primary transition-colors duration-300 inline-flex items-center justify-center w-9 h-9 rounded-full glass-pill"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                        </svg>
                    </Link>
                </motion.div>

                {/* Hero header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="mt-12 mb-16"
                >
                    <div className="glass-panel rounded-[32px] p-10 md:p-14 relative overflow-hidden">
                        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                            {/* Shield icon */}
                            <div className="shrink-0">
                                <div className="w-16 h-16 rounded-2xl bg-white/60 border border-white shadow-sm flex items-center justify-center">
                                    <svg className="w-8 h-8 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                                    </svg>
                                </div>
                            </div>

                            <div className="text-center md:text-left">
                                <h1 className="type-display text-3xl md:text-4xl text-text-primary mb-4">
                                    Intellectual Property &amp; Privacy
                                </h1>
                                <p className="type-body text-base text-text-secondary leading-relaxed max-w-lg mb-6">
                                    Your research stays yours. We never store, train on, or distribute your uploaded materials. This policy details exactly how your data is handled.
                                </p>
                                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                                    <span className="glass-pill px-4 py-1.5 text-xs font-medium tracking-tight text-text-secondary border-white/40">
                                        Effective: March 3, 2026
                                    </span>
                                    <span className="glass-pill px-4 py-1.5 text-xs font-medium tracking-tight text-text-secondary border-white/40">
                                        Last Revised: March 3, 2026
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Decorative accent */}
                        <div className="absolute top-[-50%] right-[-10%] w-[60%] h-[150%] bg-gradient-to-bl from-white/40 to-transparent blur-2xl pointer-events-none -z-10 rotate-12" />
                    </div>
                </motion.div>

                {/* Policy sections */}
                <div className="space-y-6">
                    {SECTIONS.map((section, i) => (
                        <PolicySection key={section.number} section={section} index={i} />
                    ))}
                </div>



            </div>
        </div>
    )
}
