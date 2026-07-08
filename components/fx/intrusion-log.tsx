"use client"

import { useEffect, useState } from "react"

import { EVT, getIntrusions } from "@/lib/press"

/**
 * IntrusionLog - hidden until the first `sudo` in the press shell bumps the intrusion
 * counter. Reads the persisted count and listens for the `smz:intrusion` event, then
 * renders "INTRUSION LOG: 003" in arterial. Renders nothing while the count is zero.
 */
export function IntrusionLog() {
  const [count, setCount] = useState<number>(0)

  useEffect(() => {
    setCount(getIntrusions())
    const handler = (event: Event) => {
      const detail = (event as CustomEvent).detail
      if (typeof detail === "number") setCount(detail)
      else setCount(getIntrusions())
    }
    window.addEventListener(EVT.intrusion, handler)
    return () => window.removeEventListener(EVT.intrusion, handler)
  }, [])

  if (count <= 0) return null

  return (
    <span className="meta text-arterial">
      INTRUSION LOG: {String(count).padStart(3, "0")}
    </span>
  )
}
