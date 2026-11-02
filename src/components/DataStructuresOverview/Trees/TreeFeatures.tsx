import type { ReactNode } from 'react'
import type { ActionKind } from '../../../visualization/ActionCatalog.ts'
import type { AlgorithmInformation } from '../../../visualization/AlgorithmInformation.ts'
import type { StructuredTreeActionProps } from '../../ActionPlayback/StructuredTreeAction.tsx'
import { LSMTree } from './LSMTree/LSMTree.ts'
import ASTBuild from './AST/Build/Build.tsx'
import { BuildAnimation as ASTBuildSequence } from './AST/Build/BuildAnimation.ts'
import ASTPreorder from './AST/Preorder/Preorder.tsx'
import { PreorderAnimation as ASTPreorderSequence } from './AST/Preorder/PreorderAnimation.ts'
import ASTInorder from './AST/Inorder/Inorder.tsx'
import { InorderAnimation as ASTInorderSequence } from './AST/Inorder/InorderAnimation.ts'
import ASTPostorder from './AST/Postorder/Postorder.tsx'
import { PostorderAnimation as ASTPostorderSequence } from './AST/Postorder/PostorderAnimation.ts'
import ASTEvaluate from './AST/Evaluate/Evaluate.tsx'
import { EvaluateAnimation as ASTEvaluateSequence } from './AST/Evaluate/EvaluateAnimation.ts'
import ASTClear from './AST/Clear/Clear.tsx'
import { ClearAnimation as ASTClearSequence } from './AST/Clear/ClearAnimation.ts'
import TrieInsert from './Trie/Insert/Insert.tsx'
import { InsertAnimation as TrieInsertSequence } from './Trie/Insert/InsertAnimation.ts'
import TrieSearchByWord from './Trie/SearchByWord/SearchByWord.tsx'
import { SearchByWordAnimation as TrieSearchByWordSequence } from './Trie/SearchByWord/SearchByWordAnimation.ts'
import TrieStartsWith from './Trie/StartsWith/StartsWith.tsx'
import { StartsWithAnimation as TrieStartsWithSequence } from './Trie/StartsWith/StartsWithAnimation.ts'
import TrieDeleteByWord from './Trie/DeleteByWord/DeleteByWord.tsx'
import { DeleteByWordAnimation as TrieDeleteByWordSequence } from './Trie/DeleteByWord/DeleteByWordAnimation.ts'
import TrieClear from './Trie/Clear/Clear.tsx'
import { ClearAnimation as TrieClearSequence } from './Trie/Clear/ClearAnimation.ts'
import SegmentTreeUpdate from './SegmentTree/Update/Update.tsx'
import { UpdateAnimation as SegmentTreeUpdateSequence } from './SegmentTree/Update/UpdateAnimation.ts'
import SegmentTreeRangeSum from './SegmentTree/RangeSum/RangeSum.tsx'
import { RangeSumAnimation as SegmentTreeRangeSumSequence } from './SegmentTree/RangeSum/RangeSumAnimation.ts'
import SegmentTreeClear from './SegmentTree/Clear/Clear.tsx'
import { ClearAnimation as SegmentTreeClearSequence } from './SegmentTree/Clear/ClearAnimation.ts'
import FenwickTreeAdd from './FenwickTree/Add/Add.tsx'
import { AddAnimation as FenwickTreeAddSequence } from './FenwickTree/Add/AddAnimation.ts'
import FenwickTreePrefixSum from './FenwickTree/PrefixSum/PrefixSum.tsx'
import { PrefixSumAnimation as FenwickTreePrefixSumSequence } from './FenwickTree/PrefixSum/PrefixSumAnimation.ts'
import FenwickTreeRangeSum from './FenwickTree/RangeSum/RangeSum.tsx'
import { RangeSumAnimation as FenwickTreeRangeSumSequence } from './FenwickTree/RangeSum/RangeSumAnimation.ts'
import FenwickTreeClear from './FenwickTree/Clear/Clear.tsx'
import { ClearAnimation as FenwickTreeClearSequence } from './FenwickTree/Clear/ClearAnimation.ts'
import RTreeInsert from './RTree/Insert/Insert.tsx'
import { InsertAnimation as RTreeInsertSequence } from './RTree/Insert/InsertAnimation.ts'
import RTreeSearchOverlap from './RTree/SearchOverlap/SearchOverlap.tsx'
import { SearchOverlapAnimation as RTreeSearchOverlapSequence } from './RTree/SearchOverlap/SearchOverlapAnimation.ts'
import RTreeDeleteById from './RTree/DeleteById/DeleteById.tsx'
import { DeleteByIdAnimation as RTreeDeleteByIdSequence } from './RTree/DeleteById/DeleteByIdAnimation.ts'
import RTreeClear from './RTree/Clear/Clear.tsx'
import { ClearAnimation as RTreeClearSequence } from './RTree/Clear/ClearAnimation.ts'
import LSMTreeInsert from './LSMTree/Insert/Insert.tsx'
import { InsertAnimation as LSMTreeInsertSequence } from './LSMTree/Insert/InsertAnimation.ts'
import LSMTreeSearchByKey from './LSMTree/SearchByKey/SearchByKey.tsx'
import { SearchByKeyAnimation as LSMTreeSearchByKeySequence } from './LSMTree/SearchByKey/SearchByKeyAnimation.ts'
import LSMTreeDeleteByKey from './LSMTree/DeleteByKey/DeleteByKey.tsx'
import { DeleteByKeyAnimation as LSMTreeDeleteByKeySequence } from './LSMTree/DeleteByKey/DeleteByKeyAnimation.ts'
import LSMTreeFlush from './LSMTree/Flush/Flush.tsx'
import { FlushAnimation as LSMTreeFlushSequence } from './LSMTree/Flush/FlushAnimation.ts'
import LSMTreeCompact from './LSMTree/Compact/Compact.tsx'
import { CompactAnimation as LSMTreeCompactSequence } from './LSMTree/Compact/CompactAnimation.ts'
import LSMTreeClear from './LSMTree/Clear/Clear.tsx'
import { ClearAnimation as LSMTreeClearSequence } from './LSMTree/Clear/ClearAnimation.ts'

