import { getAllWriteups } from "@/lib/writeups"
import { Cover } from "@/components/sections/cover"
import { IndexToc } from "@/components/sections/index-toc"
import { DisclosureLedger } from "@/components/sections/ledger"
import { Editor } from "@/components/sections/editor"
import { RevisionHistory } from "@/components/sections/revision-history"
import { Classifieds } from "@/components/sections/classifieds"
import { Scoreboard } from "@/components/sections/scoreboard"
import { Colophon } from "@/components/sections/colophon"
import { Letters } from "@/components/sections/letters"

export default function Page() {
  const writeups = getAllWriteups()

  return (
    <main id="top">
      <Cover />
      <IndexToc writeups={writeups} />
      <DisclosureLedger writeups={writeups} />
      <Editor />
      <RevisionHistory />
      <Classifieds />
      <Scoreboard />
      <Colophon writeups={writeups} />
      <Letters />
    </main>
  )
}
