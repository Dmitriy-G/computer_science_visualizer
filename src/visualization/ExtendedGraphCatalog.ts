import type { StructureKind, Scene } from './Scene.ts'
import type { ExtendedGraphModel } from '../components/DataStructuresOverview/Graphs/ExtendedGraphModel.ts'
import { BipartiteGraph } from '../components/DataStructuresOverview/Graphs/BipartiteGraph/BipartiteGraph.ts'
import { BipartiteGraphLayout } from '../components/DataStructuresOverview/Graphs/BipartiteGraph/BipartiteGraphLayout.ts'
import { CompleteGraph } from '../components/DataStructuresOverview/Graphs/CompleteGraph/CompleteGraph.ts'
import { CompleteGraphLayout } from '../components/DataStructuresOverview/Graphs/CompleteGraph/CompleteGraphLayout.ts'
import { TreeGraph } from '../components/DataStructuresOverview/Graphs/TreeGraph/TreeGraph.ts'
import { TreeGraphLayout } from '../components/DataStructuresOverview/Graphs/TreeGraph/TreeGraphLayout.ts'
import { Hypergraph } from '../components/DataStructuresOverview/Graphs/Hypergraph/Hypergraph.ts'
import { HypergraphLayout } from '../components/DataStructuresOverview/Graphs/Hypergraph/HypergraphLayout.ts'
import { FlowNetwork } from '../components/DataStructuresOverview/Graphs/FlowNetwork/FlowNetwork.ts'
import { FlowNetworkLayout } from '../components/DataStructuresOverview/Graphs/FlowNetwork/FlowNetworkLayout.ts'
import { FunctionalGraph } from '../components/DataStructuresOverview/Graphs/FunctionalGraph/FunctionalGraph.ts'
import { FunctionalGraphLayout } from '../components/DataStructuresOverview/Graphs/FunctionalGraph/FunctionalGraphLayout.ts'
import { AdjacencyMatrix } from '../components/DataStructuresOverview/Graphs/AdjacencyMatrix/AdjacencyMatrix.ts'
import { AdjacencyMatrixLayout } from '../components/DataStructuresOverview/Graphs/AdjacencyMatrix/AdjacencyMatrixLayout.ts'
import { AdjacencyList } from '../components/DataStructuresOverview/Graphs/AdjacencyList/AdjacencyList.ts'
import { AdjacencyListLayout } from '../components/DataStructuresOverview/Graphs/AdjacencyList/AdjacencyListLayout.ts'
import { EdgeList } from '../components/DataStructuresOverview/Graphs/EdgeList/EdgeList.ts'
import { EdgeListLayout } from '../components/DataStructuresOverview/Graphs/EdgeList/EdgeListLayout.ts'
import { CompressedSparseRow } from '../components/DataStructuresOverview/Graphs/CompressedSparseRow/CompressedSparseRow.ts'
import { CompressedSparseRowLayout } from '../components/DataStructuresOverview/Graphs/CompressedSparseRow/CompressedSparseRowLayout.ts'

export class ExtendedGraphCatalog {
  public static createModels(): Map<StructureKind, ExtendedGraphModel> {
    return new Map<StructureKind, ExtendedGraphModel>([
      ['bipartite-graph', BipartiteGraph.createDefault()],
      ['complete-graph', CompleteGraph.createDefault()],
      ['tree-graph', TreeGraph.createDefault()],
      ['hypergraph', Hypergraph.createDefault()],
      ['flow-network', FlowNetwork.createDefault()],
      ['functional-graph', FunctionalGraph.createDefault()],
      ['adjacency-matrix', AdjacencyMatrix.createDefault()],
      ['adjacency-list', AdjacencyList.createDefault()],
      ['edge-list', EdgeList.createDefault()],
      ['compressed-sparse-row', CompressedSparseRow.createDefault()],
    ])
  }

  public static createDefault(kind: StructureKind): ExtendedGraphModel | null {
    switch (kind) {
      case 'bipartite-graph': return BipartiteGraph.createDefault()
      case 'complete-graph': return CompleteGraph.createDefault()
      case 'tree-graph': return TreeGraph.createDefault()
      case 'hypergraph': return Hypergraph.createDefault()
      case 'flow-network': return FlowNetwork.createDefault()
      case 'functional-graph': return FunctionalGraph.createDefault()
      case 'adjacency-matrix': return AdjacencyMatrix.createDefault()
      case 'adjacency-list': return AdjacencyList.createDefault()
      case 'edge-list': return EdgeList.createDefault()
      case 'compressed-sparse-row': return CompressedSparseRow.createDefault()
      default: return null
    }
  }

  public static createScene(model: ExtendedGraphModel): Scene {
    switch (model.kind) {
      case 'bipartite-graph': return new BipartiteGraphLayout().create(model)
      case 'complete-graph': return new CompleteGraphLayout().create(model)
      case 'tree-graph': return new TreeGraphLayout().create(model)
      case 'hypergraph': return new HypergraphLayout().create(model)
      case 'flow-network': return new FlowNetworkLayout().create(model)
      case 'functional-graph': return new FunctionalGraphLayout().create(model)
      case 'adjacency-matrix': return new AdjacencyMatrixLayout().create(model)
      case 'adjacency-list': return new AdjacencyListLayout().create(model)
      case 'edge-list': return new EdgeListLayout().create(model)
      case 'compressed-sparse-row': return new CompressedSparseRowLayout().create(model)
      default: throw new RangeError('Unknown extended graph')
    }
  }
}
