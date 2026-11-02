import type { ActionChoice } from './ActionCatalog.ts'
import type { StructureKind } from './Scene.ts'

export class LinearActionCatalog {
  public static getActions(kind: StructureKind): readonly ActionChoice[] | null {
    switch (kind) {
      case 'skip-list': return [
        { kind: 'insert', title: 'Insert a key', description: 'Locate predecessors, reject duplicates, and splice a seeded tower into sorted levels.' },
        { kind: 'search-value', title: 'Search by key', description: 'Move right through smaller keys, then descend to level zero.' },
        { kind: 'delete-value', title: 'Delete a key', description: 'Locate a key and bypass its tower at every occupied level.' },
        { kind: 'clear', title: 'Clear', description: 'Release each key and tower while retaining the head sentinel.' },
      ]
      case 'unrolled-linked-list': return [
        { kind: 'insert', title: 'Insert at index', description: 'Locate the block, split it if full, and shift values only within that block.' },
        { kind: 'search-value', title: 'Search by value', description: 'Scan block values in logical order and stop at the first match.' },
        { kind: 'delete-value', title: 'Delete by value', description: 'Remove the first match, unlink an empty block, and merge a following block when it fits.' },
        { kind: 'clear', title: 'Clear', description: 'Release the linked blocks one at a time.' },
      ]
      case 'xor-linked-list': return [
        { kind: 'insert-end', title: 'Append a value', description: 'Append a node using simulated address XOR links and a cached tail.' },
        { kind: 'search-value', title: 'Search by value', description: 'Carry the previous simulated address to decode each next address.' },
        { kind: 'delete-value', title: 'Delete by value', description: 'Find the first match and XOR its address out of both neighbors.' },
        { kind: 'clear', title: 'Clear', description: 'Unlink heads and release their simulated addresses one at a time.' },
      ]
      case 'gap-buffer': return [
        { kind: 'insert', title: 'Insert text', description: 'Move the gap to an index, grow it if needed, and write text into it.' },
        { kind: 'move-gap', title: 'Move the gap', description: 'Move characters across the gap until its start equals the selected logical index.' },
        { kind: 'delete-index', title: 'Delete text', description: 'Move the gap to the starting index and extend it across the selected span.' },
        { kind: 'search-value', title: 'Search for text', description: 'Compare candidate text spans using logical indices that skip the gap.' },
        { kind: 'clear', title: 'Clear', description: 'Move the gap to the beginning and release every text character into it.' },
      ]
      case 'rope': return [
        { kind: 'insert', title: 'Insert text', description: 'Split at the index, build text chunks, and AVL-join prefix, text, and suffix.' },
        { kind: 'concatenate', title: 'Concatenate text', description: 'Build chunks for appended text and join them to the existing rope.' },
        { kind: 'search-index', title: 'Read character by index', description: 'Compare the index with cached left weights to find its leaf and local offset.' },
        { kind: 'delete-index', title: 'Delete text', description: 'Split around the selected span and join the surviving sides.' },
        { kind: 'clear', title: 'Clear', description: 'Drop the rope root while immutable nodes remain available to existing snapshots.' },
      ]
      case 'bit-set': return [
        { kind: 'set-bit', title: 'Set a bit', description: 'Compute the packed-word index and OR its bit mask.' },
        { kind: 'clear-bit', title: 'Clear a bit', description: 'Compute the packed-word index and AND the complemented mask.' },
        { kind: 'toggle-bit', title: 'Toggle a bit', description: 'Compute the packed-word index and XOR its bit mask.' },
        { kind: 'search-index', title: 'Test a bit', description: 'Read one indexed bit using its word and mask.' },
        { kind: 'clear', title: 'Clear all bits', description: 'Zero each packed word while preserving the logical number of bits.' },
      ]
      case 'sparse-array': return [
        { kind: 'update-index', title: 'Set an entry', description: 'Store a value at an index without allocating intervening holes.' },
        { kind: 'search-index', title: 'Read an entry', description: 'Return an explicitly stored value or implicit zero for a hole.' },
        { kind: 'delete-index', title: 'Delete an entry', description: 'Remove one stored index without shifting any remaining indices.' },
        { kind: 'clear', title: 'Clear stored entries', description: 'Release stored entries while preserving the logical array length.' },
      ]
      case 'free-list': return [
        { kind: 'allocate', title: 'Allocate a slot', description: 'Pop the free-chain head and store a value; reject exhaustion.' },
        { kind: 'release', title: 'Release a slot', description: 'Return an allocated slot to the free head; reject double release.' },
        { kind: 'clear', title: 'Release all slots', description: 'Inspect all pool slots and return every allocated one to the free chain.' },
      ]
      default: return null
    }
  }
}
