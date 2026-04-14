import { connectDB } from '@/lib/mongodb'
import { parsePDF, structureCVData } from '@/lib/cv-parser'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    if (!file.name.endsWith('.pdf')) {
      return NextResponse.json({ error: 'Only PDF files are supported' }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())

    // Parse PDF to extract text
    const parsedText = await parsePDF(buffer)

    // Structure the CV data using GPT
    let structuredData = null
    try {
      structuredData = await structureCVData(parsedText)
    } catch (error) {
      console.error('Error structuring CV data:', error)
    }

    // filePath is kept for API compatibility but no file is written to disk
    // (serverless environments have read-only filesystems)
    return NextResponse.json({
      filePath: `/uploads/${Date.now()}-${file.name}`,
      parsedText,
      structuredData,
    })
  } catch (error) {
    console.error('Error uploading CV:', error)
    return NextResponse.json({ error: 'Failed to upload CV' }, { status: 500 })
  }
}
