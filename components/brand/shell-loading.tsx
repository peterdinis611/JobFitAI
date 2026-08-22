import { cn } from "@/lib/utils"

/** Lightweight Clerk / Convex gate — CSS only, no motion runtime. */
export function ShellLoading({
  className,
  label = "Loading",
}: {
  className?: string
  label?: string
}) {
  return (
    <div
      className={cn(
        "relative flex min-h-dvh flex-col items-center justify-center bg-background text-foreground",
        className,
      )}
      role="status"
      aria-live="polite"
      aria-label={label}
    >
      <div className="shell-loading-mark flex size-14 items-center justify-center rounded-2xl bg-primary/10 ring-1 ring-primary/20">
        <svg viewBox="0 0 32 32" className="size-8" fill="none" aria-hidden>
          <rect
            x="8"
            y="9"
            width="16"
            height="12"
            rx="4"
            fill="#007AFF"
            fillOpacity="0.2"
            stroke="#007AFF"
            strokeWidth="1.75"
          />
          <rect x="11.25" y="13" width="3.25" height="3.25" rx="0.9" fill="#007AFF" />
          <rect x="17.5" y="13" width="3.25" height="3.25" rx="0.9" fill="#007AFF" />
        </svg>
      </div>
      <p className="mt-5 text-sm font-medium tracking-tight">JobFit AI</p>
      <p className="mt-1 font-mono text-[10px] tracking-[0.24em] text-muted-foreground uppercase">
        {label}
      </p>
      <div className="mt-5 h-[2px] w-24 overflow-hidden rounded-full bg-muted">
        <div className="shell-loading-bar h-full w-2/5 rounded-full bg-primary" />
      </div>
    </div>
  )
}
