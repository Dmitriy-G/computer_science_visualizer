import assert from 'node:assert/strict'
import { test } from 'node:test'
import { Queue } from '../src/components/DataStructures/Linear/Queue/Queue.ts'
import { Deque } from '../src/components/DataStructures/Linear/Deque/Deque.ts'
import { DoublyLinkedList } from '../src/components/DataStructures/Linear/DoublyLinkedList/DoublyLinkedList.ts'
import { CircularBuffer } from '../src/components/DataStructures/Linear/CircularBuffer/CircularBuffer.ts'
import { InsertionAnimation as Enqueue } from '../src/components/DataStructures/Linear/Queue/Enqueue/InsertionAnimation.ts'
import { RemovalAnimation as Dequeue } from '../src/components/DataStructures/Linear/Queue/Dequeue/RemovalAnimation.ts'
import { PeekAnimation as QueuePeek } from '../src/components/DataStructures/Linear/Queue/Peek/PeekAnimation.ts'
import { ClearAnimation as QueueClear } from '../src/components/DataStructures/Linear/Queue/Clear/ClearAnimation.ts'
import { SearchAnimation as QueueSearch } from '../src/components/DataStructures/Linear/Queue/SearchByValue/SearchAnimation.ts'
import { InsertionAnimation as PushFront } from '../src/components/DataStructures/Linear/Deque/PushFront/InsertionAnimation.ts'
import { InsertionAnimation as PushBack } from '../src/components/DataStructures/Linear/Deque/PushBack/InsertionAnimation.ts'
import { RemovalAnimation as PopFront } from '../src/components/DataStructures/Linear/Deque/PopFront/RemovalAnimation.ts'
import { RemovalAnimation as PopBack } from '../src/components/DataStructures/Linear/Deque/PopBack/RemovalAnimation.ts'
import { PeekAnimation as PeekFront } from '../src/components/DataStructures/Linear/Deque/PeekFront/PeekAnimation.ts'
import { PeekAnimation as PeekBack } from '../src/components/DataStructures/Linear/Deque/PeekBack/PeekAnimation.ts'
import { ClearAnimation as DequeClear } from '../src/components/DataStructures/Linear/Deque/Clear/ClearAnimation.ts'
import { SearchAnimation as DequeSearch } from '../src/components/DataStructures/Linear/Deque/SearchByValue/SearchAnimation.ts'
import { InsertionAnimation as ListMiddle } from '../src/components/DataStructures/Linear/DoublyLinkedList/AddInTheMiddle/InsertionAnimation.ts'
import { InsertionAnimation as ListStart } from '../src/components/DataStructures/Linear/DoublyLinkedList/AddAtStart/InsertionAnimation.ts'
import { InsertionAnimation as ListEnd } from '../src/components/DataStructures/Linear/DoublyLinkedList/AddAtEnd/InsertionAnimation.ts'
import { RemovalAnimation as DeleteStart } from '../src/components/DataStructures/Linear/DoublyLinkedList/DeleteAtStart/RemovalAnimation.ts'
import { RemovalAnimation as DeleteEnd } from '../src/components/DataStructures/Linear/DoublyLinkedList/DeleteAtEnd/RemovalAnimation.ts'
import { RemovalAnimation as DeleteValue } from '../src/components/DataStructures/Linear/DoublyLinkedList/DeleteByValue/RemovalAnimation.ts'
import { SearchAnimation as ListSearch } from '../src/components/DataStructures/Linear/DoublyLinkedList/SearchByValue/SearchAnimation.ts'
import { SearchAnimation as ListIndex } from '../src/components/DataStructures/Linear/DoublyLinkedList/SearchByIndex/SearchAnimation.ts'
import { ClearAnimation as ListClear } from '../src/components/DataStructures/Linear/DoublyLinkedList/Clear/ClearAnimation.ts'
import { EnqueueAnimation as BufferEnqueue } from '../src/components/DataStructures/Linear/CircularBuffer/Enqueue/EnqueueAnimation.ts'
import { DequeueAnimation as BufferDequeue } from '../src/components/DataStructures/Linear/CircularBuffer/Dequeue/DequeueAnimation.ts'
import { PeekAnimation as BufferPeek } from '../src/components/DataStructures/Linear/CircularBuffer/Peek/PeekAnimation.ts'
import { ClearAnimation as BufferClear } from '../src/components/DataStructures/Linear/CircularBuffer/Clear/ClearAnimation.ts'
import { SearchAnimation as BufferSearch } from '../src/components/DataStructures/Linear/CircularBuffer/SearchByValue/SearchAnimation.ts'
import { ActionCatalog } from '../src/visualization/ActionCatalog.ts'
import { StructureCatalog } from '../src/visualization/StructureCatalog.ts'
import { LinkedList } from '../src/components/DataStructures/Linear/LinkedList/LinkedList.ts'
import { AnimationController } from '../src/visualization/AnimationController.ts'

