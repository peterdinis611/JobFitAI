import { Children, type ReactNode } from "react"
import { siteConfig } from "@/lib/site"

const steps = [
  {
    n: "01",
    title: "Upload your resume",
    body: "Drop a PDF or DOCX. We parse skills, experience, and seniority into a clean profile.",
    icon: "upload" as const,
    accent: "var(--auth-accent)",
  },
  {
    n: "02",
    title: "Add a job posting",
    body: "Paste the description or fetch from a URL. JobFit locks onto required skills and signals.",
    icon: "radar" as const,
    accent: "var(--auth-signal)",
  },
  {
    n: "03",
    title: "Read the fit, then act",
    body: "Get a match score, gaps, and tailored next steps — then track the application in one place.",
    icon: "spark" as const,
    accent: "var(--auth-accent)",
  },
] as const

export function AuthHowItWorks() {
  return (
    <section id="how-it-works" className="auth-how relative z-10 scroll-mt-8 py-20 sm:py-28">
      <div aria-hidden className="auth-how-glow pointer-events-none absolute inset-0" />

      <div className="relative mx-auto max-w-6xl px-6 sm:px-10">
        <header className="auth-how-header max-w-2xl">
          <p className="font-[family-name:var(--font-auth-mono)] text-[11px] tracking-[0.32em] text-[var(--auth-accent)] uppercase">
            Protocol
          </p>
          <h2 className="mt-3 font-[family-name:var(--font-auth-display)] text-[clamp(2.25rem,5vw,3.5rem)] leading-[1.02] font-bold tracking-[-0.045em]">
            How it works
          </h2>
          <p className="mt-4 max-w-xl font-[family-name:var(--font-auth-body)] text-[17px] leading-relaxed text-[var(--auth-muted)]">
            Three calm steps from raw documents to a calibrated decision — no spreadsheet theatre.
          </p>
        </header>

        <ol className="auth-steps mt-16 grid gap-6 md:grid-cols-3 md:gap-5 lg:gap-7">
          {steps.map((step, index) => (
            <li
              key={step.n}
              className="auth-step-card group"
              style={{
                ["--step-accent" as string]: step.accent,
                animationDelay: `${index * 90}ms`,
              }}
            >
              <span aria-hidden className="auth-step-ghost">
                {step.n}
              </span>

              <div className="relative flex items-start justify-between gap-4">
                <span className="auth-step-index font-[family-name:var(--font-auth-mono)]">
                  {step.n}
                </span>
                <span className="auth-step-icon" aria-hidden>
                  <StepIcon name={step.icon} />
                </span>
              </div>

              <h3 className="relative mt-10 font-[family-name:var(--font-auth-display)] text-[1.35rem] leading-tight font-semibold tracking-[-0.03em]">
                {step.title}
              </h3>
              <p className="relative mt-3 font-[family-name:var(--font-auth-body)] text-[15px] leading-[1.65] text-[var(--auth-muted)]">
                {step.body}
              </p>

              {index < steps.length - 1 ? (
                <span aria-hidden className="auth-step-connector hidden md:block" />
              ) : null}
            </li>
          ))}
        </ol>

        <div className="auth-how-cta mt-14 flex flex-col gap-5 rounded-2xl border border-[var(--auth-line)] bg-[color-mix(in_srgb,var(--auth-fg)_4%,transparent)] p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div>
            <p className="font-[family-name:var(--font-auth-display)] text-xl font-semibold tracking-[-0.03em]">
              Ready to calibrate?
            </p>
            <p className="mt-1 font-[family-name:var(--font-auth-body)] text-sm text-[var(--auth-muted)]">
              No credit card. Sign in when you&apos;re ready to run your first match.
            </p>
          </div>
          <p className="flex shrink-0 flex-col gap-3 sm:flex-row sm:items-center">
            <a
              href="/sign-up"
              className="auth-btn-primary inline-flex h-12 items-center px-8 text-[15px]"
            >
              Start free
            </a>
            <a
              href="/sign-in"
              className="auth-btn-secondary inline-flex h-12 items-center px-8 text-[15px]"
            >
              Sign in
            </a>
          </p>
        </div>
      </div>
    </section>
  )
}

