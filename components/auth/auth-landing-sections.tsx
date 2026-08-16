import type { ReactNode } from "react"
import { siteConfig } from "@/lib/site"

const steps = [
  {
    n: "01",
    title: "Upload your resume",
    body: "Drop a PDF or DOCX. We parse skills, experience, and seniority into a clean profile.",
    icon: "upload" as const,
  },
  {
    n: "02",
    title: "Add a job posting",
    body: "Paste the description or fetch from a URL. JobFit locks onto required skills and signals.",
    icon: "radar" as const,
  },
  {
    n: "03",
    title: "Read the fit, then act",
    body: "Get a match score, gaps, and tailored next steps — then track the application in one place.",
    icon: "spark" as const,
  },
]

/** Below-the-fold landing sections — no motion/lucide/Clerk client wrappers. */
export function AuthHowItWorks() {
  return (
    <section
      id="how-it-works"
      className="auth-reveal relative z-10 border-t border-[var(--auth-line)] bg-[color-mix(in_srgb,var(--auth-bg)_88%,transparent)] py-20 backdrop-blur-sm sm:py-28"
    >
      <div className="mx-auto max-w-6xl px-6 sm:px-10">
        <header className="max-w-2xl">
          <p className="font-[family-name:var(--font-auth-mono)] text-[11px] tracking-[0.32em] text-[var(--auth-accent)] uppercase">
            Protocol
          </p>
          <h2 className="mt-3 font-[family-name:var(--font-auth-display)] text-[clamp(2rem,5vw,3.25rem)] leading-[1.05] font-bold tracking-[-0.04em]">
            How it works
          </h2>
          <p className="mt-4 max-w-xl font-[family-name:var(--font-auth-body)] text-[17px] leading-relaxed text-[var(--auth-muted)]">
            Three calm steps from raw documents to a calibrated decision — no spreadsheet theatre.
          </p>
        </header>

        <ol className="mt-14 grid gap-5 md:grid-cols-3 md:gap-6">
          {steps.map((step) => (
            <li
              key={step.n}
              className="group relative flex flex-col rounded-xl border border-[var(--auth-line)] bg-[color-mix(in_srgb,var(--auth-fg)_3%,transparent)] p-6 sm:p-7"
            >
              <div className="mb-8 flex items-center justify-between">
                <span className="font-[family-name:var(--font-auth-mono)] text-[12px] tracking-[0.24em] text-[var(--auth-muted)]">
                  {step.n}
                </span>
                <span className="flex size-10 items-center justify-center rounded-lg border border-[var(--auth-line)] bg-[color-mix(in_srgb,var(--auth-accent)_12%,transparent)] text-[var(--auth-accent)] transition-colors group-hover:border-[var(--auth-accent)]">
                  <StepIcon name={step.icon} />
                </span>
              </div>
              <h3 className="font-[family-name:var(--font-auth-display)] text-xl font-semibold tracking-[-0.03em]">
                {step.title}
              </h3>
              <p className="mt-3 flex-1 font-[family-name:var(--font-auth-body)] text-[15px] leading-relaxed text-[var(--auth-muted)]">
                {step.body}
              </p>
            </li>
          ))}
        </ol>

        <div className="mt-12 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
          <a
            href="/sign-up"
            className="auth-btn-primary inline-flex h-12 items-center rounded-md px-7 text-[15px]"
          >
            Start free
          </a>
          <p className="font-[family-name:var(--font-auth-body)] text-sm text-[var(--auth-muted)]">
            No credit card. Sign in when you&apos;re ready to calibrate.
          </p>
        </div>
      </div>
    </section>
  )
}

export function AuthFooter() {
  const year = new Date().getFullYear()

  return (
    <footer className="relative z-10 border-t border-[var(--auth-line)] bg-[color-mix(in_srgb,var(--auth-bg)_94%,transparent)]">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-12 sm:px-10 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-sm">
          <p className="font-[family-name:var(--font-auth-display)] text-2xl font-bold tracking-[-0.04em]">
            {siteConfig.name}
          </p>
          <p className="mt-2 font-[family-name:var(--font-auth-body)] text-sm leading-relaxed text-[var(--auth-muted)]">
            {siteConfig.tagline}. Calibrate resumes against roles with clarity.
          </p>
        </div>

        <nav
          aria-label="Footer"
          className="grid grid-cols-2 gap-x-12 gap-y-6 sm:grid-cols-3 sm:gap-x-16"
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
            <span className="auth-footer-link cursor-default opacity-60">Privacy</span>
            <span className="auth-footer-link cursor-default opacity-60">Terms</span>
          </FooterCol>
        </nav>
      </div>

      <div className="border-t border-[var(--auth-line)]">
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
      <div className="mt-3 flex flex-col gap-2.5 font-[family-name:var(--font-auth-body)] text-sm">
        {children}
      </div>
    </div>
  )
}

function StepIcon({ name }: { name: "upload" | "radar" | "spark" }) {
  if (name === "upload") {
    return (
      <svg viewBox="0 0 24 24" className="size-4" fill="none" aria-hidden>
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
      <svg viewBox="0 0 24 24" className="size-4" fill="none" aria-hidden>
        <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.75" />
        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.75" />
        <path d="M12 12l6-4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 24 24" className="size-4" fill="none" aria-hidden>
      <path
        d="M12 3l1.2 5.2L18 9l-4 3.2L15.2 18 12 14.8 8.8 18 10 12.2 6 9l4.8-.8L12 3z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  )
}
