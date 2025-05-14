"use client"

import { useState, useEffect, useCallback, createContext, useContext } from "react"
import { useAuth } from "./use-auth"
import { useToast } from "@/components/ui/use-toast"

// Media type
export type MediaItem = {
  id: string
  type: 'image' | 'video'
  url: string
  thumbnailUrl?: string // For videos
  mimeType: string
  caption?: string
  createdAt: string
}

// Memory type
export type Memory = {
  id: string
  title: string
  content: string
  category: string
  tags: string[]
  timestamp: string
  userId: string
  media?: MediaItem[] // Array of media items (images, videos)
}

// Context type
interface MemoriesContextType {
  memories: Memory[]
  isLoading: boolean
  error: string | null
  fetchMemories: () => Promise<void>
  createMemory: (memory: Omit<Memory, "id" | "userId" | "timestamp">) => Promise<void>
  updateMemory: (id: string, updates: Partial<Memory>) => Promise<void>
  deleteMemory: (id: string) => Promise<void>
  uploadMedia: (file: File, caption?: string) => Promise<MediaItem | null>
  deleteMedia: (mediaId: string) => Promise<boolean>
}

// Create context
const MemoriesContext = createContext<MemoriesContextType | undefined>(undefined)

// Sample memories data for demo purposes
const sampleMemories: Memory[] = [
  {
    id: "1",
    title: "Project Ideas",
    content: "New concept for the mobile app that focuses on user engagement through gamification and interactive elements.",
    category: "Work",
    tags: ["mobile", "app", "design", "gamification"],
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    userId: "user-1"
  },
  {
    id: "2",
    title: "Meeting Notes",
    content: "Key points from the team meeting: timeline adjustments, new feature priorities, and budget allocations for Q3.",
    category: "Work",
    tags: ["meeting", "team", "notes", "planning"],
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    userId: "user-1"
  },
  {
    id: "3",
    title: "Research Findings",
    content: "Summary of the latest industry reports showing trends in user behavior and market preferences for SaaS products.",
    category: "Research",
    tags: ["research", "market", "trends", "SaaS"],
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    userId: "user-1"
  },
  {
    id: "4",
    title: "Personal Goals",
    content: "Updated list of quarterly goals: learn a new programming language, contribute to 3 open source projects, read 5 technical books.",
    category: "Personal",
    tags: ["goals", "learning", "personal development"],
    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    userId: "user-1"
  },
  {
    id: "5",
    title: "Vacation Ideas",
    content: "Potential destinations for next year's vacation: Japan (spring), Norway (summer), or New Zealand (fall).",
    category: "Personal",
    tags: ["travel", "vacation", "planning"],
    timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    userId: "user-1"
  },
]

