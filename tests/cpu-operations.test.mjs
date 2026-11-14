import assert from 'node:assert/strict'
import { test } from 'node:test'
import { HardwareSnapshot } from '../src/components/RealSystemsAlgorithms/Hardware/Fundamental/HardwareSnapshot.ts'
import { CpuAlgorithmCatalog } from '../src/components/RealSystemsAlgorithms/Hardware/Fundamental/Cpu/CpuAlgorithmCatalog.ts'
import { CpuLayout } from '../src/components/RealSystemsAlgorithms/Hardware/Fundamental/Cpu/CpuLayout.ts'
import { CpuOperationModel } from '../src/components/RealSystemsAlgorithms/Hardware/Fundamental/Cpu/CpuOperationModel.ts'
import { CpuOperationTrace } from '../src/components/RealSystemsAlgorithms/Hardware/Fundamental/Cpu/CpuOperationTrace.ts'
import { SystemOverviewLayout } from '../src/components/RealSystemsAlgorithms/SystemOverview/SystemOverviewLayout.ts'
import { MenuSearchIndex } from '../src/components/MainMenu/Search/MenuSearchIndex.ts'

const core = (step) => step.scene.layers.find((layer) => layer.id === 'cpu-core').scene
const value = (step, id) => core(step).nodes.find((node) => node.id === `cpu-op-${id}`).displayValue
const result = (plan, id) => plan.result.banks[0].cells.find((cell) => cell.id === id).value

test('CPU exposes exactly the non-atomic increment and atomic load, without old destinations', () => {
  assert.deepEqual(CpuAlgorithmCatalog.choices.map((choice) => choice.kind), ['cpu-non-atomic-increment', 'cpu-atomic-load'])
  const index = new MenuSearchIndex(() => null)
  for (const choice of CpuAlgorithmCatalog.choices) {
    const found = index.find('algorithms', choice.name).filter((entry) => entry.componentAlgorithm === choice.kind)
    assert.equal(found.length, 1)
    assert.equal(found[0].context, 'System Components Overview / Hardware Fundamental / CPU')
    const info = CpuAlgorithmCatalog.describeOverview(choice.kind)
    assert.ok(info.steps.length <= 10)
    assert.match(info.implementationNote, /aligned 32-bit/)
    assert.match(info.implementationNote, /i is local/)
  }
  for (const name of ['Register renaming', 'Out-of-order execution', 'History-based branch prediction', 'Return-address stack prediction']) {
    assert.ok(index.find('algorithms', name).every((entry) => !('componentAlgorithm' in entry)))
  }
})

test('compound increment preserves the captured operand and exposes a lost update', () => {
  const model = new CpuOperationModel('increment')
  assert.throws(() => model.addOne())
  assert.throws(() => model.retireStore())
  assert.throws(() => model.publishStore())
  assert.equal(model.load(), 7)
  model.peerStore(8)
  assert.equal(model.loaded, 7)
  assert.equal(model.addOne(), 8)
  assert.equal(model.shared, 8)
  assert.throws(() => model.publishStore())
  assert.equal(model.retireStore(), 8)
  assert.equal(model.storeBuffer, 8)
  assert.throws(() => model.drainStore())
  assert.equal(model.publishStore(), 8)
  assert.equal(model.storeBuffer, 8)
  model.drainStore()
  assert.equal(model.storeBuffer, null)
  assert.notEqual(model.shared, 9)
  assert.throws(() => model.load())
})

test('atomic read retains one whole value independently of later coherent writes', () => {
  const model = new CpuOperationModel('load')
  assert.throws(() => model.retireLoad())
  assert.throws(() => model.peerStore(99))
  assert.equal(model.load(), 7)
  model.peerStore(99)
  assert.equal(model.loaded, 7)
  assert.equal(model.retireLoad(), 7)
  assert.equal(model.local, 7)
  assert.equal(model.shared, 99)
  assert.throws(() => model.addOne())
  assert.throws(() => model.retireStore())
  assert.throws(() => model.peerStore(2 ** 32))
})

