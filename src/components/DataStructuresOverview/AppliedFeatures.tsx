import BRINAppend from './Trees/BRIN/Append/Append.tsx'
import { AppendAnimation as BRINAppendSequence } from './Trees/BRIN/Append/AppendAnimation.ts'
import BRINSearchRange from './Trees/BRIN/SearchRange/SearchRange.tsx'
import { SearchRangeAnimation as BRINSearchRangeSequence } from './Trees/BRIN/SearchRange/SearchRangeAnimation.ts'
import BRINInspectStorage from './Trees/BRIN/InspectStorage/InspectStorage.tsx'
import { InspectStorageAnimation as BRINInspectStorageSequence } from './Trees/BRIN/InspectStorage/InspectStorageAnimation.ts'
import BRINClear from './Trees/BRIN/Clear/Clear.tsx'
import { ClearAnimation as BRINClearSequence } from './Trees/BRIN/Clear/ClearAnimation.ts'
import SSTableBuild from './Trees/SSTable/Build/Build.tsx'
import { BuildAnimation as SSTableBuildSequence } from './Trees/SSTable/Build/BuildAnimation.ts'
import SSTableSearchByKey from './Trees/SSTable/SearchByKey/SearchByKey.tsx'
import { SearchByKeyAnimation as SSTableSearchByKeySequence } from './Trees/SSTable/SearchByKey/SearchByKeyAnimation.ts'
import SSTableInspectStorage from './Trees/SSTable/InspectStorage/InspectStorage.tsx'
import { InspectStorageAnimation as SSTableInspectStorageSequence } from './Trees/SSTable/InspectStorage/InspectStorageAnimation.ts'
import SSTableClear from './Trees/SSTable/Clear/Clear.tsx'
import { ClearAnimation as SSTableClearSequence } from './Trees/SSTable/Clear/ClearAnimation.ts'
import SparsePrimaryIndexBuild from './Trees/SparsePrimaryIndex/Build/Build.tsx'
import { BuildAnimation as SparsePrimaryIndexBuildSequence } from './Trees/SparsePrimaryIndex/Build/BuildAnimation.ts'
import SparsePrimaryIndexSearchByKey from './Trees/SparsePrimaryIndex/SearchByKey/SearchByKey.tsx'
import { SearchByKeyAnimation as SparsePrimaryIndexSearchByKeySequence } from './Trees/SparsePrimaryIndex/SearchByKey/SearchByKeyAnimation.ts'
import SparsePrimaryIndexInspectStorage from './Trees/SparsePrimaryIndex/InspectStorage/InspectStorage.tsx'
import { InspectStorageAnimation as SparsePrimaryIndexInspectStorageSequence } from './Trees/SparsePrimaryIndex/InspectStorage/InspectStorageAnimation.ts'
import SparsePrimaryIndexClear from './Trees/SparsePrimaryIndex/Clear/Clear.tsx'
import { ClearAnimation as SparsePrimaryIndexClearSequence } from './Trees/SparsePrimaryIndex/Clear/ClearAnimation.ts'
import SparseOffsetIndexAppend from './Trees/SparseOffsetIndex/Append/Append.tsx'
import { AppendAnimation as SparseOffsetIndexAppendSequence } from './Trees/SparseOffsetIndex/Append/AppendAnimation.ts'
import SparseOffsetIndexReadOffset from './Trees/SparseOffsetIndex/ReadOffset/ReadOffset.tsx'
import { ReadOffsetAnimation as SparseOffsetIndexReadOffsetSequence } from './Trees/SparseOffsetIndex/ReadOffset/ReadOffsetAnimation.ts'
import SparseOffsetIndexInspectStorage from './Trees/SparseOffsetIndex/InspectStorage/InspectStorage.tsx'
import { InspectStorageAnimation as SparseOffsetIndexInspectStorageSequence } from './Trees/SparseOffsetIndex/InspectStorage/InspectStorageAnimation.ts'
import SparseOffsetIndexClear from './Trees/SparseOffsetIndex/Clear/Clear.tsx'
import { ClearAnimation as SparseOffsetIndexClearSequence } from './Trees/SparseOffsetIndex/Clear/ClearAnimation.ts'
import TimeIndexAppend from './Trees/TimeIndex/Append/Append.tsx'
import { AppendAnimation as TimeIndexAppendSequence } from './Trees/TimeIndex/Append/AppendAnimation.ts'
import TimeIndexSearchTimestamp from './Trees/TimeIndex/SearchTimestamp/SearchTimestamp.tsx'
import { SearchTimestampAnimation as TimeIndexSearchTimestampSequence } from './Trees/TimeIndex/SearchTimestamp/SearchTimestampAnimation.ts'
import TimeIndexInspectStorage from './Trees/TimeIndex/InspectStorage/InspectStorage.tsx'
import { InspectStorageAnimation as TimeIndexInspectStorageSequence } from './Trees/TimeIndex/InspectStorage/InspectStorageAnimation.ts'
import TimeIndexClear from './Trees/TimeIndex/Clear/Clear.tsx'
import { ClearAnimation as TimeIndexClearSequence } from './Trees/TimeIndex/Clear/ClearAnimation.ts'
import IVFIndexBuild from './Trees/IVFIndex/Build/Build.tsx'
import { BuildAnimation as IVFIndexBuildSequence } from './Trees/IVFIndex/Build/BuildAnimation.ts'
import IVFIndexNearestNeighbor from './Trees/IVFIndex/NearestNeighbor/NearestNeighbor.tsx'
import { NearestNeighborAnimation as IVFIndexNearestNeighborSequence } from './Trees/IVFIndex/NearestNeighbor/NearestNeighborAnimation.ts'
import IVFIndexInspectStorage from './Trees/IVFIndex/InspectStorage/InspectStorage.tsx'
import { InspectStorageAnimation as IVFIndexInspectStorageSequence } from './Trees/IVFIndex/InspectStorage/InspectStorageAnimation.ts'
import IVFIndexClear from './Trees/IVFIndex/Clear/Clear.tsx'
import { ClearAnimation as IVFIndexClearSequence } from './Trees/IVFIndex/Clear/ClearAnimation.ts'
import ContentAddressedLayersAddLayer from './HashBased/ContentAddressedLayers/AddLayer/AddLayer.tsx'
import { AddLayerAnimation as ContentAddressedLayersAddLayerSequence } from './HashBased/ContentAddressedLayers/AddLayer/AddLayerAnimation.ts'
import ContentAddressedLayersLookupContent from './HashBased/ContentAddressedLayers/LookupContent/LookupContent.tsx'
import { LookupContentAnimation as ContentAddressedLayersLookupContentSequence } from './HashBased/ContentAddressedLayers/LookupContent/LookupContentAnimation.ts'
import ContentAddressedLayersReadChain from './HashBased/ContentAddressedLayers/ReadChain/ReadChain.tsx'
import { ReadChainAnimation as ContentAddressedLayersReadChainSequence } from './HashBased/ContentAddressedLayers/ReadChain/ReadChainAnimation.ts'
import ContentAddressedLayersVerify from './HashBased/ContentAddressedLayers/Verify/Verify.tsx'
import { VerifyAnimation as ContentAddressedLayersVerifySequence } from './HashBased/ContentAddressedLayers/Verify/VerifyAnimation.ts'
import ContentAddressedLayersInspectStorage from './HashBased/ContentAddressedLayers/InspectStorage/InspectStorage.tsx'
import { InspectStorageAnimation as ContentAddressedLayersInspectStorageSequence } from './HashBased/ContentAddressedLayers/InspectStorage/InspectStorageAnimation.ts'
import ContentAddressedLayersClear from './HashBased/ContentAddressedLayers/Clear/Clear.tsx'
import { ClearAnimation as ContentAddressedLayersClearSequence } from './HashBased/ContentAddressedLayers/Clear/ClearAnimation.ts'
import type { ReactNode } from 'react'
import type { ActionKind } from '../../visualization/ActionCatalog.ts'
import type { AlgorithmInformation } from '../../visualization/AlgorithmInformation.ts'
import { AppliedGraphModel } from '../../visualization/AppliedGraphModel.ts'
import type { LinearModel } from '../../visualization/LinearModel.ts'
import type { StructuredLinearActionProps } from '../ActionPlayback/StructuredLinearAction.tsx'
import AppendOnlyLogAppend from './Linear/AppendOnlyLog/Append/Append.tsx'
import { AppendAnimation as AppendOnlyLogAppendSequence } from './Linear/AppendOnlyLog/Append/AppendAnimation.ts'
import AppendOnlyLogReadOffset from './Linear/AppendOnlyLog/ReadOffset/ReadOffset.tsx'
import { ReadOffsetAnimation as AppendOnlyLogReadOffsetSequence } from './Linear/AppendOnlyLog/ReadOffset/ReadOffsetAnimation.ts'
import AppendOnlyLogInspectStorage from './Linear/AppendOnlyLog/InspectStorage/InspectStorage.tsx'
import { InspectStorageAnimation as AppendOnlyLogInspectStorageSequence } from './Linear/AppendOnlyLog/InspectStorage/InspectStorageAnimation.ts'
import AppendOnlyLogClear from './Linear/AppendOnlyLog/Clear/Clear.tsx'
import { ClearAnimation as AppendOnlyLogClearSequence } from './Linear/AppendOnlyLog/Clear/ClearAnimation.ts'
import XArrayStore from './Linear/XArray/Store/Store.tsx'
import { StoreAnimation as XArrayStoreSequence } from './Linear/XArray/Store/StoreAnimation.ts'
import XArrayRead from './Linear/XArray/Read/Read.tsx'
import { ReadAnimation as XArrayReadSequence } from './Linear/XArray/Read/ReadAnimation.ts'
import XArrayErase from './Linear/XArray/Erase/Erase.tsx'
import { EraseAnimation as XArrayEraseSequence } from './Linear/XArray/Erase/EraseAnimation.ts'
import XArrayInspectStorage from './Linear/XArray/InspectStorage/InspectStorage.tsx'
import { InspectStorageAnimation as XArrayInspectStorageSequence } from './Linear/XArray/InspectStorage/InspectStorageAnimation.ts'
import XArrayClear from './Linear/XArray/Clear/Clear.tsx'
import { ClearAnimation as XArrayClearSequence } from './Linear/XArray/Clear/ClearAnimation.ts'
import FanoutArrayInsert from './Linear/FanoutArray/Insert/Insert.tsx'
import { InsertAnimation as FanoutArrayInsertSequence } from './Linear/FanoutArray/Insert/InsertAnimation.ts'
import FanoutArraySearchByKey from './Linear/FanoutArray/SearchByKey/SearchByKey.tsx'
import { SearchByKeyAnimation as FanoutArraySearchByKeySequence } from './Linear/FanoutArray/SearchByKey/SearchByKeyAnimation.ts'
import FanoutArrayDeleteByKey from './Linear/FanoutArray/DeleteByKey/DeleteByKey.tsx'
import { DeleteByKeyAnimation as FanoutArrayDeleteByKeySequence } from './Linear/FanoutArray/DeleteByKey/DeleteByKeyAnimation.ts'
import FanoutArrayInspectStorage from './Linear/FanoutArray/InspectStorage/InspectStorage.tsx'
import { InspectStorageAnimation as FanoutArrayInspectStorageSequence } from './Linear/FanoutArray/InspectStorage/InspectStorageAnimation.ts'
import FanoutArrayClear from './Linear/FanoutArray/Clear/Clear.tsx'
import { ClearAnimation as FanoutArrayClearSequence } from './Linear/FanoutArray/Clear/ClearAnimation.ts'
import FlatVectorArrayInsert from './Linear/FlatVectorArray/Insert/Insert.tsx'
import { InsertAnimation as FlatVectorArrayInsertSequence } from './Linear/FlatVectorArray/Insert/InsertAnimation.ts'
import FlatVectorArrayNearestNeighbor from './Linear/FlatVectorArray/NearestNeighbor/NearestNeighbor.tsx'
import { NearestNeighborAnimation as FlatVectorArrayNearestNeighborSequence } from './Linear/FlatVectorArray/NearestNeighbor/NearestNeighborAnimation.ts'
import FlatVectorArrayInspectStorage from './Linear/FlatVectorArray/InspectStorage/InspectStorage.tsx'
import { InspectStorageAnimation as FlatVectorArrayInspectStorageSequence } from './Linear/FlatVectorArray/InspectStorage/InspectStorageAnimation.ts'
import FlatVectorArrayClear from './Linear/FlatVectorArray/Clear/Clear.tsx'
import { ClearAnimation as FlatVectorArrayClearSequence } from './Linear/FlatVectorArray/Clear/ClearAnimation.ts'
import RequestTagArrayAllocate from './Linear/RequestTagArray/Allocate/Allocate.tsx'
import { AllocateAnimation as RequestTagArrayAllocateSequence } from './Linear/RequestTagArray/Allocate/AllocateAnimation.ts'
import RequestTagArrayRead from './Linear/RequestTagArray/Read/Read.tsx'
import { ReadAnimation as RequestTagArrayReadSequence } from './Linear/RequestTagArray/Read/ReadAnimation.ts'
import RequestTagArrayRelease from './Linear/RequestTagArray/Release/Release.tsx'
import { ReleaseAnimation as RequestTagArrayReleaseSequence } from './Linear/RequestTagArray/Release/ReleaseAnimation.ts'
import RequestTagArrayInspectStorage from './Linear/RequestTagArray/InspectStorage/InspectStorage.tsx'
import { InspectStorageAnimation as RequestTagArrayInspectStorageSequence } from './Linear/RequestTagArray/InspectStorage/InspectStorageAnimation.ts'
import RequestTagArrayClear from './Linear/RequestTagArray/Clear/Clear.tsx'
import { ClearAnimation as RequestTagArrayClearSequence } from './Linear/RequestTagArray/Clear/ClearAnimation.ts'
import MultiQueueEnqueue from './QueuePriority/MultiQueue/Enqueue/Enqueue.tsx'
import { EnqueueAnimation as MultiQueueEnqueueSequence } from './QueuePriority/MultiQueue/Enqueue/EnqueueAnimation.ts'
import MultiQueueDispatch from './QueuePriority/MultiQueue/Dispatch/Dispatch.tsx'
import { DispatchAnimation as MultiQueueDispatchSequence } from './QueuePriority/MultiQueue/Dispatch/DispatchAnimation.ts'
import MultiQueueInspectStorage from './QueuePriority/MultiQueue/InspectStorage/InspectStorage.tsx'
import { InspectStorageAnimation as MultiQueueInspectStorageSequence } from './QueuePriority/MultiQueue/InspectStorage/InspectStorageAnimation.ts'
import MultiQueueClear from './QueuePriority/MultiQueue/Clear/Clear.tsx'
import { ClearAnimation as MultiQueueClearSequence } from './QueuePriority/MultiQueue/Clear/ClearAnimation.ts'
import LockFreeRingEnqueue from './QueuePriority/LockFreeRing/Enqueue/Enqueue.tsx'
import { EnqueueAnimation as LockFreeRingEnqueueSequence } from './QueuePriority/LockFreeRing/Enqueue/EnqueueAnimation.ts'
import LockFreeRingDequeue from './QueuePriority/LockFreeRing/Dequeue/Dequeue.tsx'
import { DequeueAnimation as LockFreeRingDequeueSequence } from './QueuePriority/LockFreeRing/Dequeue/DequeueAnimation.ts'
import LockFreeRingInspectStorage from './QueuePriority/LockFreeRing/InspectStorage/InspectStorage.tsx'
import { InspectStorageAnimation as LockFreeRingInspectStorageSequence } from './QueuePriority/LockFreeRing/InspectStorage/InspectStorageAnimation.ts'
import LockFreeRingClear from './QueuePriority/LockFreeRing/Clear/Clear.tsx'
import { ClearAnimation as LockFreeRingClearSequence } from './QueuePriority/LockFreeRing/Clear/ClearAnimation.ts'
import GiSTInsert from './Trees/GiST/Insert/Insert.tsx'
import { InsertAnimation as GiSTInsertSequence } from './Trees/GiST/Insert/InsertAnimation.ts'
import GiSTSearchOverlap from './Trees/GiST/SearchOverlap/SearchOverlap.tsx'
import { SearchOverlapAnimation as GiSTSearchOverlapSequence } from './Trees/GiST/SearchOverlap/SearchOverlapAnimation.ts'
import GiSTInspectStorage from './Trees/GiST/InspectStorage/InspectStorage.tsx'
import { InspectStorageAnimation as GiSTInspectStorageSequence } from './Trees/GiST/InspectStorage/InspectStorageAnimation.ts'
import GiSTClear from './Trees/GiST/Clear/Clear.tsx'
import { ClearAnimation as GiSTClearSequence } from './Trees/GiST/Clear/ClearAnimation.ts'
import BKDTreeBuild from './Trees/BKDTree/Build/Build.tsx'
import { BuildAnimation as BKDTreeBuildSequence } from './Trees/BKDTree/Build/BuildAnimation.ts'
import BKDTreeSearchRange from './Trees/BKDTree/SearchRange/SearchRange.tsx'
import { SearchRangeAnimation as BKDTreeSearchRangeSequence } from './Trees/BKDTree/SearchRange/SearchRangeAnimation.ts'
import BKDTreeInspectStorage from './Trees/BKDTree/InspectStorage/InspectStorage.tsx'
import { InspectStorageAnimation as BKDTreeInspectStorageSequence } from './Trees/BKDTree/InspectStorage/InspectStorageAnimation.ts'
import BKDTreeClear from './Trees/BKDTree/Clear/Clear.tsx'
import { ClearAnimation as BKDTreeClearSequence } from './Trees/BKDTree/Clear/ClearAnimation.ts'
import BallTreeBuild from './Trees/BallTree/Build/Build.tsx'
import { BuildAnimation as BallTreeBuildSequence } from './Trees/BallTree/Build/BuildAnimation.ts'
import BallTreeNearestNeighbor from './Trees/BallTree/NearestNeighbor/NearestNeighbor.tsx'
import { NearestNeighborAnimation as BallTreeNearestNeighborSequence } from './Trees/BallTree/NearestNeighbor/NearestNeighborAnimation.ts'
import BallTreeInspectStorage from './Trees/BallTree/InspectStorage/InspectStorage.tsx'
import { InspectStorageAnimation as BallTreeInspectStorageSequence } from './Trees/BallTree/InspectStorage/InspectStorageAnimation.ts'
import BallTreeClear from './Trees/BallTree/Clear/Clear.tsx'
import { ClearAnimation as BallTreeClearSequence } from './Trees/BallTree/Clear/ClearAnimation.ts'
import MapleTreeStoreRange from './Trees/MapleTree/StoreRange/StoreRange.tsx'
import { StoreRangeAnimation as MapleTreeStoreRangeSequence } from './Trees/MapleTree/StoreRange/StoreRangeAnimation.ts'
import MapleTreeEraseRange from './Trees/MapleTree/EraseRange/EraseRange.tsx'
import { EraseRangeAnimation as MapleTreeEraseRangeSequence } from './Trees/MapleTree/EraseRange/EraseRangeAnimation.ts'
import MapleTreeRead from './Trees/MapleTree/Read/Read.tsx'
import { ReadAnimation as MapleTreeReadSequence } from './Trees/MapleTree/Read/ReadAnimation.ts'
import MapleTreeFindGap from './Trees/MapleTree/FindGap/FindGap.tsx'
import { FindGapAnimation as MapleTreeFindGapSequence } from './Trees/MapleTree/FindGap/FindGapAnimation.ts'
import MapleTreeInspectStorage from './Trees/MapleTree/InspectStorage/InspectStorage.tsx'
import { InspectStorageAnimation as MapleTreeInspectStorageSequence } from './Trees/MapleTree/InspectStorage/InspectStorageAnimation.ts'
import MapleTreeClear from './Trees/MapleTree/Clear/Clear.tsx'
import { ClearAnimation as MapleTreeClearSequence } from './Trees/MapleTree/Clear/ClearAnimation.ts'
import ChecksummedBlockTreeUpdate from './Trees/ChecksummedBlockTree/Update/Update.tsx'
import { UpdateAnimation as ChecksummedBlockTreeUpdateSequence } from './Trees/ChecksummedBlockTree/Update/UpdateAnimation.ts'
import ChecksummedBlockTreeVerify from './Trees/ChecksummedBlockTree/Verify/Verify.tsx'
import { VerifyAnimation as ChecksummedBlockTreeVerifySequence } from './Trees/ChecksummedBlockTree/Verify/VerifyAnimation.ts'
import ChecksummedBlockTreeCorrupt from './Trees/ChecksummedBlockTree/Corrupt/Corrupt.tsx'
import { CorruptAnimation as ChecksummedBlockTreeCorruptSequence } from './Trees/ChecksummedBlockTree/Corrupt/CorruptAnimation.ts'
import ChecksummedBlockTreeInspectStorage from './Trees/ChecksummedBlockTree/InspectStorage/InspectStorage.tsx'
import { InspectStorageAnimation as ChecksummedBlockTreeInspectStorageSequence } from './Trees/ChecksummedBlockTree/InspectStorage/InspectStorageAnimation.ts'
import ChecksummedBlockTreeClear from './Trees/ChecksummedBlockTree/Clear/Clear.tsx'
import { ClearAnimation as ChecksummedBlockTreeClearSequence } from './Trees/ChecksummedBlockTree/Clear/ClearAnimation.ts'
import InvertedIndexIndexDocument from './StringText/InvertedIndex/IndexDocument/IndexDocument.tsx'
import { IndexDocumentAnimation as InvertedIndexIndexDocumentSequence } from './StringText/InvertedIndex/IndexDocument/IndexDocumentAnimation.ts'
import InvertedIndexSearchTerms from './StringText/InvertedIndex/SearchTerms/SearchTerms.tsx'
import { SearchTermsAnimation as InvertedIndexSearchTermsSequence } from './StringText/InvertedIndex/SearchTerms/SearchTermsAnimation.ts'
import InvertedIndexDeleteDocument from './StringText/InvertedIndex/DeleteDocument/DeleteDocument.tsx'
import { DeleteDocumentAnimation as InvertedIndexDeleteDocumentSequence } from './StringText/InvertedIndex/DeleteDocument/DeleteDocumentAnimation.ts'
import InvertedIndexInspectStorage from './StringText/InvertedIndex/InspectStorage/InspectStorage.tsx'
import { InspectStorageAnimation as InvertedIndexInspectStorageSequence } from './StringText/InvertedIndex/InspectStorage/InspectStorageAnimation.ts'
import InvertedIndexClear from './StringText/InvertedIndex/Clear/Clear.tsx'
import { ClearAnimation as InvertedIndexClearSequence } from './StringText/InvertedIndex/Clear/ClearAnimation.ts'
import LSHIndexInsert from './HashBased/LSHIndex/Insert/Insert.tsx'
import { InsertAnimation as LSHIndexInsertSequence } from './HashBased/LSHIndex/Insert/InsertAnimation.ts'
import LSHIndexNearestNeighbor from './HashBased/LSHIndex/NearestNeighbor/NearestNeighbor.tsx'
import { NearestNeighborAnimation as LSHIndexNearestNeighborSequence } from './HashBased/LSHIndex/NearestNeighbor/NearestNeighborAnimation.ts'
import LSHIndexInspectStorage from './HashBased/LSHIndex/InspectStorage/InspectStorage.tsx'
import { InspectStorageAnimation as LSHIndexInspectStorageSequence } from './HashBased/LSHIndex/InspectStorage/InspectStorageAnimation.ts'
import LSHIndexClear from './HashBased/LSHIndex/Clear/Clear.tsx'
import { ClearAnimation as LSHIndexClearSequence } from './HashBased/LSHIndex/Clear/ClearAnimation.ts'
import MinimizerIndexBuild from './HashBased/MinimizerIndex/Build/Build.tsx'
import { BuildAnimation as MinimizerIndexBuildSequence } from './HashBased/MinimizerIndex/Build/BuildAnimation.ts'
import MinimizerIndexSearch from './HashBased/MinimizerIndex/Search/Search.tsx'
import { SearchAnimation as MinimizerIndexSearchSequence } from './HashBased/MinimizerIndex/Search/SearchAnimation.ts'
import MinimizerIndexInspectStorage from './HashBased/MinimizerIndex/InspectStorage/InspectStorage.tsx'
import { InspectStorageAnimation as MinimizerIndexInspectStorageSequence } from './HashBased/MinimizerIndex/InspectStorage/InspectStorageAnimation.ts'
import MinimizerIndexClear from './HashBased/MinimizerIndex/Clear/Clear.tsx'
import { ClearAnimation as MinimizerIndexClearSequence } from './HashBased/MinimizerIndex/Clear/ClearAnimation.ts'
import BlockedBloomFilterAdd from './Probabilistic/BlockedBloomFilter/Add/Add.tsx'
import { AddAnimation as BlockedBloomFilterAddSequence } from './Probabilistic/BlockedBloomFilter/Add/AddAnimation.ts'
import BlockedBloomFilterCheckMembership from './Probabilistic/BlockedBloomFilter/CheckMembership/CheckMembership.tsx'
import { CheckMembershipAnimation as BlockedBloomFilterCheckMembershipSequence } from './Probabilistic/BlockedBloomFilter/CheckMembership/CheckMembershipAnimation.ts'
import BlockedBloomFilterInspectStorage from './Probabilistic/BlockedBloomFilter/InspectStorage/InspectStorage.tsx'
import { InspectStorageAnimation as BlockedBloomFilterInspectStorageSequence } from './Probabilistic/BlockedBloomFilter/InspectStorage/InspectStorageAnimation.ts'
import BlockedBloomFilterClear from './Probabilistic/BlockedBloomFilter/Clear/Clear.tsx'
import { ClearAnimation as BlockedBloomFilterClearSequence } from './Probabilistic/BlockedBloomFilter/Clear/ClearAnimation.ts'
import HNSWGraphInsert from './Graphs/HNSWGraph/Insert/Insert.tsx'
import { InsertAnimation as HNSWGraphInsertSequence } from './Graphs/HNSWGraph/Insert/InsertAnimation.ts'
import HNSWGraphNearestNeighbor from './Graphs/HNSWGraph/NearestNeighbor/NearestNeighbor.tsx'
import { NearestNeighborAnimation as HNSWGraphNearestNeighborSequence } from './Graphs/HNSWGraph/NearestNeighbor/NearestNeighborAnimation.ts'
import HNSWGraphSearchByValue from './Graphs/HNSWGraph/SearchByValue/SearchByValue.tsx'
import { SearchByValueAnimation as HNSWGraphSearchByValueSequence } from './Graphs/HNSWGraph/SearchByValue/SearchByValueAnimation.ts'
import HNSWGraphInspectStorage from './Graphs/HNSWGraph/InspectStorage/InspectStorage.tsx'
import { InspectStorageAnimation as HNSWGraphInspectStorageSequence } from './Graphs/HNSWGraph/InspectStorage/InspectStorageAnimation.ts'
import HNSWGraphClear from './Graphs/HNSWGraph/Clear/Clear.tsx'
import { ClearAnimation as HNSWGraphClearSequence } from './Graphs/HNSWGraph/Clear/ClearAnimation.ts'
import HNSWGraphBreadthFirst from '../DataStructuresAlgorithms/GraphsTraversal/HNSWGraph/BreadthFirst/BreadthFirst.tsx'
import { BreadthFirstAnimation as HNSWGraphBreadthFirstSequence } from '../DataStructuresAlgorithms/GraphsTraversal/HNSWGraph/BreadthFirst/BreadthFirstAnimation.ts'
import HNSWGraphDepthFirst from '../DataStructuresAlgorithms/GraphsTraversal/HNSWGraph/DepthFirst/DepthFirst.tsx'
import { DepthFirstAnimation as HNSWGraphDepthFirstSequence } from '../DataStructuresAlgorithms/GraphsTraversal/HNSWGraph/DepthFirst/DepthFirstAnimation.ts'
import CompactedDeBruijnGraphBuild from './Graphs/CompactedDeBruijnGraph/Build/Build.tsx'
import { BuildAnimation as CompactedDeBruijnGraphBuildSequence } from './Graphs/CompactedDeBruijnGraph/Build/BuildAnimation.ts'
import CompactedDeBruijnGraphSearch from './Graphs/CompactedDeBruijnGraph/Search/Search.tsx'
import { SearchAnimation as CompactedDeBruijnGraphSearchSequence } from './Graphs/CompactedDeBruijnGraph/Search/SearchAnimation.ts'
import CompactedDeBruijnGraphSearchByValue from './Graphs/CompactedDeBruijnGraph/SearchByValue/SearchByValue.tsx'
import { SearchByValueAnimation as CompactedDeBruijnGraphSearchByValueSequence } from './Graphs/CompactedDeBruijnGraph/SearchByValue/SearchByValueAnimation.ts'
import CompactedDeBruijnGraphInspectStorage from './Graphs/CompactedDeBruijnGraph/InspectStorage/InspectStorage.tsx'
import { InspectStorageAnimation as CompactedDeBruijnGraphInspectStorageSequence } from './Graphs/CompactedDeBruijnGraph/InspectStorage/InspectStorageAnimation.ts'
import CompactedDeBruijnGraphClear from './Graphs/CompactedDeBruijnGraph/Clear/Clear.tsx'
import { ClearAnimation as CompactedDeBruijnGraphClearSequence } from './Graphs/CompactedDeBruijnGraph/Clear/ClearAnimation.ts'
import CompactedDeBruijnGraphBreadthFirst from '../DataStructuresAlgorithms/GraphsTraversal/CompactedDeBruijnGraph/BreadthFirst/BreadthFirst.tsx'
import { BreadthFirstAnimation as CompactedDeBruijnGraphBreadthFirstSequence } from '../DataStructuresAlgorithms/GraphsTraversal/CompactedDeBruijnGraph/BreadthFirst/BreadthFirstAnimation.ts'
import CompactedDeBruijnGraphDepthFirst from '../DataStructuresAlgorithms/GraphsTraversal/CompactedDeBruijnGraph/DepthFirst/DepthFirst.tsx'
import { DepthFirstAnimation as CompactedDeBruijnGraphDepthFirstSequence } from '../DataStructuresAlgorithms/GraphsTraversal/CompactedDeBruijnGraph/DepthFirst/DepthFirstAnimation.ts'
import AddressSpaceGraphAddNode from './Graphs/AddressSpaceGraph/AddNode/AddNode.tsx'
import { AddNodeAnimation as AddressSpaceGraphAddNodeSequence } from './Graphs/AddressSpaceGraph/AddNode/AddNodeAnimation.ts'
import AddressSpaceGraphAddReference from './Graphs/AddressSpaceGraph/AddReference/AddReference.tsx'
import { AddReferenceAnimation as AddressSpaceGraphAddReferenceSequence } from './Graphs/AddressSpaceGraph/AddReference/AddReferenceAnimation.ts'
import AddressSpaceGraphRemoveReference from './Graphs/AddressSpaceGraph/RemoveReference/RemoveReference.tsx'
import { RemoveReferenceAnimation as AddressSpaceGraphRemoveReferenceSequence } from './Graphs/AddressSpaceGraph/RemoveReference/RemoveReferenceAnimation.ts'
import AddressSpaceGraphDeleteNode from './Graphs/AddressSpaceGraph/DeleteNode/DeleteNode.tsx'
import { DeleteNodeAnimation as AddressSpaceGraphDeleteNodeSequence } from './Graphs/AddressSpaceGraph/DeleteNode/DeleteNodeAnimation.ts'
import AddressSpaceGraphSearchByValue from './Graphs/AddressSpaceGraph/SearchByValue/SearchByValue.tsx'
import { SearchByValueAnimation as AddressSpaceGraphSearchByValueSequence } from './Graphs/AddressSpaceGraph/SearchByValue/SearchByValueAnimation.ts'
import AddressSpaceGraphBrowse from './Graphs/AddressSpaceGraph/Browse/Browse.tsx'
import { BrowseAnimation as AddressSpaceGraphBrowseSequence } from './Graphs/AddressSpaceGraph/Browse/BrowseAnimation.ts'
import AddressSpaceGraphInspectStorage from './Graphs/AddressSpaceGraph/InspectStorage/InspectStorage.tsx'
import { InspectStorageAnimation as AddressSpaceGraphInspectStorageSequence } from './Graphs/AddressSpaceGraph/InspectStorage/InspectStorageAnimation.ts'
import AddressSpaceGraphClear from './Graphs/AddressSpaceGraph/Clear/Clear.tsx'
import { ClearAnimation as AddressSpaceGraphClearSequence } from './Graphs/AddressSpaceGraph/Clear/ClearAnimation.ts'
import AddressSpaceGraphBreadthFirst from '../DataStructuresAlgorithms/GraphsTraversal/AddressSpaceGraph/BreadthFirst/BreadthFirst.tsx'
import { BreadthFirstAnimation as AddressSpaceGraphBreadthFirstSequence } from '../DataStructuresAlgorithms/GraphsTraversal/AddressSpaceGraph/BreadthFirst/BreadthFirstAnimation.ts'
import AddressSpaceGraphDepthFirst from '../DataStructuresAlgorithms/GraphsTraversal/AddressSpaceGraph/DepthFirst/DepthFirst.tsx'
import { DepthFirstAnimation as AddressSpaceGraphDepthFirstSequence } from '../DataStructuresAlgorithms/GraphsTraversal/AddressSpaceGraph/DepthFirst/DepthFirstAnimation.ts'

