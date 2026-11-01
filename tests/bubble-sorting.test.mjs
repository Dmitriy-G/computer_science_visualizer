import assert from 'node:assert/strict'
import { test } from 'node:test'
import { FixedArray } from '../src/components/DataStructures/Linear/Array/FixedArray.ts'
import { BubbleSortingAnimation } from '../src/components/DataStructures/Linear/Array/BubbleSorting/BubbleSortingAnimation.ts'
import { ActionInputRequest } from '../src/visualization/ActionInputRequest.ts'

test('bubble sort handles boundaries, reverse order, duplicates, and safe integer extremes without resizing', () => {
  const cases = [
    [[], []],
    [[7], [7]],
    [[1, 2, 3], [1, 2, 3]],
    [[5, 4, 3, 2, 1], [1, 2, 3, 4, 5]],
    [[3, -2, 3, 0, -2], [-2, -2, 0, 3, 3]],
    [[Number.MAX_SAFE_INTEGER, 0, Number.MIN_SAFE_INTEGER], [Number.MIN_SAFE_INTEGER, 0, Number.MAX_SAFE_INTEGER]],
  ]
  for (const [values, expected] of cases) {
    const model = new FixedArray(values)
    const before = model.getEntries()
    const clone = model.clone()
    clone.bubbleSort()
    assert.deepEqual(clone.getEntries().map((entry) => entry.value), expected)
    assert.deepEqual(model.getEntries(), before)
    assert.equal(clone.length, values.length)
    assert.deepEqual(new Set(clone.getEntries().map((entry) => entry.id)), new Set(before.map((entry) => entry.id)))
    for (const value of values) {
      assert.deepEqual(clone.getEntries().filter((entry) => entry.value === value), before.filter((entry) => entry.value === value), 'Equal values retain their original IDs and relative order')
    }
    const sorted = clone.getEntries()
    clone.bubbleSort()
    assert.deepEqual(clone.getEntries(), sorted)
    assert.equal(clone.withInsertedAt(0, 99).getAt(0).id, `array-element-${values.length}`)
  }
})

test('bubble sort stops after a swap-free pass and traces adjacent comparisons and swaps', () => {
  for (const values of [[], [1], [1, 2, 3, 4], [4, 3, 2, 1], [2, 2, 2, 2]]) {
    const model = new FixedArray(values)
    const events = []
    model.bubbleSort((event) => {
      events.push(event)
      if (event.kind === 'compare') assert.ok(event.index >= 0 && event.index < event.end)
      if (event.kind === 'swap') assert.ok(model.getAt(event.index).value < model.getAt(event.index + 1).value)
    })
    const comparisons = events.filter((event) => event.kind === 'compare').length
    if (values.length < 2) assert.equal(events.length, 0)
    else if (values[0] === 4) {
      assert.equal(comparisons, 6)
      assert.equal(events.filter((event) => event.kind === 'swap').length, 6)
    } else {
      assert.equal(comparisons, values.length - 1)
      assert.equal(events.filter((event) => event.kind === 'swap').length, 0)
      assert.equal(events.filter((event) => event.kind === 'pass').length, 1)
      assert.equal(events.at(-1).swapped, false)
    }
  }
})

test('sorting plans preserve sources and independent deterministic scenes with stable IDs and fixed slots', () => {
  const example = FixedArray.createSortingDefault()
  assert.equal(example.length, 10)
  assert.notDeepEqual(example.getEntries().map((entry) => entry.value), FixedArray.createDefault().getEntries().map((entry) => entry.value))
  assert.equal(ActionInputRequest.create('array', 'bubble-sorting', example.length), null)
  for (const source of [new FixedArray(), new FixedArray([5]), new FixedArray([3, 1, 3, -1]), example]) {
    const before = source.getEntries()
    const plan = new BubbleSortingAnimation(source)
    assert.deepEqual(source.getEntries(), before)
    assert.notEqual(plan.result, source)
    assert.deepEqual(new BubbleSortingAnimation(source).steps, plan.steps)
    const final = plan.steps.at(-1).scene
    assert.deepEqual(final.nodes.map((node) => node.value), plan.result.getEntries().map((entry) => entry.value))
    assert.ok(final.nodes.every((node) => node.status === 'SORTED'))
    const ids = new Set(before.map((entry) => entry.id))
    for (const step of plan.steps) {
      assert.equal(step.scene.kind, 'array')
      assert.equal(step.scene.count, source.length)
      assert.equal(step.scene.nodes.length, source.length)
      assert.deepEqual(new Set(step.scene.nodes.map((node) => node.id)), ids)
      assert.equal(step.scene.slots.length, source.length)
      for (let index = 0; index < source.length; index += 1) {
        const initialSlot = plan.steps[0].scene.slots[index]
        const slot = step.scene.slots[index]
        assert.deepEqual([slot.id, slot.x, slot.y, slot.label], [initialSlot.id, initialSlot.x, initialSlot.y, initialSlot.label], 'Sorting keeps every slot fixed while its values move')
      }
      assert.ok(step.scene.slots.every((slot) => !slot.empty && slot.opacity === 1))
      assert.ok(step.scene.focusId === null || ids.has(step.scene.focusId))
      const active = step.scene.nodes.filter((node) => node.tone === 'active')
      if (step.phase === 2 || step.phase === 3) {
        assert.equal(active.length, 2)
        assert.equal(active[1].x - active[0].x, 92)
        assert.ok(active.every((node) => node.status === (step.phase === 3 ? 'SWAP' : 'COMPARE')))
      }
    }
    const snapshots = JSON.stringify(plan.steps)
    plan.result.bubbleSort()
    assert.equal(JSON.stringify(plan.steps), snapshots)
    if (plan.steps[0].scene.nodes.length) {
      const finalValue = final.nodes[0].value
      plan.steps[0].scene.nodes[0].value = 12345
      assert.equal(final.nodes[0].value, finalValue)
      assert.deepEqual(source.getEntries(), before)
    }
  }
})
