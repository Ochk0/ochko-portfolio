"use client"

// ArchiveList - the full-issue index at /writeups. Same toc-row anatomy as the
// cover-story section (§4 #index) but includes NOTES and adds client-side filter
// chips. All rows are server-serialized into props; the filter never fetches.
import { useMemo, useState } from "react"

import { DecodeText } from "@/components/fx/decode-text"
import { Redacted } from "@/components/fx/redacted"
import { Stamp } from "@/components/fx/stamp"
import { Countdown } from "@/components/fx/countdown"
import type { WriteupMeta } from "@/lib/writeups"

type Filter = "ALL" | "CVE" | "RESEARCH" | "NOTES"

const FILTERS: { label: Filter; match: (w: WriteupMeta) => boolean }[] = [
  { label: "ALL", match: () => true },
  { label: "CVE", match: (w) => w.type === "cve" },
  { label: "RESEARCH", match: (w) => w.type === "research" },
  { label: "NOTES", match: (w) => w.type === "note" },
]

function thousands(n: number): string {
  return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

function metaLine(w: WriteupMeta): string {
  const parts: string[] = []
  parts.push(w.cves.length > 0 ? w.cves.join(" ") : w.type.toUpperCase())
  if (w.severity) parts.push(w.severity)
  if (typeof w.cvss === "number") parts.push(`CVSS ${w.cvss.toFixed(1)}`)
  parts.push(`${thousands(w.words)} WORDS`)
  if (w.date) parts.push(w.date)
  return parts.join(" · ")
}

const ROW =
  "grid grid-cols-[auto_1fr] items-baseline gap-x-4 gap-y-2 border-t border-rule py-5 md:grid-cols-[auto_1fr_auto] md:items-center md:py-6"

const INDEX_NO =
  "font-display leading-none text-[clamp(1.5rem,3.5vw,2.75rem)] text-newsprint"

const TITLE =
  "row-title block truncate font-mono text-[15px] font-bold uppercase tracking-[0.02em] text-newsprint md:text-[18px]"

function DisclosedRow({ w }: { w: WriteupMeta }) {
  const no = String(w.number).padStart(3, "0")
  const marquee = `${w.title} /// `.repeat(4)
  return (
    <a href={`/writeups/${w.slug}`} className={`toc-row press-invert ${ROW}`}>
      <span className={INDEX_NO}>{no}</span>
      <div className="relative min-w-0">
        <DecodeText as="span" text={w.title} trigger="inview" className={TITLE} />
        <span className="marquee" aria-hidden="true">
          <span className="marquee-track font-mono text-[15px] font-bold uppercase tracking-[0.02em] md:text-[18px]">
            {marquee}
          </span>
        </span>
      </div>
      <div className="meta col-start-2 md:col-start-3 md:text-right">{metaLine(w)}</div>
    </a>
  )
}

function EmbargoedRow({ w }: { w: WriteupMeta }) {
  const no = String(w.number).padStart(3, "0")
  return (
    <div
      className={`toc-row group relative ${ROW}`}
      data-embargoed=""
      aria-label="Embargoed disclosure"
    >
      <span className={INDEX_NO}>{no}</span>
      <div className="min-w-0">
        <Redacted length={24} label="Embargoed disclosure" className="text-[15px] md:text-[18px]" />
      </div>
      <div className="meta col-start-2 flex flex-wrap items-center gap-x-1 md:col-start-3 md:justify-end md:text-right">
        <span>{w.type.toUpperCase()}-REDACTED ·</span>
        <span>[SEV REDACTED] ·</span>
        <Countdown until={w.embargoUntil ?? ""} />
      </div>
      <div className="pointer-events-none absolute right-4 top-1/2 z-10 hidden -translate-y-1/2 group-hover:block">
        <Stamp animateIn angle={-6}>
          UNDER EMBARGO
        </Stamp>
      </div>
    </div>
  )
}

export function ArchiveList({ metas }: { metas: WriteupMeta[] }) {
  const [active, setActive] = useState<Filter>("ALL")

  const sorted = useMemo(
    () => [...metas].sort((a, b) => a.number - b.number),
    [metas],
  )

  const rows = useMemo(() => {
    const f = FILTERS.find((x) => x.label === active) ?? FILTERS[0]
    return sorted.filter(f.match)
  }, [sorted, active])

  return (
    <div>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter the archive">
        {FILTERS.map((f) => {
          const on = active === f.label
          return (
            <button
              key={f.label}
              type="button"
              aria-pressed={on}
              onClick={() => setActive(f.label)}
              className={`border border-rule px-3 py-2 font-mono text-[12px] uppercase tracking-[0.18em] transition-none ${
                on ? "bg-arterial text-void" : "text-newsprint press-invert"
              }`}
            >
              [ {f.label} ]
            </button>
          )
        })}
      </div>

      <div className="mt-10 border-b border-rule">
        {rows.length === 0 ? (
          <p className="meta border-t border-rule py-8">
            NOTHING FILED UNDER THIS HEADING.
          </p>
        ) : (
          rows.map((w) =>
            w.status === "EMBARGOED" ? (
              <EmbargoedRow key={w.slug} w={w} />
            ) : (
              <DisclosedRow key={w.slug} w={w} />
            ),
          )
        )}
      </div>
    </div>
  )
}
