import { BalancedBinaryLayout } from '../../../../visualization/BalancedBinaryLayout.ts'
import type { TreeFrame } from '../../../../visualization/TreeActionAnimation.ts'
import type { AVLTree } from './AVLTree.ts'

export class AVLTreeLayout extends BalancedBinaryLayout {
  constructor() { super('avl-tree') }

  public create(model: AVLTree, frame: TreeFrame = {}) {
    return this.createEntries(model.getEntries(), model.length, frame)
  }
}
