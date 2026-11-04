import { StructurePaths } from './helpers/StructurePaths.mjs'
import assert from 'node:assert/strict'
import { test } from 'node:test'
import { PriorityQueue } from '../src/components/FundamentalDataStructures/QueuePriority/PriorityQueue/PriorityQueue.ts'
import { BinaryMaxHeap } from '../src/components/FundamentalDataStructures/QueuePriority/BinaryMaxHeap/BinaryMaxHeap.ts'
import { BinomialHeap } from '../src/components/AdvancedDataStructures/QueuesHeaps/BinomialHeap/BinomialHeap.ts'
import { FibonacciHeap } from '../src/components/AdvancedDataStructures/QueuesHeaps/FibonacciHeap/FibonacciHeap.ts'
import { PairingHeap } from '../src/components/AdvancedDataStructures/QueuesHeaps/PairingHeap/PairingHeap.ts'
import { LeftistHeap } from '../src/components/AdvancedDataStructures/QueuesHeaps/LeftistHeap/LeftistHeap.ts'
import { SkewHeap } from '../src/components/AdvancedDataStructures/QueuesHeaps/SkewHeap/SkewHeap.ts'
import { IndexedPriorityQueue } from '../src/components/AdvancedDataStructures/QueuesHeaps/IndexedPriorityQueue/IndexedPriorityQueue.ts'
import { MonotonicQueue } from '../src/components/AdvancedDataStructures/QueuesHeaps/MonotonicQueue/MonotonicQueue.ts'
import { PriorityStructureCatalog } from '../src/visualization/PriorityStructureCatalog.ts'
import { StructuredPriorityInput } from '../src/visualization/StructuredPriorityInput.ts'
import { ActionCatalog } from '../src/visualization/ActionCatalog.ts'
import { ActionInputRequest } from '../src/visualization/ActionInputRequest.ts'
import { StructureCatalog } from '../src/visualization/StructureCatalog.ts'
import { StructureInformation } from '../src/components/StructureInfo/StructureInformation.ts'
import { LinearAnimation } from '../src/visualization/LinearAnimation.ts'
import { MenuNavigation } from '../src/components/MainMenu/MenuNavigation.ts'

class PriorityInvariants {
  static binary(model, maximum = false) {
    const entries = model.getEntries()
    assert.equal(entries.length, model.length)
    assert.equal(new Set(entries.map((entry) => entry.id)).size, entries.length)
    for (let index = 1; index < entries.length; index += 1) {
      const parent = entries[Math.floor((index - 1) / 2)]
      const child = entries[index]
      assert.ok(maximum ? parent.priority >= child.priority : parent.priority <= child.priority)
      if (parent.priority === child.priority) assert.ok(parent.serial < child.serial)
    }
    if (model instanceof IndexedPriorityQueue) {
      const positions = model.getPositions()
      assert.equal(positions.size, model.length)
      for (let index = 0; index < entries.length; index += 1) assert.equal(positions.get(entries[index].key), index)
    }
  }

  static binomial(model) {
    const seen = new Set()
    const inspect = (node) => {
      assert.ok(!seen.has(node.id))
      seen.add(node.id)
      let size = 1
      const degree = node.degree
      const children = []
      for (let child = node.child; child; child = child.sibling) children.push(child)
      assert.equal(children.length, degree)
      for (let index = 0; index < degree; index += 1) {
        const child = children[index]
        assert.ok(node.value <= child.value)
        assert.equal(child.degree, degree - index - 1)
        size += inspect(child)
      }
      assert.equal(size, 2 ** degree)
      return size
    }
    let total = 0
    let degree = -1
    for (const root of model.getRoots()) {
      assert.ok(root.degree > degree)
      assert.equal(root.sibling, null)
      degree = root.degree
      total += inspect(root)
    }
    assert.equal(total, model.length)
  }

