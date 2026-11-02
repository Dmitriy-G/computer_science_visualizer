import assert from 'node:assert/strict'
import { test } from 'node:test'
import { SkipList } from '../src/components/DataStructuresOverview/Linear/SkipList/SkipList.ts'
import { UnrolledLinkedList } from '../src/components/DataStructuresOverview/Linear/UnrolledLinkedList/UnrolledLinkedList.ts'
import { XORLinkedList } from '../src/components/DataStructuresOverview/Linear/XORLinkedList/XORLinkedList.ts'
import { GapBuffer } from '../src/components/DataStructuresOverview/Linear/GapBuffer/GapBuffer.ts'
import { Rope } from '../src/components/DataStructuresOverview/Trees/Rope/Rope.ts'
import { BitSet } from '../src/components/DataStructuresOverview/Linear/BitSet/BitSet.ts'
import { SparseArray } from '../src/components/DataStructuresOverview/Linear/SparseArray/SparseArray.ts'
import { FreeList } from '../src/components/DataStructuresOverview/Linear/FreeList/FreeList.ts'
import { LinearStructureCatalog } from '../src/visualization/LinearStructureCatalog.ts'
import { LinearAnimation } from '../src/visualization/LinearAnimation.ts'
import { ActionCatalog } from '../src/visualization/ActionCatalog.ts'
import { ActionInputRequest } from '../src/visualization/ActionInputRequest.ts'
import { StructureCatalog } from '../src/visualization/StructureCatalog.ts'
import { StructureInformation } from '../src/components/StructureInfo/StructureInformation.ts'
import { StructuredLinearInput } from '../src/visualization/StructuredLinearInput.ts'

class LinearInvariants {
  static skip(model) {
    const nodes = model.getNodes()
    assert.equal(nodes.length, model.length + 1)
    const keys = nodes.slice(1).map((node) => node.value)
    assert.deepEqual(keys, [...new Set(keys)].sort((a, b) => a - b))
    for (let level = 0; level < SkipList.maximumLevel; level += 1) {
      const expected = nodes.slice(1).filter((node) => node.next.length > level)
      const actual = []
      for (let node = nodes[0].next[level]; node; node = node.next[level]) {
        assert.ok(!actual.includes(node), 'No level may contain a cycle')
        actual.push(node)
      }
      assert.deepEqual(actual, expected)
    }
  }

  static gap(model, text) {
    assert.equal(model.getText(), text)
    assert.equal(model.length, text.length)
    assert.ok(model.gapEnd > model.gapStart)
    const ids = []
    for (const [index, slot] of model.getSlots().entries()) {
      assert.equal(slot === null, index >= model.gapStart && index < model.gapEnd)
      if (slot) ids.push(slot.id)
    }
    assert.equal(new Set(ids).size, ids.length)
  }

  static rope(model, text) {
    const ids = new Set()
    const inspect = (node) => {
      if (!node) return { text: '', height: 0 }
      assert.ok(!ids.has(node.id))
      ids.add(node.id)
      if (!node.left) {
        assert.equal(node.right, null)
        assert.ok(node.text.length > 0 && node.text.length <= Rope.chunkSize)
        assert.equal(node.length, node.text.length)
        assert.equal(node.weight, node.length)
        assert.equal(node.height, 1)
        return { text: node.text, height: 1 }
      }
      const left = inspect(node.left)
      const right = inspect(node.right)
      assert.equal(node.weight, left.text.length)
      assert.equal(node.length, left.text.length + right.text.length)
      assert.ok(Math.abs(left.height - right.height) <= 1, 'Every rope branch must satisfy AVL balance')
      assert.equal(node.height, 1 + Math.max(left.height, right.height))
      return { text: left.text + right.text, height: node.height }
    }
    assert.equal(inspect(model.getRoot()).text, text)
    assert.equal(model.getText(), text)
    assert.equal(model.length, text.length)
  }

  static pool(model) {
    const slots = model.getSlots()
    const seen = new Set()
    for (let index = model.freeHead; index !== null; index = slots[index].next) {
      assert.ok(!seen.has(index), 'The free chain must not cycle')
      seen.add(index)
      assert.equal(slots[index].value, null)
    }
    assert.equal(seen.size + model.length, FreeList.capacity)
    for (const slot of slots) {
      assert.equal(seen.has(slot.id), slot.value === null)
      if (slot.value !== null) assert.equal(slot.next, null)
    }
  }
}