const features = [
  [Queue, 'queue', [Enqueue, Dequeue, QueuePeek, QueueClear, QueueSearch]],
  [Deque, 'deque', [PushFront, PushBack, PopFront, PopBack, PeekFront, PeekBack, DequeClear, DequeSearch]],
  [DoublyLinkedList, 'doubly-linked-list', [ListMiddle, ListStart, ListEnd, DeleteStart, DeleteEnd, DeleteValue, ListSearch, ListIndex, ListClear]],
  [CircularBuffer, 'circular-buffer', [BufferEnqueue, BufferDequeue, BufferPeek, BufferClear, BufferSearch]],
]

class LinearAssertions {
  static create(Model, values) {
    const model = new Model()
    for (const value of values) {
      if (model instanceof DoublyLinkedList) model.insertAt(model.length, value)
      else if (model instanceof Deque) model.pushBack(value)
      else model.enqueue(value)
    }
    return model
  }

  static values(model) { return model.getEntries().map((entry) => entry.value) }

  static links(model) {
    const entries = model.getEntries()
    assert.equal(entries.length, model.length)
    assert.equal(model.isEmpty(), entries.length === 0)
    assert.equal(new Set(entries.map((entry) => entry.id)).size, entries.length)
    for (let index = 0; index < entries.length; index += 1) {
      if ('nextId' in entries[index]) assert.equal(entries[index].nextId, entries[index + 1]?.id ?? null)
      if ('prevId' in entries[index]) assert.equal(entries[index].prevId, entries[index - 1]?.id ?? null)
    }
    if (model instanceof CircularBuffer) {
      assert.equal(model.writeIndex, (model.readIndex + model.length) % model.capacity)
      assert.equal(model.isFull(), model.length === model.capacity)
      for (let index = 0; index < entries.length; index += 1)
        assert.equal(entries[index].slot, (model.readIndex + index) % model.capacity)
    }
  }

  static plan(plan, model, kind) {
    const final = plan.steps.at(-1).scene
    assert.equal(final.count, plan.result.length)
    assert.deepEqual(final.nodes.map(({ id, value }) => ({ id, value })).sort((a, b) => a.id.localeCompare(b.id)), plan.result.getEntries().map(({ id, value }) => ({ id, value })).sort((a, b) => a.id.localeCompare(b.id)))
    for (const step of plan.steps.slice(0, -1)) assert.equal(step.scene.count, model.length)
    for (const step of plan.steps) {
      assert.equal(step.scene.kind, kind)
      assert.ok(step.title && step.description && step.code && step.duration > 0)
      const ids = new Set(step.scene.nodes.map((node) => node.id))
      assert.equal(ids.size, step.scene.nodes.length)
      if (step.scene.focusId !== null) assert.ok(ids.has(step.scene.focusId))
      for (const edge of step.scene.edges) assert.ok(ids.has(edge.from) && ids.has(edge.to))
      for (const node of step.scene.nodes) {
        assert.ok(node.x >= 33 && node.x + 33 <= step.scene.width)
        assert.ok(node.y >= 33 && node.y + 33 <= step.scene.height)
      }
    }
    const entries = plan.result.getEntries()
    if (kind !== 'circular-buffer') {
      assert.equal(final.edges.length, Math.max(0, entries.length - 1) * (kind === 'queue' ? 1 : 2))
      for (let index = 1; index < entries.length; index += 1) {
        assert.ok(final.edges.some((edge) => edge.from === entries[index - 1].id && edge.to === entries[index].id && edge.label === 'next'))
        if (kind !== 'queue') assert.ok(final.edges.some((edge) => edge.from === entries[index].id && edge.to === entries[index - 1].id && edge.label === 'prev'))
      }
    } else assert.equal(final.slots.length, plan.result.capacity)
    LinearAssertions.links(plan.result)
  }
}

