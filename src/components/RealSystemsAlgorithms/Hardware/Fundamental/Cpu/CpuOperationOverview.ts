import type { SystemOverviewInformation } from '../../../../../visualization/SystemOverviewInformation.ts'
import type { CpuOperationKind } from './CpuOperationModel.ts'

export class CpuOperationOverview {
  public static create(operation: CpuOperationKind): SystemOverviewInformation {
    const increment = operation === 'increment'
    return {
      name: increment ? 'Non-atomic operation: i = i + 1' : 'Atomic operation: i = j',
      summary: increment
        ? 'Follow a load, a private-register addition, and a buffered store. Another core can update i between the read and write, causing a lost update.'
        : 'Follow one aligned 32-bit load from shared j into private local i. The read captures one complete value even if another core writes afterward.',
      problem: increment
        ? 'Atomic individual reads and writes do not make a compound read-modify-write expression atomic.'
        : 'A reader needs a complete word rather than a mixture of bytes from two writes. This guarantee is narrower than making an entire multi-variable expression atomic.',
      steps: increment ? [
        'Start with shared i = 7 at aligned address 0x1000 and a coherent L1 data-cache hit.',
        'Fetch, decode, dispatch, and issue LOAD; calculate and translate its address.',
        'Capture the complete value 7 and retire it into private register state.',
        'Another core publishes i = 8 before this core writes its result.',
        'Fetch and issue ADD; compute 7 + 1 = 8 using the captured private value.',
        'Retire the addition, then fetch and issue STORE to the same address.',
        'Retire the store into the store buffer, then publish 8 through coherent memory.',
        'Observe i = 8 rather than 9: the separate read and write allowed a lost update.',
      ] : [
        'Start with shared j = 7 at aligned address 0x1000 and a coherent L1 data-cache hit.',
        'Fetch, decode, dispatch, and issue LOAD.',
        'Calculate the aligned address and use the assumed valid DTLB mapping.',
        'Capture a complete 32-bit value from the coherent cache.',
        'Write the captured value into a private register and retire local i = 7.',
        'Another core publishes j = 99 afterward; local i remains 7.',
        'The read observed a whole old value. A write before the read could instead yield the whole new value.',
      ],
      implementationNote: 'These are machine-level teaching traces for an aligned 32-bit word in normal cacheable x86 memory, not a guarantee for arbitrary source-language assignments, widths, alignments, or devices. In the atomic-load example, i is local/register state, not another shared memory location. A valid C++ analogy uses std::atomic<int32_t>: separate load/add/store for the non-atomic compound increment, and i = j.load() for the atomic read. Unsynchronized ordinary C++ objects have data-race rules; volatile is not a substitute for atomics. Atomicity is distinct from memory ordering. Cache hit, address translation, permissions, and available operands are fixed assumptions. Coherence publication is abstracted; cache replacement, protocols, speculative scheduling, DRAM transfers, and cycle timing are not simulated. Shared package components remain visible and idle. The common diagram keeps its positions, colors, size, and camera.',
      realWorldUsage: {
        technologies: [
          { name: 'Aligned word accesses on Intel x86', url: 'https://www.intel.com/content/dam/support/us/en/documents/processors/pentium4/sb/25366821.pdf', usage: 'The guaranteed-atomic-operations section documents atomic aligned doubleword reads and writes under the stated memory assumptions.' },
          { name: 'Read-modify-write and LOCK', url: 'https://devblogs.microsoft.com/oldnewthing/20190131-00/?p=100845', usage: 'Microsoft explains why an unlocked increment can interleave with another processor and why a locked read-modify-write has a stronger guarantee.' },
          { name: 'C++ atomic objects and data races', url: 'https://isocpp.org/files/papers/N4860.pdf', usage: 'The C++ draft distinguishes atomic operations from conflicting unsynchronized accesses to ordinary objects.' },
        ],
        products: [],
      },
    }
  }
}
