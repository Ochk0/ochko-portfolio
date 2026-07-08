"use client"

// PressProvider - the client backbone for the Press layer.
// Owns shell open state, the edition theme, the global keyboard grammar
// (`~` toggles the shell, Esc closes, Konami → fire), and lazy-mounts the shell.
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import dynamic from "next/dynamic"
import { LS, ensureSessionStart } from "@/lib/press"
// Type-only import - erased at build time, never pulls the fs-backed module into the client bundle.
import type { WriteupMeta } from "@/lib/writeups"

// Lazy: the shell (and everything it drags in) loads only on first `~`.
const PressShell = dynamic(() => import("./press-shell"), { ssr: false })
const FireCanvas = dynamic(
  () => import("@/components/fx/fire-canvas").then((m) => m.FireCanvas),
  { ssr: false },
)

type Theme = "ink" | "paper"

interface PressContextValue {
  shellOpen: boolean
  openShell: () => void
  closeShell: () => void
  toggleShell: () => void
  theme: Theme
  setTheme: (t: Theme) => void
}

const PressContext = createContext<PressContextValue | null>(null)

export function usePress(): PressContextValue {
  const ctx = useContext(PressContext)
  if (!ctx) throw new Error("usePress must be used within a PressProvider")
  return ctx
}

const KONAMI = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
]

const KONAMI_KEY = "smz.konami"

function isTyping(target: EventTarget | null): boolean {
  const el = target as HTMLElement | null
  if (!el) return false
  const tag = el.tagName
  return tag === "INPUT" || tag === "TEXTAREA" || el.isContentEditable
}

export function PressProvider({
  children,
  writeups,
}: {
  children: ReactNode
  writeups: WriteupMeta[]
}) {
  const [shellOpen, setShellOpen] = useState(false)
  const [shellMounted, setShellMounted] = useState(false)
  const [theme, setThemeState] = useState<Theme>("ink")
  const [fireOn, setFireOn] = useState(false)

  const openShell = useCallback(() => {
    setShellMounted(true)
    setShellOpen(true)
  }, [])

  const closeShell = useCallback(() => setShellOpen(false), [])

  const toggleShell = useCallback(() => {
    setShellMounted(true)
    setShellOpen((o) => !o)
  }, [])

  const setTheme = useCallback((t: Theme) => {
    setThemeState(t)
    try {
      if (t === "paper") {
        document.documentElement.dataset.theme = "paper"
      } else {
        delete document.documentElement.dataset.theme
      }
      localStorage.setItem(LS.theme, t)
    } catch {
      /* storage blocked - theme still applies in-memory */
    }
  }, [])

  const triggerFire = useCallback(() => {
    if (typeof window === "undefined") return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    try {
      if (sessionStorage.getItem(KONAMI_KEY)) return
      sessionStorage.setItem(KONAMI_KEY, "1")
    } catch {
      /* ignore */
    }
    setFireOn(true)
  }, [])

  const stopFire = useCallback(() => setFireOn(false), [])

  // Seed the session clock and reconcile the persisted edition.
  useEffect(() => {
    ensureSessionStart()
    try {
      if (localStorage.getItem(LS.theme) === "paper") {
        setThemeState("paper")
        document.documentElement.dataset.theme = "paper"
      }
    } catch {
      /* ignore */
    }
  }, [])

  // The global keyboard grammar.
  useEffect(() => {
    let idx = 0
    const onKey = (e: KeyboardEvent) => {
      const typing = isTyping(e.target)

      if ((e.key === "`" || e.key === "~") && !typing) {
        e.preventDefault()
        toggleShell()
        return
      }
      if (e.key === "Escape") {
        closeShell()
      }

      if (!typing) {
        const key = e.key.length === 1 ? e.key.toLowerCase() : e.key
        if (key === KONAMI[idx]) {
          idx += 1
          if (idx === KONAMI.length) {
            idx = 0
            triggerFire()
          }
        } else {
          idx = key === KONAMI[0] ? 1 : 0
        }
      }
    }

    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [toggleShell, closeShell, triggerFire])

  const value = useMemo<PressContextValue>(
    () => ({ shellOpen, openShell, closeShell, toggleShell, theme, setTheme }),
    [shellOpen, openShell, closeShell, toggleShell, theme, setTheme],
  )

  return (
    <PressContext.Provider value={value}>
      {children}
      {shellMounted ? <PressShell writeups={writeups} /> : null}
      {fireOn ? <FireCanvas durationMs={4000} onDone={stopFire} /> : null}
    </PressContext.Provider>
  )
}
