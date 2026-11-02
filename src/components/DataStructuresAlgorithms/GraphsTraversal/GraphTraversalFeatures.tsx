import type { ReactNode } from 'react'
import type { ActionKind } from '../../../visualization/ActionCatalog.ts'
import type { AlgorithmInformation } from '../../../visualization/AlgorithmInformation.ts'
import type { GraphModel } from '../../../visualization/GraphModel.ts'
import type { StructuredGraphActionProps } from '../../ActionPlayback/StructuredGraphAction.tsx'
import SimpleGraphBreadthFirst from './SimpleGraph/BreadthFirst/BreadthFirst.tsx'
import { BreadthFirstAnimation as SimpleGraphBreadthFirstSequence } from './SimpleGraph/BreadthFirst/BreadthFirstAnimation.ts'
import SimpleGraphDepthFirst from './SimpleGraph/DepthFirst/DepthFirst.tsx'
import { DepthFirstAnimation as SimpleGraphDepthFirstSequence } from './SimpleGraph/DepthFirst/DepthFirstAnimation.ts'
import DirectedGraphBreadthFirst from './DirectedGraph/BreadthFirst/BreadthFirst.tsx'
import { BreadthFirstAnimation as DirectedGraphBreadthFirstSequence } from './DirectedGraph/BreadthFirst/BreadthFirstAnimation.ts'
import DirectedGraphDepthFirst from './DirectedGraph/DepthFirst/DepthFirst.tsx'
import { DepthFirstAnimation as DirectedGraphDepthFirstSequence } from './DirectedGraph/DepthFirst/DepthFirstAnimation.ts'
import WeightedGraphBreadthFirst from './WeightedGraph/BreadthFirst/BreadthFirst.tsx'
import { BreadthFirstAnimation as WeightedGraphBreadthFirstSequence } from './WeightedGraph/BreadthFirst/BreadthFirstAnimation.ts'
import WeightedGraphDepthFirst from './WeightedGraph/DepthFirst/DepthFirst.tsx'
import { DepthFirstAnimation as WeightedGraphDepthFirstSequence } from './WeightedGraph/DepthFirst/DepthFirstAnimation.ts'
import WeightedGraphShortestPath from './WeightedGraph/ShortestPath/ShortestPath.tsx'
import { ShortestPathAnimation as WeightedGraphShortestPathSequence } from './WeightedGraph/ShortestPath/ShortestPathAnimation.ts'
import DAGBreadthFirst from './DAG/BreadthFirst/BreadthFirst.tsx'
import { BreadthFirstAnimation as DAGBreadthFirstSequence } from './DAG/BreadthFirst/BreadthFirstAnimation.ts'
import DAGDepthFirst from './DAG/DepthFirst/DepthFirst.tsx'
import { DepthFirstAnimation as DAGDepthFirstSequence } from './DAG/DepthFirst/DepthFirstAnimation.ts'
import DAGTopologicalSort from './DAG/TopologicalSort/TopologicalSort.tsx'
import { TopologicalSortAnimation as DAGTopologicalSortSequence } from './DAG/TopologicalSort/TopologicalSortAnimation.ts'
import MultigraphBreadthFirst from './Multigraph/BreadthFirst/BreadthFirst.tsx'
import { BreadthFirstAnimation as MultigraphBreadthFirstSequence } from './Multigraph/BreadthFirst/BreadthFirstAnimation.ts'
import MultigraphDepthFirst from './Multigraph/DepthFirst/DepthFirst.tsx'
import { DepthFirstAnimation as MultigraphDepthFirstSequence } from './Multigraph/DepthFirst/DepthFirstAnimation.ts'

export class GraphTraversalFeatures {
  public static render(action: ActionKind, props: StructuredGraphActionProps, session: number): ReactNode {
    switch (props.model.kind) {
      case 'graph':
        switch (action) {
          case 'breadth-first': return <SimpleGraphBreadthFirst key={session} {...props} />
          case 'depth-first': return <SimpleGraphDepthFirst key={session} {...props} />
        }
        break
      case 'directed-graph':
        switch (action) {
          case 'breadth-first': return <DirectedGraphBreadthFirst key={session} {...props} />
          case 'depth-first': return <DirectedGraphDepthFirst key={session} {...props} />
        }
        break
      case 'weighted-graph':
        switch (action) {
          case 'breadth-first': return <WeightedGraphBreadthFirst key={session} {...props} />
          case 'depth-first': return <WeightedGraphDepthFirst key={session} {...props} />
          case 'shortest-path': return <WeightedGraphShortestPath key={session} {...props} />
        }
        break
      case 'dag':
        switch (action) {
          case 'breadth-first': return <DAGBreadthFirst key={session} {...props} />
          case 'depth-first': return <DAGDepthFirst key={session} {...props} />
          case 'topological-sort': return <DAGTopologicalSort key={session} {...props} />
        }
        break
      case 'multigraph':
        switch (action) {
          case 'breadth-first': return <MultigraphBreadthFirst key={session} {...props} />
          case 'depth-first': return <MultigraphDepthFirst key={session} {...props} />
        }
        break
    }
    return null
  }

  public static describe(action: ActionKind, model: GraphModel): AlgorithmInformation | null {
    switch (model.kind) {
      case 'graph':
        switch (action) {
          case 'breadth-first': return SimpleGraphBreadthFirstSequence.describe(model.length, model.edgeCount)
          case 'depth-first': return SimpleGraphDepthFirstSequence.describe(model.length, model.edgeCount)
        }
        break
      case 'directed-graph':
        switch (action) {
          case 'breadth-first': return DirectedGraphBreadthFirstSequence.describe(model.length, model.edgeCount)
          case 'depth-first': return DirectedGraphDepthFirstSequence.describe(model.length, model.edgeCount)
        }
        break
      case 'weighted-graph':
        switch (action) {
          case 'breadth-first': return WeightedGraphBreadthFirstSequence.describe(model.length, model.edgeCount)
          case 'depth-first': return WeightedGraphDepthFirstSequence.describe(model.length, model.edgeCount)
          case 'shortest-path': return WeightedGraphShortestPathSequence.describe(model.length, model.edgeCount)
        }
        break
      case 'dag':
        switch (action) {
          case 'breadth-first': return DAGBreadthFirstSequence.describe(model.length, model.edgeCount)
          case 'depth-first': return DAGDepthFirstSequence.describe(model.length, model.edgeCount)
          case 'topological-sort': return DAGTopologicalSortSequence.describe(model.length, model.edgeCount)
        }
        break
      case 'multigraph':
        switch (action) {
          case 'breadth-first': return MultigraphBreadthFirstSequence.describe(model.length, model.edgeCount)
          case 'depth-first': return MultigraphDepthFirstSequence.describe(model.length, model.edgeCount)
        }
        break
    }
    return null
  }
}
