import { AnimationSequence } from './AnimationSequence.ts'
import type { AdditionalTreeModel, TreeInputValues, TreeOperationResult } from './AdditionalTreeModel.ts'
import type { ActionKind } from './ActionCatalog.ts'
import type { TreeSceneFactory } from './TreeActionAnimation.ts'
import type { TreeTraceEvent, TreeTraceObserver } from './TreeTrace.ts'
export class ExtendedTreeAnimation extends AnimationSequence implements TreeTraceObserver {
  public static readonly maximumDetailedFrames = 96
  public readonly result: AdditionalTreeModel
  private readonly layout: TreeSceneFactory<AdditionalTreeModel>
  private readonly originalSize: number
  private readonly visited = new Set<string>()
  private detailed = 0
  private omitted = 0
  private readonly clearing: boolean
  private phase = 1
  constructor(model: AdditionalTreeModel, layout: TreeSceneFactory<AdditionalTreeModel>, action: ActionKind, input: TreeInputValues, title: string, summary: string) {
    super()
    this.result = model.clone()
    this.layout = layout
    this.clearing = action === 'clear'
    this.originalSize = model.length
    this.add(1, title, summary, 'inspect the current structure', layout.create(this.result, { hideMetadata: this.clearing }))
    let result: TreeOperationResult
    try { result = this.result.execute(action, input, this) }
    catch (error) {
      if (!(error instanceof TypeError) && !(error instanceof RangeError)) throw error
      this.result = model.clone()
      this.steps.splice(1)
      this.visited.clear()
      result = { description: `${error.message}. The committed structure is unchanged.`, error: error.message, status: 'REJECTED' }
    }
    const query = action === 'search-value' || action === 'starts-with' || action === 'range-min' || action === 'range-sum' || action === 'search-overlap' || action === 'rank' || action === 'select-rank' || action === 'successor' || action === 'verify-proof' || action === 'traverse-inorder'
    const omitted = this.omitted ? ` ${this.omitted} trace events were executed but omitted to bound playback storage.` : ''
    const value = typeof result.returnValue === 'bigint' ? result.returnValue.toString() : JSON.stringify(result.returnValue ?? null)
    this.add(5, title, result.description + omitted, result.error ? 'reject invalid request' : query ? `return ${value}` : 'commit the completed operation', layout.create(this.result, {
      activeId: result.activeId ?? (query ? [...this.visited].at(-1) : null),
      visitedIds: query ? [...this.visited] : [], status: result.status,
    }))
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
  public onTreeChange(event: TreeTraceEvent): void {
    const requestedPhase = event.phase === 'compare' || event.phase === 'visit' ? 2
      : event.phase === 'create' || event.phase === 'connect' || event.phase === 'remove' ? 3 : 4
    this.phase = Math.max(this.phase, requestedPhase)
    if (this.detailed < ExtendedTreeAnimation.maximumDetailedFrames) {
      this.add(this.phase, event.title, event.description, event.code,
        this.layout.create(this.result, { count: this.originalSize, activeId: event.activeId, visitedIds: [...this.visited], status: event.phase.toUpperCase(), hideMetadata: this.clearing }))
      this.detailed += 1
    } else this.omitted += 1
    if (event.activeId) this.visited.add(event.activeId)
  }
}
