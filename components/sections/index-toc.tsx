import { SectionFrame } from "@/components/section-frame"
import { DecodeText } from "@/components/fx/decode-text"
import { Redacted } from "@/components/fx/redacted"
import { Stamp } from "@/components/fx/stamp"
import { Countdown } from "@/components/fx/countdown"
import type { WriteupMeta } from "@/lib/writeups"

function thousands(n: number): string {
  return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

function metaLine(w: WriteupMeta): string {
  const parts: string[] = []
  // lead with the CVE id when there is one, else the severity/class label
  parts.push(w.cves.length > 0 ? w.cves.join(" ") : w.severity ?? w.type.toUpperCase())
  if (w.cves.length > 0 && w.severity) parts.push(w.severity)
  if (typeof w.cvss === "number") parts.push(`CVSS ${w.cvss.toFixed(1)}`)
  parts.push(`${thousands(w.words)} WORDS`)
  if (w.date) parts.push(w.date)
  return parts.join(" · ")
}

const ROW =
  "grid grid-cols-[auto_1fr] items-baseline gap-x-4 gap-y-2 border-t border-rule py-6 md:grid-cols-[auto_1fr_auto] md:items-center md:py-8"

const TITLE =
  "row-title block truncate font-mono text-[16px] font-bold uppercase tracking-[0.02em] text-newsprint md:text-[20px]"

function indexNoClass(dim: boolean): string {
  return dim
    ? "font-display leading-none text-[clamp(1.35rem,3vw,2.25rem)] text-graphite"
    : "font-display leading-none text-[clamp(1.75rem,4vw,3.25rem)] text-newsprint"
}

function GroupLabel({ label, sub, className = "" }: { label: string; sub: string; className?: string }) {
  return (
    <div className={`flex flex-wrap items-baseline justify-between gap-x-4 border-b-2 border-arterial pb-2 ${className}`}>
      <span className="font-display uppercase leading-none text-[clamp(1.1rem,2.6vw,1.7rem)] text-newsprint">
        {label}
      </span>
      <span className="meta">{sub}</span>
    </div>
  )
}

function DisclosedRow({ w, dim = false }: { w: WriteupMeta; dim?: boolean }) {
  const no = String(w.number).padStart(3, "0")
  const marquee = `${w.title} /// `.repeat(4)
  return (
    <a href={`/writeups/${w.slug}`} className={`toc-row press-invert ${ROW}`}>
      <span className={indexNoClass(dim)}>{no}</span>
      <div className="relative min-w-0">
        <DecodeText as="span" text={w.title} trigger="inview" className={TITLE} />
        <span className="marquee" aria-hidden="true">
          <span className="marquee-track font-mono text-[16px] font-bold uppercase tracking-[0.02em] md:text-[20px]">
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
      <span className={indexNoClass(false)}>{no}</span>
      <div className="min-w-0">
        <Redacted length={24} label="Embargoed disclosure" className="text-[16px] md:text-[20px]" />
      </div>
      <div className="meta col-start-2 flex flex-wrap items-center gap-x-1 md:col-start-3 md:justify-end md:text-right">
        <span>CVE-2026-</span>
        <Redacted length={5} label="Embargoed identifier" />
        <span>· [SEV REDACTED] ·</span>
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

function renderRow(w: WriteupMeta, dim = false) {
  return w.status === "EMBARGOED" ? (
    <EmbargoedRow key={w.slug} w={w} />
  ) : (
    <DisclosedRow key={w.slug} w={w} dim={dim} />
  )
}

export function IndexToc({ writeups }: { writeups: WriteupMeta[] }) {
  const sorted = [...writeups].sort((a, b) => a.number - b.number)
  const findings = sorted.filter((w) => w.type === "cve" || w.type === "research")
  const notes = sorted.filter((w) => w.type === "note")

  return (
    <SectionFrame
      id="index"
      index={1}
      numeral="0x01"
      title="COVER STORIES"
      tagline="PUBLISHED VULNERABILITY RESEARCH · AND THE PRACTICE BEHIND IT"
    >
      <div className="mt-10">
        <GroupLabel label="DISCLOSURES" sub="CVEs & COORDINATED BOUNTIES · PUBLICLY VERIFIABLE" />
        {findings.map((w) => renderRow(w))}

        {notes.length > 0 && (
          <>
            <GroupLabel
              label="LAB NOTES"
              sub="EXPLOITATION PRACTICE · pwn.college & CTF - NOT DISCLOSURES"
              className="mt-16"
            />
            {notes.map((w) => renderRow(w, true))}
          </>
        )}

        {/* footer row - the whole archive */}
        <a
          href="/writeups"
          className="press-invert mt-2 flex items-center justify-between border-y border-rule py-5 meta"
        >
          <span>→ FULL ARCHIVE</span>
          <span className="text-arterial">/writeups</span>
        </a>
      </div>
    </SectionFrame>
  )
}
