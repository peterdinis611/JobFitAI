"use client"

import Lottie from "lottie-react"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

type LottiePlayerProps = {
  animationData?: object
  src?: string
  className?: string
  loop?: boolean
  autoplay?: boolean
}

export function LottiePlayer({
  animationData,
  src,
  className,
  loop = true,
  autoplay = true,
}: LottiePlayerProps) {
  const [data, setData] = useState<object | null>(animationData ?? null)

  useEffect(() => {
    if (animationData) {
      setData(animationData)
      return
    }
    if (!src) return

    let cancelled = false
    void fetch(src)
      .then((res) => res.json())
      .then((json) => {
        if (!cancelled) setData(json)
      })
      .catch(() => {
        if (!cancelled) setData(null)
      })

    return () => {
      cancelled = true
    }
  }, [animationData, src])

  if (!data) return <div className={cn("mx-auto animate-pulse rounded-full bg-muted", className)} />

  return (
    <Lottie
      animationData={data}
      loop={loop}
      autoplay={autoplay}
      className={cn("mx-auto", className)}
    />
  )
}
