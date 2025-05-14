"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { useAuth } from "@/hooks/use-auth"
import { SignInButton } from "@/components/auth/sign-in-button"
import { Button } from "@/components/ui/button"
import NeuralLoader from "@/components/ui/neural-loader"
import { BrainCircuit, BarChart3, MessageCircle, Library, Sparkles } from "lucide-react"

export default function Home() {
  const { user } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [isMounted, setIsMounted] = useState(false)
  
  useEffect(() => {
    setIsMounted(true)
    
    // Simulate app initialization
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1500)
    
    return () => clearTimeout(timer)
  }, [])

  // Handle authentication redirect on client-side only
  useEffect(() => {
    if (isMounted && !loading && user) {
      router.push("/dashboard")
    }
  }, [user, router, isMounted, loading])

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-black">
        <NeuralLoader />
        <p className="mt-6 text-center text-xl text-white">Initializing Brain Interface...</p>
      </div>
    )
  }

  // Only show landing page for non-authenticated users
  if (!user) {
    return (
      <div className="min-h-screen bg-black">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/30 via-purple-800/20 to-fuchsia-900/30" />
          <div className="absolute inset-0 backdrop-blur-[100px]" style={{ backdropFilter: "blur(100px)" }} />
        </div>

        <div className="relative z-10">
          <header className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BrainCircuit className="h-8 w-8 text-purple-400" />
                <h1 className="text-2xl font-bold text-white">NeuroFluent</h1>
              </div>
              <SignInButton />
            </div>
          </header>

          <main className="container mx-auto px-4 py-12">
            <div className="mb-16 text-center">
              <motion.h2 
                className="text-4xl md:text-6xl font-bold text-white mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                Your Personal Memory Nexus
              </motion.h2>
              <motion.p 
                className="text-xl text-gray-300 max-w-3xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                Store, organize, and access your memories, ideas, and knowledge with AI assistance.
              </motion.p>
              
              <motion.div 
                className="mt-10 flex flex-wrap justify-center gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <SignInButton size="lg" />
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-purple-600/50 text-purple-400 hover:bg-purple-600/20"
                  onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Learn More
                </Button>
              </motion.div>
            </div>
            
            <motion.div 
              id="features"
              className="my-24 grid gap-8 md:grid-cols-2 lg:grid-cols-4"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <div className="rounded-xl border border-white/10 bg-black/40 p-6 backdrop-blur-lg">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-indigo-600">
                  <Library className="h-6 w-6 text-white" />
                </div>
                <h3 className="mb-2 text-xl font-bold text-white">Memory Repository</h3>
                <p className="text-gray-400">Store and categorize memories with rich context and relationships.</p>
              </div>
              
              <div className="rounded-xl border border-white/10 bg-black/40 p-6 backdrop-blur-lg">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-indigo-600">
                  <MessageCircle className="h-6 w-6 text-white" />
                </div>
                <h3 className="mb-2 text-xl font-bold text-white">AI Assistant</h3>
                <p className="text-gray-400">Chat with your AI assistant to retrieve and connect memories.</p>
              </div>
              
              <div className="rounded-xl border border-white/10 bg-black/40 p-6 backdrop-blur-lg">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-indigo-600">
                  <BarChart3 className="h-6 w-6 text-white" />
                </div>
                <h3 className="mb-2 text-xl font-bold text-white">Insights & Analytics</h3>
                <p className="text-gray-400">Visualize patterns and trends in your memory network.</p>
              </div>
              
              <div className="rounded-xl border border-white/10 bg-black/40 p-6 backdrop-blur-lg">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-indigo-600">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <h3 className="mb-2 text-xl font-bold text-white">Smart Connections</h3>
                <p className="text-gray-400">AI automatically links related memories and generates insights.</p>
              </div>
            </motion.div>
            
            <motion.div 
              className="my-24 overflow-hidden rounded-2xl border border-white/10 bg-black/40 backdrop-blur-lg"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <div className="grid md:grid-cols-2">
                <div className="p-8 md:p-12">
                  <h2 className="mb-6 text-3xl font-bold text-white">A Second Brain for Your Thoughts</h2>
                  <p className="mb-8 text-gray-300">
                    NeuroFluent helps you capture ideas, organize knowledge, and make connections you might otherwise miss. 
                    With AI-powered assistance, you can retrieve exactly what you need, when you need it.
                  </p>
                  <ul className="space-y-4">
                    {[
                      "Secure and private memory storage",
                      "Natural language interface",
                      "Cross-linking between related concepts",
                      "Powerful search and filtering",
                      "Custom categorization and tagging"
                    ].map((feature, i) => (
                      <li key={i} className="flex items-center">
                        <div className="mr-3 flex h-6 w-6 items-center justify-center rounded-full bg-purple-600">
                          <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-white">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-gradient-to-br from-purple-900 to-indigo-900 p-8 flex items-center justify-center">
                  <div className="relative h-full w-full">
                    <div className="absolute h-32 w-32 rounded-full bg-purple-600/30 blur-xl" style={{ top: '20%', left: '30%' }} />
                    <div className="absolute h-48 w-48 rounded-full bg-indigo-600/30 blur-xl" style={{ bottom: '15%', right: '25%' }} />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <BrainCircuit className="h-32 w-32 text-white opacity-80" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              className="my-24 text-center"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
            >
              <h2 className="mb-12 text-3xl font-bold text-white">Ready to Enhance Your Memory?</h2>
              <SignInButton size="lg" />
            </motion.div>
          </main>

          <footer className="border-t border-white/10 bg-black/40 py-8">
            <div className="container mx-auto px-4">
              <div className="flex flex-col md:flex-row items-center justify-between">
                <div className="flex items-center gap-2 mb-4 md:mb-0">
                  <BrainCircuit className="h-6 w-6 text-purple-400" />
                  <h2 className="text-xl font-bold text-white">NeuroFluent</h2>
                </div>
                <p className="text-gray-400">© 2023 NeuroFluent Memory Nexus. All rights reserved.</p>
              </div>
            </div>
          </footer>
        </div>
      </div>
    )
  }

  // User is authenticated and will be redirected, show loading
  return (
    <div className="flex h-screen w-full items-center justify-center bg-black flex-col">
      <NeuralLoader />
      <p className="mt-6 text-center text-xl text-white">Redirecting to Dashboard...</p>
    </div>
  )
}
