import { HierarchyLayout } from '../../../../visualization/HierarchyLayout.ts'
import type { AdditionalTreeModel } from '../../../../visualization/AdditionalTreeModel.ts'
import type { TreeFrame } from '../../../../visualization/TreeActionAnimation.ts'
import type { Scene } from '../../../../visualization/Scene.ts'
import { MerkleTree } from './MerkleTree.ts'
export class MerkleTreeLayout extends HierarchyLayout {
  public create(model: AdditionalTreeModel, frame: TreeFrame = {}): Scene {
    return { ...super.create(model, frame), countLabel: 'data leaves', hint: { title: 'Merkle Tree', description: 'SHA-256 leaf and parent hashes with path updates and inclusion proofs. Ten values are padded with six empty-byte leaves. Displayed digests are shortened; proof comparisons use all 256 bits. This padding differs from Certificate Transparency tree shape.',
      code: model instanceof MerkleTree ? `root = ${model.rootHash}` : undefined }
    }
  }
}
