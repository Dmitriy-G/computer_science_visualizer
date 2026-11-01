import assert from 'node:assert/strict'
import { test } from 'node:test'
import { FixedArray } from '../src/components/DataStructures/Linear/Array/FixedArray.ts'
import { SelectionSortAnimation } from '../src/components/DataStructures/Linear/Array/SelectionSort/SelectionSortAnimation.ts'
import { InsertionSortAnimation } from '../src/components/DataStructures/Linear/Array/InsertionSort/InsertionSortAnimation.ts'
import { BinaryInsertionSortAnimation } from '../src/components/DataStructures/Linear/Array/BinaryInsertionSort/BinaryInsertionSortAnimation.ts'
import { MergeSortAnimation } from '../src/components/DataStructures/Linear/Array/MergeSort/MergeSortAnimation.ts'
import { QuickSortAnimation } from '../src/components/DataStructures/Linear/Array/QuickSort/QuickSortAnimation.ts'
import { HeapSortAnimation } from '../src/components/DataStructures/Linear/Array/HeapSort/HeapSortAnimation.ts'
import { ShellSortAnimation } from '../src/components/DataStructures/Linear/Array/ShellSort/ShellSortAnimation.ts'
import { CountingSortAnimation } from '../src/components/DataStructures/Linear/Array/CountingSort/CountingSortAnimation.ts'
import { RadixSortAnimation } from '../src/components/DataStructures/Linear/Array/RadixSort/RadixSortAnimation.ts'
import { BucketSortAnimation } from '../src/components/DataStructures/Linear/Array/BucketSort/BucketSortAnimation.ts'
import { TimSortAnimation } from '../src/components/DataStructures/Linear/Array/TimSort/TimSortAnimation.ts'
import { IntroSortAnimation } from '../src/components/DataStructures/Linear/Array/IntroSort/IntroSortAnimation.ts'
import { DualPivotQuickSortAnimation } from '../src/components/DataStructures/Linear/Array/DualPivotQuickSort/DualPivotQuickSortAnimation.ts'
import { BlockMergeSortAnimation } from '../src/components/DataStructures/Linear/Array/BlockMergeSort/BlockMergeSortAnimation.ts'
import { WikiSortAnimation } from '../src/components/DataStructures/Linear/Array/WikiSort/WikiSortAnimation.ts'
import { SmoothsortAnimation } from '../src/components/DataStructures/Linear/Array/Smoothsort/SmoothsortAnimation.ts'
import { TreeSortAnimation } from '../src/components/DataStructures/Linear/Array/TreeSort/TreeSortAnimation.ts'
import { TournamentSortAnimation } from '../src/components/DataStructures/Linear/Array/TournamentSort/TournamentSortAnimation.ts'
import { PatienceSortAnimation } from '../src/components/DataStructures/Linear/Array/PatienceSort/PatienceSortAnimation.ts'
import { CycleSortAnimation } from '../src/components/DataStructures/Linear/Array/CycleSort/CycleSortAnimation.ts'
import { CombSortAnimation } from '../src/components/DataStructures/Linear/Array/CombSort/CombSortAnimation.ts'
import { CocktailShakerSortAnimation } from '../src/components/DataStructures/Linear/Array/CocktailShakerSort/CocktailShakerSortAnimation.ts'
import { GnomeSortAnimation } from '../src/components/DataStructures/Linear/Array/GnomeSort/GnomeSortAnimation.ts'
import { OddEvenSortAnimation } from '../src/components/DataStructures/Linear/Array/OddEvenSort/OddEvenSortAnimation.ts'
import { OddEvenMergeSortAnimation } from '../src/components/DataStructures/Linear/Array/OddEvenMergeSort/OddEvenMergeSortAnimation.ts'
import { BitonicSortAnimation } from '../src/components/DataStructures/Linear/Array/BitonicSort/BitonicSortAnimation.ts'
import { PairwiseSortingNetworkAnimation } from '../src/components/DataStructures/Linear/Array/PairwiseSortingNetwork/PairwiseSortingNetworkAnimation.ts'
import { SampleSortAnimation } from '../src/components/DataStructures/Linear/Array/SampleSort/SampleSortAnimation.ts'
import { ParallelMergeSortAnimation } from '../src/components/DataStructures/Linear/Array/ParallelMergeSort/ParallelMergeSortAnimation.ts'
import { ParallelQuickSortAnimation } from '../src/components/DataStructures/Linear/Array/ParallelQuickSort/ParallelQuickSortAnimation.ts'
import { ExternalMergeSortAnimation } from '../src/components/DataStructures/Linear/Array/ExternalMergeSort/ExternalMergeSortAnimation.ts'
import { PolyphaseMergeSortAnimation } from '../src/components/DataStructures/Linear/Array/PolyphaseMergeSort/PolyphaseMergeSortAnimation.ts'
import { NaturalMergeSortAnimation } from '../src/components/DataStructures/Linear/Array/NaturalMergeSort/NaturalMergeSortAnimation.ts'
import { FlashsortAnimation } from '../src/components/DataStructures/Linear/Array/Flashsort/FlashsortAnimation.ts'
import { AmericanFlagSortAnimation } from '../src/components/DataStructures/Linear/Array/AmericanFlagSort/AmericanFlagSortAnimation.ts'
import { SpreadsortAnimation } from '../src/components/DataStructures/Linear/Array/Spreadsort/SpreadsortAnimation.ts'
import { BurstsortAnimation } from '../src/components/DataStructures/Linear/Array/Burstsort/BurstsortAnimation.ts'
import { PigeonholeSortAnimation } from '../src/components/DataStructures/Linear/Array/PigeonholeSort/PigeonholeSortAnimation.ts'
import { InterpolationSortAnimation } from '../src/components/DataStructures/Linear/Array/InterpolationSort/InterpolationSortAnimation.ts'
import { LibrarySortAnimation } from '../src/components/DataStructures/Linear/Array/LibrarySort/LibrarySortAnimation.ts'
import { SplaySortAnimation } from '../src/components/DataStructures/Linear/Array/SplaySort/SplaySortAnimation.ts'
import { StrandSortAnimation } from '../src/components/DataStructures/Linear/Array/StrandSort/StrandSortAnimation.ts'
import { PancakeSortAnimation } from '../src/components/DataStructures/Linear/Array/PancakeSort/PancakeSortAnimation.ts'
import { StoogeSortAnimation } from '../src/components/DataStructures/Linear/Array/StoogeSort/StoogeSortAnimation.ts'
import { SlowSortAnimation } from '../src/components/DataStructures/Linear/Array/SlowSort/SlowSortAnimation.ts'
import { BogoSortAnimation } from '../src/components/DataStructures/Linear/Array/BogoSort/BogoSortAnimation.ts'
import { SleepSortAnimation } from '../src/components/DataStructures/Linear/Array/SleepSort/SleepSortAnimation.ts'
import { BogoArraySort } from '../src/components/DataStructures/Linear/Array/BogoArraySort.ts'
import { ActionInputRequest } from '../src/visualization/ActionInputRequest.ts'

const sorts = [
  ['selectionSort', 'selection-sort', SelectionSortAnimation, false],
  ['insertionSort', 'insertion-sort', InsertionSortAnimation, true],
  ['binaryInsertionSort', 'binary-insertion-sort', BinaryInsertionSortAnimation, true],
  ['mergeSort', 'merge-sort', MergeSortAnimation, true],
  ['quickSort', 'quick-sort', QuickSortAnimation, false],
  ['heapSort', 'heap-sort', HeapSortAnimation, false],
  ['shellSort', 'shell-sort', ShellSortAnimation, false],
  ['countingSort', 'counting-sort', CountingSortAnimation, true],
  ['radixSort', 'radix-sort', RadixSortAnimation, true],
  ['bucketSort', 'bucket-sort', BucketSortAnimation, true],
  ['timSort', 'tim-sort', TimSortAnimation, true],
  ['introSort', 'intro-sort', IntroSortAnimation, false],
  ['dualPivotQuickSort', 'dual-pivot-quick-sort', DualPivotQuickSortAnimation, false],
  ['blockMergeSort', 'block-merge-sort', BlockMergeSortAnimation, true],
  ['wikiSort', 'wiki-sort', WikiSortAnimation, true],
  ['smoothSort', 'smooth-sort', SmoothsortAnimation, false],
  ['treeSort', 'tree-sort', TreeSortAnimation, true],
  ['tournamentSort', 'tournament-sort', TournamentSortAnimation, true],
  ['patienceSort', 'patience-sort', PatienceSortAnimation, false],
  ['cycleSort', 'cycle-sort', CycleSortAnimation, false],
  ['combSort', 'comb-sort', CombSortAnimation, false],
  ['cocktailShakerSort', 'cocktail-shaker-sort', CocktailShakerSortAnimation, true],
  ['gnomeSort', 'gnome-sort', GnomeSortAnimation, true],
  ['oddEvenSort', 'odd-even-sort', OddEvenSortAnimation, true],
  ['oddEvenMergeSort', 'odd-even-merge-sort', OddEvenMergeSortAnimation, false],
  ['bitonicSort', 'bitonic-sort', BitonicSortAnimation, false],
  ['pairwiseSortingNetwork', 'pairwise-sorting-network', PairwiseSortingNetworkAnimation, false],
  ['sampleSort', 'sample-sort', SampleSortAnimation, true],
  ['parallelMergeSort', 'parallel-merge-sort', ParallelMergeSortAnimation, true],
  ['parallelQuickSort', 'parallel-quick-sort', ParallelQuickSortAnimation, false],
  ['externalMergeSort', 'external-merge-sort', ExternalMergeSortAnimation, true],
  ['polyphaseMergeSort', 'polyphase-merge-sort', PolyphaseMergeSortAnimation, false],
  ['naturalMergeSort', 'natural-merge-sort', NaturalMergeSortAnimation, true],
  ['flashSort', 'flash-sort', FlashsortAnimation, false],
  ['americanFlagSort', 'american-flag-sort', AmericanFlagSortAnimation, false],
  ['spreadSort', 'spread-sort', SpreadsortAnimation, false],
  ['burstSort', 'burst-sort', BurstsortAnimation, true],
  ['pigeonholeSort', 'pigeonhole-sort', PigeonholeSortAnimation, true],
  ['interpolationSort', 'interpolation-sort', InterpolationSortAnimation, true],
  ['librarySort', 'library-sort', LibrarySortAnimation, true],
  ['splaySort', 'splay-sort', SplaySortAnimation, true],
  ['strandSort', 'strand-sort', StrandSortAnimation, true],
  ['pancakeSort', 'pancake-sort', PancakeSortAnimation, false],
  ['stoogeSort', 'stooge-sort', StoogeSortAnimation, false],
  ['slowSort', 'slow-sort', SlowSortAnimation, false],
  ['sleepSort', 'sleep-sort', SleepSortAnimation, true],
]

