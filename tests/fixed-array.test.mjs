import assert from 'node:assert/strict'
import { test } from 'node:test'
import { FixedArray } from '../src/components/FundamentalDataStructures/Linear/Array/FixedArray.ts'
import { InsertionAnimation } from '../src/components/FundamentalDataStructures/Linear/Array/AddInTheMiddle/InsertionAnimation.ts'
import { StructureCatalog } from '../src/visualization/StructureCatalog.ts'
import { LinkedList } from '../src/components/FundamentalDataStructures/Linear/LinkedList/LinkedList.ts'

class ArrayAssertions {
  static values(array) {
    const values = []
    for (const entry of array.getEntries()) values.push(entry.value)
    return values
  }

  static node(scene, id) {
    const node = scene.nodes.find((item) => item.id === id)
    assert.ok(node, `Node ${id} exists`)
    return node
  }

  static checkFinal(animation) {
    const scene = animation.steps.at(-1).scene
    const entries = animation.result.getEntries()
    assert.equal(scene.count, entries.length)
    assert.equal(scene.edges.length, 0)
    for (let index = 0; index < entries.length; index += 1) {
      const node = this.node(scene, entries[index].id)
      assert.equal(node.value, entries[index].value)
      assert.equal(node.x, 80 + index * 92)
      assert.equal(node.y, 278)
      assert.equal(node.opacity, 1)
    }
    assert.equal(
      scene.nodes.filter((node) => node.opacity > 0).length,
      entries.length,
    )
    assert.equal(
      scene.slots.filter((slot) => slot.opacity > 0).length,
      entries.length,
    )
    assert.ok(
      scene.slots
        .filter((slot) => slot.opacity > 0)
        .every((slot) => !slot.empty),
    )
  }
}

