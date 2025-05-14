import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Get API key from environment variables
    const apiKey = process.env.GEMINI_API_KEY
    const model = process.env.GEMINI_MODEL || 'gemini-1.5-flash'

    if (!apiKey) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 })
    }

    // Simple prompt for testing
    const prompt = "Say hello in a friendly way."

    // Construct request payload
    const payload = {
      contents: [
        {
          parts: [
            { text: prompt }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 100,
      }
    }

    console.log('Making test request to Gemini API...')
    
    // Call Gemini API
    const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/${model}:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    console.log('Gemini API test response status:', response.status)

    if (!response.ok) {
      let errorData = { error: 'Unknown error' };
      try {
        const errorText = await response.text();
        console.error('Gemini API test error text:', errorText);
        if (errorText) {
          try {
            errorData = JSON.parse(errorText);
          } catch (e) {
            errorData.error = errorText;
          }
        }
      } catch (e) {
        console.error('Error parsing error response:', e);
      }
      
      return NextResponse.json({ 
        error: 'Gemini API error', 
        status: response.status,
        details: errorData
      }, { status: response.status })
    }

    const data = await response.json()
    
    // Extract the response text
    const geminiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || 
      "No response from Gemini API"

    return NextResponse.json({ 
      success: true,
      response: geminiResponse,
      apiKeyPrefix: apiKey.substring(0, 5) + '...',
      model: model
    })
    
  } catch (error) {
    console.error('Test error:', error)
    return NextResponse.json(
      { error: 'Failed to test Gemini API', details: error.message },
      { status: 500 }
    )
  }
} 