const cases = [[], [4], [1, 2, 3, 4], [4, 3, 2, 1], [2, 2, 2], [3, -2, 3, 0, -2], [Number.MAX_SAFE_INTEGER, 0, Number.MIN_SAFE_INTEGER], [2, 2, 1], [4, 1, 3, 1, 2]]

test('Interpolation Sort stably places estimated ranks before collision cleanup', () => {
  const model = new FixedArray([0, 100, 2, 1])
  let arrangement
  const events = []
  model.interpolationSort((event) => {
    events.push(event)
    if (event.kind === 'gather') arrangement = model.getEntries().map((entry) => entry.value)
  })
  assert.deepEqual(arrangement, [0, 2, 1, 100])
  assert.deepEqual(model.getEntries().map((entry) => entry.value), [0, 1, 2, 100])
  assert.equal(events.filter((event) => event.kind === 'distribute').length, 4)
  assert.equal(events.find((event) => event.kind === 'prefix').frame.counters.length, 4)
  assert.ok(events.some((event) => event.kind === 'compare'))
})

test('Library Sort preserves ordered shelf records and rebalances separate gaps', () => {
  const model = new FixedArray([10, 9, 8, 7, 6, 5, 4, 3, 2, 1])
  const original = model.getEntries()
  const events = []
  model.librarySort((event) => {
    events.push(event)
    if (event.kind === 'gather') return
    assert.deepEqual(model.getEntries(), original)
    const shelf = event.frame.shelf
    assert.ok(shelf.some((entry) => entry === null))
    const books = shelf.filter(Boolean)
    assert.equal(new Set(books.map((entry) => entry.id)).size, books.length)
    assert.deepEqual(books, [...books].sort((a, b) => a.value - b.value))
    assert.ok(books.every((entry) => original.some((record) => record.id === entry.id)))
  })
  assert.deepEqual(events.filter((event) => event.kind === 'gap').map((event) => event.frame.shelf.length), [5, 9, 17, 21])
  assert.ok(events.some((event) => event.kind === 'shift'))
  assert.deepEqual(model.getEntries(), [...original].reverse())
  const ordered = []
  new FixedArray([1, 2, 3, 4]).librarySort((event) => ordered.push(event))
  assert.deepEqual(ordered.map((event) => event.kind), ['pass'])
  assert.equal(ordered[0].frame.shelf, undefined)
})

test('Splay Sort rotations retain a complete ordered tree and splay each insertion to the root', () => {
  const model = new FixedArray([30, 10, 20, 40, 20, 5])
  const original = model.getEntries()
  let inserted = 0
  const events = []
  model.splaySort((event) => {
    events.push(event)
    if (event.kind === 'gather') return
    assert.deepEqual(model.getEntries(), original)
    const nodes = new Map(event.frame.tree.map((node) => [node.id, node]))
    const visited = new Set()
    const inorder = []
    const visit = (id) => {
      if (id === null) return
      assert.ok(nodes.has(id) && !visited.has(id))
      visited.add(id)
      const node = nodes.get(id)
      visit(node.left)
      inorder.push(node.entry)
      visit(node.right)
    }
    visit(event.frame.treeRoot)
    assert.equal(visited.size, nodes.size)
    assert.deepEqual(inorder, [...inorder].sort((a, b) => a.value - b.value))
    if (event.label === 'The inserted node is now the root') assert.equal(event.frame.treeRoot, original[inserted++].id)
  })
  assert.equal(inserted, original.length)
  assert.ok(events.some((event) => event.label.startsWith('Zig-zag')))
  assert.deepEqual(model.getEntries(), [...original].sort((a, b) => a.value - b.value))
})

test('Strand Sort extracts actual nondecreasing strands and relinks every record once', () => {
  const model = new FixedArray([4, 1, 3, 2, 5])
  const original = model.getEntries()
  const strands = []
  model.strandSort((event) => {
    if (event.kind === 'gather') return
    assert.deepEqual(model.getEntries(), original)
    const rows = event.frame.storage
    const records = rows.flatMap((row) => row.runs.flatMap((run) => run.entries))
    assert.equal(new Set(records.map((entry) => entry.id)).size, original.length)
    assert.equal(records.length, original.length)
    if (event.kind === 'run') strands.push(rows.find((row) => row.id === 'strand').runs[0].entries.map((entry) => entry.value))
  })
  assert.deepEqual(strands, [[4, 5], [1, 3], [2]])
  assert.deepEqual(model.getEntries().map((entry) => entry.value), [1, 2, 3, 4, 5])
})

test('Pancake Sort exchanges only symmetric positions within its declared prefix flips', () => {
  const model = new FixedArray([3, 6, 1, 5, 2, 4])
  let flipEnd = -1
  let flips = 0
  model.pancakeSort((event) => {
    if (event.kind === 'reverse') {
      assert.equal(event.index, 0)
      flipEnd = event.other
      flips += 1
    }
    if (event.kind === 'swap') {
      assert.ok(flipEnd >= 1)
      assert.equal(event.index + event.other, flipEnd)
      assert.ok(event.index >= 0 && event.other <= flipEnd)
    }
  })
  assert.ok(flips > 0 && flips <= 2 * model.length - 3)
  assert.deepEqual(model.getEntries().map((entry) => entry.value), [1, 2, 3, 4, 5, 6])
})

test('Stooge and Slow Sort execute distinct recurrences and reject oversized input unchanged', () => {
  for (const [method, Animation, limit, comparisons] of [
    ['stoogeSort', StoogeSortAnimation, FixedArray.maximumStoogeSortLength, 4],
    ['slowSort', SlowSortAnimation, FixedArray.maximumSlowSortLength, 3],
  ]) {
    for (const values of [[1, 2, 3], [3, 2, 1]]) {
      const events = []
      const model = new FixedArray(values)
      assert.equal(model[method]((event) => events.push(event)), true)
      assert.equal(events.filter((event) => event.kind === 'compare').length, comparisons)
      assert.deepEqual(model.getEntries().map((entry) => entry.value), [1, 2, 3])
    }
    const events = []
    const small = new FixedArray(Array.from({ length: limit }, (_, index) => limit - index))
    assert.equal(small[method]((event) => events.push(event)), true)
    assert.ok(events.length <= 65)
    assert.match(events.at(-1).detail, /Executed \d+ endpoint comparisons/)
    assert.deepEqual(small.getEntries().map((entry) => entry.value), Array.from({ length: limit }, (_, index) => index + 1))
    const large = new FixedArray(Array.from({ length: limit + 1 }, (_, index) => limit - index))
    const before = large.getEntries()
    const rejected = []
    assert.equal(large[method]((event) => rejected.push(event)), false)
    assert.deepEqual(rejected.map((event) => event.kind), ['reject'])
    assert.deepEqual(large.getEntries(), before)
    const plan = new Animation(large)
    assert.equal(plan.steps.at(-1).title, 'Array unchanged')
    assert.ok(plan.steps.at(-1).scene.nodes.every((node) => node.status !== 'SORTED'))
  }
})

