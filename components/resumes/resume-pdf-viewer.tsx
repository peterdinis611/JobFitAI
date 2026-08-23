"use client"

import { PDFViewer } from "@embedpdf/react-pdf-viewer"
import { useTheme } from "next-themes"

export function ResumePdfViewer({ src }: { src: string }) {
  const { resolvedTheme } = useTheme()

  return (
    <PDFViewer
      className="h-full w-full"
      style={{ height: "100%", width: "100%" }}
      config={{
        src,
        tabBar: "never",
        theme: {
          preference: resolvedTheme === "dark" ? "dark" : "light",
        },
        disabledCategories: [
          "annotation",
          "redaction",
          "insert",
          "form",
          "document-open",
          "document-close",
        ],
      }}
    />
  )
}
