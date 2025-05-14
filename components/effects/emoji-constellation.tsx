"use client"
import { motion } from "framer-motion"

interface EmojiConstellationProps {
  emotion: string
}

export default function EmojiConstellation({ emotion }: EmojiConstellationProps) {
  // Get emojis based on emotion
  const getEmojis = () => {
    switch (emotion) {
      case "joy":
        return ["😊", "😄", "🎉", "✨", "🌟"]
      case "sadness":
        return ["😢", "😔", "💧", "🌧️", "🌥️"]
      case "anger":
        return ["😠", "😡", "🔥", "💢", "⚡"]
      case "fear":
        return ["😨", "😱", "🙀", "💀", "👻"]
      case "surprise":
        return ["😲", "😮", "🎊", "🎁", "💫"]
      default:
        return ["🧠", "💭", "💡", "✨", "🔮"]
    }
  }

  const emojis = getEmojis()

  return (
    <div className="absolute inset-0 overflow-hidden">
      {emojis.map((emoji, index) => (
        <motion.div
          key={index}
          className="absolute text-xl opacity-70"
          initial={{
            x: Math.random() * 100 - 50 + 50 * index,
            y: Math.random() * 60 + 10,
            scale: 0.5,
            opacity: 0,
          }}
          animate={{
            x: Math.random() * 100 - 50 + 50 * index,
            y: Math.random() * 60 + 10,
            scale: 0.8 + Math.random() * 0.4,
            opacity: 0.3 + Math.random() * 0.5,
          }}
          transition={{
            duration: 2 + Math.random() * 2,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        >
          {emoji}
        </motion.div>
      ))}
    </div>
  )
}