test('bounded Bogo Sort is deterministic, preserves IDs, and restores input when unfinished', () => {
  const trial = new FixedArray([2, 1]).getEntries()
  const before = [...trial]
  assert.equal(new BogoArraySort(trial).sort(0), false)
  assert.deepEqual(trial, before)
  for (const values of [...cases, [9, 7, 5, 3, 1, 8, 6, 4, 2, 0]]) {
    const source = new FixedArray(values)
    const original = source.getEntries()
    const first = source.clone()
    const second = source.clone()
    const accepted = first.bogoSort()
    assert.equal(second.bogoSort(), accepted)
    assert.deepEqual(second.getEntries(), first.getEntries())
    if (accepted) assert.deepEqual(first.getEntries().map((entry) => entry.value), [...values].sort((a, b) => a - b))
    else assert.deepEqual(first.getEntries(), original)
    assert.deepEqual(new Set(first.getEntries().map((entry) => entry.id)), new Set(original.map((entry) => entry.id)))
    const plan = new BogoSortAnimation(source)
    assert.deepEqual(new BogoSortAnimation(source).steps, plan.steps)
    assert.deepEqual(source.getEntries(), original)
    assert.ok(plan.steps.length <= 2 * FixedArray.maximumBogoShuffles + 5)
    assert.equal(ActionInputRequest.create('array', 'bogo-sort', source.length), null)
    for (const step of plan.steps) {
      assert.equal(step.scene.count, values.length)
      assert.equal(new Set(step.scene.nodes.map((node) => node.id)).size, values.length)
      assert.deepEqual(new Set(step.scene.nodes.map((node) => node.id)), new Set(original.map((entry) => entry.id)))
    }
    if (!accepted) {
      assert.equal(plan.steps.at(-1).title, 'Array unchanged')
      assert.deepEqual(plan.steps.at(-1).scene.nodes.map((node) => node.value), values)
      assert.ok(plan.steps.at(-1).scene.nodes.every((node) => node.status !== 'SORTED'))
    }
  }
  assert.equal(BogoSortAnimation.describe(10).time.worst, 'Unbounded')
})

test('Sleep Sort uses exact virtual deadlines and a stable heap instead of real waits', () => {
  const values = [Number.MAX_SAFE_INTEGER, -2, Number.MIN_SAFE_INTEGER, -2, 0]
  const model = new FixedArray(values)
  const original = model.getEntries()
  const times = []
  model.sleepSort((event) => {
    if (event.kind === 'gather') return
    assert.deepEqual(model.getEntries(), original)
    const heap = event.frame.storage[0].runs[0].entries
    for (let child = 1; child < heap.length; child += 1) assert.ok(heap[Math.floor((child - 1) / 2)].value <= heap[child].value)
    const records = [...heap, ...event.frame.output.filter(Boolean)]
    assert.equal(new Set(records.map((entry) => entry.id)).size, records.length)
    if (event.kind === 'write') times.push(BigInt(event.detail.match(/virtual time (\d+)/)[1]))
  })
  assert.deepEqual(times, [0n, 9007199254740989n, 9007199254740989n, 9007199254740991n, 18014398509481982n])
  assert.deepEqual(model.getEntries(), [...original].sort((a, b) => a.value - b.value))
})

test('new sorting diagrams keep fixed bounds and resolve all tree edges', () => {
  for (const Animation of [InterpolationSortAnimation, LibrarySortAnimation, SplaySortAnimation, StrandSortAnimation, PancakeSortAnimation, StoogeSortAnimation, SlowSortAnimation, BogoSortAnimation, SleepSortAnimation]) {
    const plan = new Animation(new FixedArray([4, 1, 3, 1, 2]))
    for (const step of plan.steps) {
      const ids = new Set(step.scene.nodes.map((node) => node.id))
      assert.equal(ids.size, step.scene.nodes.length)
      assert.equal(step.scene.width, plan.steps[0].scene.width)
      assert.equal(step.scene.height, plan.steps[0].scene.height)
      for (const edge of step.scene.edges) assert.ok(ids.has(edge.from) && ids.has(edge.to))
      for (const node of step.scene.nodes) assert.ok(node.x + 40 <= step.scene.width && node.y + 70 <= step.scene.height)
    }
  }
})

test('Flashsort forms contiguous value classes before insertion cleanup and retains held IDs', () => {
  const values = [80, 5, 60, 25, 95, 0, 50, 30, 100, 20, 75, 45]
  const model = new FixedArray(values)
  let classified
  model.flashSort((event) => {
    if (event.label === 'Finish class permutation') classified = model.getEntries().map((entry) => entry.value)
  })
  assert.deepEqual(classified.slice(0, 3).sort((a, b) => a - b), [0, 5, 20])
  assert.deepEqual(classified.slice(3, 6).sort((a, b) => a - b), [25, 30, 45])
  assert.deepEqual(classified.slice(6, 8).sort((a, b) => a - b), [50, 60])
  assert.deepEqual(classified.slice(8, 11).sort((a, b) => a - b), [75, 80, 95])
  assert.equal(classified[11], 100)
  const source = new FixedArray(values)
  const ids = new Set(source.getEntries().map((entry) => entry.id))
  const plan = new FlashsortAnimation(source)
  assert.ok(plan.steps.some((step) => step.scene.nodes.some((node) => node.status === 'HELD')))
  for (const step of plan.steps) assert.deepEqual(new Set(step.scene.nodes.filter((node) => node.id.startsWith('array-element-')).map((node) => node.id)), ids)
  const equal = []
  new FixedArray(new Array(20).fill(4)).flashSort((event) => equal.push(event))
  assert.ok(!equal.some((event) => event.kind === 'count' || event.kind === 'swap' || event.kind === 'write'))
})

test('American Flag Sort partitions high digits in place before processing lower digits', () => {
  const model = new FixedArray([0x21, 0x13, 0x20, 0x02, 0x12, 0x01, 0x11, 0x03])
  const events = []
  let firstPartition
  model.americanFlagSort((event) => {
    events.push(event)
    if (event.kind === 'partition' && !firstPartition) firstPartition = model.getEntries().map((entry) => entry.value)
  })
  assert.deepEqual(firstPartition.slice(0, 3).sort((a, b) => a - b), [1, 2, 3])
  assert.deepEqual(firstPartition.slice(3, 7).sort((a, b) => a - b), [0x11, 0x12, 0x13, 0x20])
  assert.equal(firstPartition[7], 0x21)
  assert.equal(events.find((event) => event.kind === 'prefix').frame.counters.length, 16)
  assert.deepEqual(events.find((event) => event.kind === 'prefix').frame.counters.slice(0, 4).map((cell) => cell.count), [0, 3, 7, 8])
  assert.ok(events.filter((event) => event.kind === 'digit').length > 1)
  assert.ok(events.every((event) => event.frame.output === undefined && event.frame.buckets === undefined))
})

test('Spreadsort adapts to the local numeric range and uses small comparison leaves', () => {
  const offset = 2 ** 50
  const values = [8, 1, 7, 0, 6, 2, 5, 3, 4, 9].map((value) => value + offset)
  const model = new FixedArray(values)
  const events = []
  model.spreadSort((event) => events.push(event))
  assert.match(events.find((event) => event.kind === 'split').code, /divider = 2\^2; bins = 3/)
  assert.ok(events.some((event) => event.kind === 'bucket-sort'))
  assert.ok(events.every((event) => (event.frame.counters?.length ?? 0) <= 16))
  assert.deepEqual(model.getEntries().map((entry) => entry.value), [...values].sort((a, b) => a - b))
  const ordered = []
  new FixedArray([1, 2, 3, 4, 5, 6]).spreadSort((event) => ordered.push(event))
  assert.deepEqual(ordered.map((event) => event.kind), ['pass'])
  for (const values of [Array.from({ length: 52 }, (_, index) => 2 ** (51 - index)), [Number.MAX_SAFE_INTEGER, Number.MIN_SAFE_INTEGER, 0, -1, 1, 2, -2]]) {
    const sample = new FixedArray(values)
    sample.spreadSort()
    assert.deepEqual(sample.getEntries().map((entry) => entry.value), [...values].sort((a, b) => a - b))
  }
})

test('Burstsort bursts actual prefix containers, stops at terminal equal keys, and preserves ties', () => {
  const values = [0, 0, 0, 0, 0, 16, 17, 18, 19, 256, 257]
  const model = new FixedArray(values)
  const original = model.getEntries()
  const events = []
  model.burstSort((event) => {
    events.push(event)
    if (event.kind === 'gather') return
    assert.deepEqual(model.getEntries(), original)
    const trie = event.frame.trie
    const nodes = new Map(trie.map((node) => [node.id, node]))
    const runs = event.frame.storage[0].runs
    const entries = runs.flatMap((run) => run.entries)
    assert.equal(new Set(entries.map((entry) => entry.id)).size, entries.length)
    assert.equal(entries.length, trie.find((node) => node.parent === null).count)
    for (const node of trie) {
      assert.ok(node.prefix.length <= event.frame.trieDepth)
      if (node.parent !== null) {
        const parent = nodes.get(node.parent)
        assert.ok(parent && node.prefix.startsWith(parent.prefix))
        assert.equal(node.prefix.length, parent.prefix.length + 1)
      }
      if (!node.leaf) assert.equal(trie.filter((child) => child.parent === node.id).reduce((count, child) => count + child.count, 0), node.count)
    }
    if (event.kind === 'write') {
      for (const node of trie.filter((item) => item.leaf && !item.terminal)) assert.ok(node.count <= 3)
    }
  })
  assert.ok(events.some((event) => event.kind === 'split'))
  assert.ok(events.some((event) => event.frame.trie?.some((node) => node.terminal && node.count === 5)))
  assert.deepEqual(model.getEntries(), [...original].sort((a, b) => a.value - b.value))
  const equal = new FixedArray(new Array(30).fill(-7))
  equal.burstSort()
  assert.deepEqual(equal.getEntries().map((entry) => entry.id), Array.from({ length: 30 }, (_, index) => `array-element-${index}`))
})