  static fibonacci(model) {
    const seen = new Set()
    const inspectRing = (start, parent) => {
      if (!start) return 0
      let count = 0
      let node = start
      do {
        assert.ok(!seen.has(node.handle), 'Every Fibonacci node occurs in exactly one ring')
        seen.add(node.handle)
        assert.equal(node.parent, parent)
        assert.equal(node.left.right, node)
        assert.equal(node.right.left, node)
        if (parent) assert.ok(parent.key <= node.key)
        else assert.equal(node.marked, false)
        const degree = inspectRing(node.child, node)
        assert.equal(node.degree, degree)
        count += 1
        node = node.right
      } while (node !== start)
      return count
    }
    inspectRing(model.getMinimum(), null)
    assert.equal(seen.size, model.length)
    assert.deepEqual([...seen].sort((a, b) => a - b), model.getNodes().map((node) => node.handle).sort((a, b) => a - b))
    if (model.length) assert.equal(model.getMinimum().key, Math.min(...model.getNodes().map((node) => node.key)))
  }

  static linked(model) {
    const seen = new Set()
    const visit = (node) => {
      if (!node) return 0
      assert.ok(!seen.has(node.id))
      seen.add(node.id)
      if (model instanceof PairingHeap) {
        for (let child = node.child; child; child = child.next) {
          assert.ok(node.value <= child.value)
          visit(child)
        }
        return 0
      }
      for (const child of [node.left, node.right]) if (child) assert.ok(node.value <= child.value)
      const left = visit(node.left)
      const right = visit(node.right)
      if (model instanceof LeftistHeap) {
        assert.ok(left >= right)
        assert.equal(node.rank, 1 + Math.min(left, right))
      }
      return node.rank
    }
    const root = model.getRoot()
    if (root && model instanceof PairingHeap) assert.equal(root.next, null)
    visit(root)
    assert.equal(seen.size, model.length)
  }

  static check(model) {
    if (model instanceof BinomialHeap) this.binomial(model)
    else if (model instanceof FibonacciHeap) this.fibonacci(model)
    else if (model instanceof PriorityQueue || model instanceof IndexedPriorityQueue || model instanceof BinaryMaxHeap) this.binary(model, model instanceof BinaryMaxHeap)
    else if (!(model instanceof MonotonicQueue)) this.linked(model)
  }
}

test('priority queue selects by priority and preserves FIFO ties, including duplicate values', () => {
  const model = new PriorityQueue()
  const entries = [[10, 5], [20, 1], [20, 1], [30, -5], [40, 5], [50, 1]]
  for (const [value, priority] of entries) {
    model.execute('enqueue', { value, priority })
    PriorityInvariants.binary(model)
  }
  const expected = [30, 20, 20, 50, 10, 40]
  const clone = model.clone()
  for (const value of expected) {
    assert.equal(model.execute('peek', {}).value, value)
    assert.equal(model.execute('dequeue', {}).value, value)
    PriorityInvariants.binary(model)
  }
  assert.equal(model.execute('dequeue', {}).value, null)
  assert.equal(clone.length, entries.length)
})

test('binary max-heap extracts descending values and handles extremes and duplicates', () => {
  const model = new BinaryMaxHeap()
  const values = [0, -9, 20, 20, Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER, 10]
  for (const value of values) { model.execute('insert', { value }); PriorityInvariants.binary(model, true) }
  for (const value of [...values].sort((a, b) => b - a)) {
    assert.equal(model.execute('peek', {}).value, value)
    assert.equal(model.execute('extract-max', {}).value, value)
    PriorityInvariants.binary(model, true)
  }
  assert.equal(model.execute('extract-max', {}).value, null)
})

for (const Model of [BinomialHeap, FibonacciHeap, PairingHeap, LeftistHeap, SkewHeap]) {
  test(`${Model.name}: insertion, meld, extraction, cloning, and clear preserve its own invariants`, () => {
    const model = new Model()
    const values = [40, 20, 70, 10, 50, 90, 30, 60, 80, 100, -4, -4, 0, Number.MAX_SAFE_INTEGER]
    for (const value of values) {
      model.execute('insert', { value })
      PriorityInvariants.check(model)
    }
    model.execute('meld', { values: '5, -100, 5, 17' })
    values.push(5, -100, 5, 17)
    PriorityInvariants.check(model)
    const clone = model.clone()
    const originalScene = structuredClone(PriorityStructureCatalog.createScene(clone))
    for (const value of [...values].sort((a, b) => a - b)) {
      assert.equal(model.execute('peek', {}).value, value)
      assert.equal(model.execute('extract-min', {}).value, value)
      PriorityInvariants.check(model)
    }
    assert.equal(model.execute('extract-min', {}).value, null)
    assert.deepEqual(PriorityStructureCatalog.createScene(clone), originalScene)
    clone.execute('clear', {})
    assert.equal(clone.length, 0)
    clone.execute('insert', { value: 77 })
    assert.equal(clone.execute('peek', {}).value, 77)
    PriorityInvariants.check(clone)
  })
}

