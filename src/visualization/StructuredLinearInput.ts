import { LinearActionCatalog } from './LinearActionCatalog.ts'
import type { ActionKind } from './ActionCatalog.ts'
import type { StructureKind } from './Scene.ts'
import type { ActionInputField, StructuredActionInput } from './StructuredActionInput.ts'
import type { LinearInputValues } from './LinearModel.ts'

export class StructuredLinearInput implements StructuredActionInput {
  public readonly fields: readonly ActionInputField[]
  public readonly available: boolean
  public readonly hint: string
  private readonly size: number

  private constructor(structure: StructureKind, action: ActionKind, size: number) {
    this.size = size
    const text: ActionInputField = { name: 'text', label: action === 'search-value' ? 'Text to find' : 'Text', text: true }
    const value: ActionInputField = { name: 'value', label: structure === 'skip-list' ? 'Key' : 'Value' }
    const insertion = action === 'insert' || action === 'move-gap'
    const index: ActionInputField = { name: 'index', label: structure === 'free-list' ? 'Slot ID' : 'Index (zero-based)', minimum: 0,
      maximum: structure === 'free-list' ? 9 : size - (insertion ? 0 : 1) }
    const textStructure = structure === 'gap-buffer' || structure === 'rope'
    if (structure === 'skip-list' || structure === 'xor-linked-list' || action === 'allocate' || structure === 'unrolled-linked-list' && action !== 'insert') this.fields = [value]
    else if (structure === 'unrolled-linked-list') this.fields = [index, value]
    else if (textStructure && (action === 'search-value' || action === 'concatenate')) this.fields = [text]
    else if (textStructure && action === 'insert') this.fields = [index, text]
    else if (textStructure && action === 'delete-index') this.fields = [index, { name: 'count', label: 'Character count', minimum: 1, maximum: size }]
    else if (structure === 'sparse-array' && action === 'update-index') this.fields = [index, value]
    else this.fields = [index]
    this.available = true
    for (const field of this.fields) {
      if (field.maximum !== undefined && field.minimum !== undefined && field.maximum < field.minimum) this.available = false
    }
    this.hint = !this.available ? 'No valid index exists in the empty structure. Insert text or reset the example first.'
      : textStructure ? `Use 1 to 32 printable ASCII characters per text request; spaces are preserved. The current text has ${size} characters. Deletion must remain within the text. Maximum text length: 256.`
      : structure === 'free-list' ? 'The pool has slots 0 to 9. Allocation rejects a full pool; releasing an already free slot is rejected without changing the chain.'
      : structure === 'bit-set' ? `Bit indices range from 0 to ${size - 1}; the fixed bit count is preserved.`
      : structure === 'sparse-array' ? `Logical indices range from 0 to ${size - 1}. Holes read as zero. Stored zero is distinct from an absent entry; at most 64 entries are shown.`
      : structure === 'skip-list' ? 'Enter a whole safe-integer key. Duplicate keys are rejected. This example allows up to 64 keys.'
      : 'Enter whole safe integers. Values may repeat; list examples are limited to 64 values.'
  }

  public static supports(structure: StructureKind): boolean { return LinearActionCatalog.getActions(structure) !== null }

  public static create(structure: StructureKind, action: ActionKind, size: number): StructuredLinearInput | null {
    const actions = LinearActionCatalog.getActions(structure)
    if (!actions || action === 'clear') return null
    for (const choice of actions) if (choice.kind === action) return new StructuredLinearInput(structure, action, size)
    return null
  }

  public acceptsDraft(field: ActionInputField, text: string): boolean {
    return field.text ? /^[\x20-\x7e]{0,32}$/.test(text) : field.minimum !== undefined && field.minimum >= 0 ? /^\d*$/.test(text) : /^-?\d*$/.test(text)
  }

  public validate(values: Readonly<Record<string, string>>): Readonly<Record<string, string>> {
    const errors: Record<string, string> = {}
    for (const field of this.fields) {
      const text = values[field.name] ?? ''
      if (!this.available) errors[field.name] = this.hint
      else if (field.text) {
        if (!/^[\x20-\x7e]{1,32}$/.test(text)) errors[field.name] = 'Enter 1 to 32 printable ASCII characters.'
      } else if (!/^-?\d+$/.test(text)) errors[field.name] = 'Enter a whole number.'
      else {
        const value = Number(text)
        if (!Number.isSafeInteger(value)) errors[field.name] = 'This number is too large to store exactly.'
        else if (value < (field.minimum ?? Number.MIN_SAFE_INTEGER) || value > (field.maximum ?? Number.MAX_SAFE_INTEGER)) errors[field.name] = `Enter a number from ${field.minimum ?? Number.MIN_SAFE_INTEGER} to ${field.maximum ?? Number.MAX_SAFE_INTEGER}.`
      }
    }
    if (values.count !== undefined && !errors.count && !errors.index && Number(values.count) > this.size - Number(values.index)) errors.count = 'The selected span extends past the end of the text.'
    return errors
  }

  public parse(values: Readonly<Record<string, string>>): LinearInputValues {
    if (Object.keys(this.validate(values)).length) throw new TypeError('Invalid action input')
    const parsed: Record<string, string | number> = {}
    for (const field of this.fields) parsed[field.name] = field.text ? values[field.name] : Number(values[field.name])
    return parsed
  }
}
