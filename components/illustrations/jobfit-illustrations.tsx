"use client"

import { motion } from "motion/react"
import { cn } from "@/lib/utils"

export function AuthHeroIllustration({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 480 360"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("w-full max-w-md", className)}
      aria-hidden
    >
      <defs>
        <linearGradient id="docGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="oklch(0.72 0.12 195)" />
          <stop offset="100%" stopColor="oklch(0.55 0.14 210)" />
        </linearGradient>
        <linearGradient id="jobGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="oklch(0.78 0.14 55)" />
          <stop offset="100%" stopColor="oklch(0.68 0.16 45)" />
        </linearGradient>
      </defs>

      <motion.circle
        cx="240"
        cy="180"
        r="120"
        className="fill-teal-500/5 stroke-teal-500/20"
        strokeWidth="1.5"
        animate={{ scale: [1, 1.04, 1], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.g
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <rect x="72" y="88" width="120" height="156" rx="14" fill="url(#docGrad)" opacity="0.9" />
        <rect x="92" y="118" width="72" height="8" rx="4" fill="white" opacity="0.85" />
        <rect x="92" y="138" width="80" height="6" rx="3" fill="white" opacity="0.55" />
        <rect x="92" y="154" width="64" height="6" rx="3" fill="white" opacity="0.55" />
        <rect x="92" y="170" width="72" height="6" rx="3" fill="white" opacity="0.55" />
        <rect x="92" y="186" width="56" height="6" rx="3" fill="white" opacity="0.55" />
      </motion.g>

      <motion.g
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
      >
        <rect x="288" y="104" width="120" height="140" rx="14" fill="url(#jobGrad)" opacity="0.9" />
        <rect x="308" y="132" width="72" height="8" rx="4" fill="white" opacity="0.85" />
        <rect x="308" y="152" width="80" height="6" rx="3" fill="white" opacity="0.55" />
        <rect x="308" y="168" width="64" height="6" rx="3" fill="white" opacity="0.55" />
        <rect x="308" y="184" width="72" height="6" rx="3" fill="white" opacity="0.55" />
      </motion.g>

      <motion.path
        d="M192 168 C220 168 220 192 248 192"
        stroke="oklch(0.55 0.14 200)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeDasharray="6 6"
        animate={{ strokeDashoffset: [0, -24] }}
        transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
      />
      <motion.circle
        cx="220"
        cy="180"
        r="18"
        className="fill-teal-500/15 stroke-teal-600"
        strokeWidth="2"
        animate={{ scale: [1, 1.12, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      <text x="220" y="185" textAnchor="middle" className="fill-teal-700 text-[11px] font-bold" fontSize="11">
        AI
      </text>
    </svg>
  )
}

export function EmptySearchIllustration({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 160" className={cn("h-36 w-36", className)} aria-hidden>
      <motion.g animate={{ y: [0, -5, 0] }} transition={{ duration: 3, repeat: Infinity }}>
        <rect x="50" y="40" width="80" height="64" rx="10" className="fill-muted stroke-border" strokeWidth="1.5" />
        <circle cx="90" cy="72" r="18" className="stroke-teal-600 fill-teal-500/10" strokeWidth="2" fill="none" />
        <line x1="102" y1="84" x2="114" y2="96" className="stroke-teal-600" strokeWidth="2.5" strokeLinecap="round" />
      </motion.g>
      <motion.path
        d="M30 120 Q100 100 170 120"
        className="stroke-teal-500/30"
        strokeWidth="1.5"
        fill="none"
        strokeDasharray="4 6"
        animate={{ strokeDashoffset: [0, -20] }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      />
    </svg>
  )
}

export function AnalyzingIllustration({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 160" className={cn("h-36 w-36", className)} aria-hidden>
      <rect x="40" y="30" width="120" height="90" rx="12" className="fill-muted/80 stroke-border" strokeWidth="1.5" />
      {[0, 1, 2, 3].map((i) => (
        <motion.rect
          key={i}
          x={56}
          y={48 + i * 16}
          width={88 - i * 8}
          height="6"
          rx="3"
          className="fill-teal-500/40"
          animate={{ opacity: [0.3, 1, 0.3], scaleX: [0.85, 1, 0.85] }}
          transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.15 }}
          style={{ transformOrigin: "56px center" }}
        />
      ))}
      <motion.rect
        x="40"
        y="30"
        width="120"
        height="4"
        rx="2"
        className="fill-teal-500"
        animate={{ y: [30, 116, 30] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        opacity={0.7}
      />
    </svg>
  )
}

export function UploadIllustration({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 160" className={cn("h-32 w-32", className)} aria-hidden>
      <motion.path
        d="M100 110 L100 58 M100 58 L82 76 M100 58 L118 76"
        className="stroke-teal-600"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
      />
      <path
        d="M60 110 Q100 90 140 110"
        className="stroke-border fill-muted/50"
        strokeWidth="2"
        fill="none"
      />
      <motion.rect
        x="72"
        y="108"
        width="56"
        height="32"
        rx="8"
        className="fill-teal-500/15 stroke-teal-600/40"
        strokeWidth="1.5"
        animate={{ scale: [1, 1.03, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
    </svg>
  )
}

export function MatchPulseIllustration({ score, className }: { score: number; className?: string }) {
  const color =
    score >= 85 ? "#10b981" : score >= 70 ? "#0d9488" : score >= 50 ? "#d97706" : "#e11d48"

  return (
    <svg viewBox="0 0 120 120" className={cn("h-28 w-28", className)} aria-hidden>
      <circle cx="60" cy="60" r="48" className="fill-muted/50" />
      <motion.circle
        cx="60"
        cy="60"
        r="48"
        fill="none"
        stroke={color}
        strokeWidth="6"
        strokeLinecap="round"
        strokeDasharray={`${(score / 100) * 301} 301`}
        transform="rotate(-90 60 60)"
        initial={{ strokeDasharray: "0 301" }}
        animate={{ strokeDasharray: `${(score / 100) * 301} 301` }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      />
      <motion.text
        x="60"
        y="66"
        textAnchor="middle"
        fontSize="22"
        fontWeight="700"
        fill={color}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        {score}%
      </motion.text>
    </svg>
  )
}
