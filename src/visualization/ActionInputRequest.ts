import { StructuredPriorityInput } from './StructuredPriorityInput.ts'
import { StructuredLinearInput } from './StructuredLinearInput.ts'
import { GraphActionInput } from './GraphActionInput.ts'
import type { GraphInputContext } from './GraphActionInput.ts'
import { GraphCatalog } from './GraphCatalog.ts'
import type { StructuredActionInput } from './StructuredActionInput.ts'
import { ActionCatalog } from './ActionCatalog.ts'
import type { ActionKind } from './ActionCatalog.ts'
import type { StructureKind } from './Scene.ts'
import { StructuredTreeInput } from './StructuredTreeInput.ts'

export class ActionInputRequest {
  public readonly structured: StructuredActionInput | null
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
  public readonly pairInput: boolean
  public readonly secondLabel: string
  public readonly secondHint: string

  private constructor(structure: StructureKind, action: ActionKind, title: string, description: string, size: number, context?: GraphInputContext) {
    this.structure = structure
    this.structured = StructuredPriorityInput.create(structure, action) ?? StructuredLinearInput.create(structure, action, size) ?? GraphActionInput.create(structure, action, size, context) ?? StructuredTreeInput.create(structure, action, size)
    this.action = action
    this.title = title
    this.rangeInput = action === 'range-from-value'
    this.pairInput = structure === 'hash-map' && action === 'insert'
    this.secondLabel = this.pairInput ? 'Value' : 'Maximum key (inclusive)'
    this.secondHint = this.pairInput ? 'The value stored for this key. An existing key is updated.' : 'Both boundary keys are included in the range.'
    const indexInput = action === 'search-index'
    const keyInput = structure === 'binary-tree' || structure === 'avl-tree' ||
      structure === 'red-black-tree' || structure === 'b-tree' || structure === 'b-plus-tree' || structure === 'hash-map'
    this.minimum = this.structured?.fields[0].minimum ?? (indexInput ? 0 : Number.MIN_SAFE_INTEGER)
    this.maximum = this.structured?.fields[0].maximum ?? (indexInput ? size - 1 : Number.MAX_SAFE_INTEGER)
    this.available = this.structured ? this.structured.available : !indexInput || size > 0
    this.label = this.structured?.fields[0].label ?? (this.rangeInput ? 'Minimum key (inclusive)' : indexInput ? 'Index (zero-based)' : keyInput ? 'Key' : 'Value')
    const name = structure === 'array' ? 'array' : 'list'
    const elements = structure === 'array' ? 'elements' : 'nodes'
    this.hint = this.structured ? this.structured.hint : indexInput
      ? size > 0
        ? `The ${name} has ${size} ${elements}. Choose an index from 0 to ${size - 1}.`
        : `The ${name} is empty. Insert a value before searching by index.`
      : 'Enter a whole number.'

    this.description = action === 'insert-middle'
      ? `Insert the new value at index ${Math.floor(size / 2)}, the middle of the current ${name}.`
      : description
  }

  public static supportsStructure(structure: StructureKind): boolean {
    if (StructuredPriorityInput.supports(structure) || StructuredLinearInput.supports(structure) || GraphCatalog.supports(structure) || StructuredTreeInput.supports(structure)) return true
    switch (structure) {
      case 'hash-map':
      case 'hash-set':
      case 'bloom-filter':
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
    if (StructuredPriorityInput.supports(structure)) return StructuredPriorityInput.create(structure, action) !== null
    if (StructuredLinearInput.supports(structure)) return StructuredLinearInput.create(structure, action, 0) !== null
    if (GraphCatalog.supports(structure)) {
      return ActionCatalog.getActions(structure).some((choice) => choice.kind === action) && GraphActionInput.create(structure, action, 0) !== null
    }
    if (StructuredTreeInput.supports(structure)) {
      for (const choice of ActionCatalog.getActions(structure)) {
        if (choice.kind === action) return StructuredTreeInput.create(structure, action, 0) !== null
      }
      return false
    }
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

  public static create(structure: StructureKind, action: ActionKind, size: number, context?: GraphInputContext): ActionInputRequest | null {
    if (!Number.isSafeInteger(size) || size < 0) throw new RangeError('Structure size must be a nonnegative safe integer')
    if (!this.requiresInput(structure, action)) return null
    for (const choice of ActionCatalog.getActions(structure)) {
      if (choice.kind === action) return new ActionInputRequest(structure, action, choice.title, choice.description, size, context)
    }
    return null
  }

  public acceptsDraft(input: string): boolean {
    if (this.structured) return this.structured.acceptsDraft(this.structured.fields[0], input)
    return this.action === 'search-index' ? /^\d*$/.test(input) : /^-?\d*$/.test(input)
  }

  public validate(input: string): string | null {
    if (!this.available) return this.hint
    if (this.structured) {
      const name = this.structured.fields[0].name
      return this.structured.validate({ [name]: input })[name] ?? null
    }
    const text = input.trim()
    if (!/^-?\d+$/.test(text)) return 'Enter a whole number.'
    const value = Number(text)
    if (!Number.isSafeInteger(value)) return 'This number is too large to store exactly.'
    if (value < this.minimum || value > this.maximum)
      return `Enter a whole number from ${this.minimum} to ${this.maximum}.`
    return null
  }

  public validateUpperBound(minimum: string, maximum: string): string | null {
    if (this.pairInput) return this.validate(maximum)
    if (!this.rangeInput) return null
    const error = this.validate(maximum)
    if (error) return error
    if (!this.validate(minimum) && Number(maximum) < Number(minimum))
      return 'Maximum key must be greater than or equal to the minimum key.'
    return null
  }
}