test('Pigeonhole Sort gathers whole records stably and rejects wide ranges before allocation', () => {
  for (const values of [[3, -2, 3, 0, -2], [Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER - 1, Number.MAX_SAFE_INTEGER], [0, FixedArray.maximumPigeonholeRange - 1]]) {
    const model = new FixedArray(values)
    const before = model.getEntries()
    const events = []
    assert.equal(model.pigeonholeSort((event) => events.push(event)), true)
    assert.deepEqual(model.getEntries(), [...before].sort((a, b) => a.value - b.value))
    assert.ok(events.some((event) => event.frame.storage?.some((row) => row.id === 'pigeonholes')))
    assert.ok(!events.some((event) => event.kind === 'prefix'))
    assert.equal(events.filter((event) => event.kind === 'distribute').length, values.length)
    assert.equal(events.filter((event) => event.kind === 'write').length, values.length)
  }
  for (const values of [[0, FixedArray.maximumPigeonholeRange], [Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER]]) {
    const model = new FixedArray(values)
    const before = model.getEntries()
    const events = []
    assert.equal(model.pigeonholeSort((event) => events.push(event)), false)
    assert.deepEqual(model.getEntries(), before)
    assert.deepEqual(events.map((event) => event.kind), ['reject'])
    assert.equal(events[0].frame.storage, undefined)
    const plan = new PigeonholeSortAnimation(model)
    assert.equal(plan.steps.at(-1).title, 'Array unchanged')
    assert.deepEqual(plan.result.getEntries(), before)
    assert.ok(plan.steps.at(-1).scene.nodes.every((node) => node.status !== 'SORTED'))
  }
})

test('distribution diagrams reserve bounds and keep trie edges attached to real nodes', () => {
  for (const Animation of [FlashsortAnimation, AmericanFlagSortAnimation, SpreadsortAnimation, BurstsortAnimation, PigeonholeSortAnimation]) {
    const plan = new Animation(new FixedArray([80, 5, 60, 25, 95, 0, 50, 30, 100, 20, 75, 45]))
    for (const step of plan.steps) {
      const ids = new Set(step.scene.nodes.map((node) => node.id))
      assert.equal(ids.size, step.scene.nodes.length)
      assert.equal(step.scene.width, plan.steps[0].scene.width)
      assert.equal(step.scene.height, plan.steps[0].scene.height)
      for (const node of step.scene.nodes) assert.ok(node.x + 40 <= step.scene.width && node.y + 70 <= step.scene.height)
      for (const edge of step.scene.edges) assert.ok(ids.has(edge.from) && ids.has(edge.to))
    }
    assert.ok(plan.steps.at(-1).scene.nodes.every((node) => node.status === 'SORTED'))
  }
  assert.ok(AmericanFlagSortAnimation.describe(12).terms.some((term) => term.symbol === 'd' && term.meaning.includes('hexadecimal')))
  assert.ok(BurstsortAnimation.describe(12).terms.some((term) => term.symbol === 'O(nd)' && term.meaning.includes('key length')))
})

test('virtual parallel tasks respect disjoint ranges and join dependencies', () => {
  for (const method of ['parallelMergeSort', 'parallelQuickSort']) {
    const events = []
    new FixedArray([8, 2, 7, 1, 5, 3, 6, 4]).clone()[method]((event) => events.push(event))
    assert.ok(events.some((event) => event.frame.tasks.filter((task) => task.status === 'RUN').length === 2))
    for (const event of events) {
      const tasks = event.frame.tasks
      const running = tasks.filter((task) => task.status === 'RUN')
      assert.ok(running.length <= 2)
      assert.equal(new Set(running.map((task) => task.worker)).size, running.length)
      if (running.length === 2) assert.ok(running[0].end <= running[1].start || running[1].end <= running[0].start)
      for (const task of tasks) {
        const children = tasks.filter((child) => child.parent === task.id)
        if (task.status === 'DONE' || task.status === 'RUN' && task.kind === 'MERGE') assert.ok(children.every((child) => child.status === 'DONE'))
      }
    }
    assert.ok(events.at(-1).frame.tasks.every((task) => task.status === 'DONE'))
  }
  const equal = []
  new FixedArray(new Array(24).fill(7)).parallelQuickSort((event) => equal.push(event))
  assert.equal(equal.filter((event) => event.kind === 'compare').length, 24)
  assert.equal(equal.at(-1).frame.tasks.length, 1)
})

test('external merging preserves the source until final load and balances four tapes', () => {
  const values = [9, 8, 7, 6, 5, 4, 3, 2, 1, 0]
  const model = new FixedArray(values)
  const before = model.getEntries()
  const events = []
  model.externalMergeSort((event) => {
    events.push(event)
    if (event.kind !== 'gather') assert.deepEqual(model.getEntries(), before)
    const ram = event.frame.storage.find((row) => row.id === 'ram')
    assert.ok(ram.runs[0].entries.length <= 3)
  })
  const passes = events.filter((event) => event.kind === 'pass')
  assert.deepEqual(passes.map((event) => event.frame.storage.filter((row) => row.status === 'INPUT').reduce((count, row) => count + row.runs.length, 0)), [2, 1])
  for (const event of passes) assert.ok(event.frame.storage.filter((row) => row.status === 'OUTPUT').every((row) => row.runs.length === 0))
  assert.match(events.at(-1).frame.counterHint, /reads: 30; writes: 30/)
  assert.deepEqual(model.getEntries().map((entry) => entry.value), [...values].reverse())
})

test('polyphase merging uses Fibonacci quotas, empty dummy runs, and tape rotation', () => {
  for (const length of [10, 16, 25]) {
    const model = new FixedArray(Array.from({ length }, (_, index) => length - index))
    const events = []
    model.polyphaseMergeSort((event) => events.push(event))
    const distribution = events.find((event) => event.label === 'Complete the Fibonacci distribution')
    const tapes = distribution.frame.storage.filter((row) => row.id.startsWith('tape-'))
    const runCount = Math.ceil(length / 3)
    assert.equal(tapes.length, 3)
    assert.equal(tapes[2].runs.length, 0)
    assert.ok(tapes[0].runs.length >= tapes[1].runs.length)
    assert.equal(tapes.flatMap((row) => row.runs).filter((run) => !run.dummy).length, runCount)
    assert.ok(tapes.flatMap((row) => row.runs).some((run) => run.dummy))
    assert.ok(tapes.flatMap((row) => row.runs).filter((run) => run.dummy).every((run) => run.entries.length === 0))
    const phases = events.filter((event) => event.kind === 'stage')
    for (const event of phases) {
      const storage = event.frame.storage.filter((row) => row.id.startsWith('tape-'))
      assert.equal(storage.filter((row) => row.status === 'OUTPUT').length, 1)
      assert.equal(storage.find((row) => row.status === 'OUTPUT').runs.length, 0)
      assert.ok(storage.filter((row) => row.status === 'INPUT').every((row) => row.runs.length > 0))
    }
    if (length === 10) {
      assert.deepEqual(phases.map((event) => event.frame.storage.filter((row) => row.status === 'INPUT').map((row) => row.runs.length).sort((a, b) => a - b)), [[2, 3], [1, 2], [1, 1]])
      assert.match(events.at(-1).frame.counterHint, /reads: 31; writes: 31/)
    }
    assert.deepEqual(model.getEntries().map((entry) => entry.value), Array.from({ length }, (_, index) => index + 1))
  }
})

test('natural merging adapts to one run and never reverses equal keys', () => {
  for (const values of [[1, 2, 3, 4, 5], [5, 4, 3, 2, 1]]) {
    const events = []
    new FixedArray(values).naturalMergeSort((event) => events.push(event))
    assert.equal(events.filter((event) => event.kind === 'compare').length, values.length - 1)
    assert.equal(events.filter((event) => event.kind === 'run').length, 1)
    assert.ok(!events.some((event) => event.frame.buffer))
  }
  const values = [5, 4, 4, 3, 2, 2, 1]
  const model = new FixedArray(values)
  const original = model.getEntries()
  const events = []
  model.naturalMergeSort((event) => events.push(event))
  for (const event of events.filter((item) => item.kind === 'reverse')) {
    for (let index = event.index + 1; index <= event.other; index += 1) assert.ok(values[index - 1] > values[index])
  }
  assert.deepEqual(model.getEntries(), [...original].sort((a, b) => a.value - b.value))
})

test('new task and run diagrams retain fixed bounds and valid dependency edges', () => {
  for (const Animation of [ParallelMergeSortAnimation, ParallelQuickSortAnimation, ExternalMergeSortAnimation, PolyphaseMergeSortAnimation, NaturalMergeSortAnimation]) {
    const plan = new Animation(new FixedArray([8, 3, 7, 2, 6, 1, 5, 0, 4, 3]))
    for (const step of plan.steps) {
      const ids = new Set(step.scene.nodes.map((node) => node.id))
      assert.equal(ids.size, step.scene.nodes.length)
      assert.equal(step.scene.width, plan.steps[0].scene.width)
      assert.equal(step.scene.height, plan.steps[0].scene.height)
      for (const edge of step.scene.edges) assert.ok(ids.has(edge.from) && ids.has(edge.to))
      for (const node of step.scene.nodes) assert.ok(node.x + 40 <= step.scene.width && node.y + 70 <= step.scene.height)
    }
    assert.ok(plan.steps.at(-1).scene.nodes.every((node) => node.status === 'SORTED'))
  }
  assert.equal(ParallelQuickSortAnimation.describe(10).memory.best, 'O(1)')
  assert.equal(NaturalMergeSortAnimation.describe(10).memory.worst, 'O(n)')
})