test('skip-list towers stay sorted through insert, duplicate rejection, deletion, clone, and clear', () => {
  const model = new SkipList()
  for (const value of [40, 10, 100, 60, 20, 30, Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER]) {
    model.execute('insert', { value })
    LinearInvariants.skip(model)
  }
  const before = structuredClone(LinearStructureCatalog.createScene(model))
  model.execute('insert', { value: 40 })
  assert.deepEqual(LinearStructureCatalog.createScene(model), before)
  assert.equal(model.execute('search-value', { value: 60 }).value, true)
  assert.equal(model.execute('search-value', { value: 61 }).value, false)
  const clone = model.clone()
  for (const value of [Number.MIN_SAFE_INTEGER, 40, Number.MAX_SAFE_INTEGER, 999, 10, 20, 30, 60, 100]) {
    clone.execute('delete-value', { value })
    LinearInvariants.skip(clone)
  }
  assert.equal(clone.length, 0)
  assert.deepEqual(LinearStructureCatalog.createScene(model), before)
  model.execute('clear', {})
  model.execute('insert', { value: -5 })
  LinearInvariants.skip(model)
  const first = SkipList.createDefault()
  const second = SkipList.createDefault()
  assert.deepEqual(LinearStructureCatalog.createScene(first), LinearStructureCatalog.createScene(second))
})

test('unrolled blocks split, preserve logical order, and never exceed capacity', () => {
  const model = new UnrolledLinkedList()
  const expected = []
  for (let value = 0; value < 40; value += 1) {
    const index = value % 3 === 0 ? 0 : Math.floor(expected.length / 2)
    expected.splice(index, 0, value)
    model.execute('insert', { index, value })
    assert.deepEqual(model.getValues(), expected)
    assert.ok(model.getBlocks().every((block) => block.values.length >= 1 && block.values.length <= 4))
  }
  const clone = model.clone()
  for (const value of expected.slice()) {
    const index = expected.indexOf(value)
    assert.equal(model.execute('search-value', { value }).value, index)
    model.execute('delete-value', { value })
    expected.splice(index, 1)
    assert.deepEqual(model.getValues(), expected)
    assert.equal(model.length, expected.length)
    assert.ok(model.getBlocks().every((block) => block.values.length >= 1 && block.values.length <= 4))
  }
  assert.equal(clone.length, 40)
  model.execute('insert', { index: 0, value: 7 })
  model.execute('insert', { index: 1, value: 7 })
  model.execute('delete-value', { value: 7 })
  assert.deepEqual(model.getValues(), [7])
  model.execute('clear', {})
  assert.deepEqual(model.getBlocks(), [])
})

test('XOR links decode in both directions after endpoint, middle, duplicate, and singleton deletion', () => {
  const model = new XORLinkedList()
  const expected = [10, 20, 20, 30, 40]
  for (const value of expected) model.execute('insert-end', { value })
  const clone = model.clone()
  for (const value of [10, 40, 20, 999, 30, 20]) {
    const index = expected.indexOf(value)
    model.execute('delete-value', { value })
    if (index !== -1) expected.splice(index, 1)
    assert.deepEqual(model.getNodes().map((node) => node.value), expected)
    assert.deepEqual(model.getNodes(true).map((node) => node.value), [...expected].reverse())
    assert.equal(model.length, expected.length)
  }
  assert.equal(clone.length, 5)
  model.execute('insert-end', { value: Number.MIN_SAFE_INTEGER })
  assert.equal(model.execute('search-value', { value: Number.MIN_SAFE_INTEGER }).value, 0)
  model.execute('clear', {})
  assert.deepEqual(model.getNodes(true), [])
})

test('gap buffer moves across text, grows, searches across the gap, and deletes spans', () => {
  const model = GapBuffer.createDefault()
  LinearInvariants.gap(model, 'structures')
  const ids = model.getSlots().filter(Boolean).map((slot) => slot.id)
  for (const index of [0, model.length, 3, 7, 0, 5]) {
    model.execute('move-gap', { index })
    LinearInvariants.gap(model, 'structures')
    assert.deepEqual(model.getSlots().filter(Boolean).map((slot) => slot.id), ids)
  }
  assert.equal(model.execute('search-value', { text: 'uctur' }).value, 3)
  const clone = model.clone()
  model.execute('insert', { index: 3, text: ' HELLO ' })
  LinearInvariants.gap(model, 'str HELLO uctures')
  assert.equal(clone.getText(), 'structures')
  model.execute('delete-index', { index: 3, count: 7 })
  LinearInvariants.gap(model, 'structures')
  assert.throws(() => model.execute('delete-index', { index: 9, count: 2 }), RangeError)
  LinearInvariants.gap(model, 'structures')
  model.execute('clear', {})
  LinearInvariants.gap(model, '')
  model.execute('insert', { index: 0, text: ' ' })
  LinearInvariants.gap(model, ' ')
})

