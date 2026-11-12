import { HierarchyLayout } from '../../../../visualization/HierarchyLayout.ts'
import type { AdditionalTreeModel } from '../../../../visualization/AdditionalTreeModel.ts'
import type { TreeFrame } from '../../../../visualization/TreeActionAnimation.ts'
import type { Scene } from '../../../../visualization/Scene.ts'
import { AST } from './AST.ts'

export class ASTLayout extends HierarchyLayout {
  public create(model: AdditionalTreeModel, frame: TreeFrame = {}): Scene {
    if (!(model instanceof AST)) throw new TypeError('Expected an AST')
    return { ...super.create(model, frame), countLabel: 'syntax nodes',
    }
  }
}
