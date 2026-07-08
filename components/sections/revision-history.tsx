import { SectionFrame } from "@/components/section-frame"
import { site } from "@/lib/site"

export function RevisionHistory() {
  return (
    <SectionFrame
      id="history"
      index={4}
      numeral="0x04"
      title="EXPERIENCE"
      tagline="MY CAREER AS A GIT LOG"
    >
      <figure className="listing mt-12 overflow-x-auto">
        <figcaption>
          <span>LISTING 00 - git log --graph --all</span>
        </figcaption>

        <div className="p-4 font-mono text-[13px] leading-[1.6] text-newsprint">
          {site.experience.map((commit, i) => {
            const ins = commit.additions.length
            const del = commit.deletions.length
            const date = `${commit.start} → ${commit.end ?? "present"}`
            const last = i === site.experience.length - 1
            return (
              <div key={commit.hash}>
                <details>
                  <summary className="press-invert flex cursor-pointer list-none items-baseline gap-2 whitespace-nowrap px-1 py-0.5 [&::-webkit-details-marker]:hidden">
                    <span className="text-graphite">*</span>
                    <span className="text-arterial">{commit.hash}</span>
                    <span className="text-graphite">(org/{commit.org})</span>
                    <span className="text-newsprint">{commit.role}</span>
                  </summary>

                  <div className="my-1 ml-[3px] space-y-0.5 border-l border-rule pl-4">
                    <div className="text-graphite">
                      Author: {site.name} &lt;{site.email}&gt;
                    </div>
                    <div className="text-graphite">Date: {date}</div>
                    <div className="pt-2 text-newsprint">
                      {commit.role} @ {commit.org}
                    </div>

                    <div className="pt-2">
                      {commit.additions.map((a, k) => (
                        <div key={`a-${k}`} className="text-newsprint">
                          <span className="text-arterial">+</span> {a}
                        </div>
                      ))}
                      {commit.deletions.map((d, k) => (
                        <div key={`d-${k}`} className="text-graphite">
 - {d}
                        </div>
                      ))}
                    </div>

                    <div className="pt-2 text-graphite">
                      {ins} insertion{ins === 1 ? "" : "s"}(+), {del} deletion
                      {del === 1 ? "" : "s"}(-)
                    </div>
                  </div>
                </details>

                {!last && <div className="px-1 text-graphite">|</div>}
              </div>
            )
          })}
        </div>
      </figure>
    </SectionFrame>
  )
}
