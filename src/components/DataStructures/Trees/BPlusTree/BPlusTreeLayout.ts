import { MultiwayTreeLayout } from '../../../../visualization/MultiwayTreeLayout.ts'
import type { TreeFrame } from '../../../../visualization/TreeActionAnimation.ts'
import type { BPlusTree } from './BPlusTree.ts'

export class BPlusTreeLayout extends MultiwayTreeLayout {
  constructor() { super('b-plus-tree') }

  public create(model: BPlusTree, frame: TreeFrame = {}) {
    return this.createEntries(model.getEntries(), model.length, frame)
  }
}
