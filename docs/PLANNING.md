# JobFit AI — Planning Document

AI agent that scores CV/resume fit against job postings. Stack: **Next.js 15+**, **eve**, **Effect**, **Convex**, **shadcn/ui**.

---

## 1. `agent/` directory structure

```
agent/
├── agent.ts                 # defineAgent({ model: 'anthropic/claude-sonnet-5' }) — AI Gateway routing
├── instructions.md          # Always-on system prompt: recruiter persona, scoring rules, output format
├── instrumentation.ts       # Optional OpenTelemetry spans for tool latency / errors
├── channels/
│   └── eve.ts               # HTTP channel auth (localDev + vercelOidc for deploy)
├── skills/
│   ├── analyze-match.md     # On-demand playbook: requirements → CV mapping → score → recommendations
│   └── extract-job-requirements.md  # Parse unstructured job text into structured requirements
├── tools/
│   ├── parse_resume.ts      # Effect pipeline: fetch CV from Convex storage → PDF/DOCX text extraction
│   ├── fetch_job_posting.ts # Effect: URL fetch → HTML sanitize → main content extraction (retry/timeout)
│   ├── score_match.ts       # Zod-typed scoring: %, skills, seniority, red flags, recommendations
│   └── save_analysis.ts     # Persist analysis result to Convex `analyses` table
└── lib/
    ├── effect.ts            # Shared Effect runners, retry/timeout policies
    ├── convex.ts            # ConvexHttpClient factory for tools
    └── errors.ts            # Tagged errors (ParsingError, FetchError, ConvexError)
```

**Note:** `--channel-web-nextjs` scaffolds Next.js + `withEve()` in `next.config.ts`. The eve HTTP channel lives in `agent/channels/eve.ts`; the web UI uses `useEveAgent` from `eve/react` (same-origin stream, no CORS).

---

## 2. Convex schema (`convex/schema.ts`)

| Table | Fields |
|-------|--------|
| `users` | `externalId`, `email?`, `createdAt` |
| `resumes` | `userId`, `storageId`, `fileName`, `mimeType`, `parsedText?`, `version`, `isActive`, `createdAt` |
| `jobPostings` | `userId`, `source` (`text` \| `url`), `rawText`, `cleanedText`, `url?`, `title?`, `createdAt` |
| `analyses` | `userId`, `resumeId`, `jobPostingId`, `matchPercentage`, `matchingSkills[]`, `missingSkills[]`, `seniorityFit`, `redFlags[]`, `recommendations[]`, `skillCategories?`, `eveSessionId?`, `createdAt` |
| `rateLimits` | `userId`, `date` (YYYY-MM-DD), `analysisCount` |

Indexes: `resumes.by_user`, `resumes.by_user_active`, `jobPostings.by_user`, `analyses.by_user`, `analyses.by_user_match`, `rateLimits.by_user_date`.

---

## 3. Zod schemas (`lib/schemas/`)

### `parse_resume`
- **Input:** `{ resumeId: string }`
- **Output:** `{ resumeId, fileName, mimeType, parsedText, wordCount }`

### `fetch_job_posting`
- **Input:** `{ url: string }` (https only, max 2048 chars)
- **Output:** `{ url, title?, cleanedText, wordCount }`

### `score_match`
- **Input:** `{ resumeText, jobText, jobTitle? }`
- **Output:** `{ matchPercentage, matchingSkills, missingSkills, seniorityFit: 'under'|'match'|'over', redFlags, recommendations, skillCategories: { technical, soft, domain }[] }`

### `save_analysis`
- **Input:** `{ userId, resumeId, jobPostingId, ...score_match output, eveSessionId? }`
- **Output:** `{ analysisId }`

---

## 4. Agent prompts (draft)

See `agent/instructions.md` and `agent/skills/*.md` in repo.

---

## 5. UI wireframes

### A. Resumes (`/resumes`)
```
┌─────────────────────────────────────────────┐
│ JobFit AI          [Resumes][Analyze][History]│
├─────────────────────────────────────────────┤
│  Your CVs                    [+ Upload CV]  │
│  ┌─────────────────────────────────────┐   │
│  │ ★ resume-v3.pdf        ACTIVE       │   │
│  │   Uploaded Mar 5 · 2 pages          │   │
│  ├─────────────────────────────────────┤   │
│  │   resume-v2.docx                    │   │
│  │   Uploaded Feb 12                   │   │
│  └─────────────────────────────────────┘   │
│  [drag & drop zone — PDF/DOCX, max 10MB]   │
└─────────────────────────────────────────────┘
```

### B. Analyze (`/analyze`)
```
┌─────────────────────────────────────────────┐
│ Active CV: resume-v3.pdf ▾                  │
│ ┌ Job posting ────────────────────────────┐ │
│ │ [Paste text] | [URL]                    │ │
│ │ textarea / url input                    │ │
│ └─────────────────────────────────────────┘ │
│              [ Run analysis ]               │
├─────────────────────────────────────────────┤
│ STREAM (eve session)                        │
│ ○ parse_resume ───────────── done           │
│ ○ fetch_job_posting ──────── running…       │
│ ○ score_match                               │
│ Skeleton + partial tool output              │
└─────────────────────────────────────────────┘
```

### C. Dashboard (`/`)
```
┌─────────────────────────────────────────────┐
│ History          Sort: Match % ▾  Filter ▾  │
│ ┌──────┬──────────────┬──────┬────────────┐ │
│ │ 87%  │ Sr Frontend  │ …    │ Mar 5      │ │
│ │ 62%  │ Backend Eng  │ …    │ Mar 3      │ │
│ └──────┴──────────────┴──────┴────────────┘ │
└─────────────────────────────────────────────┘
```

### D. Detail (`/analyses/[id]`)
```
┌─────────────────────────────────────────────┐
│ 87% match — Senior Frontend @ Acme          │
│ [████████████░░░] Progress bar              │
│ [ Radar chart: technical / soft / domain ]  │
│ ✓ Matching: React, TypeScript, …            │
│ ✗ Missing: GraphQL, Kubernetes              │
│ ⚠ Red flags: …                              │
│ 💡 Recommendations: …                       │
└─────────────────────────────────────────────┘
```

---

## Implementation phases

1. Convex + shared Zod schemas  
2. Agent tools + instructions/skills  
3. UI pages + Convex real-time hooks  
4. Rate limiting + polish (theme, skeletons, sonner)
