// SectionFrame - the printed frame around every section (server component).
// Renders registration crops, the ghost numeral, an ASCII rule, and the header
// with a decode-on-inview h2. Cover uses it with no numeral/title (frame only).
import type { CSSProperties, ReactNode } from "react"
import { DecodeText } from "@/components/fx/decode-text"

interface SectionFrameProps {
  id: string
  index: number
  numeral?: string
  title?: string
  tagline?: string
  children: ReactNode
  className?: string
}

const BAR = "=".repeat(28)

export function SectionFrame({
  id,
  index,
  numeral,
  title,
  tagline,
  children,
  className,
}: SectionFrameProps) {
  const hasHeader = Boolean(numeral && title)

  return (
    <section
      id={id}
      style={{ "--sec-i": index } as CSSProperties}
      aria-labelledby={hasHeader ? `${id}-h` : undefined}
      className={`relative container-press py-20 md:py-28 overflow-hidden${
        className ? ` ${className}` : ""
      }`}
    >
      {hasHeader ? (
        <>
          <div className="ascii-divider" aria-hidden="true">
            {`.:[ ${BAR} ${numeral} ${BAR} ]:.`}
          </div>

          <span
            aria-hidden="true"
            className="ghost-numeral absolute right-0 top-6 text-[clamp(8rem,22vw,18rem)]"
          >
            {numeral}
          </span>

          <header className="relative mb-10 md:mb-14 mt-6">
            <p className="meta">{numeral} · REF</p>
            <h2
              id={`${id}-h`}
              className="mt-3 font-display uppercase tracking-[-0.01em] leading-[0.9] text-[clamp(2.25rem,6vw,4.25rem)]"
            >
              <DecodeText as="span" trigger="inview" text={title as string} />
            </h2>
            {tagline ? <p className="meta mt-4">{tagline}</p> : null}
          </header>
        </>
      ) : null}

      {children}

      <span className="crop crop-tl" aria-hidden="true" />
      <span className="crop crop-tr" aria-hidden="true" />
      <span className="crop crop-bl" aria-hidden="true" />
      <span className="crop crop-br" aria-hidden="true" />
    </section>
  )
}
