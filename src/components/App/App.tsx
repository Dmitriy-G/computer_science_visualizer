import { GraphCatalog } from '../../visualization/GraphCatalog.ts'
import { GraphFeatures } from '../DataStructures/Graphs/GraphFeatures.tsx'
import type { GraphModel } from '../../visualization/GraphModel.ts'
import { HashMap } from '../DataStructures/HashBased/HashMap/HashMap.ts'
import HashMapInsert from '../DataStructures/HashBased/HashMap/Insert/Insert.tsx'
import { InsertAnimation as HashMapInsertSequence } from '../DataStructures/HashBased/HashMap/Insert/InsertAnimation.ts'
import HashMapSearchByKey from '../DataStructures/HashBased/HashMap/SearchByKey/SearchByKey.tsx'
import { SearchByKeyAnimation as HashMapSearchByKeySequence } from '../DataStructures/HashBased/HashMap/SearchByKey/SearchByKeyAnimation.ts'
import HashMapDeleteByKey from '../DataStructures/HashBased/HashMap/DeleteByKey/DeleteByKey.tsx'
import { DeleteByKeyAnimation as HashMapDeleteByKeySequence } from '../DataStructures/HashBased/HashMap/DeleteByKey/DeleteByKeyAnimation.ts'
import HashMapClear from '../DataStructures/HashBased/HashMap/Clear/Clear.tsx'
import { ClearAnimation as HashMapClearSequence } from '../DataStructures/HashBased/HashMap/Clear/ClearAnimation.ts'
import { HashSet } from '../DataStructures/HashBased/HashSet/HashSet.ts'
import HashSetAdd from '../DataStructures/HashBased/HashSet/Add/Add.tsx'
import { AddAnimation as HashSetAddSequence } from '../DataStructures/HashBased/HashSet/Add/AddAnimation.ts'
import HashSetContains from '../DataStructures/HashBased/HashSet/Contains/Contains.tsx'
import { ContainsAnimation as HashSetContainsSequence } from '../DataStructures/HashBased/HashSet/Contains/ContainsAnimation.ts'
import HashSetRemove from '../DataStructures/HashBased/HashSet/Remove/Remove.tsx'
import { RemoveAnimation as HashSetRemoveSequence } from '../DataStructures/HashBased/HashSet/Remove/RemoveAnimation.ts'
import HashSetClear from '../DataStructures/HashBased/HashSet/Clear/Clear.tsx'
import { ClearAnimation as HashSetClearSequence } from '../DataStructures/HashBased/HashSet/Clear/ClearAnimation.ts'
import { BloomFilter } from '../DataStructures/HashBased/BloomFilter/BloomFilter.ts'
import BloomFilterAdd from '../DataStructures/HashBased/BloomFilter/Add/Add.tsx'
import { AddAnimation as BloomFilterAddSequence } from '../DataStructures/HashBased/BloomFilter/Add/AddAnimation.ts'
import BloomFilterCheckMembership from '../DataStructures/HashBased/BloomFilter/CheckMembership/CheckMembership.tsx'
import { CheckMembershipAnimation as BloomFilterCheckMembershipSequence } from '../DataStructures/HashBased/BloomFilter/CheckMembership/CheckMembershipAnimation.ts'
import BloomFilterClear from '../DataStructures/HashBased/BloomFilter/Clear/Clear.tsx'
import { ClearAnimation as BloomFilterClearSequence } from '../DataStructures/HashBased/BloomFilter/Clear/ClearAnimation.ts'
import { AVLTree } from '../DataStructures/Trees/AVLTree/AVLTree.ts'
import AVLTreeInsert from '../DataStructures/Trees/AVLTree/Insert/Insert.tsx'
import { InsertionAnimation as AVLTreeInsertSequence } from '../DataStructures/Trees/AVLTree/Insert/InsertionAnimation.ts'
import AVLTreeSearchByKey from '../DataStructures/Trees/AVLTree/SearchByKey/SearchByKey.tsx'
import { SearchAnimation as AVLTreeSearchByKeySequence } from '../DataStructures/Trees/AVLTree/SearchByKey/SearchAnimation.ts'
import AVLTreeDeleteByKey from '../DataStructures/Trees/AVLTree/DeleteByKey/DeleteByKey.tsx'
import { DeletionAnimation as AVLTreeDeleteByKeySequence } from '../DataStructures/Trees/AVLTree/DeleteByKey/DeletionAnimation.ts'
import AVLTreeClear from '../DataStructures/Trees/AVLTree/Clear/Clear.tsx'
import { ClearAnimation as AVLTreeClearSequence } from '../DataStructures/Trees/AVLTree/Clear/ClearAnimation.ts'
import { RedBlackTree } from '../DataStructures/Trees/RedBlackTree/RedBlackTree.ts'
import RedBlackTreeInsert from '../DataStructures/Trees/RedBlackTree/Insert/Insert.tsx'
import { InsertionAnimation as RedBlackTreeInsertSequence } from '../DataStructures/Trees/RedBlackTree/Insert/InsertionAnimation.ts'
import RedBlackTreeSearchByKey from '../DataStructures/Trees/RedBlackTree/SearchByKey/SearchByKey.tsx'
import { SearchAnimation as RedBlackTreeSearchByKeySequence } from '../DataStructures/Trees/RedBlackTree/SearchByKey/SearchAnimation.ts'
import RedBlackTreeDeleteByKey from '../DataStructures/Trees/RedBlackTree/DeleteByKey/DeleteByKey.tsx'
import { DeletionAnimation as RedBlackTreeDeleteByKeySequence } from '../DataStructures/Trees/RedBlackTree/DeleteByKey/DeletionAnimation.ts'
import RedBlackTreeClear from '../DataStructures/Trees/RedBlackTree/Clear/Clear.tsx'
import { ClearAnimation as RedBlackTreeClearSequence } from '../DataStructures/Trees/RedBlackTree/Clear/ClearAnimation.ts'
import { BTree } from '../DataStructures/Trees/BTree/BTree.ts'
import BTreeInsert from '../DataStructures/Trees/BTree/Insert/Insert.tsx'
import { InsertionAnimation as BTreeInsertSequence } from '../DataStructures/Trees/BTree/Insert/InsertionAnimation.ts'
import BTreeSearchByKey from '../DataStructures/Trees/BTree/SearchByKey/SearchByKey.tsx'
import { SearchAnimation as BTreeSearchByKeySequence } from '../DataStructures/Trees/BTree/SearchByKey/SearchAnimation.ts'
import BTreeDeleteByKey from '../DataStructures/Trees/BTree/DeleteByKey/DeleteByKey.tsx'
import { DeletionAnimation as BTreeDeleteByKeySequence } from '../DataStructures/Trees/BTree/DeleteByKey/DeletionAnimation.ts'
import BTreeClear from '../DataStructures/Trees/BTree/Clear/Clear.tsx'
import { ClearAnimation as BTreeClearSequence } from '../DataStructures/Trees/BTree/Clear/ClearAnimation.ts'
import { BPlusTree } from '../DataStructures/Trees/BPlusTree/BPlusTree.ts'
import BPlusTreeInsert from '../DataStructures/Trees/BPlusTree/Insert/Insert.tsx'
import { InsertionAnimation as BPlusTreeInsertSequence } from '../DataStructures/Trees/BPlusTree/Insert/InsertionAnimation.ts'
import BPlusTreeSearchByKey from '../DataStructures/Trees/BPlusTree/SearchByKey/SearchByKey.tsx'
import { SearchAnimation as BPlusTreeSearchByKeySequence } from '../DataStructures/Trees/BPlusTree/SearchByKey/SearchAnimation.ts'
import BPlusTreeDeleteByKey from '../DataStructures/Trees/BPlusTree/DeleteByKey/DeleteByKey.tsx'
import { DeletionAnimation as BPlusTreeDeleteByKeySequence } from '../DataStructures/Trees/BPlusTree/DeleteByKey/DeletionAnimation.ts'
import BPlusTreeClear from '../DataStructures/Trees/BPlusTree/Clear/Clear.tsx'
import { ClearAnimation as BPlusTreeClearSequence } from '../DataStructures/Trees/BPlusTree/Clear/ClearAnimation.ts'
import BPlusTreeRangeFromKey from '../DataStructures/Trees/BPlusTree/RangeFromKey/RangeFromKey.tsx'
import { RangeAnimation as BPlusTreeRangeFromKeySequence } from '../DataStructures/Trees/BPlusTree/RangeFromKey/RangeAnimation.ts'
import ArrayClear from '../DataStructures/Linear/Array/Clear/Clear.tsx'
import BubbleSorting from '../DataStructures/Linear/Array/BubbleSorting/BubbleSorting.tsx'
import { BubbleSortingAnimation } from '../DataStructures/Linear/Array/BubbleSorting/BubbleSortingAnimation.ts'
import SelectionSort from '../DataStructures/Linear/Array/SelectionSort/SelectionSort.tsx'
import { SelectionSortAnimation } from '../DataStructures/Linear/Array/SelectionSort/SelectionSortAnimation.ts'
import InsertionSort from '../DataStructures/Linear/Array/InsertionSort/InsertionSort.tsx'
import { InsertionSortAnimation } from '../DataStructures/Linear/Array/InsertionSort/InsertionSortAnimation.ts'
import BinaryInsertionSort from '../DataStructures/Linear/Array/BinaryInsertionSort/BinaryInsertionSort.tsx'
import { BinaryInsertionSortAnimation } from '../DataStructures/Linear/Array/BinaryInsertionSort/BinaryInsertionSortAnimation.ts'
import MergeSort from '../DataStructures/Linear/Array/MergeSort/MergeSort.tsx'
import { MergeSortAnimation } from '../DataStructures/Linear/Array/MergeSort/MergeSortAnimation.ts'
import QuickSort from '../DataStructures/Linear/Array/QuickSort/QuickSort.tsx'
import { QuickSortAnimation } from '../DataStructures/Linear/Array/QuickSort/QuickSortAnimation.ts'
import HeapSort from '../DataStructures/Linear/Array/HeapSort/HeapSort.tsx'
import { HeapSortAnimation } from '../DataStructures/Linear/Array/HeapSort/HeapSortAnimation.ts'
import ShellSort from '../DataStructures/Linear/Array/ShellSort/ShellSort.tsx'
import { ShellSortAnimation } from '../DataStructures/Linear/Array/ShellSort/ShellSortAnimation.ts'
import CountingSort from '../DataStructures/Linear/Array/CountingSort/CountingSort.tsx'
import { CountingSortAnimation } from '../DataStructures/Linear/Array/CountingSort/CountingSortAnimation.ts'
import RadixSort from '../DataStructures/Linear/Array/RadixSort/RadixSort.tsx'
import { RadixSortAnimation } from '../DataStructures/Linear/Array/RadixSort/RadixSortAnimation.ts'
import BucketSort from '../DataStructures/Linear/Array/BucketSort/BucketSort.tsx'
import { BucketSortAnimation } from '../DataStructures/Linear/Array/BucketSort/BucketSortAnimation.ts'
import TimSort from '../DataStructures/Linear/Array/TimSort/TimSort.tsx'
import { TimSortAnimation } from '../DataStructures/Linear/Array/TimSort/TimSortAnimation.ts'
import IntroSort from '../DataStructures/Linear/Array/IntroSort/IntroSort.tsx'
import { IntroSortAnimation } from '../DataStructures/Linear/Array/IntroSort/IntroSortAnimation.ts'
import DualPivotQuickSort from '../DataStructures/Linear/Array/DualPivotQuickSort/DualPivotQuickSort.tsx'
import { DualPivotQuickSortAnimation } from '../DataStructures/Linear/Array/DualPivotQuickSort/DualPivotQuickSortAnimation.ts'
import BlockMergeSort from '../DataStructures/Linear/Array/BlockMergeSort/BlockMergeSort.tsx'
import { BlockMergeSortAnimation } from '../DataStructures/Linear/Array/BlockMergeSort/BlockMergeSortAnimation.ts'
import WikiSort from '../DataStructures/Linear/Array/WikiSort/WikiSort.tsx'
import { WikiSortAnimation } from '../DataStructures/Linear/Array/WikiSort/WikiSortAnimation.ts'
import Smoothsort from '../DataStructures/Linear/Array/Smoothsort/Smoothsort.tsx'
import { SmoothsortAnimation } from '../DataStructures/Linear/Array/Smoothsort/SmoothsortAnimation.ts'
import TreeSort from '../DataStructures/Linear/Array/TreeSort/TreeSort.tsx'
import { TreeSortAnimation } from '../DataStructures/Linear/Array/TreeSort/TreeSortAnimation.ts'
import TournamentSort from '../DataStructures/Linear/Array/TournamentSort/TournamentSort.tsx'
import { TournamentSortAnimation } from '../DataStructures/Linear/Array/TournamentSort/TournamentSortAnimation.ts'
import PatienceSort from '../DataStructures/Linear/Array/PatienceSort/PatienceSort.tsx'
import { PatienceSortAnimation } from '../DataStructures/Linear/Array/PatienceSort/PatienceSortAnimation.ts'
import CycleSort from '../DataStructures/Linear/Array/CycleSort/CycleSort.tsx'
import { CycleSortAnimation } from '../DataStructures/Linear/Array/CycleSort/CycleSortAnimation.ts'
import CombSort from '../DataStructures/Linear/Array/CombSort/CombSort.tsx'
import { CombSortAnimation } from '../DataStructures/Linear/Array/CombSort/CombSortAnimation.ts'
import CocktailShakerSort from '../DataStructures/Linear/Array/CocktailShakerSort/CocktailShakerSort.tsx'
import { CocktailShakerSortAnimation } from '../DataStructures/Linear/Array/CocktailShakerSort/CocktailShakerSortAnimation.ts'
import GnomeSort from '../DataStructures/Linear/Array/GnomeSort/GnomeSort.tsx'
import { GnomeSortAnimation } from '../DataStructures/Linear/Array/GnomeSort/GnomeSortAnimation.ts'
import OddEvenSort from '../DataStructures/Linear/Array/OddEvenSort/OddEvenSort.tsx'
import { OddEvenSortAnimation } from '../DataStructures/Linear/Array/OddEvenSort/OddEvenSortAnimation.ts'
import OddEvenMergeSort from '../DataStructures/Linear/Array/OddEvenMergeSort/OddEvenMergeSort.tsx'
import { OddEvenMergeSortAnimation } from '../DataStructures/Linear/Array/OddEvenMergeSort/OddEvenMergeSortAnimation.ts'
import BitonicSort from '../DataStructures/Linear/Array/BitonicSort/BitonicSort.tsx'
import { BitonicSortAnimation } from '../DataStructures/Linear/Array/BitonicSort/BitonicSortAnimation.ts'
import PairwiseSortingNetwork from '../DataStructures/Linear/Array/PairwiseSortingNetwork/PairwiseSortingNetwork.tsx'
import { PairwiseSortingNetworkAnimation } from '../DataStructures/Linear/Array/PairwiseSortingNetwork/PairwiseSortingNetworkAnimation.ts'
import SampleSort from '../DataStructures/Linear/Array/SampleSort/SampleSort.tsx'
import { SampleSortAnimation } from '../DataStructures/Linear/Array/SampleSort/SampleSortAnimation.ts'
import ParallelMergeSort from '../DataStructures/Linear/Array/ParallelMergeSort/ParallelMergeSort.tsx'
import { ParallelMergeSortAnimation } from '../DataStructures/Linear/Array/ParallelMergeSort/ParallelMergeSortAnimation.ts'
import ParallelQuickSort from '../DataStructures/Linear/Array/ParallelQuickSort/ParallelQuickSort.tsx'
import { ParallelQuickSortAnimation } from '../DataStructures/Linear/Array/ParallelQuickSort/ParallelQuickSortAnimation.ts'
import ExternalMergeSort from '../DataStructures/Linear/Array/ExternalMergeSort/ExternalMergeSort.tsx'
import { ExternalMergeSortAnimation } from '../DataStructures/Linear/Array/ExternalMergeSort/ExternalMergeSortAnimation.ts'
import PolyphaseMergeSort from '../DataStructures/Linear/Array/PolyphaseMergeSort/PolyphaseMergeSort.tsx'
import { PolyphaseMergeSortAnimation } from '../DataStructures/Linear/Array/PolyphaseMergeSort/PolyphaseMergeSortAnimation.ts'
import NaturalMergeSort from '../DataStructures/Linear/Array/NaturalMergeSort/NaturalMergeSort.tsx'
import { NaturalMergeSortAnimation } from '../DataStructures/Linear/Array/NaturalMergeSort/NaturalMergeSortAnimation.ts'
import Flashsort from '../DataStructures/Linear/Array/Flashsort/Flashsort.tsx'
import { FlashsortAnimation } from '../DataStructures/Linear/Array/Flashsort/FlashsortAnimation.ts'
import AmericanFlagSort from '../DataStructures/Linear/Array/AmericanFlagSort/AmericanFlagSort.tsx'
import { AmericanFlagSortAnimation } from '../DataStructures/Linear/Array/AmericanFlagSort/AmericanFlagSortAnimation.ts'
import Spreadsort from '../DataStructures/Linear/Array/Spreadsort/Spreadsort.tsx'
import { SpreadsortAnimation } from '../DataStructures/Linear/Array/Spreadsort/SpreadsortAnimation.ts'
import Burstsort from '../DataStructures/Linear/Array/Burstsort/Burstsort.tsx'
import { BurstsortAnimation } from '../DataStructures/Linear/Array/Burstsort/BurstsortAnimation.ts'
import PigeonholeSort from '../DataStructures/Linear/Array/PigeonholeSort/PigeonholeSort.tsx'
import { PigeonholeSortAnimation } from '../DataStructures/Linear/Array/PigeonholeSort/PigeonholeSortAnimation.ts'
import { ClearAnimation as ArrayClearSequence } from '../DataStructures/Linear/Array/Clear/ClearAnimation.ts'
import LinkedListClear from '../DataStructures/Linear/LinkedList/Clear/Clear.tsx'
import { ClearAnimation as LinkedListClearSequence } from '../DataStructures/Linear/LinkedList/Clear/ClearAnimation.ts'
import BinaryTreeClear from '../DataStructures/Trees/BinaryTree/Clear/Clear.tsx'
import { ClearAnimation as BinaryTreeClearSequence } from '../DataStructures/Trees/BinaryTree/Clear/ClearAnimation.ts'
import { Queue } from '../DataStructures/Linear/Queue/Queue.ts'
import QueueEnqueue from '../DataStructures/Linear/Queue/Enqueue/Enqueue.tsx'
import { InsertionAnimation as QueueEnqueueSequence } from '../DataStructures/Linear/Queue/Enqueue/InsertionAnimation.ts'
import QueueDequeue from '../DataStructures/Linear/Queue/Dequeue/Dequeue.tsx'
import { RemovalAnimation as QueueDequeueSequence } from '../DataStructures/Linear/Queue/Dequeue/RemovalAnimation.ts'
import QueuePeek from '../DataStructures/Linear/Queue/Peek/Peek.tsx'
import { PeekAnimation as QueuePeekSequence } from '../DataStructures/Linear/Queue/Peek/PeekAnimation.ts'
import QueueClear from '../DataStructures/Linear/Queue/Clear/Clear.tsx'
import { ClearAnimation as QueueClearSequence } from '../DataStructures/Linear/Queue/Clear/ClearAnimation.ts'
import QueueSearchByValue from '../DataStructures/Linear/Queue/SearchByValue/SearchByValue.tsx'
import { SearchAnimation as QueueSearchByValueSequence } from '../DataStructures/Linear/Queue/SearchByValue/SearchAnimation.ts'
import { Deque } from '../DataStructures/Linear/Deque/Deque.ts'
import DequePushFront from '../DataStructures/Linear/Deque/PushFront/PushFront.tsx'
import { InsertionAnimation as DequePushFrontSequence } from '../DataStructures/Linear/Deque/PushFront/InsertionAnimation.ts'
import DequePushBack from '../DataStructures/Linear/Deque/PushBack/PushBack.tsx'
import { InsertionAnimation as DequePushBackSequence } from '../DataStructures/Linear/Deque/PushBack/InsertionAnimation.ts'
import DequePopFront from '../DataStructures/Linear/Deque/PopFront/PopFront.tsx'
import { RemovalAnimation as DequePopFrontSequence } from '../DataStructures/Linear/Deque/PopFront/RemovalAnimation.ts'
import DequePopBack from '../DataStructures/Linear/Deque/PopBack/PopBack.tsx'
import { RemovalAnimation as DequePopBackSequence } from '../DataStructures/Linear/Deque/PopBack/RemovalAnimation.ts'
import DequePeekFront from '../DataStructures/Linear/Deque/PeekFront/PeekFront.tsx'
import { PeekAnimation as DequePeekFrontSequence } from '../DataStructures/Linear/Deque/PeekFront/PeekAnimation.ts'
import DequePeekBack from '../DataStructures/Linear/Deque/PeekBack/PeekBack.tsx'
import { PeekAnimation as DequePeekBackSequence } from '../DataStructures/Linear/Deque/PeekBack/PeekAnimation.ts'
import DequeClear from '../DataStructures/Linear/Deque/Clear/Clear.tsx'
import { ClearAnimation as DequeClearSequence } from '../DataStructures/Linear/Deque/Clear/ClearAnimation.ts'
import DequeSearchByValue from '../DataStructures/Linear/Deque/SearchByValue/SearchByValue.tsx'
import { SearchAnimation as DequeSearchByValueSequence } from '../DataStructures/Linear/Deque/SearchByValue/SearchAnimation.ts'
import { DoublyLinkedList } from '../DataStructures/Linear/DoublyLinkedList/DoublyLinkedList.ts'
import DoublyLinkedListAddInTheMiddle from '../DataStructures/Linear/DoublyLinkedList/AddInTheMiddle/AddInTheMiddle.tsx'
import { InsertionAnimation as DoublyLinkedListAddInTheMiddleSequence } from '../DataStructures/Linear/DoublyLinkedList/AddInTheMiddle/InsertionAnimation.ts'
import DoublyLinkedListAddAtStart from '../DataStructures/Linear/DoublyLinkedList/AddAtStart/AddAtStart.tsx'
import { InsertionAnimation as DoublyLinkedListAddAtStartSequence } from '../DataStructures/Linear/DoublyLinkedList/AddAtStart/InsertionAnimation.ts'
import DoublyLinkedListAddAtEnd from '../DataStructures/Linear/DoublyLinkedList/AddAtEnd/AddAtEnd.tsx'
import { InsertionAnimation as DoublyLinkedListAddAtEndSequence } from '../DataStructures/Linear/DoublyLinkedList/AddAtEnd/InsertionAnimation.ts'
import DoublyLinkedListDeleteAtStart from '../DataStructures/Linear/DoublyLinkedList/DeleteAtStart/DeleteAtStart.tsx'
import { RemovalAnimation as DoublyLinkedListDeleteAtStartSequence } from '../DataStructures/Linear/DoublyLinkedList/DeleteAtStart/RemovalAnimation.ts'
import DoublyLinkedListDeleteAtEnd from '../DataStructures/Linear/DoublyLinkedList/DeleteAtEnd/DeleteAtEnd.tsx'
import { RemovalAnimation as DoublyLinkedListDeleteAtEndSequence } from '../DataStructures/Linear/DoublyLinkedList/DeleteAtEnd/RemovalAnimation.ts'
import DoublyLinkedListDeleteByValue from '../DataStructures/Linear/DoublyLinkedList/DeleteByValue/DeleteByValue.tsx'
import { RemovalAnimation as DoublyLinkedListDeleteByValueSequence } from '../DataStructures/Linear/DoublyLinkedList/DeleteByValue/RemovalAnimation.ts'
import DoublyLinkedListSearchByValue from '../DataStructures/Linear/DoublyLinkedList/SearchByValue/SearchByValue.tsx'
import { SearchAnimation as DoublyLinkedListSearchByValueSequence } from '../DataStructures/Linear/DoublyLinkedList/SearchByValue/SearchAnimation.ts'
import DoublyLinkedListSearchByIndex from '../DataStructures/Linear/DoublyLinkedList/SearchByIndex/SearchByIndex.tsx'
import { SearchAnimation as DoublyLinkedListSearchByIndexSequence } from '../DataStructures/Linear/DoublyLinkedList/SearchByIndex/SearchAnimation.ts'
import DoublyLinkedListClear from '../DataStructures/Linear/DoublyLinkedList/Clear/Clear.tsx'
import { ClearAnimation as DoublyLinkedListClearSequence } from '../DataStructures/Linear/DoublyLinkedList/Clear/ClearAnimation.ts'
import { CircularBuffer } from '../DataStructures/Linear/CircularBuffer/CircularBuffer.ts'
import CircularBufferEnqueue from '../DataStructures/Linear/CircularBuffer/Enqueue/Enqueue.tsx'
import { EnqueueAnimation as CircularBufferEnqueueSequence } from '../DataStructures/Linear/CircularBuffer/Enqueue/EnqueueAnimation.ts'
import CircularBufferDequeue from '../DataStructures/Linear/CircularBuffer/Dequeue/Dequeue.tsx'
import { DequeueAnimation as CircularBufferDequeueSequence } from '../DataStructures/Linear/CircularBuffer/Dequeue/DequeueAnimation.ts'
import CircularBufferPeek from '../DataStructures/Linear/CircularBuffer/Peek/Peek.tsx'
import { PeekAnimation as CircularBufferPeekSequence } from '../DataStructures/Linear/CircularBuffer/Peek/PeekAnimation.ts'
import CircularBufferClear from '../DataStructures/Linear/CircularBuffer/Clear/Clear.tsx'
import { ClearAnimation as CircularBufferClearSequence } from '../DataStructures/Linear/CircularBuffer/Clear/ClearAnimation.ts'
import CircularBufferSearchByValue from '../DataStructures/Linear/CircularBuffer/SearchByValue/SearchByValue.tsx'
import { SearchAnimation as CircularBufferSearchByValueSequence } from '../DataStructures/Linear/CircularBuffer/SearchByValue/SearchAnimation.ts'
import { Stack } from '../DataStructures/Linear/Stack/Stack.ts'
import StackPush from '../DataStructures/Linear/Stack/Push/Push.tsx'
import { PushAnimation as StackPushSequence } from '../DataStructures/Linear/Stack/Push/PushAnimation.ts'
import StackPop from '../DataStructures/Linear/Stack/Pop/Pop.tsx'
import { PopAnimation as StackPopSequence } from '../DataStructures/Linear/Stack/Pop/PopAnimation.ts'
import StackPeek from '../DataStructures/Linear/Stack/Peek/Peek.tsx'
import { PeekAnimation as StackPeekSequence } from '../DataStructures/Linear/Stack/Peek/PeekAnimation.ts'
import StackClear from '../DataStructures/Linear/Stack/Clear/Clear.tsx'
import { ClearAnimation as StackClearSequence } from '../DataStructures/Linear/Stack/Clear/ClearAnimation.ts'
import StackSearchByValue from '../DataStructures/Linear/Stack/SearchByValue/SearchByValue.tsx'
import { SearchAnimation as StackSearchByValueSequence } from '../DataStructures/Linear/Stack/SearchByValue/SearchAnimation.ts'
import type { ReactNode } from 'react'
import { ActionCatalog } from '../../visualization/ActionCatalog.ts'
import { AlgorithmTechnologyCatalog } from '../../visualization/AlgorithmTechnologyCatalog.ts'
import type { ActionKind, ActionScope } from '../../visualization/ActionCatalog.ts'
import { Graph } from '../DataStructures/Graphs/SimpleGraph/Graph.ts'
import BinaryTreeDeleteByKey from '../DataStructures/Trees/BinaryTree/DeleteByKey/DeleteByKey.tsx'
import { DeletionAnimation as BinaryTreeDeleteByKeySequence } from '../DataStructures/Trees/BinaryTree/DeleteByKey/DeletionAnimation.ts'
import BinaryTreeSearchByKey from '../DataStructures/Trees/BinaryTree/SearchByKey/SearchByKey.tsx'
import { SearchAnimation as BinaryTreeSearchByKeySequence } from '../DataStructures/Trees/BinaryTree/SearchByKey/SearchAnimation.ts'
import ArrayDeleteByValue from '../DataStructures/Linear/Array/DeleteByValue/DeleteByValue.tsx'
import { DeletionAnimation as ArrayDeleteByValueSequence } from '../DataStructures/Linear/Array/DeleteByValue/DeletionAnimation.ts'
import ArraySearchByValue from '../DataStructures/Linear/Array/SearchByValue/SearchByValue.tsx'
import { SearchAnimation as ArraySearchByValueSequence } from '../DataStructures/Linear/Array/SearchByValue/SearchAnimation.ts'
import ArraySearchByIndex from '../DataStructures/Linear/Array/SearchByIndex/SearchByIndex.tsx'
import { SearchAnimation as ArraySearchByIndexSequence } from '../DataStructures/Linear/Array/SearchByIndex/SearchAnimation.ts'
import ArrayAddAtEnd from '../DataStructures/Linear/Array/AddAtEnd/AddAtEnd.tsx'
import { InsertionAnimation as ArrayAddAtEndSequence } from '../DataStructures/Linear/Array/AddAtEnd/InsertionAnimation.ts'
import ArrayAddAtStart from '../DataStructures/Linear/Array/AddAtStart/AddAtStart.tsx'
import { InsertionAnimation as ArrayAddAtStartSequence } from '../DataStructures/Linear/Array/AddAtStart/InsertionAnimation.ts'
import LinkedListDeleteByValue from '../DataStructures/Linear/LinkedList/DeleteByValue/DeleteByValue.tsx'
import { DeletionAnimation as LinkedListDeleteByValueSequence } from '../DataStructures/Linear/LinkedList/DeleteByValue/DeletionAnimation.ts'
import LinkedListSearchByValue from '../DataStructures/Linear/LinkedList/SearchByValue/SearchByValue.tsx'
import { SearchAnimation as LinkedListSearchByValueSequence } from '../DataStructures/Linear/LinkedList/SearchByValue/SearchAnimation.ts'
import LinkedListSearchByIndex from '../DataStructures/Linear/LinkedList/SearchByIndex/SearchByIndex.tsx'
import { SearchAnimation as LinkedListSearchByIndexSequence } from '../DataStructures/Linear/LinkedList/SearchByIndex/SearchAnimation.ts'
import LinkedListAddAtEnd from '../DataStructures/Linear/LinkedList/AddAtEnd/AddAtEnd.tsx'
import { InsertionAnimation as LinkedListAddAtEndSequence } from '../DataStructures/Linear/LinkedList/AddAtEnd/InsertionAnimation.ts'
import LinkedListAddAtStart from '../DataStructures/Linear/LinkedList/AddAtStart/AddAtStart.tsx'
import { InsertionAnimation as LinkedListAddAtStartSequence } from '../DataStructures/Linear/LinkedList/AddAtStart/InsertionAnimation.ts'
import { Component, createRef } from 'react'
import MainMenu from '../MainMenu/MainMenu.tsx'
import ActionMenu from '../MainMenu/ActionMenu/ActionMenu.tsx'
import AlgorithmInfo from '../AlgorithmInfo/AlgorithmInfo.tsx'
import StructureInfo from '../StructureInfo/StructureInfo.tsx'
import ActionInput from '../ActionInput/ActionInput.tsx'
import { ActionInputRequest } from '../../visualization/ActionInputRequest.ts'
import { MenuNavigation } from '../MainMenu/MenuNavigation.ts'
import type { MenuCategoryKind, AlgorithmGroupKind } from '../MainMenu/MenuNavigation.ts'
import type { StructureGroupKind } from '../../visualization/StructureCatalog.ts'
import Renderer from '../Renderer/Renderer.tsx'
import AddInTheMiddle from '../DataStructures/Linear/LinkedList/AddInTheMiddle/AddInTheMiddle.tsx'
import { InsertionAnimation } from '../DataStructures/Linear/LinkedList/AddInTheMiddle/InsertionAnimation.ts'
import ArrayAddInTheMiddle from '../DataStructures/Linear/Array/AddInTheMiddle/AddInTheMiddle.tsx'
import { InsertionAnimation as ArrayInsertionAnimation } from '../DataStructures/Linear/Array/AddInTheMiddle/InsertionAnimation.ts'
import { FixedArray } from '../DataStructures/Linear/Array/FixedArray.ts'
import { LinkedList } from '../DataStructures/Linear/LinkedList/LinkedList.ts'
import { BinaryTree } from '../DataStructures/Trees/BinaryTree/BinaryTree.ts'
import TreeInsert from '../DataStructures/Trees/BinaryTree/Insert/Insert.tsx'
import { InsertionAnimation as TreeInsertionAnimation } from '../DataStructures/Trees/BinaryTree/Insert/InsertionAnimation.ts'
import { StructureCatalog } from '../../visualization/StructureCatalog.ts'
import type { Scene, StructureKind } from '../../visualization/Scene.ts'
import type { AlgorithmInformation } from '../../visualization/AlgorithmInformation.ts'
import { AdditionalTreeCatalog } from '../../visualization/AdditionalTreeCatalog.ts'
import type { AdditionalTreeModel, TreeInputValues } from '../../visualization/AdditionalTreeModel.ts'
import { TreeFeatures } from '../DataStructures/Trees/TreeFeatures.tsx'
import './App.css'

