import pdfParse from 'pdf-parse'
import openai from './openai'

export async function parsePDF(buffer: Buffer): Promise<string> {
  try {
    const data = await pdfParse(buffer)
    return data.text
  } catch (error) {
    console.error('Error parsing PDF:', error)
    throw new Error('Failed to parse PDF')
  }
}

export async function structureCVData(cvText: string): Promise<any> {
  try {
    const prompt = `Extract structured information from this CV/resume and return ONLY valid JSON (no markdown, no backticks):

CV Text:
${cvText}

Return JSON in this exact format:
{
  "name": "full name",
  "email": "email if found",
  "phone": "phone if found",
  "skills": ["skill1", "skill2", ...],
  "experience": [
    {
      "title": "job title",
      "company": "company name",
      "duration": "time period",
      "description": "brief description"
    }
  ],
  "education": [
    {
      "degree": "degree name",
      "institution": "school/university name",
      "year": "graduation year"
    }
  ]
}

If any field is not found, use null for that field.`

    const response = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
      max_tokens: 1000,
    })

    const content = response.choices[0].message.content
    if (!content) throw new Error('Empty response from GPT')

    const jsonMatch = content.match(/\{[\s\S]*\}/)
    if (!jsonMatch) throw new Error('No JSON found in response')

    return JSON.parse(jsonMatch[0])
  } catch (error) {
    console.error('Error structuring CV data:', error)
    return null
  }
}