const accepted = (method, values) => {
  if (method === 'stoogeSort') return values.length <= FixedArray.maximumStoogeSortLength
  if (method === 'slowSort') return values.length <= FixedArray.maximumSlowSortLength
  return !['countingSort', 'pigeonholeSort'].includes(method) || values.length < 2 || BigInt(Math.max(...values)) - BigInt(Math.min(...values)) + 1n <= BigInt(method === 'pigeonholeSort' ? FixedArray.maximumPigeonholeRange : FixedArray.maximumCountingRange)
}

test('sorts preserve values, IDs, fixed length, source clones, and future IDs for accepted inputs', () => {
  for (const [method, , , stable] of sorts) {
    for (const values of [...cases, FixedArray.createSortingDefault().getEntries().map((entry) => entry.value)]) {
      if (!accepted(method, values)) continue
      const source = new FixedArray(values)
      const before = source.getEntries()
      const result = source.clone()
      result[method]()
      assert.deepEqual(result.getEntries().map((entry) => entry.value), [...values].sort((a, b) => a - b), method)
      assert.equal(result.length, source.length)
      assert.deepEqual(source.getEntries(), before)
      assert.deepEqual(new Set(result.getEntries().map((entry) => entry.id)), new Set(before.map((entry) => entry.id)))
      if (stable) {
        for (const value of values) assert.deepEqual(result.getEntries().filter((entry) => entry.value === value), before.filter((entry) => entry.value === value), `${method} is stable`)
      }
      const sortedValues = result.getEntries().map((entry) => entry.value)
      result[method]()
      assert.deepEqual(result.getEntries().map((entry) => entry.value), sortedValues)
      assert.equal(result.withInsertedAt(0, 99).getAt(0).id, `array-element-${values.length}`)
    }
  }
})

test('all permutations of five distinct values sort correctly', () => {
  const visit = (prefix, remaining) => {
    if (!remaining.length) {
      for (const [method] of sorts) {
        const model = new FixedArray(prefix)
        model[method]()
        assert.deepEqual(model.getEntries().map((entry) => entry.value), [-2, -1, 0, 1, 2], method)
      }
      return
    }
    for (let index = 0; index < remaining.length; index += 1) visit([...prefix, remaining[index]], [...remaining.slice(0, index), ...remaining.slice(index + 1)])
  }
  visit([], [-2, -1, 0, 1, 2])
})

test('trace work distinguishes selection, linear insertion, binary insertion, and last-pivot quicksort', () => {
  for (const values of [[1, 2, 3, 4, 5], [5, 4, 3, 2, 1]]) {
    const selection = []
    new FixedArray(values).selectionSort((event) => selection.push(event))
    assert.equal(selection.filter((event) => event.kind === 'compare').length, 10)
  }
  const linear = []
  const binary = []
  const values = Array.from({ length: 16 }, (_, index) => index)
  new FixedArray(values).insertionSort((event) => linear.push(event))
  new FixedArray(values).binaryInsertionSort((event) => binary.push(event))
  assert.equal(linear.filter((event) => event.kind === 'compare').length, 15)
  assert.ok(binary.filter((event) => event.kind === 'compare').length > 15)
  assert.ok(!linear.some((event) => event.kind === 'shift'))
  assert.ok(!binary.some((event) => event.kind === 'shift'))
  const quick = []
  new FixedArray([1, 2, 3, 4, 5]).quickSort((event) => quick.push(event))
  assert.equal(quick.filter((event) => event.kind === 'compare').length, 10)
  assert.equal(quick.filter((event) => event.kind === 'partition').length, 5)
})

test('all sort animations have deterministic independent scenes, correct final slots, and no source mutation', () => {
  for (const [method, action, Animation] of sorts) {
    for (const values of cases) {
      if (!accepted(method, values)) continue
      const source = new FixedArray(values)
      const before = source.getEntries()
      const plan = new Animation(source)
      assert.deepEqual(source.getEntries(), before)
      assert.deepEqual(new Animation(source).steps, plan.steps)
      assert.equal(ActionInputRequest.create('array', action, source.length), null)
      const final = plan.steps.at(-1).scene
      assert.deepEqual(final.nodes.map((node) => node.value), [...values].sort((a, b) => a - b))
      assert.deepEqual(final.nodes.map((node) => node.id), plan.result.getEntries().map((entry) => entry.id))
      assert.ok(final.nodes.every((node) => node.status === 'SORTED'))
      for (const step of plan.steps) {
        assert.equal(step.scene.count, values.length)
        assert.equal(step.scene.kind, 'array')
        assert.ok(step.title && step.description && step.code && step.duration > 0)
        assert.ok(step.phase >= 1 && step.phase <= 5)
        const ids = new Set(step.scene.nodes.map((node) => node.id))
        assert.equal(ids.size, step.scene.nodes.length, `${method} has no duplicate scene IDs`)
        assert.ok(step.scene.focusId === null || ids.has(step.scene.focusId))
        assert.equal(new Set(step.scene.slots.map((slot) => slot.id)).size, step.scene.slots.length)
        for (let index = 0; index < values.length; index += 1) {
          const slot = step.scene.slots[index]
          assert.equal(slot.id, final.slots[index].id)
          assert.equal(slot.x, final.slots[index].x)
          assert.equal(slot.y, final.slots[index].y)
        }
        for (const node of step.scene.nodes) assert.ok(Number.isFinite(node.x) && Number.isFinite(node.y))
      }
      const snapshots = JSON.stringify(plan.steps)
      plan.result[method]()
      assert.equal(JSON.stringify(plan.steps), snapshots)
      if (values.length) {
        const finalValue = final.nodes[0].value
        plan.steps[0].scene.nodes[0].value = 12345
        assert.equal(final.nodes[0].value, finalValue)
        assert.deepEqual(source.getEntries(), before)
      }
    }
  }
})

test('insertion scenes retain the held entry while merge scenes distinguish auxiliary copies', () => {
  for (const Animation of [InsertionSortAnimation, BinaryInsertionSortAnimation]) {
    const source = new FixedArray([3, 2, 1])
    const ids = new Set(source.getEntries().map((entry) => entry.id))
    const plan = new Animation(source)
    assert.ok(plan.steps.some((step) => step.scene.nodes.some((node) => node.status === 'HELD')))
    assert.ok(plan.steps.some((step) => step.scene.nodes.some((node) => node.status === 'SHIFT')))
    for (const step of plan.steps) {
      assert.deepEqual(new Set(step.scene.nodes.map((node) => node.id)), ids)
      assert.equal(step.scene.nodes.length, 3)
    }
  }
  const merged = new MergeSortAnimation(new FixedArray([3, 1, 2]))
  assert.ok(merged.steps.some((step) => step.scene.nodes.some((node) => node.id.startsWith('buffer-'))))
  assert.ok(merged.steps.some((step) => step.scene.nodes.filter((node) => node.id.startsWith('buffer-') && node.status === 'READ').length === 2))
  assert.ok(merged.steps.at(-1).scene.nodes.every((node) => !node.id.startsWith('buffer-')))
})

test('Counting Sort accepts its exact range limit and rejects wider input without mutation', () => {
  const limit = FixedArray.maximumCountingRange
  for (const values of [[limit - 1, 0, limit - 1, 1], [Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER - 1], [Number.MIN_SAFE_INTEGER + 1, Number.MIN_SAFE_INTEGER]]) {
    const model = new FixedArray(values)
    const before = model.getEntries()
    assert.equal(model.countingSort(), true)
    assert.deepEqual(model.getEntries().map((entry) => entry.value), [...values].sort((a, b) => a - b))
    for (const value of values) assert.deepEqual(model.getEntries().filter((entry) => entry.value === value), before.filter((entry) => entry.value === value))
  }
  for (const values of [[limit, 0], [Number.MAX_SAFE_INTEGER, Number.MIN_SAFE_INTEGER]]) {
    const model = new FixedArray(values)
    const before = model.getEntries()
    const events = []
    assert.equal(model.countingSort((event) => events.push(event)), false)
    assert.deepEqual(model.getEntries(), before)
    assert.deepEqual(events.map((event) => event.kind), ['reject'])
    const plan = new CountingSortAnimation(model)
    assert.deepEqual(plan.result.getEntries(), before)
    assert.equal(plan.steps.at(-1).title, 'Array unchanged')
    assert.deepEqual(plan.steps.at(-1).scene.nodes.map((node) => node.value), values)
    assert.ok(!plan.steps.at(-1).scene.nodes.some((node) => node.status === 'SORTED'))
    assert.equal(plan.result.withInsertedAt(0, 9).getAt(0).id, `array-element-${values.length}`)
  }
})

