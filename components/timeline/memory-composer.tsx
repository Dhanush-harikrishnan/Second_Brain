"use client"

import type React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import EmotionParticleCloud from "../effects/emotion-particle-cloud"
import EmojiConstellation from "../effects/emoji-constellation"
import { useMemories } from "@/hooks/use-memories"

interface MemoryComposerProps {
  onClose: () => void
  onMemoryCreated?: () => void
}

export default function MemoryComposer({ onClose, onMemoryCreated }: MemoryComposerProps) {
  const { toast } = useToast()
  const { createMemory, loading } = useMemories({
    onSuccess: () => {
      toast({
        title: "Memory saved",
        description: "Your memory has been successfully saved.",
      })
      onMemoryCreated?.()
      onClose()
    },
    onError: (error) => {
      toast({
        title: "Error saving memory",
        description: error.message,
        variant: "destructive",
      })
    },
  })

  const [memory, setMemory] = useState({
    title: "",
    content: "",
    category: "thought",
    tags: "",
  })

  const [currentEmotion, setCurrentEmotion] = useState("neutral")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setMemory({ ...memory, [name]: value })

    // Detect emotion based on content (simplified)
    if (name === "content") {
      const lowerContent = value.toLowerCase()
      if (lowerContent.includes("happy") || lowerContent.includes("joy") || lowerContent.includes("excited")) {
        setCurrentEmotion("joy")
      } else if (
        lowerContent.includes("sad") ||
        lowerContent.includes("unhappy") ||
        lowerContent.includes("depressed")
      ) {
        setCurrentEmotion("sadness")
      } else if (
        lowerContent.includes("angry") ||
        lowerContent.includes("mad") ||
        lowerContent.includes("frustrated")
      ) {
        setCurrentEmotion("anger")
      } else if (lowerContent.includes("fear") || lowerContent.includes("scared") || lowerContent.includes("anxious")) {
        setCurrentEmotion("fear")
      } else if (
        lowerContent.includes("surprise") ||
        lowerContent.includes("shocked") ||
        lowerContent.includes("amazed")
      ) {
        setCurrentEmotion("surprise")
      } else {
        setCurrentEmotion("neutral")
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      // Convert tags string to array
      const tagsArray = memory.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0)
      
      await createMemory({
        title: memory.title,
        content: memory.content,
        category: memory.category,
        tags: tagsArray,
      })
    } catch (error) {
      console.error("Error saving memory:", error)
    }
  }

  // Get emotion color
  const getEmotionColor = () => {
    switch (currentEmotion) {
      case "joy":
        return "from-yellow-400 to-amber-500"
      case "sadness":
        return "from-blue-400 to-indigo-500"
      case "anger":
        return "from-red-400 to-rose-500"
      case "fear":
        return "from-purple-400 to-violet-500"
      case "surprise":
        return "from-green-400 to-emerald-500"
      default:
        return "from-gray-400 to-slate-500"
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="relative w-full max-w-2xl"
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
        >
          <Card className="relative overflow-hidden border-white/10 bg-black/60 backdrop-blur-xl">
            <div className="absolute inset-0 z-0">
              <div className={`absolute inset-0 bg-gradient-to-br ${getEmotionColor()} opacity-10`} />
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="absolute right-4 top-4 z-10 text-white hover:bg-white/10"
            >
              <X className="h-5 w-5" />
            </Button>

            <div className="relative z-10 p-6">
              <h2 className="mb-6 text-2xl font-bold text-white">Quantum Memory Composition</h2>

              <div className="relative mb-6 h-20">
                <EmotionParticleCloud emotion={currentEmotion} />
                <EmojiConstellation emotion={currentEmotion} />
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-sm font-medium text-gray-200">
                    Memory Title
                  </Label>
                  <Input
                    id="title"
                    name="title"
                    value={memory.title}
                    onChange={handleChange}
                    className="border-gray-800 bg-black/50 text-white placeholder:text-gray-500"
                    placeholder="Enter memory title"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content" className="text-sm font-medium text-gray-200">
                    Memory Content
                  </Label>
                  <Textarea
                    id="content"
                    name="content"
                    value={memory.content}
                    onChange={handleChange}
                    className="min-h-[120px] border-gray-800 bg-black/50 text-white placeholder:text-gray-500"
                    placeholder="Describe your memory..."
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category" className="text-sm font-medium text-gray-200">
                      Category
                    </Label>
                    <select
                      id="category"
                      name="category"
                      value={memory.category}
                      onChange={(e) => setMemory({ ...memory, category: e.target.value })}
                      className="w-full rounded-md border border-gray-800 bg-black/50 px-3 py-2 text-white placeholder:text-gray-500"
                      required
                    >
                      <option value="thought">Thought</option>
                      <option value="experience">Experience</option>
                      <option value="idea">Idea</option>
                      <option value="dream">Dream</option>
                      <option value="goal">Goal</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tags" className="text-sm font-medium text-gray-200">
                      Tags (comma separated)
                    </Label>
                    <Input
                      id="tags"
                      name="tags"
                      value={memory.tags}
                      onChange={handleChange}
                      className="border-gray-800 bg-black/50 text-white placeholder:text-gray-500"
                      placeholder="e.g. personal, work, inspiration"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                    className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className={`bg-gradient-to-r ${getEmotionColor()} text-white transition-all hover:opacity-90`}
                    disabled={loading}
                  >
                    {loading ? "Saving..." : "Save Memory"}
                  </Button>
                </div>
              </form>
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
