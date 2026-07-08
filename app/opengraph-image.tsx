// Site default social card - the zine cover. Renders on nodejs runtime so it can
// read the committed OFL fonts; font loading is wrapped in try/catch so a missing
// asset degrades to the default font instead of breaking the build.
import { ImageResponse } from "next/og"
import fs from "node:fs"
import path from "node:path"

export const runtime = "nodejs"
export const alt = "SAMIZDAT - Issue #01 - OCHK0 Press"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

const TAR = "#0B0B0B"
const NEWSPRINT = "#E8E6E0"
const ARTERIAL = "#FF3300"
const GRAPHITE = "#807D73"

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
    <div style={{ display: "flex", alignItems: "flex-end", height: 56 }}>
      {BAR_WIDTHS.map((w, i) => (
        <div
          key={i}
          style={{ width: w, height: 56, background: NEWSPRINT, marginRight: 3 }}
        />
      ))}
    </div>
  )
}

export default function Image() {
  const fonts = loadFonts()

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
            padding: "56px 72px",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 24,
              letterSpacing: 4,
              color: GRAPHITE,
            }}
          >
            {"SAMIZDAT · ISSUE #01 · JUL 2026 · SELF-PUBLISHED"}
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                display: "flex",
                fontFamily: "Anton",
                fontSize: 208,
                lineHeight: 0.9,
                color: NEWSPRINT,
              }}
            >
              OCHK0
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 28,
                letterSpacing: 6,
                color: NEWSPRINT,
                marginTop: 12,
              }}
            >
              {"SECURITY RESEARCH & FULL-STACK ENGINEERING"}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
            }}
          >
            <div style={{ display: "flex", fontSize: 20, letterSpacing: 3, color: GRAPHITE }}>
              {"NO GODS · NO MASTERS · NO CLOSED SOURCE"}
            </div>
            <div
              style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}
            >
              <Barcode />
              <div
                style={{ display: "flex", fontSize: 18, letterSpacing: 2, color: GRAPHITE, marginTop: 6 }}
              >
                0-DAY-PRESS-001
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size, fonts: fonts.length > 0 ? fonts : undefined },
  )
}
