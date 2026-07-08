"use client"

// SAMIZDAT - THE PRESS SHELL. Lazy-loaded terminal (dynamic, ssr:false).
// Bottom sheet built on Radix Dialog (no overlay dim, no rounded corners).
// The terminal is ALWAYS ink - void field / newsprint text - regardless of the
// page theme. We re-establish the ink CSS variables on the shell subtree (HSL
// triplets, never hex) so `text-newsprint` / `text-arterial` stay readable even
// when the rest of the page is on the paper edition.

import * as React from "react"
import { useCallback, useEffect, useReducer, useRef, useState } from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X } from "lucide-react"
import { useRouter } from "next/navigation"

import { site } from "@/lib/site"
import type { WriteupMeta } from "@/lib/writeups"
import { isFlag } from "@/lib/flag"
import { mintCredentialPNG } from "@/lib/credential"
import { usePress } from "@/components/press/press-provider"
import {
  LS,
  SS,
  getSessionUptime,
  getFlagRecord,
  setFlagRecord,
  bumpIntrusions,
} from "@/lib/press"

/* ------------------------------------------------------------------ model */

type Tone = "newsprint" | "graphite" | "arterial"
type Seg = { t: string; c?: Tone }
type Line = { segs: Seg[]; link?: string; action?: "download" }
type Mode = "command" | "handle"

const ln = (text: string, c?: Tone): Line => ({ segs: [{ t: text, c }] })
const lseg = (segs: Seg[], extra?: Omit<Line, "segs">): Line => ({ segs, ...extra })

const PROMPT = "visitor@samizdat:~$ "
const CAP = 300

const COMMANDS = [
  "help", "ls", "cat", "open", "cd", "whoami", "pgp", "contact", "resume",
  "theme", "date", "history", "clear", "exit", "sudo", "vim", "flag",
  "credential", "strings",
]

const SECTIONS: { id: string; num: string; desc: string }[] = [
  { id: "index", num: "0x01", desc: "cover stories" },
  { id: "ledger", num: "0x02", desc: "disclosure ledger" },
  { id: "editor", num: "0x03", desc: "the editor" },
  { id: "history", num: "0x04", desc: "revision history" },
  { id: "classifieds", num: "0x05", desc: "classifieds" },
  { id: "scoreboard", num: "0x06", desc: "scoreboard" },
  { id: "colophon", num: "0x07", desc: "colophon" },
  { id: "letters", num: "0x08", desc: "letters" },
]
const OPEN_IDS = ["cover", ...SECTIONS.map((s) => s.id), "archive"]

const CHIPS = ["help", "ls writeups", "open ledger", "theme paper", "sudo"]

// Input-sanitization flex - evaluated before command parsing.
const SANITIZE: RegExp[] = [
  /<script|onerror=|javascript:/i,
  /('|")\s*or\s+1=1/i,
  /union\s+select/i,
  /\.\.\//,
  /%3Cscript/i,
]

// Ink tokens re-declared on the shell subtree so the terminal never flips with
// the paper theme. HSL triplets straight from the design tokens - not hex.
const INK_VARS = {
  ["--foreground"]: "45 14.8% 89.4%",
  ["--graphite"]: "46.2 5.3% 47.6%",
  ["--arterial"]: "12 100% 50%",
  ["--border"]: "0 0% 13.7%",
} as unknown as React.CSSProperties

/* ---------------------------------------------------------------- reducer */

interface State {
  lines: Line[]
  queue: Line[]
  input: string
  history: string[]
  histIndex: number
  mode: Mode
}

type Action =
  | { type: "setInput"; input: string }
  | { type: "run"; echo: Line; output: Line[]; addHistory?: string; mode?: Mode }
  | { type: "queue"; output: Line[] }
  | { type: "flush" }
  | { type: "clear" }
  | { type: "histNav"; input: string; histIndex: number }

function capLines(lines: Line[]): Line[] {
  return lines.length > CAP ? lines.slice(lines.length - CAP) : lines
}

function reducer(s: State, a: Action): State {
  switch (a.type) {
    case "setInput":
      return { ...s, input: a.input }
    case "run": {
      let history = s.history
      if (a.addHistory !== undefined && a.addHistory.trim() !== "") {
        if (history[history.length - 1] !== a.addHistory) {
          history = [...history, a.addHistory].slice(-50)
        }
      }
      return {
        ...s,
        lines: capLines([...s.lines, a.echo]),
        queue: [...s.queue, ...a.output],
        input: "",
        histIndex: -1,
        history,
        mode: a.mode ?? s.mode,
      }
    }
    case "queue":
      return { ...s, queue: [...s.queue, ...a.output] }
    case "flush": {
      if (s.queue.length === 0) return s
      const [head, ...rest] = s.queue
      return { ...s, lines: capLines([...s.lines, head]), queue: rest }
    }
    case "clear":
      return { ...s, lines: [], queue: [] }
    case "histNav":
      return { ...s, input: a.input, histIndex: a.histIndex }
    default:
      return s
  }
}

function initState(): State {
  let history: string[] = []
  try {
    const raw = typeof window !== "undefined" ? localStorage.getItem(LS.history) : null
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) history = parsed.filter((x) => typeof x === "string").slice(-50)
    }
  } catch {
    /* ignore */
  }
  return {
    lines: [
      ln("SAMIZDAT PRESS SHELL - v1.0"),
      ln("type help for the manifest. esc to close.", "graphite"),
    ],
    queue: [],
    input: "",
    history,
    histIndex: -1,
    mode: "command",
  }
}

