import { AppliedFeatures } from '../AppliedFeatures.tsx'
import { NumericalFeatures } from './NumericalFeatures.tsx'
import { NumericalStructureCatalog } from '../../../visualization/NumericalStructureCatalog.ts'
import { AppliedStructureCatalog } from '../../../visualization/AppliedStructureCatalog.ts'
import { SetUnionFeatures } from '../SetUnion/SetUnionFeatures.tsx'
import { SetUnionStructureCatalog } from '../../../visualization/SetUnionStructureCatalog.ts'
import { StringTextFeatures } from '../StringText/StringTextFeatures.tsx'
import { StringTextStructureCatalog } from '../../../visualization/StringTextStructureCatalog.ts'
import type { ReactNode } from 'react'
import type { ActionKind } from '../../../visualization/ActionCatalog.ts'
import type { AlgorithmInformation } from '../../../visualization/AlgorithmInformation.ts'
import type { LinearModel } from '../../../visualization/LinearModel.ts'
import type { StructuredLinearActionProps } from '../../ActionPlayback/StructuredLinearAction.tsx'
import SkipListInsert from './SkipList/Insert/Insert.tsx'
import { InsertAnimation as SkipListInsertSequence } from './SkipList/Insert/InsertAnimation.ts'
import SkipListSearchByValue from './SkipList/SearchByValue/SearchByValue.tsx'
import { SearchByValueAnimation as SkipListSearchByValueSequence } from './SkipList/SearchByValue/SearchByValueAnimation.ts'
import SkipListDeleteByValue from './SkipList/DeleteByValue/DeleteByValue.tsx'
import { DeleteByValueAnimation as SkipListDeleteByValueSequence } from './SkipList/DeleteByValue/DeleteByValueAnimation.ts'
import SkipListClear from './SkipList/Clear/Clear.tsx'
import { ClearAnimation as SkipListClearSequence } from './SkipList/Clear/ClearAnimation.ts'
import UnrolledLinkedListInsert from './UnrolledLinkedList/Insert/Insert.tsx'
import { InsertAnimation as UnrolledLinkedListInsertSequence } from './UnrolledLinkedList/Insert/InsertAnimation.ts'
import UnrolledLinkedListSearchByValue from './UnrolledLinkedList/SearchByValue/SearchByValue.tsx'
import { SearchByValueAnimation as UnrolledLinkedListSearchByValueSequence } from './UnrolledLinkedList/SearchByValue/SearchByValueAnimation.ts'
import UnrolledLinkedListDeleteByValue from './UnrolledLinkedList/DeleteByValue/DeleteByValue.tsx'
import { DeleteByValueAnimation as UnrolledLinkedListDeleteByValueSequence } from './UnrolledLinkedList/DeleteByValue/DeleteByValueAnimation.ts'
import UnrolledLinkedListClear from './UnrolledLinkedList/Clear/Clear.tsx'
import { ClearAnimation as UnrolledLinkedListClearSequence } from './UnrolledLinkedList/Clear/ClearAnimation.ts'
import XORLinkedListAppend from './XORLinkedList/Append/Append.tsx'
import { AppendAnimation as XORLinkedListAppendSequence } from './XORLinkedList/Append/AppendAnimation.ts'
import XORLinkedListSearchByValue from './XORLinkedList/SearchByValue/SearchByValue.tsx'
import { SearchByValueAnimation as XORLinkedListSearchByValueSequence } from './XORLinkedList/SearchByValue/SearchByValueAnimation.ts'
import XORLinkedListDeleteByValue from './XORLinkedList/DeleteByValue/DeleteByValue.tsx'
import { DeleteByValueAnimation as XORLinkedListDeleteByValueSequence } from './XORLinkedList/DeleteByValue/DeleteByValueAnimation.ts'
import XORLinkedListClear from './XORLinkedList/Clear/Clear.tsx'
import { ClearAnimation as XORLinkedListClearSequence } from './XORLinkedList/Clear/ClearAnimation.ts'
import GapBufferInsert from '../StringText/GapBuffer/Insert/Insert.tsx'
import { InsertAnimation as GapBufferInsertSequence } from '../StringText/GapBuffer/Insert/InsertAnimation.ts'
import GapBufferMoveGap from '../StringText/GapBuffer/MoveGap/MoveGap.tsx'
import { MoveGapAnimation as GapBufferMoveGapSequence } from '../StringText/GapBuffer/MoveGap/MoveGapAnimation.ts'
import GapBufferDelete from '../StringText/GapBuffer/Delete/Delete.tsx'
import { DeleteAnimation as GapBufferDeleteSequence } from '../StringText/GapBuffer/Delete/DeleteAnimation.ts'
import GapBufferSearch from '../StringText/GapBuffer/Search/Search.tsx'
import { SearchAnimation as GapBufferSearchSequence } from '../StringText/GapBuffer/Search/SearchAnimation.ts'
import GapBufferClear from '../StringText/GapBuffer/Clear/Clear.tsx'
import { ClearAnimation as GapBufferClearSequence } from '../StringText/GapBuffer/Clear/ClearAnimation.ts'
import BitSetSetBit from '../SetUnion/BitSet/SetBit/SetBit.tsx'
import { SetBitAnimation as BitSetSetBitSequence } from '../SetUnion/BitSet/SetBit/SetBitAnimation.ts'
import BitSetClearBit from '../SetUnion/BitSet/ClearBit/ClearBit.tsx'
import { ClearBitAnimation as BitSetClearBitSequence } from '../SetUnion/BitSet/ClearBit/ClearBitAnimation.ts'
import BitSetToggleBit from '../SetUnion/BitSet/ToggleBit/ToggleBit.tsx'
import { ToggleBitAnimation as BitSetToggleBitSequence } from '../SetUnion/BitSet/ToggleBit/ToggleBitAnimation.ts'
import BitSetTestBit from '../SetUnion/BitSet/TestBit/TestBit.tsx'
import { TestBitAnimation as BitSetTestBitSequence } from '../SetUnion/BitSet/TestBit/TestBitAnimation.ts'
import BitSetClear from '../SetUnion/BitSet/Clear/Clear.tsx'
import { ClearAnimation as BitSetClearSequence } from '../SetUnion/BitSet/Clear/ClearAnimation.ts'
import SparseArraySet from './SparseArray/Set/Set.tsx'
import { SetAnimation as SparseArraySetSequence } from './SparseArray/Set/SetAnimation.ts'
import SparseArrayRead from './SparseArray/Read/Read.tsx'
import { ReadAnimation as SparseArrayReadSequence } from './SparseArray/Read/ReadAnimation.ts'
import SparseArrayDelete from './SparseArray/Delete/Delete.tsx'
import { DeleteAnimation as SparseArrayDeleteSequence } from './SparseArray/Delete/DeleteAnimation.ts'
import SparseArrayClear from './SparseArray/Clear/Clear.tsx'
import { ClearAnimation as SparseArrayClearSequence } from './SparseArray/Clear/ClearAnimation.ts'
import FreeListAllocate from './FreeList/Allocate/Allocate.tsx'
import { AllocateAnimation as FreeListAllocateSequence } from './FreeList/Allocate/AllocateAnimation.ts'
import FreeListRelease from './FreeList/Release/Release.tsx'
import { ReleaseAnimation as FreeListReleaseSequence } from './FreeList/Release/ReleaseAnimation.ts'
import FreeListClear from './FreeList/Clear/Clear.tsx'
import { ClearAnimation as FreeListClearSequence } from './FreeList/Clear/ClearAnimation.ts'

