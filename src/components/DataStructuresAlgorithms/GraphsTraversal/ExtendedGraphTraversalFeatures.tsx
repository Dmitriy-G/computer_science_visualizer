import type { ReactNode } from 'react'
import type { ActionKind } from '../../../visualization/ActionCatalog.ts'
import type { AlgorithmInformation } from '../../../visualization/AlgorithmInformation.ts'
import type { StructuredLinearActionProps } from '../../ActionPlayback/StructuredLinearAction.tsx'
import type { ExtendedGraphModel } from '../../DataStructuresOverview/Graphs/ExtendedGraphModel.ts'
import BipartiteGraphBreadthFirst from './BipartiteGraph/BreadthFirst/BreadthFirst.tsx'
import { BreadthFirstAnimation as BipartiteGraphBreadthFirstSequence } from './BipartiteGraph/BreadthFirst/BreadthFirstAnimation.ts'
import BipartiteGraphDepthFirst from './BipartiteGraph/DepthFirst/DepthFirst.tsx'
import { DepthFirstAnimation as BipartiteGraphDepthFirstSequence } from './BipartiteGraph/DepthFirst/DepthFirstAnimation.ts'
import CompleteGraphBreadthFirst from './CompleteGraph/BreadthFirst/BreadthFirst.tsx'
import { BreadthFirstAnimation as CompleteGraphBreadthFirstSequence } from './CompleteGraph/BreadthFirst/BreadthFirstAnimation.ts'
import CompleteGraphDepthFirst from './CompleteGraph/DepthFirst/DepthFirst.tsx'
import { DepthFirstAnimation as CompleteGraphDepthFirstSequence } from './CompleteGraph/DepthFirst/DepthFirstAnimation.ts'
import TreeGraphBreadthFirst from './TreeGraph/BreadthFirst/BreadthFirst.tsx'
import { BreadthFirstAnimation as TreeGraphBreadthFirstSequence } from './TreeGraph/BreadthFirst/BreadthFirstAnimation.ts'
import TreeGraphDepthFirst from './TreeGraph/DepthFirst/DepthFirst.tsx'
import { DepthFirstAnimation as TreeGraphDepthFirstSequence } from './TreeGraph/DepthFirst/DepthFirstAnimation.ts'
import HypergraphBreadthFirst from './Hypergraph/BreadthFirst/BreadthFirst.tsx'
import { BreadthFirstAnimation as HypergraphBreadthFirstSequence } from './Hypergraph/BreadthFirst/BreadthFirstAnimation.ts'
import HypergraphDepthFirst from './Hypergraph/DepthFirst/DepthFirst.tsx'
import { DepthFirstAnimation as HypergraphDepthFirstSequence } from './Hypergraph/DepthFirst/DepthFirstAnimation.ts'
import FlowNetworkBreadthFirst from './FlowNetwork/BreadthFirst/BreadthFirst.tsx'
import { BreadthFirstAnimation as FlowNetworkBreadthFirstSequence } from './FlowNetwork/BreadthFirst/BreadthFirstAnimation.ts'
import FlowNetworkDepthFirst from './FlowNetwork/DepthFirst/DepthFirst.tsx'
import { DepthFirstAnimation as FlowNetworkDepthFirstSequence } from './FlowNetwork/DepthFirst/DepthFirstAnimation.ts'
import FlowNetworkMaxFlow from './FlowNetwork/MaxFlow/MaxFlow.tsx'
import { MaxFlowAnimation as FlowNetworkMaxFlowSequence } from './FlowNetwork/MaxFlow/MaxFlowAnimation.ts'
import FunctionalGraphBreadthFirst from './FunctionalGraph/BreadthFirst/BreadthFirst.tsx'
import { BreadthFirstAnimation as FunctionalGraphBreadthFirstSequence } from './FunctionalGraph/BreadthFirst/BreadthFirstAnimation.ts'
import FunctionalGraphDepthFirst from './FunctionalGraph/DepthFirst/DepthFirst.tsx'
import { DepthFirstAnimation as FunctionalGraphDepthFirstSequence } from './FunctionalGraph/DepthFirst/DepthFirstAnimation.ts'
import AdjacencyMatrixBreadthFirst from './AdjacencyMatrix/BreadthFirst/BreadthFirst.tsx'
import { BreadthFirstAnimation as AdjacencyMatrixBreadthFirstSequence } from './AdjacencyMatrix/BreadthFirst/BreadthFirstAnimation.ts'
import AdjacencyMatrixDepthFirst from './AdjacencyMatrix/DepthFirst/DepthFirst.tsx'
import { DepthFirstAnimation as AdjacencyMatrixDepthFirstSequence } from './AdjacencyMatrix/DepthFirst/DepthFirstAnimation.ts'
import AdjacencyListBreadthFirst from './AdjacencyList/BreadthFirst/BreadthFirst.tsx'
import { BreadthFirstAnimation as AdjacencyListBreadthFirstSequence } from './AdjacencyList/BreadthFirst/BreadthFirstAnimation.ts'
import AdjacencyListDepthFirst from './AdjacencyList/DepthFirst/DepthFirst.tsx'
import { DepthFirstAnimation as AdjacencyListDepthFirstSequence } from './AdjacencyList/DepthFirst/DepthFirstAnimation.ts'
import EdgeListBreadthFirst from './EdgeList/BreadthFirst/BreadthFirst.tsx'
import { BreadthFirstAnimation as EdgeListBreadthFirstSequence } from './EdgeList/BreadthFirst/BreadthFirstAnimation.ts'
import EdgeListDepthFirst from './EdgeList/DepthFirst/DepthFirst.tsx'
import { DepthFirstAnimation as EdgeListDepthFirstSequence } from './EdgeList/DepthFirst/DepthFirstAnimation.ts'
import CompressedSparseRowBreadthFirst from './CompressedSparseRow/BreadthFirst/BreadthFirst.tsx'
import { BreadthFirstAnimation as CompressedSparseRowBreadthFirstSequence } from './CompressedSparseRow/BreadthFirst/BreadthFirstAnimation.ts'
import CompressedSparseRowDepthFirst from './CompressedSparseRow/DepthFirst/DepthFirst.tsx'
import { DepthFirstAnimation as CompressedSparseRowDepthFirstSequence } from './CompressedSparseRow/DepthFirst/DepthFirstAnimation.ts'

