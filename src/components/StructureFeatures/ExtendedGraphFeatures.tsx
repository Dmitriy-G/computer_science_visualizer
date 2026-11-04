import type { ReactNode } from 'react'
import type { ActionKind } from '../../visualization/ActionCatalog.ts'
import type { AlgorithmInformation } from '../../visualization/AlgorithmInformation.ts'
import type { StructuredLinearActionProps } from '../ActionPlayback/StructuredLinearAction.tsx'
import type { ExtendedGraphModel } from '../../visualization/ExtendedGraphModel.ts'
import BipartiteGraphAddVertex from '../FundamentalDataStructures/Graphs/BipartiteGraph/AddVertex/AddVertex.tsx'
import { AddVertexAnimation as BipartiteGraphAddVertexSequence } from '../FundamentalDataStructures/Graphs/BipartiteGraph/AddVertex/AddVertexAnimation.ts'
import BipartiteGraphAddEdge from '../FundamentalDataStructures/Graphs/BipartiteGraph/AddEdge/AddEdge.tsx'
import { AddEdgeAnimation as BipartiteGraphAddEdgeSequence } from '../FundamentalDataStructures/Graphs/BipartiteGraph/AddEdge/AddEdgeAnimation.ts'
import BipartiteGraphRemoveEdge from '../FundamentalDataStructures/Graphs/BipartiteGraph/RemoveEdge/RemoveEdge.tsx'
import { RemoveEdgeAnimation as BipartiteGraphRemoveEdgeSequence } from '../FundamentalDataStructures/Graphs/BipartiteGraph/RemoveEdge/RemoveEdgeAnimation.ts'
import BipartiteGraphDeleteByValue from '../FundamentalDataStructures/Graphs/BipartiteGraph/DeleteByValue/DeleteByValue.tsx'
import { DeleteByValueAnimation as BipartiteGraphDeleteByValueSequence } from '../FundamentalDataStructures/Graphs/BipartiteGraph/DeleteByValue/DeleteByValueAnimation.ts'
import BipartiteGraphSearchByValue from '../FundamentalDataStructures/Graphs/BipartiteGraph/SearchByValue/SearchByValue.tsx'
import { SearchByValueAnimation as BipartiteGraphSearchByValueSequence } from '../FundamentalDataStructures/Graphs/BipartiteGraph/SearchByValue/SearchByValueAnimation.ts'
import BipartiteGraphClear from '../FundamentalDataStructures/Graphs/BipartiteGraph/Clear/Clear.tsx'
import { ClearAnimation as BipartiteGraphClearSequence } from '../FundamentalDataStructures/Graphs/BipartiteGraph/Clear/ClearAnimation.ts'
import CompleteGraphAddVertex from '../FundamentalDataStructures/Graphs/CompleteGraph/AddVertex/AddVertex.tsx'
import { AddVertexAnimation as CompleteGraphAddVertexSequence } from '../FundamentalDataStructures/Graphs/CompleteGraph/AddVertex/AddVertexAnimation.ts'
import CompleteGraphDeleteByValue from '../FundamentalDataStructures/Graphs/CompleteGraph/DeleteByValue/DeleteByValue.tsx'
import { DeleteByValueAnimation as CompleteGraphDeleteByValueSequence } from '../FundamentalDataStructures/Graphs/CompleteGraph/DeleteByValue/DeleteByValueAnimation.ts'
import CompleteGraphSearchByValue from '../FundamentalDataStructures/Graphs/CompleteGraph/SearchByValue/SearchByValue.tsx'
import { SearchByValueAnimation as CompleteGraphSearchByValueSequence } from '../FundamentalDataStructures/Graphs/CompleteGraph/SearchByValue/SearchByValueAnimation.ts'
import CompleteGraphClear from '../FundamentalDataStructures/Graphs/CompleteGraph/Clear/Clear.tsx'
import { ClearAnimation as CompleteGraphClearSequence } from '../FundamentalDataStructures/Graphs/CompleteGraph/Clear/ClearAnimation.ts'
import TreeGraphAddVertex from '../FundamentalDataStructures/Graphs/TreeGraph/AddVertex/AddVertex.tsx'
import { AddVertexAnimation as TreeGraphAddVertexSequence } from '../FundamentalDataStructures/Graphs/TreeGraph/AddVertex/AddVertexAnimation.ts'
import TreeGraphDeleteByValue from '../FundamentalDataStructures/Graphs/TreeGraph/DeleteByValue/DeleteByValue.tsx'
import { DeleteByValueAnimation as TreeGraphDeleteByValueSequence } from '../FundamentalDataStructures/Graphs/TreeGraph/DeleteByValue/DeleteByValueAnimation.ts'
import TreeGraphSearchByValue from '../FundamentalDataStructures/Graphs/TreeGraph/SearchByValue/SearchByValue.tsx'
import { SearchByValueAnimation as TreeGraphSearchByValueSequence } from '../FundamentalDataStructures/Graphs/TreeGraph/SearchByValue/SearchByValueAnimation.ts'
import TreeGraphClear from '../FundamentalDataStructures/Graphs/TreeGraph/Clear/Clear.tsx'
import { ClearAnimation as TreeGraphClearSequence } from '../FundamentalDataStructures/Graphs/TreeGraph/Clear/ClearAnimation.ts'
import HypergraphAddVertex from '../AdvancedDataStructures/SpecializedGraphs/Hypergraph/AddVertex/AddVertex.tsx'
import { AddVertexAnimation as HypergraphAddVertexSequence } from '../AdvancedDataStructures/SpecializedGraphs/Hypergraph/AddVertex/AddVertexAnimation.ts'
import HypergraphAddEdge from '../AdvancedDataStructures/SpecializedGraphs/Hypergraph/AddEdge/AddEdge.tsx'
import { AddEdgeAnimation as HypergraphAddEdgeSequence } from '../AdvancedDataStructures/SpecializedGraphs/Hypergraph/AddEdge/AddEdgeAnimation.ts'
import HypergraphRemoveEdge from '../AdvancedDataStructures/SpecializedGraphs/Hypergraph/RemoveEdge/RemoveEdge.tsx'
import { RemoveEdgeAnimation as HypergraphRemoveEdgeSequence } from '../AdvancedDataStructures/SpecializedGraphs/Hypergraph/RemoveEdge/RemoveEdgeAnimation.ts'
import HypergraphDeleteByValue from '../AdvancedDataStructures/SpecializedGraphs/Hypergraph/DeleteByValue/DeleteByValue.tsx'
import { DeleteByValueAnimation as HypergraphDeleteByValueSequence } from '../AdvancedDataStructures/SpecializedGraphs/Hypergraph/DeleteByValue/DeleteByValueAnimation.ts'
import HypergraphSearchByValue from '../AdvancedDataStructures/SpecializedGraphs/Hypergraph/SearchByValue/SearchByValue.tsx'
import { SearchByValueAnimation as HypergraphSearchByValueSequence } from '../AdvancedDataStructures/SpecializedGraphs/Hypergraph/SearchByValue/SearchByValueAnimation.ts'
import HypergraphClear from '../AdvancedDataStructures/SpecializedGraphs/Hypergraph/Clear/Clear.tsx'
import { ClearAnimation as HypergraphClearSequence } from '../AdvancedDataStructures/SpecializedGraphs/Hypergraph/Clear/ClearAnimation.ts'
import FlowNetworkAddVertex from '../AdvancedDataStructures/SpecializedGraphs/FlowNetwork/AddVertex/AddVertex.tsx'
import { AddVertexAnimation as FlowNetworkAddVertexSequence } from '../AdvancedDataStructures/SpecializedGraphs/FlowNetwork/AddVertex/AddVertexAnimation.ts'
import FlowNetworkAddEdge from '../AdvancedDataStructures/SpecializedGraphs/FlowNetwork/AddEdge/AddEdge.tsx'
import { AddEdgeAnimation as FlowNetworkAddEdgeSequence } from '../AdvancedDataStructures/SpecializedGraphs/FlowNetwork/AddEdge/AddEdgeAnimation.ts'
import FlowNetworkRemoveEdge from '../AdvancedDataStructures/SpecializedGraphs/FlowNetwork/RemoveEdge/RemoveEdge.tsx'
import { RemoveEdgeAnimation as FlowNetworkRemoveEdgeSequence } from '../AdvancedDataStructures/SpecializedGraphs/FlowNetwork/RemoveEdge/RemoveEdgeAnimation.ts'
import FlowNetworkUpdateCapacity from '../AdvancedDataStructures/SpecializedGraphs/FlowNetwork/UpdateCapacity/UpdateCapacity.tsx'
import { UpdateCapacityAnimation as FlowNetworkUpdateCapacitySequence } from '../AdvancedDataStructures/SpecializedGraphs/FlowNetwork/UpdateCapacity/UpdateCapacityAnimation.ts'
import FlowNetworkDeleteByValue from '../AdvancedDataStructures/SpecializedGraphs/FlowNetwork/DeleteByValue/DeleteByValue.tsx'
import { DeleteByValueAnimation as FlowNetworkDeleteByValueSequence } from '../AdvancedDataStructures/SpecializedGraphs/FlowNetwork/DeleteByValue/DeleteByValueAnimation.ts'
import FlowNetworkSearchByValue from '../AdvancedDataStructures/SpecializedGraphs/FlowNetwork/SearchByValue/SearchByValue.tsx'
import { SearchByValueAnimation as FlowNetworkSearchByValueSequence } from '../AdvancedDataStructures/SpecializedGraphs/FlowNetwork/SearchByValue/SearchByValueAnimation.ts'
import FlowNetworkClear from '../AdvancedDataStructures/SpecializedGraphs/FlowNetwork/Clear/Clear.tsx'
import { ClearAnimation as FlowNetworkClearSequence } from '../AdvancedDataStructures/SpecializedGraphs/FlowNetwork/Clear/ClearAnimation.ts'
import FunctionalGraphAddVertex from '../FundamentalDataStructures/Graphs/FunctionalGraph/AddVertex/AddVertex.tsx'
import { AddVertexAnimation as FunctionalGraphAddVertexSequence } from '../FundamentalDataStructures/Graphs/FunctionalGraph/AddVertex/AddVertexAnimation.ts'
import FunctionalGraphSetSuccessor from '../FundamentalDataStructures/Graphs/FunctionalGraph/SetSuccessor/SetSuccessor.tsx'
import { SetSuccessorAnimation as FunctionalGraphSetSuccessorSequence } from '../FundamentalDataStructures/Graphs/FunctionalGraph/SetSuccessor/SetSuccessorAnimation.ts'
import FunctionalGraphReadSuccessor from '../FundamentalDataStructures/Graphs/FunctionalGraph/ReadSuccessor/ReadSuccessor.tsx'
import { ReadSuccessorAnimation as FunctionalGraphReadSuccessorSequence } from '../FundamentalDataStructures/Graphs/FunctionalGraph/ReadSuccessor/ReadSuccessorAnimation.ts'
import FunctionalGraphDeleteByValue from '../FundamentalDataStructures/Graphs/FunctionalGraph/DeleteByValue/DeleteByValue.tsx'
import { DeleteByValueAnimation as FunctionalGraphDeleteByValueSequence } from '../FundamentalDataStructures/Graphs/FunctionalGraph/DeleteByValue/DeleteByValueAnimation.ts'
import FunctionalGraphSearchByValue from '../FundamentalDataStructures/Graphs/FunctionalGraph/SearchByValue/SearchByValue.tsx'
import { SearchByValueAnimation as FunctionalGraphSearchByValueSequence } from '../FundamentalDataStructures/Graphs/FunctionalGraph/SearchByValue/SearchByValueAnimation.ts'
import FunctionalGraphClear from '../FundamentalDataStructures/Graphs/FunctionalGraph/Clear/Clear.tsx'
import { ClearAnimation as FunctionalGraphClearSequence } from '../FundamentalDataStructures/Graphs/FunctionalGraph/Clear/ClearAnimation.ts'
import AdjacencyMatrixAddVertex from '../FundamentalDataStructures/Graphs/AdjacencyMatrix/AddVertex/AddVertex.tsx'
import { AddVertexAnimation as AdjacencyMatrixAddVertexSequence } from '../FundamentalDataStructures/Graphs/AdjacencyMatrix/AddVertex/AddVertexAnimation.ts'
import AdjacencyMatrixAddEdge from '../FundamentalDataStructures/Graphs/AdjacencyMatrix/AddEdge/AddEdge.tsx'
import { AddEdgeAnimation as AdjacencyMatrixAddEdgeSequence } from '../FundamentalDataStructures/Graphs/AdjacencyMatrix/AddEdge/AddEdgeAnimation.ts'
import AdjacencyMatrixRemoveEdge from '../FundamentalDataStructures/Graphs/AdjacencyMatrix/RemoveEdge/RemoveEdge.tsx'
import { RemoveEdgeAnimation as AdjacencyMatrixRemoveEdgeSequence } from '../FundamentalDataStructures/Graphs/AdjacencyMatrix/RemoveEdge/RemoveEdgeAnimation.ts'
import AdjacencyMatrixDeleteByValue from '../FundamentalDataStructures/Graphs/AdjacencyMatrix/DeleteByValue/DeleteByValue.tsx'
import { DeleteByValueAnimation as AdjacencyMatrixDeleteByValueSequence } from '../FundamentalDataStructures/Graphs/AdjacencyMatrix/DeleteByValue/DeleteByValueAnimation.ts'
import AdjacencyMatrixSearchByValue from '../FundamentalDataStructures/Graphs/AdjacencyMatrix/SearchByValue/SearchByValue.tsx'
import { SearchByValueAnimation as AdjacencyMatrixSearchByValueSequence } from '../FundamentalDataStructures/Graphs/AdjacencyMatrix/SearchByValue/SearchByValueAnimation.ts'
import AdjacencyMatrixInspectStorage from '../FundamentalDataStructures/Graphs/AdjacencyMatrix/InspectStorage/InspectStorage.tsx'
import { InspectStorageAnimation as AdjacencyMatrixInspectStorageSequence } from '../FundamentalDataStructures/Graphs/AdjacencyMatrix/InspectStorage/InspectStorageAnimation.ts'
import AdjacencyMatrixClear from '../FundamentalDataStructures/Graphs/AdjacencyMatrix/Clear/Clear.tsx'
import { ClearAnimation as AdjacencyMatrixClearSequence } from '../FundamentalDataStructures/Graphs/AdjacencyMatrix/Clear/ClearAnimation.ts'
import AdjacencyListAddVertex from '../FundamentalDataStructures/Graphs/AdjacencyList/AddVertex/AddVertex.tsx'
import { AddVertexAnimation as AdjacencyListAddVertexSequence } from '../FundamentalDataStructures/Graphs/AdjacencyList/AddVertex/AddVertexAnimation.ts'
import AdjacencyListAddEdge from '../FundamentalDataStructures/Graphs/AdjacencyList/AddEdge/AddEdge.tsx'
import { AddEdgeAnimation as AdjacencyListAddEdgeSequence } from '../FundamentalDataStructures/Graphs/AdjacencyList/AddEdge/AddEdgeAnimation.ts'
import AdjacencyListRemoveEdge from '../FundamentalDataStructures/Graphs/AdjacencyList/RemoveEdge/RemoveEdge.tsx'
import { RemoveEdgeAnimation as AdjacencyListRemoveEdgeSequence } from '../FundamentalDataStructures/Graphs/AdjacencyList/RemoveEdge/RemoveEdgeAnimation.ts'
import AdjacencyListDeleteByValue from '../FundamentalDataStructures/Graphs/AdjacencyList/DeleteByValue/DeleteByValue.tsx'
import { DeleteByValueAnimation as AdjacencyListDeleteByValueSequence } from '../FundamentalDataStructures/Graphs/AdjacencyList/DeleteByValue/DeleteByValueAnimation.ts'
import AdjacencyListSearchByValue from '../FundamentalDataStructures/Graphs/AdjacencyList/SearchByValue/SearchByValue.tsx'
import { SearchByValueAnimation as AdjacencyListSearchByValueSequence } from '../FundamentalDataStructures/Graphs/AdjacencyList/SearchByValue/SearchByValueAnimation.ts'
import AdjacencyListInspectStorage from '../FundamentalDataStructures/Graphs/AdjacencyList/InspectStorage/InspectStorage.tsx'
import { InspectStorageAnimation as AdjacencyListInspectStorageSequence } from '../FundamentalDataStructures/Graphs/AdjacencyList/InspectStorage/InspectStorageAnimation.ts'
import AdjacencyListClear from '../FundamentalDataStructures/Graphs/AdjacencyList/Clear/Clear.tsx'
import { ClearAnimation as AdjacencyListClearSequence } from '../FundamentalDataStructures/Graphs/AdjacencyList/Clear/ClearAnimation.ts'
import EdgeListAddVertex from '../FundamentalDataStructures/Graphs/EdgeList/AddVertex/AddVertex.tsx'
import { AddVertexAnimation as EdgeListAddVertexSequence } from '../FundamentalDataStructures/Graphs/EdgeList/AddVertex/AddVertexAnimation.ts'
import EdgeListAddEdge from '../FundamentalDataStructures/Graphs/EdgeList/AddEdge/AddEdge.tsx'
import { AddEdgeAnimation as EdgeListAddEdgeSequence } from '../FundamentalDataStructures/Graphs/EdgeList/AddEdge/AddEdgeAnimation.ts'
import EdgeListRemoveEdge from '../FundamentalDataStructures/Graphs/EdgeList/RemoveEdge/RemoveEdge.tsx'
import { RemoveEdgeAnimation as EdgeListRemoveEdgeSequence } from '../FundamentalDataStructures/Graphs/EdgeList/RemoveEdge/RemoveEdgeAnimation.ts'
import EdgeListDeleteByValue from '../FundamentalDataStructures/Graphs/EdgeList/DeleteByValue/DeleteByValue.tsx'
import { DeleteByValueAnimation as EdgeListDeleteByValueSequence } from '../FundamentalDataStructures/Graphs/EdgeList/DeleteByValue/DeleteByValueAnimation.ts'
import EdgeListSearchByValue from '../FundamentalDataStructures/Graphs/EdgeList/SearchByValue/SearchByValue.tsx'
import { SearchByValueAnimation as EdgeListSearchByValueSequence } from '../FundamentalDataStructures/Graphs/EdgeList/SearchByValue/SearchByValueAnimation.ts'
import EdgeListInspectStorage from '../FundamentalDataStructures/Graphs/EdgeList/InspectStorage/InspectStorage.tsx'
import { InspectStorageAnimation as EdgeListInspectStorageSequence } from '../FundamentalDataStructures/Graphs/EdgeList/InspectStorage/InspectStorageAnimation.ts'
import EdgeListClear from '../FundamentalDataStructures/Graphs/EdgeList/Clear/Clear.tsx'
import { ClearAnimation as EdgeListClearSequence } from '../FundamentalDataStructures/Graphs/EdgeList/Clear/ClearAnimation.ts'
import CompressedSparseRowAddVertex from '../AdvancedDataStructures/SparseArraysMatrices/CompressedSparseRow/AddVertex/AddVertex.tsx'
import { AddVertexAnimation as CompressedSparseRowAddVertexSequence } from '../AdvancedDataStructures/SparseArraysMatrices/CompressedSparseRow/AddVertex/AddVertexAnimation.ts'
import CompressedSparseRowAddEdge from '../AdvancedDataStructures/SparseArraysMatrices/CompressedSparseRow/AddEdge/AddEdge.tsx'
import { AddEdgeAnimation as CompressedSparseRowAddEdgeSequence } from '../AdvancedDataStructures/SparseArraysMatrices/CompressedSparseRow/AddEdge/AddEdgeAnimation.ts'
import CompressedSparseRowRemoveEdge from '../AdvancedDataStructures/SparseArraysMatrices/CompressedSparseRow/RemoveEdge/RemoveEdge.tsx'
import { RemoveEdgeAnimation as CompressedSparseRowRemoveEdgeSequence } from '../AdvancedDataStructures/SparseArraysMatrices/CompressedSparseRow/RemoveEdge/RemoveEdgeAnimation.ts'
import CompressedSparseRowDeleteByValue from '../AdvancedDataStructures/SparseArraysMatrices/CompressedSparseRow/DeleteByValue/DeleteByValue.tsx'
import { DeleteByValueAnimation as CompressedSparseRowDeleteByValueSequence } from '../AdvancedDataStructures/SparseArraysMatrices/CompressedSparseRow/DeleteByValue/DeleteByValueAnimation.ts'
import CompressedSparseRowSearchByValue from '../AdvancedDataStructures/SparseArraysMatrices/CompressedSparseRow/SearchByValue/SearchByValue.tsx'
import { SearchByValueAnimation as CompressedSparseRowSearchByValueSequence } from '../AdvancedDataStructures/SparseArraysMatrices/CompressedSparseRow/SearchByValue/SearchByValueAnimation.ts'
import CompressedSparseRowInspectStorage from '../AdvancedDataStructures/SparseArraysMatrices/CompressedSparseRow/InspectStorage/InspectStorage.tsx'
import { InspectStorageAnimation as CompressedSparseRowInspectStorageSequence } from '../AdvancedDataStructures/SparseArraysMatrices/CompressedSparseRow/InspectStorage/InspectStorageAnimation.ts'
import CompressedSparseRowClear from '../AdvancedDataStructures/SparseArraysMatrices/CompressedSparseRow/Clear/Clear.tsx'
import { ClearAnimation as CompressedSparseRowClearSequence } from '../AdvancedDataStructures/SparseArraysMatrices/CompressedSparseRow/Clear/ClearAnimation.ts'