test('Fibonacci decrease-key marks a first loss and cascades a second loss into a cut', () => {
  const model = new FibonacciHeap()
  for (let value = 0; value <= 40; value += 1) model.execute('insert', { value })
  model.execute('extract-min', {})
  PriorityInvariants.fibonacci(model)
  const parent = model.getNodes().find((node) => node.parent !== null && node.degree >= 2)
  assert.ok(parent, 'A consolidated forest must provide a non-root with two children')
  const first = parent.child
  const second = first.right
  const clone = model.clone()
  model.execute('decrease-key', { id: first.handle, value: -100 })
  assert.equal(first.parent, null)
  assert.equal(parent.marked, true)
  PriorityInvariants.fibonacci(model)
  model.execute('decrease-key', { id: second.handle, value: -200 })
  assert.equal(parent.parent, null)
  assert.equal(parent.marked, false)
  assert.equal(model.execute('peek', {}).value, -200)
  PriorityInvariants.fibonacci(model)
  PriorityInvariants.fibonacci(clone)
  assert.equal(clone.execute('peek', {}).value, 1)
  const before = structuredClone(PriorityStructureCatalog.createScene(model))
  model.execute('decrease-key', { id: first.handle, value: 999 })
  model.execute('decrease-key', { id: 99999, value: -300 })
  assert.deepEqual(PriorityStructureCatalog.createScene(model), before)
})

test('indexed priorities repair both directions and preserve the inverse position Map after deletion', () => {
  const model = IndexedPriorityQueue.createDefault()
  model.execute('change-priority', { key: 5, priority: -50 })
  PriorityInvariants.binary(model)
  assert.equal(model.execute('peek', {}).value, 5)
  model.execute('change-priority', { key: 5, priority: 500 })
  PriorityInvariants.binary(model)
  assert.equal(model.execute('peek', {}).value, 3)
  const before = model.getEntries()
  model.execute('insert', { key: 5, priority: -1000 })
  model.execute('change-priority', { key: 999, priority: -1000 })
  assert.deepEqual(model.getEntries(), before)
  model.execute('delete-value', { key: 3 })
  model.execute('delete-value', { key: 7 })
  PriorityInvariants.binary(model)
  assert.equal(model.getPositions().has(3), false)
  assert.equal(model.getPositions().has(7), false)
  let lastPriority = -Infinity
  while (model.length) {
    const entry = model.getEntries()[0]
    assert.ok(entry.priority >= lastPriority)
    lastPriority = entry.priority
    assert.equal(model.execute('extract-min', {}).value, entry.key)
    PriorityInvariants.binary(model)
  }
  model.execute('insert', { key: -99, priority: 0 })
  model.execute('clear', {})
  assert.equal(model.getPositions().size, 0)
})

test('monotonic queue matches brute-force window maxima through expiry, ties, wraparound, and clear', () => {
  const model = new MonotonicQueue()
  let window = []
  const stream = [9, 8, 7, 7, 100, -20, 15, 16, 5, 4, 3, 2, 1, 0, -1, -2, -3, -4, -5, -6, 99, 99, 0, 20, 500]
  for (const value of stream) {
    window.push(value)
    window = window.slice(-MonotonicQueue.windowSize)
    const outcome = model.execute('enqueue', { value })
    const candidates = model.getCandidates()
    assert.equal(outcome.value, Math.max(...window))
    assert.equal(model.execute('peek', {}).value, Math.max(...window))
    assert.deepEqual(model.getWindow().map((entry) => entry.value), window)
    assert.equal(model.length, window.length)
    for (let index = 1; index < candidates.length; index += 1) {
      assert.ok(candidates[index - 1].value > candidates[index].value)
      assert.ok(candidates[index - 1].index < candidates[index].index)
    }
    assert.ok(candidates.every((entry) => entry.index >= model.getWindow()[0].index))
  }
  const clone = model.clone()
  const lastIndex = model.getWindow().at(-1).index
  model.execute('clear', {})
  assert.equal(model.execute('peek', {}).value, null)
  model.execute('enqueue', { value: 1 })
  assert.ok(model.getWindow()[0].index > lastIndex)
  assert.equal(clone.execute('peek', {}).value, 500)
})

