import type { StructureKind, Scene } from './Scene.ts'
import type { PriorityModel } from '../components/DataStructuresOverview/QueuePriority/PriorityModel.ts'
import { PriorityQueue } from '../components/DataStructuresOverview/QueuePriority/PriorityQueue/PriorityQueue.ts'
import { PriorityQueueLayout } from '../components/DataStructuresOverview/QueuePriority/PriorityQueue/PriorityQueueLayout.ts'
import { BinaryMaxHeap } from '../components/DataStructuresOverview/QueuePriority/BinaryMaxHeap/BinaryMaxHeap.ts'
import { BinaryMaxHeapLayout } from '../components/DataStructuresOverview/QueuePriority/BinaryMaxHeap/BinaryMaxHeapLayout.ts'
import { BinomialHeap } from '../components/DataStructuresOverview/QueuePriority/BinomialHeap/BinomialHeap.ts'
import { BinomialHeapLayout } from '../components/DataStructuresOverview/QueuePriority/BinomialHeap/BinomialHeapLayout.ts'
import { FibonacciHeap } from '../components/DataStructuresOverview/QueuePriority/FibonacciHeap/FibonacciHeap.ts'
import { FibonacciHeapLayout } from '../components/DataStructuresOverview/QueuePriority/FibonacciHeap/FibonacciHeapLayout.ts'
import { PairingHeap } from '../components/DataStructuresOverview/QueuePriority/PairingHeap/PairingHeap.ts'
import { PairingHeapLayout } from '../components/DataStructuresOverview/QueuePriority/PairingHeap/PairingHeapLayout.ts'
import { LeftistHeap } from '../components/DataStructuresOverview/QueuePriority/LeftistHeap/LeftistHeap.ts'
import { LeftistHeapLayout } from '../components/DataStructuresOverview/QueuePriority/LeftistHeap/LeftistHeapLayout.ts'
import { SkewHeap } from '../components/DataStructuresOverview/QueuePriority/SkewHeap/SkewHeap.ts'
import { SkewHeapLayout } from '../components/DataStructuresOverview/QueuePriority/SkewHeap/SkewHeapLayout.ts'
import { IndexedPriorityQueue } from '../components/DataStructuresOverview/QueuePriority/IndexedPriorityQueue/IndexedPriorityQueue.ts'
import { IndexedPriorityQueueLayout } from '../components/DataStructuresOverview/QueuePriority/IndexedPriorityQueue/IndexedPriorityQueueLayout.ts'
import { MonotonicQueue } from '../components/DataStructuresOverview/QueuePriority/MonotonicQueue/MonotonicQueue.ts'
import { MonotonicQueueLayout } from '../components/DataStructuresOverview/QueuePriority/MonotonicQueue/MonotonicQueueLayout.ts'

export class PriorityStructureCatalog {
  public static createModels(): Map<StructureKind, PriorityModel> {
    return new Map<StructureKind, PriorityModel>([
      ['priority-queue', PriorityQueue.createDefault()],
      ['binary-max-heap', BinaryMaxHeap.createDefault()],
      ['binomial-heap', BinomialHeap.createDefault()],
      ['fibonacci-heap', FibonacciHeap.createDefault()],
      ['pairing-heap', PairingHeap.createDefault()],
      ['leftist-heap', LeftistHeap.createDefault()],
      ['skew-heap', SkewHeap.createDefault()],
      ['indexed-priority-queue', IndexedPriorityQueue.createDefault()],
      ['monotonic-queue', MonotonicQueue.createDefault()],
    ])
  }

  public static createDefault(kind: StructureKind): PriorityModel | null {
    switch (kind) {
      case 'priority-queue': return PriorityQueue.createDefault()
      case 'binary-max-heap': return BinaryMaxHeap.createDefault()
      case 'binomial-heap': return BinomialHeap.createDefault()
      case 'fibonacci-heap': return FibonacciHeap.createDefault()
      case 'pairing-heap': return PairingHeap.createDefault()
      case 'leftist-heap': return LeftistHeap.createDefault()
      case 'skew-heap': return SkewHeap.createDefault()
      case 'indexed-priority-queue': return IndexedPriorityQueue.createDefault()
      case 'monotonic-queue': return MonotonicQueue.createDefault()
      default: return null
    }
  }

  public static createScene(model: PriorityModel): Scene {
    switch (model.kind) {
      case 'priority-queue': return new PriorityQueueLayout().create(model)
      case 'binary-max-heap': return new BinaryMaxHeapLayout().create(model)
      case 'binomial-heap': return new BinomialHeapLayout().create(model)
      case 'fibonacci-heap': return new FibonacciHeapLayout().create(model)
      case 'pairing-heap': return new PairingHeapLayout().create(model)
      case 'leftist-heap': return new LeftistHeapLayout().create(model)
      case 'skew-heap': return new SkewHeapLayout().create(model)
      case 'indexed-priority-queue': return new IndexedPriorityQueueLayout().create(model)
      case 'monotonic-queue': return new MonotonicQueueLayout().create(model)
      default: throw new RangeError('Unknown priority structure')
    }
  }
}
