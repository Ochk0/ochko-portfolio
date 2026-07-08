"use client"

// PressGrain - the newsprint tooth. A single fixed canvas of monochrome noise,
// painted ONCE and only repainted on a debounced resize. No animation loop.
// Article routes dial the atmosphere down to 0.03 (the INK COVENANT).
import { useEffect, useRef } from "react"
import { usePathname } from "next/navigation"

export function PressGrain() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const pathname = usePathname()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // dpr capped at 1: paint at CSS-pixel resolution for a coarse, printed tooth.
    const draw = () => {
      const w = Math.max(1, Math.floor(window.innerWidth))
      const h = Math.max(1, Math.floor(window.innerHeight))
      canvas.width = w
      canvas.height = h
      const image = ctx.createImageData(w, h)
      const data = image.data
      for (let i = 0; i < w * h; i++) {
        if (Math.random() < 0.25) {
          const v = 120 + Math.floor(Math.random() * 120)
          const o = i * 4
          data[o] = v
          data[o + 1] = v
          data[o + 2] = v
          data[o + 3] = 255
        }
        // otherwise: fully transparent (alpha stays 0)
      }
      ctx.putImageData(image, 0, 0)
    }

    draw()

    let debounce: number | undefined
    const onResize = () => {
      if (debounce) clearTimeout(debounce)
      debounce = window.setTimeout(draw, 300)
    }
    window.addEventListener("resize", onResize)

    return () => {
      window.removeEventListener("resize", onResize)
      if (debounce) clearTimeout(debounce)
    }
  }, [])

  const isArticle = /^\/writeups\/[^/]+$/.test(pathname ?? "")

  return (
    <canvas
      ref={canvasRef}
      data-grain
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[60] h-full w-full mix-blend-overlay"
      style={isArticle ? { opacity: 0.03 } : { opacity: "var(--grain-opacity)" }}
    />
  )
}
