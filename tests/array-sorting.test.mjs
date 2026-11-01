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
]

const cases = [[], [4], [1, 2, 3, 4], [4, 3, 2, 1], [2, 2, 2], [3, -2, 3, 0, -2], [Number.MAX_SAFE_INTEGER, 0, Number.MIN_SAFE_INTEGER], [2, 2, 1], [4, 1, 3, 1, 2]]

const accepted = (method, values) => method !== 'countingSort' || values.length < 2 || BigInt(Math.max(...values)) - BigInt(Math.min(...values)) + 1n <= BigInt(FixedArray.maximumCountingRange)

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
