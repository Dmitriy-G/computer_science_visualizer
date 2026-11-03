import type { StructureKind, Scene } from './Scene.ts'
import type { LinearFrame } from './LinearModel.ts'
import { AppliedModel } from './AppliedModel.ts'
import { AppliedStructureDefinitions } from './AppliedStructureDefinitions.ts'
import { AppendOnlyLog } from '../components/DataStructuresOverview/Linear/AppendOnlyLog/AppendOnlyLog.ts'
import { AppendOnlyLogLayout } from '../components/DataStructuresOverview/Linear/AppendOnlyLog/AppendOnlyLogLayout.ts'
import { XArray } from '../components/DataStructuresOverview/Linear/XArray/XArray.ts'
import { XArrayLayout } from '../components/DataStructuresOverview/Linear/XArray/XArrayLayout.ts'
import { FanoutArray } from '../components/DataStructuresOverview/Linear/FanoutArray/FanoutArray.ts'
import { FanoutArrayLayout } from '../components/DataStructuresOverview/Linear/FanoutArray/FanoutArrayLayout.ts'
import { FlatVectorArray } from '../components/DataStructuresOverview/Linear/FlatVectorArray/FlatVectorArray.ts'
import { FlatVectorArrayLayout } from '../components/DataStructuresOverview/Linear/FlatVectorArray/FlatVectorArrayLayout.ts'
import { RequestTagArray } from '../components/DataStructuresOverview/Linear/RequestTagArray/RequestTagArray.ts'
import { RequestTagArrayLayout } from '../components/DataStructuresOverview/Linear/RequestTagArray/RequestTagArrayLayout.ts'
import { MultiQueue } from '../components/DataStructuresOverview/QueuePriority/MultiQueue/MultiQueue.ts'
import { MultiQueueLayout } from '../components/DataStructuresOverview/QueuePriority/MultiQueue/MultiQueueLayout.ts'
import { LockFreeRing } from '../components/DataStructuresOverview/QueuePriority/LockFreeRing/LockFreeRing.ts'
import { LockFreeRingLayout } from '../components/DataStructuresOverview/QueuePriority/LockFreeRing/LockFreeRingLayout.ts'
import { GiST } from '../components/DataStructuresOverview/Trees/GiST/GiST.ts'
import { GiSTLayout } from '../components/DataStructuresOverview/Trees/GiST/GiSTLayout.ts'
import { BKDTree } from '../components/DataStructuresOverview/Trees/BKDTree/BKDTree.ts'
import { BKDTreeLayout } from '../components/DataStructuresOverview/Trees/BKDTree/BKDTreeLayout.ts'
import { BallTree } from '../components/DataStructuresOverview/Trees/BallTree/BallTree.ts'
import { BallTreeLayout } from '../components/DataStructuresOverview/Trees/BallTree/BallTreeLayout.ts'
import { MapleTree } from '../components/DataStructuresOverview/Trees/MapleTree/MapleTree.ts'
import { MapleTreeLayout } from '../components/DataStructuresOverview/Trees/MapleTree/MapleTreeLayout.ts'
import { ChecksummedBlockTree } from '../components/DataStructuresOverview/Trees/ChecksummedBlockTree/ChecksummedBlockTree.ts'
import { ChecksummedBlockTreeLayout } from '../components/DataStructuresOverview/Trees/ChecksummedBlockTree/ChecksummedBlockTreeLayout.ts'
import { InvertedIndex } from '../components/DataStructuresOverview/StringText/InvertedIndex/InvertedIndex.ts'
import { InvertedIndexLayout } from '../components/DataStructuresOverview/StringText/InvertedIndex/InvertedIndexLayout.ts'
import { LSHIndex } from '../components/DataStructuresOverview/HashBased/LSHIndex/LSHIndex.ts'
import { LSHIndexLayout } from '../components/DataStructuresOverview/HashBased/LSHIndex/LSHIndexLayout.ts'
import { MinimizerIndex } from '../components/DataStructuresOverview/HashBased/MinimizerIndex/MinimizerIndex.ts'
import { MinimizerIndexLayout } from '../components/DataStructuresOverview/HashBased/MinimizerIndex/MinimizerIndexLayout.ts'
import { BlockedBloomFilter } from '../components/DataStructuresOverview/Probabilistic/BlockedBloomFilter/BlockedBloomFilter.ts'
import { BlockedBloomFilterLayout } from '../components/DataStructuresOverview/Probabilistic/BlockedBloomFilter/BlockedBloomFilterLayout.ts'
import { HNSWGraph } from '../components/DataStructuresOverview/Graphs/HNSWGraph/HNSWGraph.ts'
import { HNSWGraphLayout } from '../components/DataStructuresOverview/Graphs/HNSWGraph/HNSWGraphLayout.ts'
import { CompactedDeBruijnGraph } from '../components/DataStructuresOverview/Graphs/CompactedDeBruijnGraph/CompactedDeBruijnGraph.ts'
import { CompactedDeBruijnGraphLayout } from '../components/DataStructuresOverview/Graphs/CompactedDeBruijnGraph/CompactedDeBruijnGraphLayout.ts'
import { AddressSpaceGraph } from '../components/DataStructuresOverview/Graphs/AddressSpaceGraph/AddressSpaceGraph.ts'
import { AddressSpaceGraphLayout } from '../components/DataStructuresOverview/Graphs/AddressSpaceGraph/AddressSpaceGraphLayout.ts'

