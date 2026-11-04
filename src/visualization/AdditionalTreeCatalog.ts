import { ExtendedTreeCatalog } from './ExtendedTreeCatalog.ts'
import type { StructureKind, Scene } from './Scene.ts'
import type { AdditionalTreeModel } from './AdditionalTreeModel.ts'
import { AST } from '../components/AdvancedDataStructures/Syntax/AST/AST.ts'
import { ASTLayout } from '../components/AdvancedDataStructures/Syntax/AST/ASTLayout.ts'
import { Trie } from '../components/FundamentalDataStructures/StringText/Trie/Trie.ts'
import { TrieLayout } from '../components/FundamentalDataStructures/StringText/Trie/TrieLayout.ts'
import { Heap } from '../components/FundamentalDataStructures/QueuePriority/Heap/Heap.ts'
import { HeapLayout } from '../components/FundamentalDataStructures/QueuePriority/Heap/HeapLayout.ts'
import { SegmentTree } from '../components/AdvancedDataStructures/RangeQueries/SegmentTree/SegmentTree.ts'
import { SegmentTreeLayout } from '../components/AdvancedDataStructures/RangeQueries/SegmentTree/SegmentTreeLayout.ts'
import { FenwickTree } from '../components/AdvancedDataStructures/RangeQueries/FenwickTree/FenwickTree.ts'
import { FenwickTreeLayout } from '../components/AdvancedDataStructures/RangeQueries/FenwickTree/FenwickTreeLayout.ts'
import { RTree } from '../components/AdvancedDataStructures/SpatialIndexes/RTree/RTree.ts'
import { RTreeLayout } from '../components/AdvancedDataStructures/SpatialIndexes/RTree/RTreeLayout.ts'
import { LSMTree } from '../components/AdvancedDataStructures/StorageIndexes/LSMTree/LSMTree.ts'
import { LSMTreeLayout } from '../components/AdvancedDataStructures/StorageIndexes/LSMTree/LSMTreeLayout.ts'

export class AdditionalTreeCatalog {
  public static createModels(): Map<StructureKind, AdditionalTreeModel> {
    const models = ExtendedTreeCatalog.createModels()
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
    const extended = ExtendedTreeCatalog.createDefault(kind)
    if (extended) return extended
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
    if (ExtendedTreeCatalog.supports(model.kind)) return ExtendedTreeCatalog.createScene(model)
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
