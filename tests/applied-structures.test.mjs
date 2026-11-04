import assert from 'node:assert/strict'
import { test } from 'node:test'
import { AppliedStructureCatalog } from '../src/visualization/AppliedStructureCatalog.ts'
import { AppliedStructureDefinitions } from '../src/visualization/AppliedStructureDefinitions.ts'
import { AppliedActionCatalog } from '../src/visualization/AppliedActionCatalog.ts'
import { AppliedInput } from '../src/visualization/AppliedInput.ts'
import { AppliedLayout } from '../src/visualization/AppliedLayout.ts'
import { ActionCatalog } from '../src/visualization/ActionCatalog.ts'
import { ActionInputRequest } from '../src/visualization/ActionInputRequest.ts'
import { LinearAnimation } from '../src/visualization/LinearAnimation.ts'
import { StructureInformation } from '../src/components/StructureInfo/StructureInformation.ts'
import { AppendOnlyLog } from '../src/components/AdvancedDataStructures/StorageIndexes/AppendOnlyLog/AppendOnlyLog.ts'
import { XArray } from '../src/components/AdvancedDataStructures/MemoryIO/XArray/XArray.ts'
import { FanoutArray } from '../src/components/AdvancedDataStructures/StorageIndexes/FanoutArray/FanoutArray.ts'
import { FlatVectorArray } from '../src/components/AdvancedDataStructures/SpatialIndexes/FlatVectorArray/FlatVectorArray.ts'
import { RequestTagArray } from '../src/components/AdvancedDataStructures/MemoryIO/RequestTagArray/RequestTagArray.ts'
import { MultiQueue } from '../src/components/AdvancedDataStructures/MemoryIO/MultiQueue/MultiQueue.ts'
import { LockFreeRing } from '../src/components/AdvancedDataStructures/MemoryIO/LockFreeRing/LockFreeRing.ts'
import { GiST } from '../src/components/AdvancedDataStructures/StorageIndexes/GiST/GiST.ts'
import { BKDTree } from '../src/components/AdvancedDataStructures/SpatialIndexes/BKDTree/BKDTree.ts'
import { BallTree } from '../src/components/AdvancedDataStructures/SpatialIndexes/BallTree/BallTree.ts'
import { MapleTree } from '../src/components/AdvancedDataStructures/MemoryIO/MapleTree/MapleTree.ts'
import { ChecksummedBlockTree } from '../src/components/AdvancedDataStructures/Integrity/ChecksummedBlockTree/ChecksummedBlockTree.ts'
import { InvertedIndex } from '../src/components/AdvancedDataStructures/TextSearch/InvertedIndex/InvertedIndex.ts'
import { MinimizerIndex } from '../src/components/AdvancedDataStructures/SpecializedGraphs/MinimizerIndex/MinimizerIndex.ts'
import { LSHIndex } from '../src/components/AdvancedDataStructures/SpatialIndexes/LSHIndex/LSHIndex.ts'
import { BlockedBloomFilter } from '../src/components/AdvancedDataStructures/Probabilistic/BlockedBloomFilter/BlockedBloomFilter.ts'
import { HNSWGraph } from '../src/components/AdvancedDataStructures/SpatialIndexes/HNSWGraph/HNSWGraph.ts'
import { CompactedDeBruijnGraph } from '../src/components/AdvancedDataStructures/SpecializedGraphs/CompactedDeBruijnGraph/CompactedDeBruijnGraph.ts'
import { AddressSpaceGraph } from '../src/components/AdvancedDataStructures/SpecializedGraphs/AddressSpaceGraph/AddressSpaceGraph.ts'

function validScene(scene) {
  const ids = new Set(scene.nodes.map((node) => node.id))
  assert.equal(ids.size, scene.nodes.length, 'Every represented cell/node has a unique key')
  const edges = new Set()
  for (const edge of scene.edges) {
    assert.ok(ids.has(edge.from) && ids.has(edge.to), `Both endpoints exist for ${edge.id}`)
    assert.ok(!edges.has(edge.id), `Edge ${edge.id} has a stable unique key`)
    edges.add(edge.id)
  }
  for (const node of scene.nodes) {
    assert.ok(Number.isFinite(node.x) && Number.isFinite(node.y))
    assert.ok(node.x >= 0 && node.x <= scene.width)
    assert.ok(node.y >= 0 && node.y <= scene.height)
  }
}

