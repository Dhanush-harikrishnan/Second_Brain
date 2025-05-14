"use client"

import { useState, useRef } from "react"
import { motion } from "framer-motion"
import { useSpring, animated } from "@react-spring/web"
import { useGesture } from "@use-gesture/react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Memory } from "@/types/memory"

interface MemoryCardProps {
  memory: Memory
  index: number
}

export default function MemoryCard({ memory, index }: MemoryCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  // 3D tilt effect
  const [{ rotateX, rotateY, scale, opacity }, api] = useSpring(() => ({
    rotateX: 0,
    rotateY: 0,
    scale: 1,
    opacity: 0,
    config: { mass: 1, tension: 280, friction: 60 },
  }))

  useGesture(
    {
      onHover: ({ hovering }) => setIsHovered(!!hovering),
      onMove: ({ xy: [px, py] }) => {
        if (!cardRef.current) return
        const rect = cardRef.current.getBoundingClientRect()
        const x = px - rect.left
        const y = py - rect.top
        const centerX = rect.width / 2
        const centerY = rect.height / 2
        const rotateXValue = (y - centerY) / 30
        const rotateYValue = (centerX - x) / 30

        api.start({
          rotateX: rotateXValue,
          rotateY: rotateYValue,
          scale: 1.02,
        })
      },
      onMoveEnd: () => {
        api.start({
          rotateX: 0,
          rotateY: 0,
          scale: 1,
        })
      },
    },
    { target: cardRef },
  )

  // Animation for card appearance
  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut",
      },
    }),
  }

  return (
    <motion.div
      ref={cardRef}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      custom={index}
      whileHover={{ scale: 1.02 }}
      className="relative"
    >
      <animated.div
        style={{
          transform: "perspective(1000px)",
          rotateX,
          rotateY,
          scale,
        }}
      >
        <Card className="overflow-hidden border-white/10 bg-black/40 backdrop-blur-xl">
          <div className="relative p-6">
            <div className="absolute inset-0 z-0 bg-gradient-to-br from-violet-500/10 via-fuchsia-500/5 to-cyan-500/10 opacity-50" />

            <div className="relative z-10">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-xl font-bold text-white">{memory.title}</h3>
                <Badge className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white">{memory.category}</Badge>
              </div>

              <p className="mb-4 text-gray-300">{memory.content}</p>

              <div className="flex flex-wrap gap-2">
                {memory.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="border-white/20 text-gray-300">
                    {tag}
                  </Badge>
                ))}
              </div>

              <div className="mt-4 text-sm text-gray-400">{new Date(memory.timestamp).toLocaleString()}</div>
            </div>
          </div>
        </Card>
      </animated.div>

      {/* Memory recall glow effect */}
      <motion.div
        className="absolute inset-0 -z-10 rounded-lg bg-indigo-500/30 blur-xl"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{
          opacity: isHovered ? 0.6 : 0,
          scale: isHovered ? 1.1 : 0.8,
        }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  )
}
