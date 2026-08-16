"use client"

import { motion } from "motion/react"

const ease = [0.22, 1, 0.36, 1] as const

/** Shared atmosphere for the auth signal-deck surfaces. */
export function AuthAtmosphere() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[var(--auth-bg)]" />

      {/* Diagonal beam */}
      <div className="absolute -top-[20%] left-1/2 h-[140%] w-[55%] -translate-x-1/2 rotate-[-18deg] bg-[linear-gradient(90deg,transparent,color-mix(in_srgb,var(--auth-accent)_18%,transparent),transparent)]" />

      {/* Mesh orbs */}
      <motion.div
        className="absolute -top-32 -left-24 size-[34rem] rounded-full bg-[radial-gradient(circle,color-mix(in_srgb,var(--auth-accent)_28%,transparent),transparent_68%)]"
        animate={{ opacity: [0.55, 0.85, 0.55], scale: [1, 1.05, 1] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute right-[-10%] bottom-[-15%] size-[28rem] rounded-full bg-[radial-gradient(circle,color-mix(in_srgb,var(--auth-signal)_22%,transparent),transparent_70%)]"
        animate={{ opacity: [0.35, 0.65, 0.35], x: [0, -30, 0] }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Instrument grid */}
      <div
        className="absolute inset-0 opacity-[0.45]"
        style={{
          backgroundImage: `
            linear-gradient(to right, var(--auth-line) 1px, transparent 1px),
            linear-gradient(to bottom, var(--auth-line) 1px, transparent 1px)
          `,
          backgroundSize: "56px 56px",
          maskImage: "radial-gradient(ellipse 80% 70% at 40% 45%, black 20%, transparent 75%)",
        }}
      />

      {/* Hairline frame ticks */}
      <div className="absolute top-6 right-6 bottom-6 left-6 border border-[var(--auth-line)]" />
      <div className="absolute top-6 left-6 h-3 w-3 border-t border-l border-[var(--auth-accent)]" />
      <div className="absolute top-6 right-6 h-3 w-3 border-t border-r border-[var(--auth-accent)]" />
      <div className="absolute bottom-6 left-6 h-3 w-3 border-b border-l border-[var(--auth-signal)]" />
      <div className="absolute right-6 bottom-6 h-3 w-3 border-r border-b border-[var(--auth-signal)]" />

      {/* Film grain */}
      <div
        className="absolute inset-0 opacity-[0.07] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      {/* Sweep scan */}
      <motion.div
        className="absolute inset-y-0 w-px bg-[linear-gradient(to_bottom,transparent,var(--auth-accent),transparent)] opacity-60"
        initial={{ left: "8%" }}
        animate={{ left: ["8%", "88%", "8%"] }}
        transition={{ duration: 14, repeat: Infinity, ease }}
      />
    </div>
  )
}
