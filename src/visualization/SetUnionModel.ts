import { LinearModel } from './LinearModel.ts'
import type { LinearObserver, LinearResult } from './LinearModel.ts'
import type { TreeTraceEvent, TreeTraceObserver } from './TreeTrace.ts'

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
