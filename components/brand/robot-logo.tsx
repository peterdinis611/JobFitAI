"use client"

import { motion } from "motion/react"
import { cn } from "@/lib/utils"

type RobotLogoProps = {
  className?: string
  size?: number
  /** Show continuous idle animation */
  animated?: boolean
  /** Use light colors for dark/primary backgrounds */
  inverted?: boolean
}

export function RobotLogo({ className, size = 32, animated = true, inverted = false }: RobotLogoProps) {
  const stroke = inverted ? "stroke-primary-foreground" : "stroke-primary"
  const fill = inverted ? "fill-primary-foreground" : "fill-primary"
  const fillSoft = inverted ? "fill-primary-foreground/15" : "fill-primary/15"
  const fillBody = inverted ? "fill-primary-foreground/10" : "fill-primary/10"
  const eyeBlink = animated
    ? { scaleY: [1, 1, 0.12, 1, 1], transition: { duration: 3.2, repeat: Infinity, times: [0, 0.88, 0.92, 0.96, 1] } }
    : undefined

  const antennaWiggle = animated
    ? { rotate: [-8, 8, -8], transition: { duration: 2.4, repeat: Infinity, ease: "easeInOut" as const } }
    : undefined

  const bodyBob = animated
    ? { y: [0, -1.5, 0], transition: { duration: 2.8, repeat: Infinity, ease: "easeInOut" as const } }
    : undefined

  return (
    <svg
      viewBox="0 0 32 32"
      width={size}
      height={size}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0", className)}
      aria-hidden
    >
      {/* Antenna */}
      <motion.g
        style={{ originX: "16px", originY: "6px" }}
        animate={antennaWiggle}
      >
        <line x1="16" y1="8" x2="16" y2="3" className={stroke} strokeWidth="1.75" strokeLinecap="round" />
        <motion.circle
          cx="16"
          cy="2.5"
          r="2"
          className={fill}
          animate={animated ? { opacity: [1, 0.45, 1] } : undefined}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.g>

      {/* Head + body */}
      <motion.g animate={bodyBob}>
        <rect
          x="7"
          y="8"
          width="18"
          height="14"
          rx="4.5"
          className={cn(fillSoft, stroke)}
          strokeWidth="1.75"
        />

        {/* Eyes */}
        <motion.rect
          x="11"
          y="13"
          width="3.5"
          height="3.5"
          rx="1"
          className={fill}
          style={{ originX: "12.75px", originY: "14.75px" }}
          animate={eyeBlink}
        />
        <motion.rect
          x="17.5"
          y="13"
          width="3.5"
          height="3.5"
          rx="1"
          className={fill}
          style={{ originX: "19.25px", originY: "14.75px" }}
          animate={eyeBlink}
        />

        {/* Smile */}
        <path
          d="M12 18.5 Q16 21 20 18.5"
          className={stroke}
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
        />

        {/* Body */}
        <rect
          x="9"
          y="23"
          width="14"
          height="7"
          rx="3"
          className={cn(fillBody, stroke)}
          strokeWidth="1.75"
        />

        {/* Chest light */}
        <motion.circle
          cx="16"
          cy="26.5"
          r="1.75"
          className={fill}
          animate={animated ? { scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] } : undefined}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Arms */}
        <motion.g
          animate={animated ? { rotate: [-6, 6, -6] } : undefined}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          style={{ originX: "7px", originY: "25px" }}
        >
          <line x1="7" y1="24" x2="4" y2="27" className={stroke} strokeWidth="1.75" strokeLinecap="round" />
        </motion.g>
        <motion.g
          animate={animated ? { rotate: [6, -6, 6] } : undefined}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
          style={{ originX: "25px", originY: "25px" }}
        >
          <line x1="25" y1="24" x2="28" y2="27" className={stroke} strokeWidth="1.75" strokeLinecap="round" />
        </motion.g>
      </motion.g>
    </svg>
  )
}

export function RobotLogoMark({
  className,
  inverted = false,
}: {
  className?: string
  inverted?: boolean
}) {
  return (
    <motion.span
      className={cn(
        "flex size-8 items-center justify-center rounded-lg ring-1",
        inverted
          ? "bg-primary-foreground/10 ring-primary-foreground/20"
          : "bg-primary/10 ring-primary/15",
        className,
      )}
      whileHover={{ scale: 1.06, rotate: -3 }}
      transition={{ type: "spring", stiffness: 420, damping: 16 }}
    >
      <RobotLogo size={22} inverted={inverted} />
    </motion.span>
  )
}
