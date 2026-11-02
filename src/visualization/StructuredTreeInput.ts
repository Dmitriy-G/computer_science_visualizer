import type { ActionKind } from './ActionCatalog.ts'
import type { StructureKind } from './Scene.ts'
import type { TreeInputValues } from './AdditionalTreeModel.ts'
import { ASTParser } from '../components/DataStructuresOverview/Trees/AST/ASTParser.ts'

import type { ActionInputField as TreeInputField } from './StructuredActionInput.ts'
export type { ActionInputField as TreeInputField } from './StructuredActionInput.ts'

export class StructuredTreeInput {
  public readonly fields: readonly TreeInputField[]
  public readonly available: boolean
  public readonly hint: string

  private constructor(structure: StructureKind, action: ActionKind, size: number) {
    const index: TreeInputField = { name: 'index', label: 'Index (zero-based)', minimum: 0, maximum: size - 1 }
    const value: TreeInputField = { name: 'value', label: 'Value' }
    this.available = !(structure === 'segment-tree' || structure === 'fenwick-tree') || size > 0
    this.hint = !this.available ? 'The array is empty; reset the structure to load its example.'
      : structure === 'ast' ? 'Use integers, +, -, *, /, parentheses, and unary signs; up to 128 characters. Example: -(8 + 2) * (9 - 3) / 2.'
      : structure === 'trie' ? 'Use 1 to 32 lowercase letters a-z. Word ends are distinct from prefixes.'
      : structure === 'segment-tree' || structure === 'fenwick-tree' ? `Array indices are zero-based, from 0 to ${size - 1}. Both range endpoints are included.`
      : structure === 'r-tree' ? 'Use whole-number coordinates; minimum must not exceed maximum on either axis. Touching boundaries intersect.'
      : 'Enter whole safe integers. Negative keys and values are allowed.'
    if (structure === 'ast') this.fields = [{ name: 'expression', label: 'Expression', text: true, expression: true }]
    else if (structure === 'trie') this.fields = [{ name: 'word', label: action === 'starts-with' ? 'Prefix' : 'Word', text: true }]
    else if (structure === 'heap') this.fields = [value]
    else if (structure === 'segment-tree' || structure === 'fenwick-tree') {
      if (action === 'range-sum') this.fields = [
        { name: 'minimum', label: 'Minimum index (inclusive)', minimum: 0, maximum: size - 1 },
        { name: 'maximum', label: 'Maximum index (inclusive)', minimum: 0, maximum: size - 1 },
      ]
      else if (action === 'prefix-sum') this.fields = [index]
      else this.fields = [index, action === 'add-index' ? { name: 'delta', label: 'Delta to add' } : value]
    } else if (structure === 'r-tree') {
      this.fields = action === 'delete-value' ? [{ name: 'id', label: 'Rectangle ID', minimum: 1 }] : [
        { name: 'minX', label: 'Minimum X' }, { name: 'minY', label: 'Minimum Y' },
        { name: 'maxX', label: 'Maximum X' }, { name: 'maxY', label: 'Maximum Y' },
      ]
    } else this.fields = action === 'insert' ? [{ name: 'key', label: 'Key' }, value] : [{ name: 'key', label: 'Key' }]
  }

  public static supports(structure: StructureKind): boolean {
    return structure === 'trie' || structure === 'heap' || structure === 'segment-tree' || structure === 'fenwick-tree' || structure === 'r-tree' || structure === 'lsm-tree' || structure === 'ast'
  }

  public static create(structure: StructureKind, action: ActionKind, size: number): StructuredTreeInput | null {
    if (structure === 'ast' && action !== 'build-expression') return null
    if (!this.supports(structure) || action === 'clear' || action === 'peek' || action === 'extract-min' || action === 'flush' || action === 'compact') return null
    return new StructuredTreeInput(structure, action, size)
  }

  public acceptsDraft(field: TreeInputField, value: string): boolean {
    if (field.expression) return /^[0-9+\-*/()\s]*$/.test(value) && value.length <= ASTParser.maximumLength
    return field.text ? /^[a-z]*$/.test(value) && value.length <= 32 : field.minimum === 0 || field.minimum === 1 ? /^\d*$/.test(value) : /^-?\d*$/.test(value)
  }

  public validate(values: Readonly<Record<string, string>>): Readonly<Record<string, string>> {
    const errors: Record<string, string> = {}
    for (const field of this.fields) {
      const text = values[field.name] ?? ''
      if (!this.available) errors[field.name] = this.hint
      else if (field.expression) {
        const error = ASTParser.validate(text)
        if (error) errors[field.name] = error
      } else if (field.text) {
        if (!/^[a-z]{1,32}$/.test(text)) errors[field.name] = 'Enter 1 to 32 lowercase letters a-z.'
      } else if (!/^-?\d+$/.test(text)) errors[field.name] = 'Enter a whole number.'
      else {
        const number = Number(text)
        if (!Number.isSafeInteger(number)) errors[field.name] = 'This number is too large to store exactly.'
        else if (number < (field.minimum ?? Number.MIN_SAFE_INTEGER) || number > (field.maximum ?? Number.MAX_SAFE_INTEGER)) errors[field.name] = `Enter a number from ${field.minimum ?? Number.MIN_SAFE_INTEGER} to ${field.maximum ?? Number.MAX_SAFE_INTEGER}.`
      }
    }
    for (const [minimum, maximum] of [['minimum', 'maximum'], ['minX', 'maxX'], ['minY', 'maxY']]) {
      if (values[minimum] !== undefined && values[maximum] !== undefined && !errors[minimum] && !errors[maximum] && Number(values[minimum]) > Number(values[maximum])) errors[maximum] = 'Maximum must be greater than or equal to minimum.'
    }
    return errors
  }

  public parse(values: Readonly<Record<string, string>>): TreeInputValues {
    if (Object.keys(this.validate(values)).length) throw new TypeError('Invalid action input')
    const result: Record<string, string | number> = {}
    for (const field of this.fields) result[field.name] = field.text ? values[field.name] : Number(values[field.name])
    return result
  }
}
