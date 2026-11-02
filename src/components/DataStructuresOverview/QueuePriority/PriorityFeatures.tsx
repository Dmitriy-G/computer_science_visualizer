import type { ReactNode } from 'react'
import type { ActionKind } from '../../../visualization/ActionCatalog.ts'
import type { AlgorithmInformation } from '../../../visualization/AlgorithmInformation.ts'
import type { PriorityModel } from './PriorityModel.ts'
import type { StructuredLinearActionProps } from '../../ActionPlayback/StructuredLinearAction.tsx'
import PriorityQueueEnqueue from './PriorityQueue/Enqueue/Enqueue.tsx'
import { EnqueueAnimation as PriorityQueueEnqueueSequence } from './PriorityQueue/Enqueue/EnqueueAnimation.ts'
import PriorityQueueDequeue from './PriorityQueue/Dequeue/Dequeue.tsx'
import { DequeueAnimation as PriorityQueueDequeueSequence } from './PriorityQueue/Dequeue/DequeueAnimation.ts'
import PriorityQueuePeek from './PriorityQueue/Peek/Peek.tsx'
import { PeekAnimation as PriorityQueuePeekSequence } from './PriorityQueue/Peek/PeekAnimation.ts'
import PriorityQueueClear from './PriorityQueue/Clear/Clear.tsx'
import { ClearAnimation as PriorityQueueClearSequence } from './PriorityQueue/Clear/ClearAnimation.ts'
import BinaryMaxHeapInsert from './BinaryMaxHeap/Insert/Insert.tsx'
import { InsertAnimation as BinaryMaxHeapInsertSequence } from './BinaryMaxHeap/Insert/InsertAnimation.ts'
import BinaryMaxHeapExtractMax from './BinaryMaxHeap/ExtractMax/ExtractMax.tsx'
import { ExtractMaxAnimation as BinaryMaxHeapExtractMaxSequence } from './BinaryMaxHeap/ExtractMax/ExtractMaxAnimation.ts'
import BinaryMaxHeapPeek from './BinaryMaxHeap/Peek/Peek.tsx'
import { PeekAnimation as BinaryMaxHeapPeekSequence } from './BinaryMaxHeap/Peek/PeekAnimation.ts'
import BinaryMaxHeapClear from './BinaryMaxHeap/Clear/Clear.tsx'
import { ClearAnimation as BinaryMaxHeapClearSequence } from './BinaryMaxHeap/Clear/ClearAnimation.ts'
import BinomialHeapInsert from './BinomialHeap/Insert/Insert.tsx'
import { InsertAnimation as BinomialHeapInsertSequence } from './BinomialHeap/Insert/InsertAnimation.ts'
import BinomialHeapExtractMin from './BinomialHeap/ExtractMin/ExtractMin.tsx'
import { ExtractMinAnimation as BinomialHeapExtractMinSequence } from './BinomialHeap/ExtractMin/ExtractMinAnimation.ts'
import BinomialHeapPeek from './BinomialHeap/Peek/Peek.tsx'
import { PeekAnimation as BinomialHeapPeekSequence } from './BinomialHeap/Peek/PeekAnimation.ts'
import BinomialHeapMeld from './BinomialHeap/Meld/Meld.tsx'
import { MeldAnimation as BinomialHeapMeldSequence } from './BinomialHeap/Meld/MeldAnimation.ts'
import BinomialHeapClear from './BinomialHeap/Clear/Clear.tsx'
import { ClearAnimation as BinomialHeapClearSequence } from './BinomialHeap/Clear/ClearAnimation.ts'
import FibonacciHeapInsert from './FibonacciHeap/Insert/Insert.tsx'
import { InsertAnimation as FibonacciHeapInsertSequence } from './FibonacciHeap/Insert/InsertAnimation.ts'
import FibonacciHeapExtractMin from './FibonacciHeap/ExtractMin/ExtractMin.tsx'
import { ExtractMinAnimation as FibonacciHeapExtractMinSequence } from './FibonacciHeap/ExtractMin/ExtractMinAnimation.ts'
import FibonacciHeapDecreaseKey from './FibonacciHeap/DecreaseKey/DecreaseKey.tsx'
import { DecreaseKeyAnimation as FibonacciHeapDecreaseKeySequence } from './FibonacciHeap/DecreaseKey/DecreaseKeyAnimation.ts'
import FibonacciHeapPeek from './FibonacciHeap/Peek/Peek.tsx'
import { PeekAnimation as FibonacciHeapPeekSequence } from './FibonacciHeap/Peek/PeekAnimation.ts'
import FibonacciHeapMeld from './FibonacciHeap/Meld/Meld.tsx'
import { MeldAnimation as FibonacciHeapMeldSequence } from './FibonacciHeap/Meld/MeldAnimation.ts'
import FibonacciHeapClear from './FibonacciHeap/Clear/Clear.tsx'
import { ClearAnimation as FibonacciHeapClearSequence } from './FibonacciHeap/Clear/ClearAnimation.ts'
import PairingHeapInsert from './PairingHeap/Insert/Insert.tsx'
import { InsertAnimation as PairingHeapInsertSequence } from './PairingHeap/Insert/InsertAnimation.ts'
import PairingHeapExtractMin from './PairingHeap/ExtractMin/ExtractMin.tsx'
import { ExtractMinAnimation as PairingHeapExtractMinSequence } from './PairingHeap/ExtractMin/ExtractMinAnimation.ts'
import PairingHeapPeek from './PairingHeap/Peek/Peek.tsx'
import { PeekAnimation as PairingHeapPeekSequence } from './PairingHeap/Peek/PeekAnimation.ts'
import PairingHeapMeld from './PairingHeap/Meld/Meld.tsx'
import { MeldAnimation as PairingHeapMeldSequence } from './PairingHeap/Meld/MeldAnimation.ts'
import PairingHeapClear from './PairingHeap/Clear/Clear.tsx'
import { ClearAnimation as PairingHeapClearSequence } from './PairingHeap/Clear/ClearAnimation.ts'
import LeftistHeapInsert from './LeftistHeap/Insert/Insert.tsx'
import { InsertAnimation as LeftistHeapInsertSequence } from './LeftistHeap/Insert/InsertAnimation.ts'
import LeftistHeapExtractMin from './LeftistHeap/ExtractMin/ExtractMin.tsx'
import { ExtractMinAnimation as LeftistHeapExtractMinSequence } from './LeftistHeap/ExtractMin/ExtractMinAnimation.ts'
import LeftistHeapPeek from './LeftistHeap/Peek/Peek.tsx'
import { PeekAnimation as LeftistHeapPeekSequence } from './LeftistHeap/Peek/PeekAnimation.ts'
import LeftistHeapMeld from './LeftistHeap/Meld/Meld.tsx'
import { MeldAnimation as LeftistHeapMeldSequence } from './LeftistHeap/Meld/MeldAnimation.ts'
import LeftistHeapClear from './LeftistHeap/Clear/Clear.tsx'
import { ClearAnimation as LeftistHeapClearSequence } from './LeftistHeap/Clear/ClearAnimation.ts'
import SkewHeapInsert from './SkewHeap/Insert/Insert.tsx'
import { InsertAnimation as SkewHeapInsertSequence } from './SkewHeap/Insert/InsertAnimation.ts'
import SkewHeapExtractMin from './SkewHeap/ExtractMin/ExtractMin.tsx'
import { ExtractMinAnimation as SkewHeapExtractMinSequence } from './SkewHeap/ExtractMin/ExtractMinAnimation.ts'
import SkewHeapPeek from './SkewHeap/Peek/Peek.tsx'
import { PeekAnimation as SkewHeapPeekSequence } from './SkewHeap/Peek/PeekAnimation.ts'
import SkewHeapMeld from './SkewHeap/Meld/Meld.tsx'
import { MeldAnimation as SkewHeapMeldSequence } from './SkewHeap/Meld/MeldAnimation.ts'
import SkewHeapClear from './SkewHeap/Clear/Clear.tsx'
import { ClearAnimation as SkewHeapClearSequence } from './SkewHeap/Clear/ClearAnimation.ts'
import IndexedPriorityQueueInsert from './IndexedPriorityQueue/Insert/Insert.tsx'
import { InsertAnimation as IndexedPriorityQueueInsertSequence } from './IndexedPriorityQueue/Insert/InsertAnimation.ts'
import IndexedPriorityQueueChangePriority from './IndexedPriorityQueue/ChangePriority/ChangePriority.tsx'
import { ChangePriorityAnimation as IndexedPriorityQueueChangePrioritySequence } from './IndexedPriorityQueue/ChangePriority/ChangePriorityAnimation.ts'
import IndexedPriorityQueueDeleteByKey from './IndexedPriorityQueue/DeleteByKey/DeleteByKey.tsx'
import { DeleteByKeyAnimation as IndexedPriorityQueueDeleteByKeySequence } from './IndexedPriorityQueue/DeleteByKey/DeleteByKeyAnimation.ts'
import IndexedPriorityQueueExtractMin from './IndexedPriorityQueue/ExtractMin/ExtractMin.tsx'
import { ExtractMinAnimation as IndexedPriorityQueueExtractMinSequence } from './IndexedPriorityQueue/ExtractMin/ExtractMinAnimation.ts'
import IndexedPriorityQueuePeek from './IndexedPriorityQueue/Peek/Peek.tsx'
import { PeekAnimation as IndexedPriorityQueuePeekSequence } from './IndexedPriorityQueue/Peek/PeekAnimation.ts'
import IndexedPriorityQueueClear from './IndexedPriorityQueue/Clear/Clear.tsx'
import { ClearAnimation as IndexedPriorityQueueClearSequence } from './IndexedPriorityQueue/Clear/ClearAnimation.ts'
import MonotonicQueuePush from './MonotonicQueue/Push/Push.tsx'
import { PushAnimation as MonotonicQueuePushSequence } from './MonotonicQueue/Push/PushAnimation.ts'
import MonotonicQueuePeekMaximum from './MonotonicQueue/PeekMaximum/PeekMaximum.tsx'
import { PeekMaximumAnimation as MonotonicQueuePeekMaximumSequence } from './MonotonicQueue/PeekMaximum/PeekMaximumAnimation.ts'
import MonotonicQueueClear from './MonotonicQueue/Clear/Clear.tsx'
import { ClearAnimation as MonotonicQueueClearSequence } from './MonotonicQueue/Clear/ClearAnimation.ts'