export class TreeFeatures {
  public static render(action: ActionKind, props: StructuredTreeActionProps, session: number): ReactNode {
    switch (props.model.kind) {
      case 'ast':
        switch (action) {
          case 'build-expression': return <ASTBuild key={session} {...props} />
          case 'traverse-preorder': return <ASTPreorder key={session} {...props} />
          case 'traverse-inorder': return <ASTInorder key={session} {...props} />
          case 'traverse-postorder': return <ASTPostorder key={session} {...props} />
          case 'evaluate': return <ASTEvaluate key={session} {...props} />
          case 'clear': return <ASTClear key={session} {...props} />
        }
        break
      case 'trie':
        switch (action) {
          case 'insert': return <TrieInsert key={session} {...props} />
          case 'search-value': return <TrieSearchByWord key={session} {...props} />
          case 'starts-with': return <TrieStartsWith key={session} {...props} />
          case 'delete-value': return <TrieDeleteByWord key={session} {...props} />
          case 'clear': return <TrieClear key={session} {...props} />
        }
        break
      case 'segment-tree':
        switch (action) {
          case 'update-index': return <SegmentTreeUpdate key={session} {...props} />
          case 'range-sum': return <SegmentTreeRangeSum key={session} {...props} />
          case 'clear': return <SegmentTreeClear key={session} {...props} />
        }
        break
      case 'fenwick-tree':
        switch (action) {
          case 'add-index': return <FenwickTreeAdd key={session} {...props} />
          case 'prefix-sum': return <FenwickTreePrefixSum key={session} {...props} />
          case 'range-sum': return <FenwickTreeRangeSum key={session} {...props} />
          case 'clear': return <FenwickTreeClear key={session} {...props} />
        }
        break
      case 'r-tree':
        switch (action) {
          case 'insert': return <RTreeInsert key={session} {...props} />
          case 'search-overlap': return <RTreeSearchOverlap key={session} {...props} />
          case 'delete-value': return <RTreeDeleteById key={session} {...props} />
          case 'clear': return <RTreeClear key={session} {...props} />
        }
        break
      case 'lsm-tree':
        switch (action) {
          case 'insert': return <LSMTreeInsert key={session} {...props} />
          case 'search-value': return <LSMTreeSearchByKey key={session} {...props} />
          case 'delete-value': return <LSMTreeDeleteByKey key={session} {...props} />
          case 'flush': return <LSMTreeFlush key={session} {...props} />
          case 'compact': return <LSMTreeCompact key={session} {...props} />
          case 'clear': return <LSMTreeClear key={session} {...props} />
        }
        break
    }
    return null
  }

