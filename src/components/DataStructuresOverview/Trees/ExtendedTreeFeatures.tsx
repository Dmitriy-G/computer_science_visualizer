import type { ReactNode } from 'react'
import type { ActionKind } from '../../../visualization/ActionCatalog.ts'
import type { AlgorithmInformation } from '../../../visualization/AlgorithmInformation.ts'
import type { StructuredTreeActionProps } from '../../ActionPlayback/StructuredTreeAction.tsx'
import GeneralTreeInsert from './GeneralTree/Insert/Insert.tsx'
import { InsertAnimation as GeneralTreeInsertSequence } from './GeneralTree/Insert/InsertAnimation.ts'
import GeneralTreeSearchByKey from './GeneralTree/SearchByKey/SearchByKey.tsx'
import { SearchByKeyAnimation as GeneralTreeSearchByKeySequence } from './GeneralTree/SearchByKey/SearchByKeyAnimation.ts'
import GeneralTreeDeleteByKey from './GeneralTree/DeleteByKey/DeleteByKey.tsx'
import { DeleteByKeyAnimation as GeneralTreeDeleteByKeySequence } from './GeneralTree/DeleteByKey/DeleteByKeyAnimation.ts'
import GeneralTreeClear from './GeneralTree/Clear/Clear.tsx'
import { ClearAnimation as GeneralTreeClearSequence } from './GeneralTree/Clear/ClearAnimation.ts'
import UnorderedBinaryTreeInsert from './UnorderedBinaryTree/Insert/Insert.tsx'
import { InsertAnimation as UnorderedBinaryTreeInsertSequence } from './UnorderedBinaryTree/Insert/InsertAnimation.ts'
import UnorderedBinaryTreeSearchByKey from './UnorderedBinaryTree/SearchByKey/SearchByKey.tsx'
import { SearchByKeyAnimation as UnorderedBinaryTreeSearchByKeySequence } from './UnorderedBinaryTree/SearchByKey/SearchByKeyAnimation.ts'
import UnorderedBinaryTreeDeleteByKey from './UnorderedBinaryTree/DeleteByKey/DeleteByKey.tsx'
import { DeleteByKeyAnimation as UnorderedBinaryTreeDeleteByKeySequence } from './UnorderedBinaryTree/DeleteByKey/DeleteByKeyAnimation.ts'
import UnorderedBinaryTreeClear from './UnorderedBinaryTree/Clear/Clear.tsx'
import { ClearAnimation as UnorderedBinaryTreeClearSequence } from './UnorderedBinaryTree/Clear/ClearAnimation.ts'
import CompleteBinaryTreeInsert from './CompleteBinaryTree/Insert/Insert.tsx'
import { InsertAnimation as CompleteBinaryTreeInsertSequence } from './CompleteBinaryTree/Insert/InsertAnimation.ts'
import CompleteBinaryTreeSearchByKey from './CompleteBinaryTree/SearchByKey/SearchByKey.tsx'
import { SearchByKeyAnimation as CompleteBinaryTreeSearchByKeySequence } from './CompleteBinaryTree/SearchByKey/SearchByKeyAnimation.ts'
import CompleteBinaryTreeDeleteByKey from './CompleteBinaryTree/DeleteByKey/DeleteByKey.tsx'
import { DeleteByKeyAnimation as CompleteBinaryTreeDeleteByKeySequence } from './CompleteBinaryTree/DeleteByKey/DeleteByKeyAnimation.ts'
import CompleteBinaryTreeClear from './CompleteBinaryTree/Clear/Clear.tsx'
import { ClearAnimation as CompleteBinaryTreeClearSequence } from './CompleteBinaryTree/Clear/ClearAnimation.ts'
import ThreadedBinaryTreeInsert from './ThreadedBinaryTree/Insert/Insert.tsx'
import { InsertAnimation as ThreadedBinaryTreeInsertSequence } from './ThreadedBinaryTree/Insert/InsertAnimation.ts'
import ThreadedBinaryTreeSearchByKey from './ThreadedBinaryTree/SearchByKey/SearchByKey.tsx'
import { SearchByKeyAnimation as ThreadedBinaryTreeSearchByKeySequence } from './ThreadedBinaryTree/SearchByKey/SearchByKeyAnimation.ts'
import ThreadedBinaryTreeInorder from './ThreadedBinaryTree/Inorder/Inorder.tsx'
import { InorderAnimation as ThreadedBinaryTreeInorderSequence } from './ThreadedBinaryTree/Inorder/InorderAnimation.ts'
import ThreadedBinaryTreeClear from './ThreadedBinaryTree/Clear/Clear.tsx'
import { ClearAnimation as ThreadedBinaryTreeClearSequence } from './ThreadedBinaryTree/Clear/ClearAnimation.ts'
import SplayTreeInsert from './SplayTree/Insert/Insert.tsx'
import { InsertAnimation as SplayTreeInsertSequence } from './SplayTree/Insert/InsertAnimation.ts'
import SplayTreeSearchByKey from './SplayTree/SearchByKey/SearchByKey.tsx'
import { SearchByKeyAnimation as SplayTreeSearchByKeySequence } from './SplayTree/SearchByKey/SearchByKeyAnimation.ts'
import SplayTreeDeleteByKey from './SplayTree/DeleteByKey/DeleteByKey.tsx'
import { DeleteByKeyAnimation as SplayTreeDeleteByKeySequence } from './SplayTree/DeleteByKey/DeleteByKeyAnimation.ts'
import SplayTreeClear from './SplayTree/Clear/Clear.tsx'
import { ClearAnimation as SplayTreeClearSequence } from './SplayTree/Clear/ClearAnimation.ts'
import TreapInsert from './Treap/Insert/Insert.tsx'
import { InsertAnimation as TreapInsertSequence } from './Treap/Insert/InsertAnimation.ts'
import TreapSearchByKey from './Treap/SearchByKey/SearchByKey.tsx'
import { SearchByKeyAnimation as TreapSearchByKeySequence } from './Treap/SearchByKey/SearchByKeyAnimation.ts'
import TreapDeleteByKey from './Treap/DeleteByKey/DeleteByKey.tsx'
import { DeleteByKeyAnimation as TreapDeleteByKeySequence } from './Treap/DeleteByKey/DeleteByKeyAnimation.ts'
import TreapClear from './Treap/Clear/Clear.tsx'
import { ClearAnimation as TreapClearSequence } from './Treap/Clear/ClearAnimation.ts'
import CartesianTreeAppend from './CartesianTree/Append/Append.tsx'
import { AppendAnimation as CartesianTreeAppendSequence } from './CartesianTree/Append/AppendAnimation.ts'
import CartesianTreeRangeMinimum from './CartesianTree/RangeMinimum/RangeMinimum.tsx'
import { RangeMinimumAnimation as CartesianTreeRangeMinimumSequence } from './CartesianTree/RangeMinimum/RangeMinimumAnimation.ts'
import CartesianTreeClear from './CartesianTree/Clear/Clear.tsx'
import { ClearAnimation as CartesianTreeClearSequence } from './CartesianTree/Clear/ClearAnimation.ts'
import ScapegoatTreeInsert from './ScapegoatTree/Insert/Insert.tsx'
import { InsertAnimation as ScapegoatTreeInsertSequence } from './ScapegoatTree/Insert/InsertAnimation.ts'
import ScapegoatTreeSearchByKey from './ScapegoatTree/SearchByKey/SearchByKey.tsx'
import { SearchByKeyAnimation as ScapegoatTreeSearchByKeySequence } from './ScapegoatTree/SearchByKey/SearchByKeyAnimation.ts'
import ScapegoatTreeDeleteByKey from './ScapegoatTree/DeleteByKey/DeleteByKey.tsx'
import { DeleteByKeyAnimation as ScapegoatTreeDeleteByKeySequence } from './ScapegoatTree/DeleteByKey/DeleteByKeyAnimation.ts'
import ScapegoatTreeClear from './ScapegoatTree/Clear/Clear.tsx'
import { ClearAnimation as ScapegoatTreeClearSequence } from './ScapegoatTree/Clear/ClearAnimation.ts'
import AATreeInsert from './AATree/Insert/Insert.tsx'
import { InsertAnimation as AATreeInsertSequence } from './AATree/Insert/InsertAnimation.ts'
import AATreeSearchByKey from './AATree/SearchByKey/SearchByKey.tsx'
import { SearchByKeyAnimation as AATreeSearchByKeySequence } from './AATree/SearchByKey/SearchByKeyAnimation.ts'
import AATreeDeleteByKey from './AATree/DeleteByKey/DeleteByKey.tsx'
import { DeleteByKeyAnimation as AATreeDeleteByKeySequence } from './AATree/DeleteByKey/DeleteByKeyAnimation.ts'
import AATreeClear from './AATree/Clear/Clear.tsx'
import { ClearAnimation as AATreeClearSequence } from './AATree/Clear/ClearAnimation.ts'
import TwoThreeTreeInsert from './TwoThreeTree/Insert/Insert.tsx'
import { InsertAnimation as TwoThreeTreeInsertSequence } from './TwoThreeTree/Insert/InsertAnimation.ts'
import TwoThreeTreeSearchByKey from './TwoThreeTree/SearchByKey/SearchByKey.tsx'
import { SearchByKeyAnimation as TwoThreeTreeSearchByKeySequence } from './TwoThreeTree/SearchByKey/SearchByKeyAnimation.ts'
import TwoThreeTreeClear from './TwoThreeTree/Clear/Clear.tsx'
import { ClearAnimation as TwoThreeTreeClearSequence } from './TwoThreeTree/Clear/ClearAnimation.ts'
import TwoThreeFourTreeInsert from './TwoThreeFourTree/Insert/Insert.tsx'
import { InsertAnimation as TwoThreeFourTreeInsertSequence } from './TwoThreeFourTree/Insert/InsertAnimation.ts'
import TwoThreeFourTreeSearchByKey from './TwoThreeFourTree/SearchByKey/SearchByKey.tsx'
import { SearchByKeyAnimation as TwoThreeFourTreeSearchByKeySequence } from './TwoThreeFourTree/SearchByKey/SearchByKeyAnimation.ts'
import TwoThreeFourTreeDeleteByKey from './TwoThreeFourTree/DeleteByKey/DeleteByKey.tsx'
import { DeleteByKeyAnimation as TwoThreeFourTreeDeleteByKeySequence } from './TwoThreeFourTree/DeleteByKey/DeleteByKeyAnimation.ts'
import TwoThreeFourTreeClear from './TwoThreeFourTree/Clear/Clear.tsx'
import { ClearAnimation as TwoThreeFourTreeClearSequence } from './TwoThreeFourTree/Clear/ClearAnimation.ts'
import RadixTreeInsert from './RadixTree/Insert/Insert.tsx'
import { InsertAnimation as RadixTreeInsertSequence } from './RadixTree/Insert/InsertAnimation.ts'
import RadixTreeSearchByWord from './RadixTree/SearchByWord/SearchByWord.tsx'
import { SearchByWordAnimation as RadixTreeSearchByWordSequence } from './RadixTree/SearchByWord/SearchByWordAnimation.ts'
import RadixTreeStartsWith from './RadixTree/StartsWith/StartsWith.tsx'
import { StartsWithAnimation as RadixTreeStartsWithSequence } from './RadixTree/StartsWith/StartsWithAnimation.ts'
import RadixTreeDeleteByWord from './RadixTree/DeleteByWord/DeleteByWord.tsx'
import { DeleteByWordAnimation as RadixTreeDeleteByWordSequence } from './RadixTree/DeleteByWord/DeleteByWordAnimation.ts'
import RadixTreeClear from './RadixTree/Clear/Clear.tsx'
import { ClearAnimation as RadixTreeClearSequence } from './RadixTree/Clear/ClearAnimation.ts'
import TernarySearchTreeInsert from './TernarySearchTree/Insert/Insert.tsx'
import { InsertAnimation as TernarySearchTreeInsertSequence } from './TernarySearchTree/Insert/InsertAnimation.ts'
import TernarySearchTreeSearchByWord from './TernarySearchTree/SearchByWord/SearchByWord.tsx'
import { SearchByWordAnimation as TernarySearchTreeSearchByWordSequence } from './TernarySearchTree/SearchByWord/SearchByWordAnimation.ts'
import TernarySearchTreeDeleteByWord from './TernarySearchTree/DeleteByWord/DeleteByWord.tsx'
import { DeleteByWordAnimation as TernarySearchTreeDeleteByWordSequence } from './TernarySearchTree/DeleteByWord/DeleteByWordAnimation.ts'
import TernarySearchTreeClear from './TernarySearchTree/Clear/Clear.tsx'
import { ClearAnimation as TernarySearchTreeClearSequence } from './TernarySearchTree/Clear/ClearAnimation.ts'
import SuffixTreeBuild from './SuffixTree/Build/Build.tsx'
import { BuildAnimation as SuffixTreeBuildSequence } from './SuffixTree/Build/BuildAnimation.ts'
import SuffixTreeSearchSubstring from './SuffixTree/SearchSubstring/SearchSubstring.tsx'
import { SearchSubstringAnimation as SuffixTreeSearchSubstringSequence } from './SuffixTree/SearchSubstring/SearchSubstringAnimation.ts'
import SuffixTreeClear from './SuffixTree/Clear/Clear.tsx'
import { ClearAnimation as SuffixTreeClearSequence } from './SuffixTree/Clear/ClearAnimation.ts'
import IntervalTreeInsert from './IntervalTree/Insert/Insert.tsx'
import { InsertAnimation as IntervalTreeInsertSequence } from './IntervalTree/Insert/InsertAnimation.ts'
import IntervalTreeSearchOverlap from './IntervalTree/SearchOverlap/SearchOverlap.tsx'
import { SearchOverlapAnimation as IntervalTreeSearchOverlapSequence } from './IntervalTree/SearchOverlap/SearchOverlapAnimation.ts'
import IntervalTreeClear from './IntervalTree/Clear/Clear.tsx'
import { ClearAnimation as IntervalTreeClearSequence } from './IntervalTree/Clear/ClearAnimation.ts'
import OrderStatisticTreeInsert from './OrderStatisticTree/Insert/Insert.tsx'
import { InsertAnimation as OrderStatisticTreeInsertSequence } from './OrderStatisticTree/Insert/InsertAnimation.ts'
import OrderStatisticTreeSearchByKey from './OrderStatisticTree/SearchByKey/SearchByKey.tsx'
import { SearchByKeyAnimation as OrderStatisticTreeSearchByKeySequence } from './OrderStatisticTree/SearchByKey/SearchByKeyAnimation.ts'
import OrderStatisticTreeDeleteByKey from './OrderStatisticTree/DeleteByKey/DeleteByKey.tsx'
import { DeleteByKeyAnimation as OrderStatisticTreeDeleteByKeySequence } from './OrderStatisticTree/DeleteByKey/DeleteByKeyAnimation.ts'
import OrderStatisticTreeRank from './OrderStatisticTree/Rank/Rank.tsx'
import { RankAnimation as OrderStatisticTreeRankSequence } from './OrderStatisticTree/Rank/RankAnimation.ts'
import OrderStatisticTreeSelect from './OrderStatisticTree/Select/Select.tsx'
import { SelectAnimation as OrderStatisticTreeSelectSequence } from './OrderStatisticTree/Select/SelectAnimation.ts'
import OrderStatisticTreeClear from './OrderStatisticTree/Clear/Clear.tsx'
import { ClearAnimation as OrderStatisticTreeClearSequence } from './OrderStatisticTree/Clear/ClearAnimation.ts'
import PersistentSegmentTreeUpdate from './PersistentSegmentTree/Update/Update.tsx'
import { UpdateAnimation as PersistentSegmentTreeUpdateSequence } from './PersistentSegmentTree/Update/UpdateAnimation.ts'
import PersistentSegmentTreeRangeSum from './PersistentSegmentTree/RangeSum/RangeSum.tsx'
import { RangeSumAnimation as PersistentSegmentTreeRangeSumSequence } from './PersistentSegmentTree/RangeSum/RangeSumAnimation.ts'
import PersistentSegmentTreeClear from './PersistentSegmentTree/Clear/Clear.tsx'
import { ClearAnimation as PersistentSegmentTreeClearSequence } from './PersistentSegmentTree/Clear/ClearAnimation.ts'
import SparseTableBuild from './SparseTable/Build/Build.tsx'
import { BuildAnimation as SparseTableBuildSequence } from './SparseTable/Build/BuildAnimation.ts'
import SparseTableRangeMinimum from './SparseTable/RangeMinimum/RangeMinimum.tsx'
import { RangeMinimumAnimation as SparseTableRangeMinimumSequence } from './SparseTable/RangeMinimum/RangeMinimumAnimation.ts'
import SparseTableClear from './SparseTable/Clear/Clear.tsx'
import { ClearAnimation as SparseTableClearSequence } from './SparseTable/Clear/ClearAnimation.ts'
import KDTreeInsert from './KDTree/Insert/Insert.tsx'
import { InsertAnimation as KDTreeInsertSequence } from './KDTree/Insert/InsertAnimation.ts'
import KDTreeSearchOverlap from './KDTree/SearchOverlap/SearchOverlap.tsx'
import { SearchOverlapAnimation as KDTreeSearchOverlapSequence } from './KDTree/SearchOverlap/SearchOverlapAnimation.ts'
import KDTreeClear from './KDTree/Clear/Clear.tsx'
import { ClearAnimation as KDTreeClearSequence } from './KDTree/Clear/ClearAnimation.ts'
import QuadtreeInsert from './Quadtree/Insert/Insert.tsx'
import { InsertAnimation as QuadtreeInsertSequence } from './Quadtree/Insert/InsertAnimation.ts'
import QuadtreeSearchOverlap from './Quadtree/SearchOverlap/SearchOverlap.tsx'
import { SearchOverlapAnimation as QuadtreeSearchOverlapSequence } from './Quadtree/SearchOverlap/SearchOverlapAnimation.ts'
import QuadtreeClear from './Quadtree/Clear/Clear.tsx'
import { ClearAnimation as QuadtreeClearSequence } from './Quadtree/Clear/ClearAnimation.ts'
import OctreeInsert from './Octree/Insert/Insert.tsx'
import { InsertAnimation as OctreeInsertSequence } from './Octree/Insert/InsertAnimation.ts'
import OctreeSearchOverlap from './Octree/SearchOverlap/SearchOverlap.tsx'
import { SearchOverlapAnimation as OctreeSearchOverlapSequence } from './Octree/SearchOverlap/SearchOverlapAnimation.ts'
import OctreeClear from './Octree/Clear/Clear.tsx'
import { ClearAnimation as OctreeClearSequence } from './Octree/Clear/ClearAnimation.ts'
import BoundingVolumeHierarchyInsert from './BoundingVolumeHierarchy/Insert/Insert.tsx'
import { InsertAnimation as BoundingVolumeHierarchyInsertSequence } from './BoundingVolumeHierarchy/Insert/InsertAnimation.ts'
import BoundingVolumeHierarchySearchOverlap from './BoundingVolumeHierarchy/SearchOverlap/SearchOverlap.tsx'
import { SearchOverlapAnimation as BoundingVolumeHierarchySearchOverlapSequence } from './BoundingVolumeHierarchy/SearchOverlap/SearchOverlapAnimation.ts'
import BoundingVolumeHierarchyClear from './BoundingVolumeHierarchy/Clear/Clear.tsx'
import { ClearAnimation as BoundingVolumeHierarchyClearSequence } from './BoundingVolumeHierarchy/Clear/ClearAnimation.ts'
import MerkleTreeUpdate from './MerkleTree/Update/Update.tsx'
import { UpdateAnimation as MerkleTreeUpdateSequence } from './MerkleTree/Update/UpdateAnimation.ts'
import MerkleTreeVerifyProof from './MerkleTree/VerifyProof/VerifyProof.tsx'
import { VerifyProofAnimation as MerkleTreeVerifyProofSequence } from './MerkleTree/VerifyProof/VerifyProofAnimation.ts'
import MerkleTreeClear from './MerkleTree/Clear/Clear.tsx'
import { ClearAnimation as MerkleTreeClearSequence } from './MerkleTree/Clear/ClearAnimation.ts'
import VanEmdeBoasTreeInsert from './VanEmdeBoasTree/Insert/Insert.tsx'
import { InsertAnimation as VanEmdeBoasTreeInsertSequence } from './VanEmdeBoasTree/Insert/InsertAnimation.ts'
import VanEmdeBoasTreeSearchByKey from './VanEmdeBoasTree/SearchByKey/SearchByKey.tsx'
import { SearchByKeyAnimation as VanEmdeBoasTreeSearchByKeySequence } from './VanEmdeBoasTree/SearchByKey/SearchByKeyAnimation.ts'
import VanEmdeBoasTreeSuccessor from './VanEmdeBoasTree/Successor/Successor.tsx'
import { SuccessorAnimation as VanEmdeBoasTreeSuccessorSequence } from './VanEmdeBoasTree/Successor/SuccessorAnimation.ts'
import VanEmdeBoasTreeDeleteByKey from './VanEmdeBoasTree/DeleteByKey/DeleteByKey.tsx'
import { DeleteByKeyAnimation as VanEmdeBoasTreeDeleteByKeySequence } from './VanEmdeBoasTree/DeleteByKey/DeleteByKeyAnimation.ts'
import VanEmdeBoasTreeClear from './VanEmdeBoasTree/Clear/Clear.tsx'
import { ClearAnimation as VanEmdeBoasTreeClearSequence } from './VanEmdeBoasTree/Clear/ClearAnimation.ts'
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