export class PriorityFeatures {
  public static render(action: ActionKind, props: StructuredLinearActionProps, session: number): ReactNode {
    switch (props.model.kind) {
      case 'priority-queue':
        switch (action) {
          case 'enqueue': return <PriorityQueueEnqueue key={session} {...props} />
          case 'dequeue': return <PriorityQueueDequeue key={session} {...props} />
          case 'peek': return <PriorityQueuePeek key={session} {...props} />
          case 'clear': return <PriorityQueueClear key={session} {...props} />
        }
        break
      case 'binary-max-heap':
        switch (action) {
          case 'insert': return <BinaryMaxHeapInsert key={session} {...props} />
          case 'extract-max': return <BinaryMaxHeapExtractMax key={session} {...props} />
          case 'peek': return <BinaryMaxHeapPeek key={session} {...props} />
          case 'clear': return <BinaryMaxHeapClear key={session} {...props} />
        }
        break
      case 'binomial-heap':
        switch (action) {
          case 'insert': return <BinomialHeapInsert key={session} {...props} />
          case 'extract-min': return <BinomialHeapExtractMin key={session} {...props} />
          case 'peek': return <BinomialHeapPeek key={session} {...props} />
          case 'meld': return <BinomialHeapMeld key={session} {...props} />
          case 'clear': return <BinomialHeapClear key={session} {...props} />
        }
        break
      case 'fibonacci-heap':
        switch (action) {
          case 'insert': return <FibonacciHeapInsert key={session} {...props} />
          case 'extract-min': return <FibonacciHeapExtractMin key={session} {...props} />
          case 'decrease-key': return <FibonacciHeapDecreaseKey key={session} {...props} />
          case 'peek': return <FibonacciHeapPeek key={session} {...props} />
          case 'meld': return <FibonacciHeapMeld key={session} {...props} />
          case 'clear': return <FibonacciHeapClear key={session} {...props} />
        }
        break
      case 'pairing-heap':
        switch (action) {
          case 'insert': return <PairingHeapInsert key={session} {...props} />
          case 'extract-min': return <PairingHeapExtractMin key={session} {...props} />
          case 'peek': return <PairingHeapPeek key={session} {...props} />
          case 'meld': return <PairingHeapMeld key={session} {...props} />
          case 'clear': return <PairingHeapClear key={session} {...props} />
        }
        break
      case 'leftist-heap':
        switch (action) {
          case 'insert': return <LeftistHeapInsert key={session} {...props} />
          case 'extract-min': return <LeftistHeapExtractMin key={session} {...props} />
          case 'peek': return <LeftistHeapPeek key={session} {...props} />
          case 'meld': return <LeftistHeapMeld key={session} {...props} />
          case 'clear': return <LeftistHeapClear key={session} {...props} />
        }
        break
      case 'skew-heap':
        switch (action) {
          case 'insert': return <SkewHeapInsert key={session} {...props} />
          case 'extract-min': return <SkewHeapExtractMin key={session} {...props} />
          case 'peek': return <SkewHeapPeek key={session} {...props} />
          case 'meld': return <SkewHeapMeld key={session} {...props} />
          case 'clear': return <SkewHeapClear key={session} {...props} />
        }
        break
      case 'indexed-priority-queue':
        switch (action) {
          case 'insert': return <IndexedPriorityQueueInsert key={session} {...props} />
          case 'change-priority': return <IndexedPriorityQueueChangePriority key={session} {...props} />
          case 'delete-value': return <IndexedPriorityQueueDeleteByKey key={session} {...props} />
          case 'extract-min': return <IndexedPriorityQueueExtractMin key={session} {...props} />
          case 'peek': return <IndexedPriorityQueuePeek key={session} {...props} />
          case 'clear': return <IndexedPriorityQueueClear key={session} {...props} />
        }
        break
      case 'monotonic-queue':
        switch (action) {
          case 'enqueue': return <MonotonicQueuePush key={session} {...props} />
          case 'peek': return <MonotonicQueuePeekMaximum key={session} {...props} />
          case 'clear': return <MonotonicQueueClear key={session} {...props} />
        }
        break
    }
    return null
  }