/* -------------------------------------------------------------- component */

export default function PressShell({ writeups }: { writeups: WriteupMeta[] }) {
  const { shellOpen, closeShell, theme, setTheme } = usePress()
  const router = useRouter()

  const [state, dispatch] = useReducer(reducer, undefined, initState)
  const [sudoFlash, setSudoFlash] = useState(false)

  const inputRef = useRef<HTMLInputElement>(null)
  const logRef = useRef<HTMLDivElement>(null)
  const timers = useRef<number[]>([])
  const tabRef = useRef(false)
  const runRef = useRef<(raw: string) => void>(() => {})

  const later = useCallback((fn: () => void, ms: number) => {
    const id = window.setTimeout(fn, ms)
    timers.current.push(id)
    return id
  }, [])

  // clear every pending timer on unmount
  useEffect(() => () => timers.current.forEach((id) => clearTimeout(id)), [])

  const reduced = useCallback(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    [],
  )

  /* ----- line printer: one self-clearing interval, 12ms/line ----- */
  const hasQueue = state.queue.length > 0
  useEffect(() => {
    if (!hasQueue) return
    const id = window.setInterval(() => dispatch({ type: "flush" }), 12)
    return () => window.clearInterval(id)
  }, [hasQueue])

  /* ----- keep scrollback pinned to the bottom ----- */
  useEffect(() => {
    const el = logRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [state.lines])

  /* ----- persist history ----- */
  useEffect(() => {
    try {
      localStorage.setItem(LS.history, JSON.stringify(state.history.slice(-50)))
    } catch {
      /* ignore */
    }
  }, [state.history])

  /* ----- autofocus the input on open ----- */
  useEffect(() => {
    if (!shellOpen) return
    const id = window.setTimeout(() => inputRef.current?.focus(), 40)
    return () => clearTimeout(id)
  }, [shellOpen])

  /* ----- attract mode: 8s idle, once/session, empty history ----- */
  useEffect(() => {
    if (!shellOpen || reduced()) return
    if (typeof window === "undefined") return
    if (sessionStorage.getItem(SS.attracted)) return
    if (state.history.length > 0) return
    if (state.input !== "") return
    const id = window.setTimeout(() => {
      if (sessionStorage.getItem(SS.attracted)) return
      sessionStorage.setItem(SS.attracted, "1")
      ghostType("ls writeups")
    }, 8000)
    return () => clearTimeout(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shellOpen, state.input, state.history.length])

  /* --------------------------------------------------- command outputs */

  function helpLines(): Line[] {
    return [
      ln("SAMIZDAT PRESS SHELL - v1.0"),
      ln("  ls [writeups] - sections / the archive"),
      ln("  cat <slug> - read an abstract"),
      ln("  open <section> - jump the page"),
      ln("  whoami"),
      ln("  pgp - public key, copied"),
      ln("  contact - reach the editor"),
      ln("  resume - the personnel file (pdf)"),
      ln("  theme paper|ink - printed / ink edition"),
      ln("  date"),
      ln("  history"),
      ln("  clear"),
      ln("  exit"),
      ln("some commands are not listed. obviously.", "graphite"),
    ]
  }

  function sectionRows(): Line[] {
    const rows = SECTIONS.map((s) =>
      lseg([{ t: `${s.num}  ` }, { t: s.id.padEnd(13), c: "arterial" }, { t: s.desc }]),
    )
    rows.push(ln("try: open ledger", "graphite"))
    return rows
  }

  function writeupRows(): Line[] {
    return writeups.map((w) => {
      const num = String(w.number).padStart(3, "0")
      if (w.status === "EMBARGOED") {
        return lseg([
          { t: `${num}  ` },
          { t: "████████████  " },
          { t: "EMBARGOED", c: "arterial" },
        ])
      }
      const id = w.cves.length ? w.cves.join(",") : w.severity ?? ""
      const segs: Seg[] = [{ t: `${num}  ` }, { t: w.slug.padEnd(32) }, { t: `  ${id}` }]
      if (w.cvss != null) segs.push({ t: `  ${w.cvss}`, c: "arterial" })
      return lseg(segs)
    })
  }

  function catLines(slug: string): Line[] {
    if (!slug) return [ln("usage: cat <slug>")]
    const w = writeups.find((x) => x.slug === slug)
    if (!w) return [ln(`no such story: ${slug}`)]
    if (w.status === "EMBARGOED") {
      const out = Array.from({ length: 12 }, () => ln("█".repeat(46)))
      out.push(ln("nice try."))
      return out
    }
    const num = String(w.number).padStart(3, "0")
    const meta: string[] = []
    if (w.cves.length) meta.push(w.cves.join(", "))
    if (w.cvss != null) meta.push(`CVSS ${w.cvss}`)
    else if (w.severity) meta.push(w.severity)
    meta.push(w.date)
    meta.push(`${w.words} words`)
    return [
      lseg([{ t: `${num}  ` }, { t: w.title }]),
      ln(meta.join(" · "), "graphite"),
      ln(w.summary),
      lseg([{ t: `--- CONTINUED ON PAGE → /writeups/${w.slug} ---`, c: "arterial" }], {
        link: `/writeups/${w.slug}`,
      }),
    ]
  }

  function contactLines(): Line[] {
    return [
      ln(`mail      → ${site.email}`),
      ln(`github    → ${site.github}`),
      ln(`intigriti → ${site.intigriti}`),
      ln("desk      → open letters"),
    ]
  }

  function stringsLines(): Line[] {
    return [
      ln("^?ELF^B^A^A^@…"),
      ln("__stack_chk_fail"),
      ln("__libc_start_main"),
      ln(`${site.name} - ${site.location}`),
      ln("breaks software politely"),
      ln("GLIBC_2.34"),
      ln("coffee.overflow.ok"),
      ln("/robots.txt has opinions", "graphite"),
      ln("$Id: ochk0 issue-01 $"),
    ]
  }

  function historyLines(): Line[] {
    return state.history.map((h, i) => ln(`${String(i + 1).padStart(4)}  ${h}`))
  }

  function dateLines(): { output: Line[] } {
    return {
      output: [
        ln(new Date().toISOString()),
        lseg([{ t: "days since last 0-day: " }, { t: "[REDACTED]", c: "arterial" }]),
      ],
    }
  }

  /* --------------------------------------------------- commands + effects */

  type Result = { output: Line[]; mode?: Mode; effect?: () => void }

  function pgpCmd(): Result {
    if (site.pgp.publicKey) {
      try {
        navigator.clipboard?.writeText(site.pgp.publicKey)
      } catch {
        /* ignore */
      }
      return { output: [ln(site.pgp.fingerprint ?? ""), ln("key copied. use it.")] }
    }
    return { output: [ln(`no key published yet. plaintext accepted: ${site.email}`)] }
  }

  function themeCmd(arg: string): Result {
    if (arg === "paper") {
      if (theme === "paper") return { output: [ln("already on paper.")] }
      return {
        output: [ln("printed edition engaged. easy on the eyes, heavy on the hands.")],
        effect: () => setTheme("paper"),
      }
    }
    if (arg === "ink") {
      if (theme === "ink") return { output: [ln("already on ink.")] }
      return { output: [ln("back to ink.")], effect: () => setTheme("ink") }
    }
    return { output: [ln("usage: theme paper|ink")] }
  }

  function sudoCmd(): Result {
    const n = bumpIntrusions()
    return {
      output: [
        ln("unauthorized escalation attempt logged."),
        ln(`INTRUSION LOG: ${String(n).padStart(3, "0")}.`, "arterial"),
      ],
      effect: () => {
        if (reduced()) return
        setSudoFlash(true)
        later(() => setSudoFlash(false), 120)
      },
    }
  }

  function rmTheater(): Result {
    if (reduced()) {
      return {
        output: [
          ln("filesystem gone. restoring from /dev/hope…", "arterial"),
          ln("everything returns. that is the point of a press.", "graphite"),
        ],
      }
    }
    return {
      output: [],
      effect: () => {
        document.body.setAttribute("data-destroyed", "true")
        later(
          () =>
            dispatch({
              type: "queue",
              output: [ln("filesystem gone. restoring from /dev/hope…", "arterial")],
            }),
          1200,
        )
        later(() => document.body.removeAttribute("data-destroyed"), 2400)
        later(
          () =>
            dispatch({
              type: "queue",
              output: [ln("everything returns. that is the point of a press.", "graphite")],
            }),
          3000,
        )
      },
    }
  }

  function openSection(arg: string): Result {
    if (!arg) return { output: [ln("usage: open <section> - try: open ledger")] }
    if (!OPEN_IDS.includes(arg)) return { output: [ln(`not in this issue: ${arg}`)] }
    return {
      output: [ln("turning to page…", "graphite")],
      effect: () =>
        later(() => {
          closeShell()
          if (arg === "archive") {
            router.push("/writeups")
            return
          }
          requestAnimationFrame(() => {
            const el = document.getElementById(arg)
            if (el) el.scrollIntoView({ behavior: reduced() ? "auto" : "smooth", block: "start" })
            else router.push(`/#${arg}`)
          })
        }, 150),
    }
  }

  function credentialCmd(): Result {
    const rec = getFlagRecord()
    if (rec) {
      return {
        output: [
          ln(`credential on file - ${rec.handle}.`, "graphite"),
          lseg([{ t: "> download credential", c: "arterial" }], { action: "download" }),
        ],
      }
    }
    return { output: [ln("no credential on file. the flag is out there.")] }
  }

  function flagAttempt(input: string): Result {
    if (!isFlag(input)) return { output: [ln("invalid flag. check your sources.")] }
    const rec = getFlagRecord()
    if (rec) {
      return { output: [ln(`already verified, ${rec.handle}. the credential stands.`)] }
    }
    return {
      output: [
        ln("SOURCE VERIFIED.", "arterial"),
        ln("the press protects those who read the whole page."),
        ln("enter a handle for your press credential:", "graphite"),
      ],
      mode: "handle",
    }
  }

  function handle(input: string): Result {
    const parts = input.split(/\s+/)
    const cmd = parts[0]
    const arg = parts.slice(1).join(" ")
    switch (cmd) {
      case "help":
        return { output: helpLines() }
      case "ls":
        return { output: arg === "writeups" ? writeupRows() : sectionRows() }
      case "cat":
        return { output: catLines(arg) }
      case "open":
      case "cd":
        return openSection(arg)
      case "whoami":
        return { output: [ln("visitor. read-only. as it should be.")] }
      case "pgp":
        return pgpCmd()
      case "contact":
        return { output: contactLines() }
      case "resume":
        return {
          output: [ln("personnel file dispatched.")],
          effect: () => window.open(site.resume, "_blank", "noopener,noreferrer"),
        }
      case "theme":
        return themeCmd(arg)
      case "date":
        return dateLines()
      case "history":
        return { output: historyLines() }
      case "clear":
        return { output: [], effect: () => dispatch({ type: "clear" }) }
      case "exit":
        return {
          output: [ln("uplink cut. the presses keep running.")],
          effect: () => later(() => closeShell(), 300),
        }
      case "sudo":
        return sudoCmd()
      case "vim":
        return { output: [ln("this is a press, not an editor. (:q! reflex noted.)")] }
      case "strings":
        return arg === "/dev/editor"
          ? { output: stringsLines() }
          : { output: [ln(`not in this issue: ${input}`)] }
      case "credential":
        return credentialCmd()
      case "flag":
        return {
          output: [
            ln("usage: flag{...} - three parts: the source, the headers, the missing page."),
          ],
        }
      default:
        if (/^rm\s+-rf\s+\/\*?$/.test(input)) return rmTheater()
        if (cmd === "rm") return { output: [ln("removal is not journalism.")] }
        if (input.startsWith("flag{")) return flagAttempt(input)
        return { output: [ln(`not in this issue: ${input}`)] }
    }
  }

  /* --------------------------------------------------- submit / run */

  function runHandle(raw: string) {
    const handleName =
      raw.replace(/[\x00-\x1F\x7F]/g, "").trim().slice(0, 24) || "anonymous"
    const session = getSessionUptime()
    const solvedAt = new Date().toISOString()
    setFlagRecord({ handle: handleName, solvedAt, session })
    dispatch({
      type: "run",
      echo: lseg([{ t: "handle: ", c: "graphite" }, { t: raw }]),
      output: [
        ln(`PRESS CREDENTIAL ISSUED - ${handleName} - SESSION ${session}`),
        lseg([{ t: "> download credential", c: "arterial" }], { action: "download" }),
      ],
      mode: "command",
    })
  }

  function run(raw: string) {
    if (state.mode === "handle") {
      runHandle(raw)
      return
    }
    const echo = lseg([{ t: PROMPT, c: "graphite" }, { t: raw }])
    const trimmed = raw.trim()
    if (trimmed === "") {
      dispatch({ type: "run", echo, output: [] })
      return
    }
    if (SANITIZE.some((re) => re.test(trimmed))) {
      dispatch({
        type: "run",
        echo,
        output: [ln("cute. input is sanitized. this is a security researcher's website.")],
        addHistory: raw,
      })
      return
    }
    const { output, mode, effect } = handle(trimmed)
    dispatch({ type: "run", echo, output, addHistory: raw, mode })
    effect?.()
  }
  runRef.current = run

  function ghostType(text: string) {
    let i = 0
    const step = () => {
      i += 1
      dispatch({ type: "setInput", input: text.slice(0, i) })
      if (i < text.length) {
        later(step, 60)
      } else {
        later(() => {
          runRef.current(text)
          later(
            () =>
              dispatch({
                type: "queue",
                output: [ln("# the archive is right there. read something.", "graphite")],
              }),
            220,
          )
        }, 240)
      }
    }
    later(step, 60)
  }

  /* --------------------------------------------------- keyboard */

  function histPrev() {
    const h = state.history
    if (h.length === 0) return
    const idx = state.histIndex === -1 ? h.length - 1 : Math.max(0, state.histIndex - 1)
    dispatch({ type: "histNav", input: h[idx], histIndex: idx })
  }

  function histNext() {
    if (state.histIndex === -1) return
    const h = state.history
    const idx = state.histIndex + 1
    if (idx > h.length - 1) dispatch({ type: "histNav", input: "", histIndex: -1 })
    else dispatch({ type: "histNav", input: h[idx], histIndex: idx })
  }

  function commonPrefix(arr: string[]): string {
    if (arr.length === 0) return ""
    let p = arr[0]
    for (const s of arr) {
      while (p && !s.startsWith(p)) p = p.slice(0, -1)
      if (!p) break
    }
    return p
  }

  function complete() {
    const value = state.input
    const parts = value.split(/\s+/)
    const cur = parts[parts.length - 1]
    const before = value.slice(0, value.length - cur.length)
    let pool: string[] = []
    if (parts.length <= 1) {
      pool = COMMANDS
    } else {
      const c = parts[0]
      if (c === "cat") pool = writeups.map((w) => w.slug)
      else if (c === "open" || c === "cd") pool = OPEN_IDS
      else if (c === "theme") pool = ["paper", "ink"]
      else if (c === "ls") pool = ["writeups"]
    }
    const cands = pool.filter((p) => p.startsWith(cur))
    if (cands.length === 0) return
    if (cands.length === 1) {
      dispatch({ type: "setInput", input: `${before}${cands[0]} ` })
      tabRef.current = false
      return
    }
    const common = commonPrefix(cands)
    if (common.length > cur.length) {
      dispatch({ type: "setInput", input: `${before}${common}` })
      tabRef.current = false
      return
    }
    if (tabRef.current) {
      dispatch({ type: "queue", output: [ln(cands.join("  "), "graphite")] })
      tabRef.current = false
    } else {
      tabRef.current = true
    }
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key !== "Tab") tabRef.current = false
    if (e.key === "Enter") {
      e.preventDefault()
      run(state.input)
      return
    }
    if (e.key === "Tab") {
      e.preventDefault()
      e.stopPropagation()
      complete()
      return
    }
    if (e.key === "ArrowUp") {
      e.preventDefault()
      histPrev()
      return
    }
    if (e.key === "ArrowDown") {
      e.preventDefault()
      histNext()
      return
    }
    if (e.key === "l" && e.ctrlKey) {
      e.preventDefault()
      dispatch({ type: "clear" })
    }
  }

  /* --------------------------------------------------- credential dl */

  async function downloadCredential() {
    const rec = getFlagRecord()
    if (!rec) return
    try {
      const url = await mintCredentialPNG({
        handle: rec.handle,
        issue: site.issue,
        solvedAt: new Date(rec.solvedAt),
        session: rec.session,
      })
      const a = document.createElement("a")
      a.href = url
      a.download = "samizdat-press-credential.png"
      document.body.appendChild(a)
      a.click()
      a.remove()
    } catch {
      /* ignore */
    }
  }

  /* --------------------------------------------------- render */

  function toneClass(c?: Tone) {
    if (c === "arterial") return "text-arterial"
    if (c === "graphite") return "text-graphite"
    return "text-newsprint"
  }

  function renderLine(l: Line, i: number) {
    const spans = l.segs.map((s, j) => (
      <span key={j} className={toneClass(s.c)}>
        {s.t}
      </span>
    ))
    const base = "whitespace-pre-wrap break-words"
    if (l.action === "download") {
      return (
        <button
          key={i}
          type="button"
          onClick={downloadCredential}
          className={`${base} block w-full text-left press-invert`}
        >
          {spans}
        </button>
      )
    }
    if (l.link) {
      const href = l.link
      return (
        <a
          key={i}
          href={href}
          onClick={(e) => {
            e.preventDefault()
            closeShell()
            router.push(href)
          }}
          className={`${base} block press-invert`}
        >
          {spans}
        </a>
      )
    }
    return (
      <div key={i} className={base}>
        {spans}
      </div>
    )
  }

  return (
    <DialogPrimitive.Root
      open={shellOpen}
      onOpenChange={(o) => {
        if (!o) closeShell()
      }}
    >
      <DialogPrimitive.Portal>
        <DialogPrimitive.Content
          data-shell
          aria-label="Press shell"
          style={INK_VARS}
          onOpenAutoFocus={(e) => {
            e.preventDefault()
            inputRef.current?.focus()
          }}
          onInteractOutside={(e) => e.preventDefault()}
          onPointerDownOutside={(e) => e.preventDefault()}
          className="fixed inset-x-0 bottom-0 z-[80] flex h-[45vh] max-md:h-[50dvh] flex-col border-t border-arterial bg-void font-mono text-[14px] leading-[1.6] text-newsprint focus:outline-none"
        >
          <DialogPrimitive.Title className="sr-only">SAMIZDAT Press Shell</DialogPrimitive.Title>
          <DialogPrimitive.Description className="sr-only">
            Interactive terminal. Type help for commands. Press Escape to close.
          </DialogPrimitive.Description>

          <DialogPrimitive.Close
            aria-label="Close the press shell"
            className="absolute right-2 top-2 z-[81] border border-rule p-2 press-invert"
          >
            <X size={14} strokeWidth={1.5} />
          </DialogPrimitive.Close>

          {/* scrollback */}
          <div
            ref={logRef}
            role="log"
            aria-live="polite"
            className="flex-1 overflow-y-auto px-3 py-2 pr-12"
          >
            {state.lines.map((l, i) => renderLine(l, i))}
          </div>

          {/* mobile tap chips */}
          <div className="flex flex-wrap gap-1 border-t border-rule px-3 py-1 md:hidden">
            {CHIPS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => {
                  run(c)
                  inputRef.current?.focus()
                }}
                className="min-h-[44px] border border-rule px-2 text-[12px] press-invert"
              >
                [{c}]
              </button>
            ))}
          </div>

          {/* prompt */}
          <form
            onSubmit={(e) => {
              e.preventDefault()
              run(state.input)
            }}
            className="flex items-center border-t border-rule px-3 py-2"
          >
            <span className="whitespace-pre text-graphite">
              {state.mode === "handle" ? "handle: " : PROMPT}
            </span>
            <input
              ref={inputRef}
              value={state.input}
              onChange={(e) => dispatch({ type: "setInput", input: e.target.value })}
              onKeyDown={onKeyDown}
              spellCheck={false}
              autoComplete="off"
              autoCapitalize="off"
              autoCorrect="off"
              aria-label="Shell input"
              className="flex-1 bg-transparent font-mono text-[14px] text-newsprint caret-transparent outline-none"
            />
            <span className="blink text-arterial" aria-hidden="true">
              ▌
            </span>
          </form>
        </DialogPrimitive.Content>

        {sudoFlash && <div className="sudo-flash" aria-hidden="true" />}
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}
