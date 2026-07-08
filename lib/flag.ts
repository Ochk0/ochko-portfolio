// The CTF. Full flag: flag{OCHK0_NEVER_DIES}
// Stored base64 so the assembled flag is never greppable in one piece in the bundle.
// Three parts: the source (cover HTML comment), the headers (X-Flag-Part), the missing page (404, reversed).
export const FLAG_B64 = "ZmxhZ3tPQ0hLMF9ORVZFUl9ESUVTfQ=="

export const isFlag = (s: string): boolean => {
  try {
    return s.trim() === atob(FLAG_B64)
  } catch {
    return false
  }
}
