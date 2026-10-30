import { BalancedBinaryLayout } from '../../../../visualization/BalancedBinaryLayout.ts'
import type { TreeFrame } from '../../../../visualization/TreeActionAnimation.ts'
import type { RedBlackTree } from './RedBlackTree.ts'

export class RedBlackTreeLayout extends BalancedBinaryLayout {
  constructor() { super('red-black-tree') }

  public create(model: RedBlackTree, frame: TreeFrame = {}) {
    return this.createEntries(model.getEntries(), model.length, frame)
  }
}
