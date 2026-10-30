import assert from 'node:assert/strict'
import { test } from 'node:test'
import { ActionInputRequest } from '../src/visualization/ActionInputRequest.ts'
import { ActionCatalog } from '../src/visualization/ActionCatalog.ts'
import { LinkedList } from '../src/components/DataStructures/Linear/LinkedList/LinkedList.ts'

test('each linear structure prompts only for its requested value and index actions', () => {
  const expected = {
    'linked-list': ['insert-middle', 'insert-start', 'insert-end', 'search-value', 'search-index', 'delete-value'],
    array: ['insert-middle', 'insert-start', 'insert-end', 'search-value', 'search-index', 'delete-value'],
    stack: ['push', 'search-value'],
    queue: ['enqueue', 'search-value'],
    deque: ['push-front', 'push-back', 'search-value'],
    'doubly-linked-list': ['insert-middle', 'insert-start', 'insert-end', 'delete-value', 'search-value', 'search-index'],
    'circular-buffer': ['enqueue', 'search-value'],
  }
  for (const [structure, actions] of Object.entries(expected)) {
    assert.equal(ActionInputRequest.supportsStructure(structure), true)
    const requested = []
    for (const choice of ActionCatalog.getActions(structure)) {
      const request = ActionInputRequest.create(structure, choice.kind, 10)
      assert.equal(ActionInputRequest.requiresInput(structure, choice.kind), request !== null)
      if (!request) continue
      requested.push(choice.kind)
      assert.equal(request.structure, structure)
      assert.equal(request.title, choice.title)
      assert.ok(request.validate(''))
      assert.equal(request.validate('0'), null)
      if (choice.kind === 'search-index') {
        assert.equal(request.label, 'Index (zero-based)')
        assert.ok(request.validate('10'))
        assert.equal(request.acceptsDraft('-4'), false)
      } else {
        assert.equal(request.validate('-123456'), null)
        assert.equal(request.acceptsDraft('-4'), true)
      }
    }
    assert.deepEqual(requested, actions, structure)
  }
})

test('all tree types prompt for insertion, search, and deletion values', () => {
  for (const structure of ['binary-tree', 'avl-tree', 'red-black-tree', 'b-tree', 'b-plus-tree']) {
    assert.equal(ActionInputRequest.supportsStructure(structure), true)
    const requested = []
    for (const choice of ActionCatalog.getActions(structure)) {
      const request = ActionInputRequest.create(structure, choice.kind, 0)
      assert.equal(ActionInputRequest.requiresInput(structure, choice.kind), request !== null)
      if (!request) continue
      requested.push(choice.kind)
      assert.equal(request.structure, structure)
      assert.equal(request.title, choice.title)
      assert.equal(request.available, true)
      assert.ok(request.validate(''))
      for (const value of [0, -42, 42, Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER]) {
        assert.equal(request.validate(String(value)), null)
      }
      assert.ok(request.validate('1.5'))
      assert.ok(request.validate('9007199254740992'))
    }
    assert.deepEqual(requested, ['insert', 'search-value', 'delete-value', ...(structure === 'b-plus-tree' ? ['range-from-value'] : [])], structure)
    assert.equal(ActionInputRequest.create(structure, 'clear', 10), null)
  }
})

test('B+ range input requires two inclusive whole-number keys in ascending order', () => {
  for (const size of [0, 1, 10]) {
    const request = ActionInputRequest.create('b-plus-tree', 'range-from-value', size)
    assert.ok(request)
    assert.equal(request.rangeInput, true)
    assert.equal(request.label, 'Minimum key (inclusive)')
    assert.equal(request.available, true)
    for (const input of ['', '-', 'hello', '1.5', '1e2', '9007199254740992']) {
      assert.ok(request.validate(input))
      assert.ok(request.validateUpperBound('0', input))
    }
    for (const [minimum, maximum] of [[-10, 10], [50, 50], [Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER]]) {
      assert.equal(request.validate(String(minimum)), null)
      assert.equal(request.validateUpperBound(String(minimum), String(maximum)), null)
    }
    assert.match(request.validateUpperBound('50', '49'), /greater than or equal/)
    assert.equal(request.acceptsDraft('-42'), true)
    assert.equal(request.acceptsDraft('4x'), false)
  }
  for (const structure of ['binary-tree', 'avl-tree', 'red-black-tree', 'b-tree', 'linked-list']) {
    assert.equal(ActionInputRequest.create(structure, 'range-from-value', 10), null)
    const request = ActionInputRequest.create(structure, 'search-value', 10)
    assert.equal(request.rangeInput, false)
    assert.equal(request.validateUpperBound('1', ''), null)
  }
})

test('graph actions retain their existing flow and unavailable actions do not prompt', () => {
  assert.equal(ActionInputRequest.supportsStructure('graph'), false)
  for (const choice of ActionCatalog.getActions('graph')) {
    assert.equal(ActionInputRequest.requiresInput('graph', choice.kind), false)
    assert.equal(ActionInputRequest.create('graph', choice.kind, 10), null)
  }
  assert.equal(ActionInputRequest.requiresInput('stack', 'search-index'), false)
  assert.equal(ActionInputRequest.requiresInput('queue', 'delete-value'), false)
  assert.equal(ActionInputRequest.requiresInput('array', 'push'), false)
})

