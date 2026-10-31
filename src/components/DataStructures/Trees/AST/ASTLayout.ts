import { HierarchyLayout } from '../../../../visualization/HierarchyLayout.ts'
import type { AdditionalTreeModel } from '../../../../visualization/AdditionalTreeModel.ts'
import type { TreeFrame } from '../../../../visualization/TreeActionAnimation.ts'
import type { Scene } from '../../../../visualization/Scene.ts'
import { AST } from './AST.ts'

export class ASTLayout extends HierarchyLayout {
  public create(model: AdditionalTreeModel, frame: TreeFrame = {}): Scene {
    if (!(model instanceof AST)) throw new TypeError('Expected an AST')
    return { ...super.create(model, frame), countLabel: 'syntax nodes',
      hint: { title: 'Abstract Syntax Tree (AST)', description: 'Operators are unary or binary nodes; integers are leaves. Child order preserves operands, and parentheses determine grouping without becoming nodes. Inorder lists tokens; it does not reconstruct parentheses. Evaluation uses finite JavaScript numbers and rejects division by zero or unsafe integer results.', code: model.expression || undefined },
    }
  }
}
