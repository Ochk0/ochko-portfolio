"use client"

// PressBoot - a ≤900ms print-registration overlay laid over the already
// server-rendered page. Session-gated, skipped under reduced motion, and
// dismissable by any input. Never gates paint; the issue prints beneath it.
import { useEffect, useState } from "react"
import { SS } from "@/lib/press"

const LINES = [
  "SETTING TYPE .......... OK",
  "INKING ROLLERS ........ OK",
  "REGISTRATION .......... ALIGNED",
  "PRESS RUN - ISSUE #01 . GO",
]

export function PressBoot() {
  const [visible, setVisible] = useState(false)
  const [shown, setShown] = useState(0)

  useEffect(() => {
    let booted = false
    try {
      booted = Boolean(sessionStorage.getItem(SS.booted))
    } catch {
      /* ignore */
    }
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    if (booted || reduce) {
      try {
        sessionStorage.setItem(SS.booted, "1")
      } catch {
        /* ignore */
      }
      return
    }

    setVisible(true)

    const finish = () => {
      try {
        sessionStorage.setItem(SS.booted, "1")
      } catch {
        /* ignore */
      }
      setVisible(false)
    }

    const timers: number[] = []
    ;[0, 160, 320, 480].forEach((ms, i) => {
      timers.push(window.setTimeout(() => setShown(i + 1), ms))
    })
    timers.push(window.setTimeout(finish, 900))

    window.addEventListener("keydown", finish)
    window.addEventListener("pointerdown", finish)

    return () => {
      timers.forEach((t) => clearTimeout(t))
      window.removeEventListener("keydown", finish)
      window.removeEventListener("pointerdown", finish)
    }
  }, [])

  if (!visible) return null

  return (
    <div
      data-boot
      aria-hidden="true"
      className="fixed inset-0 z-[100] flex flex-col justify-end bg-tar"
    >
      <div className="container-press pb-16 md:pb-24">
        {LINES.slice(0, shown).map((line, i) => (
          <p key={i} className="meta text-newsprint">
            {line}
          </p>
        ))}
        <p className="meta mt-2 text-arterial blink">█</p>
      </div>
    </div>
  )
}
