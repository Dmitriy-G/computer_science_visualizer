import type { ReactNode } from 'react'
import type { ActionKind } from '../../visualization/ActionCatalog.ts'
import type { AlgorithmInformation } from '../../visualization/AlgorithmInformation.ts'
import type { StructuredTreeActionProps } from '../ActionPlayback/StructuredTreeAction.tsx'
import GeneralTreeInsert from '../FundamentalDataStructures/Trees/GeneralTree/Insert/Insert.tsx'
import { InsertAnimation as GeneralTreeInsertSequence } from '../FundamentalDataStructures/Trees/GeneralTree/Insert/InsertAnimation.ts'
import GeneralTreeSearchByKey from '../FundamentalDataStructures/Trees/GeneralTree/SearchByKey/SearchByKey.tsx'
import { SearchByKeyAnimation as GeneralTreeSearchByKeySequence } from '../FundamentalDataStructures/Trees/GeneralTree/SearchByKey/SearchByKeyAnimation.ts'
import GeneralTreeDeleteByKey from '../FundamentalDataStructures/Trees/GeneralTree/DeleteByKey/DeleteByKey.tsx'
import { DeleteByKeyAnimation as GeneralTreeDeleteByKeySequence } from '../FundamentalDataStructures/Trees/GeneralTree/DeleteByKey/DeleteByKeyAnimation.ts'
import GeneralTreeClear from '../FundamentalDataStructures/Trees/GeneralTree/Clear/Clear.tsx'
import { ClearAnimation as GeneralTreeClearSequence } from '../FundamentalDataStructures/Trees/GeneralTree/Clear/ClearAnimation.ts'
import UnorderedBinaryTreeInsert from '../FundamentalDataStructures/Trees/UnorderedBinaryTree/Insert/Insert.tsx'
import { InsertAnimation as UnorderedBinaryTreeInsertSequence } from '../FundamentalDataStructures/Trees/UnorderedBinaryTree/Insert/InsertAnimation.ts'
import UnorderedBinaryTreeSearchByKey from '../FundamentalDataStructures/Trees/UnorderedBinaryTree/SearchByKey/SearchByKey.tsx'
import { SearchByKeyAnimation as UnorderedBinaryTreeSearchByKeySequence } from '../FundamentalDataStructures/Trees/UnorderedBinaryTree/SearchByKey/SearchByKeyAnimation.ts'
import UnorderedBinaryTreeDeleteByKey from '../FundamentalDataStructures/Trees/UnorderedBinaryTree/DeleteByKey/DeleteByKey.tsx'
import { DeleteByKeyAnimation as UnorderedBinaryTreeDeleteByKeySequence } from '../FundamentalDataStructures/Trees/UnorderedBinaryTree/DeleteByKey/DeleteByKeyAnimation.ts'
import UnorderedBinaryTreeClear from '../FundamentalDataStructures/Trees/UnorderedBinaryTree/Clear/Clear.tsx'
import { ClearAnimation as UnorderedBinaryTreeClearSequence } from '../FundamentalDataStructures/Trees/UnorderedBinaryTree/Clear/ClearAnimation.ts'
import CompleteBinaryTreeInsert from '../FundamentalDataStructures/Trees/CompleteBinaryTree/Insert/Insert.tsx'
import { InsertAnimation as CompleteBinaryTreeInsertSequence } from '../FundamentalDataStructures/Trees/CompleteBinaryTree/Insert/InsertAnimation.ts'
import CompleteBinaryTreeSearchByKey from '../FundamentalDataStructures/Trees/CompleteBinaryTree/SearchByKey/SearchByKey.tsx'
import { SearchByKeyAnimation as CompleteBinaryTreeSearchByKeySequence } from '../FundamentalDataStructures/Trees/CompleteBinaryTree/SearchByKey/SearchByKeyAnimation.ts'
import CompleteBinaryTreeDeleteByKey from '../FundamentalDataStructures/Trees/CompleteBinaryTree/DeleteByKey/DeleteByKey.tsx'
import { DeleteByKeyAnimation as CompleteBinaryTreeDeleteByKeySequence } from '../FundamentalDataStructures/Trees/CompleteBinaryTree/DeleteByKey/DeleteByKeyAnimation.ts'
import CompleteBinaryTreeClear from '../FundamentalDataStructures/Trees/CompleteBinaryTree/Clear/Clear.tsx'
import { ClearAnimation as CompleteBinaryTreeClearSequence } from '../FundamentalDataStructures/Trees/CompleteBinaryTree/Clear/ClearAnimation.ts'
import ThreadedBinaryTreeInsert from '../AdvancedDataStructures/SearchTrees/ThreadedBinaryTree/Insert/Insert.tsx'
import { InsertAnimation as ThreadedBinaryTreeInsertSequence } from '../AdvancedDataStructures/SearchTrees/ThreadedBinaryTree/Insert/InsertAnimation.ts'
import ThreadedBinaryTreeSearchByKey from '../AdvancedDataStructures/SearchTrees/ThreadedBinaryTree/SearchByKey/SearchByKey.tsx'
import { SearchByKeyAnimation as ThreadedBinaryTreeSearchByKeySequence } from '../AdvancedDataStructures/SearchTrees/ThreadedBinaryTree/SearchByKey/SearchByKeyAnimation.ts'
import ThreadedBinaryTreeInorder from '../AdvancedDataStructures/SearchTrees/ThreadedBinaryTree/Inorder/Inorder.tsx'
import { InorderAnimation as ThreadedBinaryTreeInorderSequence } from '../AdvancedDataStructures/SearchTrees/ThreadedBinaryTree/Inorder/InorderAnimation.ts'
import ThreadedBinaryTreeClear from '../AdvancedDataStructures/SearchTrees/ThreadedBinaryTree/Clear/Clear.tsx'
import { ClearAnimation as ThreadedBinaryTreeClearSequence } from '../AdvancedDataStructures/SearchTrees/ThreadedBinaryTree/Clear/ClearAnimation.ts'
import SplayTreeInsert from '../AdvancedDataStructures/SearchTrees/SplayTree/Insert/Insert.tsx'
import { InsertAnimation as SplayTreeInsertSequence } from '../AdvancedDataStructures/SearchTrees/SplayTree/Insert/InsertAnimation.ts'
import SplayTreeSearchByKey from '../AdvancedDataStructures/SearchTrees/SplayTree/SearchByKey/SearchByKey.tsx'
import { SearchByKeyAnimation as SplayTreeSearchByKeySequence } from '../AdvancedDataStructures/SearchTrees/SplayTree/SearchByKey/SearchByKeyAnimation.ts'
import SplayTreeDeleteByKey from '../AdvancedDataStructures/SearchTrees/SplayTree/DeleteByKey/DeleteByKey.tsx'
import { DeleteByKeyAnimation as SplayTreeDeleteByKeySequence } from '../AdvancedDataStructures/SearchTrees/SplayTree/DeleteByKey/DeleteByKeyAnimation.ts'
import SplayTreeClear from '../AdvancedDataStructures/SearchTrees/SplayTree/Clear/Clear.tsx'
import { ClearAnimation as SplayTreeClearSequence } from '../AdvancedDataStructures/SearchTrees/SplayTree/Clear/ClearAnimation.ts'
import TreapInsert from '../AdvancedDataStructures/SearchTrees/Treap/Insert/Insert.tsx'
import { InsertAnimation as TreapInsertSequence } from '../AdvancedDataStructures/SearchTrees/Treap/Insert/InsertAnimation.ts'
import TreapSearchByKey from '../AdvancedDataStructures/SearchTrees/Treap/SearchByKey/SearchByKey.tsx'
import { SearchByKeyAnimation as TreapSearchByKeySequence } from '../AdvancedDataStructures/SearchTrees/Treap/SearchByKey/SearchByKeyAnimation.ts'
import TreapDeleteByKey from '../AdvancedDataStructures/SearchTrees/Treap/DeleteByKey/DeleteByKey.tsx'
import { DeleteByKeyAnimation as TreapDeleteByKeySequence } from '../AdvancedDataStructures/SearchTrees/Treap/DeleteByKey/DeleteByKeyAnimation.ts'
import TreapClear from '../AdvancedDataStructures/SearchTrees/Treap/Clear/Clear.tsx'
import { ClearAnimation as TreapClearSequence } from '../AdvancedDataStructures/SearchTrees/Treap/Clear/ClearAnimation.ts'
import CartesianTreeAppend from '../AdvancedDataStructures/SearchTrees/CartesianTree/Append/Append.tsx'
import { AppendAnimation as CartesianTreeAppendSequence } from '../AdvancedDataStructures/SearchTrees/CartesianTree/Append/AppendAnimation.ts'
import CartesianTreeRangeMinimum from '../AdvancedDataStructures/SearchTrees/CartesianTree/RangeMinimum/RangeMinimum.tsx'
import { RangeMinimumAnimation as CartesianTreeRangeMinimumSequence } from '../AdvancedDataStructures/SearchTrees/CartesianTree/RangeMinimum/RangeMinimumAnimation.ts'
import CartesianTreeClear from '../AdvancedDataStructures/SearchTrees/CartesianTree/Clear/Clear.tsx'
import { ClearAnimation as CartesianTreeClearSequence } from '../AdvancedDataStructures/SearchTrees/CartesianTree/Clear/ClearAnimation.ts'
import ScapegoatTreeInsert from '../AdvancedDataStructures/SearchTrees/ScapegoatTree/Insert/Insert.tsx'
import { InsertAnimation as ScapegoatTreeInsertSequence } from '../AdvancedDataStructures/SearchTrees/ScapegoatTree/Insert/InsertAnimation.ts'
import ScapegoatTreeSearchByKey from '../AdvancedDataStructures/SearchTrees/ScapegoatTree/SearchByKey/SearchByKey.tsx'
import { SearchByKeyAnimation as ScapegoatTreeSearchByKeySequence } from '../AdvancedDataStructures/SearchTrees/ScapegoatTree/SearchByKey/SearchByKeyAnimation.ts'
import ScapegoatTreeDeleteByKey from '../AdvancedDataStructures/SearchTrees/ScapegoatTree/DeleteByKey/DeleteByKey.tsx'
import { DeleteByKeyAnimation as ScapegoatTreeDeleteByKeySequence } from '../AdvancedDataStructures/SearchTrees/ScapegoatTree/DeleteByKey/DeleteByKeyAnimation.ts'
import ScapegoatTreeClear from '../AdvancedDataStructures/SearchTrees/ScapegoatTree/Clear/Clear.tsx'
import { ClearAnimation as ScapegoatTreeClearSequence } from '../AdvancedDataStructures/SearchTrees/ScapegoatTree/Clear/ClearAnimation.ts'
import AATreeInsert from '../AdvancedDataStructures/SearchTrees/AATree/Insert/Insert.tsx'
import { InsertAnimation as AATreeInsertSequence } from '../AdvancedDataStructures/SearchTrees/AATree/Insert/InsertAnimation.ts'
import AATreeSearchByKey from '../AdvancedDataStructures/SearchTrees/AATree/SearchByKey/SearchByKey.tsx'
import { SearchByKeyAnimation as AATreeSearchByKeySequence } from '../AdvancedDataStructures/SearchTrees/AATree/SearchByKey/SearchByKeyAnimation.ts'
import AATreeDeleteByKey from '../AdvancedDataStructures/SearchTrees/AATree/DeleteByKey/DeleteByKey.tsx'
import { DeleteByKeyAnimation as AATreeDeleteByKeySequence } from '../AdvancedDataStructures/SearchTrees/AATree/DeleteByKey/DeleteByKeyAnimation.ts'
import AATreeClear from '../AdvancedDataStructures/SearchTrees/AATree/Clear/Clear.tsx'
import { ClearAnimation as AATreeClearSequence } from '../AdvancedDataStructures/SearchTrees/AATree/Clear/ClearAnimation.ts'
import TwoThreeTreeInsert from '../AdvancedDataStructures/MultiwayTrees/TwoThreeTree/Insert/Insert.tsx'
import { InsertAnimation as TwoThreeTreeInsertSequence } from '../AdvancedDataStructures/MultiwayTrees/TwoThreeTree/Insert/InsertAnimation.ts'
import TwoThreeTreeSearchByKey from '../AdvancedDataStructures/MultiwayTrees/TwoThreeTree/SearchByKey/SearchByKey.tsx'
import { SearchByKeyAnimation as TwoThreeTreeSearchByKeySequence } from '../AdvancedDataStructures/MultiwayTrees/TwoThreeTree/SearchByKey/SearchByKeyAnimation.ts'
import TwoThreeTreeClear from '../AdvancedDataStructures/MultiwayTrees/TwoThreeTree/Clear/Clear.tsx'
import { ClearAnimation as TwoThreeTreeClearSequence } from '../AdvancedDataStructures/MultiwayTrees/TwoThreeTree/Clear/ClearAnimation.ts'
import TwoThreeFourTreeInsert from '../AdvancedDataStructures/MultiwayTrees/TwoThreeFourTree/Insert/Insert.tsx'
import { InsertAnimation as TwoThreeFourTreeInsertSequence } from '../AdvancedDataStructures/MultiwayTrees/TwoThreeFourTree/Insert/InsertAnimation.ts'
import TwoThreeFourTreeSearchByKey from '../AdvancedDataStructures/MultiwayTrees/TwoThreeFourTree/SearchByKey/SearchByKey.tsx'
import { SearchByKeyAnimation as TwoThreeFourTreeSearchByKeySequence } from '../AdvancedDataStructures/MultiwayTrees/TwoThreeFourTree/SearchByKey/SearchByKeyAnimation.ts'
import TwoThreeFourTreeDeleteByKey from '../AdvancedDataStructures/MultiwayTrees/TwoThreeFourTree/DeleteByKey/DeleteByKey.tsx'
import { DeleteByKeyAnimation as TwoThreeFourTreeDeleteByKeySequence } from '../AdvancedDataStructures/MultiwayTrees/TwoThreeFourTree/DeleteByKey/DeleteByKeyAnimation.ts'
import TwoThreeFourTreeClear from '../AdvancedDataStructures/MultiwayTrees/TwoThreeFourTree/Clear/Clear.tsx'
import { ClearAnimation as TwoThreeFourTreeClearSequence } from '../AdvancedDataStructures/MultiwayTrees/TwoThreeFourTree/Clear/ClearAnimation.ts'
import RadixTreeInsert from '../AdvancedDataStructures/TextSearch/RadixTree/Insert/Insert.tsx'
import { InsertAnimation as RadixTreeInsertSequence } from '../AdvancedDataStructures/TextSearch/RadixTree/Insert/InsertAnimation.ts'
import RadixTreeSearchByWord from '../AdvancedDataStructures/TextSearch/RadixTree/SearchByWord/SearchByWord.tsx'
import { SearchByWordAnimation as RadixTreeSearchByWordSequence } from '../AdvancedDataStructures/TextSearch/RadixTree/SearchByWord/SearchByWordAnimation.ts'
import RadixTreeStartsWith from '../AdvancedDataStructures/TextSearch/RadixTree/StartsWith/StartsWith.tsx'
import { StartsWithAnimation as RadixTreeStartsWithSequence } from '../AdvancedDataStructures/TextSearch/RadixTree/StartsWith/StartsWithAnimation.ts'
import RadixTreeDeleteByWord from '../AdvancedDataStructures/TextSearch/RadixTree/DeleteByWord/DeleteByWord.tsx'
import { DeleteByWordAnimation as RadixTreeDeleteByWordSequence } from '../AdvancedDataStructures/TextSearch/RadixTree/DeleteByWord/DeleteByWordAnimation.ts'
import RadixTreeClear from '../AdvancedDataStructures/TextSearch/RadixTree/Clear/Clear.tsx'
import { ClearAnimation as RadixTreeClearSequence } from '../AdvancedDataStructures/TextSearch/RadixTree/Clear/ClearAnimation.ts'
import TernarySearchTreeInsert from '../AdvancedDataStructures/TextSearch/TernarySearchTree/Insert/Insert.tsx'
import { InsertAnimation as TernarySearchTreeInsertSequence } from '../AdvancedDataStructures/TextSearch/TernarySearchTree/Insert/InsertAnimation.ts'
import TernarySearchTreeSearchByWord from '../AdvancedDataStructures/TextSearch/TernarySearchTree/SearchByWord/SearchByWord.tsx'
import { SearchByWordAnimation as TernarySearchTreeSearchByWordSequence } from '../AdvancedDataStructures/TextSearch/TernarySearchTree/SearchByWord/SearchByWordAnimation.ts'
import TernarySearchTreeDeleteByWord from '../AdvancedDataStructures/TextSearch/TernarySearchTree/DeleteByWord/DeleteByWord.tsx'
import { DeleteByWordAnimation as TernarySearchTreeDeleteByWordSequence } from '../AdvancedDataStructures/TextSearch/TernarySearchTree/DeleteByWord/DeleteByWordAnimation.ts'
import TernarySearchTreeClear from '../AdvancedDataStructures/TextSearch/TernarySearchTree/Clear/Clear.tsx'
import { ClearAnimation as TernarySearchTreeClearSequence } from '../AdvancedDataStructures/TextSearch/TernarySearchTree/Clear/ClearAnimation.ts'
import SuffixTreeBuild from '../AdvancedDataStructures/TextSearch/SuffixTree/Build/Build.tsx'
import { BuildAnimation as SuffixTreeBuildSequence } from '../AdvancedDataStructures/TextSearch/SuffixTree/Build/BuildAnimation.ts'
import SuffixTreeSearchSubstring from '../AdvancedDataStructures/TextSearch/SuffixTree/SearchSubstring/SearchSubstring.tsx'
import { SearchSubstringAnimation as SuffixTreeSearchSubstringSequence } from '../AdvancedDataStructures/TextSearch/SuffixTree/SearchSubstring/SearchSubstringAnimation.ts'
import SuffixTreeClear from '../AdvancedDataStructures/TextSearch/SuffixTree/Clear/Clear.tsx'
import { ClearAnimation as SuffixTreeClearSequence } from '../AdvancedDataStructures/TextSearch/SuffixTree/Clear/ClearAnimation.ts'
import IntervalTreeInsert from '../AdvancedDataStructures/RangeQueries/IntervalTree/Insert/Insert.tsx'
import { InsertAnimation as IntervalTreeInsertSequence } from '../AdvancedDataStructures/RangeQueries/IntervalTree/Insert/InsertAnimation.ts'
import IntervalTreeSearchOverlap from '../AdvancedDataStructures/RangeQueries/IntervalTree/SearchOverlap/SearchOverlap.tsx'
import { SearchOverlapAnimation as IntervalTreeSearchOverlapSequence } from '../AdvancedDataStructures/RangeQueries/IntervalTree/SearchOverlap/SearchOverlapAnimation.ts'
import IntervalTreeClear from '../AdvancedDataStructures/RangeQueries/IntervalTree/Clear/Clear.tsx'
import { ClearAnimation as IntervalTreeClearSequence } from '../AdvancedDataStructures/RangeQueries/IntervalTree/Clear/ClearAnimation.ts'
import OrderStatisticTreeInsert from '../AdvancedDataStructures/RangeQueries/OrderStatisticTree/Insert/Insert.tsx'
import { InsertAnimation as OrderStatisticTreeInsertSequence } from '../AdvancedDataStructures/RangeQueries/OrderStatisticTree/Insert/InsertAnimation.ts'
import OrderStatisticTreeSearchByKey from '../AdvancedDataStructures/RangeQueries/OrderStatisticTree/SearchByKey/SearchByKey.tsx'
import { SearchByKeyAnimation as OrderStatisticTreeSearchByKeySequence } from '../AdvancedDataStructures/RangeQueries/OrderStatisticTree/SearchByKey/SearchByKeyAnimation.ts'
import OrderStatisticTreeDeleteByKey from '../AdvancedDataStructures/RangeQueries/OrderStatisticTree/DeleteByKey/DeleteByKey.tsx'
import { DeleteByKeyAnimation as OrderStatisticTreeDeleteByKeySequence } from '../AdvancedDataStructures/RangeQueries/OrderStatisticTree/DeleteByKey/DeleteByKeyAnimation.ts'
import OrderStatisticTreeRank from '../AdvancedDataStructures/RangeQueries/OrderStatisticTree/Rank/Rank.tsx'
import { RankAnimation as OrderStatisticTreeRankSequence } from '../AdvancedDataStructures/RangeQueries/OrderStatisticTree/Rank/RankAnimation.ts'
import OrderStatisticTreeSelect from '../AdvancedDataStructures/RangeQueries/OrderStatisticTree/Select/Select.tsx'
import { SelectAnimation as OrderStatisticTreeSelectSequence } from '../AdvancedDataStructures/RangeQueries/OrderStatisticTree/Select/SelectAnimation.ts'
import OrderStatisticTreeClear from '../AdvancedDataStructures/RangeQueries/OrderStatisticTree/Clear/Clear.tsx'
import { ClearAnimation as OrderStatisticTreeClearSequence } from '../AdvancedDataStructures/RangeQueries/OrderStatisticTree/Clear/ClearAnimation.ts'
import PersistentSegmentTreeUpdate from '../AdvancedDataStructures/RangeQueries/PersistentSegmentTree/Update/Update.tsx'
import { UpdateAnimation as PersistentSegmentTreeUpdateSequence } from '../AdvancedDataStructures/RangeQueries/PersistentSegmentTree/Update/UpdateAnimation.ts'
import PersistentSegmentTreeRangeSum from '../AdvancedDataStructures/RangeQueries/PersistentSegmentTree/RangeSum/RangeSum.tsx'
import { RangeSumAnimation as PersistentSegmentTreeRangeSumSequence } from '../AdvancedDataStructures/RangeQueries/PersistentSegmentTree/RangeSum/RangeSumAnimation.ts'
import PersistentSegmentTreeClear from '../AdvancedDataStructures/RangeQueries/PersistentSegmentTree/Clear/Clear.tsx'
import { ClearAnimation as PersistentSegmentTreeClearSequence } from '../AdvancedDataStructures/RangeQueries/PersistentSegmentTree/Clear/ClearAnimation.ts'
import SparseTableBuild from '../AdvancedDataStructures/RangeQueries/SparseTable/Build/Build.tsx'
import { BuildAnimation as SparseTableBuildSequence } from '../AdvancedDataStructures/RangeQueries/SparseTable/Build/BuildAnimation.ts'
import SparseTableRangeMinimum from '../AdvancedDataStructures/RangeQueries/SparseTable/RangeMinimum/RangeMinimum.tsx'
import { RangeMinimumAnimation as SparseTableRangeMinimumSequence } from '../AdvancedDataStructures/RangeQueries/SparseTable/RangeMinimum/RangeMinimumAnimation.ts'
import SparseTableClear from '../AdvancedDataStructures/RangeQueries/SparseTable/Clear/Clear.tsx'
import { ClearAnimation as SparseTableClearSequence } from '../AdvancedDataStructures/RangeQueries/SparseTable/Clear/ClearAnimation.ts'
import KDTreeInsert from '../AdvancedDataStructures/SpatialIndexes/KDTree/Insert/Insert.tsx'
import { InsertAnimation as KDTreeInsertSequence } from '../AdvancedDataStructures/SpatialIndexes/KDTree/Insert/InsertAnimation.ts'
import KDTreeSearchOverlap from '../AdvancedDataStructures/SpatialIndexes/KDTree/SearchOverlap/SearchOverlap.tsx'
import { SearchOverlapAnimation as KDTreeSearchOverlapSequence } from '../AdvancedDataStructures/SpatialIndexes/KDTree/SearchOverlap/SearchOverlapAnimation.ts'
import KDTreeClear from '../AdvancedDataStructures/SpatialIndexes/KDTree/Clear/Clear.tsx'
import { ClearAnimation as KDTreeClearSequence } from '../AdvancedDataStructures/SpatialIndexes/KDTree/Clear/ClearAnimation.ts'
import QuadtreeInsert from '../AdvancedDataStructures/SpatialIndexes/Quadtree/Insert/Insert.tsx'
import { InsertAnimation as QuadtreeInsertSequence } from '../AdvancedDataStructures/SpatialIndexes/Quadtree/Insert/InsertAnimation.ts'
import QuadtreeSearchOverlap from '../AdvancedDataStructures/SpatialIndexes/Quadtree/SearchOverlap/SearchOverlap.tsx'
import { SearchOverlapAnimation as QuadtreeSearchOverlapSequence } from '../AdvancedDataStructures/SpatialIndexes/Quadtree/SearchOverlap/SearchOverlapAnimation.ts'
import QuadtreeClear from '../AdvancedDataStructures/SpatialIndexes/Quadtree/Clear/Clear.tsx'
import { ClearAnimation as QuadtreeClearSequence } from '../AdvancedDataStructures/SpatialIndexes/Quadtree/Clear/ClearAnimation.ts'
import OctreeInsert from '../AdvancedDataStructures/SpatialIndexes/Octree/Insert/Insert.tsx'
import { InsertAnimation as OctreeInsertSequence } from '../AdvancedDataStructures/SpatialIndexes/Octree/Insert/InsertAnimation.ts'
import OctreeSearchOverlap from '../AdvancedDataStructures/SpatialIndexes/Octree/SearchOverlap/SearchOverlap.tsx'
import { SearchOverlapAnimation as OctreeSearchOverlapSequence } from '../AdvancedDataStructures/SpatialIndexes/Octree/SearchOverlap/SearchOverlapAnimation.ts'
import OctreeClear from '../AdvancedDataStructures/SpatialIndexes/Octree/Clear/Clear.tsx'
import { ClearAnimation as OctreeClearSequence } from '../AdvancedDataStructures/SpatialIndexes/Octree/Clear/ClearAnimation.ts'
import BoundingVolumeHierarchyInsert from '../AdvancedDataStructures/SpatialIndexes/BoundingVolumeHierarchy/Insert/Insert.tsx'
import { InsertAnimation as BoundingVolumeHierarchyInsertSequence } from '../AdvancedDataStructures/SpatialIndexes/BoundingVolumeHierarchy/Insert/InsertAnimation.ts'
import BoundingVolumeHierarchySearchOverlap from '../AdvancedDataStructures/SpatialIndexes/BoundingVolumeHierarchy/SearchOverlap/SearchOverlap.tsx'
import { SearchOverlapAnimation as BoundingVolumeHierarchySearchOverlapSequence } from '../AdvancedDataStructures/SpatialIndexes/BoundingVolumeHierarchy/SearchOverlap/SearchOverlapAnimation.ts'
import BoundingVolumeHierarchyClear from '../AdvancedDataStructures/SpatialIndexes/BoundingVolumeHierarchy/Clear/Clear.tsx'
import { ClearAnimation as BoundingVolumeHierarchyClearSequence } from '../AdvancedDataStructures/SpatialIndexes/BoundingVolumeHierarchy/Clear/ClearAnimation.ts'
import MerkleTreeUpdate from '../AdvancedDataStructures/Integrity/MerkleTree/Update/Update.tsx'
import { UpdateAnimation as MerkleTreeUpdateSequence } from '../AdvancedDataStructures/Integrity/MerkleTree/Update/UpdateAnimation.ts'
import MerkleTreeVerifyProof from '../AdvancedDataStructures/Integrity/MerkleTree/VerifyProof/VerifyProof.tsx'
import { VerifyProofAnimation as MerkleTreeVerifyProofSequence } from '../AdvancedDataStructures/Integrity/MerkleTree/VerifyProof/VerifyProofAnimation.ts'
import MerkleTreeClear from '../AdvancedDataStructures/Integrity/MerkleTree/Clear/Clear.tsx'
import { ClearAnimation as MerkleTreeClearSequence } from '../AdvancedDataStructures/Integrity/MerkleTree/Clear/ClearAnimation.ts'
import VanEmdeBoasTreeInsert from '../AdvancedDataStructures/SearchTrees/VanEmdeBoasTree/Insert/Insert.tsx'
import { InsertAnimation as VanEmdeBoasTreeInsertSequence } from '../AdvancedDataStructures/SearchTrees/VanEmdeBoasTree/Insert/InsertAnimation.ts'
import VanEmdeBoasTreeSearchByKey from '../AdvancedDataStructures/SearchTrees/VanEmdeBoasTree/SearchByKey/SearchByKey.tsx'
import { SearchByKeyAnimation as VanEmdeBoasTreeSearchByKeySequence } from '../AdvancedDataStructures/SearchTrees/VanEmdeBoasTree/SearchByKey/SearchByKeyAnimation.ts'
import VanEmdeBoasTreeSuccessor from '../AdvancedDataStructures/SearchTrees/VanEmdeBoasTree/Successor/Successor.tsx'
import { SuccessorAnimation as VanEmdeBoasTreeSuccessorSequence } from '../AdvancedDataStructures/SearchTrees/VanEmdeBoasTree/Successor/SuccessorAnimation.ts'
import VanEmdeBoasTreeDeleteByKey from '../AdvancedDataStructures/SearchTrees/VanEmdeBoasTree/DeleteByKey/DeleteByKey.tsx'
import { DeleteByKeyAnimation as VanEmdeBoasTreeDeleteByKeySequence } from '../AdvancedDataStructures/SearchTrees/VanEmdeBoasTree/DeleteByKey/DeleteByKeyAnimation.ts'
import VanEmdeBoasTreeClear from '../AdvancedDataStructures/SearchTrees/VanEmdeBoasTree/Clear/Clear.tsx'
import { ClearAnimation as VanEmdeBoasTreeClearSequence } from '../AdvancedDataStructures/SearchTrees/VanEmdeBoasTree/Clear/ClearAnimation.ts'
export class ExtendedTreeFeatures {
  public static render(action: ActionKind, props: StructuredTreeActionProps, session: number): ReactNode {
    switch (props.model.kind) {
      case 'general-tree':
        switch (action) {
          case 'insert': return <GeneralTreeInsert key={session} {...props} />
          case 'search-value': return <GeneralTreeSearchByKey key={session} {...props} />
          case 'delete-value': return <GeneralTreeDeleteByKey key={session} {...props} />
          case 'clear': return <GeneralTreeClear key={session} {...props} />
        }
        break
      case 'unordered-binary-tree':
        switch (action) {
          case 'insert': return <UnorderedBinaryTreeInsert key={session} {...props} />
          case 'search-value': return <UnorderedBinaryTreeSearchByKey key={session} {...props} />
          case 'delete-value': return <UnorderedBinaryTreeDeleteByKey key={session} {...props} />
          case 'clear': return <UnorderedBinaryTreeClear key={session} {...props} />
        }
        break
      case 'complete-binary-tree':
        switch (action) {
          case 'insert': return <CompleteBinaryTreeInsert key={session} {...props} />
          case 'search-value': return <CompleteBinaryTreeSearchByKey key={session} {...props} />
          case 'delete-value': return <CompleteBinaryTreeDeleteByKey key={session} {...props} />
          case 'clear': return <CompleteBinaryTreeClear key={session} {...props} />
        }
        break
      case 'threaded-binary-tree':
        switch (action) {
          case 'insert': return <ThreadedBinaryTreeInsert key={session} {...props} />
          case 'search-value': return <ThreadedBinaryTreeSearchByKey key={session} {...props} />
          case 'traverse-inorder': return <ThreadedBinaryTreeInorder key={session} {...props} />
          case 'clear': return <ThreadedBinaryTreeClear key={session} {...props} />
        }
        break
      case 'splay-tree':
        switch (action) {
          case 'insert': return <SplayTreeInsert key={session} {...props} />
          case 'search-value': return <SplayTreeSearchByKey key={session} {...props} />
          case 'delete-value': return <SplayTreeDeleteByKey key={session} {...props} />
          case 'clear': return <SplayTreeClear key={session} {...props} />
        }
        break
      case 'treap':
        switch (action) {
          case 'insert': return <TreapInsert key={session} {...props} />
          case 'search-value': return <TreapSearchByKey key={session} {...props} />
          case 'delete-value': return <TreapDeleteByKey key={session} {...props} />
          case 'clear': return <TreapClear key={session} {...props} />
        }
        break
      case 'cartesian-tree':
        switch (action) {
          case 'insert': return <CartesianTreeAppend key={session} {...props} />
          case 'range-min': return <CartesianTreeRangeMinimum key={session} {...props} />
          case 'clear': return <CartesianTreeClear key={session} {...props} />
        }
        break
      case 'scapegoat-tree':
        switch (action) {
          case 'insert': return <ScapegoatTreeInsert key={session} {...props} />
          case 'search-value': return <ScapegoatTreeSearchByKey key={session} {...props} />
          case 'delete-value': return <ScapegoatTreeDeleteByKey key={session} {...props} />
          case 'clear': return <ScapegoatTreeClear key={session} {...props} />
        }
        break
      case 'aa-tree':
        switch (action) {
          case 'insert': return <AATreeInsert key={session} {...props} />
          case 'search-value': return <AATreeSearchByKey key={session} {...props} />
          case 'delete-value': return <AATreeDeleteByKey key={session} {...props} />
          case 'clear': return <AATreeClear key={session} {...props} />
        }
        break
      case 'two-three-tree':
        switch (action) {
          case 'insert': return <TwoThreeTreeInsert key={session} {...props} />
          case 'search-value': return <TwoThreeTreeSearchByKey key={session} {...props} />
          case 'clear': return <TwoThreeTreeClear key={session} {...props} />
        }
        break
      case 'two-three-four-tree':
        switch (action) {
          case 'insert': return <TwoThreeFourTreeInsert key={session} {...props} />
          case 'search-value': return <TwoThreeFourTreeSearchByKey key={session} {...props} />
          case 'delete-value': return <TwoThreeFourTreeDeleteByKey key={session} {...props} />
          case 'clear': return <TwoThreeFourTreeClear key={session} {...props} />
        }
        break
      case 'radix-tree':
        switch (action) {
          case 'insert': return <RadixTreeInsert key={session} {...props} />
          case 'search-value': return <RadixTreeSearchByWord key={session} {...props} />
          case 'starts-with': return <RadixTreeStartsWith key={session} {...props} />
          case 'delete-value': return <RadixTreeDeleteByWord key={session} {...props} />
          case 'clear': return <RadixTreeClear key={session} {...props} />
        }
        break
      case 'ternary-search-tree':
        switch (action) {
          case 'insert': return <TernarySearchTreeInsert key={session} {...props} />
          case 'search-value': return <TernarySearchTreeSearchByWord key={session} {...props} />
          case 'delete-value': return <TernarySearchTreeDeleteByWord key={session} {...props} />
          case 'clear': return <TernarySearchTreeClear key={session} {...props} />
        }
        break
      case 'suffix-tree':
        switch (action) {
          case 'build-text': return <SuffixTreeBuild key={session} {...props} />
          case 'search-value': return <SuffixTreeSearchSubstring key={session} {...props} />
          case 'clear': return <SuffixTreeClear key={session} {...props} />
        }
        break
      case 'interval-tree':
        switch (action) {
          case 'insert': return <IntervalTreeInsert key={session} {...props} />
          case 'search-overlap': return <IntervalTreeSearchOverlap key={session} {...props} />
          case 'clear': return <IntervalTreeClear key={session} {...props} />
        }
        break
      case 'order-statistic-tree':
        switch (action) {
          case 'insert': return <OrderStatisticTreeInsert key={session} {...props} />
          case 'search-value': return <OrderStatisticTreeSearchByKey key={session} {...props} />
          case 'delete-value': return <OrderStatisticTreeDeleteByKey key={session} {...props} />
          case 'rank': return <OrderStatisticTreeRank key={session} {...props} />
          case 'select-rank': return <OrderStatisticTreeSelect key={session} {...props} />
          case 'clear': return <OrderStatisticTreeClear key={session} {...props} />
        }
        break
      case 'persistent-segment-tree':
        switch (action) {
          case 'update-index': return <PersistentSegmentTreeUpdate key={session} {...props} />
          case 'range-sum': return <PersistentSegmentTreeRangeSum key={session} {...props} />
          case 'clear': return <PersistentSegmentTreeClear key={session} {...props} />
        }
        break
      case 'sparse-table':
        switch (action) {
          case 'build-values': return <SparseTableBuild key={session} {...props} />
          case 'range-min': return <SparseTableRangeMinimum key={session} {...props} />
          case 'clear': return <SparseTableClear key={session} {...props} />
        }
        break
      case 'kd-tree':
        switch (action) {
          case 'insert': return <KDTreeInsert key={session} {...props} />
          case 'search-overlap': return <KDTreeSearchOverlap key={session} {...props} />
          case 'clear': return <KDTreeClear key={session} {...props} />
        }
        break
      case 'quadtree':
        switch (action) {
          case 'insert': return <QuadtreeInsert key={session} {...props} />
          case 'search-overlap': return <QuadtreeSearchOverlap key={session} {...props} />
          case 'clear': return <QuadtreeClear key={session} {...props} />
        }
        break
      case 'octree':
        switch (action) {
          case 'insert': return <OctreeInsert key={session} {...props} />
          case 'search-overlap': return <OctreeSearchOverlap key={session} {...props} />
          case 'clear': return <OctreeClear key={session} {...props} />
        }
        break
      case 'bvh':
        switch (action) {
          case 'insert': return <BoundingVolumeHierarchyInsert key={session} {...props} />
          case 'search-overlap': return <BoundingVolumeHierarchySearchOverlap key={session} {...props} />
          case 'clear': return <BoundingVolumeHierarchyClear key={session} {...props} />
        }
        break
      case 'merkle-tree':
        switch (action) {
          case 'update-index': return <MerkleTreeUpdate key={session} {...props} />
          case 'verify-proof': return <MerkleTreeVerifyProof key={session} {...props} />
          case 'clear': return <MerkleTreeClear key={session} {...props} />
        }
        break
      case 'van-emde-boas-tree':
        switch (action) {
          case 'insert': return <VanEmdeBoasTreeInsert key={session} {...props} />
          case 'search-value': return <VanEmdeBoasTreeSearchByKey key={session} {...props} />
          case 'successor': return <VanEmdeBoasTreeSuccessor key={session} {...props} />
          case 'delete-value': return <VanEmdeBoasTreeDeleteByKey key={session} {...props} />
          case 'clear': return <VanEmdeBoasTreeClear key={session} {...props} />
        }
        break
    }
    return null
  }
  public static describe(action: ActionKind, model: StructuredTreeActionProps['model']): AlgorithmInformation | null {
    switch (model.kind) {
      case 'general-tree':
        switch (action) {
          case 'insert': return GeneralTreeInsertSequence.describe(model.length)
          case 'search-value': return GeneralTreeSearchByKeySequence.describe(model.length)
          case 'delete-value': return GeneralTreeDeleteByKeySequence.describe(model.length)
          case 'clear': return GeneralTreeClearSequence.describe(model.length)
        }
        break
      case 'unordered-binary-tree':
        switch (action) {
          case 'insert': return UnorderedBinaryTreeInsertSequence.describe(model.length)
          case 'search-value': return UnorderedBinaryTreeSearchByKeySequence.describe(model.length)
          case 'delete-value': return UnorderedBinaryTreeDeleteByKeySequence.describe(model.length)
          case 'clear': return UnorderedBinaryTreeClearSequence.describe(model.length)
        }
        break
      case 'complete-binary-tree':
        switch (action) {
          case 'insert': return CompleteBinaryTreeInsertSequence.describe(model.length)
          case 'search-value': return CompleteBinaryTreeSearchByKeySequence.describe(model.length)
          case 'delete-value': return CompleteBinaryTreeDeleteByKeySequence.describe(model.length)
          case 'clear': return CompleteBinaryTreeClearSequence.describe(model.length)
        }
        break
      case 'threaded-binary-tree':
        switch (action) {
          case 'insert': return ThreadedBinaryTreeInsertSequence.describe(model.length)
          case 'search-value': return ThreadedBinaryTreeSearchByKeySequence.describe(model.length)
          case 'traverse-inorder': return ThreadedBinaryTreeInorderSequence.describe(model.length)
          case 'clear': return ThreadedBinaryTreeClearSequence.describe(model.length)
        }
        break
      case 'splay-tree':
        switch (action) {
          case 'insert': return SplayTreeInsertSequence.describe(model.length)
          case 'search-value': return SplayTreeSearchByKeySequence.describe(model.length)
          case 'delete-value': return SplayTreeDeleteByKeySequence.describe(model.length)
          case 'clear': return SplayTreeClearSequence.describe(model.length)
        }
        break
      case 'treap':
        switch (action) {
          case 'insert': return TreapInsertSequence.describe(model.length)
          case 'search-value': return TreapSearchByKeySequence.describe(model.length)
          case 'delete-value': return TreapDeleteByKeySequence.describe(model.length)
          case 'clear': return TreapClearSequence.describe(model.length)
        }
        break
      case 'cartesian-tree':
        switch (action) {
          case 'insert': return CartesianTreeAppendSequence.describe(model.length)
          case 'range-min': return CartesianTreeRangeMinimumSequence.describe(model.length)
          case 'clear': return CartesianTreeClearSequence.describe(model.length)
        }
        break
      case 'scapegoat-tree':
        switch (action) {
          case 'insert': return ScapegoatTreeInsertSequence.describe(model.length)
          case 'search-value': return ScapegoatTreeSearchByKeySequence.describe(model.length)
          case 'delete-value': return ScapegoatTreeDeleteByKeySequence.describe(model.length)
          case 'clear': return ScapegoatTreeClearSequence.describe(model.length)
        }
        break
      case 'aa-tree':
        switch (action) {
          case 'insert': return AATreeInsertSequence.describe(model.length)
          case 'search-value': return AATreeSearchByKeySequence.describe(model.length)
          case 'delete-value': return AATreeDeleteByKeySequence.describe(model.length)
          case 'clear': return AATreeClearSequence.describe(model.length)
        }
        break
      case 'two-three-tree':
        switch (action) {
          case 'insert': return TwoThreeTreeInsertSequence.describe(model.length)
          case 'search-value': return TwoThreeTreeSearchByKeySequence.describe(model.length)
          case 'clear': return TwoThreeTreeClearSequence.describe(model.length)
        }
        break
      case 'two-three-four-tree':
        switch (action) {
          case 'insert': return TwoThreeFourTreeInsertSequence.describe(model.length)
          case 'search-value': return TwoThreeFourTreeSearchByKeySequence.describe(model.length)
          case 'delete-value': return TwoThreeFourTreeDeleteByKeySequence.describe(model.length)
          case 'clear': return TwoThreeFourTreeClearSequence.describe(model.length)
        }
        break
      case 'radix-tree':
        switch (action) {
          case 'insert': return RadixTreeInsertSequence.describe(model.length)
          case 'search-value': return RadixTreeSearchByWordSequence.describe(model.length)
          case 'starts-with': return RadixTreeStartsWithSequence.describe(model.length)
          case 'delete-value': return RadixTreeDeleteByWordSequence.describe(model.length)
          case 'clear': return RadixTreeClearSequence.describe(model.length)
        }
        break
      case 'ternary-search-tree':
        switch (action) {
          case 'insert': return TernarySearchTreeInsertSequence.describe(model.length)
          case 'search-value': return TernarySearchTreeSearchByWordSequence.describe(model.length)
          case 'delete-value': return TernarySearchTreeDeleteByWordSequence.describe(model.length)
          case 'clear': return TernarySearchTreeClearSequence.describe(model.length)
        }
        break
      case 'suffix-tree':
        switch (action) {
          case 'build-text': return SuffixTreeBuildSequence.describe(model.length)
          case 'search-value': return SuffixTreeSearchSubstringSequence.describe(model.length)
          case 'clear': return SuffixTreeClearSequence.describe(model.length)
        }
        break
      case 'interval-tree':
        switch (action) {
          case 'insert': return IntervalTreeInsertSequence.describe(model.length)
          case 'search-overlap': return IntervalTreeSearchOverlapSequence.describe(model.length)
          case 'clear': return IntervalTreeClearSequence.describe(model.length)
        }
        break
      case 'order-statistic-tree':
        switch (action) {
          case 'insert': return OrderStatisticTreeInsertSequence.describe(model.length)
          case 'search-value': return OrderStatisticTreeSearchByKeySequence.describe(model.length)
          case 'delete-value': return OrderStatisticTreeDeleteByKeySequence.describe(model.length)
          case 'rank': return OrderStatisticTreeRankSequence.describe(model.length)
          case 'select-rank': return OrderStatisticTreeSelectSequence.describe(model.length)
          case 'clear': return OrderStatisticTreeClearSequence.describe(model.length)
        }
        break
      case 'persistent-segment-tree':
        switch (action) {
          case 'update-index': return PersistentSegmentTreeUpdateSequence.describe(model.length)
          case 'range-sum': return PersistentSegmentTreeRangeSumSequence.describe(model.length)
          case 'clear': return PersistentSegmentTreeClearSequence.describe(model.length)
        }
        break
      case 'sparse-table':
        switch (action) {
          case 'build-values': return SparseTableBuildSequence.describe(model.length)
          case 'range-min': return SparseTableRangeMinimumSequence.describe(model.length)
          case 'clear': return SparseTableClearSequence.describe(model.length)
        }
        break
      case 'kd-tree':
        switch (action) {
          case 'insert': return KDTreeInsertSequence.describe(model.length)
          case 'search-overlap': return KDTreeSearchOverlapSequence.describe(model.length)
          case 'clear': return KDTreeClearSequence.describe(model.length)
        }
        break
      case 'quadtree':
        switch (action) {
          case 'insert': return QuadtreeInsertSequence.describe(model.length)
          case 'search-overlap': return QuadtreeSearchOverlapSequence.describe(model.length)
          case 'clear': return QuadtreeClearSequence.describe(model.length)
        }
        break
      case 'octree':
        switch (action) {
          case 'insert': return OctreeInsertSequence.describe(model.length)
          case 'search-overlap': return OctreeSearchOverlapSequence.describe(model.length)
          case 'clear': return OctreeClearSequence.describe(model.length)
        }
        break
      case 'bvh':
        switch (action) {
          case 'insert': return BoundingVolumeHierarchyInsertSequence.describe(model.length)
          case 'search-overlap': return BoundingVolumeHierarchySearchOverlapSequence.describe(model.length)
          case 'clear': return BoundingVolumeHierarchyClearSequence.describe(model.length)
        }
        break
      case 'merkle-tree':
        switch (action) {
          case 'update-index': return MerkleTreeUpdateSequence.describe(model.length)
          case 'verify-proof': return MerkleTreeVerifyProofSequence.describe(model.length)
          case 'clear': return MerkleTreeClearSequence.describe(model.length)
        }
        break
      case 'van-emde-boas-tree':
        switch (action) {
          case 'insert': return VanEmdeBoasTreeInsertSequence.describe(model.length)
          case 'search-value': return VanEmdeBoasTreeSearchByKeySequence.describe(model.length)
          case 'successor': return VanEmdeBoasTreeSuccessorSequence.describe(model.length)
          case 'delete-value': return VanEmdeBoasTreeDeleteByKeySequence.describe(model.length)
          case 'clear': return VanEmdeBoasTreeClearSequence.describe(model.length)
        }
        break
    }
    return null
  }
}
