import type { ActionChoice } from './ActionCatalog.ts'
import type { StructureKind } from './Scene.ts'

export class PriorityActionCatalog {
  public static getActions(kind: StructureKind): readonly ActionChoice[] | null {
    switch (kind) {
      case 'priority-queue': return [
        { kind: 'enqueue', title: 'Enqueue with priority', description: 'Insert a value/priority pair; smaller priorities leave first and ties retain FIFO order.' },
        { kind: 'dequeue', title: 'Dequeue highest priority', description: 'Remove the smallest numeric priority, using insertion order to resolve ties.' },
        { kind: 'peek', title: 'Peek highest priority', description: 'Read the next value and priority without removing it.' },
        { kind: 'clear', title: 'Clear', description: 'Release the stored entries one at a time.' },
      ]
      case 'binary-max-heap': return [
        { kind: 'insert', title: 'Insert a value', description: 'Append a leaf and sift it upward until every parent is at least as large.' },
        { kind: 'extract-max', title: 'Extract maximum', description: 'Remove the maximum root, replace it with the last leaf, and sift downward.' },
        { kind: 'peek', title: 'Peek maximum', description: 'Read the maximum at the root without changing the heap.' },
        { kind: 'clear', title: 'Clear', description: 'Release the stored entries one at a time.' },
      ]
      case 'binomial-heap': return [
        { kind: 'insert', title: 'Insert a value', description: 'Merge a singleton root list and link equal-degree trees like binary carries.' },
        { kind: 'extract-min', title: 'Extract minimum', description: 'Remove the cached minimum root, reverse its children, and consolidate the forest.' },
        { kind: 'peek', title: 'Peek minimum', description: 'Read the minimum root without removing it.' },
        { kind: 'meld', title: 'Meld a donor heap', description: 'Build a donor from the supplied values and merge the forests by degree.' },
        { kind: 'clear', title: 'Clear', description: 'Drop the root references and defer collection of unreachable nodes.' },
      ]
      case 'fibonacci-heap': return [
        { kind: 'insert', title: 'Insert a value', description: 'Add a singleton to the circular root list without consolidating degrees.' },
        { kind: 'extract-min', title: 'Extract minimum', description: 'Promote the minimum’s children and consolidate roots with equal degrees.' },
        { kind: 'decrease-key', title: 'Decrease a key by ID', description: 'Locate a stable handle, lower its key, and perform cuts and cascading loss-mark repair.' },
        { kind: 'peek', title: 'Peek minimum', description: 'Read the minimum root without removing it.' },
        { kind: 'meld', title: 'Meld a donor heap', description: 'Build a donor, splice root rings, and transfer its stable-handle entries.' },
        { kind: 'clear', title: 'Clear', description: 'Drop the root references and defer collection of unreachable nodes.' },
      ]
      case 'pairing-heap': return [
        { kind: 'insert', title: 'Insert a value', description: 'Meld a singleton by making the larger root the smaller root’s first child.' },
        { kind: 'extract-min', title: 'Extract minimum', description: 'Pair adjacent children left-to-right, then combine the resulting heaps right-to-left.' },
        { kind: 'peek', title: 'Peek minimum', description: 'Read the minimum root without removing it.' },
        { kind: 'meld', title: 'Meld a donor heap', description: 'Build the donor with constant-time links and join it to the current root.' },
        { kind: 'clear', title: 'Clear', description: 'Drop the root references and defer collection of unreachable nodes.' },
      ]
      case 'leftist-heap': return [
        { kind: 'insert', title: 'Insert a value', description: 'Meld a singleton and repair null-path ranks.' },
        { kind: 'extract-min', title: 'Extract minimum', description: 'Remove the root and meld its two child heaps.' },
        { kind: 'peek', title: 'Peek minimum', description: 'Read the minimum root without removing it.' },
        { kind: 'meld', title: 'Meld a donor heap', description: 'Build a donor and recursively meld its root with the current heap.' },
        { kind: 'clear', title: 'Clear', description: 'Drop the root references and defer collection of unreachable nodes.' },
      ]
      case 'skew-heap': return [
        { kind: 'insert', title: 'Insert a value', description: 'Meld a singleton and repair the shape with unconditional child swaps.' },
        { kind: 'extract-min', title: 'Extract minimum', description: 'Remove the root and meld its two child heaps.' },
        { kind: 'peek', title: 'Peek minimum', description: 'Read the minimum root without removing it.' },
        { kind: 'meld', title: 'Meld a donor heap', description: 'Build a donor and recursively meld its root with the current heap.' },
        { kind: 'clear', title: 'Clear', description: 'Drop the root references and defer collection of unreachable nodes.' },
      ]
      case 'indexed-priority-queue': return [
        { kind: 'insert', title: 'Insert a key / priority', description: 'Reject duplicate keys, append a leaf, and maintain the inverse position Map during sift-up.' },
        { kind: 'change-priority', title: 'Change a priority', description: 'Find a key directly, then sift upward for a decrease or downward for an increase.' },
        { kind: 'delete-value', title: 'Delete by key', description: 'Use the inverse index to replace the selected key with the last leaf and repair heap order.' },
        { kind: 'extract-min', title: 'Extract minimum', description: 'Remove the minimum key, repair the heap, and remove its inverse mapping.' },
        { kind: 'peek', title: 'Peek minimum', description: 'Read the minimum root without removing it.' },
        { kind: 'clear', title: 'Clear', description: 'Release heap leaves and their inverse-position entries.' },
      ]
      case 'monotonic-queue': return [
        { kind: 'enqueue', title: 'Push next window value', description: 'Expire old front indices, remove dominated back candidates, and append the next arrival.' },
        { kind: 'peek', title: 'Peek window maximum', description: 'Read the front candidate, which is the maximum of the current window.' },
        { kind: 'clear', title: 'Clear window', description: 'Release the candidate endpoints and replace the ten-slot history buffer.' },
      ]
      default: return null
    }
  }
}
