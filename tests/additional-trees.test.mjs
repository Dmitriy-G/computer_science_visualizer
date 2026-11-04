import { StructurePaths } from './helpers/StructurePaths.mjs'
import assert from 'node:assert/strict'
import { test } from 'node:test'
import { Trie } from '../src/components/FundamentalDataStructures/StringText/Trie/Trie.ts'
import { Heap } from '../src/components/FundamentalDataStructures/QueuePriority/Heap/Heap.ts'
import { SegmentTree } from '../src/components/AdvancedDataStructures/RangeQueries/SegmentTree/SegmentTree.ts'
import { FenwickTree } from '../src/components/AdvancedDataStructures/RangeQueries/FenwickTree/FenwickTree.ts'
import { RTree, Rectangle } from '../src/components/AdvancedDataStructures/SpatialIndexes/RTree/RTree.ts'
import { LSMTree } from '../src/components/AdvancedDataStructures/StorageIndexes/LSMTree/LSMTree.ts'
import { AdditionalTreeCatalog } from '../src/visualization/AdditionalTreeCatalog.ts'
import { ActionCatalog } from '../src/visualization/ActionCatalog.ts'
import { ActionInputRequest } from '../src/visualization/ActionInputRequest.ts'
import { StructureInformation } from '../src/components/StructureInfo/StructureInformation.ts'

const features = [
  ['trie', 'Trie', { insert: 'Insert', 'search-value': 'SearchByWord', 'starts-with': 'StartsWith', 'delete-value': 'DeleteByWord', clear: 'Clear' }, { word: 'car' }],
  ['heap', 'Heap', { insert: 'Insert', 'extract-min': 'ExtractMin', peek: 'Peek', clear: 'Clear' }, { value: -7 }],
  ['segment-tree', 'SegmentTree', { 'update-index': 'Update', 'range-sum': 'RangeSum', clear: 'Clear' }, { index: 3, value: -7, minimum: 2, maximum: 7 }],
  ['fenwick-tree', 'FenwickTree', { 'add-index': 'Add', 'prefix-sum': 'PrefixSum', 'range-sum': 'RangeSum', clear: 'Clear' }, { index: 3, delta: -7, minimum: 2, maximum: 7 }],
  ['r-tree', 'RTree', { insert: 'Insert', 'search-overlap': 'SearchOverlap', 'delete-value': 'DeleteById', clear: 'Clear' }, { minX: 2, minY: 2, maxX: 7, maxY: 7, id: 1 }],
  ['lsm-tree', 'LSMTree', { insert: 'Insert', 'search-value': 'SearchByKey', 'delete-value': 'DeleteByKey', flush: 'Flush', compact: 'Compact', clear: 'Clear' }, { key: 30, value: -7 }],
]

test('Trie preserves shared prefixes, terminal markers, IDs, and clone independence', () => {
  const trie = new Trie()
  for (const word of ['app', 'apple', 'apt', 'bat']) assert.equal(trie.insert(word), true)
  const beforeDuplicate = trie.getDiagram()
  assert.equal(trie.insert('app'), false)
  assert.deepEqual(trie.getDiagram(), beforeDuplicate)
  assert.equal(trie.contains('ap'), false)
  assert.equal(trie.startsWith('ap'), true)
  assert.equal(trie.startsWith('axe'), false)
  const copy = trie.clone()
  assert.equal(copy.delete('app'), true)
  assert.equal(copy.contains('apple'), true)
  assert.equal(copy.contains('app'), false)
  assert.equal(trie.contains('app'), true)
  assert.equal(copy.delete('ap'), false)
  assert.equal(copy.delete('apple'), true)
  assert.equal(copy.startsWith('ap'), true, 'apt still owns the prefix')
  assert.equal(copy.delete('apt'), true)
  assert.equal(copy.startsWith('a'), false)
  const oldIds = new Set(copy.getDiagram().map((entry) => entry.id))
  copy.clear()
  assert.equal(copy.length, 0)
  assert.equal(copy.getDiagram().length, 1)
  copy.insert('bat')
  assert.ok(copy.getDiagram().every((entry) => entry.id === 'trie-root' || !oldIds.has(entry.id)))
  for (const word of ['', 'Hello', 'a b', '123', 'a'.repeat(33)]) assert.throws(() => trie.insert(word))
})