  public static describe(action: ActionKind, model: StructuredTreeActionProps['model']): AlgorithmInformation | null {
    const size = model.length
    const storage = model instanceof LSMTree ? model.storedCount : size
    const runs = model instanceof LSMTree ? model.runCount : 0
    switch (model.kind) {
      case 'ast':
        switch (action) {
          case 'build-expression': return ASTBuildSequence.describe(size)
          case 'traverse-preorder': return ASTPreorderSequence.describe(size)
          case 'traverse-inorder': return ASTInorderSequence.describe(size)
          case 'traverse-postorder': return ASTPostorderSequence.describe(size)
          case 'evaluate': return ASTEvaluateSequence.describe(size)
          case 'clear': return ASTClearSequence.describe(size)
        }
        break
      case 'trie':
        switch (action) {
          case 'insert': return TrieInsertSequence.describe(size, storage, runs)
          case 'search-value': return TrieSearchByWordSequence.describe(size, storage, runs)
          case 'starts-with': return TrieStartsWithSequence.describe(size, storage, runs)
          case 'delete-value': return TrieDeleteByWordSequence.describe(size, storage, runs)
          case 'clear': return TrieClearSequence.describe(size, storage, runs)
        }
        break
      case 'segment-tree':
        switch (action) {
          case 'update-index': return SegmentTreeUpdateSequence.describe(size, storage, runs)
          case 'range-sum': return SegmentTreeRangeSumSequence.describe(size, storage, runs)
          case 'clear': return SegmentTreeClearSequence.describe(size, storage, runs)
        }
        break
      case 'fenwick-tree':
        switch (action) {
          case 'add-index': return FenwickTreeAddSequence.describe(size, storage, runs)
          case 'prefix-sum': return FenwickTreePrefixSumSequence.describe(size, storage, runs)
          case 'range-sum': return FenwickTreeRangeSumSequence.describe(size, storage, runs)
          case 'clear': return FenwickTreeClearSequence.describe(size, storage, runs)
        }
        break
      case 'r-tree':
        switch (action) {
          case 'insert': return RTreeInsertSequence.describe(size, storage, runs)
          case 'search-overlap': return RTreeSearchOverlapSequence.describe(size, storage, runs)
          case 'delete-value': return RTreeDeleteByIdSequence.describe(size, storage, runs)
          case 'clear': return RTreeClearSequence.describe(size, storage, runs)
        }
        break
      case 'lsm-tree':
        switch (action) {
          case 'insert': return LSMTreeInsertSequence.describe(size, storage, runs)
          case 'search-value': return LSMTreeSearchByKeySequence.describe(size, storage, runs)
          case 'delete-value': return LSMTreeDeleteByKeySequence.describe(size, storage, runs)
          case 'flush': return LSMTreeFlushSequence.describe(size, storage, runs)
          case 'compact': return LSMTreeCompactSequence.describe(size, storage, runs)
          case 'clear': return LSMTreeClearSequence.describe(size, storage, runs)
        }
        break
    }
    return null
  }
}
