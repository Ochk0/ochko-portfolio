import { Uptime } from "@/components/fx/uptime"
import { IntrusionLog } from "@/components/fx/intrusion-log"
import { site } from "@/lib/site"

export function BackCover() {
  return (
    <footer className="border-t border-rule bg-void">
      <div className="container-press py-12">
        <div className="ascii-divider" aria-hidden="true">
          .:[ =============================== EOF
          =============================== ]:.
        </div>

        <p className="mt-6 font-mono text-[13px] text-newsprint">
          OCHK0 · {site.role.toUpperCase()}
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2">
          <Uptime />
          <IntrusionLog />
        </div>

        <p className="mt-4 font-mono text-[13px] text-graphite">
          press ~ for the shell
        </p>

        <p className="meta mt-6">
          © 2026 OCHK0 · NO GODS, NO MASTERS, NO CLOSED SOURCE ·{" "}
          <a
            href={site.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-arterial underline underline-offset-2"
          >
            VIEW SOURCE ↗
          </a>
        </p>
      </div>
    </footer>
  )
}
