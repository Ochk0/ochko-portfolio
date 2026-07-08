// Shared client-side constants + tiny helpers for the Press layer.
// localStorage / sessionStorage keys, custom event names, and uptime formatting.

export const LS = {
  intrusions: "smz.intrusions",
  flag: "smz.flag", // JSON: { handle, solvedAt, session }
  theme: "smz.theme", // "ink" | "paper"
  history: "smz.history", // JSON string[] (max 50)
} as const

export const SS = {
  booted: "smz.booted",
  sessionStart: "smz.session-start",
  attracted: "smz.attracted",
} as const

export const EVT = {
  intrusion: "smz:intrusion",
  flagSolved: "smz:flag-solved",
} as const

export type FlagRecord = { handle: string; solvedAt: string; session: string }

export function dispatch(name: string, detail?: unknown): void {
  if (typeof window === "undefined") return
  window.dispatchEvent(new CustomEvent(name, { detail }))
}

/** Ensure a session-start timestamp exists; returns it (ms since epoch). */
export function ensureSessionStart(): number {
  if (typeof window === "undefined") return 0
  let v = sessionStorage.getItem(SS.sessionStart)
  if (!v) {
    v = String(Date.now())
    sessionStorage.setItem(SS.sessionStart, v)
  }
  return Number(v)
}

/** mm:ss, or hh:mm:ss past an hour, since session start. */
export function getSessionUptime(): string {
  if (typeof window === "undefined") return "00:00"
  const start = Number(sessionStorage.getItem(SS.sessionStart) || Date.now())
  const total = Math.max(0, Math.floor((Date.now() - start) / 1000))
  const h = Math.floor(total / 3600)
  const m = Math.floor((total % 3600) / 60)
  const s = total % 60
  const pad = (n: number) => String(n).padStart(2, "0")
  return h > 0 ? `${pad(h)}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`
}

export function getIntrusions(): number {
  if (typeof window === "undefined") return 0
  return Number(localStorage.getItem(LS.intrusions) || "0")
}

export function bumpIntrusions(): number {
  if (typeof window === "undefined") return 0
  const next = getIntrusions() + 1
  localStorage.setItem(LS.intrusions, String(next))
  dispatch(EVT.intrusion, next)
  return next
}

export function getFlagRecord(): FlagRecord | null {
  if (typeof window === "undefined") return null
  try {
    const raw = localStorage.getItem(LS.flag)
    return raw ? (JSON.parse(raw) as FlagRecord) : null
  } catch {
    return null
  }
}

export function setFlagRecord(rec: FlagRecord): void {
  if (typeof window === "undefined") return
  localStorage.setItem(LS.flag, JSON.stringify(rec))
  dispatch(EVT.flagSolved, rec)
}