test('queue is FIFO and resets both end pointers after the last removal', () => {
  const queue = new Queue()
  assert.equal(queue.dequeue(), null)
  assert.equal(queue.peek(), null)
  for (const value of [10, 20, 20, -5]) queue.enqueue(value)
  assert.equal(queue.peek().value, 10)
  assert.deepEqual(LinearAssertions.values(queue), [10, 20, 20, -5])
  assert.equal(queue.find(20).id, queue.getEntries()[1].id)
  for (const value of [10, 20, 20, -5]) {
    assert.equal(queue.dequeue().value, value)
    LinearAssertions.links(queue)
  }
  queue.enqueue(99)
  assert.equal(queue.peek().value, 99)
  assert.equal(queue.getEntries()[0].id, 'queue-node-4')
  queue.clear()
  assert.equal(queue.length, 0)
})

test('deque supports both ends through singleton and empty transitions', () => {
  const deque = new Deque()
  assert.equal(deque.popFront(), null)
  assert.equal(deque.popBack(), null)
  assert.equal(deque.peekFront(), null)
  assert.equal(deque.peekBack(), null)
  deque.pushFront(20)
  deque.pushFront(10)
  deque.pushBack(30)
  assert.equal(deque.peekFront().value, 10)
  assert.equal(deque.peekBack().value, 30)
  assert.equal(deque.popBack().value, 30)
  assert.equal(deque.popFront().value, 10)
  assert.equal(deque.popBack().value, 20)
  LinearAssertions.links(deque)
  deque.pushBack(40)
  assert.equal(deque.peekFront().id, deque.peekBack().id)
  assert.equal(deque.popFront().value, 40)
  LinearAssertions.links(deque)
})

test('doubly linked list maintains reciprocal pointers for indexed insertions and first-match deletion', () => {
  const list = LinearAssertions.create(DoublyLinkedList, [10, 20, 20, 30])
  const duplicateId = list.getAt(2).id
  const first = list.find(20)
  assert.equal(list.deleteFirst(20).id, first.id)
  assert.equal(list.find(20).id, duplicateId)
  LinearAssertions.links(list)
  list.insertAt(0, 5)
  list.insertAt(2, 15)
  list.insertAt(list.length, 40)
  assert.deepEqual(LinearAssertions.values(list), [5, 10, 15, 20, 30, 40])
  for (let index = 0; index < list.length; index += 1) assert.equal(list.getAt(index).value, LinearAssertions.values(list)[index])
  assert.equal(list.deleteFirst(999), null)
  list.removeAt(0)
  list.removeAt(list.length - 1)
  LinearAssertions.links(list)
  for (const index of [-1, 0.5, NaN, list.length]) assert.throws(() => list.removeAt(index), RangeError)
  list.clear()
  list.insertAt(0, 99)
  LinearAssertions.links(list)
})

test('circular buffer wraps both indices, rejects full writes, and never overwrites values', () => {
  for (const capacity of [1, 3, 12]) {
    const buffer = new CircularBuffer(capacity)
    assert.equal(buffer.dequeue(), null)
    assert.equal(buffer.peek(), null)
    for (let value = 0; value < capacity; value += 1) buffer.enqueue(value)
    const before = buffer.getEntries()
    assert.equal(buffer.isFull(), true)
    assert.equal(buffer.readIndex, buffer.writeIndex)
    assert.equal(buffer.enqueue(999), null)
    assert.deepEqual(buffer.getEntries(), before)
    for (let value = 0; value < capacity; value += 1) {
      assert.equal(buffer.dequeue().value, value)
      buffer.enqueue(100 + value)
      LinearAssertions.links(buffer)
    }
    assert.deepEqual(LinearAssertions.values(buffer), Array.from({ length: capacity }, (_, index) => 100 + index))
    assert.equal(buffer.find(100).slot, buffer.readIndex)
    assert.equal(buffer.find(999), null)
    buffer.clear()
    buffer.clear()
    assert.equal(buffer.readIndex, buffer.writeIndex)
    assert.equal(buffer.isEmpty(), true)
    assert.equal(buffer.enqueue(77).id, `buffer-node-${capacity * 2}`)
    assert.equal(buffer.peek().value, 77)
    LinearAssertions.links(buffer)
  }
  for (const capacity of [0, -1, 0.5, NaN, Infinity]) assert.throws(() => new CircularBuffer(capacity), RangeError)
})

