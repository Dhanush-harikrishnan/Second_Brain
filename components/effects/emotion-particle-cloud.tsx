"use client"

import { useEffect, useRef } from "react"

interface EmotionParticleCloudProps {
  emotion: string
}

export default function EmotionParticleCloud({ emotion }: EmotionParticleCloudProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Get emotion color
  const getEmotionColor = () => {
    switch (emotion) {
      case "joy":
        return { r: 250, g: 204, b: 21 } // Yellow
      case "sadness":
        return { r: 96, g: 165, b: 250 } // Blue
      case "anger":
        return { r: 248, g: 113, b: 113 } // Red
      case "fear":
        return { r: 167, g: 139, b: 250 } // Purple
      case "surprise":
        return { r: 52, g: 211, b: 153 } // Green
      default:
        return { r: 156, g: 163, b: 175 } // Gray
    }
  }

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationFrameId: number
    const particles: {
      x: number
      y: number
      radius: number
      vx: number
      vy: number
      alpha: number
    }[] = []

    const color = getEmotionColor()

    // Initialize particles
    const initParticles = () => {
      particles.length = 0

      for (let i = 0; i < 50; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 3 + 1,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          alpha: Math.random() * 0.5 + 0.2,
        })
      }
    }

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Update and draw particles
      particles.forEach((p) => {
        p.x += p.vx
        p.y += p.vy

        // Bounce off walls
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1

        // Draw particle
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${p.alpha})`
        ctx.fill()
      })

      // Draw connections
      ctx.strokeStyle = `rgba(${color.r}, ${color.g}, ${color.b}, 0.1)`
      ctx.lineWidth = 0.5

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

      animationFrameId = requestAnimationFrame(animate)
    }

    initParticles()
    animate()

    return () => {
      cancelAnimationFrame(animationFrameId)
    }
  }, [emotion])

  return <canvas ref={canvasRef} width={800} height={80} className="absolute inset-0 h-full w-full" />
}
