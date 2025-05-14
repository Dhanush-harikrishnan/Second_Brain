"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"

export default function NeuralLoader() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationFrameId: number
    let neurons: {
      x: number
      y: number
      connections: number[]
      pulseState: number
      pulseDirection: number
      pulseSpeed: number
      size: number
      color: string
    }[] = []

    let loadingProgress = 0

    // Initialize neurons
    const initNeurons = () => {
      neurons = []
      const numNeurons = 30
      const colors = [
        "rgba(139, 92, 246, 0.8)", // Purple
        "rgba(79, 70, 229, 0.8)", // Indigo
        "rgba(59, 130, 246, 0.8)", // Blue
        "rgba(236, 72, 153, 0.8)", // Pink
      ]

      for (let i = 0; i < numNeurons; i++) {
        neurons.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          connections: [],
          pulseState: Math.random(),
          pulseDirection: Math.random() > 0.5 ? 1 : -1,
          pulseSpeed: 0.01 + Math.random() * 0.02,
          size: 3 + Math.random() * 5,
          color: colors[Math.floor(Math.random() * colors.length)],
        })
      }

      // Create connections
      for (let i = 0; i < neurons.length; i++) {
        const numConnections = Math.floor(Math.random() * 3) + 1
        for (let j = 0; j < numConnections; j++) {
          let target
          do {
            target = Math.floor(Math.random() * neurons.length)
          } while (target === i)

          neurons[i].connections.push(target)
        }
      }
    }

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Update loading progress
      loadingProgress += 0.005
      if (loadingProgress > 1) loadingProgress = 1

      // Draw neurons and connections
      for (let i = 0; i < neurons.length; i++) {
        const neuron = neurons[i]

        // Update pulse state
        neuron.pulseState += neuron.pulseDirection * neuron.pulseSpeed
        if (neuron.pulseState > 1 || neuron.pulseState < 0) {
          neuron.pulseDirection *= -1
        }

        // Draw connections
        for (const targetIdx of neuron.connections) {
          const target = neurons[targetIdx]

          // Only draw connections for neurons that have been "activated"
          if (i / neurons.length <= loadingProgress) {
            const gradient = ctx.createLinearGradient(neuron.x, neuron.y, target.x, target.y)
            gradient.addColorStop(0, neuron.color)
            gradient.addColorStop(1, target.color)

            ctx.beginPath()
            ctx.moveTo(neuron.x, neuron.y)
            ctx.lineTo(target.x, target.y)
            ctx.strokeStyle = gradient
            ctx.lineWidth = 1
            ctx.globalAlpha = 0.2 + neuron.pulseState * 0.3
            ctx.stroke()
            ctx.globalAlpha = 1
          }
        }

        // Draw neuron
        if (i / neurons.length <= loadingProgress) {
          ctx.beginPath()
          ctx.arc(neuron.x, neuron.y, neuron.size * (0.8 + neuron.pulseState * 0.4), 0, Math.PI * 2)
          ctx.fillStyle = neuron.color
          ctx.fill()

          // Draw halo
          ctx.beginPath()
          ctx.arc(neuron.x, neuron.y, neuron.size * (1.5 + neuron.pulseState * 0.8), 0, Math.PI * 2)
          const gradient = ctx.createRadialGradient(
            neuron.x,
            neuron.y,
            neuron.size,
            neuron.x,
            neuron.y,
            neuron.size * 2.5,
          )
          gradient.addColorStop(0, neuron.color)
          gradient.addColorStop(1, "rgba(0, 0, 0, 0)")
          ctx.fillStyle = gradient
          ctx.globalAlpha = 0.3 * neuron.pulseState
          ctx.fill()
          ctx.globalAlpha = 1
        }
      }

      animationFrameId = requestAnimationFrame(animate)
    }

    initNeurons()
    animate()

    return () => {
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-black">
      <div className="relative">
        <canvas ref={canvasRef} width={800} height={600} className="h-[600px] w-[800px]" />

        <motion.div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <h1 className="mb-2 text-4xl font-bold text-white">Second Brain</h1>
          <p className="text-lg text-gray-400">Loading your memories...</p>
        </motion.div>
      </div>
    </div>
  )
}
