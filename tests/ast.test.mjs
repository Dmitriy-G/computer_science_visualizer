import assert from 'node:assert/strict'
import { test } from 'node:test'
import { AST, ASTEvaluationError } from '../src/components/AdvancedDataStructures/Syntax/AST/AST.ts'
import { ASTParser } from '../src/components/AdvancedDataStructures/Syntax/AST/ASTParser.ts'
import { ASTLayout } from '../src/components/AdvancedDataStructures/Syntax/AST/ASTLayout.ts'
import { BuildAnimation } from '../src/components/AdvancedDataStructures/Syntax/AST/Build/BuildAnimation.ts'
import { PreorderAnimation } from '../src/components/AdvancedDataStructures/Syntax/AST/Preorder/PreorderAnimation.ts'
import { InorderAnimation } from '../src/components/AdvancedDataStructures/Syntax/AST/Inorder/InorderAnimation.ts'
import { PostorderAnimation } from '../src/components/AdvancedDataStructures/Syntax/AST/Postorder/PostorderAnimation.ts'
import { EvaluateAnimation } from '../src/components/AdvancedDataStructures/Syntax/AST/Evaluate/EvaluateAnimation.ts'
import { ClearAnimation } from '../src/components/AdvancedDataStructures/Syntax/AST/Clear/ClearAnimation.ts'
import { ActionInputRequest } from '../src/visualization/ActionInputRequest.ts'
import { ActionCatalog } from '../src/visualization/ActionCatalog.ts'
import { AdditionalTreeCatalog } from '../src/visualization/AdditionalTreeCatalog.ts'
import { StructureCatalog } from '../src/visualization/StructureCatalog.ts'
import { StructureInformation } from '../src/components/StructureInfo/StructureInformation.ts'
import { LinkedList } from '../src/components/FundamentalDataStructures/Linear/LinkedList/LinkedList.ts'
import { SegmentTree } from '../src/components/AdvancedDataStructures/RangeQueries/SegmentTree/SegmentTree.ts'
import { RangeSumAnimation } from '../src/components/AdvancedDataStructures/RangeQueries/SegmentTree/RangeSum/RangeSumAnimation.ts'

test('AST parser preserves precedence, associativity, grouping, and unary operators', () => {
  const tree = new AST()
  for (const [expression, expected] of [
    ['2 + 3 * 4', 14], ['(2 + 3) * 4', 20], ['10 - 3 - 2', 5],
    ['8 / 2 * 3', 12], ['-(2 + 3) * -4', 20], ['+7 / 2', 3.5],
    ['2--3', 5], ['---2', -2], ['  ((42))  ', 42], ['0', 0],
  ]) {
    assert.equal(ASTParser.validate(expression), null)
    tree.build(expression)
    assert.equal(tree.evaluate(), expected)
    const entries = tree.getDiagram()
    assert.equal(entries.length, tree.length)
    const ids = new Set(entries.map((entry) => entry.id))
    for (const entry of entries) {
      assert.equal(entry.children.length, entry.label === 'literal' ? 0 : entry.label === 'unary' ? 1 : 2)
      assert.ok(entry.children.every((id) => ids.has(id)))
      assert.ok(entry.text !== '(' && entry.text !== ')')
    }
  }
})

test('AST rejects malformed expressions atomically without consuming node IDs', () => {
  const tree = AST.createDefault()
  const expected = tree.clone()
  const before = tree.getDiagram()
  for (const expression of ['', ' ', '1 +', '()', '(1 + 2', '1 2', '2(3)', '1.5', '1e2', '2 ** 3', 'x + 1', 'Math.random()', '9007199254740992', '1'.repeat(129)]) {
    assert.ok(ASTParser.validate(expression), expression)
    assert.throws(() => tree.build(expression), SyntaxError)
    assert.deepEqual(tree.getDiagram(), before)
    assert.equal(tree.expression, expected.expression)
    assert.equal(tree.evaluate(), -30)
  }
  tree.build('5 + 6')
  expected.build('5 + 6')
  assert.deepEqual(tree.getDiagram(), expected.getDiagram())
})

test('AST default has ten nodes and distinct deterministic traversal orders', () => {
  const tree = AST.createDefault()
  assert.equal(tree.length, 10)
  assert.equal(tree.evaluate(), -30)
  const before = tree.getDiagram()
  assert.deepEqual(tree.traverse('preorder'), ['/', '*', 'neg', '+', '8', '2', '-', '9', '3', '2'])
  assert.deepEqual(tree.traverse('inorder'), ['neg', '8', '+', '2', '*', '9', '-', '3', '/', '2'])
  assert.deepEqual(tree.traverse('postorder'), ['8', '2', '+', 'neg', '9', '3', '-', '*', '2', '/'])
  assert.deepEqual(tree.getDiagram(), before)
  const clone = tree.clone()
  clone.build('1')
  assert.equal(clone.evaluate(), 1)
  assert.deepEqual(tree.getDiagram(), before)
})