interface AppState {
  readonly treeInput: TreeInputValues
  readonly selected: StructureKind | null
  readonly selectedScope: ActionScope
  readonly menuOpen: boolean
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
  private additionalTrees = AdditionalTreeCatalog.createModels()
  private list = LinkedList.createDefault()
  private array = FixedArray.createDefault()
  private tree = BinaryTree.createDefault()
  private avlTree = AVLTree.createDefault()
  private redBlackTree = RedBlackTree.createDefault()
  private bTree = BTree.createDefault()
  private bPlusTree = BPlusTree.createDefault()
  private readonly menuButton = createRef<HTMLButtonElement>()
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

  private openMenu = (): void => {
    this.setState({
      menuOpen: true,
      menu: this.state.selected ? MenuNavigation.forStructure(this.state.selected, this.state.selectedScope) : new MenuNavigation(),
    })
  }

  private closeMenu = (): void => {
    this.setState({ menuOpen: false }, this.restoreMenuFocus)
  }

  private restoreMenuFocus = (): void => {
    this.menuButton.current?.focus()
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

  private selectGroup = (group: StructureGroupKind): void => {
    this.setState({ menu: this.state.menu.selectGroup(group) })
  }

  private backInMenu = (): void => {
    this.setState({ menu: this.state.menu.back() })
  }

  private selectStructure = (kind: StructureKind): void => {
    const menu = this.state.menu.selectStructure(kind)
    const changingScope = this.state.selected === kind && this.state.selectedScope !== menu.actionScope
    if (!changingScope) {
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
      ),
      actionOpen: false,
      selectedAction: null,
      actionValue: undefined,
      actionUpperValue: undefined,
      actionRunning: false,
      inputRequest: null,
      menu,
      menuOpen: false,
      algorithmInformation: null,
      overviewInformation: null,
      structureInformation: null,
      actionSession: this.state.actionSession + 1,
    }, this.focusActions)
  }

  private selectAction = (action: ActionKind): void => {
    if (!this.state.selected) return
    if (ActionInputRequest.supportsStructure(this.state.selected) && this.state.actionRunning) return
    if (!ActionCatalog.getScopedActions(this.state.selected, this.state.selectedScope).some((choice) => choice.kind === action)) return
    if (ActionInputRequest.supportsStructure(this.state.selected)) {
      const graph = this.graphModels.get(this.state.selected)
      const context = graph ? { vertices: graph.getEntries().map((entry) => entry.value), edges: graph.getEdges().map((edge) => edge.number) } : undefined
      const request = ActionInputRequest.create(this.state.selected, action, this.getInputSize(this.state.selected), context)
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

  private describeActionDetails(action: ActionKind): AlgorithmInformation | null {
    const graph = this.state.selected ? this.graphModels.get(this.state.selected) : undefined
    if (graph) return GraphFeatures.describe(action, graph)
    const additional = this.state.selected ? this.additionalTrees.get(this.state.selected) : undefined
    if (additional) return TreeFeatures.describe(action, additional)
    if (this.state.selected === 'hash-map') {
      switch (action) {
        case 'insert': return HashMapInsertSequence.describe(this.hashMap.length)
        case 'search-value': return HashMapSearchByKeySequence.describe(this.hashMap.length)
        case 'delete-value': return HashMapDeleteByKeySequence.describe(this.hashMap.length)
        case 'clear': return HashMapClearSequence.describe(this.hashMap.length)
      }
    }
    if (this.state.selected === 'hash-set') {
      switch (action) {
        case 'insert': return HashSetAddSequence.describe(this.hashSet.length)
        case 'search-value': return HashSetContainsSequence.describe(this.hashSet.length)
        case 'delete-value': return HashSetRemoveSequence.describe(this.hashSet.length)
        case 'clear': return HashSetClearSequence.describe(this.hashSet.length)
      }
    }
    if (this.state.selected === 'bloom-filter') {
      switch (action) {
        case 'insert': return BloomFilterAddSequence.describe(this.bloomFilter.length)
        case 'search-value': return BloomFilterCheckMembershipSequence.describe(this.bloomFilter.length)
        case 'clear': return BloomFilterClearSequence.describe(this.bloomFilter.length)
      }
    }
    if (this.state.selected === 'avl-tree') {
      switch (action) {
        case 'insert': return AVLTreeInsertSequence.describe(this.avlTree.length)
        case 'search-value': return AVLTreeSearchByKeySequence.describe(this.avlTree.length)
        case 'delete-value': return AVLTreeDeleteByKeySequence.describe(this.avlTree.length)
        case 'clear': return AVLTreeClearSequence.describe(this.avlTree.length)
      }
    }
    if (this.state.selected === 'red-black-tree') {
      switch (action) {
        case 'insert': return RedBlackTreeInsertSequence.describe(this.redBlackTree.length)
        case 'search-value': return RedBlackTreeSearchByKeySequence.describe(this.redBlackTree.length)
        case 'delete-value': return RedBlackTreeDeleteByKeySequence.describe(this.redBlackTree.length)
        case 'clear': return RedBlackTreeClearSequence.describe(this.redBlackTree.length)
      }
    }
    if (this.state.selected === 'b-tree') {
      switch (action) {
        case 'insert': return BTreeInsertSequence.describe(this.bTree.length)
        case 'search-value': return BTreeSearchByKeySequence.describe(this.bTree.length)
        case 'delete-value': return BTreeDeleteByKeySequence.describe(this.bTree.length)
        case 'clear': return BTreeClearSequence.describe(this.bTree.length)
      }
    }
    if (this.state.selected === 'b-plus-tree') {
      switch (action) {
        case 'insert': return BPlusTreeInsertSequence.describe(this.bPlusTree.length)
        case 'search-value': return BPlusTreeSearchByKeySequence.describe(this.bPlusTree.length)
        case 'delete-value': return BPlusTreeDeleteByKeySequence.describe(this.bPlusTree.length)
        case 'clear': return BPlusTreeClearSequence.describe(this.bPlusTree.length)
        case 'range-from-value': return BPlusTreeRangeFromKeySequence.describe(this.bPlusTree.length)
      }
    }
    if (this.state.selected === 'queue') {
      switch (action) {
        case 'enqueue': return QueueEnqueueSequence.describe(this.queue.length)
        case 'dequeue': return QueueDequeueSequence.describe(this.queue.length)
        case 'peek': return QueuePeekSequence.describe(this.queue.length)
        case 'clear': return QueueClearSequence.describe(this.queue.length)
        case 'search-value': return QueueSearchByValueSequence.describe(this.queue.length)
      }
    }
    if (this.state.selected === 'deque') {
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
    if (this.state.selected === 'doubly-linked-list') {
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
    if (this.state.selected === 'circular-buffer') {
      switch (action) {
        case 'enqueue': return CircularBufferEnqueueSequence.describe(this.buffer.length)
        case 'dequeue': return CircularBufferDequeueSequence.describe(this.buffer.length)
        case 'peek': return CircularBufferPeekSequence.describe(this.buffer.length)
        case 'clear': return CircularBufferClearSequence.describe(this.buffer.length)
        case 'search-value': return CircularBufferSearchByValueSequence.describe(this.buffer.length)
      }
    }
    if (this.state.selected === 'stack') {
      switch (action) {
        case 'push': return StackPushSequence.describe(this.stack.length)
        case 'pop': return StackPopSequence.describe(this.stack.length)
        case 'peek': return StackPeekSequence.describe(this.stack.length)
        case 'clear': return StackClearSequence.describe(this.stack.length)
        case 'search-value': return StackSearchByValueSequence.describe(this.stack.length)
      }
    }
    if (this.state.selected === 'linked-list') {
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
    if (this.state.selected === 'array') {
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
        case 'clear': return ArrayClearSequence.describe(this.array.length)
        case 'insert-middle': return ArrayInsertionAnimation.describe(this.array.length)
        case 'insert-start': return ArrayAddAtStartSequence.describe(this.array.length)
        case 'insert-end': return ArrayAddAtEndSequence.describe(this.array.length)
        case 'search-index': return ArraySearchByIndexSequence.describe(this.array.length)
        case 'search-value': return ArraySearchByValueSequence.describe(this.array.length)
        case 'delete-value': return ArrayDeleteByValueSequence.describe(this.array.length)
      }
    }
    if (this.state.selected === 'binary-tree') {
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
    const graph = this.state.selected ? this.graphModels.get(this.state.selected) : undefined
    if (graph && this.state.selectedAction) return GraphFeatures.render(this.state.selectedAction, {
      model: graph, input: this.state.treeInput,
      onSceneChange: this.updateGraphScene, onComplete: this.completeAction,
    }, this.state.actionSession)
    const additional = this.state.selected ? this.additionalTrees.get(this.state.selected) : undefined
    if (additional && this.state.selectedAction) return TreeFeatures.render(this.state.selectedAction, {
      model: additional, input: this.state.treeInput,
      onSceneChange: this.updateAdditionalTreeScene, onComplete: this.completeAction,
    }, this.state.actionSession)
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
          <div className="brand">
            <span className="brand-mark" aria-hidden="true">cs.</span>
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
        </header>

        <MainMenu
          open={this.state.menuOpen}
          navigation={this.state.menu}
          selected={selected}
          onClose={this.closeMenu}
          onStructureSelected={this.selectStructure}
          onCategorySelected={this.selectCategory}
          onGroupSelected={this.selectGroup}
          onAlgorithmGroupSelected={this.selectAlgorithmGroup}
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
              />
            )}
          </Renderer>
          {this.renderAction()}
        </main>
      </div>
    )
  }
}
