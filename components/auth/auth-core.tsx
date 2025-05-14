"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { useSpring, animated } from "@react-spring/web"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import PasswordEntropyVisualizer from "./password-entropy-visualizer"
import MetaballConnector from "./metaball-connector"
import { useAuth } from "@/hooks/use-auth"

export default function AuthCore() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [isLogin, setIsLogin] = useState(true)
  const { login, register } = useAuth()

  const formSpring = useSpring({
    scale: 1,
    opacity: 1,
    rotateX: 0,
    from: { scale: 0.9, opacity: 0, rotateX: 20 },
    config: { mass: 1, tension: 280, friction: 60 },
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isLogin) {
      await login(formData.email, formData.password)
    } else {
      await register(formData.email, formData.password)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <motion.div
      className="flex min-h-screen w-full items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <animated.div
        style={{
          ...formSpring,
          transformStyle: "preserve-3d",
          perspective: "1000px",
        }}
      >
        <Card className="w-[380px] overflow-hidden bg-black/40 backdrop-blur-xl">
          <div className="relative p-6">
            <div className="absolute inset-0 z-0 bg-gradient-to-br from-violet-500/10 via-fuchsia-500/5 to-cyan-500/10 opacity-50" />

            <div className="relative z-10">
              <motion.div
                className="mb-6 text-center"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <h2 className="text-2xl font-bold tracking-tight text-white">{isLogin ? "Sign In" : "Sign Up"}</h2>
                <p className="mt-2 text-sm text-gray-400">
                  {isLogin ? "Access your memories" : "Create a new account"}
                </p>
              </motion.div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-gray-200">
                    Email
                  </Label>
                  <div className="relative">
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="border-gray-800 bg-black/50 text-white placeholder:text-gray-500"
                      placeholder="your.email@example.com"
                      required
                    />
                    <MetaballConnector active={!!formData.email} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium text-gray-200">
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="border-gray-800 bg-black/50 text-white placeholder:text-gray-500"
                      placeholder="••••••••"
                      required
                    />
                    <MetaballConnector active={!!formData.password} />
                  </div>
                  <PasswordEntropyVisualizer password={formData.password} />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white transition-all hover:from-violet-500 hover:to-indigo-500"
                >
                  {isLogin ? "Sign In" : "Create Account"}
                </Button>
              </form>

              <div className="mt-6 text-center text-sm">
                <button onClick={() => setIsLogin(!isLogin)} className="text-indigo-400 hover:text-indigo-300">
                  {isLogin ? "Create a new account" : "Already have an account? Sign in"}
                </button>
              </div>
            </div>
          </div>
        </Card>
      </animated.div>
    </motion.div>
  )
}
