import { HierarchyLayout } from '../../../../visualization/HierarchyLayout.ts'
import type { AdditionalTreeModel } from '../../../../visualization/AdditionalTreeModel.ts'
import type { TreeFrame } from '../../../../visualization/TreeActionAnimation.ts'
import type { Scene } from '../../../../visualization/Scene.ts'
export class TwoThreeTreeLayout extends HierarchyLayout {
  public create(model: AdditionalTreeModel, frame: TreeFrame = {}): Scene {
    return { ...super.create(model, frame), countLabel: 'keys', hint: { title: '2-3 Tree', description: 'One or two keys per page, bottom-up splits, and equal leaf depths.' } }
  }
}
