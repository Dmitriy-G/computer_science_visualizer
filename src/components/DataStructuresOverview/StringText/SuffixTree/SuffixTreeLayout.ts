import { HierarchyLayout } from '../../../../visualization/HierarchyLayout.ts'
import type { AdditionalTreeModel } from '../../../../visualization/AdditionalTreeModel.ts'
import type { TreeFrame } from '../../../../visualization/TreeActionAnimation.ts'
import type { Scene } from '../../../../visualization/Scene.ts'
export class SuffixTreeLayout extends HierarchyLayout {
  public create(model: AdditionalTreeModel, frame: TreeFrame = {}): Scene {
    return { ...super.create(model, frame), countLabel: 'text characters', hint: { title: 'Suffix Tree', description: 'Compressed suffix edges stored as source-text ranges with suffix indices. Naive suffix insertion takes quadratic time; it is not Ukkonen construction.' } }
  }
}
