import type { ActionChoice } from './ActionCatalog.ts'
import type { StructureKind } from './Scene.ts'

export class NumericalActionCatalog {
  public static supports(kind: StructureKind): boolean {
    return kind === 'dense-tensor' || kind === 'sparse-coo' || kind === 'sparse-csc' || kind === 'numerical-csr' || kind === 'grid-2d'
  }

  public static getActions(kind: StructureKind): readonly ActionChoice[] | null {
    if (!this.supports(kind)) return null
    const choices: ActionChoice[] = [
      { kind: 'build-values', title: 'Build from values', description: 'Choose a shape and replace the example with row-major numeric values.' },
      { kind: 'search-index', title: 'Read coordinates', description: 'Locate a value by its zero-based coordinates.' },
      { kind: 'update-index', title: 'Set coordinates', description: 'Store a replacement value at the selected coordinates.' },
    ]
    if (kind === 'dense-tensor') choices.push({ kind: 'reshape', title: 'Reshape', description: 'Change dimensions and strides while preserving the contiguous value order.' })
    if (kind === 'sparse-coo') choices.push(
      { kind: 'insert', title: 'Append triplet', description: 'Append a row, column, and value; duplicate coordinates are allowed.' },
      { kind: 'coalesce', title: 'Coalesce', description: 'Sort coordinates, sum duplicate triplets, and remove zero sums.' },
    )
    if (kind !== 'dense-tensor' && kind !== 'grid-2d') choices.push({ kind: 'multiply-vector', title: 'Multiply by vector', description: 'Compute A * x from stored numerical entries with exact integer sums.' })
    choices.push(
      { kind: 'inspect-storage', title: 'Inspect storage', description: 'Visit the actual shape, indices, pointers, strides, and value arrays.' },
      { kind: 'clear', title: kind === 'dense-tensor' || kind === 'grid-2d' ? 'Zero all cells' : 'Clear stored entries', description: 'Preserve dimensions and make every logical value zero.' },
    )
    return choices
  }
}
