import { StoredEdgeGraph } from '../../../../visualization/StoredEdgeGraph.ts'
import type { ExtendedVertex } from '../../../../visualization/ExtendedGraphModel.ts'
import { LinearModel } from '../../../../visualization/LinearModel.ts'
import type { LinearInputValues, LinearObserver, LinearResult } from '../../../../visualization/LinearModel.ts'
import type { ActionKind } from '../../../../visualization/ActionCatalog.ts'

export class TreeGraph extends StoredEdgeGraph {
  public readonly kind = 'tree-graph'
  public readonly directed = false
  protected empty(): TreeGraph { return new TreeGraph() }

  public static createDefault(): TreeGraph {
    const graph = new TreeGraph()
    for (let index = 0; index < 10; index += 1) graph.perform('add-vertex', { value: (index + 1) * 10, parent: index === 0 ? 10 : (Math.floor((index - 1) / 2) + 1) * 10 })
    return graph
  }

  protected canDelete(vertex: ExtendedVertex): void {
    if (this.getNeighbors(vertex.id).length > 1) throw new RangeError('Delete a leaf to preserve connectedness')
  }

  protected perform(action: ActionKind, input: LinearInputValues, observer?: LinearObserver): LinearResult {
    if (action === 'add-edge' || action === 'remove-edge') throw new RangeError('Attach or remove a leaf instead of editing tree edges directly')
    if (action !== 'add-vertex') return super.perform(action, input, observer)
    const value = LinearModel.integer(input, 'value')
    const parentValue = LinearModel.integer(input, 'parent')
    if (!this.length && parentValue !== value) throw new RangeError('The first vertex must name itself as parent')
    const parent = this.length ? this.vertex(parentValue) : null
    const vertex = this.appendVertex(value)
    if (parent) this.putEdge(parent, vertex)
    this.emit(observer, vertex.id, parent ? `Attach ${value} as a leaf of ${parent.value}.` : `Create the single root vertex ${value}.`, 'add new vertex; connect it once to its parent', [], 'NEW')
    return { description: `Tree graph has ${this.length} vertices and ${this.edgeCount} edges.`, activeId: vertex.id }
  }
}
