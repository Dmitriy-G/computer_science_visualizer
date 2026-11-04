import assert from 'node:assert/strict'
import { test } from 'node:test'
import { Stack } from '../src/components/FundamentalDataStructures/Linear/Stack/Stack.ts'
import { StackLayout } from '../src/components/FundamentalDataStructures/Linear/Stack/StackLayout.ts'
import { PushAnimation } from '../src/components/FundamentalDataStructures/Linear/Stack/Push/PushAnimation.ts'
import { PopAnimation } from '../src/components/FundamentalDataStructures/Linear/Stack/Pop/PopAnimation.ts'
import { PeekAnimation } from '../src/components/FundamentalDataStructures/Linear/Stack/Peek/PeekAnimation.ts'
import { ClearAnimation } from '../src/components/FundamentalDataStructures/Linear/Stack/Clear/ClearAnimation.ts'
import { SearchAnimation } from '../src/components/FundamentalDataStructures/Linear/Stack/SearchByValue/SearchAnimation.ts'
import { StructureCatalog } from '../src/visualization/StructureCatalog.ts'
import { ActionCatalog } from '../src/visualization/ActionCatalog.ts'
import { MenuNavigation } from '../src/components/MainMenu/MenuNavigation.ts'
import { LinkedList } from '../src/components/FundamentalDataStructures/Linear/LinkedList/LinkedList.ts'
import { AnimationController } from '../src/visualization/AnimationController.ts'

class StackAssertions {
  static create(values) {
    const stack = new Stack()
    for (const value of values) stack.push(value)
    return stack
  }

  static checkPlan(plan, original) {
    const entries = plan.result.getEntries()
    const final = plan.steps.at(-1).scene
    assert.equal(final.count, entries.length)
    assert.deepEqual(final.nodes.map(({ id, value }) => ({ id, value })), entries)
    for (const step of plan.steps.slice(0, -1)) assert.equal(step.scene.count, original.length)
    for (const step of plan.steps) {
      assert.ok(step.title && step.description && step.code)
      assert.ok(step.duration > 0)
      assert.equal(step.scene.kind, 'stack')
      assert.equal('annotations' in step.scene, false)
      assert.equal(step.scene.edges.length, 0)
      const ids = new Set()
      for (const node of step.scene.nodes) {
        assert.ok(!ids.has(node.id))
        ids.add(node.id)
        assert.ok(node.x - node.width / 2 >= 0)
        assert.ok(node.x + node.width / 2 < step.scene.width)
        assert.ok(node.y - node.height / 2 >= 0)
        assert.ok(node.y + node.height / 2 < step.scene.height)
        assert.equal(node.labelPlacement, 'right')
      }
      if (step.scene.focusId !== null) assert.ok(ids.has(step.scene.focusId))
    }
  }
}

test('stack pushes and pops in LIFO order, with safe empty results and a cached count', () => {
  const stack = new Stack()
  assert.equal(stack.length, 0)
  assert.equal(stack.isEmpty(), true)
  assert.equal(stack.pop(), null)
  assert.equal(stack.peek(), null)
  const first = stack.push(10)
  const second = stack.push(20)
  const duplicate = stack.push(20)
  assert.equal(stack.length, 3)
  assert.equal(stack.isEmpty(), false)
  assert.deepEqual(stack.peek(), duplicate)
  assert.deepEqual(stack.getEntries(), [duplicate, second, first])
  assert.deepEqual(stack.pop(), duplicate)
  assert.deepEqual(stack.pop(), second)
  assert.deepEqual(stack.pop(), first)
  assert.equal(stack.pop(), null)
  assert.equal(stack.length, 0)
  assert.equal(stack.isEmpty(), true)
})

test('stack snapshots, clones, clear, and search preserve values and stable IDs', () => {
  const original = StackAssertions.create([10, 20, 20, -5])
  const before = original.getEntries()
  assert.deepEqual(original.find(20), before[1])
  assert.equal(original.find(999), null)
  assert.deepEqual(original.getEntries(), before)
  original.peek().value = 999
  original.getEntries()[0].value = 999
  assert.deepEqual(original.getEntries(), before)
  const clone = original.clone()
  clone.pop()
  clone.push(30)
  assert.deepEqual(original.getEntries(), before)
  clone.clear()
  clone.clear()
  assert.equal(clone.length, 0)
  assert.equal(clone.peek(), null)
  assert.equal(clone.push(99).id, 'stack-node-5')
  assert.equal(original.push(99).id, 'stack-node-4')
})

