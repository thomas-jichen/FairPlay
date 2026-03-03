import { Link } from 'react-router'

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-surface-primary text-text-primary">
            <div className="max-w-3xl mx-auto px-6 py-20" style={{ fontFamily: '"Noto Serif", Georgia, "Times New Roman", serif' }}>
                <Link
                    to="/"
                    className="text-sm text-text-muted hover:text-text-primary transition-colors duration-300 mb-8 inline-flex items-center gap-2"
                    style={{ fontFamily: '"Montserrat", sans-serif' }}
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                    </svg>
                    Back to FairPlay
                </Link>

                <h1
                    className="text-3xl font-medium tracking-tight mt-8 mb-2"
                    style={{ fontFamily: '"Montserrat", sans-serif' }}
                >
                    Intellectual Property and Uploaded Materials Policy
                </h1>

                <div className="flex gap-6 text-xs text-text-muted mb-10">
                    <span>Effective Date: March 3, 2026</span>
                    <span>Last Revised: March 3, 2026</span>
                </div>

                <div className="space-y-10 text-sm text-text-secondary leading-[1.85]">

                    {/* Section 1 */}
                    <section className="space-y-4">
                        <h2 className="text-lg font-semibold text-text-primary" style={{ fontFamily: '"Montserrat", sans-serif' }}>
                            1. Scope and Purpose
                        </h2>
                        <p>
                            This Intellectual Property and Uploaded Materials Policy ("Policy") governs the treatment,
                            handling, storage, and use of any materials, content, or data uploaded or submitted by end
                            users ("Users") to this platform ("Platform"). This Policy is distinct from and supplementary to
                            any general Privacy Policy governing the collection of personal data. This Policy applies
                            exclusively to research materials, including, without limitation, academic abstracts, research
                            posters, presentation slides, and related scholarly content, submitted by Users for use with the
                            Platform's pitch feedback services.
                        </p>
                        <p>
                            By uploading or submitting any materials to the Platform, the User acknowledges and agrees to
                            the terms set forth herein.
                        </p>
                    </section>

                    {/* Section 2 */}
                    <section className="space-y-4">
                        <h2 className="text-lg font-semibold text-text-primary" style={{ fontFamily: '"Montserrat", sans-serif' }}>
                            2. Definitions
                        </h2>
                        <p>For the purposes of this Policy, the following terms shall have the meanings described below:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li><strong>"Uploaded Materials"</strong> refers to any files, documents, images, data, text, audio, or video content submitted or uploaded by a User to the Platform, including but not limited to research abstracts, academic posters, and presentation slides.</li>
                            <li><strong>"Session"</strong> refers to a single, continuous interactive engagement between a User and the Platform's system, initiated upon the User's commencement of a feedback session and terminated upon the User's conclusion thereof.</li>
                            <li><strong>"Real-Time Transcription"</strong> refers to the automated, live conversion of spoken audio into text occurring concurrently with a Session, without post-hoc processing or retention.</li>
                            <li><strong>"Input Tokens"</strong> refers to discrete units of data processed by the Platform's ML models solely for the purpose of generating responsive outputs during an active Session.</li>
                            <li><strong>"Third-Party LLM Provider"</strong> refers to any external AI service provider whose LLMs are integrated into the Platform to generate feedback, analysis, or interactive response.</li>
                        </ul>
                    </section>

                    {/* Section 3 */}
                    <section className="space-y-4">
                        <h2 className="text-lg font-semibold text-text-primary" style={{ fontFamily: '"Montserrat", sans-serif' }}>
                            3. Storage and Retention of Uploaded Materials
                        </h2>

                        <div className="space-y-3">
                            <h3 className="text-base font-medium text-text-primary">3.1 No Persistent Storage</h3>
                            <p>
                                The Platform does not store, archive, upload, or transmit Uploaded Materials to any external
                                online database, cloud-based repository, or hardware-linked storage system. Uploaded
                                Materials are processed exclusively as Input Tokens to proprietary models within the active
                                Session and are not retained beyond the duration of that Session.
                            </p>
                        </div>

                        <div className="space-y-3">
                            <h3 className="text-base font-medium text-text-primary">3.2 Transient Processing</h3>
                            <p>
                                All Uploaded Materials are held in transient, in-memory processing environments solely for the
                                purpose of providing real-time feedback and analysis to the User during an active Session.
                                Upon termination of a Session, all Uploaded Materials processed during that Session are
                                permanently purged from the Platform's processing environment.
                            </p>
                        </div>

                        <div className="space-y-3">
                            <h3 className="text-base font-medium text-text-primary">3.3 No Secondary Use or Distribution</h3>
                            <p>
                                Uploaded Materials will not be accessed, reviewed, distributed, disclosed, sold, licensed, or
                                otherwise transferred to any third party, except as required by applicable law or judicial order.
                            </p>
                        </div>
                    </section>

                    {/* Section 4 */}
                    <section className="space-y-4">
                        <h2 className="text-lg font-semibold text-text-primary" style={{ fontFamily: '"Montserrat", sans-serif' }}>
                            4. Treatment of Video and Audio Data
                        </h2>

                        <div className="space-y-3">
                            <h3 className="text-base font-medium text-text-primary">4.1 No Video or Audio Storage</h3>
                            <p>
                                Any video or audio recorded or captured through the Platform in the course of a pitch feedback
                                session is not saved, stored, or retained in any form. Such recordings are processed solely in
                                real time for the purposes of providing interactive feedback and are permanently and
                                automatically deleted upon termination of the applicable Session.
                            </p>
                        </div>

                        <div className="space-y-3">
                            <h3 className="text-base font-medium text-text-primary">4.2 Real-Time Transcription Only</h3>
                            <p>
                                Audio-to-text transcription performed by the Platform occurs exclusively in real time during an
                                active Session. No post-processing, deferred transcription, or retrospective analysis of video or
                                audio content takes place. All transcription data generated during a Session is discarded upon
                                Session termination and is not retained in any database, log, or storage system.
                            </p>
                        </div>

                        <div className="space-y-3">
                            <h3 className="text-base font-medium text-text-primary">4.3 No Secondary Recording</h3>
                            <p>
                                The Platform does not create, retain, or transmit secondary copies or derivatives of any video or
                                audio data submitted by Users.
                            </p>
                        </div>
                    </section>

                    {/* Section 5 */}
                    <section className="space-y-4">
                        <h2 className="text-lg font-semibold text-text-primary" style={{ fontFamily: '"Montserrat", sans-serif' }}>
                            5. Use of Artificial Intelligence and Large Language Models
                        </h2>

                        <div className="space-y-3">
                            <h3 className="text-base font-medium text-text-primary">5.1 No Model Training on User Data</h3>
                            <p>
                                The Platform's LLMs, and any Third-Party LLM Provider models integrated into the Platform,
                                shall not be trained, fine-tuned, retrained, or otherwise optimized using Uploaded Materials or
                                any data derived therefrom. User-submitted content will not be used, directly or indirectly, to
                                update, modify, or improve the parameters, weights, or outputs of any machine learning model.
                            </p>
                        </div>

                        <div className="space-y-3">
                            <h3 className="text-base font-medium text-text-primary">5.2 Inference-Only Use</h3>
                            <p>
                                Uploaded Materials and Session data are utilized exclusively for inference-time processing: for
                                generating real-time responses, feedback, and analysis during an active Session. Such use
                                does not constitute or enable model training, and no gradient updates or parameter adjustments
                                are performed based on User data.
                            </p>
                        </div>

                        <div className="space-y-3">
                            <h3 className="text-base font-medium text-text-primary">5.3 Third-Party LLM Providers</h3>
                            <p>
                                To the extent the Platform integrates Third-Party LLM Providers, the Platform requires such
                                providers adhere to data use restrictions consistent with this Policy, including the prohibition on
                                using User-submitted data for model training. Users are encouraged to review the applicable
                                terms of service of any identified Third-Party LLM Provider.
                            </p>
                        </div>
                    </section>

                    {/* Section 6 */}
                    <section className="space-y-4">
                        <h2 className="text-lg font-semibold text-text-primary" style={{ fontFamily: '"Montserrat", sans-serif' }}>
                            6. Intellectual Property Rights
                        </h2>

                        <div className="space-y-3">
                            <h3 className="text-base font-medium text-text-primary">6.1 Retention of User Rights</h3>
                            <p>
                                Users retain all intellectual property rights, including but not limited to copyright, in and to their
                                Uploaded Materials. Nothing in this Policy or in the User's use of the Platform shall be construed
                                as a transfer, assignment, license, or waiver of any intellectual property rights held by the User
                                with respect to their Uploaded Materials.
                            </p>
                        </div>

                        <div className="space-y-3">
                            <h3 className="text-base font-medium text-text-primary">6.2 Limited License Grant</h3>
                            <p>
                                By uploading materials to the Platform, the User grants the Platform a limited, non-exclusive,
                                royalty-free, revocable, non-sublicensable license to access and process the Uploaded
                                Materials solely for the purpose of providing the Platform's services during the active Session.
                                This license terminates automatically upon conclusion of the applicable Session.
                            </p>
                        </div>

                        <div className="space-y-3">
                            <h3 className="text-base font-medium text-text-primary">6.3 No Proprietary Claims</h3>
                            <p>
                                The Platform makes no claim of ownership over any Uploaded Materials. The Platform shall not
                                assert any proprietary interest in, or derive any commercial benefit from, the intellectual content
                                of Users' research materials.
                            </p>
                        </div>
                    </section>

                    {/* Section 7 */}
                    <section className="space-y-4">
                        <h2 className="text-lg font-semibold text-text-primary" style={{ fontFamily: '"Montserrat", sans-serif' }}>
                            7. Feedback and Improvement
                        </h2>
                        <p>
                            While the Platform does not use Uploaded Materials for model training, the Platform welcomes
                            voluntary feedback from Users regarding the quality and accuracy of the services provided. Any
                            feedback voluntarily submitted by Users regarding the Platform's performance may be used to
                            improve the Platform's services, subject to the User's express consent. Feedback submissions
                            are entirely optional and do not include Uploaded Materials unless expressly provided by the
                            User for that purpose.
                        </p>
                    </section>

                    {/* Section 8 */}
                    <section className="space-y-4">
                        <h2 className="text-lg font-semibold text-text-primary" style={{ fontFamily: '"Montserrat", sans-serif' }}>
                            8. Security
                        </h2>
                        <p>
                            The Platform implements reasonable and industry-standard technical and organizational
                            measures to protect Uploaded Materials against unauthorized access, disclosure, alteration, or
                            destruction during the period of active processing. Notwithstanding the foregoing, no method of
                            electronic transmission or processing is entirely secure, and the Platform does not warrant
                            absolute security of Uploaded Materials during transmission or processing.
                        </p>
                    </section>

                    {/* Section 9 */}
                    <section className="space-y-4">
                        <h2 className="text-lg font-semibold text-text-primary" style={{ fontFamily: '"Montserrat", sans-serif' }}>
                            9. Modifications to This Policy
                        </h2>
                        <p>
                            The Platform reserves the right to amend or update this Policy at any time. Material changes to
                            this Policy will be communicated to Users via posting of an updated Policy on the Platform with
                            a revised effective date. Continued use of the Platform following the posting of changes
                            constitutes acceptance of such changes. Users are encouraged to review this Policy
                            periodically.
                        </p>
                    </section>

                    {/* Section 10 */}
                    <section className="space-y-4">
                        <h2 className="text-lg font-semibold text-text-primary" style={{ fontFamily: '"Montserrat", sans-serif' }}>
                            10. Contact Information
                        </h2>
                        <p>
                            Questions or concerns regarding this Policy may be directed to the Platform's designated
                            contact at{' '}
                            <a
                                href="mailto:thomaswang@joinsilicon.org"
                                className="text-text-primary underline underline-offset-2 hover:no-underline"
                            >
                                thomaswang@joinsilicon.org
                            </a>
                            . The Platform will endeavor to respond to all inquiries within a reasonable time.
                        </p>
                    </section>

                    {/* End */}
                    <div className="pt-6 border-t border-black/[0.06]">
                        <p className="text-xs text-text-muted text-center tracking-wide" style={{ fontFamily: '"Montserrat", sans-serif' }}>
                            END OF POLICY
                        </p>
                    </div>

                </div>
            </div>
        </div>
    )
}
