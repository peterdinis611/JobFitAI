const STORAGE_KEY = "jobfit-user-id"

export function getClientUserId(): string {
  if (typeof window === "undefined") return "server"
  let id = localStorage.getItem(STORAGE_KEY)
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem(STORAGE_KEY, id)
  }
  return id
}
