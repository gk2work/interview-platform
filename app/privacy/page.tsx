import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'

export const metadata = {
  title: 'Privacy Policy — FormalMock',
  description: 'Privacy Policy for FormalMock AI Interview Practice Platform',
}

export default function PrivacyPage() {
  return (
    <div className="flex flex-col min-h-screen bg-navy">
      <Navbar />

      <div className="flex-1 py-16 px-6">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl font-heading font-bold mb-3">Privacy Policy</h1>
            <p className="text-slate-400">
              Effective date: 1 January 2026 · Last updated: 1 January 2026
            </p>
          </div>

          <div className="prose prose-invert max-w-none space-y-10 text-slate-300 leading-relaxed">

            <section>
              <p>
                FormalMock ("we", "our", "us") is committed to protecting your privacy. This
                Privacy Policy explains what data we collect when you use the FormalMock platform,
                how we use it, who we share it with, and the choices you have. Please read it
                carefully.
              </p>
            </section>

            {/* 1 */}
            <section>
              <h2 className="text-2xl font-heading font-bold text-white mb-4">1. Data We Collect</h2>

              <h3 className="text-lg font-heading font-semibold text-white mb-2">1.1 Data you provide directly</h3>
              <ul className="list-disc list-inside space-y-2 ml-2 mb-4">
                <li>
                  <strong className="text-white">CV / Resume content</strong> — the text extracted
                  from the PDF you upload. We do not store the original PDF file.
                </li>
                <li>
                  <strong className="text-white">Interview configuration</strong> — company name,
                  job title, interview type, difficulty level, job description, and any additional
                  context you provide.
                </li>
                <li>
                  <strong className="text-white">Interview transcripts</strong> — the text of all
                  messages exchanged between you and Meriam during your interview session.
                </li>
              </ul>

              <h3 className="text-lg font-heading font-semibold text-white mb-2">1.2 Data collected automatically</h3>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li>
                  <strong className="text-white">Session metadata</strong> — session IDs, timestamps,
                  status (in-progress / completed / evaluated), and total turns taken.
                </li>
                <li>
                  <strong className="text-white">Technical logs</strong> — server-side request logs
                  (IP address, user agent, request path, response time) for security and debugging
                  purposes. These are retained for up to 30 days.
                </li>
              </ul>

              <p className="mt-4">
                We do <strong className="text-white">not</strong> collect audio recordings. All
                speech recognition happens entirely in your browser using the Web Speech API.
                Only the resulting text transcript is sent to our servers.
              </p>
            </section>

            {/* 2 */}
            <section>
              <h2 className="text-2xl font-heading font-bold text-white mb-4">2. How We Use Your Data</h2>
              <p className="mb-3">We use the data we collect to:</p>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li>Generate personalised interview questions based on your CV and role configuration.</li>
                <li>Power the AI interviewer (Meriam) by sending your messages to OpenAI's API to generate responses.</li>
                <li>Generate your post-interview evaluation report, including scores, feedback, and recommendations.</li>
                <li>Store your session history so you can review past interviews.</li>
                <li>Monitor and improve the reliability and performance of the Platform.</li>
                <li>Investigate and prevent fraud, abuse, or security incidents.</li>
              </ul>
              <p className="mt-3">
                We do not use your data for advertising, profiling, or any purpose beyond those
                listed above.
              </p>
            </section>

            {/* 3 */}
            <section>
              <h2 className="text-2xl font-heading font-bold text-white mb-4">3. Data Sharing</h2>
              <p className="mb-3">
                We do not sell, rent, or trade your personal data. We share data only in the
                following limited circumstances:
              </p>

              <div className="space-y-4">
                <div className="bg-slate/30 border border-white/5 rounded-lg p-5">
                  <p className="font-semibold text-white mb-1">OpenAI</p>
                  <p className="text-sm">
                    Your CV text, interview configuration, and interview messages are sent to
                    OpenAI's API to generate AI responses and evaluations. OpenAI processes this
                    data under their own{' '}
                    <span className="text-blue">API Data Usage Policies</span>. As an API
                    customer, your data is not used by OpenAI to train their models by default.
                  </p>
                </div>

                <div className="bg-slate/30 border border-white/5 rounded-lg p-5">
                  <p className="font-semibold text-white mb-1">MongoDB Atlas</p>
                  <p className="text-sm">
                    All session data, transcripts, and evaluations are stored in MongoDB Atlas,
                    a cloud database service provided by MongoDB, Inc. Data is encrypted at rest
                    and in transit.
                  </p>
                </div>

                <div className="bg-slate/30 border border-white/5 rounded-lg p-5">
                  <p className="font-semibold text-white mb-1">Legal requirements</p>
                  <p className="text-sm">
                    We may disclose your data if required to do so by law or in response to
                    valid legal process (e.g. a court order or subpoena).
                  </p>
                </div>
              </div>
            </section>

            {/* 4 */}
            <section>
              <h2 className="text-2xl font-heading font-bold text-white mb-4">4. Data Retention</h2>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li>
                  <strong className="text-white">Session data and transcripts</strong> are retained
                  indefinitely so you can review your interview history. We plan to introduce
                  automatic deletion after 12 months of inactivity in a future update.
                </li>
                <li>
                  <strong className="text-white">Evaluation reports</strong> are retained alongside
                  the session.
                </li>
                <li>
                  <strong className="text-white">Server logs</strong> are deleted after 30 days.
                </li>
              </ul>
              <p className="mt-3">
                You may request deletion of your data at any time by contacting us at{' '}
                <span className="text-blue">privacy@formalmock.com</span>.
              </p>
            </section>

            {/* 5 */}
            <section>
              <h2 className="text-2xl font-heading font-bold text-white mb-4">5. Cookies and Tracking</h2>
              <p>
                FormalMock does not use advertising cookies or third-party tracking scripts.
                We may use minimal session cookies required for the functioning of the Platform
                (e.g. to maintain your session state). These are strictly necessary and cannot
                be opted out of while using the Platform.
              </p>
            </section>

            {/* 6 */}
            <section>
              <h2 className="text-2xl font-heading font-bold text-white mb-4">6. Security</h2>
              <p>
                We implement industry-standard technical and organisational security measures to
                protect your data, including:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-2 mt-3">
                <li>HTTPS/TLS encryption for all data in transit.</li>
                <li>Encrypted storage provided by MongoDB Atlas.</li>
                <li>Restricted access to production databases (no public exposure).</li>
                <li>Environment variables for all secrets — credentials are never committed to source control.</li>
              </ul>
              <p className="mt-3">
                No method of transmission or storage is 100% secure. If you become aware of
                any security vulnerability related to our Platform, please report it to{' '}
                <span className="text-blue">security@formalmock.com</span>.
              </p>
            </section>

            {/* 7 */}
            <section>
              <h2 className="text-2xl font-heading font-bold text-white mb-4">7. Children's Privacy</h2>
              <p>
                FormalMock is not intended for users under the age of 16. We do not knowingly
                collect personal data from children under 16. If you believe a child has provided
                us with personal data, please contact us and we will promptly delete it.
              </p>
            </section>

            {/* 8 */}
            <section>
              <h2 className="text-2xl font-heading font-bold text-white mb-4">8. Your Rights</h2>
              <p className="mb-3">
                Depending on your location, you may have the following rights regarding your
                personal data:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li><strong className="text-white">Access</strong> — request a copy of the data we hold about you.</li>
                <li><strong className="text-white">Correction</strong> — request correction of inaccurate data.</li>
                <li><strong className="text-white">Deletion</strong> — request deletion of your data ("right to be forgotten").</li>
                <li><strong className="text-white">Portability</strong> — request your data in a machine-readable format.</li>
                <li><strong className="text-white">Objection</strong> — object to certain types of processing.</li>
              </ul>
              <p className="mt-3">
                To exercise any of these rights, contact us at{' '}
                <span className="text-blue">privacy@formalmock.com</span>. We will respond
                within 30 days.
              </p>
            </section>

            {/* 9 */}
            <section>
              <h2 className="text-2xl font-heading font-bold text-white mb-4">9. International Transfers</h2>
              <p>
                FormalMock and its service providers operate in multiple countries. Your data
                may be transferred to and processed in countries other than your own. By using
                the Platform you consent to such transfers. We ensure appropriate safeguards are
                in place (e.g. standard contractual clauses) where required by applicable law.
              </p>
            </section>

            {/* 10 */}
            <section>
              <h2 className="text-2xl font-heading font-bold text-white mb-4">10. Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. When we do, we will revise
                the "Last updated" date at the top. Significant changes will be communicated
                through a notice on the Platform. Continued use of the Platform after changes
                are posted constitutes your acceptance of the revised policy.
              </p>
            </section>

            {/* 11 */}
            <section>
              <h2 className="text-2xl font-heading font-bold text-white mb-4">11. Contact Us</h2>
              <p>
                If you have any questions, concerns, or requests regarding this Privacy Policy,
                please reach out to us at:
              </p>
              <div className="mt-4 bg-slate/30 border border-white/5 rounded-lg p-5 space-y-1 text-sm">
                <p className="font-semibold text-white">FormalMock</p>
                <p>Email: <span className="text-blue">privacy@formalmock.com</span></p>
                <p>Website: <span className="text-blue">formalmock.com</span></p>
              </div>
            </section>

          </div>

          {/* Bottom nav */}
          <div className="mt-12 pt-8 border-t border-white/10 flex items-center justify-between text-sm text-slate-500">
            <Link href="/terms" className="hover:text-white transition-colors">← Terms of Service</Link>
            <Link href="/" className="hover:text-white transition-colors">Back to home →</Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
