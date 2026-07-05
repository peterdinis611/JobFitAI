"use client"

import { Toaster as Sonner } from "sonner"

export function Toaster() {
  return (
    <Sonner
      position="bottom-right"
      toastOptions={{
        classNames: {
          toast:
            "mac-panel !rounded-xl !border-border !bg-card !text-foreground !shadow-lg !text-[13px]",
        },
      }}
    />
  )
}
