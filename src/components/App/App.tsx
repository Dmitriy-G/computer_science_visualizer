import { GraphCatalog } from '../../visualization/GraphCatalog.ts'
import { GraphFeatures } from '../StructureFeatures/GraphFeatures.tsx'
import { GraphTraversalFeatures } from '../DataStructuresAlgorithms/GraphsTraversal/GraphTraversalFeatures.tsx'
import { HeapFeatures } from '../FundamentalDataStructures/QueuePriority/Heap/HeapFeatures.tsx'
import type { GraphModel } from '../../visualization/GraphModel.ts'
import { HashMap } from '../FundamentalDataStructures/HashBased/HashMap/HashMap.ts'
import HashMapInsert from '../FundamentalDataStructures/HashBased/HashMap/Insert/Insert.tsx'
import { InsertAnimation as HashMapInsertSequence } from '../FundamentalDataStructures/HashBased/HashMap/Insert/InsertAnimation.ts'
import HashMapSearchByKey from '../FundamentalDataStructures/HashBased/HashMap/SearchByKey/SearchByKey.tsx'
import { SearchByKeyAnimation as HashMapSearchByKeySequence } from '../FundamentalDataStructures/HashBased/HashMap/SearchByKey/SearchByKeyAnimation.ts'
import HashMapDeleteByKey from '../FundamentalDataStructures/HashBased/HashMap/DeleteByKey/DeleteByKey.tsx'
import { DeleteByKeyAnimation as HashMapDeleteByKeySequence } from '../FundamentalDataStructures/HashBased/HashMap/DeleteByKey/DeleteByKeyAnimation.ts'
import HashMapClear from '../FundamentalDataStructures/HashBased/HashMap/Clear/Clear.tsx'
import { ClearAnimation as HashMapClearSequence } from '../FundamentalDataStructures/HashBased/HashMap/Clear/ClearAnimation.ts'
import { HashSet } from '../FundamentalDataStructures/SetUnion/HashSet/HashSet.ts'
import HashSetAdd from '../FundamentalDataStructures/SetUnion/HashSet/Add/Add.tsx'
import { AddAnimation as HashSetAddSequence } from '../FundamentalDataStructures/SetUnion/HashSet/Add/AddAnimation.ts'
import HashSetContains from '../FundamentalDataStructures/SetUnion/HashSet/Contains/Contains.tsx'
import { ContainsAnimation as HashSetContainsSequence } from '../FundamentalDataStructures/SetUnion/HashSet/Contains/ContainsAnimation.ts'
import HashSetRemove from '../FundamentalDataStructures/SetUnion/HashSet/Remove/Remove.tsx'
import { RemoveAnimation as HashSetRemoveSequence } from '../FundamentalDataStructures/SetUnion/HashSet/Remove/RemoveAnimation.ts'
import HashSetClear from '../FundamentalDataStructures/SetUnion/HashSet/Clear/Clear.tsx'
import { ClearAnimation as HashSetClearSequence } from '../FundamentalDataStructures/SetUnion/HashSet/Clear/ClearAnimation.ts'
import { BloomFilter } from '../AdvancedDataStructures/Probabilistic/BloomFilter/BloomFilter.ts'
import BloomFilterAdd from '../AdvancedDataStructures/Probabilistic/BloomFilter/Add/Add.tsx'
import { AddAnimation as BloomFilterAddSequence } from '../AdvancedDataStructures/Probabilistic/BloomFilter/Add/AddAnimation.ts'
import BloomFilterCheckMembership from '../AdvancedDataStructures/Probabilistic/BloomFilter/CheckMembership/CheckMembership.tsx'
import { CheckMembershipAnimation as BloomFilterCheckMembershipSequence } from '../AdvancedDataStructures/Probabilistic/BloomFilter/CheckMembership/CheckMembershipAnimation.ts'
import BloomFilterClear from '../AdvancedDataStructures/Probabilistic/BloomFilter/Clear/Clear.tsx'
import { ClearAnimation as BloomFilterClearSequence } from '../AdvancedDataStructures/Probabilistic/BloomFilter/Clear/ClearAnimation.ts'
import { AVLTree } from '../FundamentalDataStructures/Trees/AVLTree/AVLTree.ts'
import AVLTreeInsert from '../FundamentalDataStructures/Trees/AVLTree/Insert/Insert.tsx'
import { InsertionAnimation as AVLTreeInsertSequence } from '../FundamentalDataStructures/Trees/AVLTree/Insert/InsertionAnimation.ts'
import AVLTreeSearchByKey from '../FundamentalDataStructures/Trees/AVLTree/SearchByKey/SearchByKey.tsx'
import { SearchAnimation as AVLTreeSearchByKeySequence } from '../FundamentalDataStructures/Trees/AVLTree/SearchByKey/SearchAnimation.ts'
import AVLTreeDeleteByKey from '../FundamentalDataStructures/Trees/AVLTree/DeleteByKey/DeleteByKey.tsx'
import { DeletionAnimation as AVLTreeDeleteByKeySequence } from '../FundamentalDataStructures/Trees/AVLTree/DeleteByKey/DeletionAnimation.ts'
import AVLTreeClear from '../FundamentalDataStructures/Trees/AVLTree/Clear/Clear.tsx'
import { ClearAnimation as AVLTreeClearSequence } from '../FundamentalDataStructures/Trees/AVLTree/Clear/ClearAnimation.ts'
import { RedBlackTree } from '../FundamentalDataStructures/Trees/RedBlackTree/RedBlackTree.ts'
import RedBlackTreeInsert from '../FundamentalDataStructures/Trees/RedBlackTree/Insert/Insert.tsx'
import { InsertionAnimation as RedBlackTreeInsertSequence } from '../FundamentalDataStructures/Trees/RedBlackTree/Insert/InsertionAnimation.ts'
import RedBlackTreeSearchByKey from '../FundamentalDataStructures/Trees/RedBlackTree/SearchByKey/SearchByKey.tsx'
import { SearchAnimation as RedBlackTreeSearchByKeySequence } from '../FundamentalDataStructures/Trees/RedBlackTree/SearchByKey/SearchAnimation.ts'
import RedBlackTreeDeleteByKey from '../FundamentalDataStructures/Trees/RedBlackTree/DeleteByKey/DeleteByKey.tsx'
import { DeletionAnimation as RedBlackTreeDeleteByKeySequence } from '../FundamentalDataStructures/Trees/RedBlackTree/DeleteByKey/DeletionAnimation.ts'
import RedBlackTreeClear from '../FundamentalDataStructures/Trees/RedBlackTree/Clear/Clear.tsx'
import { ClearAnimation as RedBlackTreeClearSequence } from '../FundamentalDataStructures/Trees/RedBlackTree/Clear/ClearAnimation.ts'
import { BTree } from '../AdvancedDataStructures/MultiwayTrees/BTree/BTree.ts'
import BTreeInsert from '../AdvancedDataStructures/MultiwayTrees/BTree/Insert/Insert.tsx'
import { InsertionAnimation as BTreeInsertSequence } from '../AdvancedDataStructures/MultiwayTrees/BTree/Insert/InsertionAnimation.ts'
import BTreeSearchByKey from '../AdvancedDataStructures/MultiwayTrees/BTree/SearchByKey/SearchByKey.tsx'
import { SearchAnimation as BTreeSearchByKeySequence } from '../AdvancedDataStructures/MultiwayTrees/BTree/SearchByKey/SearchAnimation.ts'
import BTreeDeleteByKey from '../AdvancedDataStructures/MultiwayTrees/BTree/DeleteByKey/DeleteByKey.tsx'
import { DeletionAnimation as BTreeDeleteByKeySequence } from '../AdvancedDataStructures/MultiwayTrees/BTree/DeleteByKey/DeletionAnimation.ts'
import BTreeClear from '../AdvancedDataStructures/MultiwayTrees/BTree/Clear/Clear.tsx'
import { ClearAnimation as BTreeClearSequence } from '../AdvancedDataStructures/MultiwayTrees/BTree/Clear/ClearAnimation.ts'
import { BPlusTree } from '../AdvancedDataStructures/MultiwayTrees/BPlusTree/BPlusTree.ts'
import BPlusTreeInsert from '../AdvancedDataStructures/MultiwayTrees/BPlusTree/Insert/Insert.tsx'
import { InsertionAnimation as BPlusTreeInsertSequence } from '../AdvancedDataStructures/MultiwayTrees/BPlusTree/Insert/InsertionAnimation.ts'
import BPlusTreeSearchByKey from '../AdvancedDataStructures/MultiwayTrees/BPlusTree/SearchByKey/SearchByKey.tsx'
import { SearchAnimation as BPlusTreeSearchByKeySequence } from '../AdvancedDataStructures/MultiwayTrees/BPlusTree/SearchByKey/SearchAnimation.ts'
import BPlusTreeDeleteByKey from '../AdvancedDataStructures/MultiwayTrees/BPlusTree/DeleteByKey/DeleteByKey.tsx'
import { DeletionAnimation as BPlusTreeDeleteByKeySequence } from '../AdvancedDataStructures/MultiwayTrees/BPlusTree/DeleteByKey/DeletionAnimation.ts'
import BPlusTreeClear from '../AdvancedDataStructures/MultiwayTrees/BPlusTree/Clear/Clear.tsx'
import { ClearAnimation as BPlusTreeClearSequence } from '../AdvancedDataStructures/MultiwayTrees/BPlusTree/Clear/ClearAnimation.ts'
import BPlusTreeRangeFromKey from '../AdvancedDataStructures/MultiwayTrees/BPlusTree/RangeFromKey/RangeFromKey.tsx'
import { RangeAnimation as BPlusTreeRangeFromKeySequence } from '../AdvancedDataStructures/MultiwayTrees/BPlusTree/RangeFromKey/RangeAnimation.ts'
import ArrayClear from '../FundamentalDataStructures/Linear/Array/Clear/Clear.tsx'
import BubbleSorting from '../DataStructuresAlgorithms/Sorting/Array/BubbleSorting/BubbleSorting.tsx'
import { BubbleSortingAnimation } from '../DataStructuresAlgorithms/Sorting/Array/BubbleSorting/BubbleSortingAnimation.ts'
import SelectionSort from '../DataStructuresAlgorithms/Sorting/Array/SelectionSort/SelectionSort.tsx'
import { SelectionSortAnimation } from '../DataStructuresAlgorithms/Sorting/Array/SelectionSort/SelectionSortAnimation.ts'
import InsertionSort from '../DataStructuresAlgorithms/Sorting/Array/InsertionSort/InsertionSort.tsx'
import { InsertionSortAnimation } from '../DataStructuresAlgorithms/Sorting/Array/InsertionSort/InsertionSortAnimation.ts'
import BinaryInsertionSort from '../DataStructuresAlgorithms/Sorting/Array/BinaryInsertionSort/BinaryInsertionSort.tsx'
import { BinaryInsertionSortAnimation } from '../DataStructuresAlgorithms/Sorting/Array/BinaryInsertionSort/BinaryInsertionSortAnimation.ts'
import MergeSort from '../DataStructuresAlgorithms/Sorting/Array/MergeSort/MergeSort.tsx'
import { MergeSortAnimation } from '../DataStructuresAlgorithms/Sorting/Array/MergeSort/MergeSortAnimation.ts'
import QuickSort from '../DataStructuresAlgorithms/Sorting/Array/QuickSort/QuickSort.tsx'
import { QuickSortAnimation } from '../DataStructuresAlgorithms/Sorting/Array/QuickSort/QuickSortAnimation.ts'
import HeapSort from '../DataStructuresAlgorithms/Sorting/Array/HeapSort/HeapSort.tsx'
import { HeapSortAnimation } from '../DataStructuresAlgorithms/Sorting/Array/HeapSort/HeapSortAnimation.ts'
import ShellSort from '../DataStructuresAlgorithms/Sorting/Array/ShellSort/ShellSort.tsx'
import { ShellSortAnimation } from '../DataStructuresAlgorithms/Sorting/Array/ShellSort/ShellSortAnimation.ts'
import CountingSort from '../DataStructuresAlgorithms/Sorting/Array/CountingSort/CountingSort.tsx'
import { CountingSortAnimation } from '../DataStructuresAlgorithms/Sorting/Array/CountingSort/CountingSortAnimation.ts'
import RadixSort from '../DataStructuresAlgorithms/Sorting/Array/RadixSort/RadixSort.tsx'
import { RadixSortAnimation } from '../DataStructuresAlgorithms/Sorting/Array/RadixSort/RadixSortAnimation.ts'
import BucketSort from '../DataStructuresAlgorithms/Sorting/Array/BucketSort/BucketSort.tsx'
import { BucketSortAnimation } from '../DataStructuresAlgorithms/Sorting/Array/BucketSort/BucketSortAnimation.ts'
import TimSort from '../DataStructuresAlgorithms/Sorting/Array/TimSort/TimSort.tsx'
import { TimSortAnimation } from '../DataStructuresAlgorithms/Sorting/Array/TimSort/TimSortAnimation.ts'
import IntroSort from '../DataStructuresAlgorithms/Sorting/Array/IntroSort/IntroSort.tsx'
import { IntroSortAnimation } from '../DataStructuresAlgorithms/Sorting/Array/IntroSort/IntroSortAnimation.ts'
import DualPivotQuickSort from '../DataStructuresAlgorithms/Sorting/Array/DualPivotQuickSort/DualPivotQuickSort.tsx'
import { DualPivotQuickSortAnimation } from '../DataStructuresAlgorithms/Sorting/Array/DualPivotQuickSort/DualPivotQuickSortAnimation.ts'
import BlockMergeSort from '../DataStructuresAlgorithms/Sorting/Array/BlockMergeSort/BlockMergeSort.tsx'
import { BlockMergeSortAnimation } from '../DataStructuresAlgorithms/Sorting/Array/BlockMergeSort/BlockMergeSortAnimation.ts'
import WikiSort from '../DataStructuresAlgorithms/Sorting/Array/WikiSort/WikiSort.tsx'
import { WikiSortAnimation } from '../DataStructuresAlgorithms/Sorting/Array/WikiSort/WikiSortAnimation.ts'
import Smoothsort from '../DataStructuresAlgorithms/Sorting/Array/Smoothsort/Smoothsort.tsx'
import { SmoothsortAnimation } from '../DataStructuresAlgorithms/Sorting/Array/Smoothsort/SmoothsortAnimation.ts'
import TreeSort from '../DataStructuresAlgorithms/Sorting/Array/TreeSort/TreeSort.tsx'
import { TreeSortAnimation } from '../DataStructuresAlgorithms/Sorting/Array/TreeSort/TreeSortAnimation.ts'
import TournamentSort from '../DataStructuresAlgorithms/Sorting/Array/TournamentSort/TournamentSort.tsx'
import { TournamentSortAnimation } from '../DataStructuresAlgorithms/Sorting/Array/TournamentSort/TournamentSortAnimation.ts'
import PatienceSort from '../DataStructuresAlgorithms/Sorting/Array/PatienceSort/PatienceSort.tsx'
import { PatienceSortAnimation } from '../DataStructuresAlgorithms/Sorting/Array/PatienceSort/PatienceSortAnimation.ts'
import CycleSort from '../DataStructuresAlgorithms/Sorting/Array/CycleSort/CycleSort.tsx'
import { CycleSortAnimation } from '../DataStructuresAlgorithms/Sorting/Array/CycleSort/CycleSortAnimation.ts'
import CombSort from '../DataStructuresAlgorithms/Sorting/Array/CombSort/CombSort.tsx'
import { CombSortAnimation } from '../DataStructuresAlgorithms/Sorting/Array/CombSort/CombSortAnimation.ts'
import CocktailShakerSort from '../DataStructuresAlgorithms/Sorting/Array/CocktailShakerSort/CocktailShakerSort.tsx'
import { CocktailShakerSortAnimation } from '../DataStructuresAlgorithms/Sorting/Array/CocktailShakerSort/CocktailShakerSortAnimation.ts'
import GnomeSort from '../DataStructuresAlgorithms/Sorting/Array/GnomeSort/GnomeSort.tsx'
import { GnomeSortAnimation } from '../DataStructuresAlgorithms/Sorting/Array/GnomeSort/GnomeSortAnimation.ts'
import OddEvenSort from '../DataStructuresAlgorithms/Sorting/Array/OddEvenSort/OddEvenSort.tsx'
import { OddEvenSortAnimation } from '../DataStructuresAlgorithms/Sorting/Array/OddEvenSort/OddEvenSortAnimation.ts'
import OddEvenMergeSort from '../DataStructuresAlgorithms/Sorting/Array/OddEvenMergeSort/OddEvenMergeSort.tsx'
import { OddEvenMergeSortAnimation } from '../DataStructuresAlgorithms/Sorting/Array/OddEvenMergeSort/OddEvenMergeSortAnimation.ts'
import BitonicSort from '../DataStructuresAlgorithms/Sorting/Array/BitonicSort/BitonicSort.tsx'
import { BitonicSortAnimation } from '../DataStructuresAlgorithms/Sorting/Array/BitonicSort/BitonicSortAnimation.ts'
import PairwiseSortingNetwork from '../DataStructuresAlgorithms/Sorting/Array/PairwiseSortingNetwork/PairwiseSortingNetwork.tsx'
import { PairwiseSortingNetworkAnimation } from '../DataStructuresAlgorithms/Sorting/Array/PairwiseSortingNetwork/PairwiseSortingNetworkAnimation.ts'
import SampleSort from '../DataStructuresAlgorithms/Sorting/Array/SampleSort/SampleSort.tsx'
import { SampleSortAnimation } from '../DataStructuresAlgorithms/Sorting/Array/SampleSort/SampleSortAnimation.ts'
import ParallelMergeSort from '../DataStructuresAlgorithms/Sorting/Array/ParallelMergeSort/ParallelMergeSort.tsx'
import { ParallelMergeSortAnimation } from '../DataStructuresAlgorithms/Sorting/Array/ParallelMergeSort/ParallelMergeSortAnimation.ts'
import ParallelQuickSort from '../DataStructuresAlgorithms/Sorting/Array/ParallelQuickSort/ParallelQuickSort.tsx'
import { ParallelQuickSortAnimation } from '../DataStructuresAlgorithms/Sorting/Array/ParallelQuickSort/ParallelQuickSortAnimation.ts'
import ExternalMergeSort from '../DataStructuresAlgorithms/Sorting/Array/ExternalMergeSort/ExternalMergeSort.tsx'
import { ExternalMergeSortAnimation } from '../DataStructuresAlgorithms/Sorting/Array/ExternalMergeSort/ExternalMergeSortAnimation.ts'
import PolyphaseMergeSort from '../DataStructuresAlgorithms/Sorting/Array/PolyphaseMergeSort/PolyphaseMergeSort.tsx'
import { PolyphaseMergeSortAnimation } from '../DataStructuresAlgorithms/Sorting/Array/PolyphaseMergeSort/PolyphaseMergeSortAnimation.ts'
import NaturalMergeSort from '../DataStructuresAlgorithms/Sorting/Array/NaturalMergeSort/NaturalMergeSort.tsx'
import { NaturalMergeSortAnimation } from '../DataStructuresAlgorithms/Sorting/Array/NaturalMergeSort/NaturalMergeSortAnimation.ts'
import Flashsort from '../DataStructuresAlgorithms/Sorting/Array/Flashsort/Flashsort.tsx'
import { FlashsortAnimation } from '../DataStructuresAlgorithms/Sorting/Array/Flashsort/FlashsortAnimation.ts'
import AmericanFlagSort from '../DataStructuresAlgorithms/Sorting/Array/AmericanFlagSort/AmericanFlagSort.tsx'
import { AmericanFlagSortAnimation } from '../DataStructuresAlgorithms/Sorting/Array/AmericanFlagSort/AmericanFlagSortAnimation.ts'
import Spreadsort from '../DataStructuresAlgorithms/Sorting/Array/Spreadsort/Spreadsort.tsx'
import { SpreadsortAnimation } from '../DataStructuresAlgorithms/Sorting/Array/Spreadsort/SpreadsortAnimation.ts'
import Burstsort from '../DataStructuresAlgorithms/Sorting/Array/Burstsort/Burstsort.tsx'
import { BurstsortAnimation } from '../DataStructuresAlgorithms/Sorting/Array/Burstsort/BurstsortAnimation.ts'
import PigeonholeSort from '../DataStructuresAlgorithms/Sorting/Array/PigeonholeSort/PigeonholeSort.tsx'
import { PigeonholeSortAnimation } from '../DataStructuresAlgorithms/Sorting/Array/PigeonholeSort/PigeonholeSortAnimation.ts'
import InterpolationSort from '../DataStructuresAlgorithms/Sorting/Array/InterpolationSort/InterpolationSort.tsx'
import { InterpolationSortAnimation } from '../DataStructuresAlgorithms/Sorting/Array/InterpolationSort/InterpolationSortAnimation.ts'
import LibrarySort from '../DataStructuresAlgorithms/Sorting/Array/LibrarySort/LibrarySort.tsx'
import { LibrarySortAnimation } from '../DataStructuresAlgorithms/Sorting/Array/LibrarySort/LibrarySortAnimation.ts'
import SplaySort from '../DataStructuresAlgorithms/Sorting/Array/SplaySort/SplaySort.tsx'
import { SplaySortAnimation } from '../DataStructuresAlgorithms/Sorting/Array/SplaySort/SplaySortAnimation.ts'
import StrandSort from '../DataStructuresAlgorithms/Sorting/Array/StrandSort/StrandSort.tsx'
import { StrandSortAnimation } from '../DataStructuresAlgorithms/Sorting/Array/StrandSort/StrandSortAnimation.ts'
import PancakeSort from '../DataStructuresAlgorithms/Sorting/Array/PancakeSort/PancakeSort.tsx'
import { PancakeSortAnimation } from '../DataStructuresAlgorithms/Sorting/Array/PancakeSort/PancakeSortAnimation.ts'
import StoogeSort from '../DataStructuresAlgorithms/Sorting/Array/StoogeSort/StoogeSort.tsx'
import { StoogeSortAnimation } from '../DataStructuresAlgorithms/Sorting/Array/StoogeSort/StoogeSortAnimation.ts'
import SlowSort from '../DataStructuresAlgorithms/Sorting/Array/SlowSort/SlowSort.tsx'
import { SlowSortAnimation } from '../DataStructuresAlgorithms/Sorting/Array/SlowSort/SlowSortAnimation.ts'
import BogoSort from '../DataStructuresAlgorithms/Sorting/Array/BogoSort/BogoSort.tsx'
import { BogoSortAnimation } from '../DataStructuresAlgorithms/Sorting/Array/BogoSort/BogoSortAnimation.ts'
import SleepSort from '../DataStructuresAlgorithms/Sorting/Array/SleepSort/SleepSort.tsx'
import { SleepSortAnimation } from '../DataStructuresAlgorithms/Sorting/Array/SleepSort/SleepSortAnimation.ts'
import { ClearAnimation as ArrayClearSequence } from '../FundamentalDataStructures/Linear/Array/Clear/ClearAnimation.ts'
import LinkedListClear from '../FundamentalDataStructures/Linear/LinkedList/Clear/Clear.tsx'
import { ClearAnimation as LinkedListClearSequence } from '../FundamentalDataStructures/Linear/LinkedList/Clear/ClearAnimation.ts'
import BinaryTreeClear from '../FundamentalDataStructures/Trees/BinaryTree/Clear/Clear.tsx'
import { ClearAnimation as BinaryTreeClearSequence } from '../FundamentalDataStructures/Trees/BinaryTree/Clear/ClearAnimation.ts'
import { Queue } from '../FundamentalDataStructures/QueuePriority/Queue/Queue.ts'
import QueueEnqueue from '../FundamentalDataStructures/QueuePriority/Queue/Enqueue/Enqueue.tsx'
import { InsertionAnimation as QueueEnqueueSequence } from '../FundamentalDataStructures/QueuePriority/Queue/Enqueue/InsertionAnimation.ts'
import QueueDequeue from '../FundamentalDataStructures/QueuePriority/Queue/Dequeue/Dequeue.tsx'
import { RemovalAnimation as QueueDequeueSequence } from '../FundamentalDataStructures/QueuePriority/Queue/Dequeue/RemovalAnimation.ts'
import QueuePeek from '../FundamentalDataStructures/QueuePriority/Queue/Peek/Peek.tsx'
import { PeekAnimation as QueuePeekSequence } from '../FundamentalDataStructures/QueuePriority/Queue/Peek/PeekAnimation.ts'
import QueueClear from '../FundamentalDataStructures/QueuePriority/Queue/Clear/Clear.tsx'
import { ClearAnimation as QueueClearSequence } from '../FundamentalDataStructures/QueuePriority/Queue/Clear/ClearAnimation.ts'
import QueueSearchByValue from '../FundamentalDataStructures/QueuePriority/Queue/SearchByValue/SearchByValue.tsx'
import { SearchAnimation as QueueSearchByValueSequence } from '../FundamentalDataStructures/QueuePriority/Queue/SearchByValue/SearchAnimation.ts'
import { Deque } from '../FundamentalDataStructures/QueuePriority/Deque/Deque.ts'
import DequePushFront from '../FundamentalDataStructures/QueuePriority/Deque/PushFront/PushFront.tsx'
import { InsertionAnimation as DequePushFrontSequence } from '../FundamentalDataStructures/QueuePriority/Deque/PushFront/InsertionAnimation.ts'
import DequePushBack from '../FundamentalDataStructures/QueuePriority/Deque/PushBack/PushBack.tsx'
import { InsertionAnimation as DequePushBackSequence } from '../FundamentalDataStructures/QueuePriority/Deque/PushBack/InsertionAnimation.ts'
import DequePopFront from '../FundamentalDataStructures/QueuePriority/Deque/PopFront/PopFront.tsx'
import { RemovalAnimation as DequePopFrontSequence } from '../FundamentalDataStructures/QueuePriority/Deque/PopFront/RemovalAnimation.ts'
import DequePopBack from '../FundamentalDataStructures/QueuePriority/Deque/PopBack/PopBack.tsx'
import { RemovalAnimation as DequePopBackSequence } from '../FundamentalDataStructures/QueuePriority/Deque/PopBack/RemovalAnimation.ts'
import DequePeekFront from '../FundamentalDataStructures/QueuePriority/Deque/PeekFront/PeekFront.tsx'
import { PeekAnimation as DequePeekFrontSequence } from '../FundamentalDataStructures/QueuePriority/Deque/PeekFront/PeekAnimation.ts'
import DequePeekBack from '../FundamentalDataStructures/QueuePriority/Deque/PeekBack/PeekBack.tsx'
import { PeekAnimation as DequePeekBackSequence } from '../FundamentalDataStructures/QueuePriority/Deque/PeekBack/PeekAnimation.ts'
import DequeClear from '../FundamentalDataStructures/QueuePriority/Deque/Clear/Clear.tsx'
import { ClearAnimation as DequeClearSequence } from '../FundamentalDataStructures/QueuePriority/Deque/Clear/ClearAnimation.ts'
import DequeSearchByValue from '../FundamentalDataStructures/QueuePriority/Deque/SearchByValue/SearchByValue.tsx'
import { SearchAnimation as DequeSearchByValueSequence } from '../FundamentalDataStructures/QueuePriority/Deque/SearchByValue/SearchAnimation.ts'
import { DoublyLinkedList } from '../FundamentalDataStructures/Linear/DoublyLinkedList/DoublyLinkedList.ts'
import DoublyLinkedListAddInTheMiddle from '../FundamentalDataStructures/Linear/DoublyLinkedList/AddInTheMiddle/AddInTheMiddle.tsx'
import { InsertionAnimation as DoublyLinkedListAddInTheMiddleSequence } from '../FundamentalDataStructures/Linear/DoublyLinkedList/AddInTheMiddle/InsertionAnimation.ts'
import DoublyLinkedListAddAtStart from '../FundamentalDataStructures/Linear/DoublyLinkedList/AddAtStart/AddAtStart.tsx'
import { InsertionAnimation as DoublyLinkedListAddAtStartSequence } from '../FundamentalDataStructures/Linear/DoublyLinkedList/AddAtStart/InsertionAnimation.ts'
import DoublyLinkedListAddAtEnd from '../FundamentalDataStructures/Linear/DoublyLinkedList/AddAtEnd/AddAtEnd.tsx'
import { InsertionAnimation as DoublyLinkedListAddAtEndSequence } from '../FundamentalDataStructures/Linear/DoublyLinkedList/AddAtEnd/InsertionAnimation.ts'
import DoublyLinkedListDeleteAtStart from '../FundamentalDataStructures/Linear/DoublyLinkedList/DeleteAtStart/DeleteAtStart.tsx'
import { RemovalAnimation as DoublyLinkedListDeleteAtStartSequence } from '../FundamentalDataStructures/Linear/DoublyLinkedList/DeleteAtStart/RemovalAnimation.ts'
import DoublyLinkedListDeleteAtEnd from '../FundamentalDataStructures/Linear/DoublyLinkedList/DeleteAtEnd/DeleteAtEnd.tsx'
import { RemovalAnimation as DoublyLinkedListDeleteAtEndSequence } from '../FundamentalDataStructures/Linear/DoublyLinkedList/DeleteAtEnd/RemovalAnimation.ts'
import DoublyLinkedListDeleteByValue from '../FundamentalDataStructures/Linear/DoublyLinkedList/DeleteByValue/DeleteByValue.tsx'
import { RemovalAnimation as DoublyLinkedListDeleteByValueSequence } from '../FundamentalDataStructures/Linear/DoublyLinkedList/DeleteByValue/RemovalAnimation.ts'
import DoublyLinkedListSearchByValue from '../FundamentalDataStructures/Linear/DoublyLinkedList/SearchByValue/SearchByValue.tsx'
import { SearchAnimation as DoublyLinkedListSearchByValueSequence } from '../FundamentalDataStructures/Linear/DoublyLinkedList/SearchByValue/SearchAnimation.ts'
import DoublyLinkedListSearchByIndex from '../FundamentalDataStructures/Linear/DoublyLinkedList/SearchByIndex/SearchByIndex.tsx'
import { SearchAnimation as DoublyLinkedListSearchByIndexSequence } from '../FundamentalDataStructures/Linear/DoublyLinkedList/SearchByIndex/SearchAnimation.ts'
import DoublyLinkedListClear from '../FundamentalDataStructures/Linear/DoublyLinkedList/Clear/Clear.tsx'
import { ClearAnimation as DoublyLinkedListClearSequence } from '../FundamentalDataStructures/Linear/DoublyLinkedList/Clear/ClearAnimation.ts'
import { CircularBuffer } from '../FundamentalDataStructures/QueuePriority/CircularBuffer/CircularBuffer.ts'
import CircularBufferEnqueue from '../FundamentalDataStructures/QueuePriority/CircularBuffer/Enqueue/Enqueue.tsx'
import { EnqueueAnimation as CircularBufferEnqueueSequence } from '../FundamentalDataStructures/QueuePriority/CircularBuffer/Enqueue/EnqueueAnimation.ts'
import CircularBufferDequeue from '../FundamentalDataStructures/QueuePriority/CircularBuffer/Dequeue/Dequeue.tsx'
import { DequeueAnimation as CircularBufferDequeueSequence } from '../FundamentalDataStructures/QueuePriority/CircularBuffer/Dequeue/DequeueAnimation.ts'
import CircularBufferPeek from '../FundamentalDataStructures/QueuePriority/CircularBuffer/Peek/Peek.tsx'
import { PeekAnimation as CircularBufferPeekSequence } from '../FundamentalDataStructures/QueuePriority/CircularBuffer/Peek/PeekAnimation.ts'
import CircularBufferClear from '../FundamentalDataStructures/QueuePriority/CircularBuffer/Clear/Clear.tsx'
import { ClearAnimation as CircularBufferClearSequence } from '../FundamentalDataStructures/QueuePriority/CircularBuffer/Clear/ClearAnimation.ts'
import CircularBufferSearchByValue from '../FundamentalDataStructures/QueuePriority/CircularBuffer/SearchByValue/SearchByValue.tsx'
import { SearchAnimation as CircularBufferSearchByValueSequence } from '../FundamentalDataStructures/QueuePriority/CircularBuffer/SearchByValue/SearchAnimation.ts'
import { Stack } from '../FundamentalDataStructures/Linear/Stack/Stack.ts'
import StackPush from '../FundamentalDataStructures/Linear/Stack/Push/Push.tsx'
import { PushAnimation as StackPushSequence } from '../FundamentalDataStructures/Linear/Stack/Push/PushAnimation.ts'
import StackPop from '../FundamentalDataStructures/Linear/Stack/Pop/Pop.tsx'
import { PopAnimation as StackPopSequence } from '../FundamentalDataStructures/Linear/Stack/Pop/PopAnimation.ts'
import StackPeek from '../FundamentalDataStructures/Linear/Stack/Peek/Peek.tsx'
import { PeekAnimation as StackPeekSequence } from '../FundamentalDataStructures/Linear/Stack/Peek/PeekAnimation.ts'
import StackClear from '../FundamentalDataStructures/Linear/Stack/Clear/Clear.tsx'
import { ClearAnimation as StackClearSequence } from '../FundamentalDataStructures/Linear/Stack/Clear/ClearAnimation.ts'
import StackSearchByValue from '../FundamentalDataStructures/Linear/Stack/SearchByValue/SearchByValue.tsx'
import { SearchAnimation as StackSearchByValueSequence } from '../FundamentalDataStructures/Linear/Stack/SearchByValue/SearchAnimation.ts'
import type { ReactNode } from 'react'
import { ActionCatalog } from '../../visualization/ActionCatalog.ts'
import { AlgorithmTechnologyCatalog } from '../../visualization/AlgorithmTechnologyCatalog.ts'
import type { ActionKind, ActionScope } from '../../visualization/ActionCatalog.ts'
import { Graph } from '../FundamentalDataStructures/Graphs/SimpleGraph/Graph.ts'
import BinaryTreeDeleteByKey from '../FundamentalDataStructures/Trees/BinaryTree/DeleteByKey/DeleteByKey.tsx'
import { DeletionAnimation as BinaryTreeDeleteByKeySequence } from '../FundamentalDataStructures/Trees/BinaryTree/DeleteByKey/DeletionAnimation.ts'
import BinaryTreeSearchByKey from '../FundamentalDataStructures/Trees/BinaryTree/SearchByKey/SearchByKey.tsx'
import { SearchAnimation as BinaryTreeSearchByKeySequence } from '../FundamentalDataStructures/Trees/BinaryTree/SearchByKey/SearchAnimation.ts'
import ArrayDeleteByValue from '../FundamentalDataStructures/Linear/Array/DeleteByValue/DeleteByValue.tsx'
import { DeletionAnimation as ArrayDeleteByValueSequence } from '../FundamentalDataStructures/Linear/Array/DeleteByValue/DeletionAnimation.ts'
import ArraySearchByValue from '../FundamentalDataStructures/Linear/Array/SearchByValue/SearchByValue.tsx'
import { SearchAnimation as ArraySearchByValueSequence } from '../FundamentalDataStructures/Linear/Array/SearchByValue/SearchAnimation.ts'
import ArraySearchByIndex from '../FundamentalDataStructures/Linear/Array/SearchByIndex/SearchByIndex.tsx'
import { SearchAnimation as ArraySearchByIndexSequence } from '../FundamentalDataStructures/Linear/Array/SearchByIndex/SearchAnimation.ts'
import ArrayAddAtEnd from '../FundamentalDataStructures/Linear/Array/AddAtEnd/AddAtEnd.tsx'
import { InsertionAnimation as ArrayAddAtEndSequence } from '../FundamentalDataStructures/Linear/Array/AddAtEnd/InsertionAnimation.ts'
import ArrayAddAtStart from '../FundamentalDataStructures/Linear/Array/AddAtStart/AddAtStart.tsx'
import { InsertionAnimation as ArrayAddAtStartSequence } from '../FundamentalDataStructures/Linear/Array/AddAtStart/InsertionAnimation.ts'
import LinkedListDeleteByValue from '../FundamentalDataStructures/Linear/LinkedList/DeleteByValue/DeleteByValue.tsx'
import { DeletionAnimation as LinkedListDeleteByValueSequence } from '../FundamentalDataStructures/Linear/LinkedList/DeleteByValue/DeletionAnimation.ts'
import LinkedListSearchByValue from '../FundamentalDataStructures/Linear/LinkedList/SearchByValue/SearchByValue.tsx'
import { SearchAnimation as LinkedListSearchByValueSequence } from '../FundamentalDataStructures/Linear/LinkedList/SearchByValue/SearchAnimation.ts'
import LinkedListSearchByIndex from '../FundamentalDataStructures/Linear/LinkedList/SearchByIndex/SearchByIndex.tsx'
import { SearchAnimation as LinkedListSearchByIndexSequence } from '../FundamentalDataStructures/Linear/LinkedList/SearchByIndex/SearchAnimation.ts'
import LinkedListAddAtEnd from '../FundamentalDataStructures/Linear/LinkedList/AddAtEnd/AddAtEnd.tsx'
import { InsertionAnimation as LinkedListAddAtEndSequence } from '../FundamentalDataStructures/Linear/LinkedList/AddAtEnd/InsertionAnimation.ts'
import LinkedListAddAtStart from '../FundamentalDataStructures/Linear/LinkedList/AddAtStart/AddAtStart.tsx'
import { InsertionAnimation as LinkedListAddAtStartSequence } from '../FundamentalDataStructures/Linear/LinkedList/AddAtStart/InsertionAnimation.ts'
import { Component, createRef } from 'react'
import { AppViewport } from './AppViewport.ts'
import MainMenu from '../MainMenu/MainMenu.tsx'
import ActionMenu from '../MainMenu/ActionMenu/ActionMenu.tsx'
import AlgorithmInfo from '../AlgorithmInfo/AlgorithmInfo.tsx'
import StructureInfo from '../StructureInfo/StructureInfo.tsx'
import AboutProject from '../AboutProject/AboutProject.tsx'
import ActionInput from '../ActionInput/ActionInput.tsx'
import { ActionInputRequest } from '../../visualization/ActionInputRequest.ts'
import { MenuNavigation } from '../MainMenu/MenuNavigation.ts'
import type { MenuCategoryKind, AlgorithmGroupKind } from '../MainMenu/MenuNavigation.ts'
import type { AdvancedAlgorithmGroupKind } from '../MainMenu/AdvancedAlgorithmCatalog.ts'
import type { MenuSearchResult } from '../MainMenu/Search/MenuSearchIndex.ts'
import type { MenuStructureGroupKind } from '../MainMenu/MenuStructureCatalog.ts'
import Renderer from '../Renderer/Renderer.tsx'
import AddInTheMiddle from '../FundamentalDataStructures/Linear/LinkedList/AddInTheMiddle/AddInTheMiddle.tsx'
import { InsertionAnimation } from '../FundamentalDataStructures/Linear/LinkedList/AddInTheMiddle/InsertionAnimation.ts'
import ArrayAddInTheMiddle from '../FundamentalDataStructures/Linear/Array/AddInTheMiddle/AddInTheMiddle.tsx'
import { InsertionAnimation as ArrayInsertionAnimation } from '../FundamentalDataStructures/Linear/Array/AddInTheMiddle/InsertionAnimation.ts'
import { FixedArray } from '../FundamentalDataStructures/Linear/Array/FixedArray.ts'
import { LinkedList } from '../FundamentalDataStructures/Linear/LinkedList/LinkedList.ts'
import { BinaryTree } from '../FundamentalDataStructures/Trees/BinaryTree/BinaryTree.ts'
import TreeInsert from '../FundamentalDataStructures/Trees/BinaryTree/Insert/Insert.tsx'
import { InsertionAnimation as TreeInsertionAnimation } from '../FundamentalDataStructures/Trees/BinaryTree/Insert/InsertionAnimation.ts'
import { StructureCatalog } from '../../visualization/StructureCatalog.ts'
import type { Scene, StructureKind } from '../../visualization/Scene.ts'
import type { AlgorithmInformation } from '../../visualization/AlgorithmInformation.ts'
import { AdditionalTreeCatalog } from '../../visualization/AdditionalTreeCatalog.ts'
import type { AdditionalTreeModel, TreeInputValues } from '../../visualization/AdditionalTreeModel.ts'
import { TreeFeatures } from '../StructureFeatures/TreeFeatures.tsx'
import { LinearStructureCatalog } from '../../visualization/LinearStructureCatalog.ts'
import { NumericalModel } from '../../visualization/NumericalModel.ts'
import type { LinearModel } from '../../visualization/LinearModel.ts'
import { LinearFeatures } from '../StructureFeatures/LinearFeatures.tsx'
import { PriorityStructureCatalog } from '../../visualization/PriorityStructureCatalog.ts'
import { PriorityModel } from '../../visualization/PriorityModel.ts'
import { PriorityFeatures } from '../StructureFeatures/PriorityFeatures.tsx'
import { RopeFeatures } from '../AdvancedDataStructures/TextSearch/Rope/RopeFeatures.tsx'
import { ProbabilisticStructureCatalog } from '../../visualization/ProbabilisticStructureCatalog.ts'
import { ProbabilisticModel } from '../AdvancedDataStructures/Probabilistic/ProbabilisticModel.ts'
import { ProbabilisticFeatures } from '../StructureFeatures/ProbabilisticFeatures.tsx'
import { HashStructureCatalog } from '../../visualization/HashStructureCatalog.ts'
import { HashTableModel } from '../../visualization/HashTableModel.ts'
import { HashFeatures } from '../StructureFeatures/HashFeatures.tsx'
import { ExtendedGraphCatalog } from '../../visualization/ExtendedGraphCatalog.ts'
import { ExtendedGraphModel } from '../../visualization/ExtendedGraphModel.ts'
import { ExtendedGraphFeatures } from '../StructureFeatures/ExtendedGraphFeatures.tsx'
import { ExtendedGraphTraversalFeatures } from '../DataStructuresAlgorithms/GraphsTraversal/ExtendedGraphTraversalFeatures.tsx'
import './App.css'

