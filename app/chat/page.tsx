"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"
import { MessageSquare, Send, Sparkles } from "lucide-react"
import AppNavigation, { MobileNavigation } from "@/components/ui/navigation"
import { useMemories } from "@/hooks/use-memories"
import { motion, AnimatePresence } from "framer-motion"

type Message = {
  role: "user" | "assistant"
  content: string
}

export default function Chat() {
  const { user } = useAuth()
  const router = useRouter()
  const { memories, fetchMemories } = useMemories()
  const [isMounted, setIsMounted] = useState(false)
  const [inputMessage, setInputMessage] = useState("")
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: "assistant", 
      content: "Hello! I'm your memory assistant. How can I help you today? I can recall your memories, analyze patterns, or provide insights based on your stored information." 
    }
  ])
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Handle authentication redirect on client-side only
  useEffect(() => {
    if (isMounted && !user) {
      router.push("/")
    } else if (isMounted && user) {
      fetchMemories()
    }
  }, [user, router, isMounted, fetchMemories])

  // Scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Return early if not mounted or user not authenticated
  if (!isMounted || !user) {
    return null
  }

  const handleSendMessage = async () => {
    if (inputMessage.trim() === "" || isLoading) return
    
    // Add user message to chat
    const userMessage = { role: "user" as const, content: inputMessage }
    setMessages(prev => [...prev, userMessage])
    setInputMessage("")
    setIsLoading(true)

    try {
      // Format all memories as context for the AI
      const memoryContext = memories.map(memory => {
        return `Title: ${memory.title}\nCategory: ${memory.category}\nContent: ${memory.content}\nTags: ${memory.tags.join(", ")}\nDate: ${new Date(memory.timestamp).toLocaleDateString()}\n\n`
      }).join("");

      // Create the prompt with memory context
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          memoryContext: memoryContext
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Unknown error" }));
        const errorMessage = errorData.error || `Error: ${response.status}`;
        console.error("Chat API error:", errorMessage);
        throw new Error(errorMessage);
      }

      const data = await response.json()
      
      // Add AI response to chat
      setMessages(prev => [...prev, { role: "assistant", content: data.response }])
    } catch (error) {
      console.error("Error in chat:", error)
      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: "I'm sorry, I encountered an error while processing your request. Please try again later." 
      }])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/30 via-purple-800/20 to-fuchsia-900/30" />
        <div className="absolute inset-0 backdrop-blur-[100px]" style={{ backdropFilter: "blur(100px)" }} />
      </div>

      <div className="relative z-10">
        <AppNavigation />

        <main className="container mx-auto px-4 py-8 pt-24 pb-20 md:pb-8">
          <motion.div 
            className="mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold text-white">Memory Assistant</h2>
            <p className="text-gray-400">Chat with your AI memory assistant powered by Gemini</p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="border-white/10 bg-black/50 backdrop-blur-lg">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-purple-400" />
                  Gemini Memory Assistant
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[60vh] flex flex-col">
                  <div className="flex-1 space-y-4 mb-4 overflow-y-auto pr-2">
                    <AnimatePresence>
                      {messages.map((message, index) => (
                        <motion.div 
                          key={index} 
                          className={`flex items-start gap-3 ${message.role === "assistant" ? "" : "justify-end"}`}
                          initial={{ opacity: 0, y: 20, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          transition={{ duration: 0.3, delay: index * 0.1 % 0.5 }}
                        >
                          {message.role === "assistant" && (
                            <motion.div 
                              className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-center text-white"
                              initial={{ scale: 0, rotate: -180 }}
                              animate={{ scale: 1, rotate: 0 }}
                              transition={{ duration: 0.3, type: "spring" }}
                            >
                              AI
                            </motion.div>
                          )}
                          
                          <motion.div 
                            className={`rounded-lg p-3 text-white max-w-[80%] ${
                              message.role === "assistant" 
                                ? "bg-gray-800/80" 
                                : "bg-purple-600/80"
                            }`}
                            initial={{ x: message.role === "assistant" ? -20 : 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ duration: 0.3 }}
                          >
                            <p className="whitespace-pre-wrap">{message.content}</p>
                          </motion.div>
                          
                          {message.role === "user" && (
                            <motion.div 
                              className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-white"
                              initial={{ scale: 0, rotate: 180 }}
                              animate={{ scale: 1, rotate: 0 }}
                              transition={{ duration: 0.3, type: "spring" }}
                            >
                              {user.emailAddresses?.[0]?.emailAddress?.[0]?.toUpperCase() || "U"}
                            </motion.div>
                          )}
                        </motion.div>
                      ))}
                    </AnimatePresence>
                    
                    {isLoading && (
                      <motion.div 
                        className="flex items-start gap-3"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-center text-white">
                          AI
                        </div>
                        <div className="rounded-lg bg-gray-800/80 p-3 text-white">
                          <div className="flex space-x-2 items-center">
                            <motion.div 
                              className="w-2 h-2 rounded-full bg-purple-400"
                              animate={{ scale: [1, 1.5, 1] }}
                              transition={{ duration: 1, repeat: Infinity }}
                            />
                            <motion.div 
                              className="w-2 h-2 rounded-full bg-purple-400"
                              animate={{ scale: [1, 1.5, 1] }}
                              transition={{ duration: 1, repeat: Infinity, delay: 0.3 }}
                            />
                            <motion.div 
                              className="w-2 h-2 rounded-full bg-purple-400"
                              animate={{ scale: [1, 1.5, 1] }}
                              transition={{ duration: 1, repeat: Infinity, delay: 0.6 }}
                            />
                          </div>
                        </div>
                      </motion.div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                  
                  <motion.div 
                    className="flex gap-2 mt-auto"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  >
                    <Input 
                      type="text" 
                      placeholder="Ask about your memories..." 
                      className="border-white/10 bg-black/50 text-white placeholder:text-gray-500"
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && inputMessage.trim() !== '' && !isLoading) {
                          handleSendMessage()
                        }
                      }}
                      disabled={isLoading}
                    />
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button 
                        className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700"
                        onClick={handleSendMessage}
                        disabled={inputMessage.trim() === '' || isLoading}
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </motion.div>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </main>

        <MobileNavigation />
      </div>
    </div>
  )
}