test('invalid stack values and search targets leave the model and ID counter unchanged', () => {
  const stack = Stack.createDefault()
  const before = stack.getEntries()
  for (const value of [NaN, Infinity, -Infinity, 0.5, Number.MAX_SAFE_INTEGER + 1]) {
    assert.throws(() => stack.push(value), TypeError)
    assert.throws(() => stack.find(value), TypeError)
    assert.throws(() => new PushAnimation(stack, value), TypeError)
    assert.throws(() => new SearchAnimation(stack, value), TypeError)
  }
  assert.deepEqual(stack.getEntries(), before)
  assert.equal(stack.push(0).id, 'stack-node-10')
})

test('stack model handles a sustained mix of operations without reusing IDs or corrupting order', () => {
  const stack = new Stack()
  const expected = []
  const usedIds = new Set()
  for (let index = 0; index < 240; index += 1) {
    if (index % 31 === 0) {
      stack.clear()
      expected.length = 0
    } else if (index % 3 === 0) {
      assert.deepEqual(stack.pop(), expected.pop() ?? null)
    } else {
      const pushed = stack.push(index % 7 - 3)
      assert.ok(!usedIds.has(pushed.id))
      usedIds.add(pushed.id)
      expected.push(pushed)
    }
    assert.equal(stack.length, expected.length)
    assert.equal(stack.isEmpty(), expected.length === 0)
    assert.deepEqual(stack.peek(), expected.at(-1) ?? null)
    assert.deepEqual(stack.getEntries(), [...expected].reverse())
  }
})

test('every stack action handles empty, singleton, duplicate, and default inputs without mutating the source', () => {
  const animations = [PushAnimation, PopAnimation, PeekAnimation, ClearAnimation, SearchAnimation]
  for (const values of [[], [10], [20, 20, -10], [10, 20, 30, 40, 50, 60, 70, 80, 90, 100]]) {
    for (const Animation of animations) {
      const stack = StackAssertions.create(values)
      const before = stack.getEntries()
      for (const value of [20, 999]) {
        const plan = new Animation(stack, value)
        StackAssertions.checkPlan(plan, stack)
        assert.deepEqual(stack.getEntries(), before)
        assert.deepEqual(new Animation(stack, value).steps, plan.steps)
        if ([PeekAnimation, SearchAnimation].includes(Animation))
          assert.deepEqual(plan.result.getEntries(), before)
        if (Animation === PushAnimation) assert.equal(plan.result.peek().value, value)
        if (Animation === PopAnimation) assert.deepEqual(plan.removed, before[0] ?? null)
        if (Animation === PeekAnimation) assert.deepEqual(plan.entry, before[0] ?? null)
        if (Animation === ClearAnimation) assert.equal(plan.result.length, 0)
      }
    }
  }
})

test('push creates and lowers a pending node before commit without moving existing values', () => {
  const stack = Stack.createDefault()
  const plan = new PushAnimation(stack, 99)
  const [start, create, place, finish] = plan.steps
  const pendingId = plan.result.peek().id
  assert.equal(start.scene.nodes.length, 10)
  assert.equal(create.scene.nodes.length, 11)
  const created = create.scene.nodes.find((node) => node.id === pendingId)
  const placed = place.scene.nodes.find((node) => node.id === pendingId)
  assert.ok(created.y < placed.y)
  assert.equal(created.status, 'PENDING')
  assert.equal(placed.y, finish.scene.nodes[0].y)
  assert.equal(finish.scene.count, 11)
  for (const original of start.scene.nodes) {
    for (const step of plan.steps.slice(1)) {
      const node = step.scene.nodes.find((entry) => entry.id === original.id)
      assert.equal(node.y, original.y)
      assert.equal(node.value, original.value)
    }
  }
})

test('pop and clear remove from the top and leave surviving positions fixed', () => {
  const stack = Stack.createDefault()
  const plan = new PopAnimation(stack)
  const [start, lift, update, finish] = plan.steps
  assert.equal(plan.removed.value, 100)
  assert.equal(lift.scene.nodes.find((node) => node.id === plan.removed.id).status, 'REMOVING')
  assert.equal(update.scene.nodes.some((node) => node.id === plan.removed.id), false)
  assert.equal(update.scene.count, 10)
  assert.equal(finish.scene.count, 9)
  for (const node of finish.scene.nodes) assert.equal(node.y, start.scene.nodes.find((entry) => entry.id === node.id).y)
  const clear = new ClearAnimation(stack)
  assert.deepEqual(clear.steps.filter((step) => step.title.startsWith('Remove top value')).map((step) => step.scene.nodes[0].value), [100, 90, 80, 70, 60, 50, 40, 30, 20, 10])
  assert.equal(clear.steps.at(-1).scene.slots[0].label, 'top = null')
})

