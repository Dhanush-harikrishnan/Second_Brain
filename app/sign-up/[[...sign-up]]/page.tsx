"use client"

import { SignUp } from "@clerk/nextjs"

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black">
      <div className="w-full max-w-md p-6">
        <SignUp
          appearance={{
            elements: {
              rootBox: "mx-auto",
              card: "bg-black/40 backdrop-blur-xl border border-gray-800 shadow-xl",
              headerTitle: "text-white",
              headerSubtitle: "text-gray-400",
              socialButtonsBlockButton: "border-gray-700 text-white hover:bg-gray-800",
              socialButtonsBlockButtonText: "text-white",
              dividerLine: "bg-gray-700",
              dividerText: "text-gray-400",
              formFieldLabel: "text-gray-300",
              formFieldInput: "bg-black/50 border-gray-700 text-white",
              footerActionLink: "text-indigo-400 hover:text-indigo-300",
              formButtonPrimary: "bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500",
            },
          }}
        />
      </div>
    </div>
  )
}
