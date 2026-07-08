"use client"

import { useMemo, useState } from "react"
import { DemoFrame, DemoToggle } from "./demo-frame"

const SAMPLE = "Hello &lt;b&gt;World&lt;/b&gt;"

function escapeRe(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

// decode the five standard XML entities (what a correct parser does to text)
function decodeStd(s: string): string {
  return s
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, "&")
}

export function DemoRegexInjection() {
  const [mode, setMode] = useState<"vuln" | "patched">("vuln")
  const [name, setName] = useState("l.")
  const [payload, setPayload] = useState("<img src=x onerror=alert(1)>")

  const result = useMemo(() => {
    const src = "&" + (mode === "patched" ? escapeRe(name) : name) + ";"
    let re: RegExp | null = null
    let error = ""
    try {
      re = new RegExp(src, "g")
    } catch (e) {
      error = "invalid entity name → regex won't compile"
    }
    // step 1: the malicious custom-entity replacement pass
    const matches: string[] = []
    let afterCustom = SAMPLE
    if (re) {
      afterCustom = SAMPLE.replace(re, (m) => {
        matches.push(m)
        return payload
      })
    }
    // step 2: decode the remaining standard entities
    const final = decodeStd(afterCustom)
    // for reference: what the SAFE parse should have produced
    const intended = decodeStd(SAMPLE)
    const hijacked = final !== intended
    return { src, error, matches, afterCustom, final, intended, hijacked }
  }, [mode, name, payload])

  // render the sample with matched substrings highlighted arterial
  const highlighted = useMemo(() => {
    if (result.matches.length === 0) return [{ t: SAMPLE, hit: false }]
    const out: { t: string; hit: boolean }[] = []
    let rest = SAMPLE
    // rebuild by scanning for each literal match in order
    const re = mode === "patched" ? null : safeRe("&" + name + ";")
    if (!re) return [{ t: SAMPLE, hit: false }]
    let m: RegExpExecArray | null
    let last = 0
    re.lastIndex = 0
    while ((m = re.exec(SAMPLE))) {
      if (m.index > last) out.push({ t: SAMPLE.slice(last, m.index), hit: false })
      out.push({ t: m[0], hit: true })
      last = m.index + m[0].length
      if (m[0].length === 0) re.lastIndex++
    }
    if (last < SAMPLE.length) out.push({ t: SAMPLE.slice(last), hit: false })
    void rest
    return out
  }, [result.matches, mode, name])

  return (
    <DemoFrame
      title="fast-xml-parser · entity regex"
      hint="Name a DOCTYPE entity. The parser builds one RegExp per entity and runs it over the document. A '.' in the name is a wildcard - watch it swallow the built-in &lt; entity. Flip to PATCHED to see the escape fix."
    >
      <div className="space-y-4 font-mono text-[13px] text-newsprint">
        <div className="flex flex-wrap items-center gap-3">
          <DemoToggle
            options={[
              { value: "vuln", label: "vulnerable" },
              { value: "patched", label: "patched" },
            ]}
            value={mode}
            onChange={(v) => setMode(v as "vuln" | "patched")}
          />
          <span className="text-[11px] uppercase tracking-[0.14em] text-graphite">
            {mode === "vuln" ? "≤ 5.3.4 - name interpolated raw" : "≥ 5.3.5 - metachars escaped"}
          </span>
        </div>

        <label className="block">
          <span className="text-[11px] uppercase tracking-[0.14em] text-graphite">{"<!ENTITY "}</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            spellCheck={false}
            autoCapitalize="off"
            autoCorrect="off"
            aria-label="entity name"
            className="mx-2 w-40 border border-rule bg-tar px-2 py-1 text-arterial outline-none focus:border-arterial"
          />
          <span className="text-[11px] uppercase tracking-[0.14em] text-graphite">{'"..." >'}</span>
        </label>

        <label className="block">
          <span className="text-[11px] uppercase tracking-[0.14em] text-graphite">value / payload</span>
          <input
            value={payload}
            onChange={(e) => setPayload(e.target.value)}
            spellCheck={false}
            autoCapitalize="off"
            autoCorrect="off"
            aria-label="entity value"
            className="mt-1 block w-full border border-rule bg-tar px-2 py-1 text-newsprint outline-none focus:border-arterial"
          />
        </label>

        <div>
          <div className="text-[11px] uppercase tracking-[0.14em] text-graphite">generated regex</div>
          <pre className="mt-1 overflow-x-auto whitespace-pre-wrap break-all border border-rule bg-tar px-2 py-1.5">
            {result.error ? (
              <span className="text-arterial">{result.error}</span>
            ) : (
              <>
                /<span className="text-arterial">{result.src}</span>/g
              </>
            )}
          </pre>
        </div>

        <div>
          <div className="text-[11px] uppercase tracking-[0.14em] text-graphite">
            document text (encoded, should be inert)
          </div>
          <pre className="mt-1 overflow-x-auto whitespace-pre-wrap break-all border border-rule bg-tar px-2 py-1.5">
            {highlighted.map((seg, i) => (
              <span key={i} className={seg.hit ? "bg-arterial text-void" : ""}>
                {seg.t}
              </span>
            ))}
          </pre>
          <div className="mt-1 text-[11px] text-graphite">
            {result.matches.length > 0
              ? `regex matched: ${result.matches.join(", ")} - the built-in entity is now shadowed`
              : "regex matched nothing in the document - built-in entities intact"}
          </div>
        </div>

        <div>
          <div className="text-[11px] uppercase tracking-[0.14em] text-graphite">
            parsed output (this string gets inserted into a page)
          </div>
          <pre className="mt-1 overflow-x-auto whitespace-pre-wrap break-all border border-rule bg-tar px-2 py-1.5 text-newsprint">
            {result.final}
          </pre>
        </div>

        <div
          className={`border px-3 py-2 text-[12px] ${
            result.hijacked ? "border-arterial text-arterial" : "border-rule text-graphite"
          }`}
        >
          {result.hijacked
            ? "✕ ENCODING BYPASSED - the output contains live markup the document never wrote. Rendered in a browser, the onerror fires. Stored XSS."
            : "✓ SAFE - encoded markup stayed encoded; the output is inert text."}
        </div>
      </div>
    </DemoFrame>
  )
}

function safeRe(src: string): RegExp | null {
  try {
    return new RegExp(src, "g")
  } catch {
    return null
  }
}
