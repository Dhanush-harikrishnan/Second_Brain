"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/hooks/use-auth"
import { User, Settings, Image as ImageIcon } from "lucide-react"
import AppNavigation, { MobileNavigation } from "@/components/ui/navigation"

export default function ProfilePage() {
  const { user } = useAuth()
  const router = useRouter()
  const [isMounted, setIsMounted] = useState(false)
  
  // Profile state
  const [name, setName] = useState("")
  const [bio, setBio] = useState("")
  
  useEffect(() => {
    setIsMounted(true)
    // Initialize with user data if available
    if (user) {
      setName(user.fullName || "")
    }
  }, [user])

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

  const handleUpdateProfile = () => {
    // Implement update profile logic here
    console.log("Profile updated", { name, bio })
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
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-white">Your Profile</h2>
            <p className="text-gray-400">Manage your personal information</p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-3">
            <div className="md:col-span-1">
              <Card className="border-white/10 bg-black/50 backdrop-blur-lg">
                <CardContent className="p-6 flex flex-col items-center">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-center mb-4">
                    <User className="h-16 w-16 text-white" />
                  </div>
                  
                  <h3 className="text-xl font-medium text-white">{user.fullName || "User"}</h3>
                  <p className="text-gray-400">{user.primaryEmailAddress?.emailAddress}</p>
                  
                  <Button className="mt-4 w-full border-purple-600/50 text-purple-400 hover:bg-purple-600/20" variant="outline">
                    <ImageIcon className="mr-2 h-4 w-4" />
                    Change Photo
                  </Button>
                </CardContent>
              </Card>
            </div>
            
            <div className="md:col-span-2">
              <Card className="border-white/10 bg-black/50 backdrop-blur-lg">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <User className="h-5 w-5 text-purple-400" />
                    Personal Information
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Update your personal details
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name" className="text-white">Full Name</Label>
                    <Input 
                      id="name" 
                      value={name} 
                      onChange={(e) => setName(e.target.value)} 
                      className="border-white/10 bg-black/50 text-white"
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="email" className="text-white">Email</Label>
                    <Input 
                      id="email" 
                      value={user.primaryEmailAddress?.emailAddress || ""} 
                      disabled
                      className="border-white/10 bg-black/50 text-white opacity-70"
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="bio" className="text-white">Bio</Label>
                    <Textarea 
                      id="bio" 
                      value={bio} 
                      onChange={(e) => setBio(e.target.value)} 
                      className="border-white/10 bg-black/50 text-white min-h-[120px]"
                      placeholder="Tell us about yourself"
                    />
                  </div>
                  
                  <Button 
                    className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700"
                    onClick={handleUpdateProfile}
                  >
                    Update Profile
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="border-white/10 bg-black/50 backdrop-blur-lg mt-6">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Settings className="h-5 w-5 text-purple-400" />
                    Account Preferences
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Manage your account settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button 
                    variant="outline" 
                    className="w-full border-purple-600/50 text-purple-400 hover:bg-purple-600/20"
                  >
                    Connected Accounts
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full border-purple-600/50 text-purple-400 hover:bg-purple-600/20"
                  >
                    Notification Preferences
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full border-purple-600/50 text-purple-400 hover:bg-purple-600/20"
                  >
                    Privacy Settings
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>

        <MobileNavigation />
      </div>
    </div>
  )
} 