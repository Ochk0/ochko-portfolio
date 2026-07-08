// SERVER ONLY - uses fs, gray-matter, marked. Never import from a client component.
import fs from "fs"
import path from "path"
import matter from "gray-matter"
import { marked } from "marked"

const DIR = path.join(process.cwd(), "content", "writeups")

export type WriteupStatus = "DISCLOSED" | "EMBARGOED" | "DRAFT"
export type WriteupType = "cve" | "research" | "note"

export interface WriteupMeta {
  number: number
  slug: string
  title: string
  date: string
  type: WriteupType
  status: WriteupStatus
  summary: string
  cves: string[]
  cvss?: number
  cvssVector?: string
  severity?: string
  vendor?: string
  affected?: string
  patchDays?: number
  embargoUntil?: string
  timeline?: { label: string; date: string }[]
  words: number
}

export interface Writeup extends WriteupMeta {
  html: string
}

function slugify(s: string): string {
  return s
    .replace(/<[^>]+>/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^\w]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

// Version-independent: post-process marked's stable HTML output into the SAMIZDAT contract.
function renderContract(md: string): string {
  let html = marked.parse(md, { async: false }) as string

  // fenced code -> numbered listing figures, EXCEPT ```demo blocks which become
  // interactive mount-points hydrated client-side by <WriteupDemos/>.
  let n = 0
  html = html.replace(
    /<pre><code(?: class="language-([\w+-]+)")?>([\s\S]*?)<\/code><\/pre>/g,
    (_m, lang: string | undefined, code: string) => {
      if (lang === "demo") {
        // body is the demo id (first non-empty line); ignore any HTML entities
        const id = code
          .replace(/&[a-z]+;/g, "")
          .trim()
          .split(/\s+/)[0]
        return `<div class="demo-slot" data-demo="${id}"></div>`
      }
      n += 1
      const num = String(n).padStart(2, "0")
      const label = (lang || "txt").toUpperCase()
      return `<figure class="listing"><figcaption><span>LISTING ${num} - ${label}</span><button class="copy-bytes" type="button">COPY</button></figcaption><pre><code>${code}</code></pre></figure>`
    },
  )

  // blockquotes -> editor's marginalia
  html = html.replace(
    /<blockquote>\s*([\s\S]*?)\s*<\/blockquote>/g,
    (_m, inner: string) => `<aside class="margin-note" role="note">${inner}</aside>`,
  )

  // hr -> ascii divider
  html = html.replace(
    /<hr\s*\/?>/g,
    '<div class="ascii-divider" aria-hidden="true">.:[ ================================ ]:.</div>',
  )

  // h2/h3 anchors
  html = html.replace(/<h([23])>([\s\S]*?)<\/h\1>/g, (_m, lvl: string, inner: string) => {
    return `<h${lvl} id="${slugify(inner)}">${inner}</h${lvl}>`
  })

  // external links open safely
  html = html.replace(
    /<a href="(https?:\/\/[^"]+)"/g,
    '<a href="$1" target="_blank" rel="noopener noreferrer"',
  )

  return html
}

function parse(filename: string): Writeup {
  const raw = fs.readFileSync(path.join(DIR, filename), "utf8")
  const { data, content } = matter(raw)
  const status: WriteupStatus = data.status ?? "DRAFT"
  const words = content.trim().split(/\s+/).filter(Boolean).length
  // Embargoed bodies NEVER reach the client - render nothing.
  const html = status === "EMBARGOED" ? "" : renderContract(content)
  return {
    number: data.number ?? 0,
    slug: data.slug ?? filename.replace(/\.md$/, ""),
    title: data.title ?? "Untitled",
    date: data.date ?? "",
    type: (data.type ?? "note") as WriteupType,
    status,
    summary: data.summary ?? "",
    cves: data.cves ?? [],
    cvss: data.cvss,
    cvssVector: data.cvssVector,
    severity: data.severity,
    vendor: data.vendor,
    affected: data.affected,
    patchDays: data.patchDays,
    embargoUntil: data.embargoUntil,
    timeline: data.timeline,
    words,
    html,
  }
}

function readAll(): Writeup[] {
  if (!fs.existsSync(DIR)) return []
  return fs
    .readdirSync(DIR)
    .filter((f) => f.endsWith(".md"))
    .map(parse)
    .filter((w) => w.status !== "DRAFT")
    .sort((a, b) => a.number - b.number)
}

const stripHtml = ({ html: _html, ...meta }: Writeup): WriteupMeta => meta

export function getAllWriteups(): WriteupMeta[] {
  return readAll().map(stripHtml)
}

export function getWriteup(slug: string): Writeup | undefined {
  return readAll().find((w) => w.slug === slug)
}

export function counts(): { public: number; embargoed: number } {
  const all = readAll()
  return {
    public: all.filter((w) => w.status === "DISCLOSED").length,
    embargoed: all.filter((w) => w.status === "EMBARGOED").length,
  }
}
