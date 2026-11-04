import type { ReactNode } from 'react'
import type { ActionKind } from '../../visualization/ActionCatalog.ts'
import type { AlgorithmInformation } from '../../visualization/AlgorithmInformation.ts'
import type { GraphModel } from '../../visualization/GraphModel.ts'
import type { StructuredGraphActionProps } from '../ActionPlayback/StructuredGraphAction.tsx'
import SimpleGraphAddVertex from '../FundamentalDataStructures/Graphs/SimpleGraph/AddVertex/AddVertex.tsx'
import { AddVertexAnimation as SimpleGraphAddVertexSequence } from '../FundamentalDataStructures/Graphs/SimpleGraph/AddVertex/AddVertexAnimation.ts'
import SimpleGraphAddEdge from '../FundamentalDataStructures/Graphs/SimpleGraph/AddEdge/AddEdge.tsx'
import { AddEdgeAnimation as SimpleGraphAddEdgeSequence } from '../FundamentalDataStructures/Graphs/SimpleGraph/AddEdge/AddEdgeAnimation.ts'
import SimpleGraphRemoveEdge from '../FundamentalDataStructures/Graphs/SimpleGraph/RemoveEdge/RemoveEdge.tsx'
import { RemoveEdgeAnimation as SimpleGraphRemoveEdgeSequence } from '../FundamentalDataStructures/Graphs/SimpleGraph/RemoveEdge/RemoveEdgeAnimation.ts'
import SimpleGraphDeleteByValue from '../FundamentalDataStructures/Graphs/SimpleGraph/DeleteByValue/DeleteByValue.tsx'
import { GraphDeleteByValueAnimation as SimpleGraphDeleteByValueSequence } from '../FundamentalDataStructures/Graphs/SimpleGraph/DeleteByValue/GraphDeleteByValueAnimation.ts'
import SimpleGraphSearchByValue from '../FundamentalDataStructures/Graphs/SimpleGraph/SearchByValue/SearchByValue.tsx'
import { GraphSearchByValueAnimation as SimpleGraphSearchByValueSequence } from '../FundamentalDataStructures/Graphs/SimpleGraph/SearchByValue/GraphSearchByValueAnimation.ts'
import SimpleGraphClear from '../FundamentalDataStructures/Graphs/SimpleGraph/Clear/Clear.tsx'
import { GraphClearAnimation as SimpleGraphClearSequence } from '../FundamentalDataStructures/Graphs/SimpleGraph/Clear/GraphClearAnimation.ts'
import DirectedGraphAddVertex from '../FundamentalDataStructures/Graphs/DirectedGraph/AddVertex/AddVertex.tsx'
import { AddVertexAnimation as DirectedGraphAddVertexSequence } from '../FundamentalDataStructures/Graphs/DirectedGraph/AddVertex/AddVertexAnimation.ts'
import DirectedGraphAddEdge from '../FundamentalDataStructures/Graphs/DirectedGraph/AddEdge/AddEdge.tsx'
import { AddEdgeAnimation as DirectedGraphAddEdgeSequence } from '../FundamentalDataStructures/Graphs/DirectedGraph/AddEdge/AddEdgeAnimation.ts'
import DirectedGraphRemoveEdge from '../FundamentalDataStructures/Graphs/DirectedGraph/RemoveEdge/RemoveEdge.tsx'
import { RemoveEdgeAnimation as DirectedGraphRemoveEdgeSequence } from '../FundamentalDataStructures/Graphs/DirectedGraph/RemoveEdge/RemoveEdgeAnimation.ts'
import DirectedGraphDeleteByValue from '../FundamentalDataStructures/Graphs/DirectedGraph/DeleteByValue/DeleteByValue.tsx'
import { DeleteByValueAnimation as DirectedGraphDeleteByValueSequence } from '../FundamentalDataStructures/Graphs/DirectedGraph/DeleteByValue/DeleteByValueAnimation.ts'
import DirectedGraphSearchByValue from '../FundamentalDataStructures/Graphs/DirectedGraph/SearchByValue/SearchByValue.tsx'
import { SearchByValueAnimation as DirectedGraphSearchByValueSequence } from '../FundamentalDataStructures/Graphs/DirectedGraph/SearchByValue/SearchByValueAnimation.ts'
import DirectedGraphClear from '../FundamentalDataStructures/Graphs/DirectedGraph/Clear/Clear.tsx'
import { ClearAnimation as DirectedGraphClearSequence } from '../FundamentalDataStructures/Graphs/DirectedGraph/Clear/ClearAnimation.ts'
import WeightedGraphAddVertex from '../FundamentalDataStructures/Graphs/WeightedGraph/AddVertex/AddVertex.tsx'
import { AddVertexAnimation as WeightedGraphAddVertexSequence } from '../FundamentalDataStructures/Graphs/WeightedGraph/AddVertex/AddVertexAnimation.ts'
import WeightedGraphAddEdge from '../FundamentalDataStructures/Graphs/WeightedGraph/AddEdge/AddEdge.tsx'
import { AddEdgeAnimation as WeightedGraphAddEdgeSequence } from '../FundamentalDataStructures/Graphs/WeightedGraph/AddEdge/AddEdgeAnimation.ts'
import WeightedGraphRemoveEdge from '../FundamentalDataStructures/Graphs/WeightedGraph/RemoveEdge/RemoveEdge.tsx'
import { RemoveEdgeAnimation as WeightedGraphRemoveEdgeSequence } from '../FundamentalDataStructures/Graphs/WeightedGraph/RemoveEdge/RemoveEdgeAnimation.ts'
import WeightedGraphDeleteByValue from '../FundamentalDataStructures/Graphs/WeightedGraph/DeleteByValue/DeleteByValue.tsx'
import { DeleteByValueAnimation as WeightedGraphDeleteByValueSequence } from '../FundamentalDataStructures/Graphs/WeightedGraph/DeleteByValue/DeleteByValueAnimation.ts'
import WeightedGraphSearchByValue from '../FundamentalDataStructures/Graphs/WeightedGraph/SearchByValue/SearchByValue.tsx'
import { SearchByValueAnimation as WeightedGraphSearchByValueSequence } from '../FundamentalDataStructures/Graphs/WeightedGraph/SearchByValue/SearchByValueAnimation.ts'
import WeightedGraphClear from '../FundamentalDataStructures/Graphs/WeightedGraph/Clear/Clear.tsx'
import { ClearAnimation as WeightedGraphClearSequence } from '../FundamentalDataStructures/Graphs/WeightedGraph/Clear/ClearAnimation.ts'
import WeightedGraphUpdateWeight from '../FundamentalDataStructures/Graphs/WeightedGraph/UpdateWeight/UpdateWeight.tsx'
import { UpdateWeightAnimation as WeightedGraphUpdateWeightSequence } from '../FundamentalDataStructures/Graphs/WeightedGraph/UpdateWeight/UpdateWeightAnimation.ts'
import DAGAddVertex from '../FundamentalDataStructures/Graphs/DAG/AddVertex/AddVertex.tsx'
import { AddVertexAnimation as DAGAddVertexSequence } from '../FundamentalDataStructures/Graphs/DAG/AddVertex/AddVertexAnimation.ts'
import DAGAddEdge from '../FundamentalDataStructures/Graphs/DAG/AddEdge/AddEdge.tsx'
import { AddEdgeAnimation as DAGAddEdgeSequence } from '../FundamentalDataStructures/Graphs/DAG/AddEdge/AddEdgeAnimation.ts'
import DAGRemoveEdge from '../FundamentalDataStructures/Graphs/DAG/RemoveEdge/RemoveEdge.tsx'
import { RemoveEdgeAnimation as DAGRemoveEdgeSequence } from '../FundamentalDataStructures/Graphs/DAG/RemoveEdge/RemoveEdgeAnimation.ts'
import DAGDeleteByValue from '../FundamentalDataStructures/Graphs/DAG/DeleteByValue/DeleteByValue.tsx'
import { DeleteByValueAnimation as DAGDeleteByValueSequence } from '../FundamentalDataStructures/Graphs/DAG/DeleteByValue/DeleteByValueAnimation.ts'
import DAGSearchByValue from '../FundamentalDataStructures/Graphs/DAG/SearchByValue/SearchByValue.tsx'
import { SearchByValueAnimation as DAGSearchByValueSequence } from '../FundamentalDataStructures/Graphs/DAG/SearchByValue/SearchByValueAnimation.ts'
import DAGClear from '../FundamentalDataStructures/Graphs/DAG/Clear/Clear.tsx'
import { ClearAnimation as DAGClearSequence } from '../FundamentalDataStructures/Graphs/DAG/Clear/ClearAnimation.ts'
import MultigraphAddVertex from '../FundamentalDataStructures/Graphs/Multigraph/AddVertex/AddVertex.tsx'
import { AddVertexAnimation as MultigraphAddVertexSequence } from '../FundamentalDataStructures/Graphs/Multigraph/AddVertex/AddVertexAnimation.ts'
import MultigraphAddEdge from '../FundamentalDataStructures/Graphs/Multigraph/AddEdge/AddEdge.tsx'
import { AddEdgeAnimation as MultigraphAddEdgeSequence } from '../FundamentalDataStructures/Graphs/Multigraph/AddEdge/AddEdgeAnimation.ts'
import MultigraphRemoveEdge from '../FundamentalDataStructures/Graphs/Multigraph/RemoveEdge/RemoveEdge.tsx'
import { RemoveEdgeAnimation as MultigraphRemoveEdgeSequence } from '../FundamentalDataStructures/Graphs/Multigraph/RemoveEdge/RemoveEdgeAnimation.ts'
import MultigraphDeleteByValue from '../FundamentalDataStructures/Graphs/Multigraph/DeleteByValue/DeleteByValue.tsx'
import { DeleteByValueAnimation as MultigraphDeleteByValueSequence } from '../FundamentalDataStructures/Graphs/Multigraph/DeleteByValue/DeleteByValueAnimation.ts'
import MultigraphSearchByValue from '../FundamentalDataStructures/Graphs/Multigraph/SearchByValue/SearchByValue.tsx'
import { SearchByValueAnimation as MultigraphSearchByValueSequence } from '../FundamentalDataStructures/Graphs/Multigraph/SearchByValue/SearchByValueAnimation.ts'
import MultigraphClear from '../FundamentalDataStructures/Graphs/Multigraph/Clear/Clear.tsx'
import { ClearAnimation as MultigraphClearSequence } from '../FundamentalDataStructures/Graphs/Multigraph/Clear/ClearAnimation.ts'

