"use client"

import { SignInButton as ClerkSignInButton } from "@clerk/nextjs"
import { ReactNode } from "react"
import { Button } from "@/components/ui/button"

interface SignInButtonProps {
  children?: ReactNode
  className?: string
  size?: "default" | "sm" | "lg" | "icon"
}

export const SignInButton = ({ 
  children, 
  className = "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700",
  size = "default"
}: SignInButtonProps) => {
  return (
    <ClerkSignInButton mode="modal">
      {children || (
        <Button className={className} size={size}>
          Sign In
        </Button>
      )}
    </ClerkSignInButton>
  )
} 