// Memory type definition
export type Memory = {
  id: string
  title: string
  content: string
  category: string
  tags: string[]
  timestamp: string
  userId: string
}

// Media item type
export type MediaItem = {
  id: string
  type: 'image' | 'video'
  url: string
  thumbnailUrl?: string // For videos
  mimeType: string
  caption?: string
  createdAt: string
}