test('rope split/join edits preserve weights, AVL balance, text, and old versions', () => {
  const model = Rope.createDefault()
  const original = model.clone()
  const originalRoot = structuredClone(original.getRoot())
  let text = 'structures'
  for (let iteration = 0; iteration < 100; iteration += 1) {
    const index = iteration * 7 % (text.length + 1)
    const inserted = String.fromCharCode(65 + iteration % 26) + ' '
    model.execute('insert', { index, text: inserted })
    text = text.slice(0, index) + inserted + text.slice(index)
    LinearInvariants.rope(model, text)
    if (iteration % 2 === 0) {
      const start = iteration * 3 % text.length
      const count = Math.min(3, text.length - start)
      model.execute('delete-index', { index: start, count })
      text = text.slice(0, start) + text.slice(start + count)
      LinearInvariants.rope(model, text)
    }
    const lookup = iteration % text.length
    assert.equal(model.execute('search-index', { index: lookup }).value, text[lookup])
  }
  assert.equal(original.getText(), 'structures')
  assert.deepEqual(original.getRoot(), originalRoot)
  model.execute('concatenate', { text: 'END' })
  text += 'END'
  LinearInvariants.rope(model, text)
  model.execute('delete-index', { index: 0, count: text.length })
  LinearInvariants.rope(model, '')
  model.execute('concatenate', { text: 'new' })
  LinearInvariants.rope(model, 'new')
  model.execute('clear', {})
  LinearInvariants.rope(model, '')
})

test('bitset packs unsigned masks across word boundaries and preserves size after clear', () => {
  const model = new BitSet(65)
  for (const index of [0, 31, 32, 63, 64]) model.execute('set-bit', { index })
  assert.deepEqual(model.getWords(), [0x80000001, 0x80000001, 1])
  for (let index = 0; index < model.length; index += 1) assert.equal(model.test(index), [0, 31, 32, 63, 64].includes(index))
  const clone = model.clone()
  model.execute('toggle-bit', { index: 31 })
  model.execute('clear-bit', { index: 64 })
  assert.equal(model.test(31), false)
  assert.equal(clone.test(31), true)
  model.execute('clear', {})
  assert.equal(model.length, 65)
  assert.deepEqual(model.getWords(), [0, 0, 0])
  assert.throws(() => model.test(65), RangeError)
  assert.throws(() => model.execute('set-bit', { index: -1 }), RangeError)
  assert.equal(new BitSet(0).execute('clear', {}).description.includes('0 bits'), true)
})

test('sparse holes, explicit zero, distant indices, clone, and clear preserve logical length', () => {
  const model = new SparseArray(1000000)
  assert.equal(model.execute('search-index', { index: 999999 }).value, 0)
  model.execute('update-index', { index: 999999, value: -10 })
  model.execute('update-index', { index: 4, value: 0 })
  assert.equal(model.storedCount, 2)
  assert.equal(model.execute('search-index', { index: 4 }).status, 'STORED')
  const clone = model.clone()
  model.execute('delete-index', { index: 4 })
  assert.equal(model.execute('search-index', { index: 4 }).status, 'IMPLICIT ZERO')
  assert.equal(model.execute('search-index', { index: 999999 }).value, -10)
  model.execute('clear', {})
  assert.equal(model.length, 1000000)
  assert.equal(model.storedCount, 0)
  assert.equal(clone.storedCount, 2)
})

