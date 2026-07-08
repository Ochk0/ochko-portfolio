import { SectionFrame } from "@/components/section-frame"
import { DecodeText } from "@/components/fx/decode-text"
import { site } from "@/lib/site"

// Flag part 1/3 - a real HTML comment in the served markup. View source; that's what it's for.
const FLAG_COMMENT =
  "<!-- ochk0 1/3: flag{OCHK0 - the rest travels in headers and missing pages -->"

export function Cover() {
  return (
    <SectionFrame
      id="cover"
      index={0}
      className="flex min-h-[100svh] flex-col justify-between"
    >
      {/* flag part 1 - embedded raw so it survives to the DOM */}
      <div style={{ display: "none" }} aria-hidden="true" dangerouslySetInnerHTML={{ __html: FLAG_COMMENT }} />

      {/* top: kicker */}
      <p className="meta pt-4">
        {site.name.toUpperCase()} · SECURITY RESEARCHER · {site.location.toUpperCase()}
      </p>

      {/* center: the masthead itself */}
      <div className="py-8">
        <DecodeText
          as="h1"
          text={site.handle}
          trigger="mount"
          stickLastMs={1200}
          className="font-display uppercase leading-[0.82] tracking-[-0.01em] text-[clamp(4.5rem,15vw,15rem)] text-newsprint"
        />
        <p className="mt-5 font-mono text-[15px] uppercase tracking-[0.14em] text-newsprint">
          {site.tagline}
        </p>
        <div className="printhead mt-6 w-full" aria-hidden="true" />
      </div>

      {/* bottom: the three corners of the cover */}
      <div className="flex flex-col gap-8 pb-2 sm:grid sm:grid-cols-3 sm:items-end sm:gap-4">
        {/* bottom-left */}
        <div className="flex flex-col gap-2">
          <p className="font-mono text-[13px] uppercase tracking-[0.14em] text-newsprint">
            BUILDS SYSTEMS / BREAKS SYSTEMS / OPEN TO WORK<span className="text-arterial">*</span>
          </p>
          <p className="meta">
            *HIRING →{" "}
            <a href="#letters" className="press-invert px-1 text-arterial">
              CONTACT
            </a>
          </p>
        </div>

        {/* bottom-center */}
        <div className="flex justify-center">
          <span className="blink select-none font-mono text-[18px] leading-none text-arterial" aria-hidden="true">
            ▼
          </span>
        </div>

        {/* bottom-right */}
        <div className="flex flex-col items-start gap-2 sm:items-end">
          <div className="barcode" aria-hidden="true" />
          <p className="meta">0-DAY-001</p>
        </div>
      </div>
    </SectionFrame>
  )
}
