"use client"

import { useEffect, useState, type ComponentType } from "react"
import { createPortal } from "react-dom"
import { DemoRegexInjection } from "./demo-regex-injection"
import { DemoPathTraversal } from "./demo-path-traversal"
import { DemoCvss } from "./demo-cvss"

// registry: markdown ```demo id ->  component
const REGISTRY: Record<string, ComponentType> = {
  "regex-injection": DemoRegexInjection,
  "path-traversal": DemoPathTraversal,
  cvss: DemoCvss,
}

type Slot = { el: HTMLElement; id: string }

/**
 * Scans the rendered article for <div class="demo-slot" data-demo="..."> mount
 * points and portals the matching interactive component into each. Renders
 * nothing itself. Unknown ids are left as-is (empty slot, no crash).
 */
export function WriteupDemos() {
  const [slots, setSlots] = useState<Slot[]>([])

  useEffect(() => {
    const nodes = Array.from(
      document.querySelectorAll<HTMLElement>(".demo-slot[data-demo]"),
    )
    setSlots(
      nodes
        .map((el) => ({ el, id: el.dataset.demo ?? "" }))
        .filter((s) => s.id in REGISTRY),
    )
  }, [])

  return (
    <>
      {slots.map(({ el, id }, i) => {
        const Demo = REGISTRY[id]
        return createPortal(<Demo />, el, `${id}-${i}`)
      })}
    </>
  )
}
