import type { StructureKind } from './Scene.ts'

export type ActionKind = 'insert-middle' | 'insert-start' | 'insert-end' | 'insert' | 'search-value' | 'search-index' | 'delete-value' | 'push' | 'pop' | 'peek' | 'clear' | 'enqueue' | 'dequeue' | 'push-front' | 'push-back' | 'pop-front' | 'pop-back' | 'peek-front' | 'peek-back' | 'delete-start' | 'delete-end' | 'range-from-value'

export interface ActionChoice {
  readonly kind: ActionKind
  readonly title: string
  readonly description: string
}

export class ActionCatalog {
  public static getActions(structure: StructureKind): readonly ActionChoice[] {
    if (structure === 'binary-tree' || structure === 'avl-tree' || structure === 'red-black-tree' || structure === 'b-tree' || structure === 'b-plus-tree') {
      const actions: ActionChoice[] = [
        { kind: 'insert', title: 'Insert a key', description: structure === 'binary-tree' ? 'Compare from the root and connect a new leaf. Duplicate keys are rejected.' : 'Insert one unique key and restore balance or page occupancy.' },
        { kind: 'search-value', title: 'Search by key', description: 'Follow ordered comparisons to a matching key.' },
        { kind: 'delete-value', title: 'Delete a key', description: structure === 'binary-tree' ? 'Remove a key and reconnect the tree while preserving search order.' : 'Remove a key and restore balance or page occupancy.' },
        { kind: 'clear', title: 'Clear', description: 'Release every node or page and empty the tree.' },
      ]
      if (structure === 'b-plus-tree') actions.push({ kind: 'range-from-value', title: 'Range from key', description: 'Report all records between two inclusive keys through linked leaves.' })
      return actions
    }
    if (structure === 'queue') {
      return [
        { kind: 'enqueue', title: 'Enqueue', description: 'Add a value at the rear.' },
        { kind: 'dequeue', title: 'Dequeue', description: 'Remove and return the front value.' },
        { kind: 'peek', title: 'Peek (front)', description: 'Read the front without removing it.' },
        { kind: 'clear', title: 'Clear', description: 'Release all nodes from front to rear.' },
        { kind: 'search-value', title: 'Search by value', description: 'Find the first match from the front without changing order.' },
      ]
    }
    if (structure === 'deque') {
      return [
        { kind: 'push-front', title: 'Push front', description: 'Add a value before the front.' },
        { kind: 'push-back', title: 'Push back', description: 'Add a value after the back.' },
        { kind: 'pop-front', title: 'Pop front', description: 'Remove and return the front value.' },
        { kind: 'pop-back', title: 'Pop back', description: 'Remove and return the back value.' },
        { kind: 'peek-front', title: 'Peek front', description: 'Read the front without removing it.' },
        { kind: 'peek-back', title: 'Peek back', description: 'Read the back without removing it.' },
        { kind: 'clear', title: 'Clear', description: 'Release every node from front to back.' },
        { kind: 'search-value', title: 'Search by value', description: 'Find the first match from the front without changing order.' },
      ]
    }
    if (structure === 'doubly-linked-list') {
      return [
        { kind: 'insert-middle', title: 'Insert in the middle', description: 'Insert at floor(length / 2) and connect both pointers.' },
        { kind: 'insert-start', title: 'Insert at the start', description: 'Insert a new head and connect next and prev.' },
        { kind: 'insert-end', title: 'Insert at the end', description: 'Insert a new tail and connect next and prev.' },
        { kind: 'delete-start', title: 'Delete at the start', description: 'Remove the head and clear the new head prev pointer.' },
        { kind: 'delete-end', title: 'Delete at the end', description: 'Remove the tail and clear the new tail next pointer.' },
        { kind: 'delete-value', title: 'Delete by value', description: 'Find the first match and reconnect next and prev.' },
        { kind: 'search-value', title: 'Search by value', description: 'Follow next pointers to the first match.' },
        { kind: 'search-index', title: 'Search by index', description: 'Follow next or prev from the nearer end.' },
        { kind: 'clear', title: 'Clear', description: 'Release nodes one at a time and empty both end pointers.' },
      ]
    }
    if (structure === 'circular-buffer') {
      return [
        { kind: 'enqueue', title: 'Enqueue', description: 'Write into the next free slot; reject when full.' },
        { kind: 'dequeue', title: 'Dequeue', description: 'Read and release the oldest slot, then advance read.' },
        { kind: 'peek', title: 'Peek (oldest)', description: 'Read the oldest value without advancing read.' },
        { kind: 'clear', title: 'Clear', description: 'Release occupied slots in FIFO order.' },
        { kind: 'search-value', title: 'Search by value', description: 'Search occupied slots in logical FIFO order, wrapping as needed.' },
      ]
    }
    if (structure === 'stack') {
      return [
        { kind: 'push', title: 'Push', description: 'Place a new value on top of the stack.' },
        { kind: 'pop', title: 'Pop', description: 'Remove and return the top value.' },
        { kind: 'peek', title: 'Peek (top)', description: 'Read the top value without removing it.' },
        { kind: 'clear', title: 'Clear', description: 'Remove every value from top to bottom.' },
        { kind: 'search-value', title: 'Search by value', description: 'Find the first match from the top without changing the stack.' },
      ]
    }
    const actions: ActionChoice[] = []
    if (structure === 'linked-list' || structure === 'array') {
      actions.push(
        { kind: 'insert-middle', title: 'Insert in the middle', description: 'Insert at the zero-based index floor(length / 2).' },
        { kind: 'insert-start', title: 'Insert at the start', description: 'Insert a value before the first element.' },
        { kind: 'insert-end', title: 'Insert at the end', description: 'Append a value after the last element.' },
      )
    }
    actions.push({ kind: 'search-value', title: 'Search by value', description: 'Follow the search path to the first matching value.' })
    if (structure === 'linked-list' || structure === 'array') actions.push({ kind: 'search-index', title: 'Search by index', description: 'Find an element using its zero-based index.' })
    actions.push({ kind: 'delete-value', title: 'Delete by value', description: 'Remove the first match and reconnect the remaining structure.' })
    actions.push({
      kind: 'clear',
      title: 'Clear',
      description: structure === 'array' ? 'Replace the selected array with an empty fixed array.' : structure === 'graph' ? 'Release every edge and vertex, including disconnected components.' : 'Release every node and empty the structure.',
    })
    return actions
  }
}