test('stack search stops at the first duplicate from the top and reports a miss or empty stack', () => {
  const stack = StackAssertions.create([10, 20, 30, 20])
  for (const value of [20, 10, 999]) {
    const before = stack.getEntries()
    const plan = new SearchAnimation(stack, value)
    const expected = before.find((entry) => entry.value === value)
    assert.equal(plan.foundId, expected?.id ?? null)
    assert.deepEqual(stack.getEntries(), before)
    assert.equal(plan.steps.filter((step) => step.title.startsWith('Compare')).length, value === 20 ? 1 : 4)
    assert.match(plan.steps.at(-1).description, expected ? /Found/ : /not found/)
  }
  assert.equal(new SearchAnimation(new Stack(), 10).foundId, null)
})

test('rewind and replay restore the original stack and do not repeat mutations', () => {
  for (const Animation of [PushAnimation, PopAnimation, ClearAnimation]) {
    const original = Stack.createDefault()
    const before = original.getEntries()
    const plan = new Animation(original, 99)
    const saved = JSON.stringify(plan.steps)
    let model = original
    const controller = new AnimationController(plan.steps, {
      onTimelineChange(index) { model = index === plan.steps.length - 1 ? plan.result : original },
    }, { schedule() { return 1 }, cancel() {} })
    controller.seek(plan.steps.length - 1)
    assert.equal(model, plan.result)
    controller.previous()
    assert.equal(model, original)
    controller.seek(plan.steps.length - 1)
    controller.play()
    assert.equal(model, original)
    controller.seek(plan.steps.length - 1)
    assert.equal(model, plan.result)
    controller.dispose()
    new PushAnimation(plan.result, 88)
    assert.equal(JSON.stringify(plan.steps), saved)
    assert.deepEqual(original.getEntries(), before)
  }
})

test('stack joins Linear with five actions and top-only mutation choices', () => {
  assert.equal(StructureCatalog.getGroupForStructure('stack'), 'linear')
  const navigation = new MenuNavigation().selectCategory().selectGroup('linear').selectStructure('stack')
  assert.deepEqual(navigation.getPath(), [MenuNavigation.categoryName, 'Linear'])
  const actions = ActionCatalog.getActions('stack')
  assert.deepEqual(actions.map((action) => action.kind), ['push', 'pop', 'peek', 'clear', 'search-value'])
  const scene = StructureCatalog.createPreview('stack', LinkedList.createDefault())
  assert.deepEqual(scene, new StackLayout().create(Stack.createDefault().getEntries()))
  assert.equal(scene.count, 10)
  assert.equal(scene.nodes[0].value, 100)
})

test('stack information distinguishes constant-time primitives, linear clear, and early-exit search', () => {
  for (const Animation of [PushAnimation, PopAnimation, PeekAnimation]) {
    for (const scenario of ['best', 'average', 'worst']) {
      assert.equal(Animation.describe(10).time[scenario], 'O(1)')
      assert.equal(Animation.describe(10).memory[scenario], 'O(1)')
    }
  }
  for (const scenario of ['best', 'average', 'worst']) {
    assert.equal(ClearAnimation.describe(10).time[scenario], 'O(n)')
    assert.equal(ClearAnimation.describe(10).memory[scenario], 'O(1)')
  }
  assert.equal(SearchAnimation.describe(10).time.best, 'O(1)')
  assert.equal(SearchAnimation.describe(10).time.worst, 'O(n)')
  assert.match(SearchAnimation.describe(10).time.explanation, /uniformly distributed/)
  for (const Animation of [PushAnimation, PopAnimation, PeekAnimation, ClearAnimation, SearchAnimation]) {
    for (const size of [0, 1, 10]) assert.match(Animation.describe(size).terms[0].meaning, new RegExp(`n = ${size}\\.`))
    assert.match(Animation.describe(10).memory.explanation, /Animation storage excluded/)
  }
})
