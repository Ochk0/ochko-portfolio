import type { Metadata } from "next"
import type { ReactNode } from "react"
import { notFound } from "next/navigation"

import { getAllWriteups, getWriteup } from "@/lib/writeups"
import type { Writeup, WriteupMeta } from "@/lib/writeups"
import { Redacted } from "@/components/fx/redacted"
import { Stamp } from "@/components/fx/stamp"
import { Countdown } from "@/components/fx/countdown"
import { ListingCopy } from "@/components/fx/listing-copy"
import { WriteupDemos } from "@/components/writeups/writeup-demos"

type Params = { slug: string }

export function generateStaticParams(): Params[] {
  // All non-DRAFT writeups (embargoed included - they render the embargo notice).
  return getAllWriteups().map((w) => ({ slug: w.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>
}): Promise<Metadata> {
  const { slug } = await params
  const w = getWriteup(slug)
  if (!w) return { title: "Not Found" }

  if (w.status === "EMBARGOED") {
    // Nothing about the story leaks - not the title, not the vendor.
    return {
      title: "Under Embargo",
      description:
        "This disclosure is under embargo. It returns when the vendor ships the fix.",
    }
  }

  return { title: w.title, description: w.summary }
}

function cvssMeter(cvss: number): string {
  const blocks = Math.max(0, Math.min(10, Math.round(cvss)))
  return `[${"█".repeat(blocks)}${"▒".repeat(10 - blocks)}] ${cvss.toFixed(1)}`
}

function AdvisoryRow({
  label,
  children,
}: {
  label: string
  children: ReactNode
}) {
  return (
    <div className="grid grid-cols-[9rem_1fr] items-start gap-4 border-t border-rule px-4 py-3 first:border-t-0">
      <span className="meta pt-0.5">{label}</span>
      <div className="font-mono text-[14px] text-newsprint">{children}</div>
    </div>
  )
}

function Advisory({ w }: { w: Writeup }) {
  return (
    <figure className="listing my-10">
      <figcaption>
        <span>ADVISORY - {w.cves.length > 0 ? w.cves.join(", ") : "PENDING ID"}</span>
        <span className="text-graphite">EYES ON</span>
      </figcaption>
      <div className="bg-void">
        <AdvisoryRow label="CVE">
          {w.cves.length > 0 ? w.cves.join(", ") : "-"}
        </AdvisoryRow>
        <AdvisoryRow label="CVSS">
          {typeof w.cvss === "number" ? (
            <div className="flex flex-col gap-1">
              <span
                className={`tabular ${w.cvss >= 9.0 ? "text-arterial" : "text-newsprint"}`}
              >
                {cvssMeter(w.cvss)}
              </span>
              {w.cvssVector ? (
                <span className="font-mono text-[11px] text-graphite">
                  {w.cvssVector}
                </span>
              ) : null}
            </div>
          ) : (
            "-"
          )}
        </AdvisoryRow>
        <AdvisoryRow label="VENDOR">{w.vendor ?? "-"}</AdvisoryRow>
        <AdvisoryRow label="AFFECTED">{w.affected ?? "-"}</AdvisoryRow>
        <AdvisoryRow label="PATCH TIME">
          {typeof w.patchDays === "number" ? `${w.patchDays} DAYS` : "-"}
        </AdvisoryRow>
      </div>
    </figure>
  )
}

function Timeline({ steps }: { steps: { label: string; date: string }[] }) {
  return (
    <div className="my-10 flex flex-col md:flex-row md:items-stretch">
      {steps.map((t, i) => {
        const last = i === steps.length - 1
        return (
          <div key={`${t.label}-${i}`} className="flex flex-col md:flex-1 md:flex-row md:items-center">
            <div className="flex flex-col border border-rule bg-void px-4 py-3 md:flex-1">
              <span className="meta">{t.label}</span>
              <span className="mt-1 font-mono text-[15px] tabular text-newsprint">
                {t.date}
              </span>
            </div>
            {!last ? (
              <span
                aria-hidden="true"
                className="select-none px-2 py-1 text-center font-mono text-[16px] text-arterial md:px-3 md:py-0"
              >
                <span className="md:hidden">▼</span>
                <span className="hidden md:inline">──▶</span>
              </span>
            ) : null}
          </div>
        )
      })}
    </div>
  )
}

function Embargoed({ w }: { w: Writeup }) {
  const no = String(w.number).padStart(3, "0")
  return (
    <main id="top" className="container-press py-20 md:py-28">
      <div className="ascii-divider" aria-hidden="true">
        {".:[ ============================ EMBARGO ============================ ]:."}
      </div>

      <div className="relative mt-10 max-w-[720px]">
        <p className="meta">WRITEUP {no} · EMBARGOED</p>

        <div className="mt-6 flex flex-col gap-4">
          <Redacted length={26} label="Embargoed disclosure" className="text-[clamp(1.75rem,5vw,3.25rem)]" />
          <Redacted length={16} label="Embargoed disclosure" className="text-[clamp(1.75rem,5vw,3.25rem)]" />
        </div>

        <div className="mt-8">
          <Stamp animateIn angle={-6}>
            UNDER EMBARGO
          </Stamp>
        </div>

        <div className="mt-10">
          <Countdown until={w.embargoUntil ?? ""} className="font-mono text-[24px] text-arterial" />
        </div>

        <p className="mt-6 font-mono text-[15px] leading-[1.7] text-newsprint">
          THIS STORY RETURNS {w.embargoUntil}. THE VENDOR KNOWS WHY.
        </p>

        <a
          href="/"
          className="press-invert mt-12 inline-block border border-rule px-4 py-3 font-mono text-[14px] uppercase tracking-[0.14em] text-newsprint"
        >
          ← ALL WRITEUPS
        </a>
      </div>
    </main>
  )
}

function NavCell({
  w,
  dir,
}: {
  w: WriteupMeta
  dir: "prev" | "next"
}) {
  const no = String(w.number).padStart(3, "0")
  return (
    <a
      href={`/writeups/${w.slug}`}
      className={`press-invert flex flex-col gap-1 border border-rule p-4 ${
        dir === "next" ? "md:items-end md:text-right" : ""
      }`}
    >
      <span className="meta">
        {dir === "prev" ? `← WRITEUP ${no}` : `WRITEUP ${no} →`}
      </span>
      <span className="font-mono text-[14px] text-newsprint">{w.title}</span>
    </a>
  )
}

export default async function WriteupPage({
  params,
}: {
  params: Promise<Params>
}) {
  const { slug } = await params
  const w = getWriteup(slug)
  if (!w) notFound()

  if (w.status === "EMBARGOED") {
    return <Embargoed w={w} />
  }

  const no = String(w.number).padStart(3, "0")

  const disclosed = getAllWriteups()
    .filter((x) => x.status === "DISCLOSED")
    .sort((a, b) => a.number - b.number)
  const idx = disclosed.findIndex((x) => x.slug === w.slug)
  const prev = idx > 0 ? disclosed[idx - 1] : null
  const next = idx >= 0 && idx < disclosed.length - 1 ? disclosed[idx + 1] : null

  return (
    <main id="top" className="container-press py-16 md:py-24">
      <a href="/writeups" className="press-invert inline-block meta">
        ← ALL WRITEUPS
      </a>

      <article className="article-grid mt-8">
        <header className="relative mb-8">
          <span
            aria-hidden="true"
            className="ghost-numeral absolute -top-6 right-0 text-[clamp(6rem,16vw,12rem)]"
          >
            {no}
          </span>
          <p className="meta">
            WRITEUP {no} · {w.type.toUpperCase()} · {w.date}
          </p>
          <h1 className="mt-3 max-w-[16ch] font-display uppercase tracking-[-0.01em] leading-[0.92] text-[clamp(2.25rem,6vw,4.5rem)] text-newsprint">
            {w.title}
          </h1>
        </header>

        {w.type === "cve" ? <Advisory w={w} /> : null}

        {w.timeline && w.timeline.length > 0 ? <Timeline steps={w.timeline} /> : null}

        <div
          className="prose-press"
          dangerouslySetInnerHTML={{ __html: w.html }}
        />
        <ListingCopy />
        <WriteupDemos />
      </article>

      <nav
        aria-label="Adjacent disclosures"
        className="mt-16 grid gap-px bg-rule md:grid-cols-2"
      >
        {prev ? <NavCell w={prev} dir="prev" /> : <span className="bg-tar" />}
        {next ? <NavCell w={next} dir="next" /> : <span className="bg-tar" />}
      </nav>

      <div className="ascii-divider mt-16 text-center" aria-hidden="true">
        {".:[ EOF - DISTRIBUTION: PUBLIC - DISCLOSED RESPONSIBLY ]:."}
      </div>
    </main>
  )
}
