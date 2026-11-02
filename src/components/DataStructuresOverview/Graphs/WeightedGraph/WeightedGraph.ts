import { GraphModel } from '../../../../visualization/GraphModel.ts'

export class WeightedGraph extends GraphModel {
  public readonly kind = 'weighted-graph'

  public static createDefault(): WeightedGraph {
    const graph = new WeightedGraph()
    for (let value = 10; value <= 100; value += 10) graph.addVertex(value)
    const entries = graph.getEntries()
    graph.connect(entries[0].id, entries[1].id, 7)
    graph.connect(entries[0].id, entries[2].id, 9)
    graph.connect(entries[0].id, entries[5].id, 14)
    graph.connect(entries[1].id, entries[2].id, 10)
    graph.connect(entries[1].id, entries[3].id, 15)
    graph.connect(entries[2].id, entries[3].id, 11)
    graph.connect(entries[2].id, entries[5].id, 2)
    graph.connect(entries[3].id, entries[4].id, 6)
    graph.connect(entries[4].id, entries[5].id, 9)
    graph.connect(entries[5].id, entries[6].id, 4)
    graph.connect(entries[6].id, entries[7].id, 4)
    graph.connect(entries[7].id, entries[8].id, 4)
    graph.connect(entries[8].id, entries[9].id, 4)
    return graph
  }

  public clone(): WeightedGraph {
    const copy = new WeightedGraph()
    this.copyInto(copy)
    return copy
  }
}
