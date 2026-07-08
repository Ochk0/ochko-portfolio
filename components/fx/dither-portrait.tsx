"use client"

import { useEffect, useRef } from "react"

// Newsprint dots printed on transparency - the dark tar field shows through the gaps.
// (Canvas draw code: literal rgb is legal here per the color rule; this is not CSS.)
const INK: [number, number, number] = [232, 230, 224] // newsprint #E8E6E0
const MAX_W = 520

/**
 * DitherPortrait - loads an image, reduces it to a 2-tone Atkinson-dithered halftone
 * on an offscreen buffer, then paints it (pixelated) into a visible canvas. On a fine
 * pointer, sweeping X across the portrait re-dithers it live (threshold 0.35-0.65):
 * drag left he dissolves to noise, right he resolves. Touch / reduced-motion: static 0.5.
 */
export function DitherPortrait(props: { src: string; alt: string; className?: string }) {
  const { src, alt, className } = props
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const finePointer =
      typeof window !== "undefined" && window.matchMedia("(pointer: fine)").matches
    const interactive = finePointer && !reduced

    let disposed = false
    let gray: Float32Array | null = null // luminance 0..255 of the downscaled source
    let W = 0
    let H = 0
    let hovering = false
    let rafId = 0
    let pendingThreshold = 0.5

    // Atkinson error-diffusion at a normalized threshold (0..1) → paint the visible canvas.
    const dither = (threshold: number) => {
      if (disposed || !gray) return
      const buf = Float32Array.from(gray)
      const out = ctx.createImageData(W, H)
      const data = out.data
      const cut = threshold * 255
      for (let y = 0; y < H; y++) {
        for (let x = 0; x < W; x++) {
          const i = y * W + x
          const old = buf[i]
          const on = old >= cut
          const nv = on ? 255 : 0
          const err = (old - nv) / 8
          // distribute 1/8 of the error to 6 forward neighbours (Atkinson)
          if (x + 1 < W) buf[i + 1] += err
          if (x + 2 < W) buf[i + 2] += err
          if (y + 1 < H) {
            if (x - 1 >= 0) buf[i + W - 1] += err
            buf[i + W] += err
            if (x + 1 < W) buf[i + W + 1] += err
          }
          if (y + 2 < H) buf[i + 2 * W] += err

          const p = i * 4
          if (on) {
            data[p] = INK[0]
            data[p + 1] = INK[1]
            data[p + 2] = INK[2]
            data[p + 3] = 255
          } else {
            data[p + 3] = 0 // transparent - tar shows through
          }
        }
      }
      ctx.putImageData(out, 0, 0)
    }

    const img = new Image()
    img.decoding = "async"
    img.onload = () => {
      if (disposed) return
      const scale = Math.min(1, MAX_W / (img.naturalWidth || MAX_W))
      W = Math.max(1, Math.round((img.naturalWidth || MAX_W) * scale))
      H = Math.max(1, Math.round((img.naturalHeight || MAX_W) * scale))
      canvas.width = W
      canvas.height = H

      // sample luminance once via a scratch canvas
      const scratch = document.createElement("canvas")
      scratch.width = W
      scratch.height = H
      const sctx = scratch.getContext("2d")
      if (!sctx) return
      sctx.drawImage(img, 0, 0, W, H)
      const px = sctx.getImageData(0, 0, W, H).data
      gray = new Float32Array(W * H)
      for (let i = 0; i < W * H; i++) {
        const p = i * 4
        gray[i] = 0.299 * px[p] + 0.587 * px[p + 1] + 0.114 * px[p + 2]
      }
      dither(0.5)
    }
    // same-origin asset (/main.jpg) - no CORS taint, getImageData stays legal.
    img.src = src

    // --- live pointer sweep (fine pointer, motion allowed) ---
    const schedule = () => {
      if (rafId) return
      rafId = requestAnimationFrame(() => {
        rafId = 0
        if (hovering) dither(pendingThreshold)
      })
    }
    const onMove = (e: PointerEvent) => {
      if (!hovering || !gray) return
      const rect = canvas.getBoundingClientRect()
      const frac = rect.width ? (e.clientX - rect.left) / rect.width : 0.5
      const clamped = Math.min(1, Math.max(0, frac))
      pendingThreshold = 0.35 + clamped * 0.3
      schedule()
    }
    const onEnter = () => {
      hovering = true
    }
    const onLeave = () => {
      hovering = false
      if (gray) dither(0.5) // settle back to the printed state
    }

    if (interactive) {
      canvas.addEventListener("pointerenter", onEnter)
      canvas.addEventListener("pointerleave", onLeave)
      canvas.addEventListener("pointermove", onMove)
    }

    return () => {
      disposed = true
      img.onload = null
      if (rafId) cancelAnimationFrame(rafId)
      if (interactive) {
        canvas.removeEventListener("pointerenter", onEnter)
        canvas.removeEventListener("pointerleave", onLeave)
        canvas.removeEventListener("pointermove", onMove)
      }
    }
  }, [src])

  return (
    <>
      <canvas
        ref={canvasRef}
        role="img"
        aria-label={alt}
        className={className}
        style={{ imageRendering: "pixelated", width: "100%", height: "auto" }}
      />
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} className={className} />
      </noscript>
    </>
  )
}