test('mixed linked operations preserve cached counts, end pointers, and unique IDs', () => {
  for (const Model of [Queue, Deque, DoublyLinkedList]) {
    const model = new Model()
    const expected = []
    const ids = new Set()
    for (let index = 0; index < 150; index += 1) {
      if (index % 29 === 0) {
        model.clear()
        expected.length = 0
      } else if (index % 3 === 0 && expected.length) {
        const back = index % 2 === 0 && Model !== Queue
        const removed = Model === Queue ? model.dequeue() : Model === Deque ? back ? model.popBack() : model.popFront() : model.removeAt(back ? model.length - 1 : 0)
        assert.equal(removed.value, back ? expected.pop() : expected.shift())
      } else {
        const front = index % 2 === 0 && Model !== Queue
        const added = Model === Queue ? model.enqueue(index) : Model === Deque ? front ? model.pushFront(index) : model.pushBack(index) : model.insertAt(front ? 0 : model.length, index)
        assert.ok(!ids.has(added.id))
        ids.add(added.id)
        if (front) expected.unshift(index)
        else expected.push(index)
      }
      assert.deepEqual(LinearAssertions.values(model), expected)
      LinearAssertions.links(model)
    }
  }
})

test('snapshots and clones are independent and invalid values do not change any model', () => {
  for (const [Model] of features) {
    const model = Model.createDefault()
    const before = model.getEntries()
    model.getEntries()[0].value = 999
    const clone = model.clone()
    clone.clear()
    assert.deepEqual(model.getEntries(), before)
    for (const value of [NaN, Infinity, -Infinity, 0.5, Number.MAX_SAFE_INTEGER + 1]) {
      assert.throws(() => model.find(value), TypeError)
      if (model instanceof DoublyLinkedList) assert.throws(() => model.insertAt(0, value), TypeError)
      else if (model instanceof Deque) {
        assert.throws(() => model.pushFront(value), TypeError)
        assert.throws(() => model.pushBack(value), TypeError)
      } else assert.throws(() => model.enqueue(value), TypeError)
      assert.deepEqual(model.getEntries(), before)
    }
  }
})

test('all 27 actions have deterministic independent scenes and only commit at the final frame', () => {
  for (const [Model, kind, animations] of features) {
    for (const values of [[], [20], [20, 20, -5], [10, 20, 30, 40, 50, 60, 70, 80, 90, 100]]) {
      for (const Animation of animations) {
        const model = LinearAssertions.create(Model, values)
        const before = model.getEntries()
        for (const value of Animation === ListIndex ? [0, 1, 5, 99] : [20, 999]) {
          const plan = new Animation(model, value)
          LinearAssertions.plan(plan, model, kind)
          assert.deepEqual(model.getEntries(), before)
          assert.deepEqual(new Animation(model, value).steps, plan.steps)
          const snapshots = JSON.stringify(plan.steps)
          plan.result.clear()
          assert.equal(JSON.stringify(plan.steps), snapshots)
          assert.deepEqual(model.getEntries(), before)
        }
      }
    }
  }
})

