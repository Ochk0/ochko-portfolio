import { SectionFrame } from "@/components/section-frame"
import { CopyKey } from "@/components/fx/copy-key"
import { site } from "@/lib/site"

export function Letters() {
  return (
    <SectionFrame
      id="letters"
      index={8}
      numeral="0x08"
      title="LETTERS TO THE EDITOR"
      tagline="PLAINTEXT TIPS ACCEPTED. ENCRYPTED TIPS RESPECTED."
    >
      <div className="mt-12 grid grid-cols-1 gap-10 md:grid-cols-2">
        <div className="flex flex-col border-b border-rule">
          <a
            href={`mailto:${site.email}`}
            className="press-invert block border-t border-rule px-2 py-5 font-mono text-[16px]"
          >
            <span className="text-arterial">$</span> mail {site.email}
          </a>
          <a
            href={site.github}
            target="_blank"
            rel="noopener noreferrer"
            className="press-invert block border-t border-rule px-2 py-5 font-mono text-[16px]"
          >
            <span className="text-arterial">$</span> open {site.githubHandle}
          </a>
          <a
            href={site.intigriti}
            target="_blank"
            rel="noopener noreferrer"
            className="press-invert block border-t border-rule px-2 py-5 font-mono text-[16px]"
          >
            <span className="text-arterial">$</span> open intigriti/ochko
          </a>
          <a
            href={site.resume}
            target="_blank"
            rel="noopener noreferrer"
            className="press-invert block border-t border-rule border-b px-2 py-5 font-mono text-[16px]"
          >
            <span className="text-arterial">$</span> curl -O resume.pdf
          </a>
        </div>

        <div className="border border-rule bg-void p-5">
          <p className="meta">PGP</p>
          {site.pgp.publicKey ? (
            <div className="mt-4">
              <CopyKey
                value={site.pgp.publicKey}
                fingerprint={site.pgp.fingerprint ?? ""}
              />
            </div>
          ) : (
            <p className="meta mt-4">KEY FORTHCOMING - PLAINTEXT ACCEPTED.</p>
          )}
        </div>
      </div>
    </SectionFrame>
  )
}