interface AppState {
  readonly treeInput: TreeInputValues
  readonly selected: StructureKind | null
  readonly selectedScope: ActionScope
  readonly menuOpen: boolean
  readonly searchOpen: boolean
  readonly aboutOpen: boolean
  readonly menu: MenuNavigation
  readonly scene: Scene | null
  readonly actionOpen: boolean
  readonly selectedAction: ActionKind | null
  readonly actionValue: number | undefined
  readonly actionUpperValue: number | undefined
  readonly actionRunning: boolean
  readonly inputRequest: ActionInputRequest | null
  readonly actionSession: number
  readonly algorithmInformation: AlgorithmInformation | null
  readonly overviewInformation: AlgorithmInformation | null
  readonly structureInformation: StructureKind | null
}

export default class App extends Component<Record<string, never>, AppState> {
  private readonly viewport = new AppViewport()
  private probabilisticModels = ProbabilisticStructureCatalog.createModels()
  private hashModels = HashStructureCatalog.createModels()
  private extendedGraphs = ExtendedGraphCatalog.createModels()
  private priorityModels = PriorityStructureCatalog.createModels()
  private linearModels = LinearStructureCatalog.createModels()
  private additionalTrees = AdditionalTreeCatalog.createModels()
  private list = LinkedList.createDefault()
  private array = FixedArray.createDefault()
  private tree = BinaryTree.createDefault()
  private avlTree = AVLTree.createDefault()
  private redBlackTree = RedBlackTree.createDefault()
  private bTree = BTree.createDefault()
  private bPlusTree = BPlusTree.createDefault()
  private readonly menuButton = createRef<HTMLButtonElement>()
  private readonly searchButton = createRef<HTMLButtonElement>()
  private readonly aboutButton = createRef<HTMLButtonElement>()
  private menuOpenedFromSearch = false
  private readonly actionMenu = createRef<ActionMenu>()
  private graph = Graph.createDefault()
  private graphModels = GraphCatalog.createModels(this.graph)
  private stack = Stack.createDefault()
  private queue = Queue.createDefault()
  private deque = Deque.createDefault()
  private doublyList = DoublyLinkedList.createDefault()
  private buffer = CircularBuffer.createDefault()
  private hashMap = HashMap.createDefault()
  private hashSet = HashSet.createDefault()
  private bloomFilter = BloomFilter.createDefault()

