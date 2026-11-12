import { AppliedModel } from './AppliedModel.ts'
import { AnimationSequence } from './AnimationSequence.ts'
import type { ActionKind } from './ActionCatalog.ts'
import type { LinearInputValues, LinearModel, LinearObserver, LinearSceneFactory, LinearTraceEvent } from './LinearModel.ts'

export class LinearAnimation extends AnimationSequence implements LinearObserver {
  public static readonly maximumDetailedFrames = 96
  public readonly result: LinearModel
  private readonly originalSize: number
  private readonly layout: LinearSceneFactory
  private readonly visited = new Set<string>()
  private recordedFrames = 0
  private omittedFrames = 0

  constructor(model: LinearModel, layout: LinearSceneFactory, action: ActionKind, input: LinearInputValues, title: string, summary: string) {
    super()
    this.result = model.clone()
    this.originalSize = model.length
    this.layout = layout
    this.add(1, title, summary, 'inspect structure', layout.create(this.result))
    const result = this.result.execute(action, input, this)
    const query = (model instanceof AppliedModel && AppliedModel.isQuery(action)) || action === 'find-set' || action === 'connected' || action === 'count-value' || action === 'lower-bound' || (model.kind === 'interval-set' && action === 'search-overlap') || action === 'search-text' || action === 'estimate-cardinality' || action === 'search-value' || action === 'search-index' || action === 'peek' || action === 'breadth-first' || action === 'depth-first' || action === 'inspect-storage' || action === 'read-successor' || action === 'multiply-vector'
    const description = this.omittedFrames ? `${result.description} ${this.omittedFrames} intermediate trace events were executed but omitted from playback to bound snapshot storage.` : result.description
    this.add(5, title, description, result.status === 'REJECTED' ? 'reject request; preserve committed structure' : query ? `return ${JSON.stringify(result.value ?? null)}` : 'commit completed operation',
      layout.create(this.result, { activeId: result.activeId, status: result.status, visited: query ? this.visited : undefined }))
    let width = 0
    let height = 0
    for (const step of this.steps) {
      width = Math.max(width, step.scene.width)
      height = Math.max(height, step.scene.height)
    }
    for (let index = 0; index < this.steps.length; index += 1) {
      const step = this.steps[index]
      this.steps[index] = { ...step, scene: { ...step.scene, width, height } }
    }
  }

  public onLinearChange(event: LinearTraceEvent): void {
    if (this.recordedFrames < LinearAnimation.maximumDetailedFrames) {
      this.add(2, 'Follow the operation', event.description, event.code,
        this.layout.create(this.result, { count: this.originalSize, activeId: event.activeId, status: event.status, visited: this.visited, edgeIds: event.edgeIds }))
      this.recordedFrames += 1
    } else this.omittedFrames += 1
    if (event.activeId) this.visited.add(event.activeId)
  }
}