test('distribution scenes expose stable output, digit buckets, and comparisons inside buckets', () => {
  const counted = new CountingSortAnimation(new FixedArray([2, -1, 2, 0, -1]))
  assert.ok(counted.steps.some((step) => step.scene.nodes.some((node) => node.id.startsWith('output-'))))
  assert.ok(counted.steps.some((step) => step.scene.nodes.some((node) => node.status === 'NEXT')))
  assert.ok(counted.steps.some((step) => step.scene.hint?.description.includes('observed keys')))
  const radix = new RadixSortAnimation(new FixedArray([91, -1, 10, 91]))
  assert.ok(radix.steps.some((step) => step.scene.nodes.some((node) => node.id.startsWith('bucket-'))))
  assert.ok(radix.steps.some((step) => step.scene.slots.filter((slot) => slot.id.startsWith('counter-slot-')).length === 10))
  const bucket = new BucketSortAnimation(new FixedArray([4, 3, 2, 1, 1000, 0]))
  assert.ok(bucket.steps.some((step) => step.scene.nodes.some((node) => node.id.startsWith('bucket-') && node.status === 'COMPARE')))
  assert.ok(bucket.steps.some((step) => step.scene.nodes.some((node) => node.id.startsWith('bucket-') && node.status === 'SWAP')))
  for (const plan of [counted, radix, bucket]) {
    assert.ok(plan.steps.every((step) => step.scene.height === plan.steps[0].scene.height && step.scene.width === plan.steps[0].scene.width))
    assert.ok(plan.steps.at(-1).scene.nodes.every((node) => node.status === 'SORTED' && node.id.startsWith('array-element-')))
  }
})

test('radix keys and bucket mapping remain exact over the full signed safe-integer span', () => {
  const values = [Number.MAX_SAFE_INTEGER, -1, Number.MIN_SAFE_INTEGER, 0, Number.MAX_SAFE_INTEGER - 1, -1]
  const radix = new FixedArray(values)
  const digits = []
  radix.radixSort((event) => { if (event.kind === 'digit') digits.push(event.label) })
  assert.equal(digits.length, 17)
  assert.equal(digits[0], '1')
  assert.equal(digits.at(-1), '10000000000000000')
  const equal = []
  new FixedArray([-5, -5]).radixSort((event) => { if (event.kind === 'digit') equal.push(event.label) })
  assert.deepEqual(equal, ['1'])
  const bucket = new FixedArray(values)
  const distributed = []
  bucket.bucketSort((event) => { if (event.kind === 'distribute') distributed.push(event.other) })
  const minimum = BigInt(Number.MIN_SAFE_INTEGER)
  const span = BigInt(Number.MAX_SAFE_INTEGER) - minimum + 1n
  assert.deepEqual(distributed, values.map((value) => Number((BigInt(value) - minimum) * BigInt(values.length) / span)))
  assert.deepEqual(bucket.getEntries().map((entry) => entry.value), radix.getEntries().map((entry) => entry.value))
})

test('heap extraction finalizes a growing suffix and Shell Sort uses descending Knuth gaps', () => {
  const heap = new FixedArray([3, 1, 4, 2, 0])
  const suffixes = []
  heap.heapSort((event) => {
    if (event.kind !== 'extract') return
    const values = heap.getEntries().map((entry) => entry.value)
    const suffix = values.slice(event.index)
    assert.deepEqual(suffix, [...suffix].sort((a, b) => a - b))
    assert.ok(values.slice(0, event.index).every((value) => value <= suffix[0]))
    assert.equal(event.frame.sortedFrom, event.index)
    suffixes.push(event.index)
  })
  assert.deepEqual(suffixes, [4, 3, 2, 1])
  const shell = new FixedArray([9, 8, 7, 6, 5, 4, 3, 2, 1, 0])
  const gaps = []
  shell.shellSort((event) => {
    if (event.kind === 'gap') gaps.push(event.amount)
    if (event.kind !== 'pass') return
    const values = shell.getEntries().map((entry) => entry.value)
    for (let index = event.amount; index < values.length; index += 1) assert.ok(values[index - event.amount] <= values[index])
  })
  assert.deepEqual(gaps, [4, 1])
  const information = ShellSortAnimation.describe(10)
  assert.equal(information.time.average, 'Not established')
  assert.ok(!information.terms.some((term) => term.symbol === 'Not established'))
})

test('hybrid, block, and additional sorts handle run boundaries, partial blocks, and few distinct keys', () => {
  let seed = 0x7a31
  const shuffle = (values) => {
    for (let index = values.length - 1; index > 0; index -= 1) {
      seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0
      const other = seed % (index + 1)
      const temporary = values[index]
      values[index] = values[other]
      values[other] = temporary
    }
    return values
  }
  for (const length of [8, 9, 10, 11, 12, 13, 15, 16, 17, 23, 31, 32, 33, 47, 63, 64, 65, 127, 128, 129, 257]) {
    const valuesList = [
      shuffle(Array.from({ length }, (_, index) => index - 10)),
      Array.from({ length }, (_, index) => length - index),
      Array.from({ length }, (_, index) => index % 2 ? index : length - index),
      ...[2, 3, 4, 5, 8].map((keys) => shuffle(Array.from({ length }, (_, index) => index % keys - 2))),
    ]
    for (const values of valuesList) {
      for (const [method, , , stable] of sorts.slice(10)) {
        if (!accepted(method, values)) continue
        const source = new FixedArray(values)
        const original = source.getEntries()
        const model = source.clone()
        model[method]()
        assert.deepEqual(model.getEntries().map((entry) => entry.value), [...values].sort((a, b) => a - b), `${method}, n=${length}`)
        assert.equal(model.length, length)
        assert.deepEqual(new Set(model.getEntries().map((entry) => entry.id)), new Set(original.map((entry) => entry.id)))
        assert.deepEqual(source.getEntries(), original)
        if (stable) {
          for (const value of new Set(values)) assert.deepEqual(model.getEntries().filter((entry) => entry.value === value), original.filter((entry) => entry.value === value), `${method} preserves ties, n=${length}`)
        }
      }
    }
  }
})

test('TimSort traces natural runs, strict reversals, stable extension, and galloping', () => {
  const events = []
  const values = [...Array.from({ length: 32 }, (_, index) => index + 32), ...Array.from({ length: 32 }, (_, index) => index)]
  const model = new FixedArray(values)
  model.timSort((event) => events.push(event))
  assert.equal(events.filter((event) => event.kind === 'run').length, 2)
  assert.ok(events.some((event) => event.kind === 'collapse'))
  assert.ok(events.some((event) => event.kind === 'gallop'))
  assert.deepEqual(model.getEntries().map((entry) => entry.value), Array.from({ length: 64 }, (_, index) => index))
  const descending = []
  new FixedArray([5, 4, 4, 3, 2, 2, 1, 0]).timSort((event) => descending.push(event))
  assert.ok(descending.some((event) => event.kind === 'reverse'))
  assert.ok(descending.some((event) => event.kind === 'extend'))
})

test('IntroSort reaches heap fallback and Dual-Pivot QuickSort skips equal-pivot middles', () => {
  const intro = []
  new FixedArray(new Array(128).fill(7)).introSort((event) => intro.push(event))
  assert.ok(intro.some((event) => event.kind === 'fallback' && event.label === 'Switch to Heap Sort'))
  const dual = []
  new FixedArray(new Array(128).fill(7)).dualPivotQuickSort((event) => dual.push(event))
  assert.equal(dual.filter((event) => event.kind === 'partition').length, 1)
  const partition = dual.find((event) => event.kind === 'partition')
  assert.equal(partition.index, 0)
  assert.equal(partition.other, 127)
})

test('block merging sorts partial blocks and consumes each head once into stable output', () => {
  const values = Array.from({ length: 33 }, (_, index) => 32 - index)
  const events = []
  const model = new FixedArray(values)
  model.blockMergeSort((event) => events.push(event))
  assert.equal(events.filter((event) => event.kind === 'block').length, Math.ceil(values.length / Math.ceil(Math.sqrt(values.length))))
  assert.ok(events.some((event) => event.label === 'Compare block heads'))
  const writes = events.filter((event) => event.kind === 'distribute')
  assert.equal(writes.length, values.length)
  assert.equal(new Set(writes.map((event) => event.index)).size, values.length)
  assert.deepEqual(writes.at(-1).frame.output.map((entry) => entry.value), [...values].sort((a, b) => a - b))
  const ordered = []
  new FixedArray([1, 2, 3, 4]).blockMergeSort((event) => ordered.push(event))
  assert.ok(!ordered.some((event) => event.kind === 'block' || event.frame.output || event.frame.buffer))
})

test('buffered merge scenes preserve unique IDs and publish an intact final array', () => {
  const values = Array.from({ length: 17 }, (_, index) => 16 - index)
  for (const Animation of [TimSortAnimation, BlockMergeSortAnimation]) {
    const model = new FixedArray(values)
    const before = model.getEntries()
    const plan = new Animation(model)
    assert.deepEqual(model.getEntries(), before)
    assert.deepEqual(plan.result.getEntries().map((entry) => entry.value), [...values].sort((a, b) => a - b))
    assert.deepEqual(new Animation(model).steps, plan.steps)
    for (const step of plan.steps) {
      assert.equal(new Set(step.scene.nodes.map((node) => node.id)).size, step.scene.nodes.length)
      assert.equal(new Set(step.scene.slots.map((slot) => slot.id)).size, step.scene.slots.length)
      assert.equal(step.scene.count, values.length)
      assert.ok(step.scene.focusId === null || step.scene.nodes.some((node) => node.id === step.scene.focusId))
      assert.ok(step.title && step.description && step.code)
    }
    assert.deepEqual(plan.steps.at(-1).scene.nodes.map((node) => node.id), plan.result.getEntries().map((entry) => entry.id))
    assert.ok(plan.steps.at(-1).scene.nodes.every((node) => node.status === 'SORTED'))
  }
})