export class ExtendedGraphFeatures {
  public static render(action: ActionKind, props: StructuredLinearActionProps, session: number): ReactNode {
    switch (props.model.kind) {
      case 'bipartite-graph':
        switch (action) {
          case 'add-vertex': return <BipartiteGraphAddVertex key={session} {...props} />
          case 'add-edge': return <BipartiteGraphAddEdge key={session} {...props} />
          case 'remove-edge': return <BipartiteGraphRemoveEdge key={session} {...props} />
          case 'delete-value': return <BipartiteGraphDeleteByValue key={session} {...props} />
          case 'search-value': return <BipartiteGraphSearchByValue key={session} {...props} />
          case 'clear': return <BipartiteGraphClear key={session} {...props} />
        }
        break
      case 'complete-graph':
        switch (action) {
          case 'add-vertex': return <CompleteGraphAddVertex key={session} {...props} />
          case 'delete-value': return <CompleteGraphDeleteByValue key={session} {...props} />
          case 'search-value': return <CompleteGraphSearchByValue key={session} {...props} />
          case 'clear': return <CompleteGraphClear key={session} {...props} />
        }
        break
      case 'tree-graph':
        switch (action) {
          case 'add-vertex': return <TreeGraphAddVertex key={session} {...props} />
          case 'delete-value': return <TreeGraphDeleteByValue key={session} {...props} />
          case 'search-value': return <TreeGraphSearchByValue key={session} {...props} />
          case 'clear': return <TreeGraphClear key={session} {...props} />
        }
        break
      case 'hypergraph':
        switch (action) {
          case 'add-vertex': return <HypergraphAddVertex key={session} {...props} />
          case 'add-edge': return <HypergraphAddEdge key={session} {...props} />
          case 'remove-edge': return <HypergraphRemoveEdge key={session} {...props} />
          case 'delete-value': return <HypergraphDeleteByValue key={session} {...props} />
          case 'search-value': return <HypergraphSearchByValue key={session} {...props} />
          case 'clear': return <HypergraphClear key={session} {...props} />
        }
        break
      case 'flow-network':
        switch (action) {
          case 'add-vertex': return <FlowNetworkAddVertex key={session} {...props} />
          case 'add-edge': return <FlowNetworkAddEdge key={session} {...props} />
          case 'remove-edge': return <FlowNetworkRemoveEdge key={session} {...props} />
          case 'update-capacity': return <FlowNetworkUpdateCapacity key={session} {...props} />
          case 'delete-value': return <FlowNetworkDeleteByValue key={session} {...props} />
          case 'search-value': return <FlowNetworkSearchByValue key={session} {...props} />
          case 'clear': return <FlowNetworkClear key={session} {...props} />
        }
        break
      case 'functional-graph':
        switch (action) {
          case 'add-vertex': return <FunctionalGraphAddVertex key={session} {...props} />
          case 'add-edge': return <FunctionalGraphSetSuccessor key={session} {...props} />
          case 'read-successor': return <FunctionalGraphReadSuccessor key={session} {...props} />
          case 'delete-value': return <FunctionalGraphDeleteByValue key={session} {...props} />
          case 'search-value': return <FunctionalGraphSearchByValue key={session} {...props} />
          case 'clear': return <FunctionalGraphClear key={session} {...props} />
        }
        break
      case 'adjacency-matrix':
        switch (action) {
          case 'add-vertex': return <AdjacencyMatrixAddVertex key={session} {...props} />
          case 'add-edge': return <AdjacencyMatrixAddEdge key={session} {...props} />
          case 'remove-edge': return <AdjacencyMatrixRemoveEdge key={session} {...props} />
          case 'delete-value': return <AdjacencyMatrixDeleteByValue key={session} {...props} />
          case 'search-value': return <AdjacencyMatrixSearchByValue key={session} {...props} />
          case 'inspect-storage': return <AdjacencyMatrixInspectStorage key={session} {...props} />
          case 'clear': return <AdjacencyMatrixClear key={session} {...props} />
        }
        break
      case 'adjacency-list':
        switch (action) {
          case 'add-vertex': return <AdjacencyListAddVertex key={session} {...props} />
          case 'add-edge': return <AdjacencyListAddEdge key={session} {...props} />
          case 'remove-edge': return <AdjacencyListRemoveEdge key={session} {...props} />
          case 'delete-value': return <AdjacencyListDeleteByValue key={session} {...props} />
          case 'search-value': return <AdjacencyListSearchByValue key={session} {...props} />
          case 'inspect-storage': return <AdjacencyListInspectStorage key={session} {...props} />
          case 'clear': return <AdjacencyListClear key={session} {...props} />
        }
        break
      case 'edge-list':
        switch (action) {
          case 'add-vertex': return <EdgeListAddVertex key={session} {...props} />
          case 'add-edge': return <EdgeListAddEdge key={session} {...props} />
          case 'remove-edge': return <EdgeListRemoveEdge key={session} {...props} />
          case 'delete-value': return <EdgeListDeleteByValue key={session} {...props} />
          case 'search-value': return <EdgeListSearchByValue key={session} {...props} />
          case 'inspect-storage': return <EdgeListInspectStorage key={session} {...props} />
          case 'clear': return <EdgeListClear key={session} {...props} />
        }
        break
      case 'compressed-sparse-row':
        switch (action) {
          case 'add-vertex': return <CompressedSparseRowAddVertex key={session} {...props} />
          case 'add-edge': return <CompressedSparseRowAddEdge key={session} {...props} />
          case 'remove-edge': return <CompressedSparseRowRemoveEdge key={session} {...props} />
          case 'delete-value': return <CompressedSparseRowDeleteByValue key={session} {...props} />
          case 'search-value': return <CompressedSparseRowSearchByValue key={session} {...props} />
          case 'inspect-storage': return <CompressedSparseRowInspectStorage key={session} {...props} />
          case 'clear': return <CompressedSparseRowClear key={session} {...props} />
        }
        break
    }
    return null
  }