test('AST clear releases children before parents and retains fresh IDs for rebuilding', () => {
  const tree = AST.createDefault()
  const original = tree.getDiagram()
  let previous = new Map(original.map((entry) => [entry.id, entry]))
  tree.clear({ onTreeChange() {
    const current = new Map(tree.getDiagram().map((entry) => [entry.id, entry]))
    const removed = [...previous.values()].filter((entry) => !current.has(entry.id))
    assert.equal(removed.length, 1)
    assert.ok(removed[0].children.length === 0, 'A released node must have no attached children')
    previous = current
  } })
  assert.equal(tree.length, 0)
  assert.equal(tree.expression, '')
  assert.equal(tree.evaluate(), null)
  for (const order of ['preorder', 'inorder', 'postorder']) assert.deepEqual(tree.traverse(order), [])
  tree.clear()
  tree.build('2 + 3')
  const oldIds = new Set(original.map((entry) => entry.id))
  assert.ok(tree.getDiagram().every((entry) => !oldIds.has(entry.id)))
  assert.equal(tree.evaluate(), 5)
})

test('AST evaluation reports arithmetic errors on the offending node without mutating syntax', () => {
  const tree = new AST()
  for (const [expression, expectedError] of [['4 / (3 - 3)', /Division by zero/], ['9007199254740991 + 1', /safe integer range/]]) {
    tree.build(expression)
    const before = tree.getDiagram()
    assert.throws(() => tree.evaluate(), ASTEvaluationError)
    const plan = new EvaluateAnimation(tree)
    const final = plan.steps.at(-1)
    assert.match(final.code, /^throw Error\(/)
    assert.match(final.description, expectedError)
    assert.ok(final.scene.nodes.some((node) => node.id === final.scene.focusId && node.status === 'ERROR'))
    assert.deepEqual(tree.getDiagram(), before)
    assert.deepEqual(plan.result.getDiagram(), before)
  }
})

test('AST sequences preserve independent scenes, committed counts, and real return values', () => {
  const source = AST.createDefault()
  const original = new ASTLayout().create(source)
  const cases = [
    [BuildAnimation, { expression: '2 + 3 * 4' }, 5],
    [PreorderAnimation, {}, 10], [InorderAnimation, {}, 10], [PostorderAnimation, {}, 10],
    [EvaluateAnimation, {}, 10], [ClearAnimation, {}, 0],
  ]
  for (const [Sequence, input, resultCount] of cases) {
    const plan = new Sequence(source, input)
    const snapshots = structuredClone(plan.steps)
    assert.equal(plan.result.length, resultCount)
    assert.equal(plan.steps.at(-1).scene.count, resultCount)
    for (const step of plan.steps.slice(0, -1)) assert.equal(step.scene.count, source.length)
    for (const step of plan.steps) {
      const ids = new Set(step.scene.nodes.map((node) => node.id))
      assert.equal(ids.size, step.scene.nodes.length)
      for (const edge of step.scene.edges) assert.ok(ids.has(edge.from) && ids.has(edge.to))
    }
    assert.deepEqual(new Sequence(source, input).steps, snapshots)
    plan.result.clear()
    assert.deepEqual(plan.steps, snapshots)
    assert.deepEqual(new ASTLayout().create(source), original)
  }
  assert.equal(new EvaluateAnimation(source).steps.at(-1).code, 'return -30')
  assert.equal(new PreorderAnimation(source).steps.at(-1).code, 'return ["/", "*", "neg", "+", "8", "2", "-", "9", "3", "2"]')
  assert.equal(new EvaluateAnimation(new AST()).steps.at(-1).code, 'return null')
  assert.equal(new PostorderAnimation(new AST()).steps.at(-1).code, 'return []')
  assert.equal(new RangeSumAnimation(new SegmentTree([Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER]), { minimum: 0, maximum: 1 }).steps.at(-1).code, 'return 18014398509481982')
})

test('AST menu, structured input, preview, and overview are integrated', () => {
  const actions = ActionCatalog.getActions('ast').map((action) => action.kind)
  assert.deepEqual(actions, ['build-expression', 'traverse-preorder', 'traverse-inorder', 'traverse-postorder', 'evaluate', 'clear'])
  assert.equal(StructureCatalog.getGroupForStructure('ast'), 'trees')
  assert.equal(AdditionalTreeCatalog.createModels().get('ast').length, 10)
  assert.equal(StructureCatalog.createPreview('ast', LinkedList.createDefault()).count, 10)
  const request = ActionInputRequest.create('ast', 'build-expression', 0)
  assert.equal(request.label, 'Expression')
  assert.equal(request.available, true)
  assert.ok(request.validate('1 +'))
  assert.equal(request.validate('(2 + 3) * -4'), null)
  const field = request.structured.fields[0]
  assert.equal(request.structured.acceptsDraft(field, ' -(2 + 3) / '), true)
  assert.equal(request.structured.acceptsDraft(field, 'alert(1)'), false)
  assert.deepEqual(request.structured.parse({ expression: '2 + 3' }), { expression: '2 + 3' })
  for (const action of actions.slice(1)) assert.equal(ActionInputRequest.create('ast', action, 0), null)
  const overview = StructureInformation.get('ast')
  assert.equal(overview.useCases.length, 4)
  for (const technology of overview.technologies) {
    assert.ok(technology.name && technology.usage && technology.url.startsWith('https://'))
  }
  for (const Sequence of [BuildAnimation, PreorderAnimation, InorderAnimation, PostorderAnimation, EvaluateAnimation, ClearAnimation]) {
    const info = Sequence.describe(10)
    for (const section of [info.time, info.memory]) assert.ok(section.best && section.average && section.worst && section.explanation)
    assert.equal(new Set(info.terms.map((term) => term.symbol)).size, info.terms.length)
  }
})