  constructor(props: Record<string, never>) {
    super(props)
    this.state = {
      treeInput: {},
      selected: null,
      selectedScope: 'overview',
      menuOpen: false,
      searchOpen: false,
      aboutOpen: false,
      menu: new MenuNavigation(),
      scene: null,
      actionOpen: false,
      selectedAction: null,
      actionValue: undefined,
      actionUpperValue: undefined,
      actionRunning: false,
      inputRequest: null,
      actionSession: 0,
      algorithmInformation: null,
      overviewInformation: null,
      structureInformation: null,
    }
  }

  public componentDidMount(): void {
    this.viewport.start()
  }

  public componentWillUnmount(): void {
    this.viewport.stop()
  }

  private openMenu = (): void => {
    this.menuOpenedFromSearch = false
    this.setState({
      menuOpen: true,
      searchOpen: false,
      menu: this.state.selected ? MenuNavigation.forStructure(this.state.selected, this.state.selectedScope) : new MenuNavigation(),
    })
  }

  private openSearch = (): void => {
    this.menuOpenedFromSearch = true
    this.setState({ menuOpen: true, searchOpen: true, menu: new MenuNavigation() })
  }

  private closeMenu = (): void => {
    this.setState({ menuOpen: false, searchOpen: false }, this.restoreMenuFocus)
  }

