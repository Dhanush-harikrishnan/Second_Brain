"use client"

import { useState } from "react"

interface Message {
  id: string
  content: string
  sender: "user" | "ai"
  sentiment: "neutral" | "positive" | "negative" | "curious"
  timestamp: Date
}

export function useMockAI() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content: "Welcome to Second Brain! How can I help you today?",
      sender: "ai",
      sentiment: "neutral",
      timestamp: new Date(),
    },
  ])
  const [isProcessing, setIsProcessing] = useState(false)
  const [currentEmotion, setCurrentEmotion] = useState("neutral")

  const mockResponses = [
    {
      keywords: ["hello", "hi", "hey", "greetings"],
      response: "Hello! I'm your personal assistant. How can I help you today?",
      emotion: "joy",
    },
    {
      keywords: ["how", "what", "why", "when", "where", "who"],
      response: "That's an interesting question. Let me think about that for a moment.",
      emotion: "curiosity",
    },
    {
      keywords: ["help", "assist", "support", "guide"],
      response: "I'm here to help you organize and remember information. Just let me know what you need.",
      emotion: "analytical",
    },
    {
      keywords: ["problem", "issue", "error", "wrong", "mistake"],
      response: "I see there might be an issue. Let's work together to find a solution.",
      emotion: "concern",
    },
    {
      keywords: ["thanks", "thank", "appreciate", "grateful"],
      response: "Thanks! I'm learning from our conversations to better assist you in the future.",
      emotion: "joy",
    },
  ]

  const defaultResponse = {
    response: "I've thought about what you said. Would you like to explore this topic more deeply?",
    emotion: "curiosity",
  }

  const sendMessage = async (content: string) => {
    // Add user message
    const userMessage: Message = {
      id: `user_${Date.now()}`,
      content,
      sender: "user",
      sentiment: "neutral",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setIsProcessing(true)

    // Simulate AI processing
    await new Promise((resolve) => setTimeout(resolve, 1500 + Math.random() * 1000))

    // Generate AI response
    let responseObj = defaultResponse

    // Check for keyword matches
    for (const mockResponse of mockResponses) {
      if (mockResponse.keywords.some((keyword) => content.toLowerCase().includes(keyword))) {
        responseObj = mockResponse
        break
      }
    }

    setCurrentEmotion(responseObj.emotion)

    const aiMessage: Message = {
      id: `ai_${Date.now()}`,
      content: responseObj.response,
      sender: "ai",
      sentiment: "neutral",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, aiMessage])
    setIsProcessing(false)
  }

  return { messages, sendMessage, isProcessing, currentEmotion }
}