test('animation results perform the selected operation and search stops at the first duplicate', () => {
  const queue = LinearAssertions.create(Queue, [10, 20, 20])
  assert.deepEqual(LinearAssertions.values(new Enqueue(queue, 99).result), [10, 20, 20, 99])
  assert.deepEqual(LinearAssertions.values(new Dequeue(queue).result), [20, 20])
  assert.equal(new QueuePeek(queue).entry.value, 10)
  const deque = LinearAssertions.create(Deque, [10, 20, 20])
  assert.deepEqual(LinearAssertions.values(new PushFront(deque, 99).result), [99, 10, 20, 20])
  assert.deepEqual(LinearAssertions.values(new PushBack(deque, 99).result), [10, 20, 20, 99])
  assert.deepEqual(LinearAssertions.values(new PopFront(deque).result), [20, 20])
  assert.deepEqual(LinearAssertions.values(new PopBack(deque).result), [10, 20])
  assert.equal(new PeekFront(deque).entry.value, 10)
  assert.equal(new PeekBack(deque).entry.value, 20)
  const list = LinearAssertions.create(DoublyLinkedList, [10, 20, 20])
  assert.deepEqual(LinearAssertions.values(new ListMiddle(list, 99).result), [10, 99, 20, 20])
  assert.deepEqual(LinearAssertions.values(new ListStart(list, 99).result), [99, 10, 20, 20])
  assert.deepEqual(LinearAssertions.values(new ListEnd(list, 99).result), [10, 20, 20, 99])
  assert.deepEqual(LinearAssertions.values(new DeleteStart(list).result), [20, 20])
  assert.deepEqual(LinearAssertions.values(new DeleteEnd(list).result), [10, 20])
  assert.deepEqual(LinearAssertions.values(new DeleteValue(list, 20).result), [10, 20])
  assert.equal(new DeleteValue(list, 20).removed.id, list.getEntries()[1].id)
  for (const [model, Search] of [[queue, QueueSearch], [deque, DequeSearch], [list, ListSearch], [LinearAssertions.create(CircularBuffer, [10, 20, 20]), BufferSearch]]) {
    const plan = new Search(model, 20)
    assert.equal(plan.foundId, model.getEntries()[1].id)
    assert.equal(plan.steps.filter((step) => step.title.startsWith('Compare')).length, 2)
    assert.deepEqual(plan.result.getEntries(), model.getEntries())
  }
  for (const [Model, Clear] of [[Queue, QueueClear], [Deque, DequeClear], [DoublyLinkedList, ListClear], [CircularBuffer, BufferClear]])
    assert.equal(new Clear(Model.createDefault()).result.length, 0)
})

test('doubly linked actions show separate next/prev reconnections and traversal from the nearer end', () => {
  const list = DoublyLinkedList.createDefault()
  const insertion = new ListMiddle(list, 99)
  const next = insertion.steps.findIndex((step) => step.title === 'Set the new next pointer')
  const prev = insertion.steps.findIndex((step) => step.title === 'Set the new prev pointer')
  assert.ok(next >= 0 && prev > next)
  assert.ok(insertion.steps.some((step) => step.code === 'current = current.prev'))
  const backward = new ListIndex(list, 8)
  assert.equal(backward.steps.filter((step) => step.code === 'current = current.prev').length, 1)
  assert.equal(backward.steps.some((step) => step.code === 'current = current.next'), false)
  assert.equal(backward.foundId, list.getAt(8).id)
  const deletion = new DeleteValue(list, 50)
  assert.ok(deletion.steps.findIndex((step) => step.title === 'Reconnect prev') > deletion.steps.findIndex((step) => step.title === 'Bypass the node with next'))
})

test('buffer animations keep physical positions and capacity stable across wraparound and full rejection', () => {
  const buffer = new CircularBuffer(3)
  buffer.enqueue(10)
  buffer.enqueue(20)
  buffer.dequeue()
  buffer.enqueue(30)
  const before = buffer.getEntries()
  const enqueue = new BufferEnqueue(buffer, 40)
  assert.equal(enqueue.inserted.slot, 0)
  assert.deepEqual(LinearAssertions.values(enqueue.result), [20, 30, 40])
  assert.equal(enqueue.result.capacity, 3)
  const final = enqueue.steps.at(-1).scene
  for (const entry of before) {
    const start = enqueue.steps[0].scene.nodes.find((node) => node.id === entry.id)
    const finish = final.nodes.find((node) => node.id === entry.id)
    assert.equal(finish.x, start.x)
    assert.equal(finish.y, start.y)
  }
  const rejected = new BufferEnqueue(enqueue.result, 99)
  assert.equal(rejected.inserted, null)
  assert.deepEqual(rejected.result.getEntries(), enqueue.result.getEntries())
  assert.ok(rejected.steps.some((step) => step.title === 'Buffer is full'))
  const pop = new BufferDequeue(enqueue.result)
  assert.equal(pop.removed.value, 20)
  assert.equal(pop.result.writeIndex, enqueue.result.writeIndex)
  assert.equal(new BufferPeek(enqueue.result).entry.value, 20)
  const one = new CircularBuffer(1)
  one.enqueue(10)
  LinearAssertions.plan(new BufferEnqueue(one, 99), one, 'circular-buffer')
  LinearAssertions.plan(new BufferDequeue(one), one, 'circular-buffer')
})

