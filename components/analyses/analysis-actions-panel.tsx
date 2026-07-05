"use client"

import Link from "next/link"
import { useMutation, useQuery } from "convex/react"
import { useEveAgent } from "eve/react"
import {
  BookOpen,
  FileText,
  Kanban,
  Loader2,
  PenLine,
  RefreshCw,
  Sparkles,
} from "lucide-react"
import { useRef, useState } from "react"
import { toast } from "sonner"
import { api } from "@/convex/_generated/api"
import type { Doc, Id } from "@/convex/_generated/dataModel"
import { AgentMessage } from "@/app/_components/agent-message"
import {
  CoverLetterView,
  LearningPlanView,
  TailoredBulletsView,
} from "@/components/analyses/artifact-views"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useJobFitUser } from "@/hooks/use-jobfit-user"

type AnalysisContext = {
  analysis: Doc<"analyses">
  resume: Doc<"resumes"> | null
  jobPosting: Doc<"jobPostings"> | null
}

function buildContextJson({ analysis, resume, jobPosting }: AnalysisContext, userId: string) {
  return {
    userId,
    analysisId: analysis._id,
    resumeId: analysis.resumeId,
    jobPostingId: analysis.jobPostingId,
    jobTitle: jobPosting?.title,
    jobText: jobPosting?.cleanedText,
    matchPercentage: analysis.matchPercentage,
    matchingSkills: analysis.matchingSkills,
    missingSkills: analysis.missingSkills,
    seniorityFit: analysis.seniorityFit,
    recommendations: analysis.recommendations,
    resumeFileName: resume?.fileName,
  }
}