const fixtures = [
  ['priority-queue', 'PriorityQueue', { enqueue: 'Enqueue', dequeue: 'Dequeue', peek: 'Peek', clear: 'Clear' }],
  ['binary-max-heap', 'BinaryMaxHeap', { insert: 'Insert', 'extract-max': 'ExtractMax', peek: 'Peek', clear: 'Clear' }],
  ['binomial-heap', 'BinomialHeap', { insert: 'Insert', 'extract-min': 'ExtractMin', peek: 'Peek', meld: 'Meld', clear: 'Clear' }],
  ['fibonacci-heap', 'FibonacciHeap', { insert: 'Insert', 'extract-min': 'ExtractMin', 'decrease-key': 'DecreaseKey', peek: 'Peek', meld: 'Meld', clear: 'Clear' }],
  ['pairing-heap', 'PairingHeap', { insert: 'Insert', 'extract-min': 'ExtractMin', peek: 'Peek', meld: 'Meld', clear: 'Clear' }],
  ['leftist-heap', 'LeftistHeap', { insert: 'Insert', 'extract-min': 'ExtractMin', peek: 'Peek', meld: 'Meld', clear: 'Clear' }],
  ['skew-heap', 'SkewHeap', { insert: 'Insert', 'extract-min': 'ExtractMin', peek: 'Peek', meld: 'Meld', clear: 'Clear' }],
  ['indexed-priority-queue', 'IndexedPriorityQueue', { insert: 'Insert', 'change-priority': 'ChangePriority', 'delete-value': 'DeleteByKey', 'extract-min': 'ExtractMin', peek: 'Peek', clear: 'Clear' }],
  ['monotonic-queue', 'MonotonicQueue', { enqueue: 'Push', peek: 'PeekMaximum', clear: 'Clear' }],
]

for (const [kind, folder, actions] of fixtures) {
  test(`${kind}: complete menu/input/information integration and deterministic independent animation scenes`, async () => {
    const model = PriorityStructureCatalog.createDefault(kind)
    assert.equal(model.length, 10)
    assert.equal(StructureCatalog.getGroupForStructure(kind), 'queue-priority')
    assert.equal(MenuNavigation.forStructure(kind).title, ['priority-queue', 'binary-max-heap'].includes(kind) ? 'Queue / Priority' : 'Queues / Heaps')
    assert.deepEqual(ActionCatalog.getScopedActions(kind, 'overview').map((choice) => choice.kind), Object.keys(actions))
    const overview = StructureInformation.get(kind)
    assert.ok(overview.summary && overview.useCases.length >= 4)
    for (const technology of overview.technologies) assert.ok(technology.name && technology.usage && technology.url.startsWith('https://'))
    const source = structuredClone(PriorityStructureCatalog.createScene(model))
    for (const [action, actionFolder] of Object.entries(actions)) {
      const input = { value: -999, priority: -50, key: action === 'insert' ? 99 : 5, id: 1, values: '5, -1, 5' }
      const request = ActionInputRequest.create(kind, action, model.length)
      assert.equal(request !== null, ['insert', 'enqueue', 'decrease-key', 'change-priority', 'delete-value', 'meld'].includes(action))
      if (request) {
        const drafts = {}
        for (const field of request.structured.fields) drafts[field.name] = String(input[field.name])
        assert.deepEqual(request.structured.validate(drafts), {})
        assert.ok(Object.keys(request.structured.validate({})).length)
      }
      const module = await import(`../src/components/${StructurePaths.group(kind)}/${folder}/${actionFolder}/${actionFolder}Animation.ts`)
      const Animation = module[`${actionFolder}Animation`]
      const animation = new Animation(model, input)
      assert.deepEqual(new Animation(model, input).steps, animation.steps)
      assert.deepEqual(PriorityStructureCatalog.createScene(model), source)
      PriorityInvariants.check(animation.result)
      assert.ok(animation.steps.length >= 2 && animation.steps.length <= LinearAnimation.maximumDetailedFrames + 2)
      assert.equal(animation.steps.at(-1).scene.count, animation.result.length)
      if (action === 'peek') {
        assert.match(animation.steps.at(-1).code, /^return /)
        assert.ok(animation.steps.at(-1).scene.focusId)
      }
      for (const step of animation.steps.slice(0, -1)) assert.equal(step.scene.count, model.length)
      for (const step of animation.steps) {
        const ids = new Set(step.scene.nodes.map((node) => node.id))
        assert.equal(ids.size, step.scene.nodes.length)
        assert.equal(step.scene.kind, kind)
        assert.ok(step.description && step.code && step.duration > 0)
        assert.ok(step.scene.focusId === null || ids.has(step.scene.focusId))
        for (const edge of step.scene.edges) assert.ok(ids.has(edge.from) && ids.has(edge.to))
        for (const node of step.scene.nodes) {
          assert.ok(node.x - (node.width ?? 66) / 2 >= 0)
          assert.ok(node.x + (node.width ?? 66) / 2 <= step.scene.width)
          assert.ok(node.y >= 33 && node.y + 33 <= step.scene.height)
        }
        assert.equal(step.scene.width, animation.steps[0].scene.width)
        assert.equal(step.scene.height, animation.steps[0].scene.height)
      }
      const snapshots = structuredClone(animation.steps)
      animation.result.execute('clear', {})
      assert.deepEqual(animation.steps, snapshots)
      const info = Animation.describe(model.length)
      assert.ok(info.time.best && info.time.average && info.time.worst)
      assert.ok(info.memory.best && info.memory.average && info.memory.worst)
    }
  })
}

