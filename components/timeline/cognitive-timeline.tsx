"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion"
import { Button } from "@/components/ui/button"
import { PlusCircle, LogOut } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import MemoryCard from "./memory-card"
import DNAConnector from "./dna-connector"
import { useUser, SignOutButton } from "@clerk/nextjs"
import { useMemories } from "@/hooks/use-memories"
import AIIntegration from "../ai/ai-integration"
import MemoryComposer from "./memory-composer"

export default function CognitiveTimeline() {
  const [showComposer, setShowComposer] = useState(false)
  const { user } = useUser()
  const { toast } = useToast()
  const { memories, loading, error, fetchMemories } = useMemories({
    onError: (error) => {
      toast({
        title: "Error fetching memories",
        description: error.message,
        variant: "destructive",
      })
    },
  })
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchMemories()
  }, [fetchMemories])

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  })

  const opacity = useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [0.3, 1, 1, 0.3])

  // Handle scroll events
  const onScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement
    const bottom = target.scrollHeight - target.scrollTop === target.clientHeight
    if (bottom && !loading) {
      // In the future, you can implement pagination here
      // For now, we're loading all memories at once
    }
  }

  return (
    <motion.div
      className="relative flex h-screen w-full flex-col overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <header className="relative z-10 flex items-center justify-between bg-black/50 p-4 backdrop-blur-lg">
        <motion.h1
          className="text-2xl font-bold text-white"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Second Brain
        </motion.h1>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowComposer(true)}
            className="text-white hover:bg-white/10"
          >
            <PlusCircle className="h-5 w-5" />
          </Button>

          <SignOutButton>
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
              <LogOut className="h-5 w-5" />
            </Button>
          </SignOutButton>
        </div>
      </header>

      <div className="relative flex flex-1">
        <motion.div ref={containerRef} className="flex-1 overflow-y-auto" style={{ opacity }} onScroll={onScroll}>
          <div className="relative mx-auto max-w-4xl p-6 pt-10">
            {error && (
              <div className="mb-8 rounded-lg bg-red-500/10 p-4 text-red-500">
                <p>Error loading memories: {error.message}</p>
                <Button 
                  variant="outline" 
                  className="mt-2 border-red-500/20 text-red-500 hover:bg-red-500/10"
                  onClick={() => fetchMemories()}
                >
                  Retry
                </Button>
              </div>
            )}
            
            <div className="relative">
              {memories.length === 0 && !loading ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <p className="mb-4 text-center text-lg text-gray-400">No memories found. Start by creating your first memory.</p>
                  <Button onClick={() => setShowComposer(true)} className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white">
                    Create Memory
                  </Button>
                </div>
              ) : (
                memories.map((memory, index) => (
                  <div key={memory.id} className="relative mb-16">
                    <MemoryCard memory={memory} index={index} />
                    {index < memories.length - 1 && <DNAConnector />}
                  </div>
                ))
              )}

              {loading && (
                <div className="flex justify-center py-10">
                  <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-t-2 border-white"></div>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        <div className="hidden w-80 border-l border-white/10 bg-black/30 p-4 backdrop-blur-lg lg:block">
          <AIIntegration />
        </div>
      </div>

      <AnimatePresence>
        {showComposer && (
          <MemoryComposer 
            onClose={() => setShowComposer(false)} 
            onMemoryCreated={() => fetchMemories()} 
          />
        )}
      </AnimatePresence>
    </motion.div>
  )
}
