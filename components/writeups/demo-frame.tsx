import type { ReactNode } from "react"

/** Shared chrome for interactive writeup demos. Presentational only. */
export function DemoFrame({
  title,
  hint,
  children,
}: {
  title: string
  hint?: string
  children: ReactNode
}) {
  return (
    <div className="border border-rule bg-void">
      <div className="flex items-center justify-between gap-3 border-b border-rule px-4 py-2">
        <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-arterial">
          ▶ interactive
        </span>
        <span className="truncate font-mono text-[11px] uppercase tracking-[0.18em] text-graphite">
          {title}
        </span>
      </div>
      {hint ? (
        <div className="border-b border-rule px-4 py-2 font-mono text-[12px] leading-[1.5] text-graphite">
          {hint}
        </div>
      ) : null}
      <div className="p-4">{children}</div>
    </div>
  )
}

/** A two-state toggle (e.g. VULNERABLE / PATCHED). */
export function DemoToggle({
  options,
  value,
  onChange,
}: {
  options: { value: string; label: string }[]
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div className="inline-flex border border-rule">
      {options.map((o) => {
        const active = o.value === value
        return (
          <button
            key={o.value}
            type="button"
            onClick={() => onChange(o.value)}
            aria-pressed={active}
            className={`px-3 py-1.5 font-mono text-[12px] uppercase tracking-[0.12em] transition-none ${
              active ? "bg-arterial text-void" : "text-graphite hover:text-newsprint"
            }`}
          >
            {o.label}
          </button>
        )
      })}
    </div>
  )
}
