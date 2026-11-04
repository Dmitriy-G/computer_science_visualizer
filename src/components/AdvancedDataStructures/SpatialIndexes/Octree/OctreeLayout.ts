import { HierarchyLayout } from '../../../../visualization/HierarchyLayout.ts'
import type { AdditionalTreeModel } from '../../../../visualization/AdditionalTreeModel.ts'
import type { TreeFrame } from '../../../../visualization/TreeActionAnimation.ts'
import type { Scene } from '../../../../visualization/Scene.ts'
export class OctreeLayout extends HierarchyLayout {
  public create(model: AdditionalTreeModel, frame: TreeFrame = {}): Scene {
    return { ...super.create(model, frame), countLabel: 'points', hint: { title: 'Octree', description: '3D point buckets subdivided into eight sparse occupied octants. Point coordinates are integers in [-1024,1024); bucket size two and depth at most eleven. Empty orthants are implicit.' } }
  }
}