export function AuthFooter() {
  const year = new Date().getFullYear()

  return (
    <footer className="auth-footer relative z-10">
      <div className="mx-auto max-w-6xl px-6 pb-10 pt-14 sm:px-10">
        <div className="flex flex-col gap-12 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-xs">
            <p className="flex items-center gap-3">
              <span className="auth-footer-mark flex size-10 items-center justify-center rounded-xl">
                <RobotMark />
              </span>
              <span className="font-[family-name:var(--font-auth-display)] text-2xl font-bold tracking-[-0.04em]">
                {siteConfig.name}
              </span>
            </p>
            <p className="mt-4 font-[family-name:var(--font-auth-body)] text-[15px] leading-relaxed text-[var(--auth-muted)]">
              {siteConfig.tagline}. Calibrate resumes against roles with clarity.
            </p>
            <p className="mt-6 inline-flex items-center gap-2 font-[family-name:var(--font-auth-mono)] text-[10px] tracking-[0.22em] text-[var(--auth-muted)] uppercase">
              <span className="auth-footer-pulse size-1.5 rounded-full bg-[var(--auth-signal)]" />
              Instrument online
            </p>
          </div>

          <nav
            aria-label="Footer"
            className="grid grid-cols-2 gap-x-10 gap-y-8 sm:grid-cols-3 sm:gap-x-14"
          >
            <FooterCol title="Product">
              <a href="#how-it-works" className="auth-footer-link">
                How it works
              </a>
              <a href="/sign-in" className="auth-footer-link">
                Sign in
              </a>
              <a href="/sign-up" className="auth-footer-link">
                Create account
              </a>
            </FooterCol>
            <FooterCol title="Resources">
              <a href="/docs" className="auth-footer-link">
                Documentation
              </a>
              <a href="/docs/getting-started/installation" className="auth-footer-link">
                Getting started
              </a>
              <a href="/docs/help/faq" className="auth-footer-link">
                FAQ
              </a>
            </FooterCol>
            <FooterCol title="Legal">
              <span className="auth-footer-link auth-footer-link-muted">Privacy</span>
              <span className="auth-footer-link auth-footer-link-muted">Terms</span>
            </FooterCol>
          </nav>
        </div>
      </div>

      <div className="auth-footer-bar border-t border-[var(--auth-line)]">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 py-5 font-[family-name:var(--font-auth-mono)] text-[11px] tracking-[0.12em] text-[var(--auth-muted)] uppercase sm:flex-row sm:items-center sm:justify-between sm:px-10">
          <p>
            © {year} {siteConfig.name}
          </p>
          <p>Built for deliberate career moves</p>
        </div>
      </div>
    </footer>
  )
}

function FooterCol({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <p className="font-[family-name:var(--font-auth-mono)] text-[10px] tracking-[0.28em] text-[var(--auth-muted)] uppercase">
        {title}
      </p>
      <ul className="mt-4 flex flex-col gap-3 font-[family-name:var(--font-auth-body)] text-sm">
        {Children.map(children, (child, index) => (
          <li key={index}>{child}</li>
        ))}
      </ul>
    </div>
  )
}

function RobotMark() {
  return (
    <svg viewBox="0 0 32 32" className="size-5" fill="none" aria-hidden>
      <rect
        x="8"
        y="9"
        width="16"
        height="12"
        rx="4"
        fill="currentColor"
        fillOpacity="0.15"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <rect x="11.25" y="13" width="3.25" height="3.25" rx="0.9" fill="currentColor" />
      <rect x="17.5" y="13" width="3.25" height="3.25" rx="0.9" fill="currentColor" />
    </svg>
  )
}

function StepIcon({ name }: { name: "upload" | "radar" | "spark" }) {
  if (name === "upload") {
    return (
      <svg viewBox="0 0 24 24" className="size-[18px]" fill="none" aria-hidden>
        <path
          d="M12 16V5M12 5l-4 4M12 5l4 4M5 19h14"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    )
  }
  if (name === "radar") {
    return (
      <svg viewBox="0 0 24 24" className="size-[18px]" fill="none" aria-hidden>
        <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.75" />
        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.75" />
        <path d="M12 12l6-4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 24 24" className="size-[18px]" fill="none" aria-hidden>
      <path
        d="M12 3l1.2 5.2L18 9l-4 3.2L15.2 18 12 14.8 8.8 18 10 12.2 6 9l4.8-.8L12 3z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  )
}
