"use client"

import { useEffect, useRef } from "react"
import { Avatar } from "@/components/ui/avatar"

interface SynapseAvatarProps {
  emotion: string
}

export default function SynapseAvatar({ emotion }: SynapseAvatarProps) {
  const svgRef = useRef<SVGSVGElement>(null)

  // Get emotion color
  const getEmotionColor = () => {
    switch (emotion) {
      case "joy":
        return "#fbbf24"
      case "curiosity":
        return "#60a5fa"
      case "analytical":
        return "#a78bfa"
      case "concern":
        return "#f97316"
      default:
        return "#8b5cf6"
    }
  }

  useEffect(() => {
    if (!svgRef.current) return

    const svg = svgRef.current
    const width = svg.clientWidth
    const height = svg.clientHeight
    const color = getEmotionColor()

    // Clear previous content
    while (svg.firstChild) {
      svg.removeChild(svg.firstChild)
    }

    // Create neural network topology
    const numNodes = 12
    const nodes: { x: number; y: number; radius: number }[] = []

    // Create nodes
    for (let i = 0; i < numNodes; i++) {
      const angle = (i / numNodes) * Math.PI * 2
      const radius = Math.random() * 10 + 5
      const distance = Math.random() * 15 + 15

      const x = width / 2 + Math.cos(angle) * distance
      const y = height / 2 + Math.sin(angle) * distance

      nodes.push({ x, y, radius })

      const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle")
      circle.setAttribute("cx", x.toString())
      circle.setAttribute("cy", y.toString())
      circle.setAttribute("r", radius.toString())
      circle.setAttribute("fill", color)
      circle.setAttribute("opacity", (0.5 + Math.random() * 0.5).toString())

      svg.appendChild(circle)

      // Add pulse animation
      const animate = document.createElementNS("http://www.w3.org/2000/svg", "animate")
      animate.setAttribute("attributeName", "r")
      animate.setAttribute("values", `${radius};${radius * 1.2};${radius}`)
      animate.setAttribute("dur", `${1 + Math.random() * 2}s`)
      animate.setAttribute("repeatCount", "indefinite")

      circle.appendChild(animate)

      // Add opacity animation
      const animateOpacity = document.createElementNS("http://www.w3.org/2000/svg", "animate")
      animateOpacity.setAttribute("attributeName", "opacity")
      animateOpacity.setAttribute(
        "values",
        `${0.5 + Math.random() * 0.5};${0.7 + Math.random() * 0.3};${0.5 + Math.random() * 0.5}`,
      )
      animateOpacity.setAttribute("dur", `${1 + Math.random() * 2}s`)
      animateOpacity.setAttribute("repeatCount", "indefinite")

      circle.appendChild(animateOpacity)
    }

    // Connect nodes
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        if (Math.random() > 0.7) continue // Only connect some nodes

        const line = document.createElementNS("http://www.w3.org/2000/svg", "line")
        line.setAttribute("x1", nodes[i].x.toString())
        line.setAttribute("y1", nodes[i].y.toString())
        line.setAttribute("x2", nodes[j].x.toString())
        line.setAttribute("y2", nodes[j].y.toString())
        line.setAttribute("stroke", color)
        line.setAttribute("stroke-width", "1")
        line.setAttribute("opacity", "0.3")

        svg.appendChild(line)

        // Add pulse animation for lines
        const animate = document.createElementNS("http://www.w3.org/2000/svg", "animate")
        animate.setAttribute("attributeName", "opacity")
        animate.setAttribute("values", "0.1;0.5;0.1")
        animate.setAttribute("dur", `${1 + Math.random() * 3}s`)
        animate.setAttribute("repeatCount", "indefinite")

        line.appendChild(animate)
      }
    }

    // Add central node
    const centralNode = document.createElementNS("http://www.w3.org/2000/svg", "circle")
    centralNode.setAttribute("cx", (width / 2).toString())
    centralNode.setAttribute("cy", (height / 2).toString())
    centralNode.setAttribute("r", "10")
    centralNode.setAttribute("fill", color)
    centralNode.setAttribute("opacity", "0.8")

    svg.appendChild(centralNode)

    // Add pulse animation for central node
    const animate = document.createElementNS("http://www.w3.org/2000/svg", "animate")
    animate.setAttribute("attributeName", "r")
    animate.setAttribute("values", "10;12;10")
    animate.setAttribute("dur", "1.5s")
    animate.setAttribute("repeatCount", "indefinite")

    centralNode.appendChild(animate)
  }, [emotion])

  return (
    <Avatar className="h-12 w-12 overflow-hidden bg-black">
      <svg ref={svgRef} width="48" height="48" viewBox="0 0 48 48" />
    </Avatar>
  )
}
