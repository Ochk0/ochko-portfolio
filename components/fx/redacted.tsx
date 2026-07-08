// Server-safe (no "use client"): pure, static markup.
//
// The redaction is real: the content is literal █ glyphs, so copy/paste keeps the
// secret and the value never appears in the DOM. Hover flicker is pure CSS (§3).

export interface RedactedProps {
  length?: number
  label?: string
  className?: string
}

export function Redacted({ length = 12, label, className }: RedactedProps) {
  const bars = "█".repeat(Math.max(0, length))
  const classes = className ? `redact ${className}` : "redact"
  return (
    <span className={classes} aria-label={label ?? "Embargoed disclosure"}>
      {bars}
    </span>
  )
}