export class GraphFeatures {
  public static render(action: ActionKind, props: StructuredGraphActionProps, session: number): ReactNode {
    switch (props.model.kind) {
      case 'graph':
        switch (action) {
          case 'add-vertex': return <SimpleGraphAddVertex key={session} {...props} />
          case 'add-edge': return <SimpleGraphAddEdge key={session} {...props} />
          case 'remove-edge': return <SimpleGraphRemoveEdge key={session} {...props} />
          case 'delete-value': return <SimpleGraphDeleteByValue key={session} {...props} />
          case 'search-value': return <SimpleGraphSearchByValue key={session} {...props} />
          case 'clear': return <SimpleGraphClear key={session} {...props} />
        }
        break
      case 'directed-graph':
        switch (action) {
          case 'add-vertex': return <DirectedGraphAddVertex key={session} {...props} />
          case 'add-edge': return <DirectedGraphAddEdge key={session} {...props} />
          case 'remove-edge': return <DirectedGraphRemoveEdge key={session} {...props} />
          case 'delete-value': return <DirectedGraphDeleteByValue key={session} {...props} />
          case 'search-value': return <DirectedGraphSearchByValue key={session} {...props} />
          case 'clear': return <DirectedGraphClear key={session} {...props} />
        }
        break
      case 'weighted-graph':
        switch (action) {
          case 'add-vertex': return <WeightedGraphAddVertex key={session} {...props} />
          case 'add-edge': return <WeightedGraphAddEdge key={session} {...props} />
          case 'remove-edge': return <WeightedGraphRemoveEdge key={session} {...props} />
          case 'delete-value': return <WeightedGraphDeleteByValue key={session} {...props} />
          case 'search-value': return <WeightedGraphSearchByValue key={session} {...props} />
          case 'clear': return <WeightedGraphClear key={session} {...props} />
          case 'update-weight': return <WeightedGraphUpdateWeight key={session} {...props} />
        }
        break
      case 'dag':
        switch (action) {
          case 'add-vertex': return <DAGAddVertex key={session} {...props} />
          case 'add-edge': return <DAGAddEdge key={session} {...props} />
          case 'remove-edge': return <DAGRemoveEdge key={session} {...props} />
          case 'delete-value': return <DAGDeleteByValue key={session} {...props} />
          case 'search-value': return <DAGSearchByValue key={session} {...props} />
          case 'clear': return <DAGClear key={session} {...props} />
        }
        break
      case 'multigraph':
        switch (action) {
          case 'add-vertex': return <MultigraphAddVertex key={session} {...props} />
          case 'add-edge': return <MultigraphAddEdge key={session} {...props} />
          case 'remove-edge': return <MultigraphRemoveEdge key={session} {...props} />
          case 'delete-value': return <MultigraphDeleteByValue key={session} {...props} />
          case 'search-value': return <MultigraphSearchByValue key={session} {...props} />
          case 'clear': return <MultigraphClear key={session} {...props} />
        }
        break
    }
    return null
  }

