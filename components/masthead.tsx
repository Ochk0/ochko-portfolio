"use client"

// Masthead - the sticky top plate. Wordmark, the live ticker, the CONTENTS
// sheet, and the [~] key that raises the press shell.
import { useState } from "react"
import { site } from "@/lib/site"
import { usePress } from "@/components/press/press-provider"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

const SECTIONS = [
  { numeral: "0x01", id: "index", label: "WRITEUPS" },
  { numeral: "0x02", id: "ledger", label: "DISCLOSURE LEDGER" },
  { numeral: "0x03", id: "editor", label: "ABOUT" },
  { numeral: "0x04", id: "history", label: "EXPERIENCE" },
  { numeral: "0x05", id: "classifieds", label: "PROJECTS" },
  { numeral: "0x06", id: "scoreboard", label: "CTF RECORD" },
  { numeral: "0x07", id: "colophon", label: "STACK" },
  { numeral: "0x08", id: "letters", label: "CONTACT" },
] as const

export function Masthead({
  commit,
  buildDate,
  publicCount,
  embargoedCount,
}: {
  commit: string
  buildDate: string
  publicCount: number
  embargoedCount: number
}) {
  const { toggleShell, theme, setTheme } = usePress()
  const [held, setHeld] = useState(false)

  void embargoedCount
  const segment = `LAST COMMIT ${commit} /// BUILD ${buildDate} /// ${publicCount} WRITEUPS PUBLISHED /// NO GODS NO MASTERS NO CLOSED SOURCE /// PRESS ~ FOR THE SHELL /// `

  return (
    <header className="sticky top-0 z-50 h-12 border-b border-rule bg-tar/95 backdrop-blur-none">
      <div className="container-press grid h-full grid-cols-[auto_1fr_auto] items-center gap-4">
        {/* Left - wordmark */}
        <a href="#top" className="flex items-baseline gap-2 whitespace-nowrap">
          <span className="font-display text-[16px] uppercase tracking-[-0.01em] leading-none">
            OCHK0
          </span>
          <span className="meta hidden sm:inline">· SECURITY RESEARCH</span>
        </a>

        {/* Center - the ticker (pausable) */}
        <button
          type="button"
          onClick={() => setHeld((h) => !h)}
          data-held={held ? "true" : undefined}
          aria-pressed={held}
          aria-label={held ? "Resume the ticker" : "Hold the ticker"}
          className="ticker relative hidden h-full min-w-0 cursor-pointer border-none bg-transparent text-left md:block"
        >
          <span className="ticker-track font-mono text-[11px] uppercase tracking-[0.08em] text-arterial">
            <span>{segment}</span>
            <span>{segment}</span>
          </span>
          {held ? (
            <span className="pointer-events-none absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
              <span className="stamp text-[10px]">[HELD]</span>
            </span>
          ) : null}
        </button>

        {/* Right - CONTENTS + shell key */}
        <div className="flex items-center justify-self-end gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <button
                type="button"
                className="meta press-invert border border-rule px-3 py-1.5"
              >
                CONTENTS
              </button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-[300px] border-l border-rule bg-tar text-newsprint sm:max-w-[300px]"
            >
              <SheetHeader className="text-left">
                <SheetTitle className="font-display text-2xl uppercase tracking-[-0.01em] text-newsprint">
                  Contents
                </SheetTitle>
                <SheetDescription className="meta">
                  OCHK0 · SECURITY RESEARCHER
                </SheetDescription>
              </SheetHeader>

              <nav className="mt-6 flex flex-col">
                {SECTIONS.map((s) => (
                  <SheetClose asChild key={s.id}>
                    <a
                      href={`#${s.id}`}
                      className="press-invert flex items-baseline gap-3 border-t border-rule px-2 py-3 font-mono text-[13px] uppercase"
                    >
                      <span className="tabular text-arterial">{s.numeral}</span>
                      <span>{s.label}</span>
                    </a>
                  </SheetClose>
                ))}
                <SheetClose asChild>
                  <a
                    href="/writeups"
                    className="press-invert border-y border-rule px-2 py-3 font-mono text-[13px] uppercase"
                  >
                    ALL WRITEUPS → /writeups
                  </a>
                </SheetClose>
                <a
                  href={site.resume}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="press-invert px-2 py-3 font-mono text-[13px] uppercase text-arterial"
                >
                  RESUME (PDF)
                </a>
              </nav>

              <div className="mt-6 border-t border-rule pt-4">
                <p className="meta mb-3">THEME</p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setTheme("ink")}
                    aria-pressed={theme === "ink"}
                    className={`border border-rule px-4 py-2 font-mono text-[13px] uppercase transition-none ${
                      theme === "ink"
                        ? "bg-arterial text-primary-foreground"
                        : "text-graphite hover:text-newsprint"
                    }`}
                  >
                    INK
                  </button>
                  <button
                    type="button"
                    onClick={() => setTheme("paper")}
                    aria-pressed={theme === "paper"}
                    className={`border border-rule px-4 py-2 font-mono text-[13px] uppercase transition-none ${
                      theme === "paper"
                        ? "bg-arterial text-primary-foreground"
                        : "text-graphite hover:text-newsprint"
                    }`}
                  >
                    PAPER
                  </button>
                </div>
              </div>
            </SheetContent>
          </Sheet>

          <button
            type="button"
            onClick={toggleShell}
            aria-label="Open the press shell"
            className="press-invert border border-rule px-3 py-1.5 font-mono text-[13px] leading-none"
          >
            [~]
          </button>
        </div>
      </div>
    </header>
  )
}
