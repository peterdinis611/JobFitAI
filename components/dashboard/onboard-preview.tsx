/** Static match-instrument preview — CSS-animated, no motion bundle. */
export function OnboardPreview({
  hasResume,
  className,
}: {
  hasResume: boolean
  className?: string
}) {
  const score = hasResume ? 72 : null

  return (
    <div className={className} aria-hidden>
      <div className="dash-onboard-dial relative mx-auto aspect-square w-full max-w-[280px] sm:max-w-[320px]">
        <svg viewBox="0 0 320 320" className="h-full w-full">
          <defs>
            <linearGradient id="dashDialArc" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="var(--primary)" />
              <stop offset="100%" stopColor="var(--success)" />
            </linearGradient>
            <radialGradient id="dashDialGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="color-mix(in srgb, var(--primary) 18%, transparent)" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
          </defs>

          <circle cx="160" cy="160" r="150" fill="url(#dashDialGlow)" />

          {Array.from({ length: 36 }).map((_, i) => {
            const a = (i / 36) * Math.PI * 2 - Math.PI / 2
            const major = i % 6 === 0
            const x1 = 160 + Math.cos(a) * (major ? 132 : 136)
            const y1 = 160 + Math.sin(a) * (major ? 132 : 136)
            const x2 = 160 + Math.cos(a) * 146
            const y2 = 160 + Math.sin(a) * 146
            return (
              <line
                key={`tick-${i}`}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="currentColor"
                strokeOpacity={major ? 0.28 : 0.1}
                strokeWidth={major ? 1.5 : 1}
                className="text-foreground"
              />
            )
          })}

          <circle
            cx="160"
            cy="160"
            r="112"
            fill="none"
            stroke="var(--border)"
            strokeWidth="1"
          />
          <circle
            cx="160"
            cy="160"
            r="88"
            fill="color-mix(in srgb, var(--foreground) 3%, transparent)"
            stroke="var(--border)"
            strokeWidth="1"
          />

          <circle
            cx="160"
            cy="160"
            r="98"
            fill="none"
            stroke="var(--border)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray="410 615"
            transform="rotate(-120 160 160)"
          />

          {score !== null ? (
            <circle
              cx="160"
              cy="160"
              r="98"
              fill="none"
              stroke="url(#dashDialArc)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${(score / 100) * 410} 615`}
              transform="rotate(-120 160 160)"
              className="dash-onboard-dial-fill"
            />
          ) : (
            <circle
              cx="160"
              cy="160"
              r="98"
              fill="none"
              stroke="url(#dashDialArc)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray="40 615"
              transform="rotate(-120 160 160)"
              opacity="0.35"
              className="dash-onboard-dial-pulse"
            />
          )}

          <g
            className={score === null ? "dash-onboard-needle-idle" : undefined}
            style={{
              transformOrigin: "160px 160px",
              transform:
                score !== null
                  ? `rotate(${-120 + (score / 100) * 240}deg)`
                  : undefined,
            }}
          >
            <line
              x1="160"
              y1="160"
              x2="160"
              y2="78"
              stroke="var(--primary)"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </g>
          <circle cx="160" cy="160" r="6" fill="var(--primary)" />
          <circle cx="160" cy="160" r="3" fill="var(--card)" />
        </svg>

        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center pt-6">
          <p className="font-[family-name:var(--font-auth-mono)] text-[10px] tracking-[0.28em] text-muted-foreground uppercase">
            Match index
          </p>
          <p className="mt-1 font-[family-name:var(--font-auth-display)] text-5xl font-extrabold tracking-[-0.05em] tabular-nums sm:text-6xl">
            {score !== null ? (
              <>
                {score}
                <span className="text-2xl text-muted-foreground">%</span>
              </>
            ) : (
              <span className="text-muted-foreground/60">—</span>
            )}
          </p>
          <p className="mt-2 font-[family-name:var(--font-auth-mono)] text-[10px] tracking-[0.18em] text-muted-foreground uppercase">
            {hasResume ? "Awaiting job signal" : "Awaiting resume"}
          </p>
        </div>

        <span className="dash-onboard-scan" />
      </div>
    </div>
  )
}
