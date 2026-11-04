import type { StructureKind, Scene } from './Scene.ts'
import type { ExtendedGraphModel } from './ExtendedGraphModel.ts'
import { BipartiteGraph } from '../components/FundamentalDataStructures/Graphs/BipartiteGraph/BipartiteGraph.ts'
import { BipartiteGraphLayout } from '../components/FundamentalDataStructures/Graphs/BipartiteGraph/BipartiteGraphLayout.ts'
import { CompleteGraph } from '../components/FundamentalDataStructures/Graphs/CompleteGraph/CompleteGraph.ts'
import { CompleteGraphLayout } from '../components/FundamentalDataStructures/Graphs/CompleteGraph/CompleteGraphLayout.ts'
import { TreeGraph } from '../components/FundamentalDataStructures/Graphs/TreeGraph/TreeGraph.ts'
import { TreeGraphLayout } from '../components/FundamentalDataStructures/Graphs/TreeGraph/TreeGraphLayout.ts'
import { Hypergraph } from '../components/AdvancedDataStructures/SpecializedGraphs/Hypergraph/Hypergraph.ts'
import { HypergraphLayout } from '../components/AdvancedDataStructures/SpecializedGraphs/Hypergraph/HypergraphLayout.ts'
import { FlowNetwork } from '../components/AdvancedDataStructures/SpecializedGraphs/FlowNetwork/FlowNetwork.ts'
import { FlowNetworkLayout } from '../components/AdvancedDataStructures/SpecializedGraphs/FlowNetwork/FlowNetworkLayout.ts'
import { FunctionalGraph } from '../components/FundamentalDataStructures/Graphs/FunctionalGraph/FunctionalGraph.ts'
import { FunctionalGraphLayout } from '../components/FundamentalDataStructures/Graphs/FunctionalGraph/FunctionalGraphLayout.ts'
import { AdjacencyMatrix } from '../components/FundamentalDataStructures/Graphs/AdjacencyMatrix/AdjacencyMatrix.ts'
import { AdjacencyMatrixLayout } from '../components/FundamentalDataStructures/Graphs/AdjacencyMatrix/AdjacencyMatrixLayout.ts'
import { AdjacencyList } from '../components/FundamentalDataStructures/Graphs/AdjacencyList/AdjacencyList.ts'
import { AdjacencyListLayout } from '../components/FundamentalDataStructures/Graphs/AdjacencyList/AdjacencyListLayout.ts'
import { EdgeList } from '../components/FundamentalDataStructures/Graphs/EdgeList/EdgeList.ts'
import { EdgeListLayout } from '../components/FundamentalDataStructures/Graphs/EdgeList/EdgeListLayout.ts'
import { CompressedSparseRow } from '../components/AdvancedDataStructures/SparseArraysMatrices/CompressedSparseRow/CompressedSparseRow.ts'
import { CompressedSparseRowLayout } from '../components/AdvancedDataStructures/SparseArraysMatrices/CompressedSparseRow/CompressedSparseRowLayout.ts'

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