  private openAbout = (): void => {
    this.setState({ aboutOpen: true })
  }

  private closeAbout = (): void => {
    this.setState({ aboutOpen: false }, () => this.aboutButton.current?.focus())
  }

  private restoreMenuFocus = (): void => {
    const trigger = this.menuOpenedFromSearch ? this.searchButton : this.menuButton
    trigger.current?.focus()
  }

  private focusActions = (): void => {
    this.actionMenu.current?.focusFirstAction()
  }

  private selectCategory = (category: MenuCategoryKind): void => {
    this.setState({ menu: this.state.menu.selectCategory(category) })
  }

  private selectAlgorithmGroup = (group: AlgorithmGroupKind): void => {
    this.setState({ menu: this.state.menu.selectAlgorithmGroup(group) })
  }

  private selectAdvancedAlgorithmGroup = (group: AdvancedAlgorithmGroupKind): void => {
    this.setState({ menu: this.state.menu.selectAdvancedAlgorithmGroup(group) })
  }

  private selectGroup = (group: MenuStructureGroupKind): void => {
    this.setState({ menu: this.state.menu.selectGroup(group) })
  }

  private backInMenu = (): void => {
    this.setState({ menu: this.state.menu.back() })
  }

  private selectStructure = (kind: StructureKind): void => {
    const menu = this.state.menu.selectStructure(kind)
    this.loadStructure(kind, menu)
  }

  private selectSearchResult = (result: MenuSearchResult): void => {
    const menu = MenuNavigation.forStructure(result.structure, result.scope)
    this.loadStructure(result.structure, menu, result.action)
  }

  private loadStructure(kind: StructureKind, menu: MenuNavigation, action?: ActionKind): void {
    const changingScope = this.state.selected === kind && this.state.selectedScope !== menu.actionScope
    if (!changingScope) {
      this.probabilisticModels = ProbabilisticStructureCatalog.createModels()
      this.hashModels = HashStructureCatalog.createModels()
      this.extendedGraphs = ExtendedGraphCatalog.createModels()
      this.priorityModels = PriorityStructureCatalog.createModels()
      this.linearModels = LinearStructureCatalog.createModels()
      this.additionalTrees = AdditionalTreeCatalog.createModels()
      this.hashMap = HashMap.createDefault()
      this.hashSet = HashSet.createDefault()
      this.bloomFilter = BloomFilter.createDefault()
      this.list = LinkedList.createDefault()
      this.array = menu.actionScope === 'sorting' ? FixedArray.createSortingDefault() : FixedArray.createDefault()
      this.tree = BinaryTree.createDefault()
      this.avlTree = AVLTree.createDefault()
      this.redBlackTree = RedBlackTree.createDefault()
      this.bTree = BTree.createDefault()
      this.bPlusTree = BPlusTree.createDefault()
      this.graph = Graph.createDefault()
      this.graphModels = GraphCatalog.createModels(this.graph)
      this.stack = Stack.createDefault()
      this.queue = Queue.createDefault()
      this.deque = Deque.createDefault()
      this.doublyList = DoublyLinkedList.createDefault()
      this.buffer = CircularBuffer.createDefault()
    }
    this.setState({
      selected: kind,
      selectedScope: menu.actionScope,
      scene: StructureCatalog.createPreview(
        kind,
        this.list,
        this.array,
        this.tree,
        this.graph,
        this.stack,
        this.queue,
        this.deque,
        this.doublyList,
        this.buffer,
        this.avlTree,
        this.redBlackTree,
        this.bTree,
        this.bPlusTree,
        this.hashMap,
        this.hashSet,
        this.bloomFilter,
        this.additionalTrees,
        this.graphModels,
        this.linearModels,
        this.priorityModels,
        this.extendedGraphs,
        this.hashModels,
        this.probabilisticModels,
      ),
      actionOpen: false,
      selectedAction: null,
      actionValue: undefined,
      actionUpperValue: undefined,
      actionRunning: false,
      inputRequest: null,
      menu,
      menuOpen: false,
      searchOpen: false,
      algorithmInformation: null,
      overviewInformation: null,
      structureInformation: null,
      actionSession: this.state.actionSession + 1,
    }, () => {
      this.focusActions()
      if (action) this.selectAction(action)
    })
  }

  private selectAction = (action: ActionKind): void => {
    if (!this.state.selected) return
    if (ActionInputRequest.supportsStructure(this.state.selected) && this.state.actionRunning) return
    if (!ActionCatalog.getScopedActions(this.state.selected, this.state.selectedScope).some((choice) => choice.kind === action)) return
    if (ActionInputRequest.supportsStructure(this.state.selected)) {
      const graph = this.graphModels.get(this.state.selected)
      const extended = this.extendedGraphs.get(this.state.selected)
      const partitions: Record<string, number> = {}
      if (extended) for (const vertex of extended.getVertices()) if (vertex.partition !== undefined) partitions[String(vertex.value)] = vertex.partition
      const context = extended ? { vertices: extended.getVertices().map((vertex) => vertex.value), edges: extended.getEdges().map((edge) => edge.number), partitions }
        : graph ? { vertices: graph.getEntries().map((entry) => entry.value), edges: graph.getEdges().map((edge) => edge.number) } : undefined
      const numerical = this.linearModels.get(this.state.selected)
      const request = ActionInputRequest.create(this.state.selected, action, this.getInputSize(this.state.selected), context, numerical instanceof NumericalModel ? numerical.shape : undefined)
      if (request) {
        this.setState({ inputRequest: request, overviewInformation: null, structureInformation: null })
        return
      }
    } else if (this.state.actionOpen && this.state.selectedAction === action) return
    this.startAction(action)
  }

  private startAction(action: ActionKind, value?: number, upperValue?: number, treeInput: TreeInputValues = {}): void {
    if (!this.state.selected) return
    this.setState({
      actionOpen: true,
      treeInput,
      selectedAction: action,
      actionValue: value,
      actionUpperValue: upperValue,
      actionRunning: ActionInputRequest.supportsStructure(this.state.selected),
      inputRequest: null,
      menuOpen: false,
      searchOpen: false,
      algorithmInformation: this.describeAction(action),
      overviewInformation: null,
      structureInformation: null,
      actionSession: this.state.actionSession + 1,
    })
  }

  private confirmActionInput = (value: number, upperValue?: number): void => {
    const request = this.state.inputRequest
    if (!request || this.state.selected !== request.structure || this.state.actionRunning) return
    if (request.validate(String(value))) return
    if (request.validateUpperBound(String(value), upperValue === undefined ? '' : String(upperValue))) return
    this.startAction(request.action, value, upperValue)
  }

  private closeActionInput = (): void => {
    this.setState({ inputRequest: null })
  }

  private confirmStructuredInput = (values: TreeInputValues): void => {
    const request = this.state.inputRequest
    if (!request?.structured || this.state.selected !== request.structure || this.state.actionRunning) return
    const drafts: Record<string, string> = {}
    for (const field of request.structured.fields) drafts[field.name] = String(values[field.name] ?? '')
    if (Object.keys(request.structured.validate(drafts)).length) return
    this.startAction(request.action, undefined, undefined, request.structured.parse(drafts))
  }

  private completeAction = (): void => {
    this.setState({ actionRunning: false })
  }

