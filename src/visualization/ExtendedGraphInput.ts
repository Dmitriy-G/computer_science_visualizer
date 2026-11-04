import { ExtendedGraphActionCatalog } from './ExtendedGraphActionCatalog.ts'
import { Hypergraph } from '../components/AdvancedDataStructures/SpecializedGraphs/Hypergraph/Hypergraph.ts'
import type { ActionKind } from './ActionCatalog.ts'
import type { StructureKind } from './Scene.ts'
import type { GraphInputContext } from './GraphActionInput.ts'
import type { ActionInputField, StructuredActionInput } from './StructuredActionInput.ts'
import type { LinearInputValues } from './LinearModel.ts'

export class ExtendedGraphInput implements StructuredActionInput {
  public readonly fields: readonly ActionInputField[]
  public readonly available: boolean
  public readonly hint: string
  private readonly structure: StructureKind
  private readonly action: ActionKind
  private readonly context: GraphInputContext | undefined

  private constructor(structure: StructureKind, action: ActionKind, size: number, context?: GraphInputContext) {
    this.structure = structure
    this.action = action
    this.context = context
    const value: ActionInputField = { name: 'value', label: structure === 'tree-graph' && action === 'delete-value' ? 'Leaf vertex value' : 'Vertex value' }
    const from: ActionInputField = { name: 'from', label: action === 'max-flow' ? 'Source vertex value' : 'From vertex value' }
    const to: ActionInputField = { name: 'to', label: action === 'max-flow' ? 'Sink vertex value' : 'To / successor vertex value' }
    const capacity: ActionInputField = { name: 'capacity', label: 'Nonnegative capacity', minimum: 0 }
    const edge: ActionInputField = { name: 'edge', label: structure === 'hypergraph' ? 'Hyperedge number (h0 → enter 0)' : 'Edge number (e0 → enter 0)', minimum: 0 }
    if (action === 'add-vertex' && structure === 'bipartite-graph') this.fields = [value, { name: 'partition', label: 'Partition: 0 = L, 1 = R', minimum: 0, maximum: 1 }]
    else if (action === 'add-vertex' && structure === 'tree-graph') this.fields = [value, { name: 'parent', label: 'Parent value (first vertex: its own value)' }]
    else if (action === 'add-vertex' && structure === 'functional-graph') this.fields = [value, { name: 'successor', label: 'Successor value (existing vertex or the new vertex itself)' }]
    else if (action === 'add-edge' && structure === 'hypergraph') this.fields = [{ name: 'members', label: 'Member vertex values (comma-separated)', text: true }]
    else if (action === 'add-edge') this.fields = structure === 'flow-network' ? [from, to, capacity] : [from, to]
    else if (action === 'max-flow') this.fields = [from, to]
    else if (action === 'update-capacity') this.fields = [edge, capacity]
    else if (action === 'remove-edge') this.fields = [edge]
    else if (action === 'breadth-first' || action === 'depth-first') this.fields = [{ name: 'start', label: 'Starting vertex value' }]
    else this.fields = [value]
    const needsVertices = action === 'add-edge' || action === 'breadth-first' || action === 'depth-first' || action === 'max-flow'
    const needsEdge = action === 'remove-edge' || action === 'update-capacity'
    this.available = !(needsVertices && size < (structure === 'hypergraph' || action === 'max-flow' ? 2 : 1)) && !(needsEdge && (context ? context.edges.length === 0 : size === 0))
    this.hint = !this.available ? needsEdge ? 'No stored edges exist. Add an edge or reset the example first.' : 'Add enough vertices before this operation.'
      : structure === 'bipartite-graph' ? 'Vertices have fixed partitions. Edges must cross L/R; same-side edges are rejected.'
      : structure === 'tree-graph' ? 'Attach a new leaf to an existing parent. For the first vertex, enter the same value in both fields. Delete only a leaf.'
      : structure === 'hypergraph' ? 'A hyperedge contains 2–16 distinct existing values. Enter comma-separated safe integers; use h-numbers for deletion.'
      : structure === 'flow-network' ? 'Use finite nonnegative safe-integer capacities. Source and sink must differ. Editing resets all flows; maximum flow uses exact arithmetic.'
      : structure === 'functional-graph' ? 'Every vertex keeps exactly one successor. New vertices may point to themselves; setting a successor replaces the old edge.'
      : structure === 'complete-graph' ? 'Every new vertex is connected to all existing vertices. Edges are maintained automatically.'
      : 'Use whole safe integers and existing endpoint values. These directed storage examples allow self-loops and reject duplicate pairs.'
  }

