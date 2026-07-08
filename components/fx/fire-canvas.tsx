"use client"

import { useEffect, useLayoutEffect, useRef } from "react"

// Classic demoscene fire - tints of the one wound (arterial), on a low-res buffer upscaled pixelated.
const W = 160
const H = 40
const MAX = 32
const FRAME_MS = 33 // ~30fps

// palette: [transparent, #3F0D00, #7F1A00, #BF2600, #FF3300]
const PALETTE: [number, number, number, number][] = [
  [0, 0, 0, 0],
  [63, 13, 0, 255],
  [127, 26, 0, 255],
  [191, 38, 0, 255],
  [255, 51, 0, 255],
]

function tone(v: number): [number, number, number, number] {
  if (v <= 0) return PALETTE[0]
  if (v < 8) return PALETTE[1]
  if (v < 16) return PALETTE[2]
  if (v < 24) return PALETTE[3]
  return PALETTE[4]
}

export function FireCanvas({ durationMs = 4000, onDone }: { durationMs?: number; onDone?: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  // Keep onDone in a ref so a parent re-render (e.g. pressing ~ during the burn)
  // doesn't retrigger the effect and restart the fire from zero.
  const onDoneRef = useRef(onDone)
  useLayoutEffect(() => {
    onDoneRef.current = onDone
  })

  useEffect(() => {
    if (typeof window === "undefined") return
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reduce) {
      onDone?.()
      return
    }
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const buf = new Uint8Array(W * H)
    const img = ctx.createImageData(W, H)

    let raf = 0
    let last = 0
    const start = performance.now()

    const step = (now: number) => {
      if (now - start >= durationMs) {
        onDoneRef.current?.()
        return
      }
      raf = requestAnimationFrame(step)
      if (now - last < FRAME_MS) return
      last = now

      // fire source: bottom row full intensity
      for (let x = 0; x < W; x++) buf[(H - 1) * W + x] = MAX

      // propagate upward with decay + horizontal drift
      for (let y = 0; y < H - 1; y++) {
        for (let x = 0; x < W; x++) {
          const below = buf[(y + 1) * W + x]
          const decay = Math.floor(Math.random() * 3) & 1 // 0 or 1
          const v = below - decay
          const nx = decay ? Math.min(W - 1, Math.max(0, x + (Math.random() < 0.5 ? -1 : 1))) : x
          buf[y * W + nx] = v < 0 ? 0 : v
        }
      }

      // paint
      const data = img.data
      for (let i = 0; i < W * H; i++) {
        const [r, g, b, a] = tone(buf[i])
        const p = i * 4
        data[p] = r
        data[p + 1] = g
        data[p + 2] = b
        data[p + 3] = a
      }
      ctx.putImageData(img, 0, 0)
    }

    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [durationMs])

  return (
    <canvas
      ref={canvasRef}
      width={W}
      height={H}
      aria-hidden="true"
      className="pointer-events-none fixed bottom-0 left-0 z-[70] h-24 w-full"
      style={{ imageRendering: "pixelated" }}
    />
  )
}
