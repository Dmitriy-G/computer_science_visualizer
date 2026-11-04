import { HierarchyLayout } from '../../../../visualization/HierarchyLayout.ts'
import type { AdditionalTreeModel } from '../../../../visualization/AdditionalTreeModel.ts'
import type { TreeFrame } from '../../../../visualization/TreeActionAnimation.ts'
import type { Scene } from '../../../../visualization/Scene.ts'
export class QuadtreeLayout extends HierarchyLayout {
  public create(model: AdditionalTreeModel, frame: TreeFrame = {}): Scene {
    return { ...super.create(model, frame), countLabel: 'points', hint: { title: 'Quadtree', description: '2D point buckets subdivided into four sparse occupied quadrants. Point coordinates are integers in [-1024,1024); bucket size two and depth at most eleven. Empty orthants are implicit.' } }
  }
}
