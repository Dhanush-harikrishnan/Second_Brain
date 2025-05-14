import { NextResponse } from 'next/server'

export async function GET() {
  const geminiApiKey = process.env.GEMINI_API_KEY
  const geminiModel = process.env.GEMINI_MODEL
  
  return NextResponse.json({
    geminiApiKeyExists: !!geminiApiKey,
    geminiApiKeyPrefix: geminiApiKey ? geminiApiKey.substring(0, 5) + '...' : null,
    geminiModel,
    env: process.env.NODE_ENV
  })
} 