export function MemoriesProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const { toast } = useToast()
  const [memories, setMemories] = useState<Memory[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch memories from API
  const fetchMemories = useCallback(async () => {
    if (!user) return
    
    setIsLoading(true)
    setError(null)
    
    try {
      // Real API call to fetch memories from backend
      const response = await fetch('/api/memories')
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to fetch memories')
      }
      
      const data = await response.json()
      setMemories(data.memories || [])
    } catch (err) {
      console.error("Failed to fetch memories:", err)
      setError("Failed to fetch memories. Please try again.")
      toast({
        title: "Error fetching memories",
        description: err instanceof Error ? err.message : "An unknown error occurred",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }, [user, toast])

  // Add a new memory
  const createMemory = useCallback(async (memory: Omit<Memory, "id" | "userId" | "timestamp">) => {
    if (!user) return
    
    setIsLoading(true)
    setError(null)
    
    try {
      // Real API call to create a new memory
      const response = await fetch('/api/memories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(memory),
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to create memory')
      }
      
      const newMemory = await response.json()
      
      setMemories(prev => [newMemory, ...prev])
      toast({
        title: "Memory created",
        description: "Your new memory has been saved successfully",
        variant: "success"
      })
    } catch (err) {
      console.error("Failed to create memory:", err)
      setError("Failed to create memory. Please try again.")
      toast({
        title: "Error creating memory",
        description: err instanceof Error ? err.message : "An unknown error occurred",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }, [user, toast])

  // Update a memory
  const updateMemory = useCallback(async (id: string, updates: Partial<Memory>) => {
    if (!user) return
    
    setIsLoading(true)
    setError(null)
    
    try {
      // Real API call to update a memory
      const response = await fetch(`/api/memories/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to update memory')
      }
      
      const updatedMemory = await response.json()
      
      setMemories(prev => 
        prev.map(memory => 
          memory.id === id ? { ...memory, ...updatedMemory } : memory
        )
      )
      
      toast({
        title: "Memory updated",
        description: "Your memory has been updated successfully",
        variant: "success"
      })
    } catch (err) {
      console.error("Failed to update memory:", err)
      setError("Failed to update memory. Please try again.")
      toast({
        title: "Error updating memory",
        description: err instanceof Error ? err.message : "An unknown error occurred",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }, [user, toast])

  // Delete a memory
  const deleteMemory = useCallback(async (id: string) => {
    if (!user) return
    
    setIsLoading(true)
    setError(null)
    
    try {
      // Real API call to delete a memory
      const response = await fetch(`/api/memories/${id}`, {
        method: 'DELETE',
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to delete memory')
      }
      
      setMemories(prev => prev.filter(memory => memory.id !== id))
      
      toast({
        title: "Memory deleted",
        description: "Your memory has been deleted successfully",
        variant: "success"
      })
    } catch (err) {
      console.error("Failed to delete memory:", err)
      setError("Failed to delete memory. Please try again.")
      toast({
        title: "Error deleting memory",
        description: err instanceof Error ? err.message : "An unknown error occurred",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }, [user, toast])
  
  // Upload media (image or video)
  const uploadMedia = useCallback(async (file: File, caption?: string): Promise<MediaItem | null> => {
    if (!user) return null
    
    setIsLoading(true)
    setError(null)
    
    try {
      // Create form data for file upload
      const formData = new FormData()
      formData.append('file', file)
      if (caption) formData.append('caption', caption)
      
      // API call to upload media
      const response = await fetch('/api/media/upload', {
        method: 'POST',
        body: formData,
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to upload media')
      }
      
      const mediaItem = await response.json()
      
      toast({
        title: "Media uploaded",
        description: "Your media has been uploaded successfully",
        variant: "success"
      })
      
      return mediaItem
    } catch (err) {
      console.error("Failed to upload media:", err)
      setError("Failed to upload media. Please try again.")
      toast({
        title: "Error uploading media",
        description: err instanceof Error ? err.message : "An unknown error occurred",
        variant: "destructive"
      })
      return null
    } finally {
      setIsLoading(false)
    }
  }, [user, toast])
  
  // Delete media
  const deleteMedia = useCallback(async (mediaId: string): Promise<boolean> => {
    if (!user) return false
    
    setIsLoading(true)
    setError(null)
    
    try {
      // API call to delete media
      const response = await fetch(`/api/media/${mediaId}`, {
        method: 'DELETE',
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to delete media')
      }
      
      toast({
        title: "Media deleted",
        description: "Your media has been deleted successfully",
        variant: "success"
      })
      
      return true
    } catch (err) {
      console.error("Failed to delete media:", err)
      setError("Failed to delete media. Please try again.")
      toast({
        title: "Error deleting media",
        description: err instanceof Error ? err.message : "An unknown error occurred",
        variant: "destructive"
      })
      return false
    } finally {
      setIsLoading(false)
    }
  }, [user, toast])

  // Create value object
  const value = {
    memories,
    isLoading,
    error,
    fetchMemories,
    createMemory,
    updateMemory,
    deleteMemory,
    uploadMedia,
    deleteMedia
  }

  return (
    <MemoriesContext.Provider value={value}>
      {children}
    </MemoriesContext.Provider>
  )
}

// Hook for using the memories context
export function useMemories() {
  const context = useContext(MemoriesContext)
  
  if (context === undefined) {
    throw new Error("useMemories must be used within a MemoriesProvider")
  }
  
  return context
}
