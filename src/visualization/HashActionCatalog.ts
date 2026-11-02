import type { ActionChoice } from './ActionCatalog.ts'
import type { StructureKind } from './Scene.ts'

export class HashActionCatalog {
  public static getActions(kind: StructureKind): readonly ActionChoice[] | null {
    switch (kind) {
      case 'open-addressing-hash-table': return [
        { kind: 'insert', title: 'Insert / update', description: 'Probe consecutive slots from the home index, reuse tombstones, and grow above 0.75 live load.' },
        { kind: 'search-value', title: 'Look up a key', description: 'Follow this structure\'s hash locations and return the stored value or exact absence.' },
        { kind: 'delete-value', title: 'Delete a key', description: 'Replace the deleted entry with a tombstone so later probes remain reachable.' },
        { kind: 'clear', title: 'Clear', description: 'Remove all stored entries according to this structure\'s allocation policy.' },
      ]
      case 'separate-chaining-hash-table': return [
        { kind: 'insert', title: 'Insert / update', description: 'Follow a bucket chain, update an existing key, or link a new head; rehash above 0.75 load.' },
        { kind: 'search-value', title: 'Look up a key', description: 'Follow this structure\'s hash locations and return the stored value or exact absence.' },
        { kind: 'delete-value', title: 'Delete a key', description: 'Unlink the key and reconnect its collision-chain neighbors.' },
        { kind: 'clear', title: 'Clear', description: 'Remove all stored entries according to this structure\'s allocation policy.' },
      ]
      case 'robin-hood-hash-table': return [
        { kind: 'insert', title: 'Insert / update', description: 'Displace residents that have traveled less far, keeping the evicted record in a holding cell.' },
        { kind: 'search-value', title: 'Look up a key', description: 'Follow this structure\'s hash locations and return the stored value or exact absence.' },
        { kind: 'delete-value', title: 'Delete a key', description: 'Remove the key and shift displaced followers backward, leaving no tombstone.' },
        { kind: 'clear', title: 'Clear', description: 'Remove all stored entries according to this structure\'s allocation policy.' },
      ]
      case 'cuckoo-hash-table': return [
        { kind: 'insert', title: 'Insert / update', description: 'Try one of two candidate slots, alternate evictions, and rebuild with fresh seeded functions when needed.' },
        { kind: 'search-value', title: 'Look up a key', description: 'Follow this structure\'s hash locations and return the stored value or exact absence.' },
        { kind: 'delete-value', title: 'Delete a key', description: 'Check the two candidate positions and clear the matching slot.' },
        { kind: 'clear', title: 'Clear', description: 'Remove all stored entries according to this structure\'s allocation policy.' },
      ]
      case 'hopscotch-hashing': return [
        { kind: 'insert', title: 'Insert / update', description: 'Keep each record within four positions of home and relocate a hole using home-owned bitmaps.' },
        { kind: 'search-value', title: 'Look up a key', description: 'Follow this structure\'s hash locations and return the stored value or exact absence.' },
        { kind: 'delete-value', title: 'Delete a key', description: 'Remove the entry and clear its offset bit in the home neighborhood map.' },
        { kind: 'clear', title: 'Clear', description: 'Remove all stored entries according to this structure\'s allocation policy.' },
      ]
      case 'extendible-hashing': return [
        { kind: 'insert', title: 'Insert / update', description: 'Split full three-record buckets and double the directory only when local and global depths match.' },
        { kind: 'search-value', title: 'Look up a key', description: 'Follow this structure\'s hash locations and return the stored value or exact absence.' },
        { kind: 'delete-value', title: 'Delete a key', description: 'Remove a record from its bucket; retain directory size and local depths.' },
        { kind: 'clear', title: 'Clear', description: 'Remove all stored entries according to this structure\'s allocation policy.' },
      ]
      case 'linear-hashing': return [
        { kind: 'insert', title: 'Insert / update', description: 'Append to primary or overflow pages, then split the next pointed bucket when primary-page load exceeds 0.75.' },
        { kind: 'search-value', title: 'Look up a key', description: 'Follow this structure\'s hash locations and return the stored value or exact absence.' },
        { kind: 'delete-value', title: 'Delete a key', description: 'Remove the record and unlink any empty overflow page; retain split progress.' },
        { kind: 'clear', title: 'Clear', description: 'Remove all stored entries according to this structure\'s allocation policy.' },
      ]
      case 'perfect-hash-table': return [
        { kind: 'build-values', title: 'Build key set', description: 'Construct a complete static set of distinct keys with collision-free second-level tables.' },
        { kind: 'search-value', title: 'Contains key', description: 'Compute two hash locations and compare the complete stored key.' },
        { kind: 'clear', title: 'Clear', description: 'Discard both levels of the static perfect hash set.' },
      ]
      case 'consistent-hashing-ring': return [
        { kind: 'insert', title: 'Add a server', description: 'Insert three virtual tokens and transfer only their predecessor intervals to the new server.' },
        { kind: 'search-value', title: 'Route a key', description: 'Find the first clockwise token at or after the key hash, wrapping through zero.' },
        { kind: 'delete-value', title: 'Remove a server', description: 'Remove its tokens; only keys owned by that server change owner.' },
        { kind: 'inspect-storage', title: 'Inspect sample ownership', description: 'Route ten sample keys and show their current server assignments.' },
        { kind: 'clear', title: 'Clear ring', description: 'Remove all physical servers and virtual tokens.' },
      ]
      default: return null
    }
  }
}
