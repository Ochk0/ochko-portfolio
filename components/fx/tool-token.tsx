"use client"

import Link from "next/link"

import { Stamp } from "@/components/fx/stamp"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

type Ref = { number: number; title: string; slug: string }

const pad = (n: number) => String(n).padStart(3, "0")

/**
 * ToolToken - a colophon skill token that has cited writeups. The trigger is a mono
 * button with an arterial underline; activating it stamps "USED IN 00X, 00Y" and lists
 * links to the writeups that lean on this tool.
 */
export function ToolToken(props: { name: string; refs: Ref[] }) {
  const { name, refs } = props

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="font-mono text-[14px] text-newsprint underline decoration-arterial decoration-2 underline-offset-4"
        >
          {name}
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        sideOffset={6}
        className="w-64 border border-rule bg-tar p-0 text-newsprint shadow-none"
      >
        <div className="px-4 pb-2 pt-4">
          <Stamp angle={6}>USED IN {refs.map((r) => pad(r.number)).join(", ")}</Stamp>
        </div>
        <ul className="border-t border-rule">
          {refs.map((r) => (
            <li key={r.slug} className="border-b border-rule last:border-b-0">
              <Link
                href={`/writeups/${r.slug}`}
                className="press-invert flex items-baseline gap-2 px-4 py-2 font-mono text-[13px] text-newsprint"
              >
                <span className="text-arterial">{pad(r.number)}</span>
                <span className="truncate">{r.title}</span>
              </Link>
            </li>
          ))}
        </ul>
      </PopoverContent>
    </Popover>
  )
}
