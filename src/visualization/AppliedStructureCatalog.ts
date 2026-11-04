import { BRIN } from '../components/AdvancedDataStructures/StorageIndexes/BRIN/BRIN.ts'
import { BRINLayout } from '../components/AdvancedDataStructures/StorageIndexes/BRIN/BRINLayout.ts'
import { SSTable } from '../components/AdvancedDataStructures/StorageIndexes/SSTable/SSTable.ts'
import { SSTableLayout } from '../components/AdvancedDataStructures/StorageIndexes/SSTable/SSTableLayout.ts'
import { SparsePrimaryIndex } from '../components/AdvancedDataStructures/StorageIndexes/SparsePrimaryIndex/SparsePrimaryIndex.ts'
import { SparsePrimaryIndexLayout } from '../components/AdvancedDataStructures/StorageIndexes/SparsePrimaryIndex/SparsePrimaryIndexLayout.ts'
import { SparseOffsetIndex } from '../components/AdvancedDataStructures/StorageIndexes/SparseOffsetIndex/SparseOffsetIndex.ts'
import { SparseOffsetIndexLayout } from '../components/AdvancedDataStructures/StorageIndexes/SparseOffsetIndex/SparseOffsetIndexLayout.ts'
import { TimeIndex } from '../components/AdvancedDataStructures/StorageIndexes/TimeIndex/TimeIndex.ts'
import { TimeIndexLayout } from '../components/AdvancedDataStructures/StorageIndexes/TimeIndex/TimeIndexLayout.ts'
import { IVFIndex } from '../components/AdvancedDataStructures/SpatialIndexes/IVFIndex/IVFIndex.ts'
import { IVFIndexLayout } from '../components/AdvancedDataStructures/SpatialIndexes/IVFIndex/IVFIndexLayout.ts'
import { ContentAddressedLayers } from '../components/AdvancedDataStructures/Integrity/ContentAddressedLayers/ContentAddressedLayers.ts'
import { ContentAddressedLayersLayout } from '../components/AdvancedDataStructures/Integrity/ContentAddressedLayers/ContentAddressedLayersLayout.ts'
import type { StructureKind, Scene } from './Scene.ts'
import type { LinearFrame } from './LinearModel.ts'
import { AppliedModel } from './AppliedModel.ts'
import { AppliedStructureDefinitions } from './AppliedStructureDefinitions.ts'
import { AppendOnlyLog } from '../components/AdvancedDataStructures/StorageIndexes/AppendOnlyLog/AppendOnlyLog.ts'
import { AppendOnlyLogLayout } from '../components/AdvancedDataStructures/StorageIndexes/AppendOnlyLog/AppendOnlyLogLayout.ts'
import { XArray } from '../components/AdvancedDataStructures/MemoryIO/XArray/XArray.ts'
import { XArrayLayout } from '../components/AdvancedDataStructures/MemoryIO/XArray/XArrayLayout.ts'
import { FanoutArray } from '../components/AdvancedDataStructures/StorageIndexes/FanoutArray/FanoutArray.ts'
import { FanoutArrayLayout } from '../components/AdvancedDataStructures/StorageIndexes/FanoutArray/FanoutArrayLayout.ts'
import { FlatVectorArray } from '../components/AdvancedDataStructures/SpatialIndexes/FlatVectorArray/FlatVectorArray.ts'
import { FlatVectorArrayLayout } from '../components/AdvancedDataStructures/SpatialIndexes/FlatVectorArray/FlatVectorArrayLayout.ts'
import { RequestTagArray } from '../components/AdvancedDataStructures/MemoryIO/RequestTagArray/RequestTagArray.ts'
import { RequestTagArrayLayout } from '../components/AdvancedDataStructures/MemoryIO/RequestTagArray/RequestTagArrayLayout.ts'
import { MultiQueue } from '../components/AdvancedDataStructures/MemoryIO/MultiQueue/MultiQueue.ts'
import { MultiQueueLayout } from '../components/AdvancedDataStructures/MemoryIO/MultiQueue/MultiQueueLayout.ts'
import { LockFreeRing } from '../components/AdvancedDataStructures/MemoryIO/LockFreeRing/LockFreeRing.ts'
import { LockFreeRingLayout } from '../components/AdvancedDataStructures/MemoryIO/LockFreeRing/LockFreeRingLayout.ts'
import { GiST } from '../components/AdvancedDataStructures/StorageIndexes/GiST/GiST.ts'
import { GiSTLayout } from '../components/AdvancedDataStructures/StorageIndexes/GiST/GiSTLayout.ts'
import { BKDTree } from '../components/AdvancedDataStructures/SpatialIndexes/BKDTree/BKDTree.ts'
import { BKDTreeLayout } from '../components/AdvancedDataStructures/SpatialIndexes/BKDTree/BKDTreeLayout.ts'
import { BallTree } from '../components/AdvancedDataStructures/SpatialIndexes/BallTree/BallTree.ts'
import { BallTreeLayout } from '../components/AdvancedDataStructures/SpatialIndexes/BallTree/BallTreeLayout.ts'
import { MapleTree } from '../components/AdvancedDataStructures/MemoryIO/MapleTree/MapleTree.ts'
import { MapleTreeLayout } from '../components/AdvancedDataStructures/MemoryIO/MapleTree/MapleTreeLayout.ts'
import { ChecksummedBlockTree } from '../components/AdvancedDataStructures/Integrity/ChecksummedBlockTree/ChecksummedBlockTree.ts'
import { ChecksummedBlockTreeLayout } from '../components/AdvancedDataStructures/Integrity/ChecksummedBlockTree/ChecksummedBlockTreeLayout.ts'
import { InvertedIndex } from '../components/AdvancedDataStructures/TextSearch/InvertedIndex/InvertedIndex.ts'
import { InvertedIndexLayout } from '../components/AdvancedDataStructures/TextSearch/InvertedIndex/InvertedIndexLayout.ts'
import { LSHIndex } from '../components/AdvancedDataStructures/SpatialIndexes/LSHIndex/LSHIndex.ts'
import { LSHIndexLayout } from '../components/AdvancedDataStructures/SpatialIndexes/LSHIndex/LSHIndexLayout.ts'
import { MinimizerIndex } from '../components/AdvancedDataStructures/SpecializedGraphs/MinimizerIndex/MinimizerIndex.ts'
import { MinimizerIndexLayout } from '../components/AdvancedDataStructures/SpecializedGraphs/MinimizerIndex/MinimizerIndexLayout.ts'
import { BlockedBloomFilter } from '../components/AdvancedDataStructures/Probabilistic/BlockedBloomFilter/BlockedBloomFilter.ts'
import { BlockedBloomFilterLayout } from '../components/AdvancedDataStructures/Probabilistic/BlockedBloomFilter/BlockedBloomFilterLayout.ts'
import { HNSWGraph } from '../components/AdvancedDataStructures/SpatialIndexes/HNSWGraph/HNSWGraph.ts'
import { HNSWGraphLayout } from '../components/AdvancedDataStructures/SpatialIndexes/HNSWGraph/HNSWGraphLayout.ts'
import { CompactedDeBruijnGraph } from '../components/AdvancedDataStructures/SpecializedGraphs/CompactedDeBruijnGraph/CompactedDeBruijnGraph.ts'
import { CompactedDeBruijnGraphLayout } from '../components/AdvancedDataStructures/SpecializedGraphs/CompactedDeBruijnGraph/CompactedDeBruijnGraphLayout.ts'
import { AddressSpaceGraph } from '../components/AdvancedDataStructures/SpecializedGraphs/AddressSpaceGraph/AddressSpaceGraph.ts'
import { AddressSpaceGraphLayout } from '../components/AdvancedDataStructures/SpecializedGraphs/AddressSpaceGraph/AddressSpaceGraphLayout.ts'

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
      case 'brin': return BRIN.createDefault()
      case 'sstable': return SSTable.createDefault()
      case 'sparse-primary-index': return SparsePrimaryIndex.createDefault()
      case 'sparse-offset-index': return SparseOffsetIndex.createDefault()
      case 'time-index': return TimeIndex.createDefault()
      case 'ivf-index': return IVFIndex.createDefault()
      case 'content-addressed-layers': return ContentAddressedLayers.createDefault()

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
      case 'brin': return new BRINLayout().create(model, frame)
      case 'sstable': return new SSTableLayout().create(model, frame)
      case 'sparse-primary-index': return new SparsePrimaryIndexLayout().create(model, frame)
      case 'sparse-offset-index': return new SparseOffsetIndexLayout().create(model, frame)
      case 'time-index': return new TimeIndexLayout().create(model, frame)
      case 'ivf-index': return new IVFIndexLayout().create(model, frame)
      case 'content-addressed-layers': return new ContentAddressedLayersLayout().create(model, frame)

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