test('WikiSort restores internal buffers and stable ties across distinct-key and duplicate-heavy merge levels', () => {
  for (const length of [8, 10, 17, 33, 65, 129, 513]) {
    for (const keys of [1, 2, 3, 5, 13, length]) {
      const values = Array.from({ length }, (_, index) => (length - index) % keys - 3)
      const model = new FixedArray(values)
      const before = model.getEntries()
      const events = []
      model.wikiSort((event) => {
        events.push(event)
        assert.equal(new Set(model.getEntries().map((entry) => entry.id)).size, length, 'internal exchanges retain every entry')
      })
      assert.deepEqual(model.getEntries().map((entry) => entry.value), [...values].sort((a, b) => a - b))
      for (const value of new Set(values)) {
        assert.deepEqual(model.getEntries().filter((entry) => entry.value === value), before.filter((entry) => entry.value === value))
      }
      assert.ok(events.every((event) => !event.frame.buffer && !event.frame.output), 'internal buffers remain inside the array')
      if (keys > 1) assert.ok(events.some((event) => event.label === 'Extract unique internal buffer keys'))
    }
  }
})

test('Smoothsort finalizes each maximum and adapts to already ordered Leonardo heaps', () => {
  const length = 128
  for (const values of [Array.from({ length }, (_, index) => index), Array.from({ length }, (_, index) => length - index), Array.from({ length }, (_, index) => index % 7)]) {
    const model = new FixedArray(values)
    const events = []
    model.smoothSort((event) => {
      events.push(event)
      if (event.kind !== 'extract') return
      const entries = model.getEntries().map((entry) => entry.value)
      const suffix = entries.slice(event.index)
      assert.deepEqual(suffix, [...suffix].sort((a, b) => a - b))
      assert.ok(entries.slice(0, event.index).every((value) => value <= suffix[0]))
    })
    assert.equal(events.filter((event) => event.kind === 'extract').length, length - 1)
    assert.ok(events.some((event) => event.detail.includes('Leonardo heap has size 5')))
    if (values[0] === 0 && values[1] === 1 && values.at(-1) === length - 1) {
      assert.ok(!events.some((event) => event.kind === 'swap'))
      assert.ok(events.filter((event) => event.kind === 'compare').length < 10 * length)
    }
  }
})

test('Tree Sort stores duplicate entries and traverses a degenerate tree without recursive output', () => {
  for (const values of [new Array(64).fill(3), Array.from({ length: 64 }, (_, index) => index), [3, 1, 3, 2, 1, 3]]) {
    const model = new FixedArray(values)
    const before = model.getEntries()
    const events = []
    model.treeSort((event) => events.push(event))
    assert.equal(events.filter((event) => event.kind === 'place').length, values.length)
    assert.equal(events.filter((event) => event.kind === 'write').length, values.length)
    assert.equal(events.findLast((event) => event.kind === 'place').frame.tree.length, values.length)
    for (const value of new Set(values)) assert.deepEqual(model.getEntries().filter((entry) => entry.value === value), before.filter((entry) => entry.value === value))
  }
})

test('Tournament Sort exhausts non-power-of-two leaves once and uses original positions for equal winners', () => {
  const values = [Number.MAX_SAFE_INTEGER, -1, Number.MIN_SAFE_INTEGER, -1, 0]
  const model = new FixedArray(values)
  const before = model.getEntries()
  const events = []
  model.tournamentSort((event) => events.push(event))
  const winners = events.filter((event) => event.kind === 'extract')
  assert.equal(winners.length, values.length)
  assert.equal(new Set(winners.map((event) => event.index)).size, values.length)
  assert.ok(events.some((event) => event.frame.tree?.some((node) => node.entry === null)))
  assert.deepEqual(model.getEntries(), [...before].sort((a, b) => a.value - b.value))
  assert.ok(winners.at(-1).frame.output.every((entry) => entry !== null))
})

test('Patience Sort preserves decreasing pile order and exposes its unstable equal-key stack order', () => {
  const model = new FixedArray([3, 1, 2, 1, 4, 0])
  const events = []
  model.patienceSort((event) => events.push(event))
  for (const event of events.filter((event) => event.kind === 'place')) {
    const piles = event.frame.buckets
    for (const pile of piles) {
      for (let index = 1; index < pile.length; index += 1) assert.ok(pile[index - 1].value >= pile[index].value)
    }
    for (let index = 1; index < piles.length; index += 1) assert.ok(piles[index - 1].at(-1).value < piles[index].at(-1).value)
  }
  assert.equal(events.filter((event) => event.kind === 'extract').length, model.length)
  const equal = new FixedArray([2, 2, 2])
  const originalIds = equal.getEntries().map((entry) => entry.id)
  equal.patienceSort()
  assert.deepEqual(equal.getEntries().map((entry) => entry.id), originalIds.reverse())
})

test('Cycle Sort minimizes value writes and terminates across duplicate-heavy inputs', () => {
  for (let encoded = 0; encoded < 3 ** 6; encoded += 1) {
    let digits = encoded
    const values = []
    for (let index = 0; index < 6; index += 1) {
      values.push(digits % 3 - 1)
      digits = Math.floor(digits / 3)
    }
    const expected = [...values].sort((a, b) => a - b)
    const model = new FixedArray(values)
    const ids = new Set(model.getEntries().map((entry) => entry.id))
    let writes = 0
    model.cycleSort((event) => { if (event.kind === 'write') writes += 1 })
    assert.deepEqual(model.getEntries().map((entry) => entry.value), expected)
    assert.deepEqual(new Set(model.getEntries().map((entry) => entry.id)), ids)
    assert.equal(writes, values.filter((value, index) => value !== expected[index]).length)
  }
  const events = []
  new FixedArray([2, 2, 1]).cycleSort((event) => events.push(event))
  assert.ok(events.some((event) => event.label === 'Skip an equal-key destination'))
  const ordered = []
  new FixedArray([1, 2, 3, 4, 5]).cycleSort((event) => ordered.push(event))
  assert.equal(ordered.filter((event) => event.kind === 'compare').length, 10)
  assert.ok(!ordered.some((event) => event.kind === 'write' || event.kind === 'hold'))
})

test('Cycle Sort scenes keep the held entry and one empty start slot until a cycle closes', () => {
  const source = new FixedArray([3, 1, 2, 1])
  const ids = new Set(source.getEntries().map((entry) => entry.id))
  const plan = new CycleSortAnimation(source)
  assert.ok(plan.steps.some((step) => step.scene.nodes.some((node) => node.status === 'HELD')))
  for (const step of plan.steps) {
    assert.deepEqual(new Set(step.scene.nodes.map((node) => node.id)), ids)
    assert.equal(step.scene.nodes.length, source.length)
    const held = step.scene.nodes.find((node) => node.status === 'HELD')
    assert.equal(step.scene.slots.filter((slot) => slot.empty).length, held ? 1 : 0)
  }
  assert.ok(!plan.steps.at(-1).scene.slots.some((slot) => slot.empty))
})

test('Comb Sort shrinks past clean wide-gap passes and requires a clean adjacent pass', () => {
  for (const [length, expected] of [[20, [15, 11, 8, 6, 4, 3, 2, 1]], [14, [10, 7, 5, 3, 2, 1]]]) {
    const events = []
    new FixedArray(Array.from({ length }, (_, index) => index)).combSort((event) => events.push(event))
    assert.deepEqual(events.filter((event) => event.kind === 'gap').map((event) => event.amount), expected)
    assert.ok(!events.some((event) => event.kind === 'swap'))
    assert.equal(events.at(-1).label, 'Adjacent pass confirms the order')
    assert.equal(events.at(-1).frame.sortedPrefix, length)
  }
  const information = CombSortAnimation.describe(20)
  assert.equal(information.time.best, 'O(n log n)')
  assert.equal(information.time.average, 'O(n²)')
  assert.equal(information.time.worst, 'O(n²)')
  assert.match(information.time.explanation, /uniformly random distinct permutations/)
  assert.match(information.time.explanation, /conservative upper bound/)
})

test('Cocktail Shaker Sort fixes both boundaries and stops early on ordered input', () => {
  const values = [5, 4, 3, 2, 1, 0]
  const expected = [...values].sort((a, b) => a - b)
  const model = new FixedArray(values)
  const events = []
  model.cocktailShakerSort((event) => {
    events.push(event)
    if (event.kind !== 'pass') return
    const current = model.getEntries().map((entry) => entry.value)
    const prefix = event.frame.sortedPrefix ?? 0
    const suffix = event.frame.sortedFrom ?? model.length
    assert.deepEqual(current.slice(0, prefix), expected.slice(0, prefix))
    assert.deepEqual(current.slice(suffix), expected.slice(suffix))
  })
  assert.ok(events.some((event) => event.label === 'Sweep forward'))
  assert.ok(events.some((event) => event.label === 'Sweep backward'))
  const ordered = []
  new FixedArray(expected).cocktailShakerSort((event) => ordered.push(event))
  assert.equal(ordered.filter((event) => event.kind === 'compare').length, values.length - 1)
  assert.ok(!ordered.some((event) => event.kind === 'swap' || event.label === 'Sweep backward'))
})