  private getInputSize(structure: StructureKind): number {
    const probabilistic = this.probabilisticModels.get(structure)
    if (probabilistic) return probabilistic.length
    const hash = this.hashModels.get(structure)
    if (hash) return hash.length
    const extended = this.extendedGraphs.get(structure)
    if (extended) return extended.length
    const priority = this.priorityModels.get(structure)
    if (priority) return priority.length
    const linear = this.linearModels.get(structure)
    if (linear) return linear.length
    const graph = this.graphModels.get(structure)
    if (graph) return graph.length
    const additional = this.additionalTrees.get(structure)
    if (additional) return additional.length
    switch (structure) {
      case 'hash-map': return this.hashMap.length
      case 'hash-set': return this.hashSet.length
      case 'bloom-filter': return this.bloomFilter.length
      case 'linked-list': return this.list.length
      case 'array': return this.array.length
      case 'stack': return this.stack.length
      case 'queue': return this.queue.length
      case 'deque': return this.deque.length
      case 'doubly-linked-list': return this.doublyList.length
      case 'circular-buffer': return this.buffer.length
      case 'binary-tree': return this.tree.length
      case 'avl-tree': return this.avlTree.length
      case 'red-black-tree': return this.redBlackTree.length
      case 'b-tree': return this.bTree.length
      case 'b-plus-tree': return this.bPlusTree.length
      default: throw new Error('This structure does not support action input dialogs')
    }
  }

  private showActionInformation = (action: ActionKind): void => {
    if (!this.state.selected) return
    if (!ActionCatalog.getScopedActions(this.state.selected, this.state.selectedScope).some((choice) => choice.kind === action)) return
    this.setState({
      overviewInformation: this.state.selectedAction === action
        ? this.state.algorithmInformation
        : this.describeAction(action),
      structureInformation: null,
      inputRequest: null,
    })
  }

  private closeActionInformation = (): void => {
    this.setState({ overviewInformation: null })
  }

  private showStructureInformation = (): void => {
    if (!this.state.selected) return
    this.setState({ structureInformation: this.state.selected, overviewInformation: null, inputRequest: null })
  }

  private closeStructureInformation = (): void => {
    this.setState({ structureInformation: null })
  }

  private describeAction(action: ActionKind): AlgorithmInformation | null {
    const information = this.describeActionDetails(action)
    if (!information || !this.state.selected) return information
    const realWorldUsage = AlgorithmTechnologyCatalog.get(this.state.selected, action, this.state.selectedScope)
    return realWorldUsage ? { ...information, realWorldUsage } : information
  }

  private describeSearchAlgorithm = (structure: StructureKind, action: ActionKind, scope: ActionScope): AlgorithmInformation | null => {
    return this.describeActionDetails(action, structure, scope)
  }

  private describeActionDetails = (action: ActionKind, structure: StructureKind | null = this.state.selected, scope: ActionScope = this.state.selectedScope): AlgorithmInformation | null => {
    const probabilistic = structure ? this.probabilisticModels.get(structure) : undefined
    const hash = structure ? this.hashModels.get(structure) : undefined
    if (probabilistic) return ProbabilisticFeatures.describe(action, probabilistic)
    if (hash) return HashFeatures.describe(action, hash)
    const extended = structure ? this.extendedGraphs.get(structure) : undefined
    if (extended) {
      const features = scope === 'graph-traversal' ? ExtendedGraphTraversalFeatures : ExtendedGraphFeatures
      return features.describe(action, extended)
    }
    const priority = structure ? this.priorityModels.get(structure) : undefined
    if (priority) return PriorityFeatures.describe(action, priority)
    const linear = structure ? this.linearModels.get(structure) : undefined
    if (linear) return linear.kind === 'rope' ? RopeFeatures.describe(action, linear) : LinearFeatures.describe(action, linear)
    const graph = structure ? this.graphModels.get(structure) : undefined
    if (graph) {
      const features = scope === 'graph-traversal' ? GraphTraversalFeatures : GraphFeatures
      return features.describe(action, graph)
    }
    const additional = structure ? this.additionalTrees.get(structure) : undefined
    if (additional) return additional.kind === 'heap' ? HeapFeatures.describe(action, additional) : TreeFeatures.describe(action, additional)
    if (structure === 'hash-map') {
      switch (action) {
        case 'insert': return HashMapInsertSequence.describe(this.hashMap.length)
        case 'search-value': return HashMapSearchByKeySequence.describe(this.hashMap.length)
        case 'delete-value': return HashMapDeleteByKeySequence.describe(this.hashMap.length)
        case 'clear': return HashMapClearSequence.describe(this.hashMap.length)
      }
    }
    if (structure === 'hash-set') {
      switch (action) {
        case 'insert': return HashSetAddSequence.describe(this.hashSet.length)
        case 'search-value': return HashSetContainsSequence.describe(this.hashSet.length)
        case 'delete-value': return HashSetRemoveSequence.describe(this.hashSet.length)
        case 'clear': return HashSetClearSequence.describe(this.hashSet.length)
      }
    }
    if (structure === 'bloom-filter') {
      switch (action) {
        case 'insert': return BloomFilterAddSequence.describe(this.bloomFilter.length)
        case 'search-value': return BloomFilterCheckMembershipSequence.describe(this.bloomFilter.length)
        case 'clear': return BloomFilterClearSequence.describe(this.bloomFilter.length)
      }
    }
    if (structure === 'avl-tree') {
      switch (action) {
        case 'insert': return AVLTreeInsertSequence.describe(this.avlTree.length)
        case 'search-value': return AVLTreeSearchByKeySequence.describe(this.avlTree.length)
        case 'delete-value': return AVLTreeDeleteByKeySequence.describe(this.avlTree.length)
        case 'clear': return AVLTreeClearSequence.describe(this.avlTree.length)
      }
    }
    if (structure === 'red-black-tree') {
      switch (action) {
        case 'insert': return RedBlackTreeInsertSequence.describe(this.redBlackTree.length)
        case 'search-value': return RedBlackTreeSearchByKeySequence.describe(this.redBlackTree.length)
        case 'delete-value': return RedBlackTreeDeleteByKeySequence.describe(this.redBlackTree.length)
        case 'clear': return RedBlackTreeClearSequence.describe(this.redBlackTree.length)
      }
    }
    if (structure === 'b-tree') {
      switch (action) {
        case 'insert': return BTreeInsertSequence.describe(this.bTree.length)
        case 'search-value': return BTreeSearchByKeySequence.describe(this.bTree.length)
        case 'delete-value': return BTreeDeleteByKeySequence.describe(this.bTree.length)
        case 'clear': return BTreeClearSequence.describe(this.bTree.length)
      }
    }
    if (structure === 'b-plus-tree') {
      switch (action) {
        case 'insert': return BPlusTreeInsertSequence.describe(this.bPlusTree.length)
        case 'search-value': return BPlusTreeSearchByKeySequence.describe(this.bPlusTree.length)
        case 'delete-value': return BPlusTreeDeleteByKeySequence.describe(this.bPlusTree.length)
        case 'clear': return BPlusTreeClearSequence.describe(this.bPlusTree.length)
        case 'range-from-value': return BPlusTreeRangeFromKeySequence.describe(this.bPlusTree.length)
      }
    }
    if (structure === 'queue') {
      switch (action) {
        case 'enqueue': return QueueEnqueueSequence.describe(this.queue.length)
        case 'dequeue': return QueueDequeueSequence.describe(this.queue.length)
        case 'peek': return QueuePeekSequence.describe(this.queue.length)
        case 'clear': return QueueClearSequence.describe(this.queue.length)
        case 'search-value': return QueueSearchByValueSequence.describe(this.queue.length)
      }
    }
    if (structure === 'deque') {
      switch (action) {
        case 'push-front': return DequePushFrontSequence.describe(this.deque.length)
        case 'push-back': return DequePushBackSequence.describe(this.deque.length)
        case 'pop-front': return DequePopFrontSequence.describe(this.deque.length)
        case 'pop-back': return DequePopBackSequence.describe(this.deque.length)
        case 'peek-front': return DequePeekFrontSequence.describe(this.deque.length)
        case 'peek-back': return DequePeekBackSequence.describe(this.deque.length)
        case 'clear': return DequeClearSequence.describe(this.deque.length)
        case 'search-value': return DequeSearchByValueSequence.describe(this.deque.length)
      }
    }
    if (structure === 'doubly-linked-list') {
      switch (action) {
        case 'insert-middle': return DoublyLinkedListAddInTheMiddleSequence.describe(this.doublyList.length)
        case 'insert-start': return DoublyLinkedListAddAtStartSequence.describe(this.doublyList.length)
        case 'insert-end': return DoublyLinkedListAddAtEndSequence.describe(this.doublyList.length)
        case 'delete-start': return DoublyLinkedListDeleteAtStartSequence.describe(this.doublyList.length)
        case 'delete-end': return DoublyLinkedListDeleteAtEndSequence.describe(this.doublyList.length)
        case 'delete-value': return DoublyLinkedListDeleteByValueSequence.describe(this.doublyList.length)
        case 'search-value': return DoublyLinkedListSearchByValueSequence.describe(this.doublyList.length)
        case 'search-index': return DoublyLinkedListSearchByIndexSequence.describe(this.doublyList.length)
        case 'clear': return DoublyLinkedListClearSequence.describe(this.doublyList.length)
      }
    }
    if (structure === 'circular-buffer') {
      switch (action) {
        case 'enqueue': return CircularBufferEnqueueSequence.describe(this.buffer.length)
        case 'dequeue': return CircularBufferDequeueSequence.describe(this.buffer.length)
        case 'peek': return CircularBufferPeekSequence.describe(this.buffer.length)
        case 'clear': return CircularBufferClearSequence.describe(this.buffer.length)
        case 'search-value': return CircularBufferSearchByValueSequence.describe(this.buffer.length)
      }
    }
    if (structure === 'stack') {
      switch (action) {
        case 'push': return StackPushSequence.describe(this.stack.length)
        case 'pop': return StackPopSequence.describe(this.stack.length)
        case 'peek': return StackPeekSequence.describe(this.stack.length)
        case 'clear': return StackClearSequence.describe(this.stack.length)
        case 'search-value': return StackSearchByValueSequence.describe(this.stack.length)
      }
    }
    if (structure === 'linked-list') {
      switch (action) {
        case 'clear': return LinkedListClearSequence.describe(this.list.length)
        case 'insert-middle': return InsertionAnimation.describe(this.list.length)
        case 'insert-start': return LinkedListAddAtStartSequence.describe(this.list.length)
        case 'insert-end': return LinkedListAddAtEndSequence.describe(this.list.length)
        case 'search-index': return LinkedListSearchByIndexSequence.describe(this.list.length)
        case 'search-value': return LinkedListSearchByValueSequence.describe(this.list.length)
        case 'delete-value': return LinkedListDeleteByValueSequence.describe(this.list.length)
      }
    }
    if (structure === 'array') {
      switch (action) {
        case 'bubble-sorting': return BubbleSortingAnimation.describe(this.array.length)
        case 'selection-sort': return SelectionSortAnimation.describe(this.array.length)
        case 'insertion-sort': return InsertionSortAnimation.describe(this.array.length)
        case 'binary-insertion-sort': return BinaryInsertionSortAnimation.describe(this.array.length)
        case 'merge-sort': return MergeSortAnimation.describe(this.array.length)
        case 'quick-sort': return QuickSortAnimation.describe(this.array.length)
        case 'heap-sort': return HeapSortAnimation.describe(this.array.length)
        case 'shell-sort': return ShellSortAnimation.describe(this.array.length)
        case 'counting-sort': return CountingSortAnimation.describe(this.array.length)
        case 'radix-sort': return RadixSortAnimation.describe(this.array.length)
        case 'bucket-sort': return BucketSortAnimation.describe(this.array.length)
        case 'tim-sort': return TimSortAnimation.describe(this.array.length)
        case 'intro-sort': return IntroSortAnimation.describe(this.array.length)
        case 'dual-pivot-quick-sort': return DualPivotQuickSortAnimation.describe(this.array.length)
        case 'block-merge-sort': return BlockMergeSortAnimation.describe(this.array.length)
        case 'wiki-sort': return WikiSortAnimation.describe(this.array.length)
        case 'smooth-sort': return SmoothsortAnimation.describe(this.array.length)
        case 'tree-sort': return TreeSortAnimation.describe(this.array.length)
        case 'tournament-sort': return TournamentSortAnimation.describe(this.array.length)
        case 'patience-sort': return PatienceSortAnimation.describe(this.array.length)
        case 'cycle-sort': return CycleSortAnimation.describe(this.array.length)
        case 'comb-sort': return CombSortAnimation.describe(this.array.length)
        case 'cocktail-shaker-sort': return CocktailShakerSortAnimation.describe(this.array.length)
        case 'gnome-sort': return GnomeSortAnimation.describe(this.array.length)
        case 'odd-even-sort': return OddEvenSortAnimation.describe(this.array.length)
        case 'odd-even-merge-sort': return OddEvenMergeSortAnimation.describe(this.array.length)
        case 'bitonic-sort': return BitonicSortAnimation.describe(this.array.length)
        case 'pairwise-sorting-network': return PairwiseSortingNetworkAnimation.describe(this.array.length)
        case 'sample-sort': return SampleSortAnimation.describe(this.array.length)
        case 'parallel-merge-sort': return ParallelMergeSortAnimation.describe(this.array.length)
        case 'parallel-quick-sort': return ParallelQuickSortAnimation.describe(this.array.length)
        case 'external-merge-sort': return ExternalMergeSortAnimation.describe(this.array.length)
        case 'polyphase-merge-sort': return PolyphaseMergeSortAnimation.describe(this.array.length)
        case 'natural-merge-sort': return NaturalMergeSortAnimation.describe(this.array.length)
        case 'flash-sort': return FlashsortAnimation.describe(this.array.length)
        case 'american-flag-sort': return AmericanFlagSortAnimation.describe(this.array.length)
        case 'spread-sort': return SpreadsortAnimation.describe(this.array.length)
        case 'burst-sort': return BurstsortAnimation.describe(this.array.length)
        case 'pigeonhole-sort': return PigeonholeSortAnimation.describe(this.array.length)
        case 'interpolation-sort': return InterpolationSortAnimation.describe(this.array.length)
        case 'library-sort': return LibrarySortAnimation.describe(this.array.length)
        case 'splay-sort': return SplaySortAnimation.describe(this.array.length)
        case 'strand-sort': return StrandSortAnimation.describe(this.array.length)
        case 'pancake-sort': return PancakeSortAnimation.describe(this.array.length)
        case 'stooge-sort': return StoogeSortAnimation.describe(this.array.length)
        case 'slow-sort': return SlowSortAnimation.describe(this.array.length)
        case 'bogo-sort': return BogoSortAnimation.describe(this.array.length)
        case 'sleep-sort': return SleepSortAnimation.describe(this.array.length)
        case 'clear': return ArrayClearSequence.describe(this.array.length)
        case 'insert-middle': return ArrayInsertionAnimation.describe(this.array.length)
        case 'insert-start': return ArrayAddAtStartSequence.describe(this.array.length)
        case 'insert-end': return ArrayAddAtEndSequence.describe(this.array.length)
        case 'search-index': return ArraySearchByIndexSequence.describe(this.array.length)
        case 'search-value': return ArraySearchByValueSequence.describe(this.array.length)
        case 'delete-value': return ArrayDeleteByValueSequence.describe(this.array.length)
      }
    }
    if (structure === 'binary-tree') {
      switch (action) {
        case 'clear': return BinaryTreeClearSequence.describe(this.tree.length)
        case 'insert': return TreeInsertionAnimation.describe(this.tree.length)
        case 'search-value': return BinaryTreeSearchByKeySequence.describe(this.tree.length)
        case 'delete-value': return BinaryTreeDeleteByKeySequence.describe(this.tree.length)
      }
    }
    return null
  }