test('Heap keeps min-order and complete shape through duplicates and repeated extraction', () => {
  const heap = new Heap()
  const values = [8, -3, 8, 2, 0, 17, -9, -9, Number.MAX_SAFE_INTEGER]
  for (const value of values) {
    heap.insert(value)
    const entries = heap.getValues()
    for (let index = 1; index < entries.length; index += 1) assert.ok(entries[Math.floor((index - 1) / 2)] <= entries[index])
  }
  const clone = heap.clone()
  const output = []
  while (clone.length) output.push(clone.extractMin())
  assert.deepEqual(output, [...values].sort((a, b) => a - b))
  assert.equal(heap.length, values.length)
  assert.equal(clone.extractMin(), undefined)
  assert.equal(clone.peek(), undefined)
  const ids = new Set(heap.getDiagram().map((entry) => entry.id))
  heap.clear()
  heap.insert(5)
  assert.ok(!ids.has(heap.getDiagram()[0].id))
  assert.throws(() => heap.insert(1.2))
})

test('Segment and Fenwick sums match an independent array after point operations', () => {
  const source = [3, -4, 9, 0, 2, 7, -5, 8, 1, 6, 11]
  const segment = new SegmentTree(source)
  const fenwick = new FenwickTree(source)
  const expected = source.map(BigInt)
  for (let step = 0; step < 35; step += 1) {
    const index = step * 7 % expected.length
    const delta = step % 13 - 6
    expected[index] += BigInt(delta)
    segment.update(index, Number(expected[index]))
    fenwick.add(index, delta)
    for (let minimum = 0; minimum < expected.length; minimum += 1) {
      let sum = 0n
      for (let maximum = minimum; maximum < expected.length; maximum += 1) {
        sum += expected[maximum]
        assert.equal(segment.rangeSum(minimum, maximum), sum)
        assert.equal(fenwick.rangeSum(minimum, maximum), sum)
        if (minimum === 0) assert.equal(fenwick.prefixSum(maximum), sum)
      }
    }
  }
  for (const tree of [segment, fenwick]) {
    const clone = tree.clone()
    clone.clear()
    assert.equal(clone.length, expected.length)
    assert.equal(clone.rangeSum(0, expected.length - 1), 0n)
    assert.deepEqual(tree.getValues(), expected)
    assert.throws(() => tree.rangeSum(4, 2))
    assert.throws(() => tree.rangeSum(-1, 3))
    assert.throws(() => tree.rangeSum(0, tree.length))
  }
  assert.throws(() => new SegmentTree().rangeSum(0, 0))
  assert.throws(() => new FenwickTree().prefixSum(0))
  const large = Number.MAX_SAFE_INTEGER
  assert.equal(new SegmentTree([large, large]).rangeSum(0, 1), 2n * BigInt(large))
  const exact = new FenwickTree([large, large])
  exact.add(0, large)
  assert.equal(exact.rangeSum(0, 1), 3n * BigInt(large))
  const singleton = new SegmentTree([3])
  singleton.update(0, -4)
  assert.equal(singleton.rangeSum(0, 0), -4n)
})

class SpatialAssertions {
  static valid(tree) {
    const diagram = tree.getDiagram()
    const byId = new Map(diagram.map((entry) => [entry.id, entry]))
    const leafDepths = new Set()
    const seen = new Set()
    const parse = (entry) => {
      const match = /^\[(-?\d+),(-?\d+)\]-\[(-?\d+),(-?\d+)\]$/.exec(entry.text)
      assert.ok(match)
      return match.slice(1).map(Number)
    }
    const visit = (entry, depth, root = false) => {
      assert.ok(!seen.has(entry.id))
      seen.add(entry.id)
      if (entry.id.startsWith('r-record-')) return
      assert.ok(entry.children.length <= 4)
      assert.ok(entry.children.length >= (root ? entry.label.includes('leaf') ? 1 : 2 : 2))
      if (entry.label.includes('leaf')) leafDepths.add(depth)
      const bounds = parse(entry)
      for (const childId of entry.children) {
        const child = byId.get(childId)
        assert.ok(child)
        const childBounds = parse(child)
        assert.ok(bounds[0] <= childBounds[0] && bounds[1] <= childBounds[1] && bounds[2] >= childBounds[2] && bounds[3] >= childBounds[3])
        visit(child, depth + 1)
      }
    }
    if (diagram.length) visit(diagram[0], 0, true)
    assert.equal(seen.size, diagram.length)
    assert.ok(leafDepths.size <= 1)
    assert.equal(diagram.filter((entry) => entry.id.startsWith('r-record-')).length, tree.length)
  }
}