test('Gnome Sort backtracks to the front and accepts equal neighbors without swaps', () => {
  const reversed = []
  new FixedArray([4, 3, 2, 1, 0]).gnomeSort((event) => reversed.push(event))
  assert.equal(reversed.filter((event) => event.kind === 'swap').length, 10)
  assert.ok(reversed.some((event) => event.label === 'Step backward'))
  assert.ok(reversed.some((event) => event.label === 'Turn around at the first slot'))
  for (const values of [[0, 1, 2, 3, 4], [2, 2, 2, 2, 2]]) {
    const events = []
    new FixedArray(values).gnomeSort((event) => events.push(event))
    assert.equal(events.filter((event) => event.kind === 'compare').length, values.length - 1)
    assert.ok(!events.some((event) => event.kind === 'swap'))
  }
})

test('Odd-Even Sort checks both parities before stopping', () => {
  const model = new FixedArray([1, 3, 2, 4])
  const events = []
  model.oddEvenSort((event) => events.push(event))
  assert.deepEqual(model.getEntries().map((entry) => entry.value), [1, 2, 3, 4])
  assert.ok(events.filter((event) => event.kind === 'stage').length >= 4)
  assert.equal(events.at(-1).label, 'Both parities are ordered')
  for (const values of [[1, 2, 3, 4], [2, 2, 2, 2]]) {
    const trace = []
    new FixedArray(values).oddEvenSort((event) => trace.push(event))
    assert.equal(trace.filter((event) => event.kind === 'compare').length, values.length - 1)
    assert.ok(!trace.some((event) => event.kind === 'swap'))
  }
})

test('sorting networks sort every binary input through ten wires, including non-power-of-two lengths', () => {
  for (let length = 0; length <= 10; length += 1) {
    for (let mask = 0; mask < 2 ** length; mask += 1) {
      const values = Array.from({ length }, (_, index) => Math.floor(mask / 2 ** index) % 2)
      const expected = [...values].sort((a, b) => a - b)
      for (const method of ['oddEvenMergeSort', 'bitonicSort', 'pairwiseSortingNetwork']) {
        const model = new FixedArray(values)
        model[method]()
        assert.deepEqual(model.getEntries().map((entry) => entry.value), expected, `${method}: n=${length}, bits=${mask}`)
      }
    }
  }
})

test('network comparator schedules depend only on length and stay on real wires', () => {
  for (const method of ['oddEvenMergeSort', 'bitonicSort', 'pairwiseSortingNetwork']) {
    let expected
    for (const values of [Array.from({ length: 10 }, (_, index) => index), Array.from({ length: 10 }, (_, index) => 9 - index), new Array(10).fill(7)]) {
      const trace = []
      new FixedArray(values)[method]((event) => trace.push(event))
      const schedule = trace.filter((event) => event.kind === 'compare').map((event) => event.frame.comparator)
      if (!expected) expected = schedule
      else assert.deepEqual(schedule, expected, method)
      for (const comparator of schedule) {
        assert.ok(comparator.first >= 0 && comparator.first < comparator.second)
        assert.ok(comparator.second < values.length)
      }
    }
  }
  const comparisons = (method) => {
    const trace = []
    new FixedArray([7, 6, 5, 4, 3, 2, 1, 0])[method]((event) => { if (event.kind === 'compare') trace.push([event.index, event.other]) })
    return trace
  }
  const oddEven = comparisons('oddEvenMergeSort')
  const pairwise = comparisons('pairwiseSortingNetwork')
  assert.equal(oddEven.length, 19)
  assert.equal(pairwise.length, 19)
  assert.equal(comparisons('bitonicSort').length, 24)
  assert.deepEqual(pairwise.slice(0, 4), [[0, 1], [2, 3], [4, 5], [6, 7]])
  assert.notDeepEqual(pairwise, oddEven)
})

test('network scenes show active comparator links, preserve real slots, and clear links on commit', () => {
  for (const Animation of [OddEvenSortAnimation, OddEvenMergeSortAnimation, BitonicSortAnimation, PairwiseSortingNetworkAnimation]) {
    const source = new FixedArray([5, 2, 8, 0, 3, 1, 9, 4, 7, 6])
    const ids = new Set(source.getEntries().map((entry) => entry.id))
    const plan = new Animation(source)
    assert.ok(plan.steps.some((step) => step.scene.edges.some((edge) => edge.id === 'array-comparator')))
    for (const step of plan.steps) {
      assert.equal(step.scene.slots.length, source.length)
      assert.deepEqual(new Set(step.scene.nodes.map((node) => node.id)), ids)
      for (const edge of step.scene.edges) assert.ok(ids.has(edge.from) && ids.has(edge.to))
    }
    if (Animation === BitonicSortAnimation) assert.ok(plan.steps.some((step) => step.scene.edges.some((edge) => edge.label === 'DESC')))
    assert.equal(plan.steps.at(-1).scene.edges.length, 0)
  }
})

test('Sample Sort distributes by sampled key ranges and stably handles skewed and equal buckets', () => {
  for (const values of [[9, 0, 8, 1, 7, 2, 6, 3, 5, 4], new Array(17).fill(3), [Number.MAX_SAFE_INTEGER, -1, Number.MIN_SAFE_INTEGER, -1, 0], [...new Array(20).fill(0), -1, 1]]) {
    const model = new FixedArray(values)
    const original = model.getEntries()
    const events = []
    model.sampleSort((event) => {
      events.push(event)
      if (event.kind !== 'gather') assert.deepEqual(model.getEntries(), original)
      if (event.kind !== 'distribute') return
      const { buckets, splitters } = event.frame
      assert.ok(buckets.length >= 2 && buckets.length <= 4)
      for (let bucket = 0; bucket < buckets.length; bucket += 1) {
        for (const entry of buckets[bucket]) {
          if (bucket > 0) assert.ok(entry.value >= splitters[bucket - 1].value)
          if (bucket < splitters.length) assert.ok(entry.value < splitters[bucket].value)
        }
      }
    })
    assert.equal(events.filter((event) => event.kind === 'distribute').length, values.length)
    assert.equal(new Set(events.filter((event) => event.kind === 'distribute').map((event) => event.index)).size, values.length)
    assert.deepEqual(model.getEntries(), [...original].sort((a, b) => a.value - b.value))
    const output = events.findLast((event) => event.kind === 'write').frame.output
    assert.deepEqual(output, model.getEntries())
  }
})

test('Sample Sort scenes separate samples, splitters, buckets, and output with independent stable IDs', () => {
  const plan = new SampleSortAnimation(FixedArray.createSortingDefault())
  for (const prefix of ['sample-', 'splitter-', 'bucket-', 'output-']) {
    assert.ok(plan.steps.some((step) => step.scene.nodes.some((node) => node.id.startsWith(prefix))))
  }
  for (const step of plan.steps) {
    assert.equal(step.scene.width, plan.steps[0].scene.width)
    assert.equal(step.scene.height, plan.steps[0].scene.height)
    assert.equal(new Set(step.scene.nodes.map((node) => node.id)).size, step.scene.nodes.length)
    const rows = new Map()
    for (const node of step.scene.nodes) {
      const prefix = node.id.split('-')[0]
      if (prefix !== 'array') rows.set(prefix, node.y)
    }
    assert.equal(new Set(rows.values()).size, rows.size)
  }
  const before = JSON.stringify(plan.steps)
  plan.result.sampleSort()
  assert.equal(JSON.stringify(plan.steps), before)
  assert.ok(plan.steps.at(-1).scene.nodes.every((node) => node.id.startsWith('array-element-')))
})

test('auxiliary sorting diagrams reserve stable bounds and finish with only array nodes', () => {
  for (const Animation of [TreeSortAnimation, TournamentSortAnimation, PatienceSortAnimation]) {
    const plan = new Animation(new FixedArray([5, 2, 4, 2, 0, 3]))
    assert.ok(plan.steps.every((step) => step.scene.width === plan.steps[0].scene.width && step.scene.height === plan.steps[0].scene.height))
    for (const step of plan.steps) {
      const ids = new Set(step.scene.nodes.map((node) => node.id))
      for (const edge of step.scene.edges) assert.ok(ids.has(edge.from) && ids.has(edge.to))
      for (const node of step.scene.nodes) {
        assert.ok(node.x >= 0 && node.x < step.scene.width)
        assert.ok(node.y >= 0 && node.y < step.scene.height)
      }
    }
    if (Animation === PatienceSortAnimation) {
      assert.ok(plan.steps.some((step) => step.scene.slots.some((slot) => slot.label.startsWith('pile '))))
      assert.ok(plan.steps.some((step) => step.scene.nodes.filter((node) => node.id.startsWith('bucket-') && node.status === 'COMPARE').length === 2))
    } else assert.ok(plan.steps.some((step) => step.scene.edges.length > 0))
    assert.ok(plan.steps.at(-1).scene.nodes.every((node) => node.id.startsWith('array-element-') && node.status === 'SORTED'))
    assert.equal(plan.steps.at(-1).scene.edges.length, 0)
  }
})