test('rewinding and replaying every new action restores the original without repeating mutations', () => {
  for (const [Model, , animations] of features) {
    for (const Animation of animations) {
      const original = Model.createDefault()
      const plan = new Animation(original, Animation === ListIndex ? 5 : 50)
      const before = original.getEntries()
      const result = plan.result.getEntries()
      let committed = original
      const controller = new AnimationController(plan.steps, {
        onTimelineChange(index) { committed = index === plan.steps.length - 1 ? plan.result : original },
      }, { schedule() { return 1 }, cancel() {} })
      controller.seek(plan.steps.length - 1)
      assert.equal(committed, plan.result)
      controller.previous()
      assert.equal(committed, original)
      controller.seek(plan.steps.length - 1)
      controller.play()
      assert.equal(committed, original)
      controller.seek(plan.steps.length - 1)
      assert.deepEqual(committed.getEntries(), result)
      assert.deepEqual(original.getEntries(), before)
      controller.dispose()
    }
  }
})

test('buffer search and clear traverse occupied slots across the physical boundary', () => {
  const buffer = CircularBuffer.createDefault()
  const entries = buffer.getEntries()
  assert.deepEqual(entries.map((entry) => entry.slot), [8, 9, 10, 11, 0, 1, 2, 3, 4, 5])
  const search = new BufferSearch(buffer, 50)
  const compared = search.steps.filter((step) => step.title.startsWith('Compare'))
  assert.deepEqual(compared.map((step) => step.scene.focusId), entries.slice(0, 5).map((entry) => entry.id))
  assert.equal(search.foundId, entries[4].id)
  const clear = new BufferClear(buffer)
  assert.deepEqual(clear.steps.filter((step) => step.title.startsWith('Release value')).map((step) => step.scene.focusId), entries.map((entry) => entry.id))
  assert.equal(clear.result.readIndex, buffer.writeIndex)
  for (const step of clear.steps) {
    for (const node of step.scene.nodes) {
      const initial = clear.steps[0].scene.nodes.find((entry) => entry.id === node.id)
      assert.equal(node.x, initial.x)
      assert.equal(node.y, initial.y)
    }
  }
  LinearAssertions.plan(search, buffer, 'circular-buffer')
  LinearAssertions.plan(clear, buffer, 'circular-buffer')
})

test('new Linear menu entries load ten elements and offer only implemented suitable actions', () => {
  const expected = {
    queue: ['enqueue', 'dequeue', 'peek', 'clear', 'search-value'],
    deque: ['push-front', 'push-back', 'pop-front', 'pop-back', 'peek-front', 'peek-back', 'clear', 'search-value'],
    'doubly-linked-list': ['insert-middle', 'insert-start', 'insert-end', 'delete-start', 'delete-end', 'delete-value', 'search-value', 'search-index', 'clear'],
    'circular-buffer': ['enqueue', 'dequeue', 'peek', 'clear', 'search-value'],
  }
  for (const [, kind] of features) {
    assert.equal(StructureCatalog.getGroupForStructure(kind), 'linear')
    assert.deepEqual(ActionCatalog.getActions(kind).map((action) => action.kind), expected[kind])
    const preview = StructureCatalog.createPreview(kind, LinkedList.createDefault())
    assert.equal(preview.kind, kind)
    assert.equal(preview.count, 10)
    assert.equal(preview.nodes.length, 10)
  }
})

test('algorithm cards distinguish constant end operations, traversal, and linear clear at fixed input sizes', () => {
  const scans = [QueueSearch, DequeSearch, ListSearch, ListIndex, DeleteValue, BufferSearch]
  const clears = [QueueClear, DequeClear, ListClear, BufferClear]
  for (const [, , animations] of features) {
    for (const Animation of animations) {
      const info = Animation.describe(10)
      const expected = scans.includes(Animation) ? ['O(1)', 'O(n)', 'O(n)'] : clears.includes(Animation) || Animation === ListMiddle ? ['O(n)', 'O(n)', 'O(n)'] : ['O(1)', 'O(1)', 'O(1)']
      assert.deepEqual([info.time.best, info.time.average, info.time.worst], expected)
      assert.deepEqual([info.memory.best, info.memory.average, info.memory.worst], ['O(1)', 'O(1)', 'O(1)'])
      assert.match(info.terms[0].meaning, /n = 10\./)
      if (scans.includes(Animation)) assert.match(info.time.explanation, /uniformly distributed/)
      assert.match(info.memory.explanation, /Animation storage excluded/)
    }
  }
})
