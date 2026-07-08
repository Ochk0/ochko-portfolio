// Per-writeup social card - a collectible zine cover. Disclosed cards show the
// title + advisory line; embargoed cards show black bars + an UNDER EMBARGO box
// and leak nothing. nodejs runtime for fs font reads (wrapped in try/catch).
import { ImageResponse } from "next/og"
import fs from "node:fs"
import path from "node:path"

import { getAllWriteups, getWriteup } from "@/lib/writeups"

export const runtime = "nodejs"
export const alt = "ochk0 - vulnerability writeup"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

type Params = { slug: string }

export function generateStaticParams(): Params[] {
  return getAllWriteups().map((w) => ({ slug: w.slug }))
}

const TAR = "#0B0B0B"
const NEWSPRINT = "#E8E6E0"
const ARTERIAL = "#FF3300"
const GRAPHITE = "#807D73"
const RULE = "#232323"
const VOID = "#000000"

type Font = {
  name: string
  data: Buffer
  weight: 400
  style: "normal"
}

function loadFonts(): Font[] {
  const fonts: Font[] = []
  try {
    fonts.push({
      name: "Anton",
      data: fs.readFileSync(path.join(process.cwd(), "assets/og/Anton-Regular.ttf")),
      weight: 400,
      style: "normal",
    })
  } catch {
    /* font unavailable - fall back to the default face */
  }
  try {
    fonts.push({
      name: "IBM Plex Mono",
      data: fs.readFileSync(path.join(process.cwd(), "assets/og/IBMPlexMono-Regular.ttf")),
      weight: 400,
      style: "normal",
    })
  } catch {
    /* font unavailable - fall back to the default face */
  }
  return fonts
}

const BAR_WIDTHS = [4, 2, 6, 3, 2, 5, 3, 7, 2, 4, 3, 2, 6, 3]

function Barcode() {
  return (
    <div style={{ display: "flex", alignItems: "flex-end", height: 48 }}>
      {BAR_WIDTHS.map((w, i) => (
        <div
          key={i}
          style={{ width: w, height: 48, background: NEWSPRINT, marginRight: 3 }}
        />
      ))}
    </div>
  )
}

export default async function Image({ params }: { params: Promise<Params> }) {
  const { slug } = await params
  const w = getWriteup(slug)
  const fonts = loadFonts()

  const number = w ? String(w.number).padStart(3, "0") : "000"
  const embargoed = w?.status === "EMBARGOED"

  const accent: string[] = []
  const trailing: string[] = []
  if (w && !embargoed) {
    accent.push(w.cves.length > 0 ? w.cves.join(" · ") : w.type.toUpperCase())
    if (typeof w.cvss === "number") trailing.push(`CVSS ${w.cvss.toFixed(1)}`)
    if (w.severity) trailing.push(w.severity)
    if (w.date) trailing.push(w.date)
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: TAR,
          fontFamily: "IBM Plex Mono",
        }}
      >
        <div style={{ width: "100%", height: 8, background: ARTERIAL }} />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            padding: "48px 72px",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", fontSize: 24, letterSpacing: 3, color: GRAPHITE }}>
            {"OCHK0 · SECURITY RESEARCH"}
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              flex: 1,
              justifyContent: "center",
            }}
          >
            {embargoed ? (
              <div style={{ display: "flex", flexDirection: "column" }}>
                <div style={{ width: 720, height: 54, background: VOID, border: `2px solid ${RULE}`, marginBottom: 16 }} />
                <div style={{ width: 560, height: 54, background: VOID, border: `2px solid ${RULE}`, marginBottom: 16 }} />
                <div style={{ width: 640, height: 54, background: VOID, border: `2px solid ${RULE}` }} />
                <div style={{ display: "flex", marginTop: 28 }}>
                  <div
                    style={{
                      display: "flex",
                      fontFamily: "Anton",
                      fontSize: 44,
                      letterSpacing: 3,
                      color: ARTERIAL,
                      border: `3px solid ${ARTERIAL}`,
                      padding: "8px 22px",
                    }}
                  >
                    UNDER EMBARGO
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column" }}>
                <div
                  style={{
                    display: "flex",
                    fontFamily: "Anton",
                    fontSize: 84,
                    lineHeight: 1.02,
                    color: NEWSPRINT,
                    maxHeight: 300,
                    overflow: "hidden",
                  }}
                >
                  {w ? w.title.toUpperCase() : "OCHK0"}
                </div>

                {accent.length > 0 || trailing.length > 0 ? (
                  <div style={{ display: "flex", fontSize: 26, marginTop: 28 }}>
                    <span style={{ color: ARTERIAL }}>{accent.join(" · ")}</span>
                    {trailing.length > 0 ? (
                      <span style={{ color: GRAPHITE }}>{` · ${trailing.join(" · ")}`}</span>
                    ) : null}
                  </div>
                ) : null}
              </div>
            )}
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
            }}
          >
            <div style={{ display: "flex", fontSize: 20, letterSpacing: 2, color: GRAPHITE }}>
              ochko-portfolio.vercel.app
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
              <Barcode />
              <div style={{ display: "flex", fontSize: 18, letterSpacing: 2, color: GRAPHITE, marginTop: 6 }}>
                0-DAY-{number}
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size, fonts: fonts.length > 0 ? fonts : undefined },
  )
}
