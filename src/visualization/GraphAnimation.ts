import { AnimationSequence } from './AnimationSequence.ts'
import type { ActionKind } from './ActionCatalog.ts'
import type { GraphInputValues, GraphModel, GraphTraceEvent, GraphTraceObserver } from './GraphModel.ts'
import { GraphSceneLayout } from './GraphSceneLayout.ts'

export class GraphAnimation extends AnimationSequence implements GraphTraceObserver {
  public readonly result: GraphModel
  private readonly layout: GraphSceneLayout
  private readonly originalSize: number
  private readonly visited: string[] = []

  constructor(model: GraphModel, layout: GraphSceneLayout, action: ActionKind, input: GraphInputValues, title: string, summary: string) {
    super()
    this.result = model.clone()
    this.layout = layout
    this.originalSize = model.length
    this.add(1, 'Inspect the graph', summary, 'inspect vertices and edges', layout.create(this.result))
    const outcome = this.result.execute(action, input, this)
    this.add(3, title, outcome.description, outcome.code, layout.create(this.result, {
      visitedIds: this.visited, activeIds: outcome.activeIds, edgeIds: outcome.edgeIds,
      status: outcome.error ? 'REJECTED' : 'RESULT',
    }))
  }

  public onGraphChange(event: GraphTraceEvent): void {
    if (event.activeId && !this.visited.includes(event.activeId)) this.visited.push(event.activeId)
    this.add(2, event.title, event.description, event.code, this.layout.create(this.result, {
      count: this.originalSize, visitedIds: this.visited,
      activeIds: event.activeId ? [event.activeId] : [], edgeIds: event.edgeId ? [event.edgeId] : [],
    }))
  }
}