test('array and both list index dialogs use current bounds and handle empty structures', () => {
  for (const structure of ['array', 'linked-list', 'doubly-linked-list']) {
    for (const size of [1, 3, 10, 11]) {
      const request = ActionInputRequest.create(structure, 'search-index', size)
      assert.equal(request.available, true)
      assert.equal(request.validate(String(size - 1)), null)
      assert.ok(request.validate(String(size)))
      assert.ok(request.validate('-1'))
    }
    const empty = ActionInputRequest.create(structure, 'search-index', 0)
    assert.equal(empty.available, false)
    assert.ok(empty.validate('0'))
    assert.equal(ActionInputRequest.create(structure, 'insert-start', 0).validate('12'), null)
  }
})

test('full circular buffers still allow enqueue input so the animation can show rejection', () => {
  const request = ActionInputRequest.create('circular-buffer', 'enqueue', 12)
  assert.equal(request.available, true)
  assert.equal(request.validate('42'), null)
})

test('the six linked-list actions request the appropriate input and Clear needs none', () => {
  for (const action of ['insert-middle', 'insert-start', 'insert-end', 'search-value', 'delete-value']) {
    const request = ActionInputRequest.create('linked-list', action, 10)
    assert.ok(request)
    assert.equal(request.action, action)
    assert.equal(request.label, 'Value')
    assert.equal(request.validate('-999'), null)
    assert.equal(request.validate('0'), null)
    assert.equal(request.validate('999'), null)
    assert.equal(request.validate('-1000'), null)
    assert.equal(request.validate('1000000'), null)
    assert.equal(request.validate(String(Number.MIN_SAFE_INTEGER)), null)
    assert.equal(request.validate(String(Number.MAX_SAFE_INTEGER)), null)
  }
  const index = ActionInputRequest.create('linked-list', 'search-index', 10)
  assert.equal(index.label, 'Index (zero-based)')
  assert.equal(index.validate('0'), null)
  assert.equal(index.validate('9'), null)
  assert.ok(index.validate('-1'))
  assert.ok(index.validate('10'))
  for (const action of ['clear', 'push', 'insert', 'range-from-value']) {
    assert.equal(ActionInputRequest.create('linked-list', action, 10), null)
  }
})

test('dialog validation rejects missing, fractional, nonnumeric, and unsafe inputs', () => {
  for (const action of ['insert-middle', 'search-index']) {
    const request = ActionInputRequest.create('linked-list', action, 10)
    for (const input of ['', ' ', '-', '1.5', '1e2', '0x10', 'hello', 'NaN', 'Infinity', '9007199254740992']) {
      assert.ok(request.validate(input), `${action} should reject ${JSON.stringify(input)}`)
    }
    assert.equal(request.validate(' 2 '), null)
  }
})

test('index choices follow the current list size after insertion, deletion, and clear', () => {
  const list = LinkedList.createDefault()
  const original = ActionInputRequest.create('linked-list', 'search-index', list.length)
  assert.equal(original.validate('9'), null)
  assert.ok(original.validate('10'))

  list.insertAt(0, 77)
  const afterInsertion = ActionInputRequest.create('linked-list', 'search-index', list.length)
  assert.equal(afterInsertion.validate('10'), null)
  assert.ok(original.validate('10'), 'Earlier requests remain independent of later changes')

  list.deleteAt(0)
  const afterDeletion = ActionInputRequest.create('linked-list', 'search-index', list.length)
  assert.ok(afterDeletion.validate('10'))

  list.clear()
  const empty = ActionInputRequest.create('linked-list', 'search-index', list.length)
  assert.equal(empty.available, false)
  assert.ok(empty.validate('0'))
  assert.equal(ActionInputRequest.create('linked-list', 'insert-end', list.length).validate('42'), null)
})

test('input remains required for singleton and growing lists', () => {
  for (const size of [1, 2, 3, 10, 20]) {
    for (const action of ['insert-middle', 'search-index']) {
      const request = ActionInputRequest.create('linked-list', action, size)
      assert.equal(request.available, true)
      assert.ok(request.validate(''))
      assert.equal(request.validate('0'), null)
    }
  }
  for (const size of [-1, 1.5, NaN, Infinity]) {
    assert.throws(() => ActionInputRequest.create('linked-list', 'search-index', size), RangeError)
  }
})

test('typing and pasting only accepts whole-number characters', () => {
  const value = ActionInputRequest.create('linked-list', 'insert-middle', 10)
  const index = ActionInputRequest.create('linked-list', 'search-index', 10)
  for (const input of ['', '0', '123456']) {
    assert.equal(value.acceptsDraft(input), true)
    assert.equal(index.acceptsDraft(input), true)
  }
  for (const input of ['-', '-42']) {
    assert.equal(value.acceptsDraft(input), true)
    assert.equal(index.acceptsDraft(input), false)
  }
  for (const input of ['abc', '12a', '1e2', '0x10', '1.5', '+5', ' 4 ', '4-2']) {
    assert.equal(value.acceptsDraft(input), false)
    assert.equal(index.acceptsDraft(input), false)
  }
})
