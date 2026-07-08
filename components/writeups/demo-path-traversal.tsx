"use client"

import { useMemo, useState } from "react"
import { DemoFrame, DemoToggle } from "./demo-frame"

const ROOT = "/home/app/project"
const PREFIX = "/node_modules/.vite/deps/"

// resolve ../ and ./ segments like the filesystem would
function resolve(base: string, reqPath: string): string {
  const combined = base + "/" + reqPath
  const stack: string[] = []
  for (const seg of combined.split("/")) {
    if (seg === "" || seg === ".") continue
    if (seg === "..") stack.pop()
    else stack.push(seg)
  }
  return "/" + stack.join("/")
}

export function DemoPathTraversal() {
  const [mode, setMode] = useState<"vuln" | "patched">("vuln")
  const [reqPath, setReqPath] = useState(
    "/node_modules/.vite/deps/../../../../../../tmp/poc.map",
  )

  const result = useMemo(() => {
    const resolved = resolve(ROOT, reqPath)
    const isMap = resolved.endsWith(".map")
    const insideRoot = resolved === ROOT || resolved.startsWith(ROOT + "/")
    const escapes = !insideRoot

    let served = false
    let reason = ""
    if (!isMap) {
      served = false
      reason = "handler only serves .map files → 404"
    } else if (mode === "vuln") {
      // vulnerable: no ../ stripping, no allowlist consulted
      served = true
      reason = escapes
        ? "no normalization, no fs.strict check → readFile() outside the project root"
        : "served from inside the project (normal case)"
    } else {
      // patched: normalize + fs.strict allowlist
      served = insideRoot
      reason = insideRoot
        ? "resolved path is inside the allowlist → served"
        : "resolved path escapes the root → BLOCKED by server.fs.strict"
    }
    return { resolved, isMap, escapes, served, reason }
  }, [mode, reqPath])

  return (
    <DemoFrame
      title="vite dev-server · .map path resolution"
      hint="The optimized-deps handler joins your request onto the deps dir and reads it. In VULNERABLE mode there's no ../ stripping and no allowlist. Add ../ until the resolved path escapes the project root."
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
            {mode === "vuln" ? "≤ 6.4.1 - raw join + readFile" : "≥ 6.4.2 - normalize + fs.strict"}
          </span>
        </div>

        <div className="text-[11px] uppercase tracking-[0.14em] text-graphite">
          project root (allowlist): <span className="text-newsprint">{ROOT}</span>
        </div>

        <label className="block">
          <span className="text-[11px] uppercase tracking-[0.14em] text-graphite">GET request path</span>
          <input
            value={reqPath}
            onChange={(e) => setReqPath(e.target.value)}
            spellCheck={false}
            autoCapitalize="off"
            autoCorrect="off"
            aria-label="request path"
            className="mt-1 block w-full border border-rule bg-tar px-2 py-1 text-arterial outline-none focus:border-arterial"
          />
        </label>

        <div className="flex flex-wrap gap-2">
          {["poc.map", "../secret.map", "../../../../../../tmp/poc.map"].map((tail) => (
            <button
              key={tail}
              type="button"
              onClick={() => setReqPath(PREFIX + tail)}
              className="border border-rule px-2 py-1 text-[11px] uppercase tracking-[0.1em] text-graphite hover:border-arterial hover:text-newsprint"
            >
              {tail}
            </button>
          ))}
        </div>

        <div>
          <div className="text-[11px] uppercase tracking-[0.14em] text-graphite">resolves to</div>
          <pre className="mt-1 overflow-x-auto whitespace-pre-wrap break-all border border-rule bg-tar px-2 py-1.5">
            <span className={result.escapes ? "text-arterial" : "text-newsprint"}>{result.resolved}</span>
            {result.escapes ? (
              <span className="text-arterial"> ← outside project root</span>
            ) : null}
          </pre>
        </div>

        <div
          className={`border px-3 py-2 text-[12px] ${
            result.served && result.escapes
              ? "border-arterial text-arterial"
              : "border-rule text-graphite"
          }`}
        >
          {result.served ? "SERVED - " : "BLOCKED - "}
          {result.reason}
          {result.served && result.escapes
            ? " · any .map-suffixed secret on the box is now readable over the network."
            : ""}
        </div>
      </div>
    </DemoFrame>
  )
}