export class AppliedFeatures {
  public static render(action: ActionKind, props: StructuredLinearActionProps, session: number): ReactNode {
    switch (props.model.kind) {
      case 'brin':
        switch (action) {
          case 'insert-end': return <BRINAppend key={session} {...props} />
          case 'search-overlap': return <BRINSearchRange key={session} {...props} />
          case 'inspect-storage': return <BRINInspectStorage key={session} {...props} />
          case 'clear': return <BRINClear key={session} {...props} />
        }
        break
      case 'sstable':
        switch (action) {
          case 'build-values': return <SSTableBuild key={session} {...props} />
          case 'search-value': return <SSTableSearchByKey key={session} {...props} />
          case 'inspect-storage': return <SSTableInspectStorage key={session} {...props} />
          case 'clear': return <SSTableClear key={session} {...props} />
        }
        break
      case 'sparse-primary-index':
        switch (action) {
          case 'build-values': return <SparsePrimaryIndexBuild key={session} {...props} />
          case 'search-value': return <SparsePrimaryIndexSearchByKey key={session} {...props} />
          case 'inspect-storage': return <SparsePrimaryIndexInspectStorage key={session} {...props} />
          case 'clear': return <SparsePrimaryIndexClear key={session} {...props} />
        }
        break
      case 'sparse-offset-index':
        switch (action) {
          case 'insert-end': return <SparseOffsetIndexAppend key={session} {...props} />
          case 'search-index': return <SparseOffsetIndexReadOffset key={session} {...props} />
          case 'inspect-storage': return <SparseOffsetIndexInspectStorage key={session} {...props} />
          case 'clear': return <SparseOffsetIndexClear key={session} {...props} />
        }
        break
      case 'time-index':
        switch (action) {
          case 'insert-end': return <TimeIndexAppend key={session} {...props} />
          case 'search-value': return <TimeIndexSearchTimestamp key={session} {...props} />
          case 'inspect-storage': return <TimeIndexInspectStorage key={session} {...props} />
          case 'clear': return <TimeIndexClear key={session} {...props} />
        }
        break
      case 'ivf-index':
        switch (action) {
          case 'build-values': return <IVFIndexBuild key={session} {...props} />
          case 'nearest-neighbor': return <IVFIndexNearestNeighbor key={session} {...props} />
          case 'inspect-storage': return <IVFIndexInspectStorage key={session} {...props} />
          case 'clear': return <IVFIndexClear key={session} {...props} />
        }
        break
      case 'content-addressed-layers':
        switch (action) {
          case 'insert': return <ContentAddressedLayersAddLayer key={session} {...props} />
          case 'search-value': return <ContentAddressedLayersLookupContent key={session} {...props} />
          case 'browse-node': return <ContentAddressedLayersReadChain key={session} {...props} />
          case 'verify-proof': return <ContentAddressedLayersVerify key={session} {...props} />
          case 'inspect-storage': return <ContentAddressedLayersInspectStorage key={session} {...props} />
          case 'clear': return <ContentAddressedLayersClear key={session} {...props} />
        }
        break

      case 'append-only-log':
        switch (action) {
          case 'insert-end': return <AppendOnlyLogAppend key={session} {...props} />
          case 'search-index': return <AppendOnlyLogReadOffset key={session} {...props} />
          case 'inspect-storage': return <AppendOnlyLogInspectStorage key={session} {...props} />
          case 'clear': return <AppendOnlyLogClear key={session} {...props} />
        }
        break
      case 'xarray':
        switch (action) {
          case 'update-index': return <XArrayStore key={session} {...props} />
          case 'search-index': return <XArrayRead key={session} {...props} />
          case 'delete-index': return <XArrayErase key={session} {...props} />
          case 'inspect-storage': return <XArrayInspectStorage key={session} {...props} />
          case 'clear': return <XArrayClear key={session} {...props} />
        }
        break
      case 'fanout-array':
        switch (action) {
          case 'insert': return <FanoutArrayInsert key={session} {...props} />
          case 'search-value': return <FanoutArraySearchByKey key={session} {...props} />
          case 'delete-value': return <FanoutArrayDeleteByKey key={session} {...props} />
          case 'inspect-storage': return <FanoutArrayInspectStorage key={session} {...props} />
          case 'clear': return <FanoutArrayClear key={session} {...props} />
        }
        break
      case 'flat-vector-array':
        switch (action) {
          case 'insert': return <FlatVectorArrayInsert key={session} {...props} />
          case 'nearest-neighbor': return <FlatVectorArrayNearestNeighbor key={session} {...props} />
          case 'inspect-storage': return <FlatVectorArrayInspectStorage key={session} {...props} />
          case 'clear': return <FlatVectorArrayClear key={session} {...props} />
        }
        break
      case 'request-tag-array':
        switch (action) {
          case 'allocate': return <RequestTagArrayAllocate key={session} {...props} />
          case 'search-index': return <RequestTagArrayRead key={session} {...props} />
          case 'release': return <RequestTagArrayRelease key={session} {...props} />
          case 'inspect-storage': return <RequestTagArrayInspectStorage key={session} {...props} />
          case 'clear': return <RequestTagArrayClear key={session} {...props} />
        }
        break
      case 'multi-queue':
        switch (action) {
          case 'enqueue': return <MultiQueueEnqueue key={session} {...props} />
          case 'dequeue': return <MultiQueueDispatch key={session} {...props} />
          case 'inspect-storage': return <MultiQueueInspectStorage key={session} {...props} />
          case 'clear': return <MultiQueueClear key={session} {...props} />
        }
        break
      case 'lock-free-ring':
        switch (action) {
          case 'enqueue': return <LockFreeRingEnqueue key={session} {...props} />
          case 'dequeue': return <LockFreeRingDequeue key={session} {...props} />
          case 'inspect-storage': return <LockFreeRingInspectStorage key={session} {...props} />
          case 'clear': return <LockFreeRingClear key={session} {...props} />
        }
        break
      case 'gist':
        switch (action) {
          case 'insert': return <GiSTInsert key={session} {...props} />
          case 'search-overlap': return <GiSTSearchOverlap key={session} {...props} />
          case 'inspect-storage': return <GiSTInspectStorage key={session} {...props} />
          case 'clear': return <GiSTClear key={session} {...props} />
        }
        break
      case 'bkd-tree':
        switch (action) {
          case 'build-values': return <BKDTreeBuild key={session} {...props} />
          case 'search-overlap': return <BKDTreeSearchRange key={session} {...props} />
          case 'inspect-storage': return <BKDTreeInspectStorage key={session} {...props} />
          case 'clear': return <BKDTreeClear key={session} {...props} />
        }
        break
      case 'ball-tree':
        switch (action) {
          case 'build-values': return <BallTreeBuild key={session} {...props} />
          case 'nearest-neighbor': return <BallTreeNearestNeighbor key={session} {...props} />
          case 'inspect-storage': return <BallTreeInspectStorage key={session} {...props} />
          case 'clear': return <BallTreeClear key={session} {...props} />
        }
        break
      case 'maple-tree':
        switch (action) {
          case 'insert': return <MapleTreeStoreRange key={session} {...props} />
          case 'delete-value': return <MapleTreeEraseRange key={session} {...props} />
          case 'search-index': return <MapleTreeRead key={session} {...props} />
          case 'find-gap': return <MapleTreeFindGap key={session} {...props} />
          case 'inspect-storage': return <MapleTreeInspectStorage key={session} {...props} />
          case 'clear': return <MapleTreeClear key={session} {...props} />
        }
        break
      case 'checksummed-block-tree':
        switch (action) {
          case 'update-index': return <ChecksummedBlockTreeUpdate key={session} {...props} />
          case 'verify-proof': return <ChecksummedBlockTreeVerify key={session} {...props} />
          case 'corrupt-block': return <ChecksummedBlockTreeCorrupt key={session} {...props} />
          case 'inspect-storage': return <ChecksummedBlockTreeInspectStorage key={session} {...props} />
          case 'clear': return <ChecksummedBlockTreeClear key={session} {...props} />
        }
        break
      case 'inverted-index':
        switch (action) {
          case 'insert': return <InvertedIndexIndexDocument key={session} {...props} />
          case 'search-text': return <InvertedIndexSearchTerms key={session} {...props} />
          case 'delete-value': return <InvertedIndexDeleteDocument key={session} {...props} />
          case 'inspect-storage': return <InvertedIndexInspectStorage key={session} {...props} />
          case 'clear': return <InvertedIndexClear key={session} {...props} />
        }
        break
      case 'lsh-index':
        switch (action) {
          case 'insert': return <LSHIndexInsert key={session} {...props} />
          case 'nearest-neighbor': return <LSHIndexNearestNeighbor key={session} {...props} />
          case 'inspect-storage': return <LSHIndexInspectStorage key={session} {...props} />
          case 'clear': return <LSHIndexClear key={session} {...props} />
        }
        break
      case 'minimizer-index':
        switch (action) {
          case 'build-text': return <MinimizerIndexBuild key={session} {...props} />
          case 'search-text': return <MinimizerIndexSearch key={session} {...props} />
          case 'inspect-storage': return <MinimizerIndexInspectStorage key={session} {...props} />
          case 'clear': return <MinimizerIndexClear key={session} {...props} />
        }
        break
      case 'blocked-bloom-filter':
        switch (action) {
          case 'insert': return <BlockedBloomFilterAdd key={session} {...props} />
          case 'search-value': return <BlockedBloomFilterCheckMembership key={session} {...props} />
          case 'inspect-storage': return <BlockedBloomFilterInspectStorage key={session} {...props} />
          case 'clear': return <BlockedBloomFilterClear key={session} {...props} />
        }
        break
      case 'hnsw-graph':
        switch (action) {
          case 'insert': return <HNSWGraphInsert key={session} {...props} />
          case 'nearest-neighbor': return <HNSWGraphNearestNeighbor key={session} {...props} />
          case 'search-value': return <HNSWGraphSearchByValue key={session} {...props} />
          case 'inspect-storage': return <HNSWGraphInspectStorage key={session} {...props} />
          case 'clear': return <HNSWGraphClear key={session} {...props} />
          case 'breadth-first': return <HNSWGraphBreadthFirst key={session} {...props} />
          case 'depth-first': return <HNSWGraphDepthFirst key={session} {...props} />
        }
        break
      case 'compacted-de-bruijn-graph':
        switch (action) {
          case 'build-text': return <CompactedDeBruijnGraphBuild key={session} {...props} />
          case 'search-text': return <CompactedDeBruijnGraphSearch key={session} {...props} />
          case 'search-value': return <CompactedDeBruijnGraphSearchByValue key={session} {...props} />
          case 'inspect-storage': return <CompactedDeBruijnGraphInspectStorage key={session} {...props} />
          case 'clear': return <CompactedDeBruijnGraphClear key={session} {...props} />
          case 'breadth-first': return <CompactedDeBruijnGraphBreadthFirst key={session} {...props} />
          case 'depth-first': return <CompactedDeBruijnGraphDepthFirst key={session} {...props} />
        }
        break
      case 'address-space-graph':
        switch (action) {
          case 'add-vertex': return <AddressSpaceGraphAddNode key={session} {...props} />
          case 'add-edge': return <AddressSpaceGraphAddReference key={session} {...props} />
          case 'remove-edge': return <AddressSpaceGraphRemoveReference key={session} {...props} />
          case 'delete-value': return <AddressSpaceGraphDeleteNode key={session} {...props} />
          case 'search-value': return <AddressSpaceGraphSearchByValue key={session} {...props} />
          case 'browse-node': return <AddressSpaceGraphBrowse key={session} {...props} />
          case 'inspect-storage': return <AddressSpaceGraphInspectStorage key={session} {...props} />
          case 'clear': return <AddressSpaceGraphClear key={session} {...props} />
          case 'breadth-first': return <AddressSpaceGraphBreadthFirst key={session} {...props} />
          case 'depth-first': return <AddressSpaceGraphDepthFirst key={session} {...props} />
        }
        break
    }
    return null
  }

