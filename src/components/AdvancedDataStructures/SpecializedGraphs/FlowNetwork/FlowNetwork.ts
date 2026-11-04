import { StoredEdgeGraph } from '../../../../visualization/StoredEdgeGraph.ts'
import type { ExtendedEdge, ExtendedVertex } from '../../../../visualization/ExtendedGraphModel.ts'
import { LinearModel } from '../../../../visualization/LinearModel.ts'
import type { LinearInputValues, LinearObserver, LinearResult } from '../../../../visualization/LinearModel.ts'
import type { ActionKind } from '../../../../visualization/ActionCatalog.ts'

interface ResidualArc {
  readonly edge: ExtendedEdge
  readonly to: string
  readonly forward: boolean
}

interface FlowPredecessor extends ResidualArc {
  readonly from: string
}

export class FlowNetwork extends StoredEdgeGraph {
  public readonly kind = 'flow-network'
  public readonly directed = true
  private source: string | null = null
  private sink: string | null = null
  public get terminals(): readonly (string | null)[] { return [this.source, this.sink] }
  public get hint(): string { return 'Directed edges carry flow/capacity labels, with nonnegative integer capacities. Edmonds–Karp uses forward and reverse residual arcs and exact BigInt arithmetic. Graph edits reset all flows. Self-loops and duplicate directed edges are rejected; opposite directions are distinct.' }
  protected empty(): FlowNetwork { return new FlowNetwork() }

  public static createDefault(): FlowNetwork {
    const graph = new FlowNetwork()
    for (let value = 10; value <= 100; value += 10) graph.appendVertex(value)
    for (const [from, to, capacity] of [[10, 20, 10], [10, 30, 8], [20, 40, 5], [20, 50, 5], [30, 50, 8], [40, 60, 5], [50, 60, 4], [50, 70, 9], [60, 80, 9], [70, 90, 9], [80, 100, 9], [90, 100, 9]]) graph.perform('add-edge', { from, to, capacity })
    return graph
  }

  public clone(): FlowNetwork {
    const copy = new FlowNetwork()
    this.copyInto(copy)
    copy.source = this.source
    copy.sink = this.sink
    return copy
  }

  protected beforeMutation(): void {
    for (const edge of this.edges) edge.flow = 0n
    this.source = null
    this.sink = null
  }

  protected validateEdge(from: ExtendedVertex, to: ExtendedVertex): void {
    if (from.id === to.id) throw new RangeError('Flow-network self-loops are not supported')
    super.validateEdge(from, to)
  }

  private maximumFlow(from: ExtendedVertex, to: ExtendedVertex, observer?: LinearObserver): LinearResult {
    if (from.id === to.id) throw new RangeError('Source and sink must be different vertices')
    this.beforeMutation()
    this.source = from.id
    this.sink = to.id
    const adjacency = new Map<string, ResidualArc[]>()
    for (const vertex of this.vertices) adjacency.set(vertex.id, [])
    for (const edge of this.edges) {
      adjacency.get(edge.from)!.push({ edge, to: edge.to, forward: true })
      adjacency.get(edge.to)!.push({ edge, to: edge.from, forward: false })
    }
    let total = 0n
    while (true) {
      const previous = new Map<string, FlowPredecessor>()
      const seen = new Set([from.id])
      const queue = [from.id]
      for (let head = 0; head < queue.length && !seen.has(to.id); head += 1) {
        const id = queue[head]
        for (const arc of adjacency.get(id)!) {
          const residual = arc.forward ? BigInt(arc.edge.capacity!) - arc.edge.flow! : arc.edge.flow!
          this.emit(observer, id, `${arc.forward ? 'Forward' : 'Reverse'} residual capacity on e${arc.edge.number}: ${residual}.`, 'residual = forward ? capacity - flow : flow', [arc.edge.id])
          if (residual <= 0n || seen.has(arc.to)) continue
          seen.add(arc.to)
          previous.set(arc.to, { ...arc, from: id })
          queue.push(arc.to)
        }
      }
      if (!seen.has(to.id)) break
      const path: FlowPredecessor[] = []
      let cursor = to.id
      let amount: bigint | null = null
      while (cursor !== from.id) {
        const arc = previous.get(cursor)!
        const residual = arc.forward ? BigInt(arc.edge.capacity!) - arc.edge.flow! : arc.edge.flow!
        amount = amount === null || residual < amount ? residual : amount
        path.push(arc)
        cursor = arc.from
      }
      // Publish an entire path augmentation atomically to preserve conservation.
      for (const arc of path) arc.edge.flow = arc.edge.flow! + (arc.forward ? amount! : -amount!)
      total += amount!
      this.emit(observer, to.id, `Augment the residual path by ${amount}; total flow is ${total}. Reverse arcs cancel earlier flow.`, 'for each path arc: adjust flow by bottleneck\ntotal += bottleneck', path.map((arc) => arc.edge.id), 'AUGMENT')
    }
    return { description: `Maximum flow from ${from.value} to ${to.value} is ${total}. No residual source-to-sink path remains.`, value: total.toString(), activeId: to.id, status: 'MAX FLOW' }
  }

  protected perform(action: ActionKind, input: LinearInputValues, observer?: LinearObserver): LinearResult {
    if (action === 'add-edge') {
      const from = this.vertex(LinearModel.integer(input, 'from'))
      const to = this.vertex(LinearModel.integer(input, 'to'))
      const capacity = LinearModel.integer(input, 'capacity')
      if (capacity < 0) throw new RangeError('Capacity must be nonnegative')
      const edge = this.putEdge(from, to, capacity)
      this.emit(observer, from.id, `Add e${edge.number} with capacity ${capacity}; all flows are zero after editing.`, 'reset flows; add directed capacity edge', [edge.id], 'NEW')
      return { description: `Added capacity edge e${edge.number}; previous flow was reset.`, activeId: to.id }
    }
    if (action === 'update-capacity') {
      const number = LinearModel.integer(input, 'edge')
      const capacity = LinearModel.integer(input, 'capacity')
      if (capacity < 0) throw new RangeError('Capacity must be nonnegative')
      const index = this.edges.findIndex((edge) => edge.number === number)
      if (index < 0) throw new RangeError(`Edge e${number} does not exist`)
      this.beforeMutation()
      this.edges[index] = { ...this.edges[index], capacity, flow: 0n }
      this.emit(observer, this.edges[index].from, `Set capacity of e${number} to ${capacity}; reset all flows.`, 'reset flows; edge.capacity = capacity', [this.edges[index].id])
      return { description: `Updated capacity of e${number}; all flows are zero.` }
    }
    if (action === 'max-flow') return this.maximumFlow(this.vertex(LinearModel.integer(input, 'from')), this.vertex(LinearModel.integer(input, 'to')), observer)
    return super.perform(action, input, observer)
  }
}
