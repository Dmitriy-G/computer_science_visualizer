import { Graph } from '../components/DataStructuresOverview/Graphs/SimpleGraph/Graph.ts'
import { DirectedGraph } from '../components/DataStructuresOverview/Graphs/DirectedGraph/DirectedGraph.ts'
import { WeightedGraph } from '../components/DataStructuresOverview/Graphs/WeightedGraph/WeightedGraph.ts'
import { DAG } from '../components/DataStructuresOverview/Graphs/DAG/DAG.ts'
import { Multigraph } from '../components/DataStructuresOverview/Graphs/Multigraph/Multigraph.ts'
import type { GraphModel } from './GraphModel.ts'
import type { StructureKind } from './Scene.ts'

export class GraphCatalog {
  public static supports(kind: StructureKind): boolean {
    return kind === 'graph' || kind === 'directed-graph' || kind === 'weighted-graph' || kind === 'dag' || kind === 'multigraph'
  }

  public static createDefault(kind: StructureKind): GraphModel | null {
    switch (kind) {
      case 'graph': return Graph.createDefault()
      case 'directed-graph': return DirectedGraph.createDefault()
      case 'weighted-graph': return WeightedGraph.createDefault()
      case 'dag': return DAG.createDefault()
      case 'multigraph': return Multigraph.createDefault()
      default: return null
    }
  }

  public static createModels(graph = Graph.createDefault()): Map<StructureKind, GraphModel> {
    return new Map<StructureKind, GraphModel>([
      ['graph', graph], ['directed-graph', DirectedGraph.createDefault()], ['weighted-graph', WeightedGraph.createDefault()],
      ['dag', DAG.createDefault()], ['multigraph', Multigraph.createDefault()],
    ])
  }
}
