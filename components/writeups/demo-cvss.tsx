"use client"

import { useMemo, useState } from "react"
import { DemoFrame } from "./demo-frame"

type Metric = { key: string; label: string; options: { v: string; label: string }[] }

const METRICS: Metric[] = [
  { key: "AV", label: "Attack Vector", options: [
    { v: "N", label: "Network" }, { v: "A", label: "Adjacent" }, { v: "L", label: "Local" }, { v: "P", label: "Physical" }] },
  { key: "AC", label: "Attack Complexity", options: [{ v: "L", label: "Low" }, { v: "H", label: "High" }] },
  { key: "PR", label: "Privileges Req.", options: [{ v: "N", label: "None" }, { v: "L", label: "Low" }, { v: "H", label: "High" }] },
  { key: "UI", label: "User Interaction", options: [{ v: "N", label: "None" }, { v: "R", label: "Required" }] },
  { key: "S", label: "Scope", options: [{ v: "U", label: "Unchanged" }, { v: "C", label: "Changed" }] },
  { key: "C", label: "Confidentiality", options: [{ v: "N", label: "None" }, { v: "L", label: "Low" }, { v: "H", label: "High" }] },
  { key: "I", label: "Integrity", options: [{ v: "N", label: "None" }, { v: "L", label: "Low" }, { v: "H", label: "High" }] },
  { key: "A", label: "Availability", options: [{ v: "N", label: "None" }, { v: "L", label: "Low" }, { v: "H", label: "High" }] },
]

type Vec = Record<string, string>

// CVSS v3.1 base score (official formula)
function score(v: Vec): number {
  const cia = (x: string) => (x === "H" ? 0.56 : x === "L" ? 0.22 : 0)
  const iss = 1 - (1 - cia(v.C)) * (1 - cia(v.I)) * (1 - cia(v.A))
  const impact = v.S === "C" ? 7.52 * (iss - 0.029) - 3.25 * Math.pow(iss - 0.02, 15) : 6.42 * iss
  const av = { N: 0.85, A: 0.62, L: 0.55, P: 0.2 }[v.AV] ?? 0.85
  const ac = v.AC === "H" ? 0.44 : 0.77
  const prU = { N: 0.85, L: 0.62, H: 0.27 }
  const prC = { N: 0.85, L: 0.68, H: 0.5 }
  const pr = (v.S === "C" ? prC : prU)[v.PR as "N" | "L" | "H"] ?? 0.85
  const ui = v.UI === "R" ? 0.62 : 0.85
  const expl = 8.22 * av * ac * pr * ui
  if (impact <= 0) return 0
  const raw = v.S === "C" ? 1.08 * (impact + expl) : impact + expl
  return Math.ceil(Math.min(raw, 10) * 10) / 10
}

function band(s: number): string {
  if (s === 0) return "NONE"
  if (s < 4) return "LOW"
  if (s < 7) return "MEDIUM"
  if (s < 9) return "HIGH"
  return "CRITICAL"
}

const CISA: Vec = { AV: "L", AC: "L", PR: "L", UI: "N", S: "U", C: "H", I: "H", A: "H" }
const CHROMIUM: Vec = { AV: "L", AC: "H", PR: "H", UI: "N", S: "U", C: "L", I: "L", A: "N" }

export function DemoCvss() {
  const [vec, setVec] = useState<Vec>(CISA)
  const s = useMemo(() => score(vec), [vec])
  const b = band(s)
  const vecString = "CVSS:3.1/" + METRICS.map((m) => `${m.key}:${vec[m.key]}`).join("/")

  return (
    <DemoFrame
      title="cvss 3.1 · the same bug, two scores"
      hint="Google rated this Low (a qualitative call); CISA's ADP scored it 7.8 / High. Both read the same bug - they weigh the metrics differently. Load each preset, then move the metrics yourself."
    >
      <div className="space-y-4 font-mono text-[13px] text-newsprint">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setVec(CHROMIUM)}
            className="border border-rule px-3 py-1.5 text-[11px] uppercase tracking-[0.12em] text-graphite hover:border-arterial hover:text-newsprint"
          >
            load: chromium (low)
          </button>
          <button
            type="button"
            onClick={() => setVec(CISA)}
            className="border border-rule px-3 py-1.5 text-[11px] uppercase tracking-[0.12em] text-graphite hover:border-arterial hover:text-newsprint"
          >
            load: cisa adp (7.8)
          </button>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {METRICS.map((m) => (
            <div key={m.key}>
              <div className="text-[11px] uppercase tracking-[0.12em] text-graphite">
                {m.key} · {m.label}
              </div>
              <div className="mt-1 flex flex-wrap gap-1">
                {m.options.map((o) => {
                  const active = vec[m.key] === o.v
                  return (
                    <button
                      key={o.v}
                      type="button"
                      onClick={() => setVec({ ...vec, [m.key]: o.v })}
                      aria-pressed={active}
                      className={`border px-2 py-1 text-[11px] uppercase tracking-[0.08em] transition-none ${
                        active
                          ? "border-arterial bg-arterial text-void"
                          : "border-rule text-graphite hover:text-newsprint"
                      }`}
                    >
                      {o.v}
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-end justify-between border-t border-rule pt-3">
          <div>
            <div className="text-[11px] uppercase tracking-[0.14em] text-graphite">base score</div>
            <div className="font-display text-[clamp(2.5rem,8vw,4rem)] leading-none text-arterial">
              {s.toFixed(1)}
            </div>
          </div>
          <div className="text-right">
            <div className="font-mono text-[16px] uppercase tracking-[0.1em] text-newsprint">{b}</div>
            <div className="mt-1 max-w-[16rem] break-all text-[10px] leading-[1.4] text-graphite">{vecString}</div>
          </div>
        </div>
      </div>
    </DemoFrame>
  )
}
