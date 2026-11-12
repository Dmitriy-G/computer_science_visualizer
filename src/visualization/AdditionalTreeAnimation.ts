import type { AdditionalTreeModel, TreeInputValues } from './AdditionalTreeModel.ts'
import type { ActionKind } from './ActionCatalog.ts'
import type { TreeSceneFactory } from './TreeActionAnimation.ts'
import { TreeActionAnimation } from './TreeActionAnimation.ts'

export class AdditionalTreeAnimation extends TreeActionAnimation<AdditionalTreeModel> {
  constructor(model: AdditionalTreeModel, layout: TreeSceneFactory<AdditionalTreeModel>, action: ActionKind, input: TreeInputValues, title: string, summary: string) {
    super(model, layout, action === 'clear')
    this.begin(summary, 'inspect the current structure')
    const result = this.result.execute(action, input, this)
    const query = action === 'search-value' || action === 'starts-with' || action === 'peek' || action === 'prefix-sum' || action === 'range-sum' || action === 'search-overlap' || action === 'evaluate' || action === 'traverse-preorder' || action === 'traverse-inorder' || action === 'traverse-postorder'
    if (query) {
      const returnValue = this.formatValue(result.returnValue)
      const code = result.error ? `throw Error(${JSON.stringify(result.error)})` : `return ${returnValue}`
      this.add(5, title, result.description, code, layout.create(this.result, {
        activeId: result.activeId ?? this.visitedIds[this.visitedIds.length - 1], status: result.status,
        visitedIds: this.visitedIds,
      }))
    } else this.finish(title, result.description, 'commit the completed operation', result.activeId, result.status)
  }

  private formatValue(value: boolean | number | bigint | string | readonly (number | string)[] | null | undefined): string {
    if (Array.isArray(value)) {
      const entries: string[] = []
      for (const entry of value) entries.push(typeof entry === 'string' ? JSON.stringify(entry) : String(entry))
      return `[${entries.join(', ')}]`
    }
    return typeof value === 'string' ? JSON.stringify(value) : String(value)
  }
}
