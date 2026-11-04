import { HierarchyLayout } from '../../../../visualization/HierarchyLayout.ts'
import type { AdditionalTreeModel } from '../../../../visualization/AdditionalTreeModel.ts'
import type { TreeFrame } from '../../../../visualization/TreeActionAnimation.ts'
import type { Scene } from '../../../../visualization/Scene.ts'
export class VanEmdeBoasTreeLayout extends HierarchyLayout {
  public create(model: AdditionalTreeModel, frame: TreeFrame = {}): Scene {
    return { ...super.create(model, frame), countLabel: 'keys', hint: { title: 'Van Emde Boas Tree', description: 'Recursive integer universes, min/max, clusters, and occupied-cluster summaries. Keys are restricted to 0..255; min/max in clusters are local keys.' } }
  }
}