export class LinearFeatures {
  public static render(action: ActionKind, props: StructuredLinearActionProps, session: number): ReactNode {
    if (NumericalStructureCatalog.supports(props.model.kind)) return NumericalFeatures.render(action, props, session)
    if (AppliedStructureCatalog.supports(props.model.kind)) return AppliedFeatures.render(action, props, session)
    if (SetUnionStructureCatalog.supports(props.model.kind)) return SetUnionFeatures.render(action, props, session)
    if (StringTextStructureCatalog.supports(props.model.kind)) return StringTextFeatures.render(action, props, session)
    switch (props.model.kind) {
      case 'skip-list':
        switch (action) {
          case 'insert': return <SkipListInsert key={session} {...props} />
          case 'search-value': return <SkipListSearchByValue key={session} {...props} />
          case 'delete-value': return <SkipListDeleteByValue key={session} {...props} />
          case 'clear': return <SkipListClear key={session} {...props} />
        }
        break
      case 'unrolled-linked-list':
        switch (action) {
          case 'insert': return <UnrolledLinkedListInsert key={session} {...props} />
          case 'search-value': return <UnrolledLinkedListSearchByValue key={session} {...props} />
          case 'delete-value': return <UnrolledLinkedListDeleteByValue key={session} {...props} />
          case 'clear': return <UnrolledLinkedListClear key={session} {...props} />
        }
        break
      case 'xor-linked-list':
        switch (action) {
          case 'insert-end': return <XORLinkedListAppend key={session} {...props} />
          case 'search-value': return <XORLinkedListSearchByValue key={session} {...props} />
          case 'delete-value': return <XORLinkedListDeleteByValue key={session} {...props} />
          case 'clear': return <XORLinkedListClear key={session} {...props} />
        }
        break
      case 'gap-buffer':
        switch (action) {
          case 'insert': return <GapBufferInsert key={session} {...props} />
          case 'move-gap': return <GapBufferMoveGap key={session} {...props} />
          case 'delete-index': return <GapBufferDelete key={session} {...props} />
          case 'search-value': return <GapBufferSearch key={session} {...props} />
          case 'clear': return <GapBufferClear key={session} {...props} />
        }
        break
      case 'bit-set':
        switch (action) {
          case 'set-bit': return <BitSetSetBit key={session} {...props} />
          case 'clear-bit': return <BitSetClearBit key={session} {...props} />
          case 'toggle-bit': return <BitSetToggleBit key={session} {...props} />
          case 'search-index': return <BitSetTestBit key={session} {...props} />
          case 'clear': return <BitSetClear key={session} {...props} />
        }
        break
      case 'sparse-array':
        switch (action) {
          case 'update-index': return <SparseArraySet key={session} {...props} />
          case 'search-index': return <SparseArrayRead key={session} {...props} />
          case 'delete-index': return <SparseArrayDelete key={session} {...props} />
          case 'clear': return <SparseArrayClear key={session} {...props} />
        }
        break
      case 'free-list':
        switch (action) {
          case 'allocate': return <FreeListAllocate key={session} {...props} />
          case 'release': return <FreeListRelease key={session} {...props} />
          case 'clear': return <FreeListClear key={session} {...props} />
        }
        break
    }
    return null
  }

