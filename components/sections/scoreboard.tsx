import { SectionFrame } from "@/components/section-frame"
import { Stamp } from "@/components/fx/stamp"
import { FlagSlot } from "@/components/fx/flag-slot"
import { site } from "@/lib/site"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export function Scoreboard() {
  return (
    <SectionFrame
      id="scoreboard"
      index={6}
      numeral="0x06"
      title="SCOREBOARD"
      tagline="CAPTURE THE FLAG · FIELD RECORD"
    >
      <div className="mt-12 overflow-x-auto">
        <Table className="tabular min-w-[640px] font-mono text-[13px]">
          <TableHeader>
            <TableRow className="border-rule transition-none hover:bg-transparent">
              <TableHead className="meta h-auto px-3 py-2">DATE</TableHead>
              <TableHead className="meta h-auto px-3 py-2">EVENT</TableHead>
              <TableHead className="meta h-auto px-3 py-2">CATEGORY</TableHead>
              <TableHead className="meta h-auto px-3 py-2">WHERE</TableHead>
              <TableHead className="meta h-auto px-3 py-2">PLACE</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {site.ctf.map((row, i) => (
              <TableRow
                key={`${row.event}-${i}`}
                className="group border-rule transition-none hover:bg-secondary"
              >
                <TableCell className="px-3 py-2 text-graphite group-hover:text-newsprint">{row.date}</TableCell>
                <TableCell className="px-3 py-2 text-newsprint">{row.event}</TableCell>
                <TableCell className="px-3 py-2 text-newsprint">{row.category}</TableCell>
                <TableCell className="px-3 py-2 text-newsprint">{row.where}</TableCell>
                <TableCell className="whitespace-nowrap px-3 py-2">
                  <span className={row.notable ? "text-arterial" : "text-newsprint"}>
                    {row.place}
                  </span>
                  {row.notable && (
                    <Stamp angle={-4} className="ml-3 text-[10px]">
                      NOTABLE
                    </Stamp>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="mt-10">
        <FlagSlot />
      </div>
    </SectionFrame>
  )
}
