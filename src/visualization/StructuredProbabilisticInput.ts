import type { StructureKind } from './Scene.ts'
import type { ActionKind } from './ActionCatalog.ts'
import type { ActionInputField, StructuredActionInput } from './StructuredActionInput.ts'
import type { LinearInputValues } from './LinearModel.ts'
import { ProbabilisticActionCatalog } from './ProbabilisticActionCatalog.ts'

export class StructuredProbabilisticInput implements StructuredActionInput {
  public readonly fields: readonly ActionInputField[]
  public readonly available = true
  public readonly hint: string

  private constructor(kind: StructureKind, action: ActionKind) {
    this.fields = kind === 'count-min-sketch' && action === 'insert'
      ? [{ name: 'value', label: 'Value' }, { name: 'weight', label: 'Positive weight', minimum: 1 }]
      : [{ name: 'value', label: 'Value' }]
    this.hint = action === 'delete-value'
      ? 'Remove one recorded insertion. Unrecorded values are rejected even if approximate membership is positive; an extra exact-key ledger guards deletion only.'
      : kind === 'count-min-sketch'
        ? 'Use a whole safe-integer value. Updates require a positive safe-integer weight; only positive updates preserve the no-underestimation guarantee.'
        : kind === 'reservoir-sampling-buffer'
          ? 'Enter a whole safe integer. Each arrival counts separately, including duplicates and values that are skipped by the five-slot sample.'
          : 'Enter a whole safe integer. Duplicate adds count as separate operations; filter counters and fingerprints may have capacity limits. Membership and cardinality answers are approximate.'
  }

  public static supports(kind: StructureKind): boolean { return ProbabilisticActionCatalog.getActions(kind) !== null }

  public static create(kind: StructureKind, action: ActionKind): StructuredProbabilisticInput | null {
    const actions = ProbabilisticActionCatalog.getActions(kind)
    if (!actions || action === 'clear' || action === 'estimate-cardinality' || action === 'inspect-storage') return null
    for (const choice of actions) if (choice.kind === action) return new StructuredProbabilisticInput(kind, action)
    return null
  }

  public acceptsDraft(_field: ActionInputField, value: string): boolean { return /^-?\d*$/.test(value) }

  public validate(values: Readonly<Record<string, string>>): Readonly<Record<string, string>> {
    const errors: Record<string, string> = {}
    for (const field of this.fields) {
      const text = values[field.name] ?? ''
      if (!/^-?\d+$/.test(text) || !Number.isSafeInteger(Number(text))) errors[field.name] = 'Enter a whole safe integer.'
      else if (field.minimum !== undefined && Number(text) < field.minimum) errors[field.name] = `Enter a whole number of at least ${field.minimum}.`
    }
    return errors
  }

  public parse(values: Readonly<Record<string, string>>): LinearInputValues {
    if (Object.keys(this.validate(values)).length) throw new TypeError('Invalid probabilistic operation input')
    const result: Record<string, number> = {}
    for (const field of this.fields) result[field.name] = Number(values[field.name])
    return result
  }
}
