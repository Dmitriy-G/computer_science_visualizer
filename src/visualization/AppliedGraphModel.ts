import { AppliedModel } from './AppliedModel.ts'
import { LinearModel } from './LinearModel.ts'
import type { LinearInputValues, LinearObserver, LinearResult } from './LinearModel.ts'
import type { ActionKind } from './ActionCatalog.ts'

export abstract class AppliedGraphModel extends AppliedModel {
  public abstract getVertexIds(): readonly number[]
  public abstract getNeighborIds(id: number): readonly number[]
  public abstract vertexSceneId(id: number): string

  protected traverse(action: ActionKind, input: LinearInputValues, observer?: LinearObserver): LinearResult {
    const start = LinearModel.integer(input, 'index')
    if (!this.getVertexIds().includes(start)) return this.reject('Choose an existing vertex ID from the diagram.')
    const visited = new Set<number>()
    const result: number[] = []
    const visit = (id: number): void => {
      visited.add(id)
      result.push(id)
      LinearModel.emit(observer, this.vertexSceneId(id), `Visit vertex ${id}.`, action === 'breadth-first' ? 'dequeue vertex; enqueue unseen outgoing neighbors' : 'visit vertex; recurse through unseen outgoing neighbors')
    }
    if (action === 'breadth-first') {
      const queued = new Set<number>([start])
      const queue = [start]
      for (let head = 0; head < queue.length; head += 1) {
        const id = queue[head]
        visit(id)
        for (const neighbor of this.getNeighborIds(id)) {
          if (queued.has(neighbor)) continue
          queued.add(neighbor)
          queue.push(neighbor)
        }
      }
    } else {
      const dfs = (id: number): void => {
        visit(id)
        for (const neighbor of this.getNeighborIds(id)) if (!visited.has(neighbor)) dfs(neighbor)
      }
      dfs(start)
    }
    return { description: `Reachable vertex IDs: [${result.join(', ')}].`, value: result, activeId: this.vertexSceneId(result[result.length - 1]), status: 'VISITED' }
  }
}
