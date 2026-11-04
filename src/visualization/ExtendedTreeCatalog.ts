import type { TreeFrame } from './TreeActionAnimation.ts'
import type { AdditionalTreeModel } from './AdditionalTreeModel.ts'
import type { StructureKind, Scene } from './Scene.ts'
import { ExtendedTreeDefinitions } from './ExtendedTreeDefinitions.ts'
import { GeneralTree } from '../components/FundamentalDataStructures/Trees/GeneralTree/GeneralTree.ts'
import { GeneralTreeLayout } from '../components/FundamentalDataStructures/Trees/GeneralTree/GeneralTreeLayout.ts'
import { UnorderedBinaryTree } from '../components/FundamentalDataStructures/Trees/UnorderedBinaryTree/UnorderedBinaryTree.ts'
import { UnorderedBinaryTreeLayout } from '../components/FundamentalDataStructures/Trees/UnorderedBinaryTree/UnorderedBinaryTreeLayout.ts'
import { CompleteBinaryTree } from '../components/FundamentalDataStructures/Trees/CompleteBinaryTree/CompleteBinaryTree.ts'
import { CompleteBinaryTreeLayout } from '../components/FundamentalDataStructures/Trees/CompleteBinaryTree/CompleteBinaryTreeLayout.ts'
import { ThreadedBinaryTree } from '../components/AdvancedDataStructures/SearchTrees/ThreadedBinaryTree/ThreadedBinaryTree.ts'
import { ThreadedBinaryTreeLayout } from '../components/AdvancedDataStructures/SearchTrees/ThreadedBinaryTree/ThreadedBinaryTreeLayout.ts'
import { SplayTree } from '../components/AdvancedDataStructures/SearchTrees/SplayTree/SplayTree.ts'
import { SplayTreeLayout } from '../components/AdvancedDataStructures/SearchTrees/SplayTree/SplayTreeLayout.ts'
import { Treap } from '../components/AdvancedDataStructures/SearchTrees/Treap/Treap.ts'
import { TreapLayout } from '../components/AdvancedDataStructures/SearchTrees/Treap/TreapLayout.ts'
import { CartesianTree } from '../components/AdvancedDataStructures/SearchTrees/CartesianTree/CartesianTree.ts'
import { CartesianTreeLayout } from '../components/AdvancedDataStructures/SearchTrees/CartesianTree/CartesianTreeLayout.ts'
import { ScapegoatTree } from '../components/AdvancedDataStructures/SearchTrees/ScapegoatTree/ScapegoatTree.ts'
import { ScapegoatTreeLayout } from '../components/AdvancedDataStructures/SearchTrees/ScapegoatTree/ScapegoatTreeLayout.ts'
import { AATree } from '../components/AdvancedDataStructures/SearchTrees/AATree/AATree.ts'
import { AATreeLayout } from '../components/AdvancedDataStructures/SearchTrees/AATree/AATreeLayout.ts'
import { TwoThreeTree } from '../components/AdvancedDataStructures/MultiwayTrees/TwoThreeTree/TwoThreeTree.ts'
import { TwoThreeTreeLayout } from '../components/AdvancedDataStructures/MultiwayTrees/TwoThreeTree/TwoThreeTreeLayout.ts'
import { TwoThreeFourTree } from '../components/AdvancedDataStructures/MultiwayTrees/TwoThreeFourTree/TwoThreeFourTree.ts'
import { TwoThreeFourTreeLayout } from '../components/AdvancedDataStructures/MultiwayTrees/TwoThreeFourTree/TwoThreeFourTreeLayout.ts'
import { RadixTree } from '../components/AdvancedDataStructures/TextSearch/RadixTree/RadixTree.ts'
import { RadixTreeLayout } from '../components/AdvancedDataStructures/TextSearch/RadixTree/RadixTreeLayout.ts'
import { TernarySearchTree } from '../components/AdvancedDataStructures/TextSearch/TernarySearchTree/TernarySearchTree.ts'
import { TernarySearchTreeLayout } from '../components/AdvancedDataStructures/TextSearch/TernarySearchTree/TernarySearchTreeLayout.ts'
import { SuffixTree } from '../components/AdvancedDataStructures/TextSearch/SuffixTree/SuffixTree.ts'
import { SuffixTreeLayout } from '../components/AdvancedDataStructures/TextSearch/SuffixTree/SuffixTreeLayout.ts'
import { IntervalTree } from '../components/AdvancedDataStructures/RangeQueries/IntervalTree/IntervalTree.ts'
import { IntervalTreeLayout } from '../components/AdvancedDataStructures/RangeQueries/IntervalTree/IntervalTreeLayout.ts'
import { OrderStatisticTree } from '../components/AdvancedDataStructures/RangeQueries/OrderStatisticTree/OrderStatisticTree.ts'
import { OrderStatisticTreeLayout } from '../components/AdvancedDataStructures/RangeQueries/OrderStatisticTree/OrderStatisticTreeLayout.ts'
import { PersistentSegmentTree } from '../components/AdvancedDataStructures/RangeQueries/PersistentSegmentTree/PersistentSegmentTree.ts'
import { PersistentSegmentTreeLayout } from '../components/AdvancedDataStructures/RangeQueries/PersistentSegmentTree/PersistentSegmentTreeLayout.ts'
import { SparseTable } from '../components/AdvancedDataStructures/RangeQueries/SparseTable/SparseTable.ts'
import { SparseTableLayout } from '../components/AdvancedDataStructures/RangeQueries/SparseTable/SparseTableLayout.ts'
import { KDTree } from '../components/AdvancedDataStructures/SpatialIndexes/KDTree/KDTree.ts'
import { KDTreeLayout } from '../components/AdvancedDataStructures/SpatialIndexes/KDTree/KDTreeLayout.ts'
import { Quadtree } from '../components/AdvancedDataStructures/SpatialIndexes/Quadtree/Quadtree.ts'
import { QuadtreeLayout } from '../components/AdvancedDataStructures/SpatialIndexes/Quadtree/QuadtreeLayout.ts'
import { Octree } from '../components/AdvancedDataStructures/SpatialIndexes/Octree/Octree.ts'
import { OctreeLayout } from '../components/AdvancedDataStructures/SpatialIndexes/Octree/OctreeLayout.ts'
import { BoundingVolumeHierarchy } from '../components/AdvancedDataStructures/SpatialIndexes/BoundingVolumeHierarchy/BoundingVolumeHierarchy.ts'
import { BoundingVolumeHierarchyLayout } from '../components/AdvancedDataStructures/SpatialIndexes/BoundingVolumeHierarchy/BoundingVolumeHierarchyLayout.ts'
import { MerkleTree } from '../components/AdvancedDataStructures/Integrity/MerkleTree/MerkleTree.ts'
import { MerkleTreeLayout } from '../components/AdvancedDataStructures/Integrity/MerkleTree/MerkleTreeLayout.ts'
import { VanEmdeBoasTree } from '../components/AdvancedDataStructures/SearchTrees/VanEmdeBoasTree/VanEmdeBoasTree.ts'
import { VanEmdeBoasTreeLayout } from '../components/AdvancedDataStructures/SearchTrees/VanEmdeBoasTree/VanEmdeBoasTreeLayout.ts'
export class ExtendedTreeCatalog {
  public static supports(kind: StructureKind): boolean {
    for (const structure of ExtendedTreeDefinitions.structures) if (structure.kind === kind) return true
    return false
  }
  public static createModels(): Map<StructureKind, AdditionalTreeModel> {
    const models = new Map<StructureKind, AdditionalTreeModel>()
    for (const definition of ExtendedTreeDefinitions.structures) models.set(definition.kind, this.createDefault(definition.kind)!)
    return models
  }
  public static createDefault(kind: StructureKind): AdditionalTreeModel | null {
    switch (kind) {
      case 'general-tree': return GeneralTree.createDefault()
      case 'unordered-binary-tree': return UnorderedBinaryTree.createDefault()
      case 'complete-binary-tree': return CompleteBinaryTree.createDefault()
      case 'threaded-binary-tree': return ThreadedBinaryTree.createDefault()
      case 'splay-tree': return SplayTree.createDefault()
      case 'treap': return Treap.createDefault()
      case 'cartesian-tree': return CartesianTree.createDefault()
      case 'scapegoat-tree': return ScapegoatTree.createDefault()
      case 'aa-tree': return AATree.createDefault()
      case 'two-three-tree': return TwoThreeTree.createDefault()
      case 'two-three-four-tree': return TwoThreeFourTree.createDefault()
      case 'radix-tree': return RadixTree.createDefault()
      case 'ternary-search-tree': return TernarySearchTree.createDefault()
      case 'suffix-tree': return SuffixTree.createDefault()
      case 'interval-tree': return IntervalTree.createDefault()
      case 'order-statistic-tree': return OrderStatisticTree.createDefault()
      case 'persistent-segment-tree': return PersistentSegmentTree.createDefault()
      case 'sparse-table': return SparseTable.createDefault()
      case 'kd-tree': return KDTree.createDefault()
      case 'quadtree': return Quadtree.createDefault()
      case 'octree': return Octree.createDefault()
      case 'bvh': return BoundingVolumeHierarchy.createDefault()
      case 'merkle-tree': return MerkleTree.createDefault()
      case 'van-emde-boas-tree': return VanEmdeBoasTree.createDefault()
      default: return null
    }
  }
  public static createScene(model: AdditionalTreeModel, frame: TreeFrame = {}): Scene {
    switch (model.kind) {
      case 'general-tree': return new GeneralTreeLayout().create(model, frame)
      case 'unordered-binary-tree': return new UnorderedBinaryTreeLayout().create(model, frame)
      case 'complete-binary-tree': return new CompleteBinaryTreeLayout().create(model, frame)
      case 'threaded-binary-tree': return new ThreadedBinaryTreeLayout().create(model, frame)
      case 'splay-tree': return new SplayTreeLayout().create(model, frame)
      case 'treap': return new TreapLayout().create(model, frame)
      case 'cartesian-tree': return new CartesianTreeLayout().create(model, frame)
      case 'scapegoat-tree': return new ScapegoatTreeLayout().create(model, frame)
      case 'aa-tree': return new AATreeLayout().create(model, frame)
      case 'two-three-tree': return new TwoThreeTreeLayout().create(model, frame)
      case 'two-three-four-tree': return new TwoThreeFourTreeLayout().create(model, frame)
      case 'radix-tree': return new RadixTreeLayout().create(model, frame)
      case 'ternary-search-tree': return new TernarySearchTreeLayout().create(model, frame)
      case 'suffix-tree': return new SuffixTreeLayout().create(model, frame)
      case 'interval-tree': return new IntervalTreeLayout().create(model, frame)
      case 'order-statistic-tree': return new OrderStatisticTreeLayout().create(model, frame)
      case 'persistent-segment-tree': return new PersistentSegmentTreeLayout().create(model, frame)
      case 'sparse-table': return new SparseTableLayout().create(model, frame)
      case 'kd-tree': return new KDTreeLayout().create(model, frame)
      case 'quadtree': return new QuadtreeLayout().create(model, frame)
      case 'octree': return new OctreeLayout().create(model, frame)
      case 'bvh': return new BoundingVolumeHierarchyLayout().create(model, frame)
      case 'merkle-tree': return new MerkleTreeLayout().create(model, frame)
      case 'van-emde-boas-tree': return new VanEmdeBoasTreeLayout().create(model, frame)
      default: throw new RangeError('Unknown extended tree')
    }
  }
}
