"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { useAuth } from "@/hooks/use-auth"
import { Settings, Bell, Eye, Moon, Cloud, Shield, Trash2, Check, RefreshCw } from "lucide-react"
import AppNavigation, { MobileNavigation } from "@/components/ui/navigation"
import { motion } from "framer-motion"
import { useTheme } from "next-themes"
import { useMemories } from "@/hooks/use-memories"
import { useToast } from "@/components/ui/use-toast"

export default function SettingsPage() {
  const { user } = useAuth()
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const { deleteMemory, memories } = useMemories()
  const { toast } = useToast()
  const [isMounted, setIsMounted] = useState(false)
  
  // Settings state
  const [notifications, setNotifications] = useState(true)
  const [darkMode, setDarkMode] = useState(true)
  const [autoSync, setAutoSync] = useState(true)
  const [twoFactor, setTwoFactor] = useState(false)
  const [animatedTransitions, setAnimatedTransitions] = useState(true)
  
  // UI state
  const [isDeleting, setIsDeleting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  
  useEffect(() => {
    setIsMounted(true)
    // Initialize dark mode based on theme
    if (theme) {
      setDarkMode(theme === "dark")
    }
  }, [theme])

  // Handle authentication redirect on client-side only
  useEffect(() => {
    if (isMounted && !user) {
      router.push("/")
    }
  }, [user, router, isMounted])

  // Return early if not mounted or user not authenticated
  if (!isMounted || !user) {
    return null
  }

  // Handle theme toggle
  const handleDarkModeToggle = (checked: boolean) => {
    setDarkMode(checked)
    setTheme(checked ? "dark" : "light")
    
    toast({
      title: `${checked ? "Dark" : "Light"} mode activated`,
      description: `Your theme preference has been updated.`,
    })
  }

  // Handle notification toggle
  const handleNotificationsToggle = (checked: boolean) => {
    setNotifications(checked)
    
    toast({
      title: `Notifications ${checked ? "enabled" : "disabled"}`,
      description: `You will ${checked ? "now receive" : "no longer receive"} notifications.`,
    })
  }

  // Handle sync toggle
  const handleSyncToggle = (checked: boolean) => {
    setAutoSync(checked)
    
    toast({
      title: `Auto-sync ${checked ? "enabled" : "disabled"}`,
      description: `Your memories will ${checked ? "now" : "no longer"} automatically sync across devices.`,
    })
  }

  // Handle security toggle
  const handleTwoFactorToggle = (checked: boolean) => {
    setTwoFactor(checked)
    
    toast({
      title: `Two-factor authentication ${checked ? "enabled" : "disabled"}`,
      description: `Your account security has been updated.`,
    })
  }

  // Handle animation toggle
  const handleAnimationToggle = (checked: boolean) => {
    setAnimatedTransitions(checked)
    
    toast({
      title: `Animations ${checked ? "enabled" : "disabled"}`,
      description: `Page transitions will ${checked ? "now be animated" : "no longer be animated"}.`,
    })
  }

  // Handle data export
  const handleExportData = () => {
    const dataStr = JSON.stringify(memories, null, 2)
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`
    
    const exportFileDefaultName = `memories-export-${new Date().toISOString().split('T')[0]}.json`
    
    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
    
    toast({
      title: "Data exported successfully",
      description: "Your memories have been exported as a JSON file.",
    })
  }

  // Handle delete all memories
  const handleDeleteAllMemories = () => {
    setIsDeleting(true)
    
    // Simulate deletion process
    setTimeout(() => {
      // In a real app, this would call the actual deletion API
      setIsDeleting(false)
      setShowSuccess(true)
      
      toast({
        title: "All memories deleted",
        description: "Your memories have been permanently deleted.",
        variant: "destructive"
      })
      
      setTimeout(() => {
        setShowSuccess(false)
      }, 3000)
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/30 via-purple-800/20 to-fuchsia-900/30" />
        <div className="absolute inset-0 backdrop-blur-[100px]" style={{ backdropFilter: "blur(100px)" }} />
      </div>

      <div className="relative z-10">
        <AppNavigation />

        <main className="container mx-auto px-4 py-8 pt-24 pb-20 md:pb-8">
          <motion.div 
            className="mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold text-white">Settings</h2>
            <p className="text-gray-400">Customize your app experience</p>
          </motion.div>
          
          <div className="grid gap-6 md:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card className="border-white/10 bg-black/50 backdrop-blur-lg h-full">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Bell className="h-5 w-5 text-purple-400" />
                    Notifications
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Control how and when you receive alerts
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <motion.div 
                    className="flex items-center justify-between"
                    whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.05)", borderRadius: "0.5rem", padding: "0.5rem" }}
                  >
                    <div>
                      <p className="text-white">Memory Reminders</p>
                      <p className="text-sm text-gray-400">Get reminded about important memories</p>
                    </div>
                    <Switch 
                      checked={notifications} 
                      onCheckedChange={handleNotificationsToggle}
                      className="data-[state=checked]:bg-purple-600"
                    />
                  </motion.div>
                  
                  <motion.div 
                    className="flex items-center justify-between"
                    whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.05)", borderRadius: "0.5rem", padding: "0.5rem" }}
                  >
                    <div>
                      <p className="text-white">Weekly Digest</p>
                      <p className="text-sm text-gray-400">Receive a summary of your week</p>
                    </div>
                    <Switch 
                      checked={true} 
                      onCheckedChange={() => {
                        toast({
                          title: "Feature coming soon",
                          description: "Weekly digest settings will be available in the next update."
                        })
                      }} 
                      className="data-[state=checked]:bg-purple-600"
                    />
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="border-white/10 bg-black/50 backdrop-blur-lg h-full">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Eye className="h-5 w-5 text-purple-400" />
                    Appearance
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Customize how your app looks
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <motion.div 
                    className="flex items-center justify-between"
                    whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.05)", borderRadius: "0.5rem", padding: "0.5rem" }}
                  >
                    <div>
                      <p className="text-white">Dark Mode</p>
                      <p className="text-sm text-gray-400">Toggle dark mode on/off</p>
                    </div>
                    <Switch 
                      checked={darkMode} 
                      onCheckedChange={handleDarkModeToggle}
                      className="data-[state=checked]:bg-purple-600"
                    />
                  </motion.div>
                  
                  <motion.div 
                    className="flex items-center justify-between"
                    whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.05)", borderRadius: "0.5rem", padding: "0.5rem" }}
                  >
                    <div>
                      <p className="text-white">Animated Transitions</p>
                      <p className="text-sm text-gray-400">Enable smooth animations between pages</p>
                    </div>
                    <Switch 
                      checked={animatedTransitions} 
                      onCheckedChange={handleAnimationToggle}
                      className="data-[state=checked]:bg-purple-600"
                    />
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card className="border-white/10 bg-black/50 backdrop-blur-lg h-full">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Cloud className="h-5 w-5 text-purple-400" />
                    Data & Sync
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Manage your data and synchronization
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <motion.div 
                    className="flex items-center justify-between"
                    whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.05)", borderRadius: "0.5rem", padding: "0.5rem" }}
                  >
                    <div>
                      <p className="text-white">Auto-Sync</p>
                      <p className="text-sm text-gray-400">Keep your memories in sync across devices</p>
                    </div>
                    <Switch 
                      checked={autoSync} 
                      onCheckedChange={handleSyncToggle}
                      className="data-[state=checked]:bg-purple-600"
                    />
                  </motion.div>
                  
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button 
                      variant="outline" 
                      className="w-full border-purple-600/50 text-purple-400 hover:bg-purple-600/20"
                      onClick={handleExportData}
                    >
                      Export My Data
                    </Button>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card className="border-white/10 bg-black/50 backdrop-blur-lg h-full">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Shield className="h-5 w-5 text-purple-400" />
                    Security
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Manage your account security
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <motion.div 
                    className="flex items-center justify-between"
                    whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.05)", borderRadius: "0.5rem", padding: "0.5rem" }}
                  >
                    <div>
                      <p className="text-white">Two-Factor Authentication</p>
                      <p className="text-sm text-gray-400">Add an extra layer of security</p>
                    </div>
                    <Switch 
                      checked={twoFactor} 
                      onCheckedChange={handleTwoFactorToggle}
                      className="data-[state=checked]:bg-purple-600"
                    />
                  </motion.div>
                  
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button 
                      variant="outline" 
                      className="w-full border-purple-600/50 text-purple-400 hover:bg-purple-600/20"
                      onClick={() => {
                        toast({
                          title: "Feature coming soon",
                          description: "Password change functionality will be available in the next update."
                        })
                      }}
                    >
                      Change Password
                    </Button>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="md:col-span-2"
            >
              <Card className="border-white/10 bg-black/50 backdrop-blur-lg">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Trash2 className="h-5 w-5 text-red-400" />
                    Danger Zone
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Irreversible actions for your account
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <motion.div 
                    className="rounded-md border border-red-500/30 bg-red-900/10 p-4"
                    whileHover={{ backgroundColor: "rgba(220, 38, 38, 0.15)" }}
                  >
                    <h3 className="text-lg font-medium text-red-400">Delete All Memories</h3>
                    <p className="mt-1 text-sm text-gray-400">
                      This will permanently delete all your stored memories. This action cannot be undone.
                    </p>
                    <Button 
                      variant="destructive" 
                      className="mt-4 bg-red-600 hover:bg-red-700 relative"
                      onClick={handleDeleteAllMemories}
                      disabled={isDeleting || showSuccess}
                    >
                      {isDeleting ? (
                        <>
                          <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                          Deleting...
                        </>
                      ) : showSuccess ? (
                        <>
                          <Check className="mr-2 h-4 w-4" />
                          Deleted!
                        </>
                      ) : (
                        "Delete All Memories"
                      )}
                    </Button>
                  </motion.div>
                  
                  <motion.div 
                    className="rounded-md border border-red-500/30 bg-red-900/10 p-4"
                    whileHover={{ backgroundColor: "rgba(220, 38, 38, 0.15)" }}
                  >
                    <h3 className="text-lg font-medium text-red-400">Delete Account</h3>
                    <p className="mt-1 text-sm text-gray-400">
                      This will permanently delete your account and all associated data. This action cannot be undone.
                    </p>
                    <Button 
                      variant="destructive" 
                      className="mt-4 bg-red-600 hover:bg-red-700"
                      onClick={() => {
                        toast({
                          title: "Account deletion",
                          description: "This feature requires additional confirmation and is disabled in the demo.",
                          variant: "destructive"
                        })
                      }}
                    >
                      Delete Account
                    </Button>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </main>

        <MobileNavigation />
      </div>
    </div>
  )
}
