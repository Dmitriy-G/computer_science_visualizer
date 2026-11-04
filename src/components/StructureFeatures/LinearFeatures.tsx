import { AppliedFeatures } from './AppliedFeatures.tsx'
import { NumericalFeatures } from './NumericalFeatures.tsx'
import { NumericalStructureCatalog } from '../../visualization/NumericalStructureCatalog.ts'
import { AppliedStructureCatalog } from '../../visualization/AppliedStructureCatalog.ts'
import { SetUnionFeatures } from './SetUnionFeatures.tsx'
import { SetUnionStructureCatalog } from '../../visualization/SetUnionStructureCatalog.ts'
import { StringTextFeatures } from './StringTextFeatures.tsx'
import { StringTextStructureCatalog } from '../../visualization/StringTextStructureCatalog.ts'
import type { ReactNode } from 'react'
import type { ActionKind } from '../../visualization/ActionCatalog.ts'
import type { AlgorithmInformation } from '../../visualization/AlgorithmInformation.ts'
import type { LinearModel } from '../../visualization/LinearModel.ts'
import type { StructuredLinearActionProps } from '../ActionPlayback/StructuredLinearAction.tsx'
import SkipListInsert from '../AdvancedDataStructures/Sequences/SkipList/Insert/Insert.tsx'
import { InsertAnimation as SkipListInsertSequence } from '../AdvancedDataStructures/Sequences/SkipList/Insert/InsertAnimation.ts'
import SkipListSearchByValue from '../AdvancedDataStructures/Sequences/SkipList/SearchByValue/SearchByValue.tsx'
import { SearchByValueAnimation as SkipListSearchByValueSequence } from '../AdvancedDataStructures/Sequences/SkipList/SearchByValue/SearchByValueAnimation.ts'
import SkipListDeleteByValue from '../AdvancedDataStructures/Sequences/SkipList/DeleteByValue/DeleteByValue.tsx'
import { DeleteByValueAnimation as SkipListDeleteByValueSequence } from '../AdvancedDataStructures/Sequences/SkipList/DeleteByValue/DeleteByValueAnimation.ts'
import SkipListClear from '../AdvancedDataStructures/Sequences/SkipList/Clear/Clear.tsx'
import { ClearAnimation as SkipListClearSequence } from '../AdvancedDataStructures/Sequences/SkipList/Clear/ClearAnimation.ts'
import UnrolledLinkedListInsert from '../AdvancedDataStructures/Sequences/UnrolledLinkedList/Insert/Insert.tsx'
import { InsertAnimation as UnrolledLinkedListInsertSequence } from '../AdvancedDataStructures/Sequences/UnrolledLinkedList/Insert/InsertAnimation.ts'
import UnrolledLinkedListSearchByValue from '../AdvancedDataStructures/Sequences/UnrolledLinkedList/SearchByValue/SearchByValue.tsx'
import { SearchByValueAnimation as UnrolledLinkedListSearchByValueSequence } from '../AdvancedDataStructures/Sequences/UnrolledLinkedList/SearchByValue/SearchByValueAnimation.ts'
import UnrolledLinkedListDeleteByValue from '../AdvancedDataStructures/Sequences/UnrolledLinkedList/DeleteByValue/DeleteByValue.tsx'
import { DeleteByValueAnimation as UnrolledLinkedListDeleteByValueSequence } from '../AdvancedDataStructures/Sequences/UnrolledLinkedList/DeleteByValue/DeleteByValueAnimation.ts'
import UnrolledLinkedListClear from '../AdvancedDataStructures/Sequences/UnrolledLinkedList/Clear/Clear.tsx'
import { ClearAnimation as UnrolledLinkedListClearSequence } from '../AdvancedDataStructures/Sequences/UnrolledLinkedList/Clear/ClearAnimation.ts'
import XORLinkedListAppend from '../AdvancedDataStructures/Sequences/XORLinkedList/Append/Append.tsx'
import { AppendAnimation as XORLinkedListAppendSequence } from '../AdvancedDataStructures/Sequences/XORLinkedList/Append/AppendAnimation.ts'
import XORLinkedListSearchByValue from '../AdvancedDataStructures/Sequences/XORLinkedList/SearchByValue/SearchByValue.tsx'
import { SearchByValueAnimation as XORLinkedListSearchByValueSequence } from '../AdvancedDataStructures/Sequences/XORLinkedList/SearchByValue/SearchByValueAnimation.ts'
import XORLinkedListDeleteByValue from '../AdvancedDataStructures/Sequences/XORLinkedList/DeleteByValue/DeleteByValue.tsx'
import { DeleteByValueAnimation as XORLinkedListDeleteByValueSequence } from '../AdvancedDataStructures/Sequences/XORLinkedList/DeleteByValue/DeleteByValueAnimation.ts'
import XORLinkedListClear from '../AdvancedDataStructures/Sequences/XORLinkedList/Clear/Clear.tsx'
import { ClearAnimation as XORLinkedListClearSequence } from '../AdvancedDataStructures/Sequences/XORLinkedList/Clear/ClearAnimation.ts'
import GapBufferInsert from '../AdvancedDataStructures/TextSearch/GapBuffer/Insert/Insert.tsx'
import { InsertAnimation as GapBufferInsertSequence } from '../AdvancedDataStructures/TextSearch/GapBuffer/Insert/InsertAnimation.ts'
import GapBufferMoveGap from '../AdvancedDataStructures/TextSearch/GapBuffer/MoveGap/MoveGap.tsx'
import { MoveGapAnimation as GapBufferMoveGapSequence } from '../AdvancedDataStructures/TextSearch/GapBuffer/MoveGap/MoveGapAnimation.ts'
import GapBufferDelete from '../AdvancedDataStructures/TextSearch/GapBuffer/Delete/Delete.tsx'
import { DeleteAnimation as GapBufferDeleteSequence } from '../AdvancedDataStructures/TextSearch/GapBuffer/Delete/DeleteAnimation.ts'
import GapBufferSearch from '../AdvancedDataStructures/TextSearch/GapBuffer/Search/Search.tsx'
import { SearchAnimation as GapBufferSearchSequence } from '../AdvancedDataStructures/TextSearch/GapBuffer/Search/SearchAnimation.ts'
import GapBufferClear from '../AdvancedDataStructures/TextSearch/GapBuffer/Clear/Clear.tsx'
import { ClearAnimation as GapBufferClearSequence } from '../AdvancedDataStructures/TextSearch/GapBuffer/Clear/ClearAnimation.ts'
import BitSetSetBit from '../FundamentalDataStructures/SetUnion/BitSet/SetBit/SetBit.tsx'
import { SetBitAnimation as BitSetSetBitSequence } from '../FundamentalDataStructures/SetUnion/BitSet/SetBit/SetBitAnimation.ts'
import BitSetClearBit from '../FundamentalDataStructures/SetUnion/BitSet/ClearBit/ClearBit.tsx'
import { ClearBitAnimation as BitSetClearBitSequence } from '../FundamentalDataStructures/SetUnion/BitSet/ClearBit/ClearBitAnimation.ts'
import BitSetToggleBit from '../FundamentalDataStructures/SetUnion/BitSet/ToggleBit/ToggleBit.tsx'
import { ToggleBitAnimation as BitSetToggleBitSequence } from '../FundamentalDataStructures/SetUnion/BitSet/ToggleBit/ToggleBitAnimation.ts'
import BitSetTestBit from '../FundamentalDataStructures/SetUnion/BitSet/TestBit/TestBit.tsx'
import { TestBitAnimation as BitSetTestBitSequence } from '../FundamentalDataStructures/SetUnion/BitSet/TestBit/TestBitAnimation.ts'
import BitSetClear from '../FundamentalDataStructures/SetUnion/BitSet/Clear/Clear.tsx'
import { ClearAnimation as BitSetClearSequence } from '../FundamentalDataStructures/SetUnion/BitSet/Clear/ClearAnimation.ts'
import SparseArraySet from '../AdvancedDataStructures/SparseArraysMatrices/SparseArray/Set/Set.tsx'
import { SetAnimation as SparseArraySetSequence } from '../AdvancedDataStructures/SparseArraysMatrices/SparseArray/Set/SetAnimation.ts'
import SparseArrayRead from '../AdvancedDataStructures/SparseArraysMatrices/SparseArray/Read/Read.tsx'
import { ReadAnimation as SparseArrayReadSequence } from '../AdvancedDataStructures/SparseArraysMatrices/SparseArray/Read/ReadAnimation.ts'
import SparseArrayDelete from '../AdvancedDataStructures/SparseArraysMatrices/SparseArray/Delete/Delete.tsx'
import { DeleteAnimation as SparseArrayDeleteSequence } from '../AdvancedDataStructures/SparseArraysMatrices/SparseArray/Delete/DeleteAnimation.ts'
import SparseArrayClear from '../AdvancedDataStructures/SparseArraysMatrices/SparseArray/Clear/Clear.tsx'
import { ClearAnimation as SparseArrayClearSequence } from '../AdvancedDataStructures/SparseArraysMatrices/SparseArray/Clear/ClearAnimation.ts'
import FreeListAllocate from '../AdvancedDataStructures/MemoryIO/FreeList/Allocate/Allocate.tsx'
import { AllocateAnimation as FreeListAllocateSequence } from '../AdvancedDataStructures/MemoryIO/FreeList/Allocate/AllocateAnimation.ts'
import FreeListRelease from '../AdvancedDataStructures/MemoryIO/FreeList/Release/Release.tsx'
import { ReleaseAnimation as FreeListReleaseSequence } from '../AdvancedDataStructures/MemoryIO/FreeList/Release/ReleaseAnimation.ts'
import FreeListClear from '../AdvancedDataStructures/MemoryIO/FreeList/Clear/Clear.tsx'
import { ClearAnimation as FreeListClearSequence } from '../AdvancedDataStructures/MemoryIO/FreeList/Clear/ClearAnimation.ts'

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