test('new CPU sequences preserve common geometry, color, camera, and independent frames', () => {
  const common = CpuLayout.create()
  const preview = SystemOverviewLayout.still(SystemOverviewLayout.create('cpu', null))
  for (const choice of CpuAlgorithmCatalog.choices) {
    const source = new HardwareSnapshot()
    const before = source.clone()
    const definition = CpuAlgorithmCatalog.definition(choice.kind)
    const plan = definition.create(source, 0)
    assert.deepEqual(plan, definition.create(source, 0))
    assert.deepEqual(source, before)
    assert.equal(plan.steps[0].phase, 0)
    assert.equal(plan.steps.at(-1).phase, 2)
    assert.ok(plan.steps.length > 10 && plan.steps.length <= 96)
    assert.equal(plan.result.events, plan.steps.length)
    for (let index = 0; index < plan.steps.length; index += 1) {
      const step = plan.steps[index]
      assert.equal(step.scene.width, common.width)
      assert.equal(step.scene.height, common.height)
      assert.deepEqual(step.scene.regions, common.regions)
      const inner = core(step)
      const staticCore = common.layers[0]
      assert.deepEqual({ ...step.scene.layers[0], scene: null }, { ...staticCore, scene: null })
      const expected = staticCore.scene.regions.map((region) => ({ ...region, shortLabel: region.shortLabel?.replace(/\s*\(~[^)]*\)/g, '') }))
      assert.deepEqual(inner.regions, expected)
      assert.ok(inner.regions.every((region) => !region.shortLabel?.includes('(~')))
      assert.ok(inner.edges.length <= 1)
      assert.equal(new Set(inner.nodes.map((node) => node.id)).size, inner.nodes.length)
      if (inner.focusId) assert.ok(inner.nodes.some((node) => node.id === inner.focusId))
      for (const edge of inner.edges) {
        assert.ok(inner.nodes.some((node) => node.id === edge.from))
        assert.ok(inner.nodes.some((node) => node.id === edge.to))
        assert.equal(inner.focusId, edge.to)
      }
      for (const node of inner.nodes) {
        assert.ok(node.x - node.width / 2 >= 0 && node.x + node.width / 2 <= inner.width)
        assert.ok(node.y - node.height / 2 >= 0 && node.y + node.height / 2 + 28 <= inner.height)
      }
      if (index) {
        const previous = new Map(core(plan.steps[index - 1]).nodes.map((node) => [node.id, node.displayValue]))
        const changed = inner.nodes.filter((node) => previous.get(node.id) !== node.displayValue)
        assert.ok(changed.length <= 1)
        if (changed.length) assert.equal(changed[0].id, inner.focusId)
      }
      const presented = CpuOperationTrace.present(step.scene, preview)
      assert.equal(presented.camera, preview.camera)
      assert.equal(presented.kind, preview.kind)
      assert.equal(presented.width, preview.width)
      assert.equal(presented.height, preview.height)
      const layer = presented.layers.find((entry) => entry.id === 'cpu-components')
      const original = preview.layers.find((entry) => entry.id === 'cpu-components')
      assert.deepEqual({ ...layer, scene: null }, { ...original, scene: null })
      assert.equal(layer.scene, step.scene)
    }
    const initial = structuredClone(plan.steps[0])
    core(plan.steps.at(-1)).nodes[0].displayValue = 'changed final'
    plan.result.banks[0].cells[0].value = 'changed result'
    assert.deepEqual(plan.steps[0], initial)
  }
})

test('increment and atomic-load frames show the distinct visibility and retirement events', () => {
  const increment = CpuAlgorithmCatalog.definition('cpu-non-atomic-increment').create(new HardwareSnapshot(), 0)
  const peer = increment.steps.find((step) => step.title === 'Another core updates i')
  assert.equal(value(peer, 'memory'), 'i = 8')
  assert.equal(value(peer, 'register'), 'r = 7')
  const retired = increment.steps.find((step) => step.title === 'Retire store')
  assert.equal(value(retired, 'lsu'), 'store buffer: 8')
  assert.equal(value(increment.steps.at(-1), 'lsu'), 'empty')
  assert.equal(result(increment, 'shared'), '8')
  assert.equal(result(increment, 'computed'), '8')
  const load = CpuAlgorithmCatalog.definition('cpu-atomic-load').create(new HardwareSnapshot(), 0)
  const captured = load.steps.find((step) => step.title === 'Capture one complete word')
  assert.equal(value(captured, 'lsu'), '7')
  assert.equal(value(captured, 'committed'), 'idle')
  assert.equal(value(load.steps.at(-1), 'committed'), 'i = 7')
  assert.equal(value(load.steps.at(-1), 'memory'), 'j = 99')
  assert.equal(result(load, 'local'), '7')
  assert.equal(result(load, 'shared'), '99')
  assert.ok(!load.steps.some((step) => /STORE/.test(value(step, 'decode'))))
})
