import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export default openai

export async function chatCompletion(messages: any[], systemPrompt?: string) {
  const allMessages = []

  if (systemPrompt) {
    allMessages.push({ role: 'system' as const, content: systemPrompt })
  }

  allMessages.push(...messages)

  const response = await openai.chat.completions.create({
    model: process.env.OPENAI_MODEL || 'gpt-4o',
    messages: allMessages,
    temperature: 0.7,
    max_tokens: 1000,
  })

  return response.choices[0].message.content
}