test('R-Tree splits and condenses pages while overlap results agree with brute force', () => {
  const tree = new RTree()
  const records = new Map()
  for (let index = 0; index < 64; index += 1) {
    const x = index * 7 % 29 - 14
    const y = index * 11 % 31 - 15
    const rectangle = new Rectangle(x, y, x + index % 4, y + index % 5)
    records.set(tree.insert(rectangle), rectangle)
    SpatialAssertions.valid(tree)
  }
  const clone = tree.clone()
  for (let step = 0; step < 30; step += 1) {
    const x = step % 15 - 7
    const query = new Rectangle(x, -8, x + 6, 9)
    const expected = [...records].filter(([, rectangle]) => rectangle.intersects(query)).map(([id]) => id).sort((a, b) => a - b)
    assert.deepEqual(tree.search(query).map((record) => record.id).sort((a, b) => a - b), expected)
  }
  for (let step = 0; step < 64; step += 1) {
    const id = step * 17 % 64 + 1
    assert.equal(tree.delete(id), true)
    records.delete(id)
    SpatialAssertions.valid(tree)
    assert.deepEqual(tree.search(new Rectangle(-100, -100, 100, 100)).map((record) => record.id).sort((a, b) => a - b), [...records.keys()].sort((a, b) => a - b))
  }
  assert.equal(clone.length, 64)
  assert.equal(tree.delete(1), false)
  assert.ok(tree.insert(new Rectangle(0, 0, 0, 0)) > 64)
  tree.clear()
  assert.equal(tree.length, 0)
  SpatialAssertions.valid(tree)
  assert.ok(tree.insert(new Rectangle(1, 1, 2, 2)) > 65)
  assert.throws(() => new Rectangle(2, 1, 0, 4))
  assert.equal(new Rectangle(0, 0, 2, 2).intersects(new Rectangle(2, 2, 3, 3)), true)
})

test('LSM newest versions and tombstones survive flush and full compaction', () => {
  const tree = new LSMTree()
  const expected = new Map()
  for (let step = 0; step < 60; step += 1) {
    const key = step * 7 % 13 - 6
    if (step % 4 === 0) {
      tree.delete(key)
      expected.delete(key)
    } else {
      tree.put(key, step)
      expected.set(key, step)
    }
    if (step % 5 === 0) tree.flush()
    if (step % 11 === 0) tree.compact()
    assert.equal(tree.length, expected.size)
    for (let candidate = -6; candidate <= 6; candidate += 1) {
      const record = tree.lookup(candidate)
      assert.equal(record?.value ?? undefined, expected.get(candidate))
    }
  }
  const clone = tree.clone()
  tree.compact()
  assert.equal(tree.runCount, tree.length ? 1 : 0)
  for (const row of tree.getRows()) {
    assert.ok(row.records.every((record) => record.value !== null))
    assert.ok(row.records.every((record, index) => index === 0 || row.records[index - 1].key < record.key))
  }
  tree.clear()
  assert.equal(tree.length, 0)
  assert.equal(tree.storedCount, 0)
  assert.equal(clone.length, expected.size)
  tree.put(1, 10)
  tree.flush()
  tree.delete(1)
  tree.flush()
  assert.equal(tree.lookup(1).value, null)
  tree.compact()
  assert.equal(tree.lookup(1), undefined, 'full compaction must not resurrect deleted keys')
  tree.put(1, 20)
  assert.equal(tree.lookup(1).value, 20)
  assert.equal(tree.length, 1)
})