export class ExtendedGraphTraversalFeatures {
  public static render(action: ActionKind, props: StructuredLinearActionProps, session: number): ReactNode {
    switch (props.model.kind) {
      case 'bipartite-graph':
        switch (action) {
          case 'breadth-first': return <BipartiteGraphBreadthFirst key={session} {...props} />
          case 'depth-first': return <BipartiteGraphDepthFirst key={session} {...props} />
        }
        break
      case 'complete-graph':
        switch (action) {
          case 'breadth-first': return <CompleteGraphBreadthFirst key={session} {...props} />
          case 'depth-first': return <CompleteGraphDepthFirst key={session} {...props} />
        }
        break
      case 'tree-graph':
        switch (action) {
          case 'breadth-first': return <TreeGraphBreadthFirst key={session} {...props} />
          case 'depth-first': return <TreeGraphDepthFirst key={session} {...props} />
        }
        break
      case 'hypergraph':
        switch (action) {
          case 'breadth-first': return <HypergraphBreadthFirst key={session} {...props} />
          case 'depth-first': return <HypergraphDepthFirst key={session} {...props} />
        }
        break
      case 'flow-network':
        switch (action) {
          case 'breadth-first': return <FlowNetworkBreadthFirst key={session} {...props} />
          case 'depth-first': return <FlowNetworkDepthFirst key={session} {...props} />
          case 'max-flow': return <FlowNetworkMaxFlow key={session} {...props} />
        }
        break
      case 'functional-graph':
        switch (action) {
          case 'breadth-first': return <FunctionalGraphBreadthFirst key={session} {...props} />
          case 'depth-first': return <FunctionalGraphDepthFirst key={session} {...props} />
        }
        break
      case 'adjacency-matrix':
        switch (action) {
          case 'breadth-first': return <AdjacencyMatrixBreadthFirst key={session} {...props} />
          case 'depth-first': return <AdjacencyMatrixDepthFirst key={session} {...props} />
        }
        break
      case 'adjacency-list':
        switch (action) {
          case 'breadth-first': return <AdjacencyListBreadthFirst key={session} {...props} />
          case 'depth-first': return <AdjacencyListDepthFirst key={session} {...props} />
        }
        break
      case 'edge-list':
        switch (action) {
          case 'breadth-first': return <EdgeListBreadthFirst key={session} {...props} />
          case 'depth-first': return <EdgeListDepthFirst key={session} {...props} />
        }
        break
      case 'compressed-sparse-row':
        switch (action) {
          case 'breadth-first': return <CompressedSparseRowBreadthFirst key={session} {...props} />
          case 'depth-first': return <CompressedSparseRowDepthFirst key={session} {...props} />
        }
        break
    }
    return null
  }

