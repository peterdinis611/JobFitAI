"use client"

import { motion, useReducedMotion } from "motion/react"
import { RobotLogo } from "@/components/brand/robot-logo"
import { cn } from "@/lib/utils"

const ease = [0.16, 1, 0.3, 1] as const

type AppPreloaderProps = {
  className?: string
  /** Shorter copy under the mark */
  label?: string
  /** Use auth-deck tokens when rendered on the marketing gate */
  deck?: boolean
}

/**
 * Full-viewport boot / auth preload — concentric calibration rings + mark.
 */
export function AppPreloader({
  className,
  label = "Calibrating",
  deck = false,
}: AppPreloaderProps) {
  const reduceMotion = useReducedMotion()

  return (
    <div
      className={cn(
        "relative flex min-h-dvh flex-col items-center justify-center overflow-hidden",
        deck ? "bg-[var(--auth-bg)] text-[var(--auth-fg)]" : "bg-background text-foreground",
        className,
      )}
      role="status"
      aria-live="polite"
      aria-label={label}
    >
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div
          className={cn(
            "absolute inset-0",
            deck
              ? "bg-[radial-gradient(ellipse_60%_50%_at_50%_45%,color-mix(in_srgb,var(--auth-accent)_18%,transparent),transparent_70%)]"
              : "bg-[radial-gradient(ellipse_60%_50%_at_50%_45%,color-mix(in_srgb,var(--primary)_14%,transparent),transparent_70%)]",
          )}
        />
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: deck
              ? "linear-gradient(to right, var(--auth-line) 1px, transparent 1px), linear-gradient(to bottom, var(--auth-line) 1px, transparent 1px)"
              : "linear-gradient(to right, color-mix(in srgb, var(--foreground) 6%, transparent) 1px, transparent 1px), linear-gradient(to bottom, color-mix(in srgb, var(--foreground) 6%, transparent) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
            maskImage: "radial-gradient(circle at center, black, transparent 68%)",
          }}
        />
      </div>

      <div className="relative flex flex-col items-center gap-8">
        <div className="relative flex size-36 items-center justify-center sm:size-40">
          {/* Outer pulse rings */}
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className={cn(
                "absolute inset-0 rounded-full border",
                deck ? "border-[var(--auth-accent)]" : "border-primary",
              )}
              initial={reduceMotion ? { opacity: 0.2, scale: 1 } : { opacity: 0.55, scale: 0.72 }}
              animate={
                reduceMotion
                  ? { opacity: 0.25 }
                  : { opacity: [0.5, 0, 0], scale: [0.72, 1.35, 1.35] }
              }
              transition={{
                duration: 2.2,
                repeat: Infinity,
                delay: i * 0.55,
                ease: "easeOut",
              }}
            />
          ))}

          {/* Spinning arc */}
          {!reduceMotion ? (
            <motion.svg
              viewBox="0 0 160 160"
              className="absolute inset-0 size-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 2.8, repeat: Infinity, ease: "linear" }}
            >
              <circle
                cx="80"
                cy="80"
                r="68"
                fill="none"
                stroke={deck ? "var(--auth-line)" : "var(--border)"}
                strokeWidth="1.5"
              />
              <circle
                cx="80"
                cy="80"
                r="68"
                fill="none"
                stroke={deck ? "var(--auth-accent)" : "var(--primary)"}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeDasharray="48 380"
              />
            </motion.svg>
          ) : null}

          {/* Counter-spin tick ring */}
          {!reduceMotion ? (
            <motion.svg
              viewBox="0 0 160 160"
              className="absolute inset-[10%] size-[80%]"
              animate={{ rotate: -360 }}
              transition={{ duration: 7, repeat: Infinity, ease: "linear" }}
            >
              <circle
                cx="80"
                cy="80"
                r="54"
                fill="none"
                stroke={deck ? "var(--auth-signal)" : "var(--primary)"}
                strokeOpacity={0.45}
                strokeWidth="1.5"
                strokeDasharray="2 10"
              />
            </motion.svg>
          ) : null}

          <motion.div
            className={cn(
              "relative z-10 flex size-16 items-center justify-center rounded-2xl ring-1 sm:size-[4.5rem]",
              deck
                ? "bg-[color-mix(in_srgb,var(--auth-accent)_14%,transparent)] ring-[var(--auth-accent)]/30"
                : "bg-primary/10 ring-primary/20",
            )}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.45, ease }}
          >
            <RobotLogo size={40} />
          </motion.div>
        </div>

        <div className="flex flex-col items-center gap-3">
          <motion.p
            className={cn(
              "text-lg font-semibold tracking-[-0.03em]",
              deck && "font-[family-name:var(--font-auth-display)]",
            )}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12, duration: 0.4, ease }}
          >
            JobFit AI
          </motion.p>

          <div className="flex items-center gap-2">
            <motion.span
              className={cn(
                "font-mono text-[11px] tracking-[0.28em] uppercase",
                deck ? "text-[var(--auth-muted)]" : "text-muted-foreground",
              )}
              animate={reduceMotion ? undefined : { opacity: [0.45, 1, 0.45] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            >
              {label}
            </motion.span>
            {!reduceMotion ? (
              <span className="flex gap-1" aria-hidden>
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    className={cn(
                      "size-1 rounded-full",
                      deck ? "bg-[var(--auth-accent)]" : "bg-primary",
                    )}
                    animate={{ opacity: [0.25, 1, 0.25], y: [0, -2, 0] }}
                    transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }}
                  />
                ))}
              </span>
            ) : null}
          </div>

          {/* Progress bar */}
          <div
            className={cn(
              "mt-1 h-[2px] w-40 overflow-hidden rounded-full",
              deck ? "bg-[var(--auth-line)]" : "bg-muted",
            )}
          >
            <motion.div
              className={cn("h-full rounded-full", deck ? "bg-[var(--auth-accent)]" : "bg-primary")}
              initial={{ x: "-100%", width: "40%" }}
              animate={reduceMotion ? { x: "0%", width: "70%" } : { x: ["-100%", "160%"] }}
              transition={
                reduceMotion
                  ? { duration: 0.3 }
                  : { duration: 1.35, repeat: Infinity, ease: "easeInOut" }
              }
            />
          </div>
        </div>
      </div>
    </div>
  )
}
