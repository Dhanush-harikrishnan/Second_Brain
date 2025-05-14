"use client"

import { UserProfile } from "@clerk/nextjs"

export default function UserProfilePage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black p-4">
      <UserProfile
        appearance={{
          elements: {
            rootBox: "mx-auto",
            card: "bg-black/40 backdrop-blur-xl border border-gray-800 shadow-xl",
            navbar: "bg-gray-900",
            navbarButton: "text-white",
            pageTitle: "text-white",
            formFieldLabel: "text-gray-300",
            formFieldInput: "bg-black/50 border-gray-700 text-white",
            accordionTriggerButton: "bg-gray-900 text-white hover:bg-gray-800",
            userPreviewMainIdentifier: "text-white",
            userPreviewSecondaryIdentifier: "text-gray-400",
            headerTitle: "text-white",
            headerSubtitle: "text-gray-400",
            dividerLine: "bg-gray-700",
            dividerText: "text-gray-400",
            formButtonPrimary: "bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500",
            formButtonReset: "border border-gray-700 text-white hover:bg-gray-800",
          },
        }}
      />
    </div>
  )
}
