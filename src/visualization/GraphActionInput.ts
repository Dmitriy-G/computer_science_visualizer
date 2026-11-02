import type { ActionKind } from './ActionCatalog.ts'
import type { GraphInputValues } from './GraphModel.ts'
import type { StructureKind } from './Scene.ts'
import type { ActionInputField, StructuredActionInput } from './StructuredActionInput.ts'
import { GraphCatalog } from './GraphCatalog.ts'

export interface GraphInputContext {
  readonly vertices: readonly number[]
  readonly edges: readonly number[]
  readonly partitions?: Readonly<Record<string, number>>
}

export class GraphActionInput implements StructuredActionInput {
  public readonly fields: readonly ActionInputField[]
  public readonly available: boolean
  public readonly hint: string
  private readonly context: GraphInputContext | undefined
  private readonly action: ActionKind

  private constructor(structure: StructureKind, action: ActionKind, size: number, context?: GraphInputContext) {
    this.context = context
    this.action = action
    const edge = { name: 'edge', label: 'Edge number (e0 → enter 0)', minimum: 0 }
    const weight = { name: 'weight', label: 'Nonnegative edge weight', minimum: 0 }
    if (action === 'add-edge' || action === 'shortest-path') {
      const fields: ActionInputField[] = [{ name: 'from', label: 'Source vertex value' }, { name: 'to', label: 'Target vertex value' }]
      if (action === 'add-edge' && structure === 'weighted-graph') fields.push(weight)
      this.fields = fields
    } else if (action === 'remove-edge') this.fields = [edge]
    else if (action === 'update-weight') this.fields = [edge, weight]
    else if (action === 'breadth-first' || action === 'depth-first') this.fields = [{ name: 'start', label: 'Starting vertex value' }]
    else this.fields = [{ name: 'value', label: 'Vertex value' }]
    const needsVertex = action === 'add-edge' || action === 'shortest-path' || action === 'breadth-first' || action === 'depth-first'
    const needsEdge = action === 'remove-edge' || action === 'update-weight'
    this.available = !(needsVertex && size === 0) && !(needsEdge && (context ? context.edges.length === 0 : size === 0))
    this.hint = !this.available ? needsEdge ? 'There are no edges. Add an edge first.' : 'There are no vertices. Add a vertex first.'
      : `${needsEdge ? 'Use the numeric part of a visible edge ID. ' : 'Use whole safe integers. Endpoints must already exist. '}New vertex values must be unique.${structure === 'dag' ? ' Edges that create cycles are rejected.' : ''}${structure === 'weighted-graph' ? ' Weights may be zero; negative weights are not allowed.' : ''}`
  }

  public static create(structure: StructureKind, action: ActionKind, size: number, context?: GraphInputContext): GraphActionInput | null {
    if (!GraphCatalog.supports(structure) || action === 'clear' || action === 'topological-sort') return null
    return new GraphActionInput(structure, action, size, context)
  }

  public acceptsDraft(field: ActionInputField, value: string): boolean { return field.minimum === 0 ? /^\d*$/.test(value) : /^-?\d*$/.test(value) }

  public validate(values: Readonly<Record<string, string>>): Readonly<Record<string, string>> {
    const errors: Record<string, string> = {}
    for (const field of this.fields) {
      const text = values[field.name] ?? ''
      const value = Number(text)
      if (!this.available) errors[field.name] = this.hint
      else if (!/^-?\d+$/.test(text)) errors[field.name] = 'Enter a whole number.'
      else if (!Number.isSafeInteger(value)) errors[field.name] = 'This number is too large to store exactly.'
      else if (value < (field.minimum ?? Number.MIN_SAFE_INTEGER)) errors[field.name] = 'Enter a nonnegative whole number.'
      else if (this.context) {
        if ((field.name === 'from' || field.name === 'to' || field.name === 'start') && !this.context.vertices.includes(value)) errors[field.name] = 'Choose a vertex value that exists in this graph.'
        if (field.name === 'edge' && !this.context.edges.includes(value)) errors[field.name] = 'Choose an edge number that exists in this graph.'
        if (this.action === 'add-vertex' && this.context.vertices.includes(value)) errors[field.name] = 'This vertex value already exists.'
      }
    }
    return errors
  }

  public parse(values: Readonly<Record<string, string>>): GraphInputValues {
    if (Object.keys(this.validate(values)).length) throw new TypeError('Invalid graph input')
    const result: Record<string, number> = {}
    for (const field of this.fields) result[field.name] = Number(values[field.name])
    return result
  }
}