  public static describe(action: ActionKind, model: ExtendedGraphModel): AlgorithmInformation | null {
    switch (model.kind) {
      case 'bipartite-graph':
        switch (action) {
          case 'breadth-first': return BipartiteGraphBreadthFirstSequence.describe(model.length, model.edgeCount)
          case 'depth-first': return BipartiteGraphDepthFirstSequence.describe(model.length, model.edgeCount)
        }
        break
      case 'complete-graph':
        switch (action) {
          case 'breadth-first': return CompleteGraphBreadthFirstSequence.describe(model.length, model.edgeCount)
          case 'depth-first': return CompleteGraphDepthFirstSequence.describe(model.length, model.edgeCount)
        }
        break
      case 'tree-graph':
        switch (action) {
          case 'breadth-first': return TreeGraphBreadthFirstSequence.describe(model.length, model.edgeCount)
          case 'depth-first': return TreeGraphDepthFirstSequence.describe(model.length, model.edgeCount)
        }
        break
      case 'hypergraph':
        switch (action) {
          case 'breadth-first': return HypergraphBreadthFirstSequence.describe(model.length, model.edgeCount)
          case 'depth-first': return HypergraphDepthFirstSequence.describe(model.length, model.edgeCount)
        }
        break
      case 'flow-network':
        switch (action) {
          case 'breadth-first': return FlowNetworkBreadthFirstSequence.describe(model.length, model.edgeCount)
          case 'depth-first': return FlowNetworkDepthFirstSequence.describe(model.length, model.edgeCount)
          case 'max-flow': return FlowNetworkMaxFlowSequence.describe(model.length, model.edgeCount)
        }
        break
      case 'functional-graph':
        switch (action) {
          case 'breadth-first': return FunctionalGraphBreadthFirstSequence.describe(model.length, model.edgeCount)
          case 'depth-first': return FunctionalGraphDepthFirstSequence.describe(model.length, model.edgeCount)
        }
        break
      case 'adjacency-matrix':
        switch (action) {
          case 'breadth-first': return AdjacencyMatrixBreadthFirstSequence.describe(model.length, model.edgeCount)
          case 'depth-first': return AdjacencyMatrixDepthFirstSequence.describe(model.length, model.edgeCount)
        }
        break
      case 'adjacency-list':
        switch (action) {
          case 'breadth-first': return AdjacencyListBreadthFirstSequence.describe(model.length, model.edgeCount)
          case 'depth-first': return AdjacencyListDepthFirstSequence.describe(model.length, model.edgeCount)
        }
        break
      case 'edge-list':
        switch (action) {
          case 'breadth-first': return EdgeListBreadthFirstSequence.describe(model.length, model.edgeCount)
          case 'depth-first': return EdgeListDepthFirstSequence.describe(model.length, model.edgeCount)
        }
        break
      case 'compressed-sparse-row':
        switch (action) {
          case 'breadth-first': return CompressedSparseRowBreadthFirstSequence.describe(model.length, model.edgeCount)
          case 'depth-first': return CompressedSparseRowDepthFirstSequence.describe(model.length, model.edgeCount)
        }
        break
    }
    return null
  }
}
