import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { anton, plexMono } from "./fonts"
import { getAllWriteups, counts } from "@/lib/writeups"
import { PressProvider } from "@/components/press/press-provider"
import { PressBoot } from "@/components/press/press-boot"
import { PressGrain } from "@/components/press/press-grain"
import { Masthead } from "@/components/masthead"
import { BackCover } from "@/components/sections/back-cover"

export const metadata: Metadata = {
  metadataBase: new URL("https://ochko-portfolio.vercel.app"),
  title: {
    default: "ochk0 · Security Researcher & Full-Stack Engineer",
    template: "%s · ochk0",
  },
  description:
    "Erdene-Och Byambabayar (ochk0): security researcher and full-stack engineer. Published CVEs, international CTF finals, and vulnerability writeups.",
}

// Prevent paper-theme flash of the wrong edition.
const themeScript = `(function(){try{var t=localStorage.getItem("smz.theme");if(t==="paper"){document.documentElement.dataset.theme="paper";}}catch(e){}})();`

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const metas = getAllWriteups()
  const c = counts()
  const commit = process.env.NEXT_PUBLIC_COMMIT ?? "deadbee"
  const buildDate = process.env.NEXT_PUBLIC_BUILD_DATE ?? "2026-07-08"

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className={`${anton.variable} ${plexMono.variable} font-mono bg-tar text-newsprint antialiased`}>
        <a href="#top" className="skip-link">
          SKIP TO THE ISSUE
        </a>
        <PressProvider writeups={metas}>
          <PressBoot />
          <Masthead
            commit={commit}
            buildDate={buildDate}
            publicCount={c.public}
            embargoedCount={c.embargoed}
          />
          {children}
          <BackCover />
          <PressGrain />
        </PressProvider>
      </body>
    </html>
  )
}
