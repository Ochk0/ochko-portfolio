"use client"

import { createElement, useEffect, useRef, useState } from "react"

type Tag = "span" | "h1" | "h2" | "div"

const GLYPHS = "▓▒░#$%&@X01"
const TICK_MS = 40

export function DecodeText({
  text,
  as = "span",
  className,
  trigger = "mount",
  durationMs = 450,
  stickLastMs = 0,
}: {
  text: string
  as?: Tag
  className?: string
  trigger?: "mount" | "inview"
  durationMs?: number
  stickLastMs?: number
}) {
  // SSR + first client render = final text (no hydration mismatch, no-JS safe).
  const [display, setDisplay] = useState(text)
  const [scrambling, setScrambling] = useState(false)
  const ref = useRef<HTMLElement | null>(null)
  const startedRef = useRef(false)

  useEffect(() => {
    if (typeof window === "undefined") return
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reduce) {
      setDisplay(text)
      return
    }

    let tickTimer: ReturnType<typeof setInterval> | null = null
    let stickTimer: ReturnType<typeof setInterval> | null = null
    let stopTimer: ReturnType<typeof setTimeout> | null = null
    let flashTimer: ReturnType<typeof setTimeout> | null = null
    let observer: IntersectionObserver | null = null

    const rand = () => GLYPHS[Math.floor(Math.random() * GLYPHS.length)]

    const run = () => {
      if (startedRef.current) return
      startedRef.current = true
      setScrambling(true)
      const chars = text.split("")
      const len = chars.length
      const start = performance.now()

      tickTimer = setInterval(() => {
        const elapsed = performance.now() - start
        const lockedCount = Math.floor((elapsed / durationMs) * len)
        const out = chars
          .map((c, i) => {
            if (/\s/.test(c)) return c // never scramble whitespace (stable layout)
            return i < lockedCount ? c : rand()
          })
          .join("")
        setDisplay(out)

        if (elapsed >= durationMs) {
          if (tickTimer) clearInterval(tickTimer)
          tickTimer = null
          if (stickLastMs > 0 && len > 0) {
            // last character keeps cycling, then slams in with a flash
            const head = chars.slice(0, -1).join("")
            const lastReal = chars[len - 1]
            stickTimer = setInterval(() => {
              setDisplay(head + rand())
            }, TICK_MS)
            stopTimer = setTimeout(() => {
              if (stickTimer) clearInterval(stickTimer)
              stickTimer = null
              setDisplay(text)
              setScrambling(false)
              const el = ref.current
              if (el) {
                el.classList.add("text-arterial")
                flashTimer = setTimeout(() => el.classList.remove("text-arterial"), 120)
              }
            }, stickLastMs)
            void lastReal
          } else {
            setDisplay(text)
            setScrambling(false)
          }
        }
      }, TICK_MS)
    }

    if (trigger === "inview") {
      const el = ref.current
      if (!el) return
      observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((e) => e.isIntersecting)) {
            run()
            observer?.disconnect()
          }
        },
        { threshold: 0.2 },
      )
      observer.observe(el)
    } else {
      run()
    }

    return () => {
      if (tickTimer) clearInterval(tickTimer)
      if (stickTimer) clearInterval(stickTimer)
      if (stopTimer) clearTimeout(stopTimer)
      if (flashTimer) clearTimeout(flashTimer)
      observer?.disconnect()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text])

  return createElement(
    as,
    {
      ref,
      className,
      "aria-label": scrambling ? text : undefined,
    },
    display,
  )
}
