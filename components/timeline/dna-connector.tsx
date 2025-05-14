"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"

export default function DNAConnector() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationFrameId: number
    let time = 0

    const drawDNAHelix = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const width = canvas.width
      const height = canvas.height
      const centerX = width / 2

      // DNA parameters
      const amplitude = width * 0.2 // Width of the helix
      const frequency = 0.02 // How tight the helix is
      const speed = 0.03 // Animation speed
      const rungs = 5 // Number of connecting rungs

      // Draw the two strands
      ctx.lineWidth = 2

      // First strand
      ctx.beginPath()
      ctx.strokeStyle = "rgba(139, 92, 246, 0.6)" // Purple

      for (let y = 0; y < height; y += 2) {
        const x = centerX + Math.sin(y * frequency + time * speed) * amplitude
        ctx.lineTo(x, y)
      }

      ctx.stroke()

      // Second strand
      ctx.beginPath()
      ctx.strokeStyle = "rgba(79, 70, 229, 0.6)" // Indigo

      for (let y = 0; y < height; y += 2) {
        const x = centerX + Math.sin(y * frequency + time * speed + Math.PI) * amplitude
        ctx.lineTo(x, y)
      }

      ctx.stroke()

      // Draw connecting rungs
      ctx.strokeStyle = "rgba(167, 139, 250, 0.4)" // Lighter purple
      ctx.lineWidth = 1

      for (let i = 0; i < rungs; i++) {
        const y = (height / (rungs + 1)) * (i + 1)
        const x1 = centerX + Math.sin(y * frequency + time * speed) * amplitude
        const x2 = centerX + Math.sin(y * frequency + time * speed + Math.PI) * amplitude

        ctx.beginPath()
        ctx.moveTo(x1, y)
        ctx.lineTo(x2, y)
        ctx.stroke()

        // Small circles at the connection points
        ctx.fillStyle = "rgba(167, 139, 250, 0.8)"
        ctx.beginPath()
        ctx.arc(x1, y, 2, 0, Math.PI * 2)
        ctx.fill()

        ctx.fillStyle = "rgba(79, 70, 229, 0.8)"
        ctx.beginPath()
        ctx.arc(x2, y, 2, 0, Math.PI * 2)
        ctx.fill()
      }

      time += 0.02
      animationFrameId = requestAnimationFrame(drawDNAHelix)
    }

    drawDNAHelix()

    return () => {
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <motion.div
      className="mx-auto h-32 w-full max-w-[100px]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
    >
      <canvas ref={canvasRef} width={100} height={128} className="h-full w-full" />
    </motion.div>
  )
}
