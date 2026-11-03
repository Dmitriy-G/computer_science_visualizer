import { BalancedBinaryLayout } from '../../../../visualization/BalancedBinaryLayout.ts'
import type { LinearModel, LinearFrame } from '../../../../visualization/LinearModel.ts'
import type { Scene } from '../../../../visualization/Scene.ts'
import { OrderedSet } from './OrderedSet.ts'

export class OrderedSetLayout {
  public create(model: LinearModel, frame: LinearFrame = {}): Scene {
    if (!(model instanceof OrderedSet)) throw new TypeError('Expected ordered set')
    const scene = new BalancedBinaryLayout('ordered-set').createEntries(model.getEntries(), model.length, {
      activeId: frame.activeId, status: frame.status, count: frame.count,
      pendingId: frame.status === 'NEW' ? frame.activeId ?? undefined : undefined,
      visitedIds: frame.visited ? [...frame.visited] : [],
    })
    return { ...scene, countLabel: 'unique keys', hint: {
      title: 'AVL-backed ordered set',
      description: 'Each key occurs once. Smaller keys are on the left and larger keys on the right; stored heights drive AVL rotations. Lower bound follows one search path.',
    } }
  }
}
