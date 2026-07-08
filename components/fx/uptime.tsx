"use client"

import { useEffect, useState } from "react"

import { getSessionUptime } from "@/lib/press"

/**
 * Uptime - "SESSION 00:04:12", ticking once per second from the session-start
 * timestamp. It is content (the back cover's heartbeat), so it ticks regardless of
 * reduced-motion. The interval self-clears on unmount.
 */
export function Uptime() {
  const [uptime, setUptime] = useState<string>("00:00")

  useEffect(() => {
    setUptime(getSessionUptime())
    const id = setInterval(() => setUptime(getSessionUptime()), 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <span className="meta tabular" suppressHydrationWarning>
      SESSION {uptime}
    </span>
  )
}