  public static describe(action: ActionKind, model: PriorityModel): AlgorithmInformation | null {
    switch (model.kind) {
      case 'priority-queue':
        switch (action) {
          case 'enqueue': return PriorityQueueEnqueueSequence.describe(model.length)
          case 'dequeue': return PriorityQueueDequeueSequence.describe(model.length)
          case 'peek': return PriorityQueuePeekSequence.describe(model.length)
          case 'clear': return PriorityQueueClearSequence.describe(model.length)
        }
        break
      case 'binary-max-heap':
        switch (action) {
          case 'insert': return BinaryMaxHeapInsertSequence.describe(model.length)
          case 'extract-max': return BinaryMaxHeapExtractMaxSequence.describe(model.length)
          case 'peek': return BinaryMaxHeapPeekSequence.describe(model.length)
          case 'clear': return BinaryMaxHeapClearSequence.describe(model.length)
        }
        break
      case 'binomial-heap':
        switch (action) {
          case 'insert': return BinomialHeapInsertSequence.describe(model.length)
          case 'extract-min': return BinomialHeapExtractMinSequence.describe(model.length)
          case 'peek': return BinomialHeapPeekSequence.describe(model.length)
          case 'meld': return BinomialHeapMeldSequence.describe(model.length)
          case 'clear': return BinomialHeapClearSequence.describe(model.length)
        }
        break
      case 'fibonacci-heap':
        switch (action) {
          case 'insert': return FibonacciHeapInsertSequence.describe(model.length)
          case 'extract-min': return FibonacciHeapExtractMinSequence.describe(model.length)
          case 'decrease-key': return FibonacciHeapDecreaseKeySequence.describe(model.length)
          case 'peek': return FibonacciHeapPeekSequence.describe(model.length)
          case 'meld': return FibonacciHeapMeldSequence.describe(model.length)
          case 'clear': return FibonacciHeapClearSequence.describe(model.length)
        }
        break
      case 'pairing-heap':
        switch (action) {
          case 'insert': return PairingHeapInsertSequence.describe(model.length)
          case 'extract-min': return PairingHeapExtractMinSequence.describe(model.length)
          case 'peek': return PairingHeapPeekSequence.describe(model.length)
          case 'meld': return PairingHeapMeldSequence.describe(model.length)
          case 'clear': return PairingHeapClearSequence.describe(model.length)
        }
        break
      case 'leftist-heap':
        switch (action) {
          case 'insert': return LeftistHeapInsertSequence.describe(model.length)
          case 'extract-min': return LeftistHeapExtractMinSequence.describe(model.length)
          case 'peek': return LeftistHeapPeekSequence.describe(model.length)
          case 'meld': return LeftistHeapMeldSequence.describe(model.length)
          case 'clear': return LeftistHeapClearSequence.describe(model.length)
        }
        break
      case 'skew-heap':
        switch (action) {
          case 'insert': return SkewHeapInsertSequence.describe(model.length)
          case 'extract-min': return SkewHeapExtractMinSequence.describe(model.length)
          case 'peek': return SkewHeapPeekSequence.describe(model.length)
          case 'meld': return SkewHeapMeldSequence.describe(model.length)
          case 'clear': return SkewHeapClearSequence.describe(model.length)
        }
        break
      case 'indexed-priority-queue':
        switch (action) {
          case 'insert': return IndexedPriorityQueueInsertSequence.describe(model.length)
          case 'change-priority': return IndexedPriorityQueueChangePrioritySequence.describe(model.length)
          case 'delete-value': return IndexedPriorityQueueDeleteByKeySequence.describe(model.length)
          case 'extract-min': return IndexedPriorityQueueExtractMinSequence.describe(model.length)
          case 'peek': return IndexedPriorityQueuePeekSequence.describe(model.length)
          case 'clear': return IndexedPriorityQueueClearSequence.describe(model.length)
        }
        break
      case 'monotonic-queue':
        switch (action) {
          case 'enqueue': return MonotonicQueuePushSequence.describe(model.length)
          case 'peek': return MonotonicQueuePeekMaximumSequence.describe(model.length)
          case 'clear': return MonotonicQueueClearSequence.describe(model.length)
        }
        break
    }
    return null
  }
}
