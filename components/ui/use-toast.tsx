"use client"

import { useState, createContext, useContext } from "react"
import { X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface Toast {
  id: string
  title: string
  description?: string
  variant?: "default" | "destructive" | "success"
}

interface ToastContextType {
  toasts: Toast[]
  toast: (toast: Omit<Toast, "id">) => void
  dismiss: (id: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const toast = (newToast: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).substring(2, 9)
    setToasts((prev) => [...prev, { ...newToast, id }])

    // Auto dismiss after 5 seconds
    setTimeout(() => {
      dismiss(id)
    }, 5000)
  }

  const dismiss = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }

  return (
    <ToastContext.Provider value={{ toasts, toast, dismiss }}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  )
}

function ToastContainer() {
  const context = useContext(ToastContext)
  if (!context) return null

  const { toasts, dismiss } = context

  return (
    <div className="fixed bottom-0 right-0 z-50 p-4 max-w-md w-full pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="pointer-events-auto mb-2"
          >
            <div
              className={`rounded-lg p-4 shadow-lg ${
                toast.variant === "destructive"
                  ? "bg-red-600 text-white"
                  : toast.variant === "success"
                  ? "bg-green-600 text-white"
                  : "bg-white/10 backdrop-blur-lg text-white border border-white/10"
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{toast.title}</h3>
                  {toast.description && (
                    <p className="text-sm mt-1 opacity-90">{toast.description}</p>
                  )}
                </div>
                <button
                  onClick={() => dismiss(toast.id)}
                  className="ml-4 p-1 rounded-full hover:bg-black/20 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
} 