// Server-safe (no "use client"): a rubber-stamp mark. Rotated via the --stamp-angle
// custom property; the CSS (.stamp / .stamp[data-in="true"], §3) does the rest.

import type { CSSProperties, ReactNode } from "react"

export interface StampProps {
  children: ReactNode
  angle?: number
  animateIn?: boolean
  className?: string
}

export function Stamp({
  children,
  angle = -6,
  animateIn = false,
  className,
}: StampProps) {
  const classes = className ? `stamp ${className}` : "stamp"
  const style = { "--stamp-angle": `${angle}deg` } as CSSProperties
  return (
    <span className={classes} style={style} data-in={animateIn ? "true" : undefined}>
      {children}
    </span>
  )
}
