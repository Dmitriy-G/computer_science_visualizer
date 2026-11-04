import { PriorityActionCatalog } from './PriorityActionCatalog.ts'
import { PriorityModel } from './PriorityModel.ts'
import type { ActionKind } from './ActionCatalog.ts'
import type { StructureKind } from './Scene.ts'
import type { ActionInputField, StructuredActionInput } from './StructuredActionInput.ts'
import type { LinearInputValues } from './LinearModel.ts'

export class StructuredPriorityInput implements StructuredActionInput {
  public readonly fields: readonly ActionInputField[]
  public readonly available = true
  public readonly hint: string

  private constructor(structure: StructureKind, action: ActionKind) {
    const value: ActionInputField = { name: 'value', label: action === 'decrease-key' ? 'New key (must not increase)' : 'Value' }
    const priority: ActionInputField = { name: 'priority', label: 'Priority (smaller numbers leave first)' }
    const key: ActionInputField = { name: 'key', label: 'Unique integer key' }
    if (action === 'meld') this.fields = [{ name: 'values', label: 'Donor values (comma-separated)', text: true }]
    else if (action === 'decrease-key') this.fields = [{ name: 'id', label: 'Visible node ID', minimum: 1 }, value]
    else if (structure === 'indexed-priority-queue') this.fields = action === 'delete-value' ? [key] : [key, priority]
    else if (structure === 'priority-queue') this.fields = [value, priority]
    else this.fields = [value]
    this.hint = action === 'meld' ? 'Supply 1 to 16 comma-separated safe integers. The animation builds this donor heap, then melds it; the total may not exceed 64 nodes.'
      : action === 'decrease-key' ? 'Use a numeric node ID shown in the diagram. A missing ID or an increased key is rejected without changing the heap.'
      : structure === 'indexed-priority-queue' ? 'Keys are unique safe integers. Existing priorities can increase or decrease; missing-key updates/deletions and duplicate insertions are rejected.'
      : structure === 'priority-queue' ? 'Values and priorities are safe integers. Smaller numeric priorities leave first; equal priorities retain insertion order.'
      : structure === 'monotonic-queue' ? 'Push one safe integer into the ten-arrival sliding window. Expired and dominated candidates are removed automatically.'
      : 'Enter a whole safe integer. Duplicates are allowed. Heap examples are limited to 64 nodes.'
  }

  public static supports(structure: StructureKind): boolean { return PriorityActionCatalog.getActions(structure) !== null }

  public static create(structure: StructureKind, action: ActionKind): StructuredPriorityInput | null {
    if (action === 'peek' || action === 'clear' || action === 'extract-min' || action === 'extract-max' || action === 'dequeue') return null
    const actions = PriorityActionCatalog.getActions(structure)
    if (actions) for (const choice of actions) if (choice.kind === action) return new StructuredPriorityInput(structure, action)
    return null
  }

  public acceptsDraft(field: ActionInputField, text: string): boolean {
    if (field.name === 'values') return /^[\d,\s-]*$/.test(text) && text.length <= 320
    return field.minimum === 1 ? /^\d*$/.test(text) : /^-?\d*$/.test(text)
  }

  public validate(values: Readonly<Record<string, string>>): Readonly<Record<string, string>> {
    const errors: Record<string, string> = {}
    for (const field of this.fields) {
      const text = values[field.name] ?? ''
      if (field.name === 'values') {
        try { PriorityModel.parseValues(text) }
        catch { errors[field.name] = 'Enter 1 to 16 comma-separated whole safe integers.' }
      } else if (!/^-?\d+$/.test(text)) errors[field.name] = 'Enter a whole number.'
      else {
        const number = Number(text)
        if (!Number.isSafeInteger(number)) errors[field.name] = 'This number is too large to store exactly.'
        else if (number < (field.minimum ?? Number.MIN_SAFE_INTEGER)) errors[field.name] = `Enter a whole number of at least ${field.minimum}.`
      }
    }
    return errors
  }

  public parse(values: Readonly<Record<string, string>>): LinearInputValues {
    if (Object.keys(this.validate(values)).length) throw new TypeError('Invalid action input')
    const parsed: Record<string, string | number> = {}
    for (const field of this.fields) parsed[field.name] = field.text ? values[field.name] : Number(values[field.name])
    return parsed
  }
}
