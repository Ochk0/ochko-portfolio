// The corrections desk. Also the resting place of flag part 3/3 - printed
// backwards, unexplained, aria-hidden. Reads "_DIES}" in a mirror.
import { Redacted } from "@/components/fx/redacted"

export default function NotFound() {
  return (
    <main
      id="top"
      className="container-press flex min-h-[80vh] flex-col items-center justify-center py-24 text-center"
    >
      <p className="meta">SAMIZDAT - CORRECTIONS DESK</p>

      <h1 className="mt-6 font-display uppercase tracking-[-0.01em] leading-[0.9] text-[clamp(2.5rem,9vw,6.5rem)] text-newsprint">
        0x404 - PULLED BEFORE PRINT
      </h1>

      <p className="mt-6 max-w-[52ch] font-mono text-[15px] leading-[1.7] text-newsprint">
        THIS PAGE WAS REMOVED BY THE EDITOR. NO CORRECTIONS WILL BE ISSUED.
      </p>

      <div className="mt-10 flex flex-col items-center gap-2">
        <Redacted length={22} label="Withheld line" />
        <Redacted length={34} label="Withheld line" />
        <Redacted length={16} label="Withheld line" />
        <Redacted length={28} label="Withheld line" />
      </div>

      <p className="meta mt-10" aria-hidden="true">
        {"}SEID_ :3/3 TRAP"}
      </p>

      <a
        href="/"
        className="press-invert mt-10 inline-block border border-rule px-4 py-3 font-mono text-[14px] uppercase tracking-[0.14em] text-newsprint"
      >
        ← FRONT PAGE
      </a>

      <p className="meta mt-6">or press ~ and complain</p>
    </main>
  )
}
