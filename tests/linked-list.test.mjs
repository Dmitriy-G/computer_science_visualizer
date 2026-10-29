import assert from 'node:assert/strict'
import { test } from 'node:test'
import { LinkedList } from '../src/components/DataStructures/LinkedList/LinkedList.ts'
import { InsertionAnimation } from '../src/components/DataStructures/LinkedList/AddInTheMiddle/InsertionAnimation.ts'
import { StructureCatalog } from '../src/visualization/StructureCatalog.ts'

class ListAssertions {
  static values(list) {
    const values = []
    for (const entry of list.getEntries()) values.push(entry.value)
    return values
  }

  static visibleNodeIds(scene) {
    const ids = []
    for (const node of scene.nodes) {
      if (node.opacity > 0) ids.push(node.id)
    }
    return ids
  }
}

test('default list has ten nodes in traversal order', () => {
  const list = LinkedList.createDefault()
  assert.equal(list.length, 10)
  assert.deepEqual(
    ListAssertions.values(list),
    [10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
  )
})

test('insertion handles an empty list, head, tail, middle, and duplicate values', () => {
  const list = new LinkedList()
  list.insertAt(0, 20)
  list.insertAt(0, 10)
  list.insertAt(2, 30)
  list.insertAt(1, 20)
  assert.deepEqual(ListAssertions.values(list), [10, 20, 20, 30])
  assert.equal(list.length, 4)
  const ids = new Set()
  for (const entry of list.getEntries()) ids.add(entry.id)
  assert.equal(ids.size, 4)
})

test('invalid input cannot change the list', () => {
  const list = LinkedList.createDefault()
  const before = list.getEntries()
  for (const index of [-1, 11, 0.5, NaN]) {
    assert.throws(() => list.insertAt(index, 99), RangeError)
  }
  for (const value of [NaN, Infinity, 0.5, Number.MAX_SAFE_INTEGER + 1]) {
    assert.throws(() => list.insertAt(5, value), TypeError)
  }
  assert.deepEqual(list.getEntries(), before)
})

test('cloning preserves IDs without sharing mutable next pointers', () => {
  const original = LinkedList.createDefault()
  const copy = original.clone()
  assert.deepEqual(copy.getEntries(), original.getEntries())
  copy.insertAt(5, 99)
  assert.equal(original.length, 10)
  assert.equal(copy.length, 11)
  assert.deepEqual(
    ListAssertions.values(original),
    [10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
  )
})

test('middle insertion visits each predecessor node and covers all seven phases', () => {
  const list = LinkedList.createDefault()
  const animation = new InsertionAnimation(list, 99)
  const entries = list.getEntries()
  assert.equal(animation.insertionIndex, 5)
  assert.equal(list.length, 10)
  assert.equal(animation.result.length, 11)
  assert.deepEqual(
    ListAssertions.values(animation.result),
    [10, 20, 30, 40, 50, 99, 60, 70, 80, 90, 100],
  )
  for (let index = 0; index < 5; index += 1) {
    assert.equal(animation.steps[index].scene.focusId, entries[index].id)
  }
  const phases = new Set()
  for (const step of animation.steps) phases.add(step.phase)
  assert.deepEqual([...phases], [1, 2, 3, 4, 5, 6, 7])
})

test('visual sequence creates, unlinks, opens space, lowers, and reconnects in order', () => {
  const animation = new InsertionAnimation(LinkedList.createDefault(), 99)
  const steps = animation.steps
  const newId = animation.result.getEntries()[5].id
  const appeared = steps[6].scene
  const detached = steps[7].scene
  const opened = steps[8].scene
  const lowered = steps[9].scene
  const firstConnection = steps[10].scene
  const final = steps.at(-1).scene

  const getNode = (scene, id) => scene.nodes.find((node) => node.id === id)
  assert.equal(ListAssertions.visibleNodeIds(steps[0].scene).length, 10)
  assert.equal(ListAssertions.visibleNodeIds(appeared).length, 11)
  assert.ok(getNode(appeared, newId).y < getNode(appeared, 'linked-node-4').y)
  assert.equal(
    detached.edges.find((edge) => edge.id === 'linked-node-4-linked-node-5')
      .opacity,
    0,
  )
  assert.ok(
    getNode(opened, 'linked-node-5').x > getNode(detached, 'linked-node-5').x,
  )
  assert.equal(getNode(lowered, newId).y, getNode(lowered, 'linked-node-4').y)
  assert.equal(
    firstConnection.edges.find((edge) => edge.id === `${newId}-next`).opacity,
    1,
  )
  assert.equal(
    firstConnection.edges.find((edge) => edge.id === `${newId}-previous`)
      .opacity,
    0,
  )
  assert.equal(final.count, 11)

  // Every model node must have precisely the expected successor in the final drawing.
  const expected = animation.result.getEntries()
  const visibleEdges = final.edges.filter((edge) => edge.opacity > 0)
  assert.equal(visibleEdges.length, 10)
  for (let index = 0; index < expected.length - 1; index += 1) {
    assert.ok(
      visibleEdges.some(
        (edge) =>
          edge.from === expected[index].id &&
          edge.to === expected[index + 1].id,
      ),
    )
  }
})

test('odd-length lists use floor(length / 2), and short-list input is explicit', () => {
  const list = LinkedList.createDefault()
  list.insertAt(list.length, 110)
  const animation = new InsertionAnimation(list, 0)
  assert.equal(animation.insertionIndex, 5)
  assert.equal(animation.result.getEntries()[5].value, 0)
  assert.throws(() => new InsertionAnimation(new LinkedList(), 99), RangeError)
})

test('middle insertion metadata accounts for traversal in every case', () => {
  const information = InsertionAnimation.describe(10)
  for (const scenario of ['best', 'average', 'worst']) {
    assert.equal(information.time[scenario], 'O(n)')
    assert.equal(information.memory[scenario], 'O(1)')
  }
  assert.match(information.time.explanation, /always visits about half/)
  assert.match(information.terms[0].meaning, /n = 10/)
})

test('every structure preview has ten elements and valid edge endpoints', () => {
  for (const structure of StructureCatalog.structures) {
    const scene = StructureCatalog.createPreview(
      structure.kind,
      LinkedList.createDefault(),
    )
    assert.equal(scene.count, 10)
    assert.equal(scene.nodes.length, 10)
    const ids = new Set(ListAssertions.visibleNodeIds(scene))
    for (const edge of scene.edges) {
      assert.ok(ids.has(edge.from))
      assert.ok(ids.has(edge.to))
    }
  }
})
