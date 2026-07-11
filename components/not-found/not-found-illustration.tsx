"use client"

import { motion } from "motion/react"
import { cn } from "@/lib/utils"

export function NotFoundIllustration({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 420 280"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("w-full max-w-sm", className)}
      aria-hidden
    >
      <defs>
        <linearGradient id="nf-screen" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.12" />
          <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.04" />
        </linearGradient>
        <linearGradient id="nf-beam" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="var(--primary)" stopOpacity="0" />
          <stop offset="50%" stopColor="var(--primary)" stopOpacity="0.35" />
          <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
        </linearGradient>
      </defs>

      <motion.circle
        cx="210"
        cy="140"
        r="108"
        className="stroke-primary/15"
        strokeWidth="1.5"
        fill="url(#nf-screen)"
        animate={{ scale: [1, 1.03, 1], opacity: [0.55, 0.85, 0.55] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.g
        animate={{ rotate: 360 }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
        style={{ originX: "210px", originY: "140px" }}
      >
        <path
          d="M210 140 L210 52"
          className="stroke-primary/25"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <motion.circle
          cx="210"
          cy="52"
          r="5"
          className="fill-primary/40"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.g>

      <motion.rect
        x="118"
        y="78"
        width="184"
        height="124"
        rx="14"
        className="fill-card stroke-border"
        strokeWidth="1.5"
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
      />
      <rect x="118" y="78" width="184" height="28" rx="14" className="fill-muted" />
      <rect x="118" y="94" width="184" height="12" className="fill-muted" />
      <g className="mac-traffic-lights" transform="translate(132, 86)">
        <circle cx="0" cy="6" r="5" fill="#ff5f57" />
        <circle cx="16" cy="6" r="5" fill="#febc2e" />
        <circle cx="32" cy="6" r="5" fill="#28c840" />
      </g>

      <motion.text
        x="210"
        y="158"
        textAnchor="middle"
        className="fill-primary font-bold"
        fontSize="42"
        fontWeight="700"
        animate={{ opacity: [0.65, 1, 0.65] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
      >
        404
      </motion.text>
      <text
        x="210"
        y="182"
        textAnchor="middle"
        className="fill-muted-foreground"
        fontSize="11"
        fontWeight="500"
      >
        Page not found
      </text>

      <motion.rect
        x="130"
        y="196"
        width="160"
        height="3"
        rx="1.5"
        className="fill-muted"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.rect
        x="130"
        y="196"
        width="48"
        height="3"
        rx="1.5"
        className="fill-primary/60"
        animate={{ x: [130, 242, 130] }}
        transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.g
        animate={{ x: [0, 6, 0], y: [0, -3, 0] }}
        transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
      >
        <rect x="72" y="168" width="44" height="52" rx="10" className="fill-primary/10 stroke-primary/30" strokeWidth="1.5" />
        <circle cx="94" cy="186" r="5" className="fill-primary/25" />
        <circle cx="106" cy="186" r="5" className="fill-primary/25" />
        <path d="M88 202 Q94 208 100 202" className="stroke-primary/40" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        <line x1="94" y1="168" x2="94" y2="158" className="stroke-primary" strokeWidth="1.5" strokeLinecap="round" />
        <motion.circle
          cx="94"
          cy="154"
          r="3"
          className="fill-primary"
          animate={{ opacity: [1, 0.35, 1] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.g>

      <motion.g
        animate={{ rotate: [-8, 12, -8] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        style={{ originX: "318px", originY: "198px" }}
      >
        <circle cx="318" cy="198" r="22" className="fill-card stroke-border" strokeWidth="1.5" />
        <circle cx="318" cy="198" r="14" className="stroke-primary/50" strokeWidth="2" fill="none" />
        <line x1="334" y1="214" x2="348" y2="228" className="stroke-border" strokeWidth="3" strokeLinecap="round" />
      </motion.g>

      <motion.path
        d="M148 228 C170 210 250 210 272 228"
        className="stroke-primary/20"
        strokeWidth="1.5"
        strokeDasharray="5 7"
        fill="none"
        animate={{ strokeDashoffset: [0, -24] }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      />

      {[0, 1, 2].map((i) => (
        <motion.circle
          key={i}
          cx={160 + i * 44}
          cy={236}
          r="3"
          className="fill-primary/30"
          animate={{ y: [0, -8, 0], opacity: [0.3, 0.9, 0.3] }}
          transition={{
            duration: 2.2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.35,
          }}
        />
      ))}
    </svg>
  )
}
