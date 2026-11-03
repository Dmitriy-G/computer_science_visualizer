import type { ActionKind } from './ActionCatalog.ts'
import type { StructureKind } from './Scene.ts'
import type { LinearInputValues } from './LinearModel.ts'
import type { ActionInputField, StructuredActionInput } from './StructuredActionInput.ts'
import { SetUnionActionCatalog } from './SetUnionActionCatalog.ts'

export class StructuredSetUnionInput implements StructuredActionInput {
  public readonly fields: readonly ActionInputField[]
  public readonly available = true
  public readonly hint: string

  private constructor(kind: StructureKind, action: ActionKind) {
    this.fields = action === 'union' || action === 'connected'
      ? [{ name: 'first', label: 'First existing member' }, { name: 'second', label: 'Second existing member' }]
      : kind === 'interval-set' && action !== 'search-value'
        ? [{ name: 'minimum', label: 'Minimum (inclusive)' }, { name: 'maximum', label: 'Maximum (inclusive)' }]
        : [{ name: 'value', label: kind === 'ordered-set' ? 'Key' : 'Value' }]
    this.hint = kind === 'disjoint-set'
      ? 'Use whole safe integers. Find, union, and connectivity require existing members; a missing member rejects the complete request. Find paths are compressed. At most 64 members.'
      : kind === 'interval-set'
        ? 'Closed integer intervals include both endpoints. Maximum must be at least minimum. Adjacent intervals merge. At most 64 stored intervals; a split exceeding the limit is rejected unchanged.'
        : kind === 'multiset'
          ? 'Use whole safe integers. Add and remove change one occurrence. The bag holds at most 64 total occurrences, including duplicates.'
          : 'Use whole safe-integer keys. Duplicates are rejected; lower bound returns the first key at least the input, or no result. At most 64 unique keys.'
  }

  public static supports(kind: StructureKind): boolean { return SetUnionActionCatalog.getActions(kind) !== null }

  public static create(kind: StructureKind, action: ActionKind): StructuredSetUnionInput | null {
    if (action === 'clear') return null
    for (const choice of SetUnionActionCatalog.getActions(kind) ?? []) if (choice.kind === action) return new StructuredSetUnionInput(kind, action)
    return null
  }

  public acceptsDraft(_field: ActionInputField, value: string): boolean { return /^-?\d*$/.test(value) }

  public validate(values: Readonly<Record<string, string>>): Readonly<Record<string, string>> {
    const errors: Record<string, string> = {}
    for (const field of this.fields) {
      const text = values[field.name] ?? ''
      if (!/^-?\d+$/.test(text)) errors[field.name] = 'Enter a whole number.'
      else if (!Number.isSafeInteger(Number(text))) errors[field.name] = 'Enter a safely representable whole number.'
    }
    if (this.fields[0].name === 'minimum' && !errors.minimum && !errors.maximum && Number(values.maximum) < Number(values.minimum)) errors.maximum = 'Maximum must be at least minimum.'
    return errors
  }

  public parse(values: Readonly<Record<string, string>>): LinearInputValues {
    if (Object.keys(this.validate(values)).length) throw new TypeError('Invalid set/union input')
    const parsed: Record<string, number> = {}
    for (const field of this.fields) parsed[field.name] = Number(values[field.name])
    return parsed
  }
}