test('fixed array preview has exactly ten occupied slots and no spare capacity', () => {
  const array = FixedArray.createDefault()
  assert.equal(array.length, 10)
  assert.deepEqual(
    ArrayAssertions.values(array),
    [10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
  )
  const scene = StructureCatalog.createPreview(
    'array',
    LinkedList.createDefault(),
    array,
  )
  assert.equal(scene.nodes.length, 10)
  assert.equal(scene.slots.length, 10)
  assert.ok(scene.slots.every((slot) => !slot.empty))
})

test('insertion allocates an exact-sized result and never changes the original fixed array', () => {
  const original = new FixedArray([10, 20, 30])
  const before = original.getEntries()
  for (const [index, expected] of [
    [0, [99, 10, 20, 30]],
    [1, [10, 99, 20, 30]],
    [3, [10, 20, 30, 99]],
  ]) {
    const result = original.withInsertedAt(index, 99)
    assert.notEqual(result, original)
    assert.equal(result.length, 4)
    assert.deepEqual(ArrayAssertions.values(result), expected)
    assert.equal(original.length, 3)
    assert.deepEqual(original.getEntries(), before)
  }
})

test('clones and snapshots are independent, and repeated results retain unique stable IDs', () => {
  const original = new FixedArray([5, 5])
  const clone = original.clone()
  assert.deepEqual(clone.getEntries(), original.getEntries())
  const first = clone.withInsertedAt(1, 5)
  const second = first.withInsertedAt(1, 5)
  assert.equal(original.length, 2)
  assert.equal(first.length, 3)
  assert.equal(second.length, 4)
  const originalIds = original.getEntries().map((entry) => entry.id)
  assert.deepEqual(
    first
      .getEntries()
      .filter((entry) => originalIds.includes(entry.id))
      .map((entry) => entry.id),
    originalIds,
  )
  assert.equal(new Set(second.getEntries().map((entry) => entry.id)).size, 4)
  const entries = original.getEntries()
  entries[0].value = 999
  assert.deepEqual(ArrayAssertions.values(original), [5, 5])
})

test('invalid fixed-array input is rejected without changing the source or consuming IDs', () => {
  for (const value of [NaN, Infinity, 0.5, Number.MAX_SAFE_INTEGER + 1]) {
    assert.throws(() => new FixedArray([value]), TypeError)
  }
  const array = new FixedArray([10])
  const before = array.getEntries()
  for (const index of [-1, 2, NaN, 0.5])
    assert.throws(() => array.withInsertedAt(index, 0), RangeError)
  for (const value of [NaN, Infinity, 0.5])
    assert.throws(() => array.withInsertedAt(0, value), TypeError)
  assert.deepEqual(array.getEntries(), before)
  assert.equal(
    array.withInsertedAt(1, 20).getEntries()[1].id,
    'array-element-1',
  )
})

test('animation allocates a separate exact-sized array before copying anything', () => {
  const original = FixedArray.createDefault()
  const animation = new InsertionAnimation(original, 99)
  const initial = animation.steps[0].scene
  assert.equal(initial.slots.filter((slot) => slot.opacity > 0).length, 10)
  const allocated = animation.steps[1].scene
  const sourceSlots = allocated.slots.filter((slot) =>
    slot.id.startsWith('source-slot-'),
  )
  const targetSlots = allocated.slots.filter((slot) =>
    slot.id.startsWith('result-slot-'),
  )
  assert.equal(sourceSlots.length, 10)
  assert.equal(targetSlots.length, 11)
  assert.ok(sourceSlots.every((slot) => slot.y === 150 && !slot.empty))
  assert.ok(
    targetSlots.every(
      (slot) => slot.y === 420 && slot.empty && slot.opacity === 1,
    ),
  )
  assert.match(animation.steps[1].code, /new Array\(11\)/)
  assert.equal(allocated.count, 10)
})

test('every original slot and value remains fixed throughout prefix and suffix copying', () => {
  const array = FixedArray.createDefault()
  const before = array.getEntries()
  const animation = new InsertionAnimation(array, 99)
  for (const step of animation.steps.slice(1, -1)) {
    for (let index = 0; index < before.length; index += 1) {
      const source = ArrayAssertions.node(
        step.scene,
        `source-${before[index].id}`,
      )
      assert.equal(source.value, before[index].value)
      assert.equal(source.x, 80 + index * 92)
      assert.equal(source.y, 150)
      assert.equal(source.opacity, 1)
    }
    assert.ok(step.scene.nodes.every((node) => node.status !== 'SHIFTED'))
  }
  assert.deepEqual(array.getEntries(), before)
  assert.equal(array.length, 10)
})

test('prefix copies to the same indices, insertion happens next, and suffix copies one index farther right', () => {
  const array = FixedArray.createDefault()
  const entries = array.getEntries()
  const animation = new InsertionAnimation(array, 99)
  const copySteps = animation.steps.filter(
    (step) =>
      step.code.startsWith('result[') && step.code.includes('original['),
  )
  assert.equal(copySteps.length, 10)
  for (let index = 0; index < entries.length; index += 1) {
    const step = copySteps[index]
    const target = index < 5 ? index : index + 1
    assert.equal(step.code, `result[${target}] = original[${index}]`)
    const copy = ArrayAssertions.node(step.scene, entries[index].id)
    const source = ArrayAssertions.node(
      step.scene,
      `source-${entries[index].id}`,
    )
    assert.equal(copy.x, 80 + target * 92)
    assert.equal(copy.y, 420)
    assert.equal(copy.opacity, 1)
    assert.equal(source.opacity, 1)
    assert.notEqual(source.y, copy.y)
  }
  const inserted = animation.steps.find(
    (step) => step.code === 'result[5] = 99',
  )
  assert.ok(
    animation.steps.indexOf(copySteps[4]) < animation.steps.indexOf(inserted),
  )
  assert.ok(
    animation.steps.indexOf(inserted) < animation.steps.indexOf(copySteps[5]),
  )
  assert.equal(inserted.scene.count, 10)
  assert.deepEqual(
    ArrayAssertions.values(animation.result),
    [10, 20, 30, 40, 50, 99, 60, 70, 80, 90, 100],
  )
  ArrayAssertions.checkFinal(animation)
})

test('empty, singleton, even, and odd fixed arrays produce ordered results of exact length + 1', () => {
  for (const size of [0, 1, 2, 9, 10, 11]) {
    const values = Array.from({ length: size }, (_, index) => index)
    const array = new FixedArray(values)
    const expected = values.slice()
    expected.splice(Math.floor(size / 2), 0, -99)
    const animation = new InsertionAnimation(array, -99)
    assert.deepEqual(ArrayAssertions.values(array), values)
    assert.deepEqual(ArrayAssertions.values(animation.result), expected)
    assert.equal(array.length, size)
    assert.equal(animation.result.length, size + 1)
    ArrayAssertions.checkFinal(animation)
  }
})

test('replay is deterministic and prior scenes and source models cannot be changed by later insertions', () => {
  const original = FixedArray.createDefault()
  const first = new InsertionAnimation(original, 99)
  const saved = JSON.stringify(first.steps)
  const replay = new InsertionAnimation(original, 99)
  assert.deepEqual(replay.steps, first.steps)
  const another = new InsertionAnimation(first.result, 0)
  assert.equal(another.result.length, 12)
  assert.equal(first.result.length, 11)
  assert.equal(original.length, 10)
  assert.equal(JSON.stringify(first.steps), saved)
})

test('fixed-array metadata always describes linear copying and linear extra memory using only relevant terms', () => {
  const information = InsertionAnimation.describe(10)
  for (const scenario of ['best', 'average', 'worst']) {
    assert.equal(information.time[scenario], 'O(n)')
    assert.equal(information.memory[scenario], 'O(n)')
  }
  assert.deepEqual(
    information.terms.map((term) => term.symbol),
    ['n', 'O(n)'],
  )
  assert.match(information.memory.explanation, /n \+ 1/)
  assert.match(information.terms[0].meaning, /n = 10/)
  assert.doesNotMatch(JSON.stringify(information), /spare|capacity|O\(1\)/)
})
