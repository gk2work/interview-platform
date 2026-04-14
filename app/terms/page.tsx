import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'

export const metadata = {
  title: 'Terms of Service — FormalMock',
  description: 'Terms of Service for FormalMock AI Interview Practice Platform',
}

export default function TermsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-navy">
      <Navbar />

      <div className="flex-1 py-16 px-6">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl font-heading font-bold mb-3">Terms of Service</h1>
            <p className="text-slate-400">
              Effective date: 1 January 2026 · Last updated: 1 January 2026
            </p>
          </div>

          <div className="prose prose-invert max-w-none space-y-10 text-slate-300 leading-relaxed">

            <section>
              <p>
                These Terms of Service ("Terms") govern your access to and use of FormalMock
                (the "Platform"), operated by FormalMock ("we", "our", or "us"). By creating an
                account or using the Platform in any way, you agree to be bound by these Terms.
                If you do not agree, please do not use the Platform.
              </p>
            </section>

            {/* 1 */}
            <section>
              <h2 className="text-2xl font-heading font-bold text-white mb-4">1. About FormalMock</h2>
              <p>
                FormalMock is an AI-powered mock interview platform that allows users to practise
                job interviews via voice conversations with an AI interviewer named Meriam. The
                Platform provides automated evaluation reports based on interview transcripts. It
                is intended for educational and career-development purposes only.
              </p>
            </section>

            {/* 2 */}
            <section>
              <h2 className="text-2xl font-heading font-bold text-white mb-4">2. Eligibility</h2>
              <p>
                You must be at least 16 years old to use the Platform. By using FormalMock you
                represent and warrant that you meet this age requirement and that you have the legal
                capacity to enter into these Terms.
              </p>
            </section>

            {/* 3 */}
            <section>
              <h2 className="text-2xl font-heading font-bold text-white mb-4">3. Your Account</h2>
              <p>
                FormalMock does not currently require user accounts. Your interview sessions are
                identified by a session ID stored in our database. You are responsible for
                maintaining the confidentiality of any session links or IDs that grant access to
                your interview data.
              </p>
            </section>

            {/* 4 */}
            <section>
              <h2 className="text-2xl font-heading font-bold text-white mb-4">4. Acceptable Use</h2>
              <p className="mb-3">You agree to use the Platform only for lawful purposes. You must not:</p>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li>Upload content that is illegal, defamatory, obscene, or violates any third party's rights.</li>
                <li>Attempt to reverse-engineer, scrape, or circumvent any part of the Platform.</li>
                <li>Use automated tools (bots, scripts) to interact with the Platform in any way not explicitly permitted.</li>
                <li>Use the Platform to generate content intended to deceive, defraud, or impersonate others.</li>
                <li>Attempt to gain unauthorised access to other users' data or our infrastructure.</li>
                <li>Upload malicious files or content designed to disrupt the Platform.</li>
              </ul>
              <p className="mt-3">
                We reserve the right to suspend or terminate access for any user who violates
                these requirements.
              </p>
            </section>

            {/* 5 */}
            <section>
              <h2 className="text-2xl font-heading font-bold text-white mb-4">5. AI-Generated Content Disclaimer</h2>
              <p className="mb-3">
                FormalMock uses large language model (LLM) technology — specifically OpenAI's
                GPT-4o — to power the AI interviewer (Meriam) and to generate evaluation reports.
                You acknowledge and agree that:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li>
                  AI-generated interview questions, responses, and evaluations are automated
                  and may not reflect the views, standards, or practices of any specific employer.
                </li>
                <li>
                  Scores and hire recommendations produced by the Platform are for
                  <strong className="text-white"> practice purposes only</strong> and do not
                  constitute professional career advice or predict outcomes of real interviews.
                </li>
                <li>
                  AI responses may occasionally be inaccurate, biased, or inappropriate. FormalMock
                  does not guarantee the accuracy, completeness, or suitability of any AI output.
                </li>
                <li>
                  You should not make significant career decisions based solely on FormalMock
                  evaluations without seeking professional guidance.
                </li>
              </ul>
            </section>

            {/* 6 */}
            <section>
              <h2 className="text-2xl font-heading font-bold text-white mb-4">6. CV and Personal Data</h2>
              <p>
                When you upload a CV/resume, you grant FormalMock a limited, non-exclusive licence
                to process and store the contents of that document solely for the purpose of
                personalising your interview session and generating your evaluation report. We do
                not sell, rent, or share your CV data with third parties other than our AI
                processing providers (OpenAI) as described in our{' '}
                <Link href="/privacy" className="text-blue hover:underline">
                  Privacy Policy
                </Link>
                .
              </p>
            </section>

            {/* 7 */}
            <section>
              <h2 className="text-2xl font-heading font-bold text-white mb-4">7. Intellectual Property</h2>
              <p>
                All content on the Platform — including the FormalMock name, logo, UI design,
                and underlying software — is the exclusive property of FormalMock and is
                protected by applicable copyright, trademark, and intellectual property laws.
                You may not copy, reproduce, modify, or distribute any part of the Platform
                without our prior written consent.
              </p>
              <p className="mt-3">
                You retain ownership of any content you upload (e.g. your CV). By uploading
                content you represent that you have the right to do so and that it does not
                infringe any third-party rights.
              </p>
            </section>

            {/* 8 */}
            <section>
              <h2 className="text-2xl font-heading font-bold text-white mb-4">8. Third-Party Services</h2>
              <p>
                The Platform integrates with third-party services including OpenAI (AI model
                provider) and MongoDB (database). Your use of the Platform is also subject to
                the applicable terms of these providers. We are not responsible for the
                availability, accuracy, or practices of any third-party service.
              </p>
            </section>

            {/* 9 */}
            <section>
              <h2 className="text-2xl font-heading font-bold text-white mb-4">9. Disclaimer of Warranties</h2>
              <p>
                THE PLATFORM IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY
                KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF
                MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT. WE DO
                NOT WARRANT THAT THE PLATFORM WILL BE UNINTERRUPTED, ERROR-FREE, OR FREE OF
                VIRUSES OR OTHER HARMFUL COMPONENTS.
              </p>
            </section>

            {/* 10 */}
            <section>
              <h2 className="text-2xl font-heading font-bold text-white mb-4">10. Limitation of Liability</h2>
              <p>
                TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW, FORMALMOCK AND ITS
                OFFICERS, EMPLOYEES, AND AFFILIATES SHALL NOT BE LIABLE FOR ANY INDIRECT,
                INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES — INCLUDING LOSS OF
                PROFITS, DATA, GOODWILL, OR CAREER OPPORTUNITIES — ARISING FROM YOUR USE OF
                OR INABILITY TO USE THE PLATFORM, EVEN IF WE HAVE BEEN ADVISED OF THE
                POSSIBILITY OF SUCH DAMAGES. OUR TOTAL LIABILITY TO YOU FOR ANY CLAIMS
                ARISING FROM THESE TERMS SHALL NOT EXCEED THE AMOUNT YOU PAID US IN THE
                12 MONTHS PRECEDING THE CLAIM.
              </p>
            </section>

            {/* 11 */}
            <section>
              <h2 className="text-2xl font-heading font-bold text-white mb-4">11. Indemnification</h2>
              <p>
                You agree to indemnify, defend, and hold harmless FormalMock and its officers,
                directors, employees, and agents from any claims, liabilities, damages, or
                expenses (including legal fees) arising from your use of the Platform, your
                violation of these Terms, or your infringement of any third-party right.
              </p>
            </section>

            {/* 12 */}
            <section>
              <h2 className="text-2xl font-heading font-bold text-white mb-4">12. Modifications to the Platform and Terms</h2>
              <p>
                We reserve the right to modify, suspend, or discontinue the Platform at any
                time without notice. We may also update these Terms from time to time. Continued
                use of the Platform after changes are posted constitutes acceptance of the
                revised Terms. We will update the "Last updated" date at the top of this page
                whenever changes are made.
              </p>
            </section>

            {/* 13 */}
            <section>
              <h2 className="text-2xl font-heading font-bold text-white mb-4">13. Governing Law</h2>
              <p>
                These Terms are governed by and construed in accordance with applicable law.
                Any disputes arising from these Terms or your use of the Platform shall be
                resolved through good-faith negotiation. If resolution cannot be reached, the
                dispute shall be subject to the exclusive jurisdiction of the competent courts.
              </p>
            </section>

            {/* 14 */}
            <section>
              <h2 className="text-2xl font-heading font-bold text-white mb-4">14. Contact</h2>
              <p>
                If you have any questions about these Terms, please contact us at{' '}
                <span className="text-blue">legal@formalmock.com</span>.
              </p>
            </section>

          </div>

          {/* Bottom nav */}
          <div className="mt-12 pt-8 border-t border-white/10 flex items-center justify-between text-sm text-slate-500">
            <Link href="/" className="hover:text-white transition-colors">← Back to home</Link>
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy →</Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