export class AppliedStructureCatalog {
  public static supports(kind: StructureKind): boolean {
    for (const definition of AppliedStructureDefinitions.structures) if (definition.kind === kind) return true
    return false
  }

  public static createModels(): Map<StructureKind, AppliedModel> {
    const models = new Map<StructureKind, AppliedModel>()
    for (const definition of AppliedStructureDefinitions.structures) models.set(definition.kind, this.createDefault(definition.kind)!)
    return models
  }

  public static createDefault(kind: StructureKind): AppliedModel | null {
    switch (kind) {
      case 'append-only-log': return AppendOnlyLog.createDefault()
      case 'xarray': return XArray.createDefault()
      case 'fanout-array': return FanoutArray.createDefault()
      case 'flat-vector-array': return FlatVectorArray.createDefault()
      case 'request-tag-array': return RequestTagArray.createDefault()
      case 'multi-queue': return MultiQueue.createDefault()
      case 'lock-free-ring': return LockFreeRing.createDefault()
      case 'gist': return GiST.createDefault()
      case 'bkd-tree': return BKDTree.createDefault()
      case 'ball-tree': return BallTree.createDefault()
      case 'maple-tree': return MapleTree.createDefault()
      case 'checksummed-block-tree': return ChecksummedBlockTree.createDefault()
      case 'inverted-index': return InvertedIndex.createDefault()
      case 'lsh-index': return LSHIndex.createDefault()
      case 'minimizer-index': return MinimizerIndex.createDefault()
      case 'blocked-bloom-filter': return BlockedBloomFilter.createDefault()
      case 'hnsw-graph': return HNSWGraph.createDefault()
      case 'compacted-de-bruijn-graph': return CompactedDeBruijnGraph.createDefault()
      case 'address-space-graph': return AddressSpaceGraph.createDefault()
      default: return null
    }
  }

  public static createScene(model: AppliedModel, frame: LinearFrame = {}): Scene {
    switch (model.kind) {
      case 'append-only-log': return new AppendOnlyLogLayout().create(model, frame)
      case 'xarray': return new XArrayLayout().create(model, frame)
      case 'fanout-array': return new FanoutArrayLayout().create(model, frame)
      case 'flat-vector-array': return new FlatVectorArrayLayout().create(model, frame)
      case 'request-tag-array': return new RequestTagArrayLayout().create(model, frame)
      case 'multi-queue': return new MultiQueueLayout().create(model, frame)
      case 'lock-free-ring': return new LockFreeRingLayout().create(model, frame)
      case 'gist': return new GiSTLayout().create(model, frame)
      case 'bkd-tree': return new BKDTreeLayout().create(model, frame)
      case 'ball-tree': return new BallTreeLayout().create(model, frame)
      case 'maple-tree': return new MapleTreeLayout().create(model, frame)
      case 'checksummed-block-tree': return new ChecksummedBlockTreeLayout().create(model, frame)
      case 'inverted-index': return new InvertedIndexLayout().create(model, frame)
      case 'lsh-index': return new LSHIndexLayout().create(model, frame)
      case 'minimizer-index': return new MinimizerIndexLayout().create(model, frame)
      case 'blocked-bloom-filter': return new BlockedBloomFilterLayout().create(model, frame)
      case 'hnsw-graph': return new HNSWGraphLayout().create(model, frame)
      case 'compacted-de-bruijn-graph': return new CompactedDeBruijnGraphLayout().create(model, frame)
      case 'address-space-graph': return new AddressSpaceGraphLayout().create(model, frame)
      default: throw new RangeError('Unknown applied structure')
    }
  }
}
