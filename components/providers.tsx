"use client"

import React from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { ClerkProvider } from "@clerk/nextjs"
import { AuthProvider } from "@/hooks/use-auth"
import { MemoriesProvider } from "@/hooks/use-memories"
import { ToastProvider } from "@/components/ui/use-toast"

interface ProvidersProps {
  children: React.ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ClerkProvider>
      <AuthProvider>
        <ThemeProvider 
          attribute="class" 
          defaultTheme="dark" 
          enableSystem={false} 
          forcedTheme="dark" 
          disableTransitionOnChange
        >
          <ToastProvider>
            <MemoriesProvider>
              {children}
            </MemoriesProvider>
          </ToastProvider>
        </ThemeProvider>
      </AuthProvider>
    </ClerkProvider>
  )
} 