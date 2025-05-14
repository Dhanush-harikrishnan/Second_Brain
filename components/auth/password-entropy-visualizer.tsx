"use client"

import { useRef } from "react"
import { motion } from "framer-motion"

interface PasswordEntropyVisualizerProps {
  password: string
}

export default function PasswordEntropyVisualizer({ password }: PasswordEntropyVisualizerProps) {
  const svgRef = useRef<SVGSVGElement>(null)

  // Calculate password entropy (simplified)
  const calculateEntropy = (pwd: string) => {
    if (!pwd) return 0

    const length = pwd.length
    let poolSize = 0

    if (/[a-z]/.test(pwd)) poolSize += 26
    if (/[A-Z]/.test(pwd)) poolSize += 26
    if (/[0-9]/.test(pwd)) poolSize += 10
    if (/[^a-zA-Z0-9]/.test(pwd)) poolSize += 33

    const entropy = Math.log2(Math.pow(poolSize, length))
    return Math.min(entropy, 100) // Cap at 100 for visualization
  }

  const entropy = calculateEntropy(password)
  const strength = entropy / 100 // Normalized 0-1

  // Generate wave path
  const generateWavePath = (strength: number) => {
    const width = 320
    const height = 30
    const amplitude = 10 * strength
    const frequency = 0.05 + strength * 0.1

    let path = `M 0 ${height / 2}`

    for (let x = 0; x <= width; x += 5) {
      const y = height / 2 + Math.sin(x * frequency) * amplitude * (1 + Math.random() * 0.2)
      path += ` L ${x} ${y}`
    }

    return path
  }

  // Get color based on strength
  const getStrengthColor = (strength: number) => {
    if (strength < 0.3) return "#ef4444" // Red
    if (strength < 0.6) return "#f59e0b" // Amber
    if (strength < 0.8) return "#10b981" // Emerald
    return "#6366f1" // Indigo
  }

  const wavePath = generateWavePath(strength)
  const color = getStrengthColor(strength)

  return (
    <div className="mt-1 h-8 w-full overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: password ? 1 : 0, y: password ? 0 : 10 }}
        transition={{ duration: 0.3 }}
      >
        <svg ref={svgRef} width="100%" height="30" viewBox="0 0 320 30">
          <motion.path
            d={wavePath}
            fill="none"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{
              pathLength: strength,
              opacity: password ? 1 : 0,
            }}
            transition={{ duration: 0.5 }}
          />
          <motion.path
            d={wavePath}
            fill="none"
            stroke={color}
            strokeWidth="1"
            strokeLinecap="round"
            strokeOpacity="0.5"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{
              pathLength: strength,
              opacity: password ? 0.5 : 0,
            }}
            transition={{ duration: 0.5, delay: 0.1 }}
          />
        </svg>
        <motion.div className="mt-1 text-xs" initial={{ opacity: 0 }} animate={{ opacity: password ? 1 : 0 }}>
          {strength < 0.3 && <span className="text-red-500">Weak password</span>}
          {strength >= 0.3 && strength < 0.6 && <span className="text-amber-500">Moderate password</span>}
          {strength >= 0.6 && strength < 0.8 && <span className="text-emerald-500">Strong password</span>}
          {strength >= 0.8 && <span className="text-indigo-500">Very strong password</span>}
        </motion.div>
      </motion.div>
    </div>
  )
}
