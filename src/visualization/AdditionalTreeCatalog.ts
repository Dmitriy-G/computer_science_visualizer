import type { StructureKind, Scene } from './Scene.ts'
import type { AdditionalTreeModel } from './AdditionalTreeModel.ts'
import { AST } from '../components/DataStructures/Trees/AST/AST.ts'
import { ASTLayout } from '../components/DataStructures/Trees/AST/ASTLayout.ts'
import { Trie } from '../components/DataStructures/Trees/Trie/Trie.ts'
import { TrieLayout } from '../components/DataStructures/Trees/Trie/TrieLayout.ts'
import { Heap } from '../components/DataStructures/Trees/Heap/Heap.ts'
import { HeapLayout } from '../components/DataStructures/Trees/Heap/HeapLayout.ts'
import { SegmentTree } from '../components/DataStructures/Trees/SegmentTree/SegmentTree.ts'
import { SegmentTreeLayout } from '../components/DataStructures/Trees/SegmentTree/SegmentTreeLayout.ts'
import { FenwickTree } from '../components/DataStructures/Trees/FenwickTree/FenwickTree.ts'
import { FenwickTreeLayout } from '../components/DataStructures/Trees/FenwickTree/FenwickTreeLayout.ts'
import { RTree } from '../components/DataStructures/Trees/RTree/RTree.ts'
import { RTreeLayout } from '../components/DataStructures/Trees/RTree/RTreeLayout.ts'
import { LSMTree } from '../components/DataStructures/Trees/LSMTree/LSMTree.ts'
import { LSMTreeLayout } from '../components/DataStructures/Trees/LSMTree/LSMTreeLayout.ts'

export class AdditionalTreeCatalog {
  public static createModels(): Map<StructureKind, AdditionalTreeModel> {
    const models = new Map<StructureKind, AdditionalTreeModel>()
    models.set('ast', AST.createDefault())
    models.set('trie', Trie.createDefault())
    models.set('heap', Heap.createDefault())
    models.set('segment-tree', SegmentTree.createDefault())
    models.set('fenwick-tree', FenwickTree.createDefault())
    models.set('r-tree', RTree.createDefault())
    models.set('lsm-tree', LSMTree.createDefault())
    return models
  }

  public static createDefault(kind: StructureKind): AdditionalTreeModel | null {
    switch (kind) {
      case 'ast': return AST.createDefault()
      case 'trie': return Trie.createDefault()
      case 'heap': return Heap.createDefault()
      case 'segment-tree': return SegmentTree.createDefault()
      case 'fenwick-tree': return FenwickTree.createDefault()
      case 'r-tree': return RTree.createDefault()
      case 'lsm-tree': return LSMTree.createDefault()
      default: return null
    }
  }

  public static createScene(model: AdditionalTreeModel): Scene {
    switch (model.kind) {
      case 'ast': return new ASTLayout().create(model)
      case 'trie': return new TrieLayout().create(model)
      case 'heap': return new HeapLayout().create(model)
      case 'segment-tree': return new SegmentTreeLayout().create(model)
      case 'fenwick-tree': return new FenwickTreeLayout().create(model)
      case 'r-tree': return new RTreeLayout().create(model)
      case 'lsm-tree': return new LSMTreeLayout().create(model)
      default: throw new RangeError('Unknown additional tree')
    }
  }
}
