"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/hooks/use-auth"
import { BrainCircuit, Filter, Plus, Search, Tag, Edit2, Trash2, ChevronLeft, ChevronRight, Sparkles, Lightbulb, Star, Zap, HeartHandshake, CloudSun, Target, Copy, MoreHorizontal } from "lucide-react"
import Link from "next/link"
import { useMemories, Memory } from "@/hooks/use-memories"
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea" 
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import AppNavigation, { MobileNavigation } from "@/components/ui/navigation"
import { useToast } from "@/components/ui/use-toast"

const MemoryCard = ({ memory, onEdit, onDelete, toast }: { 
  memory: Memory, 
  onEdit: (memory: Memory) => void, 
  onDelete: (id: string) => void,
  toast: any
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isActionOpen, setIsActionOpen] = useState(false);
  
  const categoryColors = {
    "thought": "from-blue-500/30 to-sky-500/30 border-blue-500/50",
    "experience": "from-purple-500/30 to-fuchsia-500/30 border-purple-500/50",
    "idea": "from-green-500/30 to-emerald-500/30 border-green-500/50",
    "dream": "from-indigo-500/30 to-violet-500/30 border-indigo-500/50",
    "goal": "from-amber-500/30 to-orange-500/30 border-amber-500/50"
  }
  
  const categoryColor = categoryColors[memory.category as keyof typeof categoryColors] || "from-gray-500/30 to-slate-500/30 border-gray-500/50";
  
  return (
    <motion.div
      className="h-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      layout
    >
      <Card className={`h-full overflow-hidden border-2 bg-gradient-to-br ${categoryColor} backdrop-blur-lg relative group`}>
        <motion.div 
          className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 0.1 : 0 }}
        />
        
        <CardContent className="p-5 h-full flex flex-col">
          <div className="flex justify-between items-start mb-2">
            <motion.div
              className="text-lg font-medium text-white line-clamp-2 flex-1 pr-2"
              initial={{ y: 0 }}
              animate={{ y: isHovered ? -3 : 0 }}
              transition={{ duration: 0.2 }}
            >
              {memory.title}
            </motion.div>
            
            <motion.div
              className="relative"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: isHovered ? 1 : 0, scale: isHovered ? 1 : 0.8 }}
              transition={{ duration: 0.2 }}
            >
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full bg-white/10 text-white hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/20"
                onClick={() => setIsActionOpen(!isActionOpen)}
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
              
              {isActionOpen && (
                <motion.div
                  className="absolute right-0 top-10 bg-gray-900/95 backdrop-blur-md border border-white/10 rounded-lg shadow-xl z-10 p-1 min-w-[140px]"
                  initial={{ opacity: 0, y: -10, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <motion.button
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm text-white hover:bg-white/10 rounded-md transition-colors"
                    onClick={() => {
                      setIsActionOpen(false);
                      onEdit(memory);
                    }}
                    whileHover={{ x: 3 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Edit2 className="h-3.5 w-3.5 text-blue-400" />
                    Edit Memory
                  </motion.button>
                  
                  <motion.button
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm text-white hover:bg-red-500/20 hover:text-red-300 rounded-md transition-colors"
                    onClick={() => {
                      setIsActionOpen(false);
                      onDelete(memory.id);
                    }}
                    whileHover={{ x: 3 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Trash2 className="h-3.5 w-3.5 text-red-400" />
                    Delete Memory
                  </motion.button>
                  
                  <div className="border-t border-white/10 my-1"></div>
                  
                  <motion.button
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm text-white hover:bg-white/10 rounded-md transition-colors"
                    onClick={() => {
                      setIsActionOpen(false);
                      navigator.clipboard.writeText(memory.content);
                      toast({
                        title: "Copied to clipboard",
                        description: "Memory content has been copied to clipboard."
                      });
                    }}
                    whileHover={{ x: 3 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Copy className="h-3.5 w-3.5 text-purple-400" />
                    Copy Content
                  </motion.button>
                </motion.div>
              )}
            </motion.div>
          </div>
          
          <div className="flex items-center mb-3">
            <Badge className={`bg-${memory.category === 'thought' ? 'blue' : memory.category === 'experience' ? 'purple' : memory.category === 'idea' ? 'green' : memory.category === 'dream' ? 'indigo' : 'amber'}-500/50 backdrop-blur-md text-white border-none`}>
              {memory.category.charAt(0).toUpperCase() + memory.category.slice(1)}
            </Badge>
            <div className="text-xs text-gray-400 ml-auto">
              {new Date(memory.timestamp).toLocaleDateString()}
            </div>
          </div>
          
          <motion.div 
            className="text-gray-300 text-sm line-clamp-4 mb-3 flex-1"
            initial={{ opacity: 0.8 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            {memory.content}
          </motion.div>
          
          {memory.tags && memory.tags.length > 0 && (
            <motion.div 
              className="flex flex-wrap gap-1.5 mt-auto"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              {memory.tags.map((tag, index) => (
                <Badge key={index} variant="outline" className="bg-black/30 backdrop-blur-md text-gray-300 text-xs border-white/10">
                  <Tag className="h-3 w-3 mr-1" />
                  {tag}
                </Badge>
              ))}
            </motion.div>
          )}
          
          {/* Quick action buttons that appear on hover */}
          <motion.div
            className="absolute bottom-3 right-3 flex gap-2"
            initial={{ opacity: 0, scale: 0, y: 10 }}
            animate={{ 
              opacity: isHovered ? 1 : 0,
              scale: isHovered ? 1 : 0,
              y: isHovered ? 0 : 10
            }}
            transition={{ duration: 0.2, staggerChildren: 0.05 }}
          >
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 backdrop-blur-sm border border-blue-500/20"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(memory);
                }}
              >
                <Edit2 className="h-3.5 w-3.5" />
              </Button>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full bg-red-500/20 text-red-400 hover:bg-red-500/30 backdrop-blur-sm border border-red-500/20"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(memory.id);
                }}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </motion.div>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default function Memories() {
  const { user } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { memories, isLoading, error, fetchMemories, deleteMemory, updateMemory, createMemory } = useMemories()
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [isMounted, setIsMounted] = useState(false)
  
  // For pagination
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 6
  
  // For edit dialog
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingMemory, setEditingMemory] = useState<Memory | null>(null)
  const [editTitle, setEditTitle] = useState("")
  const [editContent, setEditContent] = useState("")
  const [editCategory, setEditCategory] = useState("")
  const [editTags, setEditTags] = useState("")
  
  // New state for enhanced editing
  const [editEmoji, setEditEmoji] = useState("✨")
  const [showEditEmojiPicker, setShowEditEmojiPicker] = useState(false)
  const [editMood, setEditMood] = useState("neutral")
  const [editSticker, setEditSticker] = useState<string | null>(null)
  const [showEditStickerPicker, setShowEditStickerPicker] = useState(false)
  const [editMemoryColor, setEditMemoryColor] = useState("#6d28d9")
  const [editMemoryFont, setEditMemoryFont] = useState("default")
  const [editPreviewMode, setEditPreviewMode] = useState(false)
  
  // For create dialog
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newTitle, setNewTitle] = useState("")
  const [newContent, setNewContent] = useState("")
  const [newCategory, setNewCategory] = useState("thought")
  const [newTags, setNewTags] = useState("")
  
  // New state for enhanced memory creation
  const [selectedEmoji, setSelectedEmoji] = useState("✨")
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [selectedMood, setSelectedMood] = useState("neutral")
  const [selectedSticker, setSelectedSticker] = useState<string | null>(null)
  const [showStickerPicker, setShowStickerPicker] = useState(false)
  const [memoryColor, setMemoryColor] = useState("#6d28d9")
  const [memoryFont, setMemoryFont] = useState("default")
  const [previewMode, setPreviewMode] = useState(false)
  
  // For delete confirmation
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [deletingMemoryId, setDeletingMemoryId] = useState<string | null>(null)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Check for create=true in URL to open create dialog
  useEffect(() => {
    if (isMounted && searchParams.get('create') === 'true') {
      setIsCreateDialogOpen(true)
      // Reset the URL without the parameter after opening the dialog
      // We use a setTimeout to ensure the dialog opens first
      setTimeout(() => {
        router.replace('/memories')
      }, 100)
    }
  }, [isMounted, searchParams, router])

  // Handle authentication redirect on client-side only
  useEffect(() => {
    if (isMounted && !user) {
      router.push("/")
    }
  }, [user, router, isMounted])

  // Fetch memories only once when component mounts and user is authenticated
  useEffect(() => {
    if (isMounted && user) {
      fetchMemories()
    }
  }, [isMounted, user, fetchMemories])

  // Return early if not mounted or user not authenticated
  if (!isMounted || !user) {
    return null
  }

  const categories = ["all", "thought", "experience", "idea", "dream", "goal"]

  // Filter memories based on search and category
  const filteredMemories = memories.filter((memory) => {
    const matchesSearch =
      memory.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      memory.content.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || memory.category === selectedCategory
    return matchesSearch && matchesCategory
  })
  
  // Calculate pagination
  const totalPages = Math.ceil(filteredMemories.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentMemories = filteredMemories.slice(startIndex, endIndex)
  
  // Open edit dialog with memory data
  const handleEditClick = (memory: Memory) => {
    setEditingMemory(memory)
    
    // Extract emoji from title if it exists (assuming the first character might be an emoji)
    const emojiMatch = memory.title.match(/^(\p{Emoji})\s+(.*)/u);
    if (emojiMatch) {
      setEditEmoji(emojiMatch[1]);
      setEditTitle(emojiMatch[2]);
    } else {
      setEditEmoji("");
      setEditTitle(memory.title);
    }
    
    setEditContent(memory.content)
    setEditCategory(memory.category)
    setEditTags(memory.tags.join(", "))
    
    // Set default editing values
    setEditMood("neutral") // Default, would need to be stored in memory
    setEditSticker(null) // Default, would need to be stored in memory
    setEditMemoryColor(
      memory.category === "thought" ? "#3b82f6" :
      memory.category === "experience" ? "#8b5cf6" :
      memory.category === "idea" ? "#10b981" :
      memory.category === "dream" ? "#6366f1" :
      memory.category === "goal" ? "#f59e0b" : 
      "#6d28d9"
    )
    setEditMemoryFont("default")
    setEditPreviewMode(false)
    
    setIsEditDialogOpen(true)
  }
  
  // Save edited memory
  const handleSaveEdit = async () => {
    try {
      if (!editingMemory) return;
      
      const tagsArray = editTags.split(",").map(tag => tag.trim()).filter(tag => tag)
      
      await updateMemory(editingMemory.id, {
        title: editEmoji ? `${editEmoji} ${editTitle}` : editTitle,
        content: editContent,
        category: editCategory,
        tags: tagsArray
        // Additional fields like mood, sticker, etc. would need API support
      })
      
      setIsEditDialogOpen(false)
      toast({
        title: "Memory updated",
        description: "Your memory has been successfully updated.",
      })
    } catch (error) {
      console.error("Failed to update memory:", error)
      toast({
        title: "Error updating memory",
        description: "Failed to update memory. Please try again.",
        variant: "destructive"
      })
    }
  }
  
  // Open delete confirmation dialog
  const handleDeleteClick = (memoryId: string) => {
    setDeletingMemoryId(memoryId)
    setIsDeleteDialogOpen(true)
  }
  
  // Confirm and delete memory
  const handleConfirmDelete = async () => {
    try {
      if (!deletingMemoryId) return;
      
      await deleteMemory(deletingMemoryId)
      setIsDeleteDialogOpen(false)
      
      // If we've deleted the last item on a page, go to previous page (unless we're on page 1)
      if (currentMemories.length === 1 && currentPage > 1) {
        setCurrentPage(prev => prev - 1)
      }
    } catch (error) {
      console.error("Failed to delete memory:", error)
      toast({
        title: "Error deleting memory",
        description: "Failed to delete memory. Please try again.",
        variant: "destructive"
      })
    }
  }
  
  // Handle creating a new memory
  const handleCreateMemory = async () => {
    try {
      if (!newTitle || !newContent || !newCategory) {
        toast({
          title: "Error creating memory",
          description: "Title, content, and category are required.",
          variant: "destructive"
        })
        return
      }
      
      const tagsArray = newTags.split(",").map(tag => tag.trim()).filter(tag => tag)
      
      await createMemory({
        title: selectedEmoji ? `${selectedEmoji} ${newTitle}` : newTitle,
        content: newContent,
        category: newCategory,
        tags: tagsArray,
        // You'd need to update your API and schema to support these
        // mood: selectedMood,
        // sticker: selectedSticker,
        // customColor: memoryColor,
        // customFont: memoryFont
      })
      
      // Reset form
      setNewTitle("")
      setNewContent("")
      setNewCategory("thought")
      setNewTags("")
      setSelectedEmoji("✨")
      setSelectedMood("neutral")
      setSelectedSticker(null)
      setMemoryColor("#6d28d9")
      setMemoryFont("default")
      setPreviewMode(false)
      setIsCreateDialogOpen(false)
      
      // Go to first page to see newly created memory
      setCurrentPage(1)
    } catch (error) {
      console.error("Failed to create memory:", error)
      toast({
        title: "Error creating memory",
        description: "Failed to create memory. Please try again.",
        variant: "destructive"
      })
    }
  }
  
  // Common emojis for quick selection
  const commonEmojis = ["✨", "💡", "🔥", "❤️", "🌟", "🎯", "🧠", "🌈", "🚀", "💭", "📝", "🌱"]
  
  // Stickers for selection
  const stickers = [
    "/stickers/brain.svg",
    "/stickers/idea.svg",
    "/stickers/galaxy.svg",
    "/stickers/rocket.svg",
    "/stickers/mountain.svg",
    "/stickers/heart.svg",
    "/stickers/bulb.svg",
    "/stickers/star.svg"
  ]
  
  // Mood options
  const moods = [
    { value: "excited", label: "Excited", icon: "🤩" },
    { value: "happy", label: "Happy", icon: "😊" },
    { value: "neutral", label: "Neutral", icon: "😐" },
    { value: "reflective", label: "Reflective", icon: "🤔" },
    { value: "sad", label: "Sad", icon: "😔" },
    { value: "anxious", label: "Anxious", icon: "😰" }
  ]

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
          className="absolute inset-0 bg-grid-white/5 bg-[length:50px_50px] opacity-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.2 }}
          transition={{ duration: 1.5 }}
        />
      </div>

      <div className="relative z-10">
        <AppNavigation />

        <main className="container mx-auto px-4 py-8 pt-24 pb-20 md:pb-8">
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-3xl font-bold text-white flex items-center gap-2">
                  <Sparkles className="h-6 w-6 text-purple-400" />
                  Your Neural Archive
                </h2>
                <p className="text-gray-400">Store and categorize your thoughts in this digital memory vault</p>
              </div>

              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700 shadow-lg shadow-purple-600/20">
                      <Plus className="mr-2 h-4 w-4" />
                      New Memory
                    </Button>
                  </motion.div>
                </DialogTrigger>
                <DialogContent className="bg-gray-900/90 backdrop-blur-xl border border-white/10 sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
                  <DialogHeader className="relative">
                    <motion.div 
                      className="absolute -top-10 -left-10 w-32 h-32 bg-gradient-to-br from-purple-500/30 to-blue-500/30 rounded-full blur-xl"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.7 }}
                      transition={{ duration: 1 }}
                    />
                    <motion.div 
                      className="absolute -bottom-20 -right-10 w-40 h-40 bg-gradient-to-br from-indigo-500/30 to-fuchsia-500/30 rounded-full blur-xl"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.7 }}
                      transition={{ duration: 1, delay: 0.2 }}
                    />
                    
                    <motion.div
                      initial={{ y: -20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.4 }}
                    >
                      <DialogTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-300">
                        Create Extraordinary Memory
                      </DialogTitle>
                      <DialogDescription className="text-gray-400">
                        Capture your thoughts with emotion, style, and flair.
                      </DialogDescription>
                    </motion.div>
                  </DialogHeader>
                  
                  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <motion.div 
                      className="space-y-5"
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="relative">
                            <motion.button
                              whileTap={{ scale: 0.97 }}
                              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                              className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-600/80 to-indigo-600/80 flex items-center justify-center text-xl shadow-lg shadow-purple-600/20"
                            >
                              {selectedEmoji}
                            </motion.button>
                            
                            {showEmojiPicker && (
                              <motion.div 
                                className="absolute top-12 left-0 z-10 bg-gray-800/90 backdrop-blur-lg border border-white/10 p-3 rounded-lg shadow-xl w-64"
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.2 }}
                              >
                                <div className="grid grid-cols-6 gap-2">
                                  {commonEmojis.map((emoji) => (
                                    <motion.button
                                      key={emoji}
                                      whileHover={{ scale: 1.2 }}
                                      whileTap={{ scale: 0.9 }}
                                      className="text-xl p-2 hover:bg-white/10 rounded-md transition-colors"
                                      onClick={() => {
                                        setSelectedEmoji(emoji)
                                        setShowEmojiPicker(false)
                                      }}
                                    >
                                      {emoji}
                                    </motion.button>
                                  ))}
                                </div>
                                <div className="mt-2 flex justify-between border-t border-white/10 pt-2">
                                  <button 
                                    className="text-xs text-purple-400 hover:text-purple-300"
                                    onClick={() => setSelectedEmoji("")}
                                  >
                                    Clear
                                  </button>
                                  <button 
                                    className="text-xs text-purple-400 hover:text-purple-300"
                                    onClick={() => setShowEmojiPicker(false)}
                                  >
                                    Close
                                  </button>
                                </div>
                              </motion.div>
                            )}
                          </div>
                          
                          <Input
                            value={newTitle}
                            onChange={(e) => setNewTitle(e.target.value)}
                            placeholder="Enter a captivating title..."
                            className="flex-1 border-white/10 bg-white/5 text-white rounded-lg focus:ring-2 focus:ring-purple-500/50 transition-all"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label className="text-white/80 flex items-center gap-1.5">
                          <motion.div 
                            animate={{ rotate: [0, 10, -10, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
                          >
                            💭
                          </motion.div>
                          Your thoughts
                        </Label>
                        <Textarea
                          value={newContent}
                          onChange={(e) => setNewContent(e.target.value)}
                          placeholder="Write your memory with as much detail as you wish..."
                          className="min-h-[180px] border-white/10 bg-white/5 text-white rounded-lg focus:ring-2 focus:ring-purple-500/50 transition-all"
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-white/80">Category</Label>
                          <Select value={newCategory} onValueChange={setNewCategory}>
                            <SelectTrigger className="border-white/10 bg-white/5 text-white">
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-900 text-white border-white/10">
                              <SelectItem value="thought">
                                <div className="flex items-center gap-2">
                                  <span className="text-blue-400">💭</span> Thought
                                </div>
                              </SelectItem>
                              <SelectItem value="experience">
                                <div className="flex items-center gap-2">
                                  <span className="text-purple-400">��</span> Experience
                                </div>
                              </SelectItem>
                              <SelectItem value="idea">
                                <div className="flex items-center gap-2">
                                  <span className="text-green-400">💡</span> Idea
                                </div>
                              </SelectItem>
                              <SelectItem value="dream">
                                <div className="flex items-center gap-2">
                                  <span className="text-indigo-400">🌙</span> Dream
                                </div>
                              </SelectItem>
                              <SelectItem value="goal">
                                <div className="flex items-center gap-2">
                                  <span className="text-amber-400">🎯</span> Goal
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-white/80">Mood</Label>
                          <Select value={selectedMood} onValueChange={setSelectedMood}>
                            <SelectTrigger className="border-white/10 bg-white/5 text-white">
                              <SelectValue placeholder="How do you feel?" />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-900 text-white border-white/10">
                              {moods.map((mood) => (
                                <SelectItem key={mood.value} value={mood.value}>
                                  <div className="flex items-center gap-2">
                                    <span>{mood.icon}</span> {mood.label}
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label className="text-white/80 flex items-center gap-1.5">
                          <motion.div 
                            animate={{ y: [0, -3, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                          >
                            🏷️
                          </motion.div>
                          Tags
                        </Label>
                        <Input
                          value={newTags}
                          onChange={(e) => setNewTags(e.target.value)}
                          placeholder="work, inspiration, future, etc."
                          className="border-white/10 bg-white/5 text-white"
                        />
                      </div>
                    </motion.div>
                    
                    <motion.div 
                      className="space-y-5"
                      initial={{ x: 20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.1 }}
                    >
                      <div className="rounded-xl border border-white/10 p-4 h-full bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-sm">
                        <h3 className="text-white font-medium mb-3 flex items-center gap-2">
                          <Sparkles className="h-4 w-4 text-purple-400" />
                          Personalize Your Memory
                        </h3>
                        
                        <div className="space-y-4">
                          <div>
                            <Label className="text-white/80 text-sm mb-2 block">Choose a sticker</Label>
                            <div className="relative">
                              <motion.div 
                                className="grid grid-cols-4 gap-2"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ staggerChildren: 0.1, delayChildren: 0.2 }}
                              >
                                {stickers.slice(0, 4).map((sticker, index) => (
                                  <motion.button
                                    key={sticker}
                                    initial={{ scale: 0, rotate: -10 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    whileHover={{ scale: 1.1, y: -5 }}
                                    whileTap={{ scale: 0.95 }}
                                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                    className={`h-16 w-16 rounded-lg flex items-center justify-center p-2 ${
                                      selectedSticker === sticker 
                                        ? 'ring-2 ring-purple-500 bg-purple-500/20' 
                                        : 'bg-white/5 hover:bg-white/10'
                                    }`}
                                    onClick={() => setSelectedSticker(sticker)}
                                  >
                                    <div className="h-12 w-12 relative">
                                      {/* Placeholder for sticker */}
                                      <div className="absolute inset-0 flex items-center justify-center">
                                        {index === 0 && <BrainCircuit className="h-10 w-10 text-purple-400" />}
                                        {index === 1 && <Lightbulb className="h-10 w-10 text-amber-400" />}
                                        {index === 2 && <Star className="h-10 w-10 text-blue-400" />}
                                        {index === 3 && <Zap className="h-10 w-10 text-pink-400" />}
                                      </div>
                                    </div>
                                  </motion.button>
                                ))}
                              </motion.div>
                              
                              <Button
                                variant="link"
                                className="text-xs text-purple-400 mt-1 p-0 h-auto hover:text-purple-300"
                                onClick={() => setShowStickerPicker(!showStickerPicker)}
                              >
                                {showStickerPicker ? "Hide stickers" : "More stickers..."}
                              </Button>
                              
                              {showStickerPicker && (
                                <motion.div 
                                  className="absolute top-full left-0 right-0 z-10 bg-gray-800/90 backdrop-blur-lg border border-white/10 p-3 rounded-lg shadow-xl mt-2"
                                  initial={{ opacity: 0, y: -10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ duration: 0.2 }}
                                >
                                  <div className="grid grid-cols-4 gap-2">
                                    {stickers.slice(4).map((sticker, index) => (
                                      <motion.button
                                        key={sticker}
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        className={`h-14 w-14 rounded-lg flex items-center justify-center p-2 ${
                                          selectedSticker === sticker 
                                            ? 'ring-2 ring-purple-500 bg-purple-500/20' 
                                            : 'bg-white/5 hover:bg-white/10'
                                        }`}
                                        onClick={() => {
                                          setSelectedSticker(sticker)
                                          setShowStickerPicker(false)
                                        }}
                                      >
                                        <div className="relative h-10 w-10 flex items-center justify-center">
                                          {index === 0 && <HeartHandshake className="h-9 w-9 text-red-400" />}
                                          {index === 1 && <CloudSun className="h-9 w-9 text-yellow-400" />}
                                          {index === 2 && <Target className="h-9 w-9 text-green-400" />}
                                          {index === 3 && <Sparkles className="h-9 w-9 text-indigo-400" />}
                                        </div>
                                      </motion.button>
                                    ))}
                                  </div>
                                </motion.div>
                              )}
                            </div>
                          </div>
                          
                          <div>
                            <Label className="text-white/80 text-sm mb-2 block">Memory color</Label>
                            <div className="flex flex-wrap gap-2">
                              {["#6d28d9", "#8b5cf6", "#ec4899", "#f43f5e", "#0ea5e9", "#14b8a6", "#f59e0b", "#84cc16"].map((color) => (
                                <motion.button
                                  key={color}
                                  whileHover={{ scale: 1.1, y: -2 }}
                                  whileTap={{ scale: 0.95 }}
                                  className={`h-8 w-8 rounded-full ${memoryColor === color ? 'ring-2 ring-white' : ''}`}
                                  style={{ backgroundColor: color }}
                                  onClick={() => setMemoryColor(color)}
                                />
                              ))}
                            </div>
                          </div>
                          
                          <div>
                            <Label className="text-white/80 text-sm mb-2 block">Font style</Label>
                            <div className="flex flex-wrap gap-2">
                              <Button
                                variant="outline" 
                                size="sm"
                                className={`text-white border-white/10 ${memoryFont === 'default' ? 'bg-white/20' : 'bg-transparent'}`}
                                onClick={() => setMemoryFont('default')}
                              >
                                Default
                              </Button>
                              <Button
                                variant="outline" 
                                size="sm"
                                className={`text-white border-white/10 font-serif ${memoryFont === 'serif' ? 'bg-white/20' : 'bg-transparent'}`}
                                onClick={() => setMemoryFont('serif')}
                              >
                                Serif
                              </Button>
                              <Button
                                variant="outline" 
                                size="sm"
                                className={`text-white border-white/10 font-mono ${memoryFont === 'mono' ? 'bg-white/20' : 'bg-transparent'}`}
                                onClick={() => setMemoryFont('mono')}
                              >
                                Mono
                              </Button>
                              <Button
                                variant="outline" 
                                size="sm"
                                className={`text-white border-white/10 font-bold ${memoryFont === 'bold' ? 'bg-white/20' : 'bg-transparent'}`}
                                onClick={() => setMemoryFont('bold')}
                              >
                                Bold
                              </Button>
                            </div>
                          </div>
                        </div>
                        
                        <motion.div 
                          className="mt-6"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5 }}
                        >
                          <Button
                            className="w-full bg-white/10 backdrop-blur-lg text-white hover:bg-white/20 border border-white/10"
                            onClick={() => setPreviewMode(!previewMode)}
                          >
                            {previewMode ? "Edit Memory" : "Preview Memory"}
                          </Button>
                        </motion.div>
                      </div>
                    </motion.div>
                  </div>
                  
                  {previewMode && (
                    <motion.div 
                      className="mt-5 rounded-xl border border-white/10 overflow-hidden"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4 }}
                    >
                      <div className="relative">
                        <div 
                          className="p-5 bg-gradient-to-br rounded-t-xl"
                          style={{ 
                            backgroundImage: `linear-gradient(to bottom right, ${memoryColor}30, ${memoryColor}15)`,
                            fontFamily: memoryFont === 'serif' ? 'serif' : memoryFont === 'mono' ? 'monospace' : memoryFont === 'bold' ? 'sans-serif' : 'sans-serif',
                            fontWeight: memoryFont === 'bold' ? 'bold' : 'normal'
                          }}
                        >
                          <div className="flex justify-between items-start">
                            <h3 className={`text-xl font-medium text-white ${memoryFont === 'bold' ? 'font-bold' : ''}`}>
                              {selectedEmoji} {newTitle || "Untitled Memory"}
                            </h3>
                            <Badge className={`text-xs`} style={{ backgroundColor: `${memoryColor}70` }}>
                              {newCategory.charAt(0).toUpperCase() + newCategory.slice(1)}
                            </Badge>
                          </div>
                          
                          <div className="mt-3 text-gray-200">
                            {newContent || "Write your memory content here..."}
                          </div>
                          
                          {newTags && (
                            <div className="flex flex-wrap gap-1 mt-4">
                              {newTags.split(",").map((tag, i) => tag.trim()).filter(tag => tag).map((tag, i) => (
                                <Badge key={i} variant="outline" className="bg-black/30 text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}
                          
                          {selectedSticker && (
                            <motion.div 
                              className="absolute -bottom-4 -right-4 h-20 w-20"
                              initial={{ rotate: -10 }}
                              animate={{ rotate: [0, -5, 5, 0] }}
                              transition={{ duration: 5, repeat: Infinity, repeatType: "reverse" }}
                            >
                              <div className="absolute inset-0 flex items-center justify-center">
                                <Sparkles className="h-14 w-14 text-purple-400" style={{ color: memoryColor }} />
                              </div>
                            </motion.div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                  
                  <DialogFooter className="flex flex-col sm:flex-row gap-3 mt-6">
                    <Button variant="outline" className="border-white/10 text-white hover:bg-white/10" onClick={() => setIsCreateDialogOpen(false)}>
                      Cancel
                    </Button>
                    
                    <motion.div
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="w-full sm:w-auto"
                    >
                      <Button
                        className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700"
                        onClick={handleCreateMemory}
                        disabled={!newTitle || !newContent || !newCategory}
                      >
                        <motion.div 
                          animate={{ rotate: [0, 5, -5, 0] }}
                          transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                          className="mr-2"
                        >
                          <Sparkles className="h-4 w-4" />
                        </motion.div>
                        Save Memory
                      </Button>
                    </motion.div>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <motion.div 
              className="mt-6 flex flex-col sm:flex-row gap-3 items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="w-full sm:w-auto flex-grow relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search your memories..."
                  className="border-white/10 bg-white/5 backdrop-blur-lg pl-10 text-white placeholder:text-gray-400 w-full"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    setCurrentPage(1) // Reset to first page when searching
                  }}
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <div className="flex items-center">
                  <Filter className="mr-2 h-4 w-4 text-gray-400" />
                  <span className="text-gray-400 text-sm">Filter:</span>
                </div>
                {categories.map((category) => (
                  <motion.div
                    key={category}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant={selectedCategory === category ? "default" : "outline"}
                      size="sm"
                      className={`capitalize ${
                        selectedCategory === category
                          ? "bg-gradient-to-r from-purple-600/90 to-indigo-600/90 text-white"
                          : "border-white/10 text-gray-300 hover:bg-white/10"
                      }`}
                      onClick={() => {
                        setSelectedCategory(category)
                        setCurrentPage(1) // Reset to first page when filtering
                      }}
                    >
                      {category}
                    </Button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="flex flex-col items-center">
                <motion.div
                  className="mb-3 h-8 w-8 rounded-full border-2 border-t-transparent border-white animate-spin"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                <p className="text-gray-400">Loading your memories...</p>
              </div>
            </div>
          ) : error ? (
            <div className="rounded-lg bg-red-900/50 border border-red-500/50 p-6 text-center max-w-md mx-auto">
              <p className="text-white">Error loading memories. Please try again later.</p>
            </div>
          ) : filteredMemories.length === 0 ? (
            <motion.div 
              className="rounded-lg bg-indigo-900/20 backdrop-blur-md border border-indigo-500/20 p-8 text-center max-w-md mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <BrainCircuit className="mx-auto h-12 w-12 text-indigo-400 opacity-70 mb-3" />
              <h3 className="text-xl font-bold text-white mb-2">No memories found</h3>
              <p className="text-gray-400 mb-4">
                {searchQuery || selectedCategory !== "all"
                  ? "Try adjusting your search or filters"
                  : "You haven't saved any memories yet"}
              </p>
              {!searchQuery && selectedCategory === "all" && (
                <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700" onClick={() => setIsCreateDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create your first memory
                </Button>
              )}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <AnimatePresence mode="wait">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {currentMemories.map((memory) => (
                    <MemoryCard
                      key={memory.id}
                      memory={memory}
                      onEdit={handleEditClick}
                      onDelete={handleDeleteClick}
                      toast={toast}
                    />
                  ))}
                </div>
              </AnimatePresence>

              {totalPages > 1 && (
                <motion.div 
                  className="flex justify-center mt-8 gap-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <Button
                    variant="outline"
                    className="border-white/10 text-white hover:bg-white/10 w-10 h-10 p-0 rounded-full"
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                  <div className="flex items-center gap-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <motion.div
                        key={page}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button
                          variant={page === currentPage ? "default" : "outline"}
                          className={`w-10 h-10 p-0 rounded-full ${
                            page === currentPage
                              ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white"
                              : "border-white/10 text-white hover:bg-white/10"
                          }`}
                          onClick={() => setCurrentPage(page)}
                        >
                          {page}
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    className="border-white/10 text-white hover:bg-white/10 w-10 h-10 p-0 rounded-full"
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                </motion.div>
              )}
            </motion.div>
          )}
        </main>

        <MobileNavigation />
      </div>
      
      {/* Edit Memory Dialog */}
      {editingMemory && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="bg-gray-900/90 backdrop-blur-xl border border-white/10 sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
            <DialogHeader className="relative">
              <motion.div 
                className="absolute -top-10 -left-10 w-32 h-32 bg-gradient-to-br from-purple-500/30 to-blue-500/30 rounded-full blur-xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.7 }}
                transition={{ duration: 1 }}
              />
              <motion.div 
                className="absolute -bottom-20 -right-10 w-40 h-40 bg-gradient-to-br from-indigo-500/30 to-fuchsia-500/30 rounded-full blur-xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.7 }}
                transition={{ duration: 1, delay: 0.2 }}
              />
              
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.4 }}
              >
                <DialogTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-300">
                  Edit Memory
                </DialogTitle>
                <DialogDescription className="text-gray-400">
                  Enhance your memory with new details and styling.
                </DialogDescription>
              </motion.div>
            </DialogHeader>
            
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div 
                className="space-y-5"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <motion.button
                        whileTap={{ scale: 0.97 }}
                        onClick={() => setShowEditEmojiPicker(!showEditEmojiPicker)}
                        className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-600/80 to-indigo-600/80 flex items-center justify-center text-xl shadow-lg shadow-purple-600/20"
                      >
                        {editEmoji || "✨"}
                      </motion.button>
                      
                      {showEditEmojiPicker && (
                        <motion.div 
                          className="absolute top-12 left-0 z-10 bg-gray-800/90 backdrop-blur-lg border border-white/10 p-3 rounded-lg shadow-xl w-64"
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <div className="grid grid-cols-6 gap-2">
                            {commonEmojis.map((emoji) => (
                              <motion.button
                                key={emoji}
                                whileHover={{ scale: 1.2 }}
                                whileTap={{ scale: 0.9 }}
                                className="text-xl p-2 hover:bg-white/10 rounded-md transition-colors"
                                onClick={() => {
                                  setEditEmoji(emoji)
                                  setShowEditEmojiPicker(false)
                                }}
                              >
                                {emoji}
                              </motion.button>
                            ))}
                          </div>
                          <div className="mt-2 flex justify-between border-t border-white/10 pt-2">
                            <button 
                              className="text-xs text-purple-400 hover:text-purple-300"
                              onClick={() => setEditEmoji("")}
                            >
                              Clear
                            </button>
                            <button 
                              className="text-xs text-purple-400 hover:text-purple-300"
                              onClick={() => setShowEditEmojiPicker(false)}
                            >
                              Close
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </div>
                    
                    <Input
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      placeholder="Enter a captivating title..."
                      className="flex-1 border-white/10 bg-white/5 text-white rounded-lg focus:ring-2 focus:ring-purple-500/50 transition-all"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-white/80 flex items-center gap-1.5">
                    <motion.div 
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
                    >
                      💭
                    </motion.div>
                    Your thoughts
                  </Label>
                  <Textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    placeholder="Write your memory with as much detail as you wish..."
                    className="min-h-[180px] border-white/10 bg-white/5 text-white rounded-lg focus:ring-2 focus:ring-purple-500/50 transition-all"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-white/80">Category</Label>
                    <Select value={editCategory} onValueChange={setEditCategory}>
                      <SelectTrigger className="border-white/10 bg-white/5 text-white">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-900 text-white border-white/10">
                        <SelectItem value="thought">
                          <div className="flex items-center gap-2">
                            <span className="text-blue-400">💭</span> Thought
                          </div>
                        </SelectItem>
                        <SelectItem value="experience">
                          <div className="flex items-center gap-2">
                            <span className="text-purple-400">🌟</span> Experience
                          </div>
                        </SelectItem>
                        <SelectItem value="idea">
                          <div className="flex items-center gap-2">
                            <span className="text-green-400">💡</span> Idea
                          </div>
                        </SelectItem>
                        <SelectItem value="dream">
                          <div className="flex items-center gap-2">
                            <span className="text-indigo-400">🌙</span> Dream
                          </div>
                        </SelectItem>
                        <SelectItem value="goal">
                          <div className="flex items-center gap-2">
                            <span className="text-amber-400">🎯</span> Goal
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white/80">Mood</Label>
                    <Select value={editMood} onValueChange={setEditMood}>
                      <SelectTrigger className="border-white/10 bg-white/5 text-white">
                        <SelectValue placeholder="How do you feel?" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-900 text-white border-white/10">
                        {moods.map((mood) => (
                          <SelectItem key={mood.value} value={mood.value}>
                            <div className="flex items-center gap-2">
                              <span>{mood.icon}</span> {mood.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-white/80 flex items-center gap-1.5">
                    <motion.div 
                      animate={{ y: [0, -3, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      🏷️
                    </motion.div>
                    Tags
                  </Label>
                  <Input
                    value={editTags}
                    onChange={(e) => setEditTags(e.target.value)}
                    placeholder="work, inspiration, future, etc."
                    className="border-white/10 bg-white/5 text-white"
                  />
                </div>
              </motion.div>
              
              <motion.div 
                className="space-y-5"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <div className="rounded-xl border border-white/10 p-4 h-full bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-sm">
                  <h3 className="text-white font-medium mb-3 flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-purple-400" />
                    Personalize Your Memory
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <Label className="text-white/80 text-sm mb-2 block">Choose a sticker</Label>
                      <div className="relative">
                        <motion.div 
                          className="grid grid-cols-4 gap-2"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ staggerChildren: 0.1, delayChildren: 0.2 }}
                        >
                          {stickers.slice(0, 4).map((sticker, index) => (
                            <motion.button
                              key={sticker}
                              initial={{ scale: 0, rotate: -10 }}
                              animate={{ scale: 1, rotate: 0 }}
                              whileHover={{ scale: 1.1, y: -5 }}
                              whileTap={{ scale: 0.95 }}
                              transition={{ type: "spring", stiffness: 400, damping: 10 }}
                              className={`h-16 w-16 rounded-lg flex items-center justify-center p-2 ${
                                editSticker === sticker 
                                  ? 'ring-2 ring-purple-500 bg-purple-500/20' 
                                  : 'bg-white/5 hover:bg-white/10'
                              }`}
                              onClick={() => setEditSticker(sticker)}
                            >
                              <div className="h-12 w-12 relative">
                                {/* Placeholder for sticker */}
                                <div className="absolute inset-0 flex items-center justify-center">
                                  {index === 0 && <BrainCircuit className="h-10 w-10 text-purple-400" />}
                                  {index === 1 && <Lightbulb className="h-10 w-10 text-amber-400" />}
                                  {index === 2 && <Star className="h-10 w-10 text-blue-400" />}
                                  {index === 3 && <Zap className="h-10 w-10 text-pink-400" />}
                                </div>
                              </div>
                            </motion.button>
                          ))}
                        </motion.div>
                        
                        <Button
                          variant="link"
                          className="text-xs text-purple-400 mt-1 p-0 h-auto hover:text-purple-300"
                          onClick={() => setShowEditStickerPicker(!showEditStickerPicker)}
                        >
                          {showEditStickerPicker ? "Hide stickers" : "More stickers..."}
                        </Button>
                        
                        {showEditStickerPicker && (
                          <motion.div 
                            className="absolute top-full left-0 right-0 z-10 bg-gray-800/90 backdrop-blur-lg border border-white/10 p-3 rounded-lg shadow-xl mt-2"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <div className="grid grid-cols-4 gap-2">
                              {stickers.slice(4).map((sticker, index) => (
                                <motion.button
                                  key={sticker}
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  className={`h-14 w-14 rounded-lg flex items-center justify-center p-2 ${
                                    editSticker === sticker 
                                      ? 'ring-2 ring-purple-500 bg-purple-500/20' 
                                      : 'bg-white/5 hover:bg-white/10'
                                  }`}
                                  onClick={() => {
                                    setEditSticker(sticker)
                                    setShowEditStickerPicker(false)
                                  }}
                                >
                                  <div className="relative h-10 w-10 flex items-center justify-center">
                                    {index === 0 && <HeartHandshake className="h-9 w-9 text-red-400" />}
                                    {index === 1 && <CloudSun className="h-9 w-9 text-yellow-400" />}
                                    {index === 2 && <Target className="h-9 w-9 text-green-400" />}
                                    {index === 3 && <Sparkles className="h-9 w-9 text-indigo-400" />}
                                  </div>
                                </motion.button>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <Label className="text-white/80 text-sm mb-2 block">Memory color</Label>
                      <div className="flex flex-wrap gap-2">
                        {["#6d28d9", "#8b5cf6", "#ec4899", "#f43f5e", "#0ea5e9", "#14b8a6", "#f59e0b", "#84cc16"].map((color) => (
                          <motion.button
                            key={color}
                            whileHover={{ scale: 1.1, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            className={`h-8 w-8 rounded-full ${editMemoryColor === color ? 'ring-2 ring-white' : ''}`}
                            style={{ backgroundColor: color }}
                            onClick={() => setEditMemoryColor(color)}
                          />
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <Label className="text-white/80 text-sm mb-2 block">Font style</Label>
                      <div className="flex flex-wrap gap-2">
                        <Button
                          variant="outline" 
                          size="sm"
                          className={`text-white border-white/10 ${editMemoryFont === 'default' ? 'bg-white/20' : 'bg-transparent'}`}
                          onClick={() => setEditMemoryFont('default')}
                        >
                          Default
                        </Button>
                        <Button
                          variant="outline" 
                          size="sm"
                          className={`text-white border-white/10 font-serif ${editMemoryFont === 'serif' ? 'bg-white/20' : 'bg-transparent'}`}
                          onClick={() => setEditMemoryFont('serif')}
                        >
                          Serif
                        </Button>
                        <Button
                          variant="outline" 
                          size="sm"
                          className={`text-white border-white/10 font-mono ${editMemoryFont === 'mono' ? 'bg-white/20' : 'bg-transparent'}`}
                          onClick={() => setEditMemoryFont('mono')}
                        >
                          Mono
                        </Button>
                        <Button
                          variant="outline" 
                          size="sm"
                          className={`text-white border-white/10 font-bold ${editMemoryFont === 'bold' ? 'bg-white/20' : 'bg-transparent'}`}
                          onClick={() => setEditMemoryFont('bold')}
                        >
                          Bold
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <motion.div 
                    className="mt-6"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <Button
                      className="w-full bg-white/10 backdrop-blur-lg text-white hover:bg-white/20 border border-white/10"
                      onClick={() => setEditPreviewMode(!editPreviewMode)}
                    >
                      {editPreviewMode ? "Edit Memory" : "Preview Memory"}
                    </Button>
                  </motion.div>
                </div>
              </motion.div>
            </div>
            
            {editPreviewMode && (
              <motion.div 
                className="mt-5 rounded-xl border border-white/10 overflow-hidden"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
              >
                <div className="relative">
                  <div 
                    className="p-5 bg-gradient-to-br rounded-t-xl"
                    style={{ 
                      backgroundImage: `linear-gradient(to bottom right, ${editMemoryColor}30, ${editMemoryColor}15)`,
                      fontFamily: editMemoryFont === 'serif' ? 'serif' : editMemoryFont === 'mono' ? 'monospace' : editMemoryFont === 'bold' ? 'sans-serif' : 'sans-serif',
                      fontWeight: editMemoryFont === 'bold' ? 'bold' : 'normal'
                    }}
                  >
                    <div className="flex justify-between items-start">
                      <h3 className={`text-xl font-medium text-white ${editMemoryFont === 'bold' ? 'font-bold' : ''}`}>
                        {editEmoji} {editTitle || "Untitled Memory"}
                      </h3>
                      <Badge className={`text-xs`} style={{ backgroundColor: `${editMemoryColor}70` }}>
                        {editCategory.charAt(0).toUpperCase() + editCategory.slice(1)}
                      </Badge>
                    </div>
                    
                    <div className="mt-3 text-gray-200">
                      {editContent || "Write your memory content here..."}
                    </div>
                    
                    {editTags && (
                      <div className="flex flex-wrap gap-1 mt-4">
                        {editTags.split(",").map((tag, i) => tag.trim()).filter(tag => tag).map((tag, i) => (
                          <Badge key={i} variant="outline" className="bg-black/30 text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                    
                    {editSticker && (
                      <motion.div 
                        className="absolute -bottom-4 -right-4 h-20 w-20"
                        initial={{ rotate: -10 }}
                        animate={{ rotate: [0, -5, 5, 0] }}
                        transition={{ duration: 5, repeat: Infinity, repeatType: "reverse" }}
                      >
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Sparkles className="h-14 w-14 text-purple-400" style={{ color: editMemoryColor }} />
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
            
            <DialogFooter className="flex flex-col sm:flex-row gap-3 mt-6">
              <Button variant="outline" className="border-white/10 text-white hover:bg-white/10" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="w-full sm:w-auto"
              >
                <Button
                  className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700"
                  onClick={handleSaveEdit}
                  disabled={!editTitle || !editContent || !editCategory}
                >
                  <motion.div 
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                    className="mr-2"
                  >
                    <Sparkles className="h-4 w-4" />
                  </motion.div>
                  Save Changes
                </Button>
              </motion.div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="bg-gray-900/90 backdrop-blur-xl border border-white/10 max-w-md overflow-hidden">
          <DialogHeader className="relative">
            <motion.div 
              className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-red-500/30 to-orange-500/30 rounded-full blur-xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              transition={{ duration: 1 }}
            />
            
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.2, 1] }}
                transition={{ duration: 0.5, type: "spring" }}
                className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center mb-4"
              >
                <Trash2 className="text-red-400 h-8 w-8" />
              </motion.div>
              
              <DialogTitle className="text-center text-xl font-bold text-white">
                Delete Memory
              </DialogTitle>
              <DialogDescription className="text-center text-gray-400 mt-2">
                Are you sure you want to delete this memory? <br />
                This action cannot be undone.
              </DialogDescription>
            </motion.div>
          </DialogHeader>
          
          <div className="my-6 relative">
            <motion.div 
              className="bg-red-500/5 border border-red-500/20 rounded-lg p-4"
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <motion.p 
                className="text-white/70 text-sm text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                Deleting this memory will permanently remove it from your neural archives.
                This data cannot be recovered.
              </motion.p>
            </motion.div>
          </div>
          
          <DialogFooter className="flex flex-col sm:flex-row gap-3">
            <motion.div 
              className="w-full sm:w-auto order-2 sm:order-1"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <Button 
                variant="outline" 
                onClick={() => setIsDeleteDialogOpen(false)} 
                className="w-full sm:w-auto border-white/10 text-white hover:bg-white/10"
              >
                Cancel
              </Button>
            </motion.div>
            
            <motion.div 
              className="w-full sm:w-auto order-1 sm:order-2"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <Button 
                onClick={handleConfirmDelete} 
                className="w-full sm:w-auto bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Forever
              </Button>
            </motion.div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