  public static supports(structure: StructureKind): boolean { return ExtendedGraphActionCatalog.getActions(structure) !== null }
  public static create(structure: StructureKind, action: ActionKind, size: number, context?: GraphInputContext): ExtendedGraphInput | null {
    if (action === 'clear' || action === 'inspect-storage') return null
    const actions = ExtendedGraphActionCatalog.getActions(structure)
    if (actions) for (const choice of actions) if (choice.kind === action) return new ExtendedGraphInput(structure, action, size, context)
    return null
  }

  public acceptsDraft(field: ActionInputField, text: string): boolean {
    if (field.text) return /^[\d,\s-]*$/.test(text) && text.length <= 320
    return field.minimum === 0 ? /^\d*$/.test(text) : /^-?\d*$/.test(text)
  }

  public validate(values: Readonly<Record<string, string>>): Readonly<Record<string, string>> {
    const errors: Record<string, string> = {}
    for (const field of this.fields) {
      const text = values[field.name] ?? ''
      if (!this.available) {
        errors[field.name] = this.hint
        continue
      }
      if (field.text) {
        try {
          const members = Hypergraph.parseMembers(text)
          if (this.context && members.some((member) => !this.context!.vertices.includes(member))) errors[field.name] = 'Every member must be an existing vertex value.'
        } catch { errors[field.name] = 'Enter 2–16 distinct comma-separated safe-integer vertex values.' }
      } else if (!/^-?\d+$/.test(text)) errors[field.name] = 'Enter a whole number.'
      else {
        const value = Number(text)
        if (!Number.isSafeInteger(value)) errors[field.name] = 'This number is too large to store exactly.'
        else if (value < (field.minimum ?? Number.MIN_SAFE_INTEGER) || value > (field.maximum ?? Number.MAX_SAFE_INTEGER)) errors[field.name] = `Enter a number from ${field.minimum ?? Number.MIN_SAFE_INTEGER} to ${field.maximum ?? Number.MAX_SAFE_INTEGER}.`
        else if (this.context) {
          if (['from', 'to', 'start'].includes(field.name) && !this.context.vertices.includes(value)) errors[field.name] = 'Choose an existing vertex value.'
          if (field.name === 'edge' && !this.context.edges.includes(value)) errors[field.name] = 'Choose an existing edge number.'
          if (field.name === 'value' && this.action === 'add-vertex' && this.context.vertices.includes(value)) errors[field.name] = 'This vertex value already exists.'
          if (field.name === 'parent' && (this.context.vertices.length ? !this.context.vertices.includes(value) : value !== Number(values.value))) errors[field.name] = this.context.vertices.length ? 'Choose an existing parent value.' : 'The first vertex must name itself as parent.'
          if (field.name === 'successor' && value !== Number(values.value) && !this.context.vertices.includes(value)) errors[field.name] = 'Choose an existing successor or the new vertex itself.'
        }
      }
    }
    if (this.action === 'max-flow' && !errors.from && !errors.to && Number(values.from) === Number(values.to)) errors.to = 'Source and sink must be different.'
    if (this.structure === 'flow-network' && this.action === 'add-edge' && !errors.from && !errors.to && Number(values.from) === Number(values.to)) errors.to = 'Flow-network self-loops are not supported.'
    if (this.structure === 'bipartite-graph' && this.action === 'add-edge' && this.context?.partitions && !errors.from && !errors.to && this.context.partitions[String(Number(values.from))] === this.context.partitions[String(Number(values.to))]) errors.to = 'Choose a vertex in the opposite partition.'
    return errors
  }

  public parse(values: Readonly<Record<string, string>>): LinearInputValues {
    if (Object.keys(this.validate(values)).length) throw new TypeError('Invalid graph input')
    const parsed: Record<string, string | number> = {}
    for (const field of this.fields) parsed[field.name] = field.text ? values[field.name] : Number(values[field.name])
    return parsed
  }
}
