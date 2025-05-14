"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BrainCircuit, Home, BookOpen, MessageCircle, Settings, User, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"
import { motion } from "framer-motion"
import { useState, useEffect } from "react"

export default function AppNavigation() {
  const { logout, user } = useAuth()
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const isActive = (path: string) => {
    return pathname === path
  }

  const navItems = [
    { path: "/dashboard", label: "Dashboard", icon: Home },
    { path: "/memories", label: "Memories", icon: BookOpen },
    { path: "/chat", label: "Chat", icon: MessageCircle },
    { path: "/settings", label: "Settings", icon: Settings },
    { path: "/profile", label: "Profile", icon: User },
  ]

  return (
    <motion.header 
      className={`fixed top-0 left-0 right-0 w-full z-50 transition-all duration-300 ${
        scrolled ? 'backdrop-blur-xl bg-black/70 border-b border-white/10' : 'bg-transparent'
      }`}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <motion.div 
          className="flex items-center gap-2"
          whileHover={{ scale: 1.05 }}
        >
          <motion.div
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          >
            <BrainCircuit className="h-7 w-7 text-purple-400" />
          </motion.div>
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-400">
            NeuroFluent
          </h1>
        </motion.div>

        <nav className="hidden md:block">
          <ul className="flex space-x-8">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link href={item.path} className="relative group flex items-center gap-1">
                  <motion.span
                    className={`font-medium transition-colors duration-200 flex items-center gap-1.5 ${
                      isActive(item.path) ? 'text-purple-400' : 'text-white/80 hover:text-purple-300'
                    }`}
                    whileHover={{ y: -2 }}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </motion.span>
                  {isActive(item.path) && (
                    <motion.div
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full"
                      layoutId="navbar-indicator"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button 
            onClick={logout} 
            className="bg-gradient-to-r from-purple-600/40 to-indigo-600/40 border border-white/10 backdrop-blur-sm text-white hover:from-purple-600/60 hover:to-indigo-600/60 transition-all duration-300 flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </Button>
        </motion.div>
      </div>
    </motion.header>
  )
}

// Mobile navigation for smaller screens
export function MobileNavigation() {
  const pathname = usePathname()
  
  const isActive = (path: string) => {
    return pathname === path
  }
  
  const navItems = [
    { path: "/dashboard", label: "Dashboard", icon: Home },
    { path: "/memories", label: "Memories", icon: BookOpen },
    { path: "/chat", label: "Chat", icon: MessageCircle },
    { path: "/settings", label: "Settings", icon: Settings },
    { path: "/profile", label: "Profile", icon: User },
  ]
  
  return (
    <motion.div 
      className="fixed bottom-4 left-4 right-4 z-50 rounded-xl border border-white/10 bg-black/80 backdrop-blur-lg md:hidden overflow-hidden"
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <nav className="container mx-auto px-2">
        <ul className="flex h-16 items-center justify-between">
          {navItems.map((item) => (
            <li key={item.path} className="flex-1">
              <Link href={item.path}>
                <motion.div
                  className={`flex flex-col items-center ${isActive(item.path) ? 'text-purple-400' : 'text-gray-400'}`}
                  whileHover={{ y: -4 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className={`relative p-2 rounded-lg ${isActive(item.path) ? 'bg-purple-500/20' : 'hover:bg-white/5'}`}>
                    <item.icon className="h-5 w-5" />
                    {isActive(item.path) && (
                      <motion.div
                        className="absolute inset-0 rounded-lg bg-purple-500/10 ring-1 ring-purple-500/30"
                        layoutId="mobile-active-background"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                    )}
                  </div>
                  <span className="mt-1 text-xs font-medium">{item.label}</span>
                </motion.div>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </motion.div>
  )
} 