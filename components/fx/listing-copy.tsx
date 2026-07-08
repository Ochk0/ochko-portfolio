"use client"

import { useEffect } from "react"

/**
 * ListingCopy - renders nothing. Mounted once on a writeup page, it event-delegates
 * clicks on any ".copy-bytes" button inside a listing figure, copies that figure's
 * <pre> text, and flips the button label to `COPIED 0x…​ BYTES` for 1.5s.
 */
export function ListingCopy() {
  useEffect(() => {
    const restore = new WeakMap<HTMLElement, number>()

    const onClick = async (e: MouseEvent) => {
      const target = e.target as HTMLElement | null
      const btn = target?.closest<HTMLElement>(".copy-bytes")
      if (!btn) return

      const fig = btn.closest(".listing")
      const pre = fig?.querySelector("pre")
      if (!pre) return

      const text = pre.textContent ?? ""
      try {
        await navigator.clipboard?.writeText(text)
      } catch {
        /* clipboard blocked - still report the byte count */
      }

      const bytes = new TextEncoder().encode(text).length
      const original = restore.has(btn)
        ? btn.dataset.copyLabel ?? "COPY"
        : btn.textContent ?? "COPY"
      btn.dataset.copyLabel = original
      btn.textContent = `COPIED 0x${bytes.toString(16).toUpperCase()} BYTES`

      const prev = restore.get(btn)
      if (prev) window.clearTimeout(prev)
      const id = window.setTimeout(() => {
        btn.textContent = btn.dataset.copyLabel ?? "COPY"
        restore.delete(btn)
      }, 1500)
      restore.set(btn, id)
    }

    document.addEventListener("click", onClick)
    return () => document.removeEventListener("click", onClick)
  }, [])

  return null
}
