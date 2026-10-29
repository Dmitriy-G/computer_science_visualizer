import type { StructureKind } from './Scene.ts'

export type ActionKind = 'insert-middle' | 'insert-start' | 'insert-end' | 'insert' | 'search-value' | 'search-index' | 'delete-value'

export interface ActionChoice {
  readonly kind: ActionKind
  readonly title: string
  readonly description: string
}

export class ActionCatalog {
  public static getActions(structure: StructureKind): readonly ActionChoice[] {
    const actions: ActionChoice[] = []
    if (structure === 'linked-list' || structure === 'array') {
      actions.push(
        { kind: 'insert-middle', title: 'Insert in the middle', description: 'Insert at the zero-based index floor(length / 2).' },
        { kind: 'insert-start', title: 'Insert at the start', description: 'Insert a value before the first element.' },
        { kind: 'insert-end', title: 'Insert at the end', description: 'Append a value after the last element.' },
      )
    }
    if (structure === 'binary-tree') actions.push({ kind: 'insert', title: 'Insert a value', description: 'Compare from the root and connect a new leaf. Equal values go right.' })
    actions.push({ kind: 'search-value', title: 'Search by value', description: 'Follow the search path to the first matching value.' })
    if (structure === 'linked-list' || structure === 'array') actions.push({ kind: 'search-index', title: 'Search by index', description: 'Find an element using its zero-based index.' })
    actions.push({ kind: 'delete-value', title: 'Delete by value', description: 'Remove the first match and reconnect the remaining structure.' })
    return actions
  }
}
