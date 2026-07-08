import { SectionFrame } from "@/components/section-frame"
import { DitherPortrait } from "@/components/fx/dither-portrait"
import { site } from "@/lib/site"

export function Editor() {
  return (
    <SectionFrame
      id="editor"
      index={3}
      numeral="0x03"
      title="THE EDITOR"
      tagline="ONE-MAN MASTHEAD"
    >
      <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <p className="meta">{"EDITOR'S NOTE"}</p>
          <div className="mt-4 space-y-5">
            {site.editorsNote.map((para, i) => (
              <p
                key={i}
                className="font-mono text-[15px] leading-[1.7] text-newsprint"
              >
                {para}
              </p>
            ))}
          </div>

          <div className="mt-8 border border-rule p-4">
            <p className="meta">FROM THE PUBLISHER</p>
            <p className="mt-3 font-mono text-[15px] leading-[1.7] text-newsprint">
              {site.publishersNote}
            </p>
          </div>
        </div>

        <figure className="lg:col-span-5">
          <DitherPortrait
            src={site.portrait}
            alt="OCHK0 - the editor, press room, date unknown"
            className="w-full"
          />
          <figcaption className="meta mt-3">
            FIG 03.1 - THE EDITOR, PRESS ROOM, DATE UNKNOWN
          </figcaption>
        </figure>
      </div>
    </SectionFrame>
  )
}
