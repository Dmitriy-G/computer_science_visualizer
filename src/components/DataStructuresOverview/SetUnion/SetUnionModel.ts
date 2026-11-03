import { LinearModel } from '../../../visualization/LinearModel.ts'
import type { LinearObserver, LinearResult } from '../../../visualization/LinearModel.ts'
import type { TreeTraceEvent, TreeTraceObserver } from '../../../visualization/TreeTrace.ts'

class SetTreeObserver implements TreeTraceObserver {
  private readonly observer: LinearObserver

  constructor(observer: LinearObserver) { this.observer = observer }

  public onTreeChange(event: TreeTraceEvent): void {
    LinearModel.emit(this.observer, event.activeId, event.description, event.code,
      event.phase === 'create' ? 'NEW' : event.phase === 'rotate' ? 'ROTATE' : undefined)
  }
}

export abstract class SetUnionModel extends LinearModel {
  protected reject(description: string): LinearResult { return { description, status: 'REJECTED' } }

  protected treeObserver(observer?: LinearObserver): TreeTraceObserver | undefined {
    return observer ? new SetTreeObserver(observer) : undefined
  }
}
