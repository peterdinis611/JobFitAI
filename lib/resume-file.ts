export function isPdfResume(resume: { mimeType?: string; fileName?: string }) {
  const mime = resume.mimeType?.toLowerCase() ?? ""
  if (mime === "application/pdf" || mime === "application/x-pdf") return true
  return /\.pdf$/i.test(resume.fileName ?? "")
}
