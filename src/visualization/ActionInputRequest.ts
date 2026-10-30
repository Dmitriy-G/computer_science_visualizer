import { ActionCatalog } from './ActionCatalog.ts'
import type { ActionKind } from './ActionCatalog.ts'
import type { StructureKind } from './Scene.ts'

export class ActionInputRequest {
  public readonly structure: StructureKind
  public readonly action: ActionKind
  public readonly title: string
  public readonly label: string
  public readonly description: string
  public readonly hint: string
  public readonly minimum: number
  public readonly maximum: number
  public readonly available: boolean
  public readonly rangeInput: boolean

  private constructor(structure: StructureKind, action: ActionKind, title: string, description: string, size: number) {
    this.structure = structure
    this.action = action
    this.title = title
    this.rangeInput = action === 'range-from-value'
    const indexInput = action === 'search-index'
    const keyInput = structure === 'binary-tree' || structure === 'avl-tree' ||
      structure === 'red-black-tree' || structure === 'b-tree' || structure === 'b-plus-tree'
    this.minimum = indexInput ? 0 : Number.MIN_SAFE_INTEGER
    this.maximum = indexInput ? size - 1 : Number.MAX_SAFE_INTEGER
    this.available = !indexInput || size > 0
    this.label = this.rangeInput ? 'Minimum key (inclusive)' : indexInput ? 'Index (zero-based)' : keyInput ? 'Key' : 'Value'
    const name = structure === 'array' ? 'array' : 'list'
    const elements = structure === 'array' ? 'elements' : 'nodes'
    this.hint = indexInput
      ? size > 0
        ? `The ${name} has ${size} ${elements}. Choose an index from 0 to ${size - 1}.`
        : `The ${name} is empty. Insert a value before searching by index.`
      : 'Enter a whole number.'

    this.description = action === 'insert-middle'
      ? `Insert the new value at index ${Math.floor(size / 2)}, the middle of the current ${name}.`
      : description
  }

  public static supportsStructure(structure: StructureKind): boolean {
    switch (structure) {
      case 'linked-list':
      case 'array':
      case 'stack':
      case 'queue':
      case 'deque':
      case 'doubly-linked-list':
      case 'circular-buffer':
      case 'binary-tree':
      case 'avl-tree':
      case 'red-black-tree':
      case 'b-tree':
      case 'b-plus-tree':
        return true
      default:
        return false
    }
  }

  public static requiresInput(structure: StructureKind, action: ActionKind): boolean {
    if (!this.supportsStructure(structure)) return false
    switch (action) {
      case 'insert-middle':
      case 'insert-start':
      case 'insert-end':
      case 'insert':
      case 'search-value':
      case 'search-index':
      case 'delete-value':
      case 'push':
      case 'enqueue':
      case 'push-front':
      case 'push-back':
      case 'range-from-value':
        for (const choice of ActionCatalog.getActions(structure)) {
          if (choice.kind === action) return true
        }
    }
    return false
  }

  public static create(structure: StructureKind, action: ActionKind, size: number): ActionInputRequest | null {
    if (!Number.isSafeInteger(size) || size < 0) throw new RangeError('Structure size must be a nonnegative safe integer')
    if (!this.requiresInput(structure, action)) return null
    for (const choice of ActionCatalog.getActions(structure)) {
      if (choice.kind === action) return new ActionInputRequest(structure, action, choice.title, choice.description, size)
    }
    return null
  }

  public acceptsDraft(input: string): boolean {
    return this.action === 'search-index' ? /^\d*$/.test(input) : /^-?\d*$/.test(input)
  }

  public validate(input: string): string | null {
    if (!this.available) return this.hint
    const text = input.trim()
    if (!/^-?\d+$/.test(text)) return 'Enter a whole number.'
    const value = Number(text)
    if (!Number.isSafeInteger(value)) return 'This number is too large to store exactly.'
    if (value < this.minimum || value > this.maximum)
      return `Enter a whole number from ${this.minimum} to ${this.maximum}.`
    return null
  }

  public validateUpperBound(minimum: string, maximum: string): string | null {
    if (!this.rangeInput) return null
    const error = this.validate(maximum)
    if (error) return error
    if (!this.validate(minimum) && Number(maximum) < Number(minimum))
      return 'Maximum key must be greater than or equal to the minimum key.'
    return null
  }
}
