"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Send } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import SynapseAvatar from "./synapse-avatar"
import { useMockAI } from "@/hooks/use-mock-ai"

interface Message {
  id: string
  content: string
  sender: "user" | "ai"
  sentiment: "neutral" | "positive" | "negative" | "curious"
  timestamp: Date
}

export default function AIIntegration() {
  const [input, setInput] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { messages, sendMessage, isProcessing, currentEmotion } = useMockAI()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim() && !isProcessing) {
      sendMessage(input)
      setInput("")
    }
  }

  // Get emotion color
  const getEmotionColor = () => {
    switch (currentEmotion) {
      case "joy":
        return "from-yellow-400 to-amber-500"
      case "curiosity":
        return "from-blue-400 to-cyan-500"
      case "analytical":
        return "from-indigo-400 to-violet-500"
      case "concern":
        return "from-orange-400 to-red-500"
      default:
        return "from-purple-400 to-indigo-500"
    }
  }

  return (
    <div className="flex h-full flex-col">
      <div className="mb-4 flex items-center">
        <SynapseAvatar emotion={currentEmotion} />
        <div className="ml-3">
          <h3 className="text-lg font-bold text-white">Gemini Quantum</h3>
          <p className="text-sm text-gray-400">Neural Assistant</p>
        </div>
      </div>

      <Card className="flex-1 overflow-hidden border-white/10 bg-black/30 backdrop-blur-sm">
        <div className="flex h-full flex-col">
          <div className="flex-1 overflow-y-auto p-4">
            <AnimatePresence initial={false}>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`mb-4 flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-lg p-3 ${
                      message.sender === "user" ? "bg-indigo-600 text-white" : "bg-gray-800 text-gray-100"
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p className="mt-1 text-right text-xs opacity-70">
                      {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </motion.div>
              ))}

              {isProcessing && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 flex justify-start"
                >
                  <div className="max-w-[85%] rounded-lg bg-gray-800 p-3 text-gray-100">
                    <div className="flex space-x-1">
                      <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400"></div>
                      <div
                        className="h-2 w-2 animate-bounce rounded-full bg-gray-400"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                      <div
                        className="h-2 w-2 animate-bounce rounded-full bg-gray-400"
                        style={{ animationDelay: "0.4s" }}
                      ></div>
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </AnimatePresence>
          </div>

          <div className="border-t border-white/10 p-3">
            <form onSubmit={handleSubmit} className="flex items-center space-x-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask your neural assistant..."
                className="border-gray-700 bg-black/30 text-white placeholder:text-gray-500"
                disabled={isProcessing}
              />
              <Button
                type="submit"
                size="icon"
                disabled={isProcessing}
                className={`bg-gradient-to-r ${getEmotionColor()} text-white transition-all hover:opacity-90`}
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      </Card>

      <div className="mt-4">
        <div className="mb-2 text-sm font-medium text-gray-300">Psychographic Analysis</div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-gray-800">
          <motion.div
            className={`h-full bg-gradient-to-r ${getEmotionColor()}`}
            initial={{ width: "0%" }}
            animate={{ width: `${Math.random() * 60 + 40}%` }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />
        </div>
        <div className="mt-2 flex justify-between text-xs text-gray-400">
          <span>Emotional Resonance</span>
          <span>Cognitive Alignment</span>
          <span>Neural Synchronicity</span>
        </div>
      </div>
    </div>
  )
}
