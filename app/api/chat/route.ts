import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'

// Message interface
interface Message {
  role: "user" | "assistant"
  content: string
}

export async function POST(request: Request) {
  try {
    // Verify authentication
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Parse request
    const { messages, memoryContext } = await request.json()
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Messages are required' }, { status: 400 })
    }

    // Get API key from environment variables
    const apiKey = process.env.GEMINI_API_KEY
    const model = process.env.GEMINI_MODEL || 'gemini-1.5-flash'

    console.log('API Key available:', !!apiKey)
    console.log('Model:', model)

    if (!apiKey) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 })
    }

    // Create the prompt for Gemini
    const userMessage = messages[messages.length - 1].content
    
    // Construct conversation history for context
    const conversationHistory = messages.slice(0, -1).map(msg => 
      `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`
    ).join('\n')

    // Create the complete prompt with system instructions, memory context, and user query
    const systemPrompt = `You are an AI assistant that helps users access and analyze their personal memories. 
Your task is to use the provided memory context to assist the user by:
1. Retrieving relevant memories when asked
2. Finding connections between different memories
3. Providing insights and advice based on the user's personal experiences
4. Answering questions using information from their memories

Below is the user's memory database. Use this information to respond to their query:

${memoryContext || "No memories available yet."}

Conversation history:
${conversationHistory}

User's current question: ${userMessage}

Respond in a helpful, friendly manner. If you cannot find relevant information in the memories, acknowledge this and provide a general response.`

    // Construct request payload
    const payload = {
      contents: [
        {
          parts: [
            { text: systemPrompt }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 800,
      }
    }

    console.log('Making request to Gemini API...')
    
    // Call Gemini API
    const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/${model}:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    console.log('Gemini API response status:', response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Gemini API error response:', errorText)
      
      let errorData
      try {
        errorData = JSON.parse(errorText)
      } catch (e) {
        errorData = { error: errorText }
      }
      
      console.error('Gemini API error details:', errorData)
      
      if (response.status === 400) {
        return NextResponse.json({ error: 'Bad request to AI service' }, { status: 400 })
      } else if (response.status === 401) {
        return NextResponse.json({ error: 'API key unauthorized' }, { status: 401 })
      } else {
        return NextResponse.json({ error: `AI service error: ${response.status}` }, { status: 500 })
      }
    }

    const data = await response.json()
    console.log('Gemini API response received successfully')
    
    // Extract the response text from the Gemini API response
    const geminiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || 
      "I'm sorry, I couldn't generate a response. Please try again."

    return NextResponse.json({ response: geminiResponse })
    
  } catch (error) {
    console.error('Chat error:', error)
    return NextResponse.json(
      { error: 'Failed to process your request' },
      { status: 500 }
    )
  }
} 