  private renderAction(): ReactNode {
    if (!this.state.actionOpen) return null
    const probabilistic = this.state.selected ? this.probabilisticModels.get(this.state.selected) : undefined
    const hash = this.state.selected ? this.hashModels.get(this.state.selected) : undefined
    if (probabilistic && this.state.selectedAction) return ProbabilisticFeatures.render(this.state.selectedAction, {
      model: probabilistic, input: this.state.treeInput,
      onSceneChange: this.updateProbabilisticScene, onComplete: this.completeAction,
    }, this.state.actionSession)
    if (hash && this.state.selectedAction) return HashFeatures.render(this.state.selectedAction, {
      model: hash, input: this.state.treeInput,
      onSceneChange: this.updateHashStructureScene, onComplete: this.completeAction,
    }, this.state.actionSession)
    const extended = this.state.selected ? this.extendedGraphs.get(this.state.selected) : undefined
    if (extended && this.state.selectedAction) {
      const features = this.state.selectedScope === 'graph-traversal' ? ExtendedGraphTraversalFeatures : ExtendedGraphFeatures
      return features.render(this.state.selectedAction, {
        model: extended, input: this.state.treeInput,
        onSceneChange: this.updateExtendedGraphScene, onComplete: this.completeAction,
      }, this.state.actionSession)
    }
    const priority = this.state.selected ? this.priorityModels.get(this.state.selected) : undefined
    if (priority && this.state.selectedAction) return PriorityFeatures.render(this.state.selectedAction, {
      model: priority, input: this.state.treeInput,
      onSceneChange: this.updatePriorityScene, onComplete: this.completeAction,
    }, this.state.actionSession)
    const linear = this.state.selected ? this.linearModels.get(this.state.selected) : undefined
    if (linear && this.state.selectedAction) {
      const features = linear.kind === 'rope' ? RopeFeatures : LinearFeatures
      return features.render(this.state.selectedAction, {
        model: linear, input: this.state.treeInput,
        onSceneChange: this.updateLinearScene, onComplete: this.completeAction,
      }, this.state.actionSession)
    }
    const graph = this.state.selected ? this.graphModels.get(this.state.selected) : undefined
    if (graph && this.state.selectedAction) {
      const features = this.state.selectedScope === 'graph-traversal' ? GraphTraversalFeatures : GraphFeatures
      return features.render(this.state.selectedAction, {
        model: graph, input: this.state.treeInput,
        onSceneChange: this.updateGraphScene, onComplete: this.completeAction,
      }, this.state.actionSession)
    }
    const additional = this.state.selected ? this.additionalTrees.get(this.state.selected) : undefined
    if (additional && this.state.selectedAction) {
      const features = additional.kind === 'heap' ? HeapFeatures : TreeFeatures
      return features.render(this.state.selectedAction, {
        model: additional, input: this.state.treeInput,
        onSceneChange: this.updateAdditionalTreeScene, onComplete: this.completeAction,
      }, this.state.actionSession)
    }
    if (this.state.selected === 'hash-map') {
      switch (this.state.selectedAction) {
        case 'insert': return <HashMapInsert key={this.state.actionSession} model={this.hashMap} value={this.state.actionValue} upperValue={this.state.actionUpperValue} onSceneChange={this.updateHashMapScene} onComplete={this.completeAction} />
        case 'search-value': return <HashMapSearchByKey key={this.state.actionSession} model={this.hashMap} value={this.state.actionValue} upperValue={this.state.actionUpperValue} onSceneChange={this.updateHashMapScene} onComplete={this.completeAction} />
        case 'delete-value': return <HashMapDeleteByKey key={this.state.actionSession} model={this.hashMap} value={this.state.actionValue} upperValue={this.state.actionUpperValue} onSceneChange={this.updateHashMapScene} onComplete={this.completeAction} />
        case 'clear': return <HashMapClear key={this.state.actionSession} model={this.hashMap} value={this.state.actionValue} upperValue={this.state.actionUpperValue} onSceneChange={this.updateHashMapScene} onComplete={this.completeAction} />
      }
    }
    if (this.state.selected === 'hash-set') {
      switch (this.state.selectedAction) {
        case 'insert': return <HashSetAdd key={this.state.actionSession} model={this.hashSet} value={this.state.actionValue} upperValue={this.state.actionUpperValue} onSceneChange={this.updateHashSetScene} onComplete={this.completeAction} />
        case 'search-value': return <HashSetContains key={this.state.actionSession} model={this.hashSet} value={this.state.actionValue} upperValue={this.state.actionUpperValue} onSceneChange={this.updateHashSetScene} onComplete={this.completeAction} />
        case 'delete-value': return <HashSetRemove key={this.state.actionSession} model={this.hashSet} value={this.state.actionValue} upperValue={this.state.actionUpperValue} onSceneChange={this.updateHashSetScene} onComplete={this.completeAction} />
        case 'clear': return <HashSetClear key={this.state.actionSession} model={this.hashSet} value={this.state.actionValue} upperValue={this.state.actionUpperValue} onSceneChange={this.updateHashSetScene} onComplete={this.completeAction} />
      }
    }
    if (this.state.selected === 'bloom-filter') {
      switch (this.state.selectedAction) {
        case 'insert': return <BloomFilterAdd key={this.state.actionSession} model={this.bloomFilter} value={this.state.actionValue} upperValue={this.state.actionUpperValue} onSceneChange={this.updateBloomFilterScene} onComplete={this.completeAction} />
        case 'search-value': return <BloomFilterCheckMembership key={this.state.actionSession} model={this.bloomFilter} value={this.state.actionValue} upperValue={this.state.actionUpperValue} onSceneChange={this.updateBloomFilterScene} onComplete={this.completeAction} />
        case 'clear': return <BloomFilterClear key={this.state.actionSession} model={this.bloomFilter} value={this.state.actionValue} upperValue={this.state.actionUpperValue} onSceneChange={this.updateBloomFilterScene} onComplete={this.completeAction} />
      }
    }
    if (this.state.selected === 'avl-tree') {
      switch (this.state.selectedAction) {
        case 'insert': return <AVLTreeInsert key={this.state.actionSession} model={this.avlTree} value={this.state.actionValue} onSceneChange={this.updateAVLTreeScene} onComplete={this.completeAction} />
        case 'search-value': return <AVLTreeSearchByKey key={this.state.actionSession} model={this.avlTree} value={this.state.actionValue} onSceneChange={this.updateAVLTreeScene} onComplete={this.completeAction} />
        case 'delete-value': return <AVLTreeDeleteByKey key={this.state.actionSession} model={this.avlTree} value={this.state.actionValue} onSceneChange={this.updateAVLTreeScene} onComplete={this.completeAction} />
        case 'clear': return <AVLTreeClear key={this.state.actionSession} model={this.avlTree} value={this.state.actionValue} onSceneChange={this.updateAVLTreeScene} onComplete={this.completeAction} />
      }
    }
    if (this.state.selected === 'red-black-tree') {
      switch (this.state.selectedAction) {
        case 'insert': return <RedBlackTreeInsert key={this.state.actionSession} model={this.redBlackTree} value={this.state.actionValue} onSceneChange={this.updateRedBlackTreeScene} onComplete={this.completeAction} />
        case 'search-value': return <RedBlackTreeSearchByKey key={this.state.actionSession} model={this.redBlackTree} value={this.state.actionValue} onSceneChange={this.updateRedBlackTreeScene} onComplete={this.completeAction} />
        case 'delete-value': return <RedBlackTreeDeleteByKey key={this.state.actionSession} model={this.redBlackTree} value={this.state.actionValue} onSceneChange={this.updateRedBlackTreeScene} onComplete={this.completeAction} />
        case 'clear': return <RedBlackTreeClear key={this.state.actionSession} model={this.redBlackTree} value={this.state.actionValue} onSceneChange={this.updateRedBlackTreeScene} onComplete={this.completeAction} />
      }
    }
    if (this.state.selected === 'b-tree') {
      switch (this.state.selectedAction) {
        case 'insert': return <BTreeInsert key={this.state.actionSession} model={this.bTree} value={this.state.actionValue} onSceneChange={this.updateBTreeScene} onComplete={this.completeAction} />
        case 'search-value': return <BTreeSearchByKey key={this.state.actionSession} model={this.bTree} value={this.state.actionValue} onSceneChange={this.updateBTreeScene} onComplete={this.completeAction} />
        case 'delete-value': return <BTreeDeleteByKey key={this.state.actionSession} model={this.bTree} value={this.state.actionValue} onSceneChange={this.updateBTreeScene} onComplete={this.completeAction} />
        case 'clear': return <BTreeClear key={this.state.actionSession} model={this.bTree} value={this.state.actionValue} onSceneChange={this.updateBTreeScene} onComplete={this.completeAction} />
      }
    }
    if (this.state.selected === 'b-plus-tree') {
      switch (this.state.selectedAction) {
        case 'insert': return <BPlusTreeInsert key={this.state.actionSession} model={this.bPlusTree} value={this.state.actionValue} onSceneChange={this.updateBPlusTreeScene} onComplete={this.completeAction} />
        case 'search-value': return <BPlusTreeSearchByKey key={this.state.actionSession} model={this.bPlusTree} value={this.state.actionValue} onSceneChange={this.updateBPlusTreeScene} onComplete={this.completeAction} />
        case 'delete-value': return <BPlusTreeDeleteByKey key={this.state.actionSession} model={this.bPlusTree} value={this.state.actionValue} onSceneChange={this.updateBPlusTreeScene} onComplete={this.completeAction} />
        case 'clear': return <BPlusTreeClear key={this.state.actionSession} model={this.bPlusTree} value={this.state.actionValue} onSceneChange={this.updateBPlusTreeScene} onComplete={this.completeAction} />
        case 'range-from-value': return <BPlusTreeRangeFromKey key={this.state.actionSession} model={this.bPlusTree} value={this.state.actionValue} upperValue={this.state.actionUpperValue} onSceneChange={this.updateBPlusTreeScene} onComplete={this.completeAction} />
      }
    }
    if (this.state.selected === 'queue') {
      switch (this.state.selectedAction) {
        case 'enqueue': return <QueueEnqueue key={this.state.actionSession} model={this.queue} value={this.state.actionValue} onSceneChange={this.updateQueueScene} onComplete={this.completeAction} />
        case 'dequeue': return <QueueDequeue key={this.state.actionSession} model={this.queue} value={this.state.actionValue} onSceneChange={this.updateQueueScene} onComplete={this.completeAction} />
        case 'peek': return <QueuePeek key={this.state.actionSession} model={this.queue} value={this.state.actionValue} onSceneChange={this.updateQueueScene} onComplete={this.completeAction} />
        case 'clear': return <QueueClear key={this.state.actionSession} model={this.queue} value={this.state.actionValue} onSceneChange={this.updateQueueScene} onComplete={this.completeAction} />
        case 'search-value': return <QueueSearchByValue key={this.state.actionSession} model={this.queue} value={this.state.actionValue} onSceneChange={this.updateQueueScene} onComplete={this.completeAction} />
      }
    }
    if (this.state.selected === 'deque') {
      switch (this.state.selectedAction) {
        case 'push-front': return <DequePushFront key={this.state.actionSession} model={this.deque} value={this.state.actionValue} onSceneChange={this.updateDequeScene} onComplete={this.completeAction} />
        case 'push-back': return <DequePushBack key={this.state.actionSession} model={this.deque} value={this.state.actionValue} onSceneChange={this.updateDequeScene} onComplete={this.completeAction} />
        case 'pop-front': return <DequePopFront key={this.state.actionSession} model={this.deque} value={this.state.actionValue} onSceneChange={this.updateDequeScene} onComplete={this.completeAction} />
        case 'pop-back': return <DequePopBack key={this.state.actionSession} model={this.deque} value={this.state.actionValue} onSceneChange={this.updateDequeScene} onComplete={this.completeAction} />
        case 'peek-front': return <DequePeekFront key={this.state.actionSession} model={this.deque} value={this.state.actionValue} onSceneChange={this.updateDequeScene} onComplete={this.completeAction} />
        case 'peek-back': return <DequePeekBack key={this.state.actionSession} model={this.deque} value={this.state.actionValue} onSceneChange={this.updateDequeScene} onComplete={this.completeAction} />
        case 'clear': return <DequeClear key={this.state.actionSession} model={this.deque} value={this.state.actionValue} onSceneChange={this.updateDequeScene} onComplete={this.completeAction} />
        case 'search-value': return <DequeSearchByValue key={this.state.actionSession} model={this.deque} value={this.state.actionValue} onSceneChange={this.updateDequeScene} onComplete={this.completeAction} />
      }
    }
    if (this.state.selected === 'doubly-linked-list') {
      switch (this.state.selectedAction) {
        case 'insert-middle': return <DoublyLinkedListAddInTheMiddle key={this.state.actionSession} model={this.doublyList} value={this.state.actionValue} onSceneChange={this.updateDoublyLinkedListScene} onComplete={this.completeAction} />
        case 'insert-start': return <DoublyLinkedListAddAtStart key={this.state.actionSession} model={this.doublyList} value={this.state.actionValue} onSceneChange={this.updateDoublyLinkedListScene} onComplete={this.completeAction} />
        case 'insert-end': return <DoublyLinkedListAddAtEnd key={this.state.actionSession} model={this.doublyList} value={this.state.actionValue} onSceneChange={this.updateDoublyLinkedListScene} onComplete={this.completeAction} />
        case 'delete-start': return <DoublyLinkedListDeleteAtStart key={this.state.actionSession} model={this.doublyList} value={this.state.actionValue} onSceneChange={this.updateDoublyLinkedListScene} onComplete={this.completeAction} />
        case 'delete-end': return <DoublyLinkedListDeleteAtEnd key={this.state.actionSession} model={this.doublyList} value={this.state.actionValue} onSceneChange={this.updateDoublyLinkedListScene} onComplete={this.completeAction} />
        case 'delete-value': return <DoublyLinkedListDeleteByValue key={this.state.actionSession} model={this.doublyList} value={this.state.actionValue} onSceneChange={this.updateDoublyLinkedListScene} onComplete={this.completeAction} />
        case 'search-value': return <DoublyLinkedListSearchByValue key={this.state.actionSession} model={this.doublyList} value={this.state.actionValue} onSceneChange={this.updateDoublyLinkedListScene} onComplete={this.completeAction} />
        case 'search-index': return <DoublyLinkedListSearchByIndex key={this.state.actionSession} model={this.doublyList} value={this.state.actionValue} onSceneChange={this.updateDoublyLinkedListScene} onComplete={this.completeAction} />
        case 'clear': return <DoublyLinkedListClear key={this.state.actionSession} model={this.doublyList} value={this.state.actionValue} onSceneChange={this.updateDoublyLinkedListScene} onComplete={this.completeAction} />
      }
    }
    if (this.state.selected === 'circular-buffer') {
      switch (this.state.selectedAction) {
        case 'enqueue': return <CircularBufferEnqueue key={this.state.actionSession} model={this.buffer} value={this.state.actionValue} onSceneChange={this.updateCircularBufferScene} onComplete={this.completeAction} />
        case 'dequeue': return <CircularBufferDequeue key={this.state.actionSession} model={this.buffer} value={this.state.actionValue} onSceneChange={this.updateCircularBufferScene} onComplete={this.completeAction} />
        case 'peek': return <CircularBufferPeek key={this.state.actionSession} model={this.buffer} value={this.state.actionValue} onSceneChange={this.updateCircularBufferScene} onComplete={this.completeAction} />
        case 'clear': return <CircularBufferClear key={this.state.actionSession} model={this.buffer} value={this.state.actionValue} onSceneChange={this.updateCircularBufferScene} onComplete={this.completeAction} />
        case 'search-value': return <CircularBufferSearchByValue key={this.state.actionSession} model={this.buffer} value={this.state.actionValue} onSceneChange={this.updateCircularBufferScene} onComplete={this.completeAction} />
      }
    }
    if (this.state.selected === 'stack') {
      switch (this.state.selectedAction) {
        case 'push': return <StackPush key={this.state.actionSession} model={this.stack} value={this.state.actionValue} onSceneChange={this.updateStackScene} onComplete={this.completeAction} />
        case 'pop': return <StackPop key={this.state.actionSession} model={this.stack} value={this.state.actionValue} onSceneChange={this.updateStackScene} onComplete={this.completeAction} />
        case 'peek': return <StackPeek key={this.state.actionSession} model={this.stack} value={this.state.actionValue} onSceneChange={this.updateStackScene} onComplete={this.completeAction} />
        case 'clear': return <StackClear key={this.state.actionSession} model={this.stack} value={this.state.actionValue} onSceneChange={this.updateStackScene} onComplete={this.completeAction} />
        case 'search-value': return <StackSearchByValue key={this.state.actionSession} model={this.stack} value={this.state.actionValue} onSceneChange={this.updateStackScene} onComplete={this.completeAction} />
      }
    }
    if (this.state.selected === 'linked-list') {
      switch (this.state.selectedAction) {
        case 'clear': return <LinkedListClear key={this.state.actionSession} model={this.list} onSceneChange={this.updateScene} onComplete={this.completeAction} />
        case 'insert-middle': return <AddInTheMiddle key={this.state.actionSession} list={this.list} value={this.state.actionValue} onSceneChange={this.updateScene} onComplete={this.completeAction} />
        case 'insert-start': return <LinkedListAddAtStart key={this.state.actionSession} model={this.list} value={this.state.actionValue} onSceneChange={this.updateScene} onComplete={this.completeAction} />
        case 'insert-end': return <LinkedListAddAtEnd key={this.state.actionSession} model={this.list} value={this.state.actionValue} onSceneChange={this.updateScene} onComplete={this.completeAction} />
        case 'search-index': return <LinkedListSearchByIndex key={this.state.actionSession} model={this.list} value={this.state.actionValue} onSceneChange={this.updateScene} onComplete={this.completeAction} />
        case 'search-value': return <LinkedListSearchByValue key={this.state.actionSession} model={this.list} value={this.state.actionValue} onSceneChange={this.updateScene} onComplete={this.completeAction} />
        case 'delete-value': return <LinkedListDeleteByValue key={this.state.actionSession} model={this.list} value={this.state.actionValue} onSceneChange={this.updateScene} onComplete={this.completeAction} />
      }
    }
    if (this.state.selected === 'array') {
      switch (this.state.selectedAction) {
        case 'bubble-sorting': return <BubbleSorting key={this.state.actionSession} model={this.array} onSceneChange={this.updateArrayScene} onComplete={this.completeAction} />
        case 'selection-sort': return <SelectionSort key={this.state.actionSession} model={this.array} onSceneChange={this.updateArrayScene} onComplete={this.completeAction} />
        case 'insertion-sort': return <InsertionSort key={this.state.actionSession} model={this.array} onSceneChange={this.updateArrayScene} onComplete={this.completeAction} />
        case 'binary-insertion-sort': return <BinaryInsertionSort key={this.state.actionSession} model={this.array} onSceneChange={this.updateArrayScene} onComplete={this.completeAction} />
        case 'merge-sort': return <MergeSort key={this.state.actionSession} model={this.array} onSceneChange={this.updateArrayScene} onComplete={this.completeAction} />
        case 'quick-sort': return <QuickSort key={this.state.actionSession} model={this.array} onSceneChange={this.updateArrayScene} onComplete={this.completeAction} />
        case 'heap-sort': return <HeapSort key={this.state.actionSession} model={this.array} onSceneChange={this.updateArrayScene} onComplete={this.completeAction} />
        case 'shell-sort': return <ShellSort key={this.state.actionSession} model={this.array} onSceneChange={this.updateArrayScene} onComplete={this.completeAction} />
        case 'counting-sort': return <CountingSort key={this.state.actionSession} model={this.array} onSceneChange={this.updateArrayScene} onComplete={this.completeAction} />
        case 'radix-sort': return <RadixSort key={this.state.actionSession} model={this.array} onSceneChange={this.updateArrayScene} onComplete={this.completeAction} />
        case 'bucket-sort': return <BucketSort key={this.state.actionSession} model={this.array} onSceneChange={this.updateArrayScene} onComplete={this.completeAction} />
        case 'tim-sort': return <TimSort key={this.state.actionSession} model={this.array} onSceneChange={this.updateArrayScene} onComplete={this.completeAction} />
        case 'intro-sort': return <IntroSort key={this.state.actionSession} model={this.array} onSceneChange={this.updateArrayScene} onComplete={this.completeAction} />
        case 'dual-pivot-quick-sort': return <DualPivotQuickSort key={this.state.actionSession} model={this.array} onSceneChange={this.updateArrayScene} onComplete={this.completeAction} />
        case 'block-merge-sort': return <BlockMergeSort key={this.state.actionSession} model={this.array} onSceneChange={this.updateArrayScene} onComplete={this.completeAction} />
        case 'wiki-sort': return <WikiSort key={this.state.actionSession} model={this.array} onSceneChange={this.updateArrayScene} onComplete={this.completeAction} />
        case 'smooth-sort': return <Smoothsort key={this.state.actionSession} model={this.array} onSceneChange={this.updateArrayScene} onComplete={this.completeAction} />
        case 'tree-sort': return <TreeSort key={this.state.actionSession} model={this.array} onSceneChange={this.updateArrayScene} onComplete={this.completeAction} />
        case 'tournament-sort': return <TournamentSort key={this.state.actionSession} model={this.array} onSceneChange={this.updateArrayScene} onComplete={this.completeAction} />
        case 'patience-sort': return <PatienceSort key={this.state.actionSession} model={this.array} onSceneChange={this.updateArrayScene} onComplete={this.completeAction} />
        case 'cycle-sort': return <CycleSort key={this.state.actionSession} model={this.array} onSceneChange={this.updateArrayScene} onComplete={this.completeAction} />
        case 'comb-sort': return <CombSort key={this.state.actionSession} model={this.array} onSceneChange={this.updateArrayScene} onComplete={this.completeAction} />
        case 'cocktail-shaker-sort': return <CocktailShakerSort key={this.state.actionSession} model={this.array} onSceneChange={this.updateArrayScene} onComplete={this.completeAction} />
        case 'gnome-sort': return <GnomeSort key={this.state.actionSession} model={this.array} onSceneChange={this.updateArrayScene} onComplete={this.completeAction} />
        case 'odd-even-sort': return <OddEvenSort key={this.state.actionSession} model={this.array} onSceneChange={this.updateArrayScene} onComplete={this.completeAction} />
        case 'odd-even-merge-sort': return <OddEvenMergeSort key={this.state.actionSession} model={this.array} onSceneChange={this.updateArrayScene} onComplete={this.completeAction} />
        case 'bitonic-sort': return <BitonicSort key={this.state.actionSession} model={this.array} onSceneChange={this.updateArrayScene} onComplete={this.completeAction} />
        case 'pairwise-sorting-network': return <PairwiseSortingNetwork key={this.state.actionSession} model={this.array} onSceneChange={this.updateArrayScene} onComplete={this.completeAction} />
        case 'sample-sort': return <SampleSort key={this.state.actionSession} model={this.array} onSceneChange={this.updateArrayScene} onComplete={this.completeAction} />
        case 'parallel-merge-sort': return <ParallelMergeSort key={this.state.actionSession} model={this.array} onSceneChange={this.updateArrayScene} onComplete={this.completeAction} />
        case 'parallel-quick-sort': return <ParallelQuickSort key={this.state.actionSession} model={this.array} onSceneChange={this.updateArrayScene} onComplete={this.completeAction} />
        case 'external-merge-sort': return <ExternalMergeSort key={this.state.actionSession} model={this.array} onSceneChange={this.updateArrayScene} onComplete={this.completeAction} />
        case 'polyphase-merge-sort': return <PolyphaseMergeSort key={this.state.actionSession} model={this.array} onSceneChange={this.updateArrayScene} onComplete={this.completeAction} />
        case 'natural-merge-sort': return <NaturalMergeSort key={this.state.actionSession} model={this.array} onSceneChange={this.updateArrayScene} onComplete={this.completeAction} />
        case 'flash-sort': return <Flashsort key={this.state.actionSession} model={this.array} onSceneChange={this.updateArrayScene} onComplete={this.completeAction} />
        case 'american-flag-sort': return <AmericanFlagSort key={this.state.actionSession} model={this.array} onSceneChange={this.updateArrayScene} onComplete={this.completeAction} />
        case 'spread-sort': return <Spreadsort key={this.state.actionSession} model={this.array} onSceneChange={this.updateArrayScene} onComplete={this.completeAction} />
        case 'burst-sort': return <Burstsort key={this.state.actionSession} model={this.array} onSceneChange={this.updateArrayScene} onComplete={this.completeAction} />
        case 'pigeonhole-sort': return <PigeonholeSort key={this.state.actionSession} model={this.array} onSceneChange={this.updateArrayScene} onComplete={this.completeAction} />
        case 'interpolation-sort': return <InterpolationSort key={this.state.actionSession} model={this.array} onSceneChange={this.updateArrayScene} onComplete={this.completeAction} />
        case 'library-sort': return <LibrarySort key={this.state.actionSession} model={this.array} onSceneChange={this.updateArrayScene} onComplete={this.completeAction} />
        case 'splay-sort': return <SplaySort key={this.state.actionSession} model={this.array} onSceneChange={this.updateArrayScene} onComplete={this.completeAction} />
        case 'strand-sort': return <StrandSort key={this.state.actionSession} model={this.array} onSceneChange={this.updateArrayScene} onComplete={this.completeAction} />
        case 'pancake-sort': return <PancakeSort key={this.state.actionSession} model={this.array} onSceneChange={this.updateArrayScene} onComplete={this.completeAction} />
        case 'stooge-sort': return <StoogeSort key={this.state.actionSession} model={this.array} onSceneChange={this.updateArrayScene} onComplete={this.completeAction} />
        case 'slow-sort': return <SlowSort key={this.state.actionSession} model={this.array} onSceneChange={this.updateArrayScene} onComplete={this.completeAction} />
        case 'bogo-sort': return <BogoSort key={this.state.actionSession} model={this.array} onSceneChange={this.updateArrayScene} onComplete={this.completeAction} />
        case 'sleep-sort': return <SleepSort key={this.state.actionSession} model={this.array} onSceneChange={this.updateArrayScene} onComplete={this.completeAction} />
        case 'clear': return <ArrayClear key={this.state.actionSession} model={this.array} value={this.state.actionValue} onSceneChange={this.updateArrayScene} onComplete={this.completeAction} />
        case 'insert-middle': return <ArrayAddInTheMiddle key={this.state.actionSession} array={this.array} value={this.state.actionValue} onSceneChange={this.updateArrayScene} onComplete={this.completeAction} />
        case 'insert-start': return <ArrayAddAtStart key={this.state.actionSession} model={this.array} value={this.state.actionValue} onSceneChange={this.updateArrayScene} onComplete={this.completeAction} />
        case 'insert-end': return <ArrayAddAtEnd key={this.state.actionSession} model={this.array} value={this.state.actionValue} onSceneChange={this.updateArrayScene} onComplete={this.completeAction} />
        case 'search-index': return <ArraySearchByIndex key={this.state.actionSession} model={this.array} value={this.state.actionValue} onSceneChange={this.updateArrayScene} onComplete={this.completeAction} />
        case 'search-value': return <ArraySearchByValue key={this.state.actionSession} model={this.array} value={this.state.actionValue} onSceneChange={this.updateArrayScene} onComplete={this.completeAction} />
        case 'delete-value': return <ArrayDeleteByValue key={this.state.actionSession} model={this.array} value={this.state.actionValue} onSceneChange={this.updateArrayScene} onComplete={this.completeAction} />
      }
    }
    if (this.state.selected === 'binary-tree') {
      switch (this.state.selectedAction) {
        case 'clear': return <BinaryTreeClear key={this.state.actionSession} model={this.tree} value={this.state.actionValue} onSceneChange={this.updateTreeScene} onComplete={this.completeAction} />
        case 'insert': return <TreeInsert key={this.state.actionSession} tree={this.tree} value={this.state.actionValue} onSceneChange={this.updateTreeScene} onComplete={this.completeAction} />
        case 'search-value': return <BinaryTreeSearchByKey key={this.state.actionSession} model={this.tree} value={this.state.actionValue} onSceneChange={this.updateTreeScene} onComplete={this.completeAction} />
        case 'delete-value': return <BinaryTreeDeleteByKey key={this.state.actionSession} model={this.tree} value={this.state.actionValue} onSceneChange={this.updateTreeScene} onComplete={this.completeAction} />
      }
    }
    return null
  }

