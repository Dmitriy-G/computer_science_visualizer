import { AppliedActionCatalog } from './AppliedActionCatalog.ts'
import type { AppliedActionSpecification } from './AppliedActionCatalog.ts'
import type { ActionKind } from './ActionCatalog.ts'
import type { StructureKind } from './Scene.ts'
import type { LinearInputValues } from './LinearModel.ts'
import type { ActionInputField, StructuredActionInput } from './StructuredActionInput.ts'
import { PointData } from './PointData.ts'
import { InvertedIndex } from '../components/DataStructuresOverview/StringText/InvertedIndex/InvertedIndex.ts'

export class AppliedInput implements StructuredActionInput {
  public readonly available = true
  public readonly fields: readonly ActionInputField[]
  public readonly hint: string
  private readonly specification: AppliedActionSpecification

  private constructor(specification: AppliedActionSpecification) {
    this.specification = specification
    this.fields = specification.fields
    this.hint = specification.hint
  }

  public static supports(kind: StructureKind): boolean { return AppliedActionCatalog.getActions(kind) !== null }

  public static create(kind: StructureKind, action: ActionKind): AppliedInput | null {
    const specification = AppliedActionCatalog.getSpecification(kind, action)
    return specification?.fields.length ? new AppliedInput(specification) : null
  }

  public acceptsDraft(field: ActionInputField, value: string): boolean {
    if (!field.text) return /^-?\d*$/.test(value)
    switch (this.specification.format) {
      case 'points': return value.length <= 1536 && /^[\d,:\s-]*$/.test(value)
      case 'words': return value.length <= 128 && /^[a-z ]*$/.test(value)
      default: return value.length <= (this.specification.format?.endsWith('query') ? 32 : 64) && /^[acgt]*$/.test(value)
    }
  }

  public validate(values: Readonly<Record<string, string>>): Readonly<Record<string, string>> {
    const errors: Record<string, string> = {}
    for (const field of this.fields) {
      const text = values[field.name] ?? ''
      if (field.text) {
        try {
          if (this.specification.format === 'points') PointData.parse(text)
          else if (this.specification.format === 'words') InvertedIndex.words(text)
          else {
            const minimum = this.specification.format?.startsWith('dna5') ? 5 : 3
            const maximum = this.specification.format?.endsWith('query') ? 32 : 64
            if (!/^[acgt]+$/.test(text) || text.length < minimum || text.length > maximum) errors[field.name] = `Enter ${minimum} to ${maximum} lowercase a/c/g/t bases.`
          }
        } catch (error) {
          errors[field.name] = error instanceof Error ? error.message : 'Enter valid text.'
        }
      } else {
        const value = Number(text)
        if (!/^-?\d+$/.test(text) || !Number.isSafeInteger(value)) errors[field.name] = 'Enter a safely representable whole number.'
        else if (value < (field.minimum ?? Number.MIN_SAFE_INTEGER) || value > (field.maximum ?? Number.MAX_SAFE_INTEGER)) errors[field.name] = `Enter a number from ${field.minimum ?? Number.MIN_SAFE_INTEGER} to ${field.maximum ?? Number.MAX_SAFE_INTEGER}.`
      }
    }
    for (const [minimum, maximum] of [['minimum', 'maximum'], ['minX', 'maxX'], ['minY', 'maxY']]) {
      if (values[minimum] !== undefined && values[maximum] !== undefined && !errors[minimum] && !errors[maximum] && Number(values[minimum]) > Number(values[maximum])) errors[maximum] = 'Maximum must be at least minimum.'
    }
    return errors
  }

  public parse(values: Readonly<Record<string, string>>): LinearInputValues {
    if (Object.keys(this.validate(values)).length) throw new TypeError('Invalid structure input')
    const result: Record<string, string | number> = {}
    for (const field of this.fields) result[field.name] = field.text ? values[field.name] : Number(values[field.name])
    return result
  }
}
