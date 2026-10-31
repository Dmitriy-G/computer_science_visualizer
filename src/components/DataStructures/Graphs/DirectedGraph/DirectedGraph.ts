import { GraphModel } from '../../../../visualization/GraphModel.ts'

export class DirectedGraph extends GraphModel {
  public readonly kind = 'directed-graph'

  public static createDefault(): DirectedGraph {
    const graph = new DirectedGraph()
    for (let value = 10; value <= 100; value += 10) graph.addVertex(value)
    const entries = graph.getEntries()
    graph.connect(entries[0].id, entries[1].id)
    graph.connect(entries[1].id, entries[2].id)
    graph.connect(entries[2].id, entries[0].id)
    graph.connect(entries[0].id, entries[3].id)
    graph.connect(entries[3].id, entries[4].id)
    graph.connect(entries[4].id, entries[5].id)
    graph.connect(entries[5].id, entries[3].id)
    graph.connect(entries[5].id, entries[6].id)
    graph.connect(entries[6].id, entries[7].id)
    graph.connect(entries[7].id, entries[8].id)
    graph.connect(entries[8].id, entries[9].id)
    return graph
  }

  public clone(): DirectedGraph {
    const copy = new DirectedGraph()
    this.copyInto(copy)
    return copy
  }
}