test('free-list allocation rejects exhaustion and double release, then reuses released slots', () => {
  const model = new FreeList()
  for (let index = 0; index < FreeList.capacity; index += 1) {
    assert.equal(model.execute('allocate', { value: index }).value, index)
    LinearInvariants.pool(model)
  }
  const full = structuredClone(model.getSlots())
  assert.equal(model.execute('allocate', { value: 99 }).value, null)
  assert.deepEqual(model.getSlots(), full)
  const clone = model.clone()
  assert.equal(model.execute('release', { index: 0 }).value, true)
  assert.equal(model.execute('release', { index: 0 }).value, false)
  LinearInvariants.pool(model)
  assert.equal(model.execute('allocate', { value: 0 }).value, 0)
  assert.equal(clone.length, 10)
  model.execute('clear', {})
  LinearInvariants.pool(model)
  assert.equal(model.length, 0)
  assert.throws(() => model.execute('release', { index: 10 }), RangeError)
})

const features = [
  ['skip-list', 'SkipList', { insert: 'Insert', 'search-value': 'SearchByValue', 'delete-value': 'DeleteByValue', clear: 'Clear' }, { value: 55 }],
  ['unrolled-linked-list', 'UnrolledLinkedList', { insert: 'Insert', 'search-value': 'SearchByValue', 'delete-value': 'DeleteByValue', clear: 'Clear' }, { index: 4, value: 55 }],
  ['xor-linked-list', 'XORLinkedList', { 'insert-end': 'Append', 'search-value': 'SearchByValue', 'delete-value': 'DeleteByValue', clear: 'Clear' }, { value: 55 }],
  ['gap-buffer', 'GapBuffer', { insert: 'Insert', 'move-gap': 'MoveGap', 'delete-index': 'Delete', 'search-value': 'Search', clear: 'Clear' }, { index: 4, count: 2, text: 'test' }],
  ['rope', 'Rope', { insert: 'Insert', concatenate: 'Concatenate', 'search-index': 'SearchByIndex', 'delete-index': 'Delete', clear: 'Clear' }, { index: 4, count: 2, text: 'test' }],
  ['bit-set', 'BitSet', { 'set-bit': 'SetBit', 'clear-bit': 'ClearBit', 'toggle-bit': 'ToggleBit', 'search-index': 'TestBit', clear: 'Clear' }, { index: 4 }],
  ['sparse-array', 'SparseArray', { 'update-index': 'Set', 'search-index': 'Read', 'delete-index': 'Delete', clear: 'Clear' }, { index: 4, value: 55 }],
  ['free-list', 'FreeList', { allocate: 'Allocate', release: 'Release', clear: 'Clear' }, { index: 1, value: 55 }],
]

