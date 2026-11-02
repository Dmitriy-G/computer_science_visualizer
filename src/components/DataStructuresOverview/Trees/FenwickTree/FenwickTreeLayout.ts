import { HierarchyLayout } from '../../../../visualization/HierarchyLayout.ts'
import type { AdditionalTreeModel } from '../../../../visualization/AdditionalTreeModel.ts'
import type { TreeFrame } from '../../../../visualization/TreeActionAnimation.ts'
import type { Scene } from '../../../../visualization/Scene.ts'

export class FenwickTreeLayout extends HierarchyLayout {
  public create(model: AdditionalTreeModel, frame: TreeFrame = {}): Scene {
    return { ...super.create(model, frame), countLabel: 'array values',
      hint: { title: 'BIT indices and coverage', description: 'User indices are zero-based; BIT cells are one-based. Cell i covers array indices [i - lowbit(i), i - 1], where lowbit(i) = i & -i. Edges connect update ancestors.' },
    }
  }
}
