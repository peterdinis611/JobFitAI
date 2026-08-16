/** Shared atmosphere for the auth signal-deck — CSS-only (no motion runtime). */
export function AuthAtmosphere() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[var(--auth-bg)]" />

      <div className="absolute -top-[20%] left-1/2 h-[140%] w-[55%] -translate-x-1/2 rotate-[-18deg] bg-[linear-gradient(90deg,transparent,color-mix(in_srgb,var(--auth-accent)_18%,transparent),transparent)]" />

      <div className="auth-orb auth-orb-a absolute -top-32 -left-24 size-[34rem] rounded-full bg-[radial-gradient(circle,color-mix(in_srgb,var(--auth-accent)_28%,transparent),transparent_68%)]" />
      <div className="auth-orb auth-orb-b absolute right-[-10%] bottom-[-15%] size-[28rem] rounded-full bg-[radial-gradient(circle,color-mix(in_srgb,var(--auth-signal)_22%,transparent),transparent_70%)]" />

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

      <div className="absolute top-6 right-6 bottom-6 left-6 border border-[var(--auth-line)]" />
      <div className="absolute top-6 left-6 h-3 w-3 border-t border-l border-[var(--auth-accent)]" />
      <div className="absolute top-6 right-6 h-3 w-3 border-t border-r border-[var(--auth-accent)]" />
      <div className="absolute bottom-6 left-6 h-3 w-3 border-b border-l border-[var(--auth-signal)]" />
      <div className="absolute right-6 bottom-6 h-3 w-3 border-r border-b border-[var(--auth-signal)]" />

      <div
        className="absolute inset-0 opacity-[0.07] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      <div className="auth-scan absolute inset-y-0 w-px bg-[linear-gradient(to_bottom,transparent,var(--auth-accent),transparent)] opacity-60" />
    </div>
  )
}
