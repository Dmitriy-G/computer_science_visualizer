import { MultiwayTreeLayout } from '../../../../visualization/MultiwayTreeLayout.ts'
import type { TreeFrame } from '../../../../visualization/TreeActionAnimation.ts'
import type { BTree } from './BTree.ts'

export class BTreeLayout extends MultiwayTreeLayout {
  constructor() { super('b-tree') }

  public create(model: BTree, frame: TreeFrame = {}) {
    return this.createEntries(model.getEntries(), model.length, frame)
  }
}