  private resetStructure = (): void => {
    if (this.state.selected === null) return
    this.probabilisticModels = ProbabilisticStructureCatalog.createModels()
    this.hashModels = HashStructureCatalog.createModels()
    this.extendedGraphs = ExtendedGraphCatalog.createModels()
    this.priorityModels = PriorityStructureCatalog.createModels()
    this.linearModels = LinearStructureCatalog.createModels()
    this.additionalTrees = AdditionalTreeCatalog.createModels()
    this.hashMap = HashMap.createDefault()
    this.hashSet = HashSet.createDefault()
    this.bloomFilter = BloomFilter.createDefault()
    this.list = LinkedList.createDefault()
    this.array = this.state.selectedScope === 'sorting' ? FixedArray.createSortingDefault() : FixedArray.createDefault()
    this.tree = BinaryTree.createDefault()
    this.avlTree = AVLTree.createDefault()
    this.redBlackTree = RedBlackTree.createDefault()
    this.bTree = BTree.createDefault()
    this.bPlusTree = BPlusTree.createDefault()
    this.graph = Graph.createDefault()
    this.graphModels = GraphCatalog.createModels(this.graph)
    this.stack = Stack.createDefault()
    this.queue = Queue.createDefault()
    this.deque = Deque.createDefault()
    this.doublyList = DoublyLinkedList.createDefault()
    this.buffer = CircularBuffer.createDefault()
    this.setState({
      scene: StructureCatalog.createPreview(
        this.state.selected,
        this.list,
        this.array,
        this.tree,
        this.graph,
        this.stack,
        this.queue,
        this.deque,
        this.doublyList,
        this.buffer,
        this.avlTree,
        this.redBlackTree,
        this.bTree,
        this.bPlusTree,
        this.hashMap,
        this.hashSet,
        this.bloomFilter,
        this.additionalTrees,
        this.graphModels,
        this.linearModels,
        this.priorityModels,
        this.extendedGraphs,
        this.hashModels,
        this.probabilisticModels,
      ),
      actionOpen: false,
      selectedAction: null,
      actionValue: undefined,
      actionUpperValue: undefined,
      actionRunning: false,
      inputRequest: null,
      actionSession: this.state.actionSession + 1,
      algorithmInformation: null,
      overviewInformation: null,
      structureInformation: null,
    })
  }

