import type { Metadata } from "next"

import { getAllWriteups } from "@/lib/writeups"
import { ArchiveList } from "@/components/archive-list"

export const metadata: Metadata = {
  title: "THE ARCHIVE",
  description:
    "Every writeup, disclosure, and note in SAMIZDAT - including what is still under embargo.",
}

export default function ArchivePage() {
  const metas = getAllWriteups()

  return (
    <main id="top" className="container-press py-20 md:py-28">
      <div className="ascii-divider" aria-hidden="true">
        {".:[ ============================ THE ARCHIVE ============================ ]:."}
      </div>

      <header className="relative mb-12 mt-6">
        <a href="/" className="press-invert inline-block meta">
          ← FRONT PAGE
        </a>
        <h1 className="mt-6 font-display uppercase tracking-[-0.01em] leading-[0.9] text-[clamp(2.75rem,8vw,6rem)] text-newsprint">
          THE ARCHIVE
        </h1>
        <p className="meta mt-4">
          EVERY ENTRY, EVERY ISSUE - INCLUDING WHAT YOU CANNOT READ YET
        </p>
      </header>

      <ArchiveList metas={metas} />
    </main>
  )
}
