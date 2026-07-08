// Client util: mint a personalized PRESS CREDENTIAL PNG. Every solver's screenshot is unique.
// Returns a data URL. Canvas is @2x (1600x1000) of an 800x500 card.

export async function mintCredentialPNG(i: {
  handle: string
  issue: string
  solvedAt: Date
  session: string
}): Promise<string> {
  const W = 1600
  const H = 1000
  const S = 2 // scale factor
  const canvas = document.createElement("canvas")
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext("2d")!

  // resolve fonts from CSS vars (fall back to generic families)
  const root = getComputedStyle(document.documentElement)
  const displayFont = (root.getPropertyValue("--font-display").trim() || "sans-serif").replace(/["']/g, "")
  const monoFont = (root.getPropertyValue("--font-mono").trim() || "monospace").replace(/["']/g, "")
  try {
    await (document as any).fonts?.ready
  } catch {
    /* ignore */
  }

  const TAR = "#0B0B0B"
  const NEWSPRINT = "#E8E6E0"
  const ARTERIAL = "#FF3300"
  const GRAPHITE = "#807D73"

  // field
  ctx.fillStyle = TAR
  ctx.fillRect(0, 0, W, H)

  // arterial frame, inset 32*S
  const inset = 32 * S
  ctx.strokeStyle = ARTERIAL
  ctx.lineWidth = 2 * S
  ctx.strokeRect(inset, inset, W - inset * 2, H - inset * 2)

  // top band
  const bandH = 112 * S
  ctx.fillStyle = ARTERIAL
  ctx.fillRect(inset, inset, W - inset * 2, bandH)
  ctx.fillStyle = "#000000"
  ctx.font = `${44 * S}px ${displayFont}`
  ctx.textBaseline = "middle"
  ctx.fillText("SAMIZDAT PRESS CREDENTIAL", inset + 28 * S, inset + bandH / 2)

  // handle
  ctx.fillStyle = NEWSPRINT
  ctx.font = `${120 * S}px ${displayFont}`
  ctx.textBaseline = "alphabetic"
  const handle = i.handle.toUpperCase().slice(0, 18)
  ctx.fillText(handle, inset + 28 * S, inset + bandH + 130 * S)

  // mono rows
  ctx.font = `${22 * S}px ${monoFont}`
  ctx.fillStyle = NEWSPRINT
  const rows = [
    "CLEARANCE: SOURCE - VERIFIED",
    `ISSUE #${i.issue} - FLAG RECOVERED`,
    `SESSION ${i.session} · ${i.solvedAt.toISOString().slice(0, 19).replace("T", " ")}Z`,
  ]
  let ry = inset + bandH + 210 * S
  for (const r of rows) {
    ctx.fillText(r, inset + 28 * S, ry)
    ry += 40 * S
  }

  // deterministic barcode bottom-right (no Math.random - derive widths from handle chars)
  const seed = handle.split("").reduce((a, c) => a + c.charCodeAt(0), 7)
  const bcW = 300 * S
  const bcH = 60 * S
  const bcX = W - inset - bcW - 12 * S
  const bcY = H - inset - bcH - 60 * S
  ctx.fillStyle = NEWSPRINT
  let x = bcX
  let k = seed
  while (x < bcX + bcW) {
    k = (k * 1103515245 + 12345) & 0x7fffffff
    const w = 2 * S + (k % (5 * S))
    if ((k >> 3) % 2 === 0) ctx.fillRect(x, bcY, w, bcH)
    x += w + 2 * S
  }
  ctx.font = `${16 * S}px ${monoFont}`
  ctx.fillStyle = GRAPHITE
  ctx.fillText("0-DAY-PRESS-CRED-001", bcX, bcY + bcH + 26 * S)

  return canvas.toDataURL("image/png")
}
