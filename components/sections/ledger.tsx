import { SectionFrame } from "@/components/section-frame"
import { Redacted } from "@/components/fx/redacted"
import { Countdown } from "@/components/fx/countdown"
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from "@/components/ui/table"
import type { WriteupMeta } from "@/lib/writeups"

function cvssMeter(cvss: number): string {
  const blocks = Math.max(0, Math.min(10, Math.round(cvss)))
  return `[${"█".repeat(blocks)}${"▒".repeat(10 - blocks)}] ${cvss.toFixed(1)}`
}

const HEAD = "meta h-auto whitespace-nowrap px-3 py-2"
const CELL = "px-3 py-2.5 align-middle font-mono text-[13px]"

function LedgerRow({ w }: { w: WriteupMeta }) {
  const no = String(w.number).padStart(3, "0")
  const embargoed = w.status === "EMBARGOED"

  return (
    <TableRow className="group border-rule transition-none hover:bg-secondary">
      <TableCell className={`${CELL} tabular text-graphite group-hover:text-newsprint`}>{no}</TableCell>

      <TableCell className={CELL}>
        {embargoed ? (
          <span className="whitespace-nowrap">
            CVE-2026-<Redacted length={5} label="Embargoed identifier" />
          </span>
        ) : w.cves.length > 0 ? (
          w.cves.join(", ")
        ) : (
          "-"
        )}
      </TableCell>

      <TableCell className={CELL}>
        {embargoed ? <Redacted length={10} /> : w.vendor ?? "-"}
      </TableCell>

      <TableCell className={`${CELL} uppercase`}>
        {embargoed ? <Redacted length={6} /> : w.severity ?? "-"}
      </TableCell>

      <TableCell className={`${CELL} tabular whitespace-nowrap`}>
        {embargoed ? (
          <Redacted length={8} />
        ) : typeof w.cvss === "number" ? (
          <span className={w.cvss >= 9.0 ? "text-arterial" : "text-newsprint"}>
            {cvssMeter(w.cvss)}
          </span>
        ) : (
          "-"
        )}
      </TableCell>

      <TableCell className={`${CELL} whitespace-nowrap`}>
        <span className={embargoed ? "text-arterial" : "text-newsprint"}>
          {w.status}
        </span>
      </TableCell>

      <TableCell className={`${CELL} tabular whitespace-nowrap`}>
        {embargoed ? (
          <Countdown until={w.embargoUntil ?? ""} className="text-arterial" />
        ) : typeof w.patchDays === "number" ? (
          `${w.patchDays} DAYS`
        ) : (
          "-"
        )}
      </TableCell>
    </TableRow>
  )
}

export function DisclosureLedger({ writeups }: { writeups: WriteupMeta[] }) {
  const rows = writeups
    .filter((w) => w.type === "cve")
    .sort((a, b) => a.number - b.number)

  return (
    <SectionFrame
      id="ledger"
      index={2}
      numeral="0x02"
      title="DISCLOSURE LEDGER"
      tagline="EVERY BUG ON THE RECORD"
    >
      <div className="mt-10 overflow-x-auto">
        <Table className="min-w-[760px] font-mono text-[13px]">
          <TableHeader>
            <TableRow className="border-rule transition-none hover:bg-transparent">
              <TableHead className={HEAD}>NO</TableHead>
              <TableHead className={HEAD}>ID</TableHead>
              <TableHead className={HEAD}>VENDOR</TableHead>
              <TableHead className={HEAD}>CLASS</TableHead>
              <TableHead className={HEAD}>CVSS</TableHead>
              <TableHead className={HEAD}>STATUS</TableHead>
              <TableHead className={HEAD}>DAYS-TO-PATCH</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((w) => (
              <LedgerRow key={w.slug} w={w} />
            ))}
          </TableBody>
        </Table>
      </div>

      <p className="mt-5 font-mono text-[12px] uppercase tracking-[0.14em] text-graphite">
        RESPONSIBLE DISCLOSURE PRACTICED. EMBARGOES HONORED. RECEIPTS KEPT.
      </p>
    </SectionFrame>
  )
}
