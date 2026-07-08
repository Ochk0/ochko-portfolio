// SAMIZDAT - single source of truth (server + client safe, no fs).
// Components import { site } from "@/lib/site" - never hardcode facts.

export interface SiteData {
  handle: string
  name: string
  role: string
  issue: string
  location: string
  email: string
  phone: string
  github: string
  githubHandle: string
  linkedin: string
  intigriti: string
  resume: string
  portrait: string
  tagline: string
  editorsNote: string[] // first-person, 2-3 paragraphs
  publishersNote: string // third-person, 2 sentences max
  skills: { group: string; items: { name: string; writeupRefs?: string[] }[] }[]
  experience: {
    hash: string
    org: string
    role: string
    start: string
    end: string | null
    summary: string
    additions: string[]
    deletions: string[]
  }[]
  projects: {
    slug: string
    name: string
    summary: string
    description: string
    stack: string[]
    image: string
    status: "LIVE" | "ARCHIVED" | "WIP"
    price: string
    links: { live?: string; source?: string }
  }[]
  ctf: {
    date: string
    event: string
    category: string
    team?: string
    place: string
    where: string
    notable?: boolean
    flags?: number
  }[]
  pgp: { fingerprint?: string; publicKey?: string }
}

export const site: SiteData = {
  handle: "OCHK0",
  name: "Erdene-Och Byambabayar",
  role: "Security Researcher & Full-Stack Engineer",
  issue: "01",
  location: "Ulaanbaatar, Mongolia",
  email: "ochkofficial@gmail.com",
  phone: "+976 80500021",
  github: "https://github.com/Ochk0",
  githubHandle: "Ochk0",
  linkedin: "https://www.linkedin.com/in/ochk0/",
  intigriti: "https://app.intigriti.com/researcher/profile/ochko",
  resume: "/resume.pdf",
  portrait: "/main.jpg",
  tagline: "SECURITY RESEARCH & FULL-STACK ENGINEERING",
  editorsNote: [
    "I break software for a living and build it to relax. By day I lead engineering at Unread, shipping news platforms to production. By night I hunt bugs, play CTF on three continents, and write exploits until they land.",
    "Everything I find gets reported, patched, and written up, in that order. Three CVEs and an Intel bounty are on this page with the receipts. No embargo theater. If it's here, it shipped and the vendor knows.",
    "This site has no trackers, no analytics, and no framework it doesn't need. View source; that's what it's for.",
  ],
  publishersNote:
    "The editor breaks software politely and documents it ruthlessly. Three published CVEs (one critical), an Intel patch-bypass bounty, and five international CTF finals; vendors patch faster when he's on the CC line.",
  skills: [
    {
      group: "EXPLOITATION",
      items: [
        { name: "binary-exploitation", writeupRefs: ["bypassing-pie", "buffer-overflow-control-hijack"] },
        { name: "pwntools", writeupRefs: ["bypassing-pie", "buffer-overflow-control-hijack", "x86-64-shellcode-injection"] },
        { name: "shellcode", writeupRefs: ["x86-64-shellcode-injection"] },
        { name: "web-pentest", writeupRefs: ["cve-2026-25896-fast-xml-parser", "cve-2026-39365-vite-path-traversal"] },
        { name: "xss+sqli", writeupRefs: ["cve-2026-25896-fast-xml-parser"] },
        { name: "path-traversal", writeupRefs: ["cve-2026-39365-vite-path-traversal"] },
        { name: "priv-esc", writeupRefs: ["cve-2026-7997-chrome-updater-lpe"] },
        { name: "bug-bounty", writeupRefs: ["intel-rce-patch-bypass", "cve-2026-39365-vite-path-traversal"] },
        { name: "patch-diffing", writeupRefs: ["intel-rce-patch-bypass"] },
        { name: "owasp-top-10" },
      ],
    },
    {
      group: "SHIPPING",
      items: [
        { name: "typescript" },
        { name: "next@15" },
        { name: "react" },
        { name: "tailwind" },
        { name: "node" },
        { name: "python" },
        { name: "php" },
        { name: "flutter" },
        { name: "postgres" },
        { name: "mysql" },
        { name: "mongodb" },
        { name: "firebase" },
      ],
    },
    {
      group: "INFRASTRUCTURE",
      items: [
        { name: "linux" },
        { name: "docker" },
        { name: "aws" },
        { name: "gcp" },
        { name: "redis" },
        { name: "graphql" },
        { name: "websockets" },
        { name: "ci/cd" },
        { name: "selenium" },
      ],
    },
  ],
  experience: [
    {
      hash: "a3f9c21",
      org: "unread",
      role: "tech lead",
      start: "2023-08",
      end: null,
      summary: "Leading engineering for a modern media company.",
      additions: [
        "shipped techworm.mn - a news platform for young readers - on Next.js + Tailwind",
        "stood up Strapi CMS with custom APIs, cutting feature dev time ~50%",
        "shipped 100.unread.today - the 'Unread 100: Changemakers' showcase",
        "containerized a legacy CakePHP codebase and fixed critical bugs with no GitHub access",
      ],
      deletions: ["a legacy CakePHP monolith", "deploys that needed a prayer"],
    },
    {
      hash: "8e2d4b0",
      org: "pentra-cyber",
      role: "cybersecurity engineer",
      start: "2023-04",
      end: "2023-12",
      summary: "Offensive tooling and data pipelines for a security firm.",
      additions: [
        "built a large-scale scraping pipeline in Python + Selenium",
        "deployed a serverless intelligence platform on Next.js + Firebase",
        "wired scraped intel into the platform for analyst usability",
      ],
      deletions: ["manual, one-off data collection"],
    },
    {
      hash: "5c1b7ef",
      org: "teqstream",
      role: "back-end engineer",
      start: "2022-08",
      end: "2023-04",
      summary: "Backend performance, migrations, and security.",
      additions: [
        "cut a big-data job from 30 minutes to 5 (-83%)",
        "migrated legacy MySQL procedures to Node.js (+70% readability)",
        "built developer.timely.mn solo → +20% company revenue",
        "found and fixed XSS + SQL injection in production",
        "mentored interns and owned PR review",
      ],
      deletions: ["30-minute batch jobs", "unreviewed pull requests"],
    },
  ],
  projects: [
    {
      slug: "bullp",
      name: "BULLP",
      summary: "A binary trading platform, rebuilt and optimized for real money.",
      description:
        "Rebuilt and optimized a binary options trading platform generating $500+ in daily revenue. PHP, Node.js and MySQL under the hood, tuned for throughput and reliability under live trading load.",
      stack: ["PHP", "NODE", "MYSQL"],
      image: "/project/bullp.png",
      status: "LIVE",
      price: "$500+/DAY",
      links: {},
    },
    {
      slug: "timely",
      name: "TIMELY DOCS",
      summary: "A developer documentation platform, built solo, that moved revenue.",
      description:
        "Independently designed and shipped developer.timely.mn - a documentation platform for TeqStream. Directly credited with a 20% increase in company revenue.",
      stack: ["NODE", "REACT", "API"],
      image: "/project/timely.png",
      status: "LIVE",
      price: "+20% REVENUE",
      links: { live: "https://developer.timely.mn" },
    },
    {
      slug: "techworm",
      name: "TECHWORM",
      summary: "A tech-news platform for young readers.",
      description:
        "A visually engaging tech-news platform built at Unread with Next.js, Tailwind CSS and a custom Strapi CMS. Fast, editorial, and built to scale.",
      stack: ["NEXT", "TAILWIND", "STRAPI"],
      image: "/project/techworm.jpg",
      status: "LIVE",
      price: "0x00 USD",
      links: { live: "https://techworm.mn" },
    },
    {
      slug: "100",
      name: "UNREAD 100",
      summary: "A showcase of the changemakers shaping the decade.",
      description:
        "'Unread 100: Changemakers' - a platform spotlighting the new generation of politicians and changemakers. Built with Next.js and Firebase, animation-forward.",
      stack: ["NEXT", "FIREBASE"],
      image: "/project/100.jpg",
      status: "LIVE",
      price: "FREE AS IN SPEECH",
      links: { live: "https://100.unread.today" },
    },
  ],
  ctf: [
    { date: "2025", event: "HARUULZANGI 2025", category: "jeopardy", place: "2ND PLACE", where: "Mongolia", notable: true },
    { date: "2025", event: "Hackday 2025", category: "jeopardy", place: "FINALIST", where: "Paris, France" },
    { date: "2024", event: "BlackHat MEA 2024", category: "jeopardy", place: "37 / 250", where: "Riyadh, Saudi Arabia", notable: true },
    { date: "2024", event: "HackTheon Sejong 2024", category: "jeopardy", place: "FINALIST", where: "Sejong, South Korea" },
    { date: "2023", event: "VolgaCTF 2023", category: "attack-defense", place: "FINALIST", where: "Samara, Russia" },
    { date: "2022", event: "HARUULZANGI 2022", category: "jeopardy", place: "2ND PLACE", where: "Mongolia", notable: true },
  ],
  pgp: {}, // no key published yet - plaintext accepted
}
