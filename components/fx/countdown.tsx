"use client"

import { useEffect, useState } from "react"

export interface CountdownProps {
  until: string
  className?: string
  expiredText?: string
}

const DEFAULT_EXPIRED = "EMBARGO LIFTED - REPRINT IN PROGRESS"

function pad(n: number): string {
  return String(n).padStart(2, "0")
}

function format(remainingMs: number): string {
  const total = Math.max(0, Math.floor(remainingMs / 1000))
  const days = Math.floor(total / 86400)
  const hours = Math.floor((total % 86400) / 3600)
  const minutes = Math.floor((total % 3600) / 60)
  const seconds = total % 60
  return `${pad(days)}D ${pad(hours)}H ${pad(minutes)}M ${pad(seconds)}S`
}

/**
 * Countdown - live embargo timer, e.g. "41D 07H 22M 09S". It is content, not
 * decoration, so it keeps ticking even under prefers-reduced-motion. A single 1s
 * interval is self-cleared on unmount. At <= 0 it renders `expiredText`.
 *
 * The page is statically generated, so the server-rendered value reflects build time;
 * `suppressHydrationWarning` lets the client's live clock take over cleanly on mount.
 */
export function Countdown({ until, className, expiredText }: CountdownProps) {
  const compute = () => {
    const remaining = Date.parse(until) - Date.now()
    return !Number.isFinite(remaining) || remaining <= 0
      ? expiredText ?? DEFAULT_EXPIRED
      : format(remaining)
  }

  const [display, setDisplay] = useState<string>(compute)

  useEffect(() => {
    const target = Date.parse(until)
    const update = () => {
      const remaining = target - Date.now()
      setDisplay(
        !Number.isFinite(remaining) || remaining <= 0
          ? expiredText ?? DEFAULT_EXPIRED
          : format(remaining),
      )
    }
    update()
    const id = setInterval(update, 1000)
    return () => clearInterval(id)
  }, [until, expiredText])

  const classes = className ? `uppercase tabular ${className}` : "uppercase tabular"
  return (
    <span className={classes} suppressHydrationWarning>
      {display}
    </span>
  )
}
