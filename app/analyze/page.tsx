"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import { useMutation, useQuery } from "convex/react"
import { useEveAgent } from "eve/react"
import { FileText, Link2, Loader2, Sparkles } from "lucide-react"
import { motion, AnimatePresence } from "motion/react"
import { toast } from "sonner"
import { api } from "@/convex/_generated/api"
import { useJobFitUser } from "@/hooks/use-jobfit-user"
import { AgentMessage } from "@/app/_components/agent-message"
import { DashboardGettingStarted } from "@/components/dashboard/dashboard-states"
import { FadeIn } from "@/components/motion/motion-primitives"
import {
  AnalyzingIllustration,
  EmptySearchIllustration,
} from "@/components/illustrations/jobfit-illustrations"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PageHeader } from "@/components/ui/page-header"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation"
import type { Doc } from "@/convex/_generated/dataModel"
import { cn } from "@/lib/utils"

export default function AnalyzePage() {
  const { userId, ready } = useJobFitUser()
  const resumes = useQuery(api.resumes.listByUser, ready ? {} : "skip")
  const createJob = useMutation(api.jobPostings.create)
  const checkRate = useMutation(api.rateLimits.checkAndIncrement)

  const [tab, setTab] = useState("text")
  const [jobText, setJobText] = useState("")
  const [jobUrl, setJobUrl] = useState("")
  const [running, setRunning] = useState(false)

  const agent = useEveAgent()
  const activeResume = useMemo(
    () => resumes?.find((r: Doc<"resumes">) => r.isActive),
    [resumes],
  )
  const isBusy = agent.status === "submitted" || agent.status === "streaming" || running

  async function runAnalysis() {
    if (!userId || !activeResume) {
      toast.error("Upload an active resume first")
      return
    }

    const source = tab === "url" ? "url" : "text"
    const raw = source === "url" ? jobUrl.trim() : jobText.trim()

    if (!raw) {
      toast.error(source === "url" ? "Enter a job URL" : "Paste job description")
      return
    }

    if (source === "url" && !raw.startsWith("https://")) {
      toast.error("Only HTTPS URLs are supported")
      return
    }

    setRunning(true)
    try {
      const rate = await checkRate({})
      if (!rate.allowed) {
        toast.error("Daily analysis limit reached (20/day)")
        return
      }

      const jobPostingId = await createJob({
        source,
        rawText: raw,
        cleanedText: source === "text" ? raw : raw,
        url: source === "url" ? raw : undefined,
      })

      const context = {
        userId,
        resumeId: activeResume._id,
        jobPostingId,
        jobSource: source,
        jobText: source === "text" ? raw : undefined,
        jobUrl: source === "url" ? raw : undefined,
      }

      await agent.send({
        message: `Run a full JobFit analysis using the analyze-match skill.

Context JSON:
\`\`\`json
${JSON.stringify(context, null, 2)}
\`\`\`

Steps: parse_resume → ${source === "url" ? "fetch_job_posting → update_job_posting →" : ""} score_match → save_analysis.`,
      })

      toast.success("Analysis started — streaming below")
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to start analysis")
    } finally {
      setRunning(false)
    }
  }

  if (!ready) {
    return <div className="h-60 animate-pulse rounded-xl bg-muted" />
  }

  if (!activeResume && resumes?.length === 0) {
    return (
      <div className="space-y-8">
        <PageHeader
          title="Analyze match"
          description="Compare your active CV against a job posting and get AI-powered insights."
        />
        <DashboardGettingStarted hasResume={false} />
      </div>
    )
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="space-y-5">
        <PageHeader
          title="Analyze match"
          description="Compare your active CV against a job posting and get AI-powered insights."
        />

        <FadeIn delay={0.05}>
          <Card className={cn(!activeResume && "border-warning/50")}>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <FileText className="size-4 text-primary" />
                Active resume
              </CardTitle>
              <CardDescription>
                {activeResume?.fileName ?? "No resume — upload one first"}
              </CardDescription>
            </CardHeader>
            {!activeResume ? (
              <CardContent>
                <Button asChild variant="outline" size="sm">
                  <Link href="/resumes">Upload resume</Link>
                </Button>
              </CardContent>
            ) : null}
          </Card>
        </FadeIn>

        <FadeIn delay={0.1}>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Job posting</CardTitle>
              <CardDescription>Paste the description or provide a URL</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={tab} onValueChange={setTab}>
                <TabsList className="mb-4">
                  <TabsTrigger value="text">Paste text</TabsTrigger>
                  <TabsTrigger value="url" className="gap-1.5">
                    <Link2 className="size-3.5" /> URL
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="text" className="mt-0">
                  <Textarea
                    placeholder="Paste the full job description…"
                    className="min-h-[200px] resize-none"
                    value={jobText}
                    onChange={(e) => setJobText(e.target.value)}
                  />
                </TabsContent>
                <TabsContent value="url" className="mt-0">
                  <Input
                    placeholder="https://company.com/jobs/senior-engineer"
                    value={jobUrl}
                    onChange={(e) => setJobUrl(e.target.value)}
                  />
                </TabsContent>
              </Tabs>

              <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                <Button className="mt-4 w-full" disabled={isBusy} onClick={() => void runAnalysis()}>
                  {isBusy ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Sparkles className="size-4" />
                  )}
                  {isBusy ? "Analyzing…" : "Run analysis"}
                </Button>
              </motion.div>
            </CardContent>
          </Card>
        </FadeIn>
      </div>

      <FadeIn delay={0.15}>
        <Card className="flex min-h-[520px] flex-col overflow-hidden">
          <CardHeader>
            <CardTitle className="text-base">Live agent stream</CardTitle>
            <CardDescription>Tool calls and reasoning from your analysis session</CardDescription>
          </CardHeader>
          <CardContent className="flex min-h-0 flex-1 flex-col p-0">
            <AnimatePresence mode="wait">
              {isBusy ? (
                <motion.div
                  key="loading"
                  className="flex flex-1 flex-col items-center justify-center gap-3 p-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <AnalyzingIllustration />
                  <p className="text-sm font-medium text-muted-foreground">Analyzing your match…</p>
                </motion.div>
              ) : agent.data.messages.length === 0 ? (
                <motion.div
                  key="empty"
                  className="flex flex-1 flex-col items-center justify-center p-6 text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <EmptySearchIllustration />
                  <p className="mt-3 text-sm text-muted-foreground">
                    Start an analysis to see the live stream
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="stream"
                  className="flex min-h-0 flex-1 flex-col"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <Conversation className="min-h-0 flex-1">
                    <ConversationContent className="gap-4 p-4">
                      {agent.data.messages.map((message, index) => (
                        <AgentMessage
                          key={message.id}
                          canRespond={!isBusy}
                          isStreaming={
                            agent.status === "streaming" &&
                            index === agent.data.messages.length - 1
                          }
                          message={message}
                          onInputResponses={(inputResponses) => agent.send({ inputResponses })}
                        />
                      ))}
                    </ConversationContent>
                    <ConversationScrollButton />
                  </Conversation>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </FadeIn>
    </div>
  )
}