export function AnalysisActionsPanel({ data }: { data: AnalysisContext }) {
  const { userId } = useJobFitUser()
  const agent = useEveAgent()
  const [activeTab, setActiveTab] = useState("tailored_bullets")
  const [running, setRunning] = useState<string | null>(null)
  const [rescoreUploading, setRescoreUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const tailored = useQuery(api.artifacts.getByType, {
    analysisId: data.analysis._id,
    type: "tailored_bullets",
  })
  const coverLetter = useQuery(api.artifacts.getByType, {
    analysisId: data.analysis._id,
    type: "cover_letter",
  })
  const learningPlan = useQuery(api.artifacts.getByType, {
    analysisId: data.analysis._id,
    type: "learning_plan",
  })
  const application = useQuery(api.applications.getByAnalysis, {
    analysisId: data.analysis._id,
  })

  const createApplication = useMutation(api.applications.create)
  const generateUploadUrl = useMutation(api.resumes.generateUploadUrl)
  const createResume = useMutation(api.resumes.create)
  const checkRate = useMutation(api.rateLimits.checkAndIncrement)

  const isBusy =
    running !== null ||
    rescoreUploading ||
    agent.status === "submitted" ||
    agent.status === "streaming"

  async function runSkill(
    skill: string,
    steps: string,
    tab: string,
  ) {
    if (!userId) return
    setRunning(skill)
    setActiveTab(tab)
    try {
      await agent.send({
        message: `Run the ${skill} skill for this analysis.

Context JSON:
\`\`\`json
${JSON.stringify(buildContextJson(data, userId), null, 2)}
\`\`\`

Steps: ${steps}`,
      })
      toast.success("Generation started")
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to start")
    } finally {
      setRunning(null)
    }
  }

  async function handleRescore(file: File) {
    if (!userId) return
    setRescoreUploading(true)
    try {
      const rate = await checkRate({})
      if (!rate.allowed) {
        toast.error("Daily analysis limit reached (20/day)")
        return
      }

      const uploadUrl = await generateUploadUrl({})
      const res = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": file.type || "application/octet-stream" },
        body: file,
      })
      if (!res.ok) throw new Error("Upload failed")
      const { storageId } = (await res.json()) as { storageId: Id<"_storage"> }
      const newResumeId = await createResume({
        storageId,
        fileName: file.name,
        mimeType: file.type || "application/octet-stream",
      })

      const context = {
        ...buildContextJson(data, userId),
        resumeId: newResumeId,
        previousAnalysisId: data.analysis._id,
      }

      setActiveTab("stream")
      await agent.send({
        message: `Run the rescore-after-edit skill.

Context JSON:
\`\`\`json
${JSON.stringify(context, null, 2)}
\`\`\`

Steps: parse_resume → score_match → save_analysis (include previousAnalysisId).`,
      })
      toast.success("Re-score started — check the stream for the new analysis ID")
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Re-score failed")
    } finally {
      setRescoreUploading(false)
    }
  }

  async function saveToTracker() {
    try {
      await createApplication({ analysisId: data.analysis._id })
      toast.success("Added to application tracker")
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to save")
    }
  }

  const tailoredContent = tailored?.content as { bullets?: unknown[] } | undefined
  const coverContent = coverLetter?.content as { coverLetter?: string } | undefined
  const planContent = learningPlan?.content as { plans?: unknown[] } | undefined

  return (
    <div className="space-y-4">
      <Card className="border-border/60 bg-card/80">
        <CardHeader>
          <CardTitle className="text-base">Career tools</CardTitle>
          <CardDescription>
            Tailor your CV, draft a cover letter, or build a learning plan from this analysis
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button
            size="sm"
            variant="outline"
            disabled={isBusy}
            onClick={() =>
              void runSkill(
                "tailor-cv",
                "parse_resume → tailor_bullets → save_artifact",
                "tailored_bullets",
              )
            }
          >
            {running === "tailor-cv" ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <PenLine className="size-4" />
            )}
            Tailor bullets
          </Button>
          <Button
            size="sm"
            variant="outline"
            disabled={isBusy}
            onClick={() =>
              void runSkill(
                "generate-cover-letter",
                "parse_resume → generate_cover_letter → save_artifact",
                "cover_letter",
              )
            }
          >
            {running === "generate-cover-letter" ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <FileText className="size-4" />
            )}
            Cover letter
          </Button>
          <Button
            size="sm"
            variant="outline"
            disabled={isBusy}
            onClick={() =>
              void runSkill(
                "generate-learning-plan",
                "generate_learning_plan → save_artifact",
                "learning_plan",
              )
            }
          >
            {running === "generate-learning-plan" ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <BookOpen className="size-4" />
            )}
            Learning plan
          </Button>
          <Button
            size="sm"
            variant="outline"
            disabled={isBusy}
            onClick={() => fileRef.current?.click()}
          >
            {rescoreUploading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <RefreshCw className="size-4" />
            )}
            Re-score with new CV
          </Button>
          <input
            ref={fileRef}
            type="file"
            accept=".pdf,.docx"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) void handleRescore(file)
              e.target.value = ""
            }}
          />
          {application ? (
            <Button asChild size="sm" variant="secondary">
              <Link href="/tracker">
                <Kanban className="size-4" /> In tracker
              </Link>
            </Button>
          ) : (
            <Button size="sm" variant="secondary" disabled={isBusy} onClick={() => void saveToTracker()}>
              <Kanban className="size-4" /> Save to tracker
            </Button>
          )}
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="flex h-auto flex-wrap gap-1">
          <TabsTrigger value="tailored_bullets">Tailored bullets</TabsTrigger>
          <TabsTrigger value="cover_letter">Cover letter</TabsTrigger>
          <TabsTrigger value="learning_plan">Learning plan</TabsTrigger>
          <TabsTrigger value="stream" className="gap-1">
            <Sparkles className="size-3.5" /> Agent
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tailored_bullets" className="mt-4">
          {tailoredContent?.bullets?.length ? (
            <TailoredBulletsView
              bullets={tailoredContent.bullets as { original: string; rewritten: string; rationale?: string }[]}
            />
          ) : (
            <EmptyArtifact hint="Click Tailor bullets to rewrite 3–5 resume bullets for this role" />
          )}
        </TabsContent>

        <TabsContent value="cover_letter" className="mt-4">
          {coverContent?.coverLetter ? (
            <CoverLetterView text={coverContent.coverLetter} />
          ) : (
            <EmptyArtifact hint="Click Cover letter to generate a draft from this analysis" />
          )}
        </TabsContent>

        <TabsContent value="learning_plan" className="mt-4">
          {planContent?.plans?.length ? (
            <LearningPlanView
              plans={
                planContent.plans as { skill: string; durationWeeks: number; steps: string[] }[]
              }
            />
          ) : (
            <EmptyArtifact hint="Click Learning plan for 2-week plans to close skill gaps" />
          )}
        </TabsContent>

        <TabsContent value="stream" className="mt-4">
          <Card className="flex min-h-[320px] flex-col overflow-hidden border-border/60">
            <CardContent className="flex min-h-0 flex-1 flex-col p-0">
              {agent.data.messages.length === 0 ? (
                <p className="p-6 text-center text-sm text-muted-foreground">
                  Run a tool above to see the agent stream
                </p>
              ) : (
                <Conversation className="min-h-[300px]">
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
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function EmptyArtifact({ hint }: { hint: string }) {
  return (
    <div className="rounded-xl border border-dashed border-border/70 bg-muted/20 px-4 py-10 text-center text-sm text-muted-foreground">
      {hint}
    </div>
  )
}
