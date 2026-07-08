import { Fragment } from "react"
import { SectionFrame } from "@/components/section-frame"
import { ToolToken } from "@/components/fx/tool-token"
import { site } from "@/lib/site"
import type { WriteupMeta } from "@/lib/writeups"

export function Colophon({ writeups }: { writeups: WriteupMeta[] }) {
  const bySlug = new Map(writeups.map((w) => [w.slug, w]))

  const resolve = (refs?: string[]) =>
    (refs ?? [])
      .map((slug) => bySlug.get(slug))
      .filter((w): w is WriteupMeta => Boolean(w))
      .map((w) => ({ number: w.number, title: w.title, slug: w.slug }))

  return (
    <SectionFrame
      id="colophon"
      index={7}
      numeral="0x07"
      title="STACK"
      tagline="TOOLING, AND NO TRACKERS"
    >
      <div className="mt-12 border border-rule bg-void p-5 font-mono text-[14px] leading-[1.9] md:p-8">
        <p className="text-graphite"># ochk0.stack - lockfileVersion 1</p>

        <div className="mt-6 space-y-5">
          {site.skills.map((group) => (
            <div key={group.group}>
              <p className="meta">{group.group}:</p>
              <div className="mt-2 flex flex-wrap items-center gap-x-1 gap-y-1 text-newsprint">
                {group.items.map((item, idx) => {
                  const refs = resolve(item.writeupRefs)
                  return (
                    <Fragment key={item.name}>
                      {idx > 0 && (
                        <span className="text-graphite" aria-hidden="true">
                          ▸
                        </span>
                      )}
                      {refs.length > 0 ? (
                        <ToolToken name={item.name} refs={refs} />
                      ) : (
                        <span>{item.name}</span>
                      )}
                    </Fragment>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        <p className="mt-6 text-graphite">
          imposter_syndrome - DEPRECATED. DO NOT INSTALL.
        </p>

        <p className="meta mt-6">
          BUILT WITH ANTON &amp; IBM PLEX MONO. NO TRACKERS. NO ANALYTICS.{" "}
          <a
            href={site.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-arterial underline underline-offset-2"
          >
            VIEW SOURCE
          </a>
        </p>
      </div>
    </SectionFrame>
  )
}
