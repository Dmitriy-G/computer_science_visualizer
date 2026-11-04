import { NumericalModel } from './NumericalModel.ts'
import { NumericalActionCatalog } from './NumericalActionCatalog.ts'
import type { ActionKind } from './ActionCatalog.ts'
import type { StructureKind } from './Scene.ts'
import type { ActionInputField, StructuredActionInput } from './StructuredActionInput.ts'
import type { LinearInputValues } from './LinearModel.ts'

export class StructuredNumericalInput implements StructuredActionInput {
  public readonly fields: readonly ActionInputField[]
  public readonly available = true
  public readonly hint: string
  private readonly structure: StructureKind
  private readonly action: ActionKind
  private readonly shape: readonly number[] | undefined

  private constructor(structure: StructureKind, action: ActionKind, shape?: readonly number[]) {
    this.structure = structure
    this.action = action
    this.shape = shape ? [...shape] : undefined
    const dimensions: ActionInputField = { name: 'shape', label: 'Shape (comma-separated dimensions)', text: true }
    if (action === 'build-values') this.fields = [dimensions, { name: 'values', label: 'Values (row-major, comma-separated)', text: true }]
    else if (action === 'reshape') this.fields = [dimensions]
    else if (action === 'multiply-vector') this.fields = [{ name: 'vector', label: 'Vector values (comma-separated)', text: true }]
    else {
      const fields: ActionInputField[] = [{ name: 'coordinates', label: structure === 'dense-tensor' ? 'Coordinates (comma-separated, zero-based)' : 'Row, column (zero-based)', text: true }]
      if (action === 'update-index' || action === 'insert') fields.push({ name: 'value', label: 'Value' })
      this.fields = fields
    }
    const dense = structure === 'dense-tensor' || structure === 'grid-2d'
    const bounds = `${structure === 'dense-tensor' ? 'Use 1 to 4 dimensions.' : 'Use exactly two dimensions: rows, columns.'} Each dimension is 1 to 8, with at most 64 logical cells.`
    let operationHint = 'Coordinates are zero-based and must lie within the current shape.'
    if (action === 'build-values') operationHint = `${bounds} Enter one row-major value per cell.${dense ? '' : ' Zero inputs are omitted from sparse storage.'}`
    else if (action === 'reshape') operationHint = `${bounds} Preserve the current cell count and value order.`
    else if (action === 'multiply-vector') operationHint = 'Enter one vector value per matrix column. Products and sums use exact integer arithmetic.'
    else if (action === 'insert') operationHint += ' Append retains duplicates and explicit zeros, up to 64 triplets.'
    else if (action === 'update-index' && !dense) operationHint += structure === 'sparse-coo' ? ' Replace all matching triplets; zero removes the coordinate.' : ' Zero removes the coordinate from packed storage.'
    this.hint = `${shape ? `Current shape: [${shape.join(', ')}]. ` : ''}Use whole safe integers. ${operationHint}`
  }

  public static supports(structure: StructureKind): boolean { return NumericalActionCatalog.supports(structure) }

  public static create(structure: StructureKind, action: ActionKind, shape?: readonly number[]): StructuredNumericalInput | null {
    const choices = NumericalActionCatalog.getActions(structure)
    if (!choices || action === 'clear' || action === 'inspect-storage' || action === 'coalesce') return null
    for (const choice of choices) if (choice.kind === action) return new StructuredNumericalInput(structure, action, shape)
    return null
  }

  public acceptsDraft(field: ActionInputField, value: string): boolean {
    return field.text ? value.length <= 1400 && /^[\d,\s-]*$/.test(value) : /^-?\d*$/.test(value)
  }

  public validate(values: Readonly<Record<string, string>>): Readonly<Record<string, string>> {
    const errors: Record<string, string> = {}
    const lists: Record<string, number[]> = {}
    for (const field of this.fields) {
      try {
        lists[field.name] = NumericalModel.list(values[field.name], field.label, field.name === 'shape' || field.name === 'coordinates' ? 4 : field.name === 'vector' ? 8 : field.name === 'value' ? 1 : 64)
        if (!field.text && lists[field.name].length !== 1) throw new TypeError('Enter one whole safe integer')
        if (field.name === 'shape') NumericalModel.validateShape(lists.shape, this.structure === 'dense-tensor')
        if (field.name === 'coordinates') {
          if (this.shape) NumericalModel.validateCoordinates(lists.coordinates, this.shape)
          else {
            if (this.structure !== 'dense-tensor' && lists.coordinates.length !== 2) throw new RangeError('Enter row, column')
            for (const coordinate of lists.coordinates) if (coordinate < 0 || coordinate > 7) throw new RangeError('Coordinates must be between 0 and 7')
          }
        }
      } catch (error) {
        errors[field.name] = error instanceof Error ? error.message : 'Invalid input'
      }
    }
    if (this.action === 'build-values' && !errors.shape && !errors.values) {
      const size = NumericalModel.validateShape(lists.shape, this.structure === 'dense-tensor')
      if (lists.values.length !== size) errors.values = `Enter exactly ${size} row-major values.`
    }
    if (this.action === 'reshape' && this.shape && !errors.shape) {
      let size = 1
      for (const dimension of this.shape) size *= dimension
      if (NumericalModel.validateShape(lists.shape, true) !== size) errors.shape = `Reshape must preserve ${size} cells.`
    }
    if (this.action === 'multiply-vector' && this.shape && !errors.vector && lists.vector.length !== this.shape[1]) errors.vector = `Enter exactly ${this.shape[1]} vector values.`
    return errors
  }

  public parse(values: Readonly<Record<string, string>>): LinearInputValues {
    if (Object.keys(this.validate(values)).length) throw new TypeError('Invalid numerical input')
    const parsed: Record<string, string | number> = {}
    for (const field of this.fields) parsed[field.name] = field.text ? values[field.name].trim() : Number(values[field.name])
    return parsed
  }
}