  public static describe(action: ActionKind, model: ExtendedGraphModel): AlgorithmInformation | null {
    switch (model.kind) {
      case 'bipartite-graph':
        switch (action) {
          case 'add-vertex': return BipartiteGraphAddVertexSequence.describe(model.length, model.edgeCount)
          case 'add-edge': return BipartiteGraphAddEdgeSequence.describe(model.length, model.edgeCount)
          case 'remove-edge': return BipartiteGraphRemoveEdgeSequence.describe(model.length, model.edgeCount)
          case 'delete-value': return BipartiteGraphDeleteByValueSequence.describe(model.length, model.edgeCount)
          case 'search-value': return BipartiteGraphSearchByValueSequence.describe(model.length, model.edgeCount)
          case 'clear': return BipartiteGraphClearSequence.describe(model.length, model.edgeCount)
        }
        break
      case 'complete-graph':
        switch (action) {
          case 'add-vertex': return CompleteGraphAddVertexSequence.describe(model.length, model.edgeCount)
          case 'delete-value': return CompleteGraphDeleteByValueSequence.describe(model.length, model.edgeCount)
          case 'search-value': return CompleteGraphSearchByValueSequence.describe(model.length, model.edgeCount)
          case 'clear': return CompleteGraphClearSequence.describe(model.length, model.edgeCount)
        }
        break
      case 'tree-graph':
        switch (action) {
          case 'add-vertex': return TreeGraphAddVertexSequence.describe(model.length, model.edgeCount)
          case 'delete-value': return TreeGraphDeleteByValueSequence.describe(model.length, model.edgeCount)
          case 'search-value': return TreeGraphSearchByValueSequence.describe(model.length, model.edgeCount)
          case 'clear': return TreeGraphClearSequence.describe(model.length, model.edgeCount)
        }
        break
      case 'hypergraph':
        switch (action) {
          case 'add-vertex': return HypergraphAddVertexSequence.describe(model.length, model.edgeCount)
          case 'add-edge': return HypergraphAddEdgeSequence.describe(model.length, model.edgeCount)
          case 'remove-edge': return HypergraphRemoveEdgeSequence.describe(model.length, model.edgeCount)
          case 'delete-value': return HypergraphDeleteByValueSequence.describe(model.length, model.edgeCount)
          case 'search-value': return HypergraphSearchByValueSequence.describe(model.length, model.edgeCount)
          case 'clear': return HypergraphClearSequence.describe(model.length, model.edgeCount)
        }
        break
      case 'flow-network':
        switch (action) {
          case 'add-vertex': return FlowNetworkAddVertexSequence.describe(model.length, model.edgeCount)
          case 'add-edge': return FlowNetworkAddEdgeSequence.describe(model.length, model.edgeCount)
          case 'remove-edge': return FlowNetworkRemoveEdgeSequence.describe(model.length, model.edgeCount)
          case 'update-capacity': return FlowNetworkUpdateCapacitySequence.describe(model.length, model.edgeCount)
          case 'delete-value': return FlowNetworkDeleteByValueSequence.describe(model.length, model.edgeCount)
          case 'search-value': return FlowNetworkSearchByValueSequence.describe(model.length, model.edgeCount)
          case 'clear': return FlowNetworkClearSequence.describe(model.length, model.edgeCount)
        }
        break
      case 'functional-graph':
        switch (action) {
          case 'add-vertex': return FunctionalGraphAddVertexSequence.describe(model.length, model.edgeCount)
          case 'add-edge': return FunctionalGraphSetSuccessorSequence.describe(model.length, model.edgeCount)
          case 'read-successor': return FunctionalGraphReadSuccessorSequence.describe(model.length, model.edgeCount)
          case 'delete-value': return FunctionalGraphDeleteByValueSequence.describe(model.length, model.edgeCount)
          case 'search-value': return FunctionalGraphSearchByValueSequence.describe(model.length, model.edgeCount)
          case 'clear': return FunctionalGraphClearSequence.describe(model.length, model.edgeCount)
        }
        break
      case 'adjacency-matrix':
        switch (action) {
          case 'add-vertex': return AdjacencyMatrixAddVertexSequence.describe(model.length, model.edgeCount)
          case 'add-edge': return AdjacencyMatrixAddEdgeSequence.describe(model.length, model.edgeCount)
          case 'remove-edge': return AdjacencyMatrixRemoveEdgeSequence.describe(model.length, model.edgeCount)
          case 'delete-value': return AdjacencyMatrixDeleteByValueSequence.describe(model.length, model.edgeCount)
          case 'search-value': return AdjacencyMatrixSearchByValueSequence.describe(model.length, model.edgeCount)
          case 'inspect-storage': return AdjacencyMatrixInspectStorageSequence.describe(model.length, model.edgeCount)
          case 'clear': return AdjacencyMatrixClearSequence.describe(model.length, model.edgeCount)
        }
        break
      case 'adjacency-list':
        switch (action) {
          case 'add-vertex': return AdjacencyListAddVertexSequence.describe(model.length, model.edgeCount)
          case 'add-edge': return AdjacencyListAddEdgeSequence.describe(model.length, model.edgeCount)
          case 'remove-edge': return AdjacencyListRemoveEdgeSequence.describe(model.length, model.edgeCount)
          case 'delete-value': return AdjacencyListDeleteByValueSequence.describe(model.length, model.edgeCount)
          case 'search-value': return AdjacencyListSearchByValueSequence.describe(model.length, model.edgeCount)
          case 'inspect-storage': return AdjacencyListInspectStorageSequence.describe(model.length, model.edgeCount)
          case 'clear': return AdjacencyListClearSequence.describe(model.length, model.edgeCount)
        }
        break
      case 'edge-list':
        switch (action) {
          case 'add-vertex': return EdgeListAddVertexSequence.describe(model.length, model.edgeCount)
          case 'add-edge': return EdgeListAddEdgeSequence.describe(model.length, model.edgeCount)
          case 'remove-edge': return EdgeListRemoveEdgeSequence.describe(model.length, model.edgeCount)
          case 'delete-value': return EdgeListDeleteByValueSequence.describe(model.length, model.edgeCount)
          case 'search-value': return EdgeListSearchByValueSequence.describe(model.length, model.edgeCount)
          case 'inspect-storage': return EdgeListInspectStorageSequence.describe(model.length, model.edgeCount)
          case 'clear': return EdgeListClearSequence.describe(model.length, model.edgeCount)
        }
        break
      case 'compressed-sparse-row':
        switch (action) {
          case 'add-vertex': return CompressedSparseRowAddVertexSequence.describe(model.length, model.edgeCount)
          case 'add-edge': return CompressedSparseRowAddEdgeSequence.describe(model.length, model.edgeCount)
          case 'remove-edge': return CompressedSparseRowRemoveEdgeSequence.describe(model.length, model.edgeCount)
          case 'delete-value': return CompressedSparseRowDeleteByValueSequence.describe(model.length, model.edgeCount)
          case 'search-value': return CompressedSparseRowSearchByValueSequence.describe(model.length, model.edgeCount)
          case 'inspect-storage': return CompressedSparseRowInspectStorageSequence.describe(model.length, model.edgeCount)
          case 'clear': return CompressedSparseRowClearSequence.describe(model.length, model.edgeCount)
        }
        break
    }
    return null
  }
}
