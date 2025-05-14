"use client"

import { useUser, useClerk } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { useState, useEffect, createContext, useContext, ReactNode } from "react"

interface AuthContextType {
  user: ReturnType<typeof useUser>["user"]
  isLoaded: boolean
  isSignedIn: boolean
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { user, isLoaded, isSignedIn } = useUser()
  const { signOut } = useClerk()
  const router = useRouter()
  
  const logout = async () => {
    await signOut()
    router.push("/")
  }
  
  const value = {
    user,
    isLoaded,
    isSignedIn,
    logout
  }
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
