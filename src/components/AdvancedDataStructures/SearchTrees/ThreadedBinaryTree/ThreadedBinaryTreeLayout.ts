import { HierarchyLayout } from '../../../../visualization/HierarchyLayout.ts'
import type { AdditionalTreeModel } from '../../../../visualization/AdditionalTreeModel.ts'
import type { TreeFrame } from '../../../../visualization/TreeActionAnimation.ts'
import type { Scene } from '../../../../visualization/Scene.ts'
import { ThreadedBinaryTree } from './ThreadedBinaryTree.ts'
export class ThreadedBinaryTreeLayout extends HierarchyLayout {
  public create(model: AdditionalTreeModel, frame: TreeFrame = {}): Scene {
    const scene = super.create(model, frame)
    const edges = [...scene.edges]
    if (model instanceof ThreadedBinaryTree) {
      for (const thread of model.getThreads()) edges.push({ id: `thread-${thread.from}-${thread.to}`, from: thread.from, to: thread.to, label: thread.label,
        directed: true, opacity: 0.7, highlighted: thread.from === frame.activeId, curveOffset: thread.label.startsWith('predecessor') ? -45 : 45 })
    }
    return { ...scene, edges }
  }
}