test('priority input accepts safe integers and donor lists while rejecting malformed data', () => {
  const enqueue = StructuredPriorityInput.create('priority-queue', 'enqueue')
  assert.deepEqual(enqueue.parse({ value: '-10', priority: '0' }), { value: -10, priority: 0 })
  for (const value of ['1.5', '1e3', '9007199254740992', '']) assert.ok(enqueue.validate({ value, priority: '0' }).value)
  const meld = StructuredPriorityInput.create('fibonacci-heap', 'meld')
  assert.deepEqual(meld.parse({ values: ' -10, 0, 5 ' }), { values: ' -10, 0, 5 ' })
  for (const values of ['', '1,,2', '1,', '1.5', 'x', '9007199254740992', Array(17).fill(1).join(',')]) assert.ok(meld.validate({ values }).values)
  const decrease = StructuredPriorityInput.create('fibonacci-heap', 'decrease-key')
  assert.ok(decrease.validate({ id: '0', value: '-10' }).id)
  assert.deepEqual(decrease.parse({ id: '1', value: String(Number.MIN_SAFE_INTEGER) }), { id: 1, value: Number.MIN_SAFE_INTEGER })
})

test('capacity and donor validation reject without partially mutating any heap', () => {
  for (const Model of [PriorityQueue, BinaryMaxHeap, BinomialHeap, FibonacciHeap, PairingHeap, LeftistHeap, SkewHeap, IndexedPriorityQueue]) {
    const model = new Model()
    for (let index = 0; index < 64; index += 1) model.execute(model instanceof PriorityQueue ? 'enqueue' : 'insert', { key: index, value: index, priority: index })
    const source = structuredClone(PriorityStructureCatalog.createScene(model))
    model.execute(model instanceof PriorityQueue ? 'enqueue' : 'insert', { key: 99, value: -1, priority: -1 })
    assert.deepEqual(PriorityStructureCatalog.createScene(model), source)
    if ([BinomialHeap, FibonacciHeap, PairingHeap, LeftistHeap, SkewHeap].includes(Model)) {
      model.execute('meld', { values: '1, 2' })
      assert.deepEqual(PriorityStructureCatalog.createScene(model), source)
      assert.throws(() => model.execute('meld', { values: '1, nope' }), TypeError)
      assert.deepEqual(PriorityStructureCatalog.createScene(model), source)
    }
  }
})
