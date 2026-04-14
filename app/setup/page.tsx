'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Textarea } from '@/components/ui/Textarea'
import { FileUpload } from '@/components/ui/FileUpload'
import { INTERVIEW_TYPES, DIFFICULTY_LEVELS } from '@/lib/constants'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'

// Stages shown to the user during CV upload (each lasts ~2s before cycling to the next)
const CV_UPLOAD_STAGES = [
  'Uploading your PDF…',
  'Extracting text from CV…',
  'Analyzing your experience with AI…',
  'Structuring your profile…',
]

// Stages shown while creating the interview session
const SESSION_STAGES = [
  'Creating your session…',
  'Building your personalized interview…',
  'Preparing Meriam…',
]

function useLoadingStages(stages: string[], active: boolean, intervalMs = 2200) {
  const [stageIndex, setStageIndex] = useState(0)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (!active) {
      setStageIndex(0)
      if (timerRef.current) clearInterval(timerRef.current)
      return
    }

    timerRef.current = setInterval(() => {
      setStageIndex(prev => Math.min(prev + 1, stages.length - 1))
    }, intervalMs)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [active, stages.length, intervalMs])

  return stages[stageIndex]
}

export default function SetupPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [isUploadingCV, setIsUploadingCV] = useState(false)
  const [isStartingInterview, setIsStartingInterview] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // CV state
  const [cvFile, setCVFile] = useState<File | null>(null)
  const [cvData, setCVData] = useState<any>(null)

  // Config state
  const [company, setCompany] = useState('')
  const [designation, setDesignation] = useState('')
  const [interviewType, setInterviewType] = useState('Technical')
  const [difficulty, setDifficulty] = useState('Mid-Level')
  const [jobDescription, setJobDescription] = useState('')
  const [additionalContext, setAdditionalContext] = useState('')

  const cvUploadStage = useLoadingStages(CV_UPLOAD_STAGES, isUploadingCV)
  const sessionStage = useLoadingStages(SESSION_STAGES, isStartingInterview)

  const handleCVUpload = async (file: File) => {
    try {
      setIsUploadingCV(true)
      setError(null)
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload-cv', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) throw new Error('Failed to upload CV')

      const data = await response.json()
      setCVData(data)
      setCVFile(file)
      setStep(2)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload CV')
    } finally {
      setIsUploadingCV(false)
    }
  }

  const handleStartInterview = async () => {
    if (!company || !designation) {
      setError('Please fill in all required fields')
      return
    }

    try {
      setIsStartingInterview(true)
      setError(null)

      const response = await fetch('/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cvFilePath: cvData.filePath,
          cvParsedText: cvData.parsedText,
          cvStructuredData: cvData.structuredData,
          interviewConfig: {
            company,
            designation,
            interviewType,
            difficulty,
            jobDescription,
            additionalContext,
          },
        }),
      })

      if (!response.ok) throw new Error('Failed to create session')

      const data = await response.json()
      router.push(`/interview/${data.sessionId}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start interview')
      setIsStartingInterview(false)
    }
  }

  const isLoading = isUploadingCV || isStartingInterview
  const currentLoadingText = isUploadingCV ? cvUploadStage : isStartingInterview ? sessionStage : ''

  return (
    <div className="flex flex-col min-h-screen bg-navy">
      <Navbar />
      <div className="flex-1 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-heading font-bold mb-3">Set Up Your Interview</h1>
          <p className="text-slate-400">Step {step} of 2 — configure Meriam for your target role</p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-6 mb-12">
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center font-bold ${
              step >= 1 ? 'bg-blue text-white' : 'bg-slate text-slate-400'
            }`}
          >
            1
          </div>
          <div className={`h-1 w-16 ${step >= 2 ? 'bg-blue' : 'bg-slate'}`} />
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center font-bold ${
              step >= 2 ? 'bg-blue text-white' : 'bg-slate text-slate-400'
            }`}
          >
            2
          </div>
        </div>

        {/* Loading overlay */}
        {isLoading && (
          <Card className="mb-6 bg-blue/10 border-blue/40">
            <div className="flex items-center gap-4">
              <div className="w-6 h-6 border-2 border-blue border-t-transparent rounded-full animate-spin flex-shrink-0" />
              <div>
                <p className="text-blue font-semibold">{currentLoadingText}</p>
                <p className="text-slate-400 text-sm mt-0.5">Please wait, do not close this page</p>
              </div>
            </div>
          </Card>
        )}

        {error && (
          <Card className="mb-6 bg-rose/10 border-rose/50">
            <p className="text-rose">{error}</p>
          </Card>
        )}

        {/* Step 1: Upload CV */}
        {step === 1 && (
          <Card className="space-y-6">
            <div>
              <h2 className="text-2xl font-heading font-bold mb-2">Upload Your CV / Resume</h2>
              <p className="text-slate-400">
                PDF format only · Max 10MB
                <br />
                <span className="text-slate-500 text-sm">
                  We parse your CV with AI to personalise the interview questions for you.
                </span>
              </p>
            </div>

            {isUploadingCV ? (
              <div className="border-2 border-dashed border-blue/40 rounded-lg p-12 text-center">
                <div className="w-10 h-10 border-4 border-blue border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-blue font-medium">{cvUploadStage}</p>
                <p className="text-slate-500 text-sm mt-2">This may take 10–20 seconds</p>

                {/* Stage progress dots */}
                <div className="flex justify-center gap-2 mt-4">
                  {CV_UPLOAD_STAGES.map((stage, i) => (
                    <div
                      key={i}
                      className={`w-2 h-2 rounded-full transition-all ${
                        CV_UPLOAD_STAGES.indexOf(cvUploadStage) >= i
                          ? 'bg-blue'
                          : 'bg-slate/50'
                      }`}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <FileUpload
                onFileSelect={handleCVUpload}
                accept=".pdf"
                maxSize={10 * 1024 * 1024}
                isLoading={false}
                disabled={false}
              />
            )}

            {cvData && (
              <div className="bg-emerald/10 border border-emerald/30 rounded-lg p-4">
                <p className="text-emerald font-semibold text-sm">✓ CV uploaded successfully</p>
                {cvData.structuredData?.name && (
                  <p className="text-slate-400 text-sm mt-1">
                    Detected: <span className="text-white">{cvData.structuredData.name}</span>
                  </p>
                )}
                {cvData.structuredData?.skills?.length > 0 && (
                  <p className="text-slate-400 text-sm mt-1">
                    Skills found:{' '}
                    <span className="text-white">
                      {cvData.structuredData.skills.slice(0, 5).join(', ')}
                      {cvData.structuredData.skills.length > 5 ? ' …' : ''}
                    </span>
                  </p>
                )}
              </div>
            )}
          </Card>
        )}

        {/* Step 2: Configure Interview */}
        {step === 2 && (
          <Card className="space-y-6">
            <div>
              <h2 className="text-2xl font-heading font-bold mb-2">Configure Interview</h2>
              <p className="text-slate-400">Tell Meriam about your target role</p>
            </div>

            <Input
              label="Company Name *"
              placeholder="e.g. Google, Meta, Microsoft"
              value={company}
              onChange={e => setCompany(e.target.value)}
              disabled={isLoading}
            />

            <Input
              label="Position / Role *"
              placeholder="e.g. Senior Frontend Engineer"
              value={designation}
              onChange={e => setDesignation(e.target.value)}
              disabled={isLoading}
            />

            <Select
              label="Interview Type"
              value={interviewType}
              onChange={e => setInterviewType(e.target.value)}
              options={INTERVIEW_TYPES.map(t => ({ value: t, label: t }))}
              disabled={isLoading}
            />

            <Select
              label="Difficulty Level"
              value={difficulty}
              onChange={e => setDifficulty(e.target.value)}
              options={DIFFICULTY_LEVELS.map(d => ({ value: d, label: d }))}
              disabled={isLoading}
            />

            <Textarea
              label="Job Description (Optional)"
              placeholder="Paste the job description for more targeted questions"
              value={jobDescription}
              onChange={e => setJobDescription(e.target.value)}
              disabled={isLoading}
            />

            <Textarea
              label="Additional Context (Optional)"
              placeholder="Any topics you want Meriam to focus on"
              value={additionalContext}
              onChange={e => setAdditionalContext(e.target.value)}
              disabled={isLoading}
            />

            {isStartingInterview && (
              <div className="border border-blue/30 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-blue border-t-transparent rounded-full animate-spin flex-shrink-0" />
                  <div>
                    <p className="text-blue font-medium text-sm">{sessionStage}</p>
                    <p className="text-slate-500 text-xs mt-0.5">Setting up your personalised interview</p>
                  </div>
                </div>
                <div className="flex gap-1.5 mt-3">
                  {SESSION_STAGES.map((stage, i) => (
                    <div
                      key={i}
                      className={`h-1 flex-1 rounded-full transition-all ${
                        SESSION_STAGES.indexOf(sessionStage) >= i ? 'bg-blue' : 'bg-slate/30'
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-4 pt-4">
              <Button
                variant="secondary"
                onClick={() => setStep(1)}
                disabled={isLoading}
              >
                Back
              </Button>
              <Button
                variant="primary"
                onClick={handleStartInterview}
                isLoading={isStartingInterview}
                className="flex-1"
                disabled={isLoading}
              >
                {isStartingInterview ? sessionStage : 'Start Interview'}
              </Button>
            </div>
          </Card>
        )}
      </div>
      </div>
      <Footer />
    </div>
  )
}
