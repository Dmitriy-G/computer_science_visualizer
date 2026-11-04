import { StoredEdgeGraph } from '../../../../visualization/StoredEdgeGraph.ts'
import { LinearModel } from '../../../../visualization/LinearModel.ts'
import type { LinearInputValues, LinearObserver, LinearResult } from '../../../../visualization/LinearModel.ts'
import type { ActionKind } from '../../../../visualization/ActionCatalog.ts'

export class FunctionalGraph extends StoredEdgeGraph {
  public readonly kind = 'functional-graph'
  public readonly directed = true
  public get hint(): string { return 'Every vertex has exactly one outgoing successor, including possible self-loops. Set successor replaces the existing outgoing edge. Deleting a vertex redirects its surviving predecessors to themselves, preserving a total successor function.' }
  protected empty(): FunctionalGraph { return new FunctionalGraph() }

  public static createDefault(): FunctionalGraph {
    const graph = new FunctionalGraph()
    for (let value = 10; value <= 100; value += 10) graph.perform('add-vertex', { value, successor: value })
    for (const [from, to] of [[10, 20], [20, 30], [30, 10], [40, 20], [50, 60], [60, 50], [70, 60], [80, 90], [90, 100], [100, 80]]) graph.perform('add-edge', { from, to })
    return graph
  }

  protected storedVertexRemoved(id: string, index: number): void {
    this.edges = this.edges.filter((edge) => edge.from !== id)
    for (let position = 0; position < this.edges.length; position += 1) {
      const edge = this.edges[position]
      if (edge.to === id) this.edges[position] = { ...edge, to: edge.from }
    }
    super.storedVertexRemoved(id, index)
  }

  protected perform(action: ActionKind, input: LinearInputValues, observer?: LinearObserver): LinearResult {
    if (action === 'remove-edge') throw new RangeError('A functional vertex must keep one outgoing edge')
    if (action === 'add-vertex') {
      const value = LinearModel.integer(input, 'value')
      const successorValue = LinearModel.integer(input, 'successor')
      const successor = successorValue === value ? null : this.vertex(successorValue)
      const vertex = this.appendVertex(value)
      this.putEdge(vertex, successor ?? vertex)
      this.emit(observer, vertex.id, `Add ${value} with successor ${successorValue}.`, 'add vertex and exactly one successor edge', [], 'NEW')
      return { description: `Added ${value} → ${successorValue}.`, activeId: vertex.id }
    }
    if (action === 'add-edge') {
      const from = this.vertex(LinearModel.integer(input, 'from'))
      const to = this.vertex(LinearModel.integer(input, 'to'))
      const index = this.edges.findIndex((edge) => edge.from === from.id)
      this.edges[index] = { ...this.edges[index], to: to.id }
      this.emit(observer, from.id, `Replace ${from.value}'s successor with ${to.value}; keep its outgoing edge ID.`, 'successor[from] = to', [this.edges[index].id])
      return { description: `${from.value} now points to ${to.value}.`, activeId: to.id }
    }
    if (action === 'read-successor') {
      const vertex = this.vertex(LinearModel.integer(input, 'value'))
      const edge = this.edges.find((item) => item.from === vertex.id)!
      const successor = this.vertices.find((item) => item.id === edge.to)!
      this.emit(observer, vertex.id, `Follow the unique successor of ${vertex.value}.`, 'return successor[vertex]', [edge.id])
      return { description: `Successor of ${vertex.value} is ${successor.value}.`, activeId: successor.id, value: successor.value, status: 'SUCCESSOR' }
    }
    return super.perform(action, input, observer)
  }
}
