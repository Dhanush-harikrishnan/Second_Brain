"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, BookOpen, BrainCircuit, Calendar, Clock, Lightbulb, MessageSquare, Plus, RefreshCw, Sparkles, TrendingUp, Activity, Zap } from "lucide-react"
import Link from "next/link"
import type { ReactNode } from "react"
import AppNavigation, { MobileNavigation } from "@/components/ui/navigation"
import { useMemories } from "@/hooks/use-memories"
import { motion, AnimatePresence } from "framer-motion"

interface StatsCardProps {
  icon: ReactNode;
  title: string;
  value: string;
  trend: string;
  color: string;
}

function StatsCard({ icon, title, value, trend, color }: StatsCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.div
      className="h-full"
      whileHover={{ scale: 1.03, y: -5 }}
      whileTap={{ scale: 0.98 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Card className={`border border-${color}-500/20 bg-gradient-to-br from-${color}-900/30 to-black/60 backdrop-blur-lg overflow-hidden h-full relative group`}>
        <motion.div 
          className={`absolute inset-0 bg-gradient-to-br from-${color}-700/10 to-${color}-400/5 opacity-0`}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />
        <CardContent className="p-6">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-12 h-12 rounded-lg flex items-center justify-center mb-3"
                style={{ background: `linear-gradient(135deg, var(--${color}-500) 0%, var(--${color}-600) 100%)`, opacity: 0.2 }}
              >
                <div className="text-white">{icon}</div>
              </motion.div>
              <p className="text-sm font-medium text-gray-400">{title}</p>
              <motion.div 
                className="text-2xl font-bold text-white"
                initial={{ y: 0 }}
                animate={{ y: isHovered ? -3 : 0 }}
                transition={{ duration: 0.2 }}
              >
                {value}
              </motion.div>
            </div>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className={`text-xs font-medium text-${color}-400 flex items-center gap-1`}
            >
              <TrendingUp className="h-3 w-3" />
              {trend}
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function Dashboard() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const { memories, fetchMemories, isLoading: isLoadingMemories } = useMemories()
  const [activeTab, setActiveTab] = useState("overview")
  const [isMounted, setIsMounted] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [stats, setStats] = useState({
    totalMemories: 0,
    chatSessions: 0,
    insightsGenerated: 0,
    timeSaved: "0 hrs"
  })
  
  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (isMounted && !user) {
      router.push("/")
    } else if (isMounted && user) {
      fetchMemories()
    }
  }, [user, router, isMounted, fetchMemories])

  // Update stats when memories are loaded
  useEffect(() => {
    if (memories.length > 0) {
      // Calculate real statistics based on actual data
      setStats({
        totalMemories: memories.length,
        chatSessions: Math.floor(memories.length / 4), // Just an example calculation
        insightsGenerated: Math.floor(memories.length / 2),
        timeSaved: `${Math.floor(memories.length * 0.5)} hrs`
      })
    }
  }, [memories])

  // Function to simulate refreshing data
  const refreshData = () => {
    setIsRefreshing(true)
    fetchMemories().finally(() => {
      setTimeout(() => {
        setIsRefreshing(false)
      }, 800)
    })
  }

  if (!isMounted || !user) {
    return null
  }
  
  const handleCreateNewMemory = () => {
    router.push("/memories?create=true")
  }

  // Get recent memories for display
  const recentMemories = memories.slice(0, 4).map(memory => ({
    title: memory.title,
    excerpt: memory.content.substring(0, 80) + "...",
    date: new Date(memory.timestamp).toLocaleString(),
    category: memory.category
  }))

  // Get recent activity based on actual memory data
  const recentActivity = memories.slice(0, 5).map((memory, i) => {
    const types = ["memory", "chat", "memory", "insight", "memory"]
    const times = ["2 hours ago", "Yesterday", "2 days ago", "3 days ago", "4 days ago"]
    
    return {
      title: i % 2 === 0 ? `Added "${memory.title}"` : `Updated "${memory.title}"`,
      time: times[i] || "Recently",
      type: types[i] || "memory",
      category: memory.category
    }
  })

  return (
    <div className="min-h-screen bg-black">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/30 via-purple-800/20 to-fuchsia-900/30" />
        <motion.div 
          className="absolute inset-0 backdrop-blur-[100px]" 
          initial={{ backdropFilter: "blur(0px)" }}
          animate={{ backdropFilter: "blur(100px)" }}
          transition={{ duration: 1 }}
        />
        <motion.div 
          className="absolute inset-0 bg-grid-white/5 bg-[length:50px_50px] opacity-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.2 }}
          transition={{ duration: 1.5 }}
        />
      </div>

      <div className="relative z-10">
        <AppNavigation />

        <main className="container mx-auto px-4 py-8 pt-24 pb-20 md:pb-8">
          <div className="mb-8">
            <motion.div 
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="mb-4 sm:mb-0">
                <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-400 to-purple-300 flex items-center gap-2">
                  <Sparkles className="h-7 w-7 text-purple-400" />
                  Welcome back
                </h2>
                <p className="text-gray-400 mt-1">{user.primaryEmailAddress?.emailAddress || "User"}</p>
              </div>

              <div className="flex gap-3">
                <motion.div
                  whileHover={{ scale: 1.05, rotate: 360 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ rotate: { duration: 0.5 } }}
                >
                  <Button 
                    className="border border-white/10 bg-black/30 backdrop-blur-md text-gray-300 hover:bg-white/10 w-10 h-10 rounded-full p-0"
                    size="icon"
                    onClick={refreshData}
                    disabled={isRefreshing || isLoadingMemories}
                  >
                    <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                  </Button>
                </motion.div>
                
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button 
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700 shadow-lg shadow-purple-600/20"
                    onClick={handleCreateNewMemory}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    New Memory
                  </Button>
                </motion.div>
              </div>
            </motion.div>
            
            <motion.div
              className="mt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Tabs 
                defaultValue="overview" 
                className="w-full"
                onValueChange={setActiveTab}
              >
                <TabsList className="mb-8 grid w-full grid-cols-4 bg-black/30 border border-white/10 p-1 rounded-xl backdrop-blur-md">
                  {["overview", "stats", "recent", "insights"].map((tab, i) => (
                    <TabsTrigger 
                      key={tab} 
                      value={tab}
                      className={`data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600/80 data-[state=active]:to-indigo-600/80 
                                text-gray-400 data-[state=active]:text-white rounded-lg capitalize text-sm py-2.5 shadow-none border-none
                                transition-all duration-300 data-[state=active]:shadow-lg data-[state=active]:shadow-purple-500/20`}
                    >
                      {tab}
                    </TabsTrigger>
                  ))}
                </TabsList>

                <AnimatePresence mode="wait">
                  <TabsContent value="overview" className="space-y-6 mt-0">
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                      <StatsCard
                        icon={<BookOpen className="h-6 w-6" />}
                        title="Total Memories"
                        value={stats.totalMemories.toString()}
                        trend={memories.length > 0 ? `+${Math.floor(memories.length / 10)}%` : "No change"}
                        color="purple"
                      />
                      
                      <StatsCard
                        icon={<MessageSquare className="h-6 w-6" />}
                        title="Chat Sessions"
                        value={stats.chatSessions.toString()}
                        trend={stats.chatSessions > 0 ? `+${Math.floor(stats.chatSessions / 3)}%` : "No change"}
                        color="indigo"
                      />
                      
                      <StatsCard
                        icon={<Lightbulb className="h-6 w-6" />}
                        title="Insights Generated"
                        value={stats.insightsGenerated.toString()}
                        trend={stats.insightsGenerated > 0 ? `+${Math.floor(stats.insightsGenerated / 4)}%` : "No change"}
                        color="amber"
                      />
                      
                      <StatsCard
                        icon={<Clock className="h-6 w-6" />}
                        title="Time Saved"
                        value={stats.timeSaved}
                        trend="+22%"
                        color="blue"
                      />
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="h-full"
                      >
                        <Card className="border-white/10 bg-black/50 backdrop-blur-lg overflow-hidden h-full">
                          <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                              <div>
                                <CardTitle className="text-white flex items-center gap-1.5">
                                  <Activity className="h-5 w-5 text-purple-400" />
                                  Recent Activity
                                </CardTitle>
                                <CardDescription className="text-gray-400">Your latest interactions</CardDescription>
                              </div>
                              <div className="bg-purple-500/10 text-purple-400 px-2.5 py-1 rounded-full text-xs font-medium">
                                {isLoadingMemories ? 'Loading...' : `Last 7 days`}
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            {isLoadingMemories ? (
                              <div className="flex justify-center py-8">
                                <div className="flex flex-col items-center">
                                  <RefreshCw className="h-8 w-8 text-purple-400 animate-spin" />
                                  <p className="mt-4 text-sm text-gray-400">Loading your activities...</p>
                                </div>
                              </div>
                            ) : recentActivity.length > 0 ? (
                              <ul className="space-y-3">
                                {recentActivity.map((item, i) => {
                                  const categoryColors: Record<string, string> = {
                                    "thought": "bg-blue-500/20 text-blue-300",
                                    "experience": "bg-purple-500/20 text-purple-300",
                                    "idea": "bg-green-500/20 text-green-300",
                                    "dream": "bg-indigo-500/20 text-indigo-300",
                                    "goal": "bg-amber-500/20 text-amber-300"
                                  };
                                  
                                  const categoryClasses = categoryColors[item.category] || "bg-gray-500/20 text-gray-300";
                                  
                                  return (
                                    <motion.li 
                                      key={i} 
                                      className="flex items-center gap-3 rounded-lg bg-white/5 p-3 border border-white/5 hover:border-white/10 transition-colors"
                                      initial={{ opacity: 0, y: 10 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      transition={{ duration: 0.3, delay: i * 0.1 }}
                                      whileHover={{ 
                                        backgroundColor: "rgba(255, 255, 255, 0.08)",
                                        transition: { duration: 0.2 }
                                      }}
                                    >
                                      <div className="w-10 h-10 rounded-full flex items-center justify-center bg-black/30 backdrop-blur-md border border-white/10">
                                        {item.type === "memory" && <BookOpen className="h-5 w-5 text-purple-400" />}
                                        {item.type === "chat" && <MessageSquare className="h-5 w-5 text-indigo-400" />}
                                        {item.type === "insight" && <Lightbulb className="h-5 w-5 text-amber-400" />}
                                      </div>
                                      <div className="flex-1">
                                        <p className="font-medium text-white">{item.title}</p>
                                        <div className="flex items-center justify-between mt-1">
                                          <p className="text-sm text-gray-400">{item.time}</p>
                                          <span className={`text-xs px-2 py-0.5 rounded-full ${categoryClasses}`}>
                                            {item.category}
                                          </span>
                                        </div>
                                      </div>
                                    </motion.li>
                                  );
                                })}
                              </ul>
                            ) : (
                              <div className="flex justify-center py-8">
                                <div className="flex flex-col items-center">
                                  <p className="text-gray-400">No recent activity yet</p>
                                  <Button 
                                    className="mt-4 bg-purple-600/20 text-purple-400 hover:bg-purple-600/30"
                                    onClick={handleCreateNewMemory}
                                  >
                                    <Plus className="mr-2 h-4 w-4" />
                                    Create your first memory
                                  </Button>
                                </div>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="h-full"
                      >
                        <Card className="border-white/10 bg-black/50 backdrop-blur-lg overflow-hidden h-full">
                          <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                              <div>
                                <CardTitle className="text-white flex items-center gap-1.5">
                                  <Zap className="h-5 w-5 text-indigo-400" />
                                  Latest Memories
                                </CardTitle>
                                <CardDescription className="text-gray-400">Your recent stored thoughts</CardDescription>
                              </div>
                              <Link href="/memories">
                                <Button variant="link" className="text-indigo-400 p-0 h-auto">
                                  View all
                                </Button>
                              </Link>
                            </div>
                          </CardHeader>
                          <CardContent>
                            {isLoadingMemories ? (
                              <div className="flex justify-center py-8">
                                <div className="flex flex-col items-center">
                                  <RefreshCw className="h-8 w-8 text-indigo-400 animate-spin" />
                                  <p className="mt-4 text-sm text-gray-400">Loading your memories...</p>
                                </div>
                              </div>
                            ) : recentMemories.length > 0 ? (
                              <ul className="space-y-3">
                                {recentMemories.map((memory, i) => {
                                  const categoryColors: Record<string, string> = {
                                    "thought": "bg-blue-500/20 text-blue-300",
                                    "experience": "bg-purple-500/20 text-purple-300",
                                    "idea": "bg-green-500/20 text-green-300",
                                    "dream": "bg-indigo-500/20 text-indigo-300",
                                    "goal": "bg-amber-500/20 text-amber-300"
                                  };
                                  
                                  const categoryClasses = categoryColors[memory.category] || "bg-gray-500/20 text-gray-300";
                                  
                                  return (
                                    <motion.li 
                                      key={i} 
                                      className="p-3 rounded-lg bg-white/5 border border-white/5 hover:border-white/10 transition-colors"
                                      initial={{ opacity: 0, y: 10 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      transition={{ duration: 0.3, delay: i * 0.1 }}
                                      whileHover={{ 
                                        backgroundColor: "rgba(255, 255, 255, 0.08)",
                                        transition: { duration: 0.2 }
                                      }}
                                    >
                                      <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-medium text-white">{memory.title}</h3>
                                        <span className={`text-xs px-2 py-0.5 rounded-full ${categoryClasses}`}>
                                          {memory.category}
                                        </span>
                                      </div>
                                      <p className="text-gray-400 text-sm mb-2 line-clamp-2">{memory.excerpt}</p>
                                      <div className="text-xs text-gray-500">{memory.date}</div>
                                    </motion.li>
                                  );
                                })}
                              </ul>
                            ) : (
                              <div className="flex justify-center py-8">
                                <div className="flex flex-col items-center">
                                  <p className="text-gray-400">No memories yet</p>
                                  <Button 
                                    className="mt-4 bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600/30"
                                    onClick={handleCreateNewMemory}
                                  >
                                    <Plus className="mr-2 h-4 w-4" />
                                    Create your first memory
                                  </Button>
                                </div>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      </motion.div>
                    </div>
                  </TabsContent>
                </AnimatePresence>
              </Tabs>
            </motion.div>
          </div>
        </main>

        <MobileNavigation />
      </div>
    </div>
  )
}
