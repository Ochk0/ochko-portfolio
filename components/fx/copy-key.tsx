"use client"

import { useEffect, useRef, useState } from "react"
import { Copy } from "lucide-react"

import { Stamp } from "@/components/fx/stamp"

// Session-scoped flag: once the key is copied, the VERIFIED stamp persists for the tab.
const VERIFIED_KEY = "smz.pgp-verified"

/**
 * CopyKey - renders a PGP fingerprint + a copy button. On copy: writes the full public
 * key to the clipboard, flashes "KEY COPIED. USE IT." for 2s, and slams a skewed
 * "── VERIFIED ──" stamp over the well (which stays for the rest of the session).
 */
export function CopyKey(props: { value: string; fingerprint: string }) {
  const { value, fingerprint } = props
  const [copied, setCopied] = useState(false)
  const [verified, setVerified] = useState(false)
  const timer = useRef<number | null>(null)

  useEffect(() => {
    if (typeof window === "undefined") return
    if (sessionStorage.getItem(VERIFIED_KEY)) setVerified(true)
  }, [])

  useEffect(() => {
    return () => {
      if (timer.current) window.clearTimeout(timer.current)
    }
  }, [])

  const onCopy = async () => {
    try {
      await navigator.clipboard?.writeText(value)
    } catch {
      /* clipboard blocked - still stamp the intent */
    }
    setVerified(true)
    setCopied(true)
    try {
      sessionStorage.setItem(VERIFIED_KEY, "1")
    } catch {
      /* ignore */
    }
    if (timer.current) window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="relative">
      <div className="font-mono text-[13px] leading-[1.7] tracking-[0.14em] text-newsprint break-all">
        {fingerprint}
      </div>

      <button
        type="button"
        onClick={onCopy}
        className="press-invert mt-3 inline-flex items-center gap-2 border border-rule px-3 py-2 font-mono text-[12px] uppercase tracking-[0.18em] text-newsprint"
      >
        <Copy size={14} strokeWidth={1.5} />
        {copied ? "KEY COPIED. USE IT." : "COPY PUBLIC KEY"}
      </button>

      {verified && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <Stamp animateIn angle={-8}>── VERIFIED ──</Stamp>
        </div>
      )}
    </div>
  )
}