for (const [kind, className, actions, input] of features) {
  test(`${kind}: menus, input contracts, snapshots, and final-frame commits`, async () => {
    const source = AdditionalTreeCatalog.createDefault(kind)
    assert.equal(source.length, 10)
    assert.deepEqual(ActionCatalog.getActions(kind).map((action) => action.kind), Object.keys(actions))
    const overview = StructureInformation.get(kind)
    assert.ok(overview.summary)
    assert.ok(overview.useCases.length >= 4)
    for (const technology of overview.technologies) {
      assert.ok(technology.name && technology.usage && technology.url.startsWith('https://'))
    }
    const original = structuredClone(AdditionalTreeCatalog.createScene(source))
    for (const [action, folder] of Object.entries(actions)) {
      const request = ActionInputRequest.create(kind, action, source.length)
      const drafts = {}
      if (request) {
        assert.ok(request.structured)
        assert.ok(Object.keys(request.structured.validate({})).length)
        for (const field of request.structured.fields) drafts[field.name] = String(input[field.name])
        assert.deepEqual(request.structured.validate(drafts), {})
      }
      const payload = request ? request.structured.parse(drafts) : {}
      const { [folder + 'Animation']: Sequence } = await import(`../src/components/${StructurePaths.group(kind)}/${className}/${folder}/${folder}Animation.ts`)
      const plan = new Sequence(source, payload)
      const storedFirst = structuredClone(plan.steps[0].scene)
      assert.deepEqual(AdditionalTreeCatalog.createScene(source), original)
      assert.equal(plan.steps.at(-1).scene.count, plan.result.length)
      for (const step of plan.steps.slice(0, -1)) assert.equal(step.scene.count, source.length)
      for (const step of plan.steps) {
        const ids = new Set(step.scene.nodes.map((node) => node.id))
        assert.equal(ids.size, step.scene.nodes.length)
        for (const edge of step.scene.edges) assert.ok(ids.has(edge.from) && ids.has(edge.to))
        assert.ok(step.description && step.code)
      }
      assert.deepEqual(plan.steps[0].scene, storedFirst)
      const second = new Sequence(source, payload)
      assert.deepEqual(second.steps, plan.steps, 'repeated planning must be deterministic')
      const information = Sequence.describe(source.length, source.storedCount ?? source.length, source.runCount ?? 0)
      assert.ok(information.time.best && information.time.average && information.time.worst)
      assert.ok(information.memory.best && information.memory.average && information.memory.worst)
      assert.equal(new Set(information.terms.map((term) => term.symbol)).size, information.terms.length)
    }
  })
}

test('structured inputs reject unsafe numbers, invalid indices, words, and reversed bounds', () => {
  for (const kind of ['segment-tree', 'fenwick-tree']) {
    const empty = ActionInputRequest.create(kind, 'range-sum', 0)
    assert.equal(empty.available, false)
    const range = ActionInputRequest.create(kind, 'range-sum', 10).structured
    assert.deepEqual(range.validate({ minimum: '0', maximum: '9' }), {})
    for (const values of [{ minimum: '-1', maximum: '4' }, { minimum: '4', maximum: '3' }, { minimum: '0', maximum: '10' }, { minimum: '0', maximum: '' }]) assert.ok(Object.keys(range.validate(values)).length)
  }
  const word = ActionInputRequest.create('trie', 'insert', 10)
  assert.equal(word.label, 'Word')
  assert.equal(word.validate('apple'), null)
  for (const value of ['', 'A', 'a b', '123', 'a'.repeat(33)]) assert.ok(word.validate(value))
  const rectangle = ActionInputRequest.create('r-tree', 'insert', 10).structured
  assert.deepEqual(rectangle.validate({ minX: '-2', minY: '0', maxX: '-2', maxY: '0' }), {})
  assert.ok(rectangle.validate({ minX: '3', minY: '0', maxX: '2', maxY: '4' }).maxX)
  const lsm = ActionInputRequest.create('lsm-tree', 'insert', 10).structured
  assert.deepEqual(lsm.parse({ key: '-2', value: '12' }), { key: -2, value: 12 })
  for (const value of ['', '1.5', '1e2', 'NaN', '9007199254740992']) assert.ok(lsm.validate({ key: '1', value }).value)
})
