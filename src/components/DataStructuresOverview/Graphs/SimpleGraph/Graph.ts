import { GraphModel } from '../../../../visualization/GraphModel.ts'
export type { GraphEntry } from '../../../../visualization/GraphModel.ts'

// The original Graph remains the undirected, unweighted graph.
export class Graph extends GraphModel {
  public readonly kind = 'graph'

  public static createDefault(): Graph {
    const graph = new Graph()
    for (let value = 10; value <= 100; value += 10) graph.addVertex(value)
    const entries = graph.getEntries()
    for (let index = 0; index < 10; index += 1) graph.connect(entries[index].id, entries[(index + 1) % 10].id)
    for (const [from, to] of [[0, 4], [2, 7], [5, 9]]) graph.connect(entries[from].id, entries[to].id)
    return graph
  }

  public clone(): Graph {
    const copy = new Graph()
    this.copyInto(copy)
    return copy
  }
}
