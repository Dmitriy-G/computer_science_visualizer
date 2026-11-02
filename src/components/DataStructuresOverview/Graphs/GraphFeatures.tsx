import type { ReactNode } from 'react'
import type { ActionKind } from '../../../visualization/ActionCatalog.ts'
import type { AlgorithmInformation } from '../../../visualization/AlgorithmInformation.ts'
import type { GraphModel } from '../../../visualization/GraphModel.ts'
import type { StructuredGraphActionProps } from '../../ActionPlayback/StructuredGraphAction.tsx'
import SimpleGraphAddVertex from './SimpleGraph/AddVertex/AddVertex.tsx'
import { AddVertexAnimation as SimpleGraphAddVertexSequence } from './SimpleGraph/AddVertex/AddVertexAnimation.ts'
import SimpleGraphAddEdge from './SimpleGraph/AddEdge/AddEdge.tsx'
import { AddEdgeAnimation as SimpleGraphAddEdgeSequence } from './SimpleGraph/AddEdge/AddEdgeAnimation.ts'
import SimpleGraphRemoveEdge from './SimpleGraph/RemoveEdge/RemoveEdge.tsx'
import { RemoveEdgeAnimation as SimpleGraphRemoveEdgeSequence } from './SimpleGraph/RemoveEdge/RemoveEdgeAnimation.ts'
import SimpleGraphDeleteByValue from './SimpleGraph/DeleteByValue/DeleteByValue.tsx'
import { GraphDeleteByValueAnimation as SimpleGraphDeleteByValueSequence } from './SimpleGraph/DeleteByValue/GraphDeleteByValueAnimation.ts'
import SimpleGraphSearchByValue from './SimpleGraph/SearchByValue/SearchByValue.tsx'
import { GraphSearchByValueAnimation as SimpleGraphSearchByValueSequence } from './SimpleGraph/SearchByValue/GraphSearchByValueAnimation.ts'
import SimpleGraphClear from './SimpleGraph/Clear/Clear.tsx'
import { GraphClearAnimation as SimpleGraphClearSequence } from './SimpleGraph/Clear/GraphClearAnimation.ts'
import DirectedGraphAddVertex from './DirectedGraph/AddVertex/AddVertex.tsx'
import { AddVertexAnimation as DirectedGraphAddVertexSequence } from './DirectedGraph/AddVertex/AddVertexAnimation.ts'
import DirectedGraphAddEdge from './DirectedGraph/AddEdge/AddEdge.tsx'
import { AddEdgeAnimation as DirectedGraphAddEdgeSequence } from './DirectedGraph/AddEdge/AddEdgeAnimation.ts'
import DirectedGraphRemoveEdge from './DirectedGraph/RemoveEdge/RemoveEdge.tsx'
import { RemoveEdgeAnimation as DirectedGraphRemoveEdgeSequence } from './DirectedGraph/RemoveEdge/RemoveEdgeAnimation.ts'
import DirectedGraphDeleteByValue from './DirectedGraph/DeleteByValue/DeleteByValue.tsx'
import { DeleteByValueAnimation as DirectedGraphDeleteByValueSequence } from './DirectedGraph/DeleteByValue/DeleteByValueAnimation.ts'
import DirectedGraphSearchByValue from './DirectedGraph/SearchByValue/SearchByValue.tsx'
import { SearchByValueAnimation as DirectedGraphSearchByValueSequence } from './DirectedGraph/SearchByValue/SearchByValueAnimation.ts'
import DirectedGraphClear from './DirectedGraph/Clear/Clear.tsx'
import { ClearAnimation as DirectedGraphClearSequence } from './DirectedGraph/Clear/ClearAnimation.ts'
import WeightedGraphAddVertex from './WeightedGraph/AddVertex/AddVertex.tsx'
import { AddVertexAnimation as WeightedGraphAddVertexSequence } from './WeightedGraph/AddVertex/AddVertexAnimation.ts'
import WeightedGraphAddEdge from './WeightedGraph/AddEdge/AddEdge.tsx'
import { AddEdgeAnimation as WeightedGraphAddEdgeSequence } from './WeightedGraph/AddEdge/AddEdgeAnimation.ts'
import WeightedGraphRemoveEdge from './WeightedGraph/RemoveEdge/RemoveEdge.tsx'
import { RemoveEdgeAnimation as WeightedGraphRemoveEdgeSequence } from './WeightedGraph/RemoveEdge/RemoveEdgeAnimation.ts'
import WeightedGraphDeleteByValue from './WeightedGraph/DeleteByValue/DeleteByValue.tsx'
import { DeleteByValueAnimation as WeightedGraphDeleteByValueSequence } from './WeightedGraph/DeleteByValue/DeleteByValueAnimation.ts'
import WeightedGraphSearchByValue from './WeightedGraph/SearchByValue/SearchByValue.tsx'
import { SearchByValueAnimation as WeightedGraphSearchByValueSequence } from './WeightedGraph/SearchByValue/SearchByValueAnimation.ts'
import WeightedGraphClear from './WeightedGraph/Clear/Clear.tsx'
import { ClearAnimation as WeightedGraphClearSequence } from './WeightedGraph/Clear/ClearAnimation.ts'
import WeightedGraphUpdateWeight from './WeightedGraph/UpdateWeight/UpdateWeight.tsx'
import { UpdateWeightAnimation as WeightedGraphUpdateWeightSequence } from './WeightedGraph/UpdateWeight/UpdateWeightAnimation.ts'
import DAGAddVertex from './DAG/AddVertex/AddVertex.tsx'
import { AddVertexAnimation as DAGAddVertexSequence } from './DAG/AddVertex/AddVertexAnimation.ts'
import DAGAddEdge from './DAG/AddEdge/AddEdge.tsx'
import { AddEdgeAnimation as DAGAddEdgeSequence } from './DAG/AddEdge/AddEdgeAnimation.ts'
import DAGRemoveEdge from './DAG/RemoveEdge/RemoveEdge.tsx'
import { RemoveEdgeAnimation as DAGRemoveEdgeSequence } from './DAG/RemoveEdge/RemoveEdgeAnimation.ts'
import DAGDeleteByValue from './DAG/DeleteByValue/DeleteByValue.tsx'
import { DeleteByValueAnimation as DAGDeleteByValueSequence } from './DAG/DeleteByValue/DeleteByValueAnimation.ts'
import DAGSearchByValue from './DAG/SearchByValue/SearchByValue.tsx'
import { SearchByValueAnimation as DAGSearchByValueSequence } from './DAG/SearchByValue/SearchByValueAnimation.ts'
import DAGClear from './DAG/Clear/Clear.tsx'
import { ClearAnimation as DAGClearSequence } from './DAG/Clear/ClearAnimation.ts'
import MultigraphAddVertex from './Multigraph/AddVertex/AddVertex.tsx'
import { AddVertexAnimation as MultigraphAddVertexSequence } from './Multigraph/AddVertex/AddVertexAnimation.ts'
import MultigraphAddEdge from './Multigraph/AddEdge/AddEdge.tsx'
import { AddEdgeAnimation as MultigraphAddEdgeSequence } from './Multigraph/AddEdge/AddEdgeAnimation.ts'
import MultigraphRemoveEdge from './Multigraph/RemoveEdge/RemoveEdge.tsx'
import { RemoveEdgeAnimation as MultigraphRemoveEdgeSequence } from './Multigraph/RemoveEdge/RemoveEdgeAnimation.ts'
import MultigraphDeleteByValue from './Multigraph/DeleteByValue/DeleteByValue.tsx'
import { DeleteByValueAnimation as MultigraphDeleteByValueSequence } from './Multigraph/DeleteByValue/DeleteByValueAnimation.ts'
import MultigraphSearchByValue from './Multigraph/SearchByValue/SearchByValue.tsx'
import { SearchByValueAnimation as MultigraphSearchByValueSequence } from './Multigraph/SearchByValue/SearchByValueAnimation.ts'
import MultigraphClear from './Multigraph/Clear/Clear.tsx'
import { ClearAnimation as MultigraphClearSequence } from './Multigraph/Clear/ClearAnimation.ts'

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
