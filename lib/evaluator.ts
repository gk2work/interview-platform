import { ISession, IMessage, IEvaluation } from '@/types'
import openai from './openai'

export async function buildEvaluation(session: ISession, messages: IMessage[]): Promise<IEvaluation> {
  const transcript = messages
    .filter(m => m.role !== 'system')
    .map(m => `${m.role === 'interviewer' ? 'Interviewer' : 'Candidate'}: ${m.content}`)
    .join('\n\n')

  const prompt = `
You are an expert interview evaluator. Analyze the following interview transcript and provide a detailed evaluation.

## CONTEXT
- Company: ${session.interviewConfig.company}
- Position: ${session.interviewConfig.designation}
- Interview Type: ${session.interviewConfig.interviewType}
- Difficulty Level: ${session.interviewConfig.difficulty}

## CANDIDATE'S CV
<cv>
${session.cvParsedText}
</cv>

## INTERVIEW TRANSCRIPT
<transcript>
${transcript}
</transcript>

## YOUR TASK
Evaluate the candidate and respond with ONLY valid JSON (no markdown, no backticks):

{
  "scores": {
    "technicalKnowledge": { "score": <1-10>, "maxScore": 10, "feedback": "<2-3 sentence justification>" },
    "communication": { "score": <1-10>, "maxScore": 10, "feedback": "<2-3 sentence justification>" },
    "problemSolving": { "score": <1-10>, "maxScore": 10, "feedback": "<2-3 sentence justification>" },
    "culturalFit": { "score": <1-10>, "maxScore": 10, "feedback": "<2-3 sentence justification>" },
    "relevantExperience": { "score": <1-10>, "maxScore": 10, "feedback": "<2-3 sentence justification>" },
    "confidence": { "score": <1-10>, "maxScore": 10, "feedback": "<2-3 sentence justification>" }
  },
  "overallScore": <average of all scores, 1 decimal>,
  "overallGrade": "<A+/A/A-/B+/B/B-/C+/C/C-/D/F>",
  "recommendation": "<Strong Hire | Hire | Lean Hire | Lean No Hire | No Hire>",
  "strengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
  "improvements": ["<improvement 1>", "<improvement 2>", "<improvement 3>"],
  "detailedFeedback": "<A comprehensive 3-5 sentence paragraph giving overall feedback, tone of the interview, and specific advice>",
  "suggestedTopics": ["<topic 1>", "<topic 2>", "<topic 3>"]
}

## SCORING GUIDE
- 9-10: Exceptional — clearly exceeds expectations for the role
- 7-8: Strong — meets and sometimes exceeds expectations
- 5-6: Average — meets basic requirements but lacks depth
- 3-4: Below Average — significant gaps or concerns
- 1-2: Poor — major red flags or inability to answer

Be fair but honest. Base scores only on evidence from the transcript.
`

  try {
    const response = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
      max_tokens: 2000,
    })

    const content = response.choices[0].message.content
    if (!content) throw new Error('Empty response from GPT')

    const jsonMatch = content.match(/\{[\s\S]*\}/)
    if (!jsonMatch) throw new Error('No JSON found in response')

    const evaluationData = JSON.parse(jsonMatch[0])

    return {
      sessionId: session._id!,
      ...evaluationData,
    } as IEvaluation
  } catch (error) {
    console.error('Error building evaluation:', error)
    throw error
  }
}
