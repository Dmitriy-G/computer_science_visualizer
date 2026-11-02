import type { StructureDefinition } from './StructureCatalog.ts'

export class HashStructureDefinitions {
  public static readonly structures: readonly StructureDefinition[] = [
    { kind: 'open-addressing-hash-table', group: 'hash-based', name: 'Open Addressing Hash Table', description: 'Linear probing, reusable tombstones, and load-triggered rehashing', symbol: '#' },
    { kind: 'separate-chaining-hash-table', group: 'hash-based', name: 'Separate Chaining Hash Table', description: 'Linked collision chains stored behind bucket heads', symbol: '#' },
    { kind: 'robin-hood-hash-table', group: 'hash-based', name: 'Robin Hood Hash Table', description: 'Probe-distance stealing and backward-shift deletion', symbol: '#' },
    { kind: 'cuckoo-hash-table', group: 'hash-based', name: 'Cuckoo Hash Table', description: 'Two candidate locations, alternating evictions, and bounded rehashing', symbol: '#' },
    { kind: 'hopscotch-hashing', group: 'hash-based', name: 'Hopscotch Hashing', description: 'Four-slot neighborhoods, hop bitmaps, and legal hole relocation', symbol: '#' },
    { kind: 'extendible-hashing', group: 'hash-based', name: 'Extendible Hashing', description: 'Aliased directory pointers, local depths, and targeted bucket splits', symbol: '#' },
    { kind: 'linear-hashing', group: 'hash-based', name: 'Linear Hashing', description: 'Overflow pages and one-bucket-at-a-time split rounds', symbol: '#' },
    { kind: 'perfect-hash-table', group: 'hash-based', name: 'Perfect Hash Table', description: 'Static two-level FKS hashing with collision-free secondary tables', symbol: '#' },
    { kind: 'consistent-hashing-ring', group: 'hash-based', name: 'Consistent Hashing Ring', description: 'Clockwise token ownership with three virtual nodes per server', symbol: '#' },
  ]
}
