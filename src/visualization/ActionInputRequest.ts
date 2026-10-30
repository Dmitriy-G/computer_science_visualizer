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

  private constructor(structure: StructureKind, action: ActionKind, title: string, description: string, size: number) {
    this.structure = structure
    this.action = action
    this.title = title
    const indexInput = action === 'search-index'
    this.minimum = indexInput ? 0 : Number.MIN_SAFE_INTEGER
    this.maximum = indexInput ? size - 1 : Number.MAX_SAFE_INTEGER
    this.available = !indexInput || size > 0
    this.label = indexInput ? 'Index (zero-based)' : 'Value'
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
      case 'search-value':
      case 'search-index':
      case 'delete-value':
      case 'push':
      case 'enqueue':
      case 'push-front':
      case 'push-back':
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
}
