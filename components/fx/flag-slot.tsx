"use client"

import { useEffect, useState } from "react"

import { mintCredentialPNG } from "@/lib/credential"
import { EVT, getFlagRecord, type FlagRecord } from "@/lib/press"
import { site } from "@/lib/site"

/**
 * FlagSlot - the scoreboard's CTF strip. Default: instructions for the three-part hunt.
 * Solved (from smz.flag / smz:flag-solved): a verified banner + a button that mints the
 * personalized credential PNG and triggers a download.
 */
export function FlagSlot() {
  const [rec, setRec] = useState<FlagRecord | null>(null)
  const [minting, setMinting] = useState(false)

  useEffect(() => {
    setRec(getFlagRecord())
    const onSolved = (e: Event) => {
      const detail = (e as CustomEvent).detail as FlagRecord | undefined
      setRec(detail ?? getFlagRecord())
    }
    window.addEventListener(EVT.flagSolved, onSolved as EventListener)
    return () => window.removeEventListener(EVT.flagSolved, onSolved as EventListener)
  }, [])

  const download = async () => {
    if (!rec || minting) return
    setMinting(true)
    try {
      const url = await mintCredentialPNG({
        handle: rec.handle,
        issue: site.issue,
        solvedAt: new Date(rec.solvedAt),
        session: rec.session,
      })
      const a = document.createElement("a")
      a.href = url
      a.download = "ochk0-credential.png"
      document.body.appendChild(a)
      a.click()
      a.remove()
    } finally {
      setMinting(false)
    }
  }

  if (rec) {
    const date = rec.solvedAt.slice(0, 10)
    return (
      <div className="mt-8 border border-arterial p-5">
        <p className="font-mono text-[13px] uppercase tracking-[0.14em] text-newsprint">
          SOURCE VERIFIED - {rec.handle} - {date}
        </p>
        <button
          type="button"
          onClick={download}
          disabled={minting}
          className="press-invert mt-4 border border-arterial px-4 py-2 font-mono text-[13px] uppercase tracking-[0.18em] text-arterial disabled:opacity-60"
        >
          {minting ? "[ MINTING… ]" : "[ DOWNLOAD CREDENTIAL ]"}
        </button>
      </div>
    )
  }

  return (
    <div className="mt-8 border border-rule p-5">
      <p className="font-mono text-[13px] uppercase tracking-[0.14em] text-newsprint">
        THIS PAGE IS ALSO A CTF. THREE PARTS: THE SOURCE, THE HEADERS, THE MISSING PAGE.
      </p>
      <p className="meta mt-3">
        ASSEMBLE flag{"{...}"} AND SUBMIT IN THE SHELL - PRESS ~
      </p>
    </div>
  )
}