  private updateScene = (scene: Scene, list: LinkedList): void => {
    this.list = list
    this.setState({ scene })
  }

  private updateProbabilisticScene = (scene: Scene, model: LinearModel): void => {
    if (!(model instanceof ProbabilisticModel)) throw new TypeError('Expected probabilistic structure')
    this.probabilisticModels.set(model.kind, model)
    this.setState({ scene })
  }

  private updateHashStructureScene = (scene: Scene, model: LinearModel): void => {
    if (!(model instanceof HashTableModel)) throw new TypeError('Expected hash structure')
    this.hashModels.set(model.kind, model)
    this.setState({ scene })
  }

  private updateExtendedGraphScene = (scene: Scene, model: LinearModel): void => {
    if (!(model instanceof ExtendedGraphModel)) throw new TypeError('Expected extended graph model')
    this.extendedGraphs.set(model.kind, model)
    this.setState({ scene })
  }

  private updatePriorityScene = (scene: Scene, model: LinearModel): void => {
    if (!(model instanceof PriorityModel)) throw new TypeError('Expected priority model')
    this.priorityModels.set(model.kind, model)
    this.setState({ scene })
  }

  private updateLinearScene = (scene: Scene, model: LinearModel): void => {
    this.linearModels.set(model.kind, model)
    this.setState({ scene })
  }

  private updateAdditionalTreeScene = (scene: Scene, model: AdditionalTreeModel): void => {
    this.additionalTrees.set(model.kind, model)
    this.setState({ scene })
  }

  private updateArrayScene = (scene: Scene, array: FixedArray): void => {
    this.array = array
    this.setState({ scene })
  }

  private updateTreeScene = (scene: Scene, tree: BinaryTree): void => {
    this.tree = tree
    this.setState({ scene })
  }

  private updateGraphScene = (scene: Scene, graph: GraphModel): void => {
    this.graphModels.set(graph.kind, graph)
    if (graph instanceof Graph) this.graph = graph
    this.setState({ scene })
  }

  private updateStackScene = (scene: Scene, stack: Stack): void => {
    this.stack = stack
    this.setState({ scene })
  }

  private updateQueueScene = (scene: Scene, model: Queue): void => {
    this.queue = model
    this.setState({ scene })
  }

  private updateDequeScene = (scene: Scene, model: Deque): void => {
    this.deque = model
    this.setState({ scene })
  }

  private updateDoublyLinkedListScene = (scene: Scene, model: DoublyLinkedList): void => {
    this.doublyList = model
    this.setState({ scene })
  }

  private updateCircularBufferScene = (scene: Scene, model: CircularBuffer): void => {
    this.buffer = model
    this.setState({ scene })
  }

  private updateAVLTreeScene = (scene: Scene, model: AVLTree): void => {
    this.avlTree = model
    this.setState({ scene })
  }

  private updateRedBlackTreeScene = (scene: Scene, model: RedBlackTree): void => {
    this.redBlackTree = model
    this.setState({ scene })
  }

  private updateBTreeScene = (scene: Scene, model: BTree): void => {
    this.bTree = model
    this.setState({ scene })
  }

  private updateBPlusTreeScene = (scene: Scene, model: BPlusTree): void => {
    this.bPlusTree = model
    this.setState({ scene })
  }

  private updateHashMapScene = (scene: Scene, model: HashMap): void => {
    this.hashMap = model
    this.setState({ scene })
  }

  private updateHashSetScene = (scene: Scene, model: HashSet): void => {
    this.hashSet = model
    this.setState({ scene })
  }

  private updateBloomFilterScene = (scene: Scene, model: BloomFilter): void => {
    this.bloomFilter = model
    this.setState({ scene })
  }

  public render() {
    const { selected, scene } = this.state
    return (
      <div className="application">
        <header className="app-header">
          <button
            className="menu-trigger icon-button"
            ref={this.menuButton}
            onClick={this.openMenu}
            aria-label="Open visualization menu"
            aria-haspopup="dialog"
            aria-expanded={this.state.menuOpen}
            aria-controls="main-menu"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M4 6h16M4 12h16M4 18h16"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
              />
            </svg>
          </button>
          <button
            className="search-trigger icon-button"
            ref={this.searchButton}
            onClick={this.openSearch}
            aria-label="Search data structures or algorithms"
            aria-haspopup="dialog"
            aria-expanded={this.state.menuOpen && this.state.searchOpen}
            aria-controls="main-menu"
            title="Search"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true">
              <circle cx="10" cy="10" r="6.5" />
              <path d="m15 15 5.5 5.5" />
            </svg>
          </button>
          <div className="brand">
            <img className="brand-mark" src={`${import.meta.env.BASE_URL}favicon.svg`} width="38" height="38" alt="" />
            <span>
              Computer Science Visualizer
              <span className="brand-caption">Visualize the idea.</span>
            </span>
          </div>
          {selected && (
            <div className="header-playback">
              {this.state.selectedAction !== null && (
                <button
                  className="primary-button header-action-button"
                  onClick={this.resetStructure}
                  aria-label="Reset structure"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M4 10a8 8 0 1 1 1.8 7M4 4v6h6"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              )}
              <div id="playback-toolbar" className="playback-toolbar-host" />
            </div>
          )}
          <button
            type="button"
            className="about-trigger icon-button"
            ref={this.aboutButton}
            onClick={this.openAbout}
            aria-label="About this project"
            aria-haspopup="dialog"
            aria-expanded={this.state.aboutOpen}
            aria-controls="about-project"
            title="About this project"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true">
              <circle cx="12" cy="12" r="9" />
              <path d="M12 11v6M12 7h.01" />
            </svg>
          </button>
        </header>

        <AboutProject open={this.state.aboutOpen} onClose={this.closeAbout} />

        <MainMenu
          open={this.state.menuOpen}
          searchOpen={this.state.searchOpen}
          navigation={this.state.menu}
          selected={selected}
          onClose={this.closeMenu}
          onStructureSelected={this.selectStructure}
          describeSearchAlgorithm={this.describeSearchAlgorithm}
          onSearchResultSelected={this.selectSearchResult}
          onCategorySelected={this.selectCategory}
          onGroupSelected={this.selectGroup}
          onAlgorithmGroupSelected={this.selectAlgorithmGroup}
          onAdvancedAlgorithmGroupSelected={this.selectAdvancedAlgorithmGroup}
          onBack={this.backInMenu}
        />

        <AlgorithmInfo
          information={this.state.overviewInformation}
          onClose={this.closeActionInformation}
        />

        <StructureInfo
          structure={this.state.structureInformation}
          onClose={this.closeStructureInformation}
        />

        {this.state.inputRequest && (
          <ActionInput
            request={this.state.inputRequest}
            onConfirm={this.confirmActionInput}
            onConfirmStructured={this.confirmStructuredInput}
            onClose={this.closeActionInput}
          />
        )}

        <main className="workspace">
          <Renderer
            scene={scene}
            onOpenMenu={this.openMenu}
          >
            {selected && (
              <ActionMenu
                ref={this.actionMenu}
                structure={selected}
                scope={this.state.selectedScope}
                selectedAction={this.state.selectedAction}
                actionsDisabled={ActionInputRequest.supportsStructure(selected) && this.state.actionRunning}
                onBack={this.openMenu}
                onActionSelected={this.selectAction}
                onActionInformationRequested={this.showActionInformation}
                onStructureInformationRequested={this.showStructureInformation}
                informationForAction={this.describeActionDetails}
              />
            )}
          </Renderer>
          {this.renderAction()}
        </main>
      </div>
    )
  }
}
