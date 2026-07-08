import Image from "next/image"
import { SectionFrame } from "@/components/section-frame"
import { site } from "@/lib/site"

export function Classifieds() {
  return (
    <SectionFrame
      id="classifieds"
      index={5}
      numeral="0x05"
      title="CLASSIFIEDS"
      tagline="THINGS BUILT FOR MONEY, PRACTICE, OR SPITE"
    >
      <div className="mt-12 grid grid-cols-1 gap-px bg-rule md:grid-cols-2">
        {site.projects.map((project, i) => (
          <article
            key={project.slug}
            className="flex flex-col border border-rule bg-tar p-5 transition-none hover:border-arterial"
          >
            <header className="flex items-center justify-between">
              <span className="meta">AD {String(i + 1).padStart(3, "0")}</span>
              <span className={project.status === "LIVE" ? "meta text-arterial" : "meta"}>
                {project.status}
              </span>
            </header>

            <div className="relative mt-4 h-44 w-full border-b border-rule">
              <Image
                src={project.image}
                alt={project.name}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover grayscale contrast-125 brightness-90"
              />
            </div>

            <h3 className="mt-4 font-display text-[24px] uppercase leading-none tracking-[-0.01em]">
              {project.name}
            </h3>

            <p className="mt-3 font-mono text-[14px] leading-[1.6] text-newsprint">
              {project.summary}
            </p>

            <div className="mt-3 flex flex-wrap gap-2">
              {project.stack.map((tech) => (
                <span key={tech} className="meta">
                  [{tech}]
                </span>
              ))}
            </div>

            <details className="mt-3">
              <summary className="meta cursor-pointer list-none text-arterial [&::-webkit-details-marker]:hidden">
                MORE ▸
              </summary>
              <p className="mt-3 font-mono text-[14px] leading-[1.6] text-newsprint">
                {project.description}
              </p>
            </details>

            <div className="mt-auto pt-4">
              {(project.links.live || project.links.source) && (
                <div className="flex flex-wrap gap-2">
                  {project.links.live && (
                    <a
                      href={project.links.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="press-invert border border-rule px-3 py-1 font-mono text-[13px] uppercase tracking-[0.08em]"
                    >
                      [ LIVE ↗ ]
                    </a>
                  )}
                  {project.links.source && (
                    <a
                      href={project.links.source}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="press-invert border border-rule px-3 py-1 font-mono text-[13px] uppercase tracking-[0.08em]"
                    >
                      [ SOURCE ↗ ]
                    </a>
                  )}
                </div>
              )}
              <p className="meta mt-4">PRICE: {project.price}</p>
            </div>
          </article>
        ))}
      </div>
    </SectionFrame>
  )
}