  public static describe(action: ActionKind, model: LinearModel): AlgorithmInformation | null {
    const size = model instanceof AppliedGraphModel && (action === 'breadth-first' || action === 'depth-first' || action === 'inspect-storage')
      ? model.getVertexIds().length : model.length
    switch (model.kind) {
      case 'brin':
        switch (action) {
          case 'insert-end': return BRINAppendSequence.describe(size)
          case 'search-overlap': return BRINSearchRangeSequence.describe(size)
          case 'inspect-storage': return BRINInspectStorageSequence.describe(size)
          case 'clear': return BRINClearSequence.describe(size)
        }
        break
      case 'sstable':
        switch (action) {
          case 'build-values': return SSTableBuildSequence.describe(size)
          case 'search-value': return SSTableSearchByKeySequence.describe(size)
          case 'inspect-storage': return SSTableInspectStorageSequence.describe(size)
          case 'clear': return SSTableClearSequence.describe(size)
        }
        break
      case 'sparse-primary-index':
        switch (action) {
          case 'build-values': return SparsePrimaryIndexBuildSequence.describe(size)
          case 'search-value': return SparsePrimaryIndexSearchByKeySequence.describe(size)
          case 'inspect-storage': return SparsePrimaryIndexInspectStorageSequence.describe(size)
          case 'clear': return SparsePrimaryIndexClearSequence.describe(size)
        }
        break
      case 'sparse-offset-index':
        switch (action) {
          case 'insert-end': return SparseOffsetIndexAppendSequence.describe(size)
          case 'search-index': return SparseOffsetIndexReadOffsetSequence.describe(size)
          case 'inspect-storage': return SparseOffsetIndexInspectStorageSequence.describe(size)
          case 'clear': return SparseOffsetIndexClearSequence.describe(size)
        }
        break
      case 'time-index':
        switch (action) {
          case 'insert-end': return TimeIndexAppendSequence.describe(size)
          case 'search-value': return TimeIndexSearchTimestampSequence.describe(size)
          case 'inspect-storage': return TimeIndexInspectStorageSequence.describe(size)
          case 'clear': return TimeIndexClearSequence.describe(size)
        }
        break
      case 'ivf-index':
        switch (action) {
          case 'build-values': return IVFIndexBuildSequence.describe(size)
          case 'nearest-neighbor': return IVFIndexNearestNeighborSequence.describe(size)
          case 'inspect-storage': return IVFIndexInspectStorageSequence.describe(size)
          case 'clear': return IVFIndexClearSequence.describe(size)
        }
        break
      case 'content-addressed-layers':
        switch (action) {
          case 'insert': return ContentAddressedLayersAddLayerSequence.describe(size)
          case 'search-value': return ContentAddressedLayersLookupContentSequence.describe(size)
          case 'browse-node': return ContentAddressedLayersReadChainSequence.describe(size)
          case 'verify-proof': return ContentAddressedLayersVerifySequence.describe(size)
          case 'inspect-storage': return ContentAddressedLayersInspectStorageSequence.describe(size)
          case 'clear': return ContentAddressedLayersClearSequence.describe(size)
        }
        break

      case 'append-only-log':
        switch (action) {
          case 'insert-end': return AppendOnlyLogAppendSequence.describe(size)
          case 'search-index': return AppendOnlyLogReadOffsetSequence.describe(size)
          case 'inspect-storage': return AppendOnlyLogInspectStorageSequence.describe(size)
          case 'clear': return AppendOnlyLogClearSequence.describe(size)
        }
        break
      case 'xarray':
        switch (action) {
          case 'update-index': return XArrayStoreSequence.describe(size)
          case 'search-index': return XArrayReadSequence.describe(size)
          case 'delete-index': return XArrayEraseSequence.describe(size)
          case 'inspect-storage': return XArrayInspectStorageSequence.describe(size)
          case 'clear': return XArrayClearSequence.describe(size)
        }
        break
      case 'fanout-array':
        switch (action) {
          case 'insert': return FanoutArrayInsertSequence.describe(size)
          case 'search-value': return FanoutArraySearchByKeySequence.describe(size)
          case 'delete-value': return FanoutArrayDeleteByKeySequence.describe(size)
          case 'inspect-storage': return FanoutArrayInspectStorageSequence.describe(size)
          case 'clear': return FanoutArrayClearSequence.describe(size)
        }
        break
      case 'flat-vector-array':
        switch (action) {
          case 'insert': return FlatVectorArrayInsertSequence.describe(size)
          case 'nearest-neighbor': return FlatVectorArrayNearestNeighborSequence.describe(size)
          case 'inspect-storage': return FlatVectorArrayInspectStorageSequence.describe(size)
          case 'clear': return FlatVectorArrayClearSequence.describe(size)
        }
        break
      case 'request-tag-array':
        switch (action) {
          case 'allocate': return RequestTagArrayAllocateSequence.describe(size)
          case 'search-index': return RequestTagArrayReadSequence.describe(size)
          case 'release': return RequestTagArrayReleaseSequence.describe(size)
          case 'inspect-storage': return RequestTagArrayInspectStorageSequence.describe(size)
          case 'clear': return RequestTagArrayClearSequence.describe(size)
        }
        break
      case 'multi-queue':
        switch (action) {
          case 'enqueue': return MultiQueueEnqueueSequence.describe(size)
          case 'dequeue': return MultiQueueDispatchSequence.describe(size)
          case 'inspect-storage': return MultiQueueInspectStorageSequence.describe(size)
          case 'clear': return MultiQueueClearSequence.describe(size)
        }
        break
      case 'lock-free-ring':
        switch (action) {
          case 'enqueue': return LockFreeRingEnqueueSequence.describe(size)
          case 'dequeue': return LockFreeRingDequeueSequence.describe(size)
          case 'inspect-storage': return LockFreeRingInspectStorageSequence.describe(size)
          case 'clear': return LockFreeRingClearSequence.describe(size)
        }
        break
      case 'gist':
        switch (action) {
          case 'insert': return GiSTInsertSequence.describe(size)
          case 'search-overlap': return GiSTSearchOverlapSequence.describe(size)
          case 'inspect-storage': return GiSTInspectStorageSequence.describe(size)
          case 'clear': return GiSTClearSequence.describe(size)
        }
        break
      case 'bkd-tree':
        switch (action) {
          case 'build-values': return BKDTreeBuildSequence.describe(size)
          case 'search-overlap': return BKDTreeSearchRangeSequence.describe(size)
          case 'inspect-storage': return BKDTreeInspectStorageSequence.describe(size)
          case 'clear': return BKDTreeClearSequence.describe(size)
        }
        break
      case 'ball-tree':
        switch (action) {
          case 'build-values': return BallTreeBuildSequence.describe(size)
          case 'nearest-neighbor': return BallTreeNearestNeighborSequence.describe(size)
          case 'inspect-storage': return BallTreeInspectStorageSequence.describe(size)
          case 'clear': return BallTreeClearSequence.describe(size)
        }
        break
      case 'maple-tree':
        switch (action) {
          case 'insert': return MapleTreeStoreRangeSequence.describe(size)
          case 'delete-value': return MapleTreeEraseRangeSequence.describe(size)
          case 'search-index': return MapleTreeReadSequence.describe(size)
          case 'find-gap': return MapleTreeFindGapSequence.describe(size)
          case 'inspect-storage': return MapleTreeInspectStorageSequence.describe(size)
          case 'clear': return MapleTreeClearSequence.describe(size)
        }
        break
      case 'checksummed-block-tree':
        switch (action) {
          case 'update-index': return ChecksummedBlockTreeUpdateSequence.describe(size)
          case 'verify-proof': return ChecksummedBlockTreeVerifySequence.describe(size)
          case 'corrupt-block': return ChecksummedBlockTreeCorruptSequence.describe(size)
          case 'inspect-storage': return ChecksummedBlockTreeInspectStorageSequence.describe(size)
          case 'clear': return ChecksummedBlockTreeClearSequence.describe(size)
        }
        break
      case 'inverted-index':
        switch (action) {
          case 'insert': return InvertedIndexIndexDocumentSequence.describe(size)
          case 'search-text': return InvertedIndexSearchTermsSequence.describe(size)
          case 'delete-value': return InvertedIndexDeleteDocumentSequence.describe(size)
          case 'inspect-storage': return InvertedIndexInspectStorageSequence.describe(size)
          case 'clear': return InvertedIndexClearSequence.describe(size)
        }
        break
      case 'lsh-index':
        switch (action) {
          case 'insert': return LSHIndexInsertSequence.describe(size)
          case 'nearest-neighbor': return LSHIndexNearestNeighborSequence.describe(size)
          case 'inspect-storage': return LSHIndexInspectStorageSequence.describe(size)
          case 'clear': return LSHIndexClearSequence.describe(size)
        }
        break
      case 'minimizer-index':
        switch (action) {
          case 'build-text': return MinimizerIndexBuildSequence.describe(size)
          case 'search-text': return MinimizerIndexSearchSequence.describe(size)
          case 'inspect-storage': return MinimizerIndexInspectStorageSequence.describe(size)
          case 'clear': return MinimizerIndexClearSequence.describe(size)
        }
        break
      case 'blocked-bloom-filter':
        switch (action) {
          case 'insert': return BlockedBloomFilterAddSequence.describe(size)
          case 'search-value': return BlockedBloomFilterCheckMembershipSequence.describe(size)
          case 'inspect-storage': return BlockedBloomFilterInspectStorageSequence.describe(size)
          case 'clear': return BlockedBloomFilterClearSequence.describe(size)
        }
        break
      case 'hnsw-graph':
        switch (action) {
          case 'insert': return HNSWGraphInsertSequence.describe(size)
          case 'nearest-neighbor': return HNSWGraphNearestNeighborSequence.describe(size)
          case 'search-value': return HNSWGraphSearchByValueSequence.describe(size)
          case 'inspect-storage': return HNSWGraphInspectStorageSequence.describe(size)
          case 'clear': return HNSWGraphClearSequence.describe(size)
          case 'breadth-first': return HNSWGraphBreadthFirstSequence.describe(size)
          case 'depth-first': return HNSWGraphDepthFirstSequence.describe(size)
        }
        break
      case 'compacted-de-bruijn-graph':
        switch (action) {
          case 'build-text': return CompactedDeBruijnGraphBuildSequence.describe(size)
          case 'search-text': return CompactedDeBruijnGraphSearchSequence.describe(size)
          case 'search-value': return CompactedDeBruijnGraphSearchByValueSequence.describe(size)
          case 'inspect-storage': return CompactedDeBruijnGraphInspectStorageSequence.describe(size)
          case 'clear': return CompactedDeBruijnGraphClearSequence.describe(size)
          case 'breadth-first': return CompactedDeBruijnGraphBreadthFirstSequence.describe(size)
          case 'depth-first': return CompactedDeBruijnGraphDepthFirstSequence.describe(size)
        }
        break
      case 'address-space-graph':
        switch (action) {
          case 'add-vertex': return AddressSpaceGraphAddNodeSequence.describe(size)
          case 'add-edge': return AddressSpaceGraphAddReferenceSequence.describe(size)
          case 'remove-edge': return AddressSpaceGraphRemoveReferenceSequence.describe(size)
          case 'delete-value': return AddressSpaceGraphDeleteNodeSequence.describe(size)
          case 'search-value': return AddressSpaceGraphSearchByValueSequence.describe(size)
          case 'browse-node': return AddressSpaceGraphBrowseSequence.describe(size)
          case 'inspect-storage': return AddressSpaceGraphInspectStorageSequence.describe(size)
          case 'clear': return AddressSpaceGraphClearSequence.describe(size)
          case 'breadth-first': return AddressSpaceGraphBreadthFirstSequence.describe(size)
          case 'depth-first': return AddressSpaceGraphDepthFirstSequence.describe(size)
        }
        break
    }
    return null
  }
}
