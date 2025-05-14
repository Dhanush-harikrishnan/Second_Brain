"use client"

import { useEffect, useRef } from "react"
import { useSpring, animated } from "@react-spring/web"

interface MetaballConnectorProps {
  active: boolean
}

export default function MetaballConnector({ active }: MetaballConnectorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const springs = useSpring({
    opacity: active ? 1 : 0,
    scale: active ? 1 : 0.8,
    config: { mass: 1, tension: 280, friction: 60 },
  })

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationFrameId: number
    let particles: { x: number; y: number; vx: number; vy: number; radius: number }[] = []

    const initParticles = () => {
      particles = []
      for (let i = 0; i < 5; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          radius: 3 + Math.random() * 3,
        })
      }
    }

    const drawMetaballs = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      if (!active) return

      // Update particle positions
      particles.forEach((p) => {
        p.x += p.vx
        p.y += p.vy

        // Bounce off walls
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1
      })

      // Draw metaballs
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0)
      gradient.addColorStop(0, "rgba(167, 139, 250, 0.5)")
      gradient.addColorStop(1, "rgba(139, 92, 246, 0.5)")

      ctx.fillStyle = gradient

      // Draw each particle
      particles.forEach((p) => {
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fill()
      })

      // Connect particles with lines
      ctx.strokeStyle = "rgba(139, 92, 246, 0.3)"
      ctx.lineWidth = 1

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 50) {
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.stroke()
          }
        }
      }
    }

    const animate = () => {
      drawMetaballs()
      animationFrameId = requestAnimationFrame(animate)
    }

    initParticles()
    animate()

    return () => {
      cancelAnimationFrame(animationFrameId)
    }
  }, [active])

  return (
    <animated.div
      style={{
        ...springs,
        position: "absolute",
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        pointerEvents: "none",
      }}
    >
      <canvas ref={canvasRef} width={300} height={40} className="absolute inset-0 h-full w-full" />
    </animated.div>
  )
}