test('applied structures have ten-element defaults, sources, dialogs, and independent playback snapshots', () => {
  const models = AppliedStructureCatalog.createModels()
  assert.equal(models.size, 26)
  for (const definition of AppliedStructureDefinitions.structures) {
    const model = models.get(definition.kind)
    assert.equal(model.length, 10, definition.kind)
    const original = model.getDiagram()
    const scene = AppliedStructureCatalog.createScene(model)
    assert.equal(scene.kind, definition.kind)
    assert.ok(scene.countLabel)
    validScene(scene)
    const information = StructureInformation.get(definition.kind)
    assert.equal(information.useCases.length, 4)
    assert.ok(information.technologies.length > 0)
    for (const example of information.technologies) assert.match(example.url, /^https:\/\//)
    for (const choice of AppliedActionCatalog.getActions(definition.kind)) {
      assert.equal(ActionInputRequest.requiresInput(definition.kind, choice.kind), choice.fields.length > 0)
    }
    const plan = new LinearAnimation(model, new AppliedLayout(), 'inspect-storage', {}, 'Inspect', 'Inspect actual storage')
    assert.deepEqual(model.getDiagram(), original, 'Recording a plan never mutates the committed model')
    assert.notEqual(plan.result, model)
    const frames = plan.steps
    assert.ok(frames.length <= LinearAnimation.maximumDetailedFrames + 2)
    const initial = JSON.stringify(frames[0].scene)
    for (const frame of frames) {
      validScene(frame.scene)
      assert.equal(frame.scene.width, frames[0].scene.width)
      assert.equal(frame.scene.height, frames[0].scene.height)
    }
    plan.result.execute('clear', {})
    assert.equal(JSON.stringify(frames[0].scene), initial)
    assert.deepEqual(model.getDiagram(), original, 'Changing a clone cannot alter the source or earlier snapshots')
  }
})

test('append-only log reads are repeatable, offsets survive clear, and full rejection preserves state', () => {
  const model = new AppendOnlyLog()
  model.execute('insert-end', { value: 40 })
  assert.equal(model.execute('search-index', { index: 0 }).value, 40)
  assert.equal(model.execute('search-index', { index: 0 }).value, 40)
  assert.equal(model.length, 1)
  model.execute('clear', {})
  model.execute('insert-end', { value: 50 })
  assert.equal(model.execute('search-index', { index: 0 }).value, null)
  assert.equal(model.execute('search-index', { index: 1 }).value, 50)
  while (model.length < 64) model.execute('insert-end', { value: model.length })
  const before = model.getDiagram()
  assert.equal(model.execute('insert-end', { value: 999 }).status, 'REJECTED')
  assert.deepEqual(model.getDiagram(), before)
})

test('XArray keeps zero distinct from absence and reclaims only empty radix branches', () => {
  const model = new XArray()
  for (const index of [0, 63, 64, 4095]) model.execute('update-index', { index, value: 0 })
  for (const index of [0, 63, 64, 4095]) assert.equal(model.execute('search-index', { index }).value, 0)
  assert.equal(model.execute('search-index', { index: 65 }).value, null)
  model.execute('delete-index', { index: 63 })
  assert.equal(model.execute('search-index', { index: 0 }).value, 0)
  model.execute('delete-index', { index: 0 })
  assert.ok(!model.getDiagram().rows.flat().some((entry) => entry.id === 'xa-branch-0'))
  assert.throws(() => model.execute('update-index', { index: 4096, value: 1 }), /index/)
  assert.equal(model.length, 2)
})

test('fanout search agrees with a sorted-array oracle across byte boundaries', () => {
  const model = new FanoutArray()
  const values = [65535, 256, 255, 0, 1024, 511, 257]
  for (const value of values) model.execute('insert', { value })
  const sorted = [...values].sort((a, b) => a - b)
  for (const value of [...values, 1, 258, 512, 65534]) {
    const expected = sorted.indexOf(value)
    assert.equal(model.execute('search-value', { value }).value, expected < 0 ? null : expected)
  }
  assert.equal(model.execute('insert', { value: 256 }).status, 'REJECTED')
  model.execute('delete-value', { value: 256 })
  assert.equal(model.execute('search-value', { value: 257 }).value, 2)
  assert.equal(model.execute('search-value', { value: 256 }).value, null)
  validScene(new AppliedLayout().create(model))
})

test('flat vectors and ball bounds agree with exhaustive squared-distance search', () => {
  const points = [{ x: 0, y: 0 }, { x: 0, y: 0 }, { x: -5, y: 8 }, { x: 9, y: -2 }, { x: 1024, y: 1024 }, { x: -1024, y: -1024 }]
  const flat = new FlatVectorArray()
  for (const point of points) flat.execute('insert', point)
  const ball = new BallTree()
  ball.execute('build-values', { text: points.map((point) => `${point.x}:${point.y}`).join(', ') })
  for (const query of [{ x: 0, y: 0 }, { x: -4, y: 9 }, { x: 1024, y: 0 }, { x: -900, y: -1000 }]) {
    let best = 0
    for (let index = 1; index < points.length; index += 1) {
      const squared = (point) => (point.x - query.x) ** 2 + (point.y - query.y) ** 2
      if (squared(points[index]) < squared(points[best])) best = index
    }
    assert.equal(flat.execute('nearest-neighbor', query).value, best + 1)
    assert.equal(ball.execute('nearest-neighbor', query).value, best + 1)
  }
})

test('request tags reject exhaustion and double release while reusing exactly the freed slot', () => {
  const model = new RequestTagArray()
  for (let tag = 0; tag < 16; tag += 1) assert.equal(model.execute('allocate', { value: tag * 7 }).value, tag)
  const before = model.getDiagram()
  assert.equal(model.execute('allocate', { value: 999 }).status, 'REJECTED')
  assert.deepEqual(model.getDiagram(), before)
  model.execute('release', { index: 7 })
  assert.equal(model.execute('release', { index: 7 }).status, 'REJECTED')
  assert.equal(model.execute('allocate', { value: 999 }).value, 7)
  assert.equal(model.execute('search-index', { index: 7 }).value, 999)
  assert.equal(model.execute('search-index', { index: 8 }).value, 56)
})

test('multiqueue dispatch rotates fairly and retains FIFO order inside each queue', () => {
  const model = new MultiQueue()
  for (const [queue, value] of [[0, 10], [0, 11], [2, 20], [2, 21], [1, 30]]) model.execute('enqueue', { queue, value })
  assert.deepEqual(Array.from({ length: 5 }, () => model.execute('dequeue', {}).value), [10, 30, 20, 11, 21])
  assert.equal(model.execute('dequeue', {}).value, null)
  model.execute('enqueue', { queue: 1, value: 77 })
  assert.equal(model.execute('dequeue', {}).value, 77)
  assert.equal(model.length, 0)
})

test('SPSC sequence slots survive many wraps without overwriting unread values', () => {
  const model = new LockFreeRing()
  for (let lap = 0; lap < 8; lap += 1) {
    for (let value = 0; value < 16; value += 1) model.execute('enqueue', { value: lap * 100 + value })
    const before = model.getDiagram()
    assert.equal(model.execute('enqueue', { value: -1 }).status, 'REJECTED')
    assert.deepEqual(model.getDiagram(), before)
    for (let value = 0; value < 16; value += 1) assert.equal(model.execute('dequeue', {}).value, lap * 100 + value)
    assert.equal(model.execute('dequeue', {}).value, null)
  }
  model.execute('enqueue', { value: 17 })
  const copy = model.clone()
  copy.execute('clear', {})
  assert.equal(model.execute('dequeue', {}).value, 17)
  assert.equal(copy.length, 0)
})

test('GiST splits retain every interval and overlap results agree with an independent predicate', () => {
  const model = new GiST()
  const intervals = Array.from({ length: 60 }, (_, index) => ({ minimum: index * 3 - 90, maximum: index * 3 - 80 }))
  for (const interval of intervals) model.execute('insert', interval)
  for (const query of [{ minimum: -100, maximum: -89 }, { minimum: 0, maximum: 0 }, { minimum: -1024, maximum: 1024 }, { minimum: 500, maximum: 501 }]) {
    const expected = intervals.flatMap((interval, index) => interval.minimum <= query.maximum && query.minimum <= interval.maximum ? [index + 1] : [])
    assert.deepEqual([...model.execute('search-overlap', query).value].sort((a, b) => a - b), expected)
  }
  const diagram = model.getDiagram()
  const records = diagram.rows.flat().filter((entry) => entry.id.startsWith('gist-record-'))
  assert.equal(records.length, intervals.length)
  for (const entry of diagram.rows.flat().filter((entry) => entry.id.startsWith('gist-page-'))) assert.ok(entry.children.length <= 4)
  validScene(new AppliedLayout().create(model))
})

test('BKD cells prune without changing inclusive boundary or duplicate-point results', () => {
  const model = new BKDTree()
  const points = [{ x: -4, y: 2 }, { x: 0, y: 0 }, { x: 0, y: 0 }, { x: 4, y: 2 }, { x: 10, y: 10 }]
  model.execute('build-values', { text: points.map((point) => `${point.x}:${point.y}`).join(',') })
  const query = { minX: -4, minY: 0, maxX: 4, maxY: 2 }
  assert.deepEqual([...model.execute('search-overlap', query).value].sort((a, b) => a - b), [1, 2, 3, 4])
  const before = model.getDiagram()
  assert.throws(() => model.execute('build-values', { text: '1:2, 2048:3' }), /x/)
  assert.deepEqual(model.getDiagram(), before)
})

test('Maple range replacement and erasure preserve outside fragments and exact gap lookup', () => {
  const model = new MapleTree()
  model.execute('insert', { minimum: 10, maximum: 30, value: 1 })
  model.execute('insert', { minimum: 15, maximum: 20, value: 2 })
  for (let index = 0; index < 40; index += 1) {
    const expected = index < 10 || index > 30 ? null : index >= 15 && index <= 20 ? 2 : 1
    assert.equal(model.execute('search-index', { index }).value, expected)
  }
  model.execute('delete-value', { minimum: 12, maximum: 25 })
  assert.equal(model.execute('search-index', { index: 11 }).value, 1)
  assert.equal(model.execute('search-index', { index: 26 }).value, 1)
  assert.equal(model.execute('search-index', { index: 20 }).value, null)
  assert.equal(model.execute('find-gap', { count: 11 }).value, 12)
  assert.equal(model.execute('find-gap', { count: 4096 }).value, null)
  validScene(new AppliedLayout().create(model))
})

test('checksum verification detects corrupted data and copy-on-write updates preserve the source', () => {
  const model = new ChecksummedBlockTree()
  const original = model.rootChecksum
  assert.equal(model.execute('verify-proof', {}).value, true)
  const copy = model.clone()
  copy.execute('update-index', { index: 4, value: 999 })
  assert.notEqual(copy.rootChecksum, original)
  assert.equal(model.rootChecksum, original)
  assert.equal(copy.execute('verify-proof', {}).value, true)
  copy.execute('corrupt-block', { index: 4, value: 111 })
  assert.equal(copy.execute('verify-proof', {}).value, false)
  assert.equal(model.execute('verify-proof', {}).value, true)
  copy.execute('update-index', { index: 4, value: 222 })
  assert.equal(copy.execute('verify-proof', {}).value, true)
})

test('inverted postings implement AND queries and remove old memberships on document replacement', () => {
  const model = new InvertedIndex()
  model.execute('insert', { index: 10, text: 'red red tree' })
  model.execute('insert', { index: 2, text: 'red graph' })
  assert.deepEqual(model.execute('search-text', { text: 'red' }).value, [2, 10])
  assert.deepEqual(model.execute('search-text', { text: 'red tree' }).value, [10])
  model.execute('insert', { index: 10, text: 'blue tree' })
  assert.deepEqual(model.execute('search-text', { text: 'red tree' }).value, [])
  assert.deepEqual(model.execute('search-text', { text: 'blue tree' }).value, [10])
  model.execute('delete-value', { index: 10 })
  assert.deepEqual(model.execute('search-text', { text: 'blue' }).value, [])
})

test('minimizer anchor verification agrees with exhaustive exact substring search', () => {
  for (const reference of ['aaaaaaaaaaaa', 'acgttgcagtacacgttgcagt', 'acgtacgtacgtacgt']) {
    const model = new MinimizerIndex()
    model.execute('build-text', { text: reference })
    const patterns = new Set(['ttttt', 'ccccc'])
    for (let index = 0; index + 5 <= reference.length; index += 1) patterns.add(reference.slice(index, index + 5))
    for (const text of patterns) {
      const expected = []
      for (let index = 0; index + text.length <= reference.length; index += 1) if (reference.startsWith(text, index)) expected.push(index)
      assert.deepEqual(model.execute('search-text', { text }).value, expected, `${reference} / ${text}`)
    }
  }
})

test('document replacement applies the vocabulary limit to the resulting index', () => {
  const model = new InvertedIndex()
  const term = (index) => String.fromCharCode(97 + Math.floor(index / 26)) + String.fromCharCode(97 + index % 26)
  for (let document = 0; document < 4; document += 1) {
    const text = Array.from({ length: 16 }, (_, index) => term(document * 16 + index)).join(' ')
    model.execute('insert', { index: document, text })
  }
  const replacement = Array.from({ length: 16 }, (_, index) => term(64 + index)).join(' ')
  assert.notEqual(model.execute('insert', { index: 0, text: replacement }).status, 'REJECTED')
  assert.deepEqual(model.execute('search-text', { text: term(0) }).value, [])
  assert.deepEqual(model.execute('search-text', { text: term(64) }).value, [0])
  const before = model.getDiagram()
  assert.equal(model.execute('insert', { index: 4, text: term(80) }).status, 'REJECTED')
  assert.deepEqual(model.getDiagram(), before)
})

test('range-fragment overflow rejects a Maple overwrite before changing ranges or IDs', () => {
  const model = new MapleTree()
  for (let index = 0; index < 64; index += 1) model.execute('insert', { minimum: index * 4, maximum: index * 4 + 2, value: index })
  const before = model.getDiagram()
  assert.equal(model.execute('insert', { minimum: 1, maximum: 1, value: 999 }).status, 'REJECTED')
  assert.deepEqual(model.getDiagram(), before)
  assert.equal(model.execute('search-index', { index: 1 }).value, 0)
})

test('LSH encodings are deterministic and always return an existing approximate match', () => {
  const first = LSHIndex.createDefault()
  const second = LSHIndex.createDefault()
  assert.deepEqual(first.getDiagram(), second.getDiagram())
  for (const query of [{ x: 0, y: 0 }, { x: -15, y: 8 }, { x: 100, y: -90 }]) {
    const result = first.execute('nearest-neighbor', query)
    assert.match(result.status, /APPROXIMATE/)
    assert.ok(first.getDiagram().rows.flat().some((entry) => entry.id === `lsh-${result.value}`))
    assert.equal(result.value, second.execute('nearest-neighbor', query).value)
  }
})

test('blocked Bloom membership has no false negatives, retains clones, and rejects the add limit unchanged', () => {
  const model = new BlockedBloomFilter()
  const values = [Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER, 0, -1, 31, 32]
  for (const value of values) model.execute('insert', { value })
  for (const value of values) assert.equal(model.execute('search-value', { value }).value, true)
  const copy = model.clone()
  copy.execute('clear', {})
  for (const value of values) assert.equal(copy.execute('search-value', { value }).value, false)
  for (const value of values) assert.equal(model.execute('search-value', { value }).value, true)
  while (model.length < 64) model.execute('insert', { value: model.length })
  const before = model.getDiagram()
  assert.equal(model.execute('insert', { value: 123456 }).status, 'REJECTED')
  assert.deepEqual(model.getDiagram(), before)
})

test('HNSW links stay within their layers and degree bounds after incremental insertions', () => {
  const model = HNSWGraph.createDefault()
  for (let index = 0; index < 20; index += 1) model.execute('insert', { x: index * 7 - 50, y: index * 3 - 20 })
  const diagram = model.getDiagram()
  const degree = new Map()
  for (const edge of diagram.links) if (/^L\d$/.test(edge.label)) {
    assert.equal(edge.from.split('-').at(-1), edge.to.split('-').at(-1))
    degree.set(edge.from, (degree.get(edge.from) ?? 0) + 1)
  }
  assert.ok([...degree.values()].every((count) => count <= 4))
  validScene(new AppliedLayout().create(model))
  const before = JSON.stringify(diagram)
  const result = model.execute('nearest-neighbor', { x: 12, y: 4 })
  assert.ok(model.getVertexIds().includes(result.value))
  assert.match(result.description, /Approximate/)
  assert.equal(JSON.stringify(model.getDiagram()), before)
})

test('compacted de Bruijn cycles close and graph walks preserve k-mer overlaps', () => {
  const model = new CompactedDeBruijnGraph()
  model.execute('build-text', { text: 'acgacg' })
  assert.equal(model.length, 3)
  assert.equal(model.getVertexIds().length, 1)
  const id = model.getVertexIds()[0]
  assert.deepEqual(model.getNeighborIds(id), [id])
  assert.equal(model.execute('search-text', { text: 'acgacgacg' }).value, true)
  assert.equal(model.execute('search-text', { text: 'ttttt' }).value, false)
  model.execute('build-text', { text: 'aaacaaag' })
  assert.equal(model.execute('search-text', { text: 'aaacaaag' }).value, true)
  validScene(new AppliedLayout().create(model))
})

test('typed references distinguish edge types and delete all incident references with a node', () => {
  const model = new AddressSpaceGraph()
  model.execute('add-vertex', { value: 1, nodeType: 0 })
  model.execute('add-vertex', { value: 2, nodeType: 1 })
  model.execute('add-edge', { source: 1, target: 2, referenceType: 0 })
  model.execute('add-edge', { source: 1, target: 2, referenceType: 1 })
  assert.equal(model.getDiagram().links.length, 2)
  const before = model.getDiagram()
  assert.equal(model.execute('add-edge', { source: 1, target: 2, referenceType: 1 }).status, 'REJECTED')
  assert.deepEqual(model.getDiagram(), before)
  assert.match(model.execute('browse-node', { value: 1 }).value, /Organizes.*HasComponent/)
  model.execute('delete-value', { value: 2 })
  assert.equal(model.getDiagram().links.length, 0)
  validScene(new AppliedLayout().create(model))
})

test('new graph traversals stay in Algorithms, preserve topology, and stop at reachable vertices', () => {
  for (const kind of ['hnsw-graph', 'compacted-de-bruijn-graph', 'address-space-graph']) {
    const model = AppliedStructureCatalog.createDefault(kind)
    const start = model.getVertexIds()[0]
    const before = model.getDiagram()
    assert.ok(ActionCatalog.getScopedActions(kind, 'overview').every((choice) => !['breadth-first', 'depth-first'].includes(choice.kind)))
    assert.deepEqual(ActionCatalog.getScopedActions(kind, 'graph-traversal').map((choice) => choice.kind), ['breadth-first', 'depth-first'])
    for (const action of ['breadth-first', 'depth-first']) {
      const result = model.execute(action, { index: start })
      assert.equal(result.value[0], start)
      assert.equal(new Set(result.value).size, result.value.length)
      assert.deepEqual(model.getDiagram(), before)
    }
  }
})

test('structured dialogs reject malformed text, invalid coordinate bounds, and out-of-range tags', () => {
  assert.ok(AppliedInput.create('bkd-tree', 'build-values').validate({ text: '1:2, 3:no' }).text)
  assert.ok(AppliedInput.create('bkd-tree', 'search-overlap').validate({ minX: '5', maxX: '2', minY: '0', maxY: '1' }).maxX)
  assert.ok(AppliedInput.create('request-tag-array', 'release').validate({ index: '16' }).index)
  assert.ok(AppliedInput.create('minimizer-index', 'build-text').validate({ text: 'ACGTT' }).text)
  assert.ok(AppliedInput.create('inverted-index', 'search-text').validate({ text: 'red  tree' }).text)
  assert.deepEqual(AppliedInput.create('ball-tree', 'nearest-neighbor').parse({ x: '-5', y: '10' }), { x: -5, y: 10 })
})