for (const [kind, folder, actions, input] of features) {
  test(`${kind}: menu, input, info, immutable sequences, and scene integrity`, async () => {
    const model = LinearStructureCatalog.createDefault(kind)
    const sourceScene = structuredClone(LinearStructureCatalog.createScene(model))
    assert.equal(StructureCatalog.getGroupForStructure(kind), kind === 'rope' ? 'trees' : 'linear')
    assert.deepEqual(ActionCatalog.getScopedActions(kind, 'overview').map((choice) => choice.kind), Object.keys(actions))
    assert.ok(StructureInformation.get(kind).useCases.length >= 4)
    for (const [action, actionFolder] of Object.entries(actions)) {
      const request = ActionInputRequest.create(kind, action, model.length)
      assert.equal(request !== null, action !== 'clear')
      if (request) {
        const drafts = {}
        for (const field of request.structured.fields) drafts[field.name] = String(input[field.name])
        assert.deepEqual(request.structured.validate(drafts), {})
        assert.ok(Object.keys(request.structured.validate({})).length > 0)
      }
      const group = kind === 'rope' ? 'Trees' : 'Linear'
      const module = await import(`../src/components/DataStructuresOverview/${group}/${folder}/${actionFolder}/${actionFolder}Animation.ts`)
      const Sequence = module[`${actionFolder}Animation`]
      const animation = new Sequence(model, input)
      const replay = new Sequence(model, input)
      assert.deepEqual(animation.steps, replay.steps)
      assert.deepEqual(LinearStructureCatalog.createScene(model), sourceScene)
      assert.ok(animation.steps.length >= 2 && animation.steps.length <= LinearAnimation.maximumDetailedFrames + 2)
      assert.equal(animation.steps.at(-1).scene.count, animation.result.length)
      for (const step of animation.steps.slice(0, -1)) assert.equal(step.scene.count, model.length)
      for (const step of animation.steps) {
        assert.equal(step.scene.kind, kind)
        assert.ok(step.title && step.description && step.code && step.duration > 0)
        const ids = new Set(step.scene.nodes.map((node) => node.id))
        assert.equal(ids.size, step.scene.nodes.length)
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
      const snapshot = structuredClone(animation.steps)
      animation.result.execute('clear', {})
      assert.deepEqual(animation.steps, snapshot, 'Scenes must not reference mutable model storage')
      const information = Sequence.describe(model.length)
      assert.ok(information.time.best && information.time.average && information.time.worst)
      assert.ok(information.memory.best && information.memory.average && information.memory.worst)
    }
  })
}

test('structured linear input validates text, index boundaries, deletion spans, and empty states', () => {
  for (const kind of ['gap-buffer', 'rope']) {
    const insert = StructuredLinearInput.create(kind, 'insert', 10)
    assert.deepEqual(insert.parse({ index: '10', text: ' a ' }), { index: 10, text: ' a ' })
    assert.ok(insert.validate({ index: '11', text: 'x' }).index)
    assert.ok(insert.validate({ index: '0', text: 'é' }).text)
    assert.ok(insert.validate({ index: '0', text: 'x'.repeat(33) }).text)
    const remove = StructuredLinearInput.create(kind, 'delete-index', 10)
    assert.ok(remove.validate({ index: '9', count: '2' }).count)
    assert.deepEqual(remove.validate({ index: '9', count: '1' }), {})
    assert.equal(StructuredLinearInput.create(kind, 'delete-index', 0).available, false)
    assert.equal(StructuredLinearInput.create(kind, 'insert', 0).available, true)
  }
  assert.equal(StructuredLinearInput.create('gap-buffer', 'move-gap', 0).available, true)
  const release = StructuredLinearInput.create('free-list', 'release', 0)
  assert.deepEqual(release.parse({ index: '9' }), { index: 9 })
  assert.ok(release.validate({ index: '10' }).index)
  assert.equal(StructuredLinearInput.create('bit-set', 'search-index', 0).available, false)
  const numeric = StructuredLinearInput.create('skip-list', 'insert', 10)
  for (const value of ['1.5', '9007199254740992', '', '-']) assert.ok(numeric.validate({ value }).value)
})

test('teaching limits reject additions without partial mutation', () => {
  for (const [Model, action] of [[SkipList, 'insert'], [UnrolledLinkedList, 'insert'], [XORLinkedList, 'insert-end']]) {
    const model = new Model()
    for (let index = 0; index < 64; index += 1) model.execute(action, { index, value: index })
    const before = LinearStructureCatalog.createScene(model)
    model.execute(action, { index: 64, value: 64 })
    assert.deepEqual(LinearStructureCatalog.createScene(model), before)
  }
  for (const Model of [GapBuffer, Rope]) {
    const model = new Model()
    for (let count = 0; count < 8; count += 1) model.execute('insert', { index: model.length, text: 'x'.repeat(32) })
    assert.equal(model.length, 256)
    model.execute('insert', { index: 0, text: 'rejected' })
    assert.equal(model.getText(), 'x'.repeat(256))
  }
})

test('trace limits bound snapshots while still completing every mutation', async () => {
  const model = new GapBuffer()
  for (let count = 0; count < 8; count += 1) model.execute('insert', { index: model.length, text: 'x'.repeat(32) })
  const { ClearAnimation } = await import('../src/components/DataStructuresOverview/Linear/GapBuffer/Clear/ClearAnimation.ts')
  const animation = new ClearAnimation(model)
  assert.equal(animation.result.getText(), '')
  assert.equal(model.length, 256)
  assert.equal(animation.steps.length, LinearAnimation.maximumDetailedFrames + 2)
  assert.match(animation.steps.at(-1).description, /executed but omitted/)
  assert.equal(animation.steps.at(-1).scene.count, 0)
})

test('empty models clear safely and accept the appropriate first insertion', () => {
  for (const Model of [SkipList, UnrolledLinkedList, XORLinkedList, GapBuffer, Rope, BitSet, SparseArray, FreeList]) {
    const model = new Model()
    model.execute('clear', {})
    assert.ok(LinearStructureCatalog.createScene(model))
  }
  const rope = new Rope()
  assert.throws(() => rope.execute('search-index', { index: 0 }), RangeError)
  rope.execute('insert', { index: 0, text: 'ok' })
  LinearInvariants.rope(rope, 'ok')
})
