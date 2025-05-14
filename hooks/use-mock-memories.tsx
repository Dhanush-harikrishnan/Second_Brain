"use client"

import { useState, useEffect } from "react"
import type { Memory } from "@/types/memory"

export function useMockMemories() {
  const [memories, setMemories] = useState<Memory[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)

  const generateMockMemories = (page: number, perPage = 5) => {
    const mockMemories: Memory[] = []

    const titles = [
      "Neural Breakthrough",
      "Quantum Thought Pattern",
      "Synaptic Connection",
      "Cognitive Resonance",
      "Memory Crystallization",
      "Consciousness Expansion",
      "Temporal Insight",
      "Neuroplastic Shift",
      "Cognitive Harmony",
      "Mnemonic Encoding",
    ]

    const contents = [
      "Today I discovered a new way to visualize complex data structures through neural mapping. The patterns emerged organically when I stopped trying to force a specific framework.",
      "The quantum nature of consciousness might be more accessible than we think. When I meditated today, I experienced a moment of clarity that transcended linear thinking.",
      "Connected two seemingly unrelated concepts today: fractal mathematics and linguistic patterns. There's a hidden symmetry in how we structure language that mirrors natural patterns.",
      "Emotional states have a direct impact on problem-solving abilities. When I approached the challenge with curiosity instead of frustration, the solution appeared almost instantly.",
      "Memory isn't just about retention, it's about connection. Today I realized that the value of a memory lies in how it links to other experiences and knowledge.",
      "The boundaries between disciplines are artificial constructs. Today's insight came from applying musical theory to data visualization, creating a harmonic representation of complex datasets.",
      "Time perception shifts dramatically when fully engaged in creative work. Four hours passed like minutes during today's deep work session on the neural interface design.",
      "Our brains physically rewire based on consistent thought patterns. I'm intentionally practicing optimistic scenario planning to strengthen those neural pathways.",
      "Found a state of flow today where intuition and analysis worked in perfect harmony. Problems that seemed complex became elegantly simple when approached from this balanced state.",
      "Encoded a complex concept using spatial memory techniques. By associating key points with locations in an imagined space, recall became nearly effortless.",
    ]

    const categories = ["thought", "experience", "idea", "dream", "goal"]

    const tagSets = [
      ["neural", "breakthrough", "insight"],
      ["quantum", "consciousness", "meditation"],
      ["connection", "pattern", "discovery"],
      ["emotion", "problem-solving", "clarity"],
      ["memory", "connection", "value"],
      ["interdisciplinary", "creativity", "visualization"],
      ["time", "perception", "flow"],
      ["neuroplasticity", "practice", "optimization"],
      ["flow", "intuition", "harmony"],
      ["encoding", "technique", "recall"],
    ]

    const startIdx = (page - 1) * perPage
    
    // Fixed dates for each memory to avoid hydration mismatch
    const fixedDates = [
      new Date("2023-01-15"),
      new Date("2023-02-21"),
      new Date("2023-03-10"),
      new Date("2023-04-05"),
      new Date("2023-05-18"),
      new Date("2023-06-22"),
      new Date("2023-07-14"),
      new Date("2023-08-30"),
      new Date("2023-09-12"),
      new Date("2023-10-25"),
    ]

    for (let i = 0; i < perPage; i++) {
      const idx = (startIdx + i) % 10

      mockMemories.push({
        id: `memory_${startIdx + i}`,
        title: titles[idx],
        content: contents[idx],
        category: categories[Math.floor((startIdx + i) % categories.length)], // Make category deterministic
        tags: tagSets[idx],
        timestamp: fixedDates[idx],
      })
    }

    return mockMemories
  }

  useEffect(() => {
    // Only run this effect on the client
    if (typeof window === 'undefined') return;
    
    setLoading(true)

    // Simulate API call
    setTimeout(() => {
      const newMemories = generateMockMemories(page)

      if (page === 1) {
        setMemories(newMemories)
      } else {
        setMemories((prev) => [...prev, ...newMemories])
      }

      setLoading(false)
    }, 1500)
  }, [page])

  const loadMore = () => {
    setPage((prev) => prev + 1)
  }

  return { memories, loading, loadMore }
}