  public static describe(action: ActionKind, model: LinearModel): AlgorithmInformation | null {
    if (NumericalStructureCatalog.supports(model.kind)) return NumericalFeatures.describe(action, model)
    if (AppliedStructureCatalog.supports(model.kind)) return AppliedFeatures.describe(action, model)
    if (SetUnionStructureCatalog.supports(model.kind)) return SetUnionFeatures.describe(action, model)
    if (StringTextStructureCatalog.supports(model.kind)) return StringTextFeatures.describe(action, model)
    switch (model.kind) {
      case 'skip-list':
        switch (action) {
          case 'insert': return SkipListInsertSequence.describe(model.length)
          case 'search-value': return SkipListSearchByValueSequence.describe(model.length)
          case 'delete-value': return SkipListDeleteByValueSequence.describe(model.length)
          case 'clear': return SkipListClearSequence.describe(model.length)
        }
        break
      case 'unrolled-linked-list':
        switch (action) {
          case 'insert': return UnrolledLinkedListInsertSequence.describe(model.length)
          case 'search-value': return UnrolledLinkedListSearchByValueSequence.describe(model.length)
          case 'delete-value': return UnrolledLinkedListDeleteByValueSequence.describe(model.length)
          case 'clear': return UnrolledLinkedListClearSequence.describe(model.length)
        }
        break
      case 'xor-linked-list':
        switch (action) {
          case 'insert-end': return XORLinkedListAppendSequence.describe(model.length)
          case 'search-value': return XORLinkedListSearchByValueSequence.describe(model.length)
          case 'delete-value': return XORLinkedListDeleteByValueSequence.describe(model.length)
          case 'clear': return XORLinkedListClearSequence.describe(model.length)
        }
        break
      case 'gap-buffer':
        switch (action) {
          case 'insert': return GapBufferInsertSequence.describe(model.length)
          case 'move-gap': return GapBufferMoveGapSequence.describe(model.length)
          case 'delete-index': return GapBufferDeleteSequence.describe(model.length)
          case 'search-value': return GapBufferSearchSequence.describe(model.length)
          case 'clear': return GapBufferClearSequence.describe(model.length)
        }
        break
      case 'bit-set':
        switch (action) {
          case 'set-bit': return BitSetSetBitSequence.describe(model.length)
          case 'clear-bit': return BitSetClearBitSequence.describe(model.length)
          case 'toggle-bit': return BitSetToggleBitSequence.describe(model.length)
          case 'search-index': return BitSetTestBitSequence.describe(model.length)
          case 'clear': return BitSetClearSequence.describe(model.length)
        }
        break
      case 'sparse-array':
        switch (action) {
          case 'update-index': return SparseArraySetSequence.describe(model.length)
          case 'search-index': return SparseArrayReadSequence.describe(model.length)
          case 'delete-index': return SparseArrayDeleteSequence.describe(model.length)
          case 'clear': return SparseArrayClearSequence.describe(model.length)
        }
        break
      case 'free-list':
        switch (action) {
          case 'allocate': return FreeListAllocateSequence.describe(model.length)
          case 'release': return FreeListReleaseSequence.describe(model.length)
          case 'clear': return FreeListClearSequence.describe(model.length)
        }
        break
    }
    return null
  }
}