  public static describe(action: ActionKind, model: GraphModel): AlgorithmInformation | null {
    switch (model.kind) {
      case 'graph':
        switch (action) {
          case 'add-vertex': return SimpleGraphAddVertexSequence.describe(model.length, model.edgeCount)
          case 'add-edge': return SimpleGraphAddEdgeSequence.describe(model.length, model.edgeCount)
          case 'remove-edge': return SimpleGraphRemoveEdgeSequence.describe(model.length, model.edgeCount)
          case 'delete-value': return SimpleGraphDeleteByValueSequence.describe(model.length, model.edgeCount)
          case 'search-value': return SimpleGraphSearchByValueSequence.describe(model.length, model.edgeCount)
          case 'clear': return SimpleGraphClearSequence.describe(model.length, model.edgeCount)
        }
        break
      case 'directed-graph':
        switch (action) {
          case 'add-vertex': return DirectedGraphAddVertexSequence.describe(model.length, model.edgeCount)
          case 'add-edge': return DirectedGraphAddEdgeSequence.describe(model.length, model.edgeCount)
          case 'remove-edge': return DirectedGraphRemoveEdgeSequence.describe(model.length, model.edgeCount)
          case 'delete-value': return DirectedGraphDeleteByValueSequence.describe(model.length, model.edgeCount)
          case 'search-value': return DirectedGraphSearchByValueSequence.describe(model.length, model.edgeCount)
          case 'clear': return DirectedGraphClearSequence.describe(model.length, model.edgeCount)
        }
        break
      case 'weighted-graph':
        switch (action) {
          case 'add-vertex': return WeightedGraphAddVertexSequence.describe(model.length, model.edgeCount)
          case 'add-edge': return WeightedGraphAddEdgeSequence.describe(model.length, model.edgeCount)
          case 'remove-edge': return WeightedGraphRemoveEdgeSequence.describe(model.length, model.edgeCount)
          case 'delete-value': return WeightedGraphDeleteByValueSequence.describe(model.length, model.edgeCount)
          case 'search-value': return WeightedGraphSearchByValueSequence.describe(model.length, model.edgeCount)
          case 'clear': return WeightedGraphClearSequence.describe(model.length, model.edgeCount)
          case 'update-weight': return WeightedGraphUpdateWeightSequence.describe(model.length, model.edgeCount)
        }
        break
      case 'dag':
        switch (action) {
          case 'add-vertex': return DAGAddVertexSequence.describe(model.length, model.edgeCount)
          case 'add-edge': return DAGAddEdgeSequence.describe(model.length, model.edgeCount)
          case 'remove-edge': return DAGRemoveEdgeSequence.describe(model.length, model.edgeCount)
          case 'delete-value': return DAGDeleteByValueSequence.describe(model.length, model.edgeCount)
          case 'search-value': return DAGSearchByValueSequence.describe(model.length, model.edgeCount)
          case 'clear': return DAGClearSequence.describe(model.length, model.edgeCount)
        }
        break
      case 'multigraph':
        switch (action) {
          case 'add-vertex': return MultigraphAddVertexSequence.describe(model.length, model.edgeCount)
          case 'add-edge': return MultigraphAddEdgeSequence.describe(model.length, model.edgeCount)
          case 'remove-edge': return MultigraphRemoveEdgeSequence.describe(model.length, model.edgeCount)
          case 'delete-value': return MultigraphDeleteByValueSequence.describe(model.length, model.edgeCount)
          case 'search-value': return MultigraphSearchByValueSequence.describe(model.length, model.edgeCount)
          case 'clear': return MultigraphClearSequence.describe(model.length, model.edgeCount)
        }
        break
    }
    return null
  }
}
