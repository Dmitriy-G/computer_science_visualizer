import type { StructureKind } from './Scene.ts'
import type { ActionKind } from './ActionCatalog.ts'
import type { ActionInputField, StructuredActionInput } from './StructuredActionInput.ts'
import type { LinearInputValues } from './LinearModel.ts'
import { HashActionCatalog } from './HashActionCatalog.ts'
import { PerfectHashTable } from '../components/DataStructuresOverview/HashBased/PerfectHashTable/PerfectHashTable.ts'

export class StructuredHashInput implements StructuredActionInput {
  public readonly fields: readonly ActionInputField[]
  public readonly available = true
  public readonly hint: string
  private constructor(kind: StructureKind, action: ActionKind) {
    if (kind === 'perfect-hash-table' && action === 'build-values') this.fields = [{ name: 'keys', label: 'Distinct keys (comma-separated)', text: true }]
    else if (kind === 'consistent-hashing-ring') this.fields = [{ name: 'key', label: action === 'search-value' ? 'Key to route' : 'Server ID' }]
    else this.fields = action === 'insert' ? [{ name: 'key', label: 'Key' }, { name: 'value', label: 'Value' }] : [{ name: 'key', label: 'Key' }]
    this.hint = kind === 'perfect-hash-table' ? 'Build a static set of 1 to 64 distinct whole safe-integer keys. Lookup checks membership; changing the set requires a complete rebuild.'
      : kind === 'consistent-hashing-ring' ? 'Use a whole safe-integer server ID or routing key. Each server gets three virtual tokens; the ring supports up to sixteen physical servers. Routing does not store the key.'
      : 'Enter whole safe integers. Negative keys and values are allowed. Existing keys update their value without adding an entry; examples support at most 64 entries.'
  }
  public static supports(kind: StructureKind): boolean { return HashActionCatalog.getActions(kind) !== null }
  public static create(kind: StructureKind, action: ActionKind): StructuredHashInput | null {
    const actions = HashActionCatalog.getActions(kind)
    if (!actions || action === 'clear' || action === 'inspect-storage') return null
    for (const choice of actions) if (choice.kind === action) return new StructuredHashInput(kind, action)
    return null
  }
  public acceptsDraft(field: ActionInputField, value: string): boolean {
    return field.text ? /^[\d,\s-]*$/.test(value) && value.length <= 1400 : /^-?\d*$/.test(value)
  }
  public validate(values: Readonly<Record<string, string>>): Readonly<Record<string, string>> {
    const errors: Record<string, string> = {}
    for (const field of this.fields) {
      const text = values[field.name] ?? ''
      if (field.text) {
        try { PerfectHashTable.parseKeys(text) }
        catch { errors[field.name] = 'Enter 1 to 64 distinct comma-separated whole safe integers.' }
      } else if (!/^-?\d+$/.test(text) || !Number.isSafeInteger(Number(text))) errors[field.name] = 'Enter a whole safe integer.'
    }
    return errors
  }
  public parse(values: Readonly<Record<string, string>>): LinearInputValues {
    if (Object.keys(this.validate(values)).length) throw new TypeError('Invalid hash operation input')
    const parsed: Record<string, string | number> = {}
    for (const field of this.fields) parsed[field.name] = field.text ? values[field.name] : Number(values[field.name])
    return parsed
  }
}
