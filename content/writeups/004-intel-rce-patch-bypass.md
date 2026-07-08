---
number: 4
title: "The Patch That Wasn't: An RCE Bypass in an Intel Open-Source Project"
slug: "intel-rce-patch-bypass"
date: "2026-03-11"
type: "research"
status: "DISCLOSED"
summary: "A vendor shipped a fix for a remote code execution bug. The fix was incomplete. This is how patch-diffing turns 'already patched' back into 'still exploitable' - the finding that earned an Intel Project Circuit Breaker bounty."
cves: []
severity: "BUG BOUNTY"
vendor: "Intel (open-source project)"
timeline:
 - { label: "PATCH SHIPPED", date: "2026-02" }
 - { label: "BYPASS FOUND", date: "2026-03" }
 - { label: "REPORTED", date: "2026-03-11" }
 - { label: "REWARDED", date: "2026-03" }
---

The most efficient place to find a vulnerability is next to one that was just fixed. A patched bug is a confession: the vendor is telling you exactly where they were wrong, exactly what kind of input hurt them, and - if you read the diff carefully - exactly how narrowly they understood their own mistake. Fixes written to the proof-of-concept instead of the root cause are everywhere, and each one is a bypass waiting to be written. This is the story of one of them: an RCE fix in an Intel open-source project that patched the symptom and left the disease, and the bypass that earned an Intel Project Circuit Breaker bounty.

> A note on specifics: the target component, the exact primitive, and the working payload are withheld under the program's disclosure terms. What travels here is the method - which is the part that's yours to keep and reuse.

## Why incomplete patches are the norm, not the exception

When a report lands, a maintainer under time pressure does the rational thing: they reproduce the PoC, they find the line that lets it work, and they make *that PoC* stop working. Ship it, close the ticket. The trouble is that a proof-of-concept is one point in an input space, and the fix is often shaped to that single point rather than the region around it. The recurring patterns:

- **Blocklist a token, miss its equivalents.** The patch rejects the exact bytes in the report; the same effect reachable through a different encoding, a case fold, a Unicode look-alike, or a second decode pass sails through.
- **Guard one entry point, leave the parallel one.** The dangerous sink is reachable by two code paths. The fix hardens the one in the PoC. (This is the shape of the Vite `.map` bug elsewhere on this page - two doors into `readFile`, one lock.)
- **Validate, then transform.** The check runs on the input as received; a later normalization step re-introduces the very thing that was checked for. Validate-then-mutate is a bypass generator.
- **Fix the depth, not the recursion.** A limit is added at one layer; the untrusted structure just nests to reach the sink a level down.

None of these require a new bug class. They require reading the patch as a statement of what the author *believed* the bug was, and then finding the gap between that belief and the actual root cause.

## The method: patch-diffing to a bypass

The workflow that produced this finding, in the order it actually happened:

1. **Get both sides.** Pull the vulnerable revision and the fixed revision. For open source this is a `git diff` between two tags; for binaries it's BinDiff/Diaphora against before-and-after builds. Intel's projects are open, which made this the friendly case: the fix commit *is* the map.
2. **Read the fix as a hypothesis.** The diff tells you what the maintainer thinks the bug is. Write that belief down in one sentence: *"they think the bug is X, so they blocked X."* The bypass is almost always in the space of "things that are not literally X but reach the same sink."
3. **Find the sink, then enumerate every path to it.** The fix guards one path. Trace backwards from the dangerous operation and list *all* the ways input arrives there. The unguarded path is the bug.
4. **Attack the normalization order.** Map every transform the input passes through - decode, canonicalize, trim, re-encode - and check whether the new validation runs *before* a transform that can undo it. Order-of-operations bugs survive most patches because the patch adds a check without moving it.
5. **Rebuild the primitive, prove impact.** Reconstruct the original exploit primitive through the unguarded route and drive it all the way to the same outcome the original report claimed - here, code execution. A bypass that only reaches "crash" is a different, weaker report; carry it to the real impact.

## What the fix missed

Without naming the component: the original issue let attacker-controlled input reach a sink that ended in code execution. The vendor's patch added a guard keyed to the *form* the input took in the original report. The root cause was not that form - it was that the sink trusted the input at all, along a path the guard didn't cover. Reconstructing the same primitive through that uncovered path restored the full RCE the patch was believed to have closed. The delta between "what they blocked" and "what actually reached the sink" was the entire finding.

## Disclosure

Reported through Intel's coordinated channel (Project Circuit Breaker), with a working proof of concept against the *patched* build - the crucial detail, because "your fix is incomplete, here it is running anyway" is a categorically stronger report than a fresh bug. Triaged, reproduced, and **rewarded ($1,500)**. Handled under the program's disclosure terms, which is why the identifiers stay off this page.

> Intel doesn't publish researcher names or bounty amounts, so this one isn't verifiable through a public link the way the CVEs on this site are - the receipts (submission thread, acknowledgement, payout) exist privately. Take the CVEs as the public proof and this as the method behind them.

## The takeaway

Treat "already patched" as a starting line, not a finish. A fix is the vendor showing you their mental model of a bug, and mental models are smaller than bugs. Diff the patch, write down what they think they fixed, enumerate every path they didn't, and check whether their new check survives contact with their own normalization. The best N-day work isn't finding new bugs - it's noticing the old one never fully left.
