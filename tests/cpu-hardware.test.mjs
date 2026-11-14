import assert from 'node:assert/strict'
import { test } from 'node:test'
import { HardwareSnapshot } from '../src/components/RealSystemsAlgorithms/Hardware/Fundamental/HardwareSnapshot.ts'
import { HardwareOverviewCatalog } from '../src/components/RealSystemsAlgorithms/Hardware/Fundamental/HardwareOverviewCatalog.ts'
import { RegisterRenameModel } from '../src/components/RealSystemsAlgorithms/Hardware/Fundamental/RegisterRenaming/RegisterRenameModel.ts'
import { OutOfOrderModel } from '../src/components/RealSystemsAlgorithms/Hardware/Fundamental/OutOfOrder/OutOfOrderModel.ts'
import { BranchPredictorModel } from '../src/components/RealSystemsAlgorithms/Hardware/Fundamental/BranchPrediction/BranchPredictorModel.ts'
import { ReturnStackModel } from '../src/components/RealSystemsAlgorithms/Hardware/Fundamental/ReturnStack/ReturnStackModel.ts'
import { HardwareTrace } from '../src/components/RealSystemsAlgorithms/Hardware/Fundamental/HardwareTrace.ts'
import { CpuCoreLayout } from '../src/components/RealSystemsAlgorithms/Hardware/Fundamental/CpuCore/CpuCoreLayout.ts'
import { CpuLayout } from '../src/components/RealSystemsAlgorithms/Hardware/Fundamental/Cpu/CpuLayout.ts'
import { SystemOverviewLayout } from '../src/components/RealSystemsAlgorithms/SystemOverview/SystemOverviewLayout.ts'
import { BranchPredictionAnimation } from '../src/components/RealSystemsAlgorithms/Hardware/Fundamental/BranchPrediction/BranchPredictionAnimation.ts'
import { OutOfOrderAnimation } from '../src/components/RealSystemsAlgorithms/Hardware/Fundamental/OutOfOrder/OutOfOrderAnimation.ts'
import { RegisterRenamingAnimation } from '../src/components/RealSystemsAlgorithms/Hardware/Fundamental/RegisterRenaming/RegisterRenamingAnimation.ts'
import { ReturnStackAnimation } from '../src/components/RealSystemsAlgorithms/Hardware/Fundamental/ReturnStack/ReturnStackAnimation.ts'

const legacyCpuChoices = [
  { kind: 'branch-prediction', definition: new BranchPredictionAnimation() },
  { kind: 'out-of-order', definition: new OutOfOrderAnimation() },
  { kind: 'register-renaming', definition: new RegisterRenamingAnimation() },
  { kind: 'return-stack', definition: new ReturnStackAnimation() },
]

test('legacy CPU mechanism primitives retain deterministic independent snapshots', () => {
  const cpuChoices = legacyCpuChoices
  assert.equal(cpuChoices.length, 4)
  for (const choice of cpuChoices) {
    const source = new HardwareSnapshot()
    const before = source.clone()
    const definition = choice.definition
    const plan = definition.create(source, 0)
    assert.deepEqual(source, before)
    assert.deepEqual(plan, definition.create(source, 0))
    assert.ok(plan.steps.length > 2 && plan.steps.length <= 256)
    assert.equal(plan.result.events, plan.steps.length)
    assert.equal(plan.steps[0].phase, 0)
    assert.equal(plan.steps.at(-1).phase, 2)
    for (const step of plan.steps) {
      assert.equal(step.scene.kind, 'cpu-hardware')
      assert.equal(step.scene.width, plan.steps[0].scene.width)
      assert.equal(step.scene.height, plan.steps[0].scene.height)
      const ids = new Set(step.scene.nodes.map((node) => node.id))
      assert.equal(ids.size, step.scene.nodes.length)
      assert.ok(step.scene.focusId === null || ids.has(step.scene.focusId))
      assert.ok(step.scene.regions.some((region) => region.label === 'CPU / Core 0'))
      assert.ok(step.scene.regions.some((region) => region.role === 'cache' && region.label.toLowerCase().includes('instruction')))
      assert.ok(step.scene.regions.some((region) => region.role === 'cache' && region.label.toLowerCase().includes('data')))
      assert.ok(step.scene.regions.some((region) => region.label.toLowerCase().includes('register')))
      assert.ok(step.scene.edges.length > 0)
      for (const edge of step.scene.edges) {
        assert.ok(ids.has(edge.from), `${choice.kind}: missing ${edge.from}`)
        assert.ok(ids.has(edge.to), `${choice.kind}: missing ${edge.to}`)
        assert.equal(edge.directed, true)
        assert.ok(edge.label.length > 0)
      }
    }
    const firstValue = plan.steps[0].scene.nodes[0].displayValue
    plan.steps.at(-1).scene.nodes[0].displayValue = 'changed final snapshot'
    assert.equal(plan.steps[0].scene.nodes[0].displayValue, firstValue)
    assert.ok(definition.constructor.describe().realWorldUsage.technologies.length > 0)
    assert.ok(plan.steps.some((step) => step.scene.edges.some((edge) => edge.highlighted)))
    assert.ok(definition.constructor.describe().modelNotes.includes('not simulated'))
  }
})

test('legacy CPU mechanism traces retain one explained interaction per step', () => {
  let components
  for (const choice of legacyCpuChoices) {
    const plan = choice.definition.create(new HardwareSnapshot(), 0)
    for (let index = 0; index < plan.steps.length; index += 1) {
      const scene = plan.steps[index].scene
      const core = scene.regions.find((region) => region.id === 'core')
      const units = scene.regions.filter((region) => region.id.startsWith('component-'))
      assert.equal(core.width, core.height)
      assert.equal(units.length, CpuCoreLayout.componentCount)
      if (!components) components = units
      assert.deepEqual(units, components)
      const active = scene.edges.filter((edge) => edge.highlighted)
      assert.ok(active.length <= 1, `${choice.kind}: bundled arrows`)
      assert.deepEqual(scene.edges.filter((edge) => edge.opacity > 0), active)
      assert.equal(scene.count, index + 1)
      for (const node of scene.nodes) {
        assert.ok(node.x - node.width / 2 > core.x)
        assert.ok(node.x + node.width / 2 < core.x + core.width)
        assert.ok(node.y - node.height / 2 > core.y)
        assert.ok(node.y + node.height / 2 + 28 < core.y + core.height)
      }
      if (index === 0) {
        assert.equal(active.length, 0)
        continue
      }
      const previous = new Map(plan.steps[index - 1].scene.nodes.map((node) => [node.id, node]))
      const changed = scene.nodes.filter((node) => {
        const old = previous.get(node.id)
        return !old || old.displayValue !== node.displayValue || old.status !== node.status || old.label !== node.label
      })
      const current = scene.nodes.filter((node) => node.tone === 'active')
      if (active.length) {
        const edge = active[0]
        assert.match(edge.message, /^(Instruction|Data|Request|Control): /)
        assert.equal(edge.flow, true)
        assert.equal(scene.focusId, edge.to)
        assert.deepEqual(new Set(current.map((node) => node.id)), new Set([edge.from, edge.to]))
        assert.ok(changed.every((node) => node.id === edge.from || node.id === edge.to))
      } else {
        assert.equal(changed.length, 1, `${choice.kind}: empty or bundled local update`)
        assert.deepEqual(current.map((node) => node.id), [changed[0].id])
      }
    }
  }
  assert.ok(!HardwareOverviewCatalog.choices.some((choice) => choice.kind === 'cpu-core'))
})

test('rename operand arrows retain the captured physical source after a later write renames r1', () => {
  const model = new RegisterRenameModel()
  for (let index = 0; index < 4; index += 1) model.renameNext()
  model.execute('I1')
  model.execute('I2')
  const snapshot = model.snapshot('I2')
  const operands = snapshot.diagram.edges.filter((edge) => edge.highlighted && edge.id.startsWith('operand-'))
  assert.deepEqual(operands.map((edge) => edge.from), ['physical-3'])
  assert.equal(model.renameMap.get('r1'), 5)
  assert.equal(model.physical[4], 8)
  const copy = snapshot.clone()
  copy.diagram.regions[0].label = 'mutated copied core'
  assert.equal(snapshot.diagram.regions[0].label, 'CPU / Core 0')
})

test('both physical operands arrive before the ALU result and register write are shown', () => {
  const model = new RegisterRenameModel()
  for (let index = 0; index < 4; index += 1) model.renameNext()
  for (const id of ['I3', 'I1', 'I2']) model.execute(id)
  const trace = new HardwareTrace()
  trace.record(model.snapshot(), 'Initial', 'I4 waits for its operands.', '', 0)
  model.execute('I4')
  trace.record(model.snapshot('I4'), 'Execute I4', 'Read both physical operands, then write p6.', '')
  const transfers = trace.steps.filter((step) => step.scene.edges.some((edge) => edge.highlighted))
  assert.deepEqual(transfers.map((step) => step.scene.edges.find((edge) => edge.highlighted).id), ['issue', 'operand-5', 'operand-4', 'result', 'complete'])
  const value = (step, id) => step.scene.nodes.find((node) => node.id === id).displayValue
  assert.equal(value(transfers[0], 'alu'), 'I2: 8')
  assert.equal(value(transfers[0], 'physical-6'), 'not ready')
  assert.equal(value(transfers[1], 'alu'), 'I2: 8')
  assert.equal(value(transfers[1], 'physical-6'), 'not ready')
  assert.equal(value(transfers[2], 'alu'), 'I4: 28')
  assert.equal(value(transfers[2], 'physical-6'), 'not ready')
  assert.equal(value(transfers[3], 'physical-6'), '28')
  assert.equal(transfers[1].scene.edges.find((edge) => edge.highlighted).message, 'Data: I4 reads p5 = 20')
})

test('out-of-order flow separates a load request, speculative execution, and architectural commit', () => {
  const model = new OutOfOrderModel()
  const active = (id) => model.snapshot().diagram.edges.find((edge) => edge.id === id).highlighted
  model.requestLoad()
  assert.equal(active('load-request'), true)
  model.execute('I2')
  assert.equal(active('complete'), true)
  assert.equal(active('commit'), false)
  assert.equal(model.architectural.get('r2'), 4)
  assert.equal(model.retireNext(), null)
  assert.equal(active('commit'), false)
  model.execute('I1')
  assert.equal(active('load-response'), true)
  model.retireNext()
  assert.equal(active('commit'), true)
  assert.equal(model.architectural.get('r1'), 10)
})

test('branch training flows to the entry chosen before the history register changes', () => {
  const model = new BranchPredictorModel()
  model.predict('0x100')
  assert.equal(model.snapshot().diagram.edges.find((edge) => edge.id === 'select').to, 'counter-0')
  model.resolve(true)
  assert.equal(model.history, 1)
  const diagram = model.snapshot().diagram
  const training = diagram.edges.find((edge) => edge.id === 'train')
  assert.equal(training.to, 'counter-0')
  assert.equal(training.highlighted, true)
  assert.equal(diagram.edges.find((edge) => edge.id === 'history-update').highlighted, true)
})

test('return-stack underflow cannot produce a predicted-fetch transfer', () => {
  const model = new ReturnStackModel()
  for (let depth = 0; depth < 9; depth += 1) model.call(0x104 + depth * 0x100)
  assert.equal(model.snapshot().diagram.edges.find((edge) => edge.id === 'push').highlighted, true)
  for (let depth = 0; depth < 9; depth += 1) model.returnFromCall()
  const snapshot = model.snapshot()
  assert.equal(snapshot.diagram.edges.find((edge) => edge.id === 'pop').highlighted, false)
  assert.equal(snapshot.diagram.edges.find((edge) => edge.id === 'predict-fetch').highlighted, false)
  assert.equal(snapshot.diagram.edges.find((edge) => edge.id === 'resolve').highlighted, true)
  assert.equal(snapshot.diagram.edges.find((edge) => edge.id === 'validate').highlighted, true)
})

test('return prediction steers fetch before the actual target is resolved', () => {
  const model = new ReturnStackModel()
  model.call(0x104)
  assert.equal(model.predictReturn(), 0x104)
  assert.equal(model.actual, null)
  assert.equal(model.actualReturns.length, 1)
  assert.equal(model.snapshot().diagram.edges.find((edge) => edge.id === 'predict-fetch').highlighted, true)
  assert.equal(model.snapshot().diagram.edges.find((edge) => edge.id === 'resolve').highlighted, false)
  assert.throws(() => model.predictReturn(), /pending/)
  assert.equal(model.resolveReturn(), true)
  assert.equal(model.actual, 0x104)
  assert.equal(model.snapshot().diagram.edges.find((edge) => edge.id === 'resolve').highlighted, true)
  assert.throws(() => model.resolveReturn(), /Predict/)
})

test('renaming preserves an older source when a younger instruction overwrites its architectural name', () => {
  const model = new RegisterRenameModel()
  for (let index = 0; index < 4; index += 1) model.renameNext()
  const youngestR1 = model.renameMap.get('r1')
  assert.throws(() => model.execute('I2'), /dependency/)
  model.execute('I3')
  model.execute('I1')
  model.execute('I2')
  assert.equal(model.physical[youngestR1], 20)
  assert.equal(model.physical[model.renameMap.get('r2')], 8)
  model.execute('I4')
  assert.equal(model.architectural.get('r1'), 3)
  for (let index = 0; index < 4; index += 1) model.retireNext()
  assert.deepEqual([...model.architectural], [['r1', 20], ['r2', 8], ['r3', 28]])
  assert.equal(model.physical[0], null)
  assert.equal(model.physical[3], null)
})

test('retirement changes committed mappings while values stay in the PRF', () => {
  const model = new RegisterRenameModel()
  for (let index = 0; index < 4; index += 1) model.renameNext()
  for (const id of ['I3', 'I1', 'I2', 'I4']) model.execute(id)
  assert.equal(model.renameMap.get('r1'), 5)
  assert.equal(model.committedMap.get('r1'), 0)
  assert.equal(model.architectural.get('r1'), 3)
  model.retireNext()
  assert.equal(model.committedMap.get('r1'), 3)
  assert.equal(model.physical[3], 7)
  assert.equal(model.physical[0], null)
  assert.equal(model.architectural.get('r1'), 7)
  model.retireNext()
  assert.equal(model.physical[3], 7)
  model.retireNext()
  assert.equal(model.committedMap.get('r1'), 5)
  assert.equal(model.physical[5], 20)
  assert.equal(model.physical[3], null)
  const diagram = model.snapshot().diagram
  const commit = diagram.edges.find((edge) => edge.id === 'commit')
  assert.match(commit.message, /Control: commit r1 -> p5/)
  assert.match(commit.message, /stays in the PRF/)
})

test('branch recovery restores the surviving rename map and frees the wrong-path PRF destination', () => {
  const model = new OutOfOrderModel()
  model.execute('I2')
  model.execute('I5')
  assert.equal(model.physical[4], 7)
  assert.equal(model.physical[6], 99)
  assert.equal(model.renameMap.get('r2'), 6)
  assert.equal(model.committedMap.get('r2'), 1)
  assert.equal(model.architectural.get('r2'), 4)
  for (const id of ['I1', 'I3', 'I4']) model.execute(id)
  assert.equal(model.renameMap.get('r2'), 4)
  assert.equal(model.physical[6], null)
  assert.equal(model.physical[4], 7)
  assert.equal(model.architectural.get('r2'), 4)
  assert.equal(model.snapshot().diagram.edges.find((edge) => edge.id === 'squash-register').highlighted, true)
  model.retireNext()
  model.retireNext()
  assert.equal(model.committedMap.get('r2'), 4)
  assert.equal(model.architectural.get('r2'), 7)
  assert.equal(model.physical[1], null)
})

test('CPU category preview expands the package while preserving the existing core geometry', () => {
  const preview = SystemOverviewLayout.create('cpu', null)
  const cpu = preview.layers.find((layer) => layer.id === 'cpu-components')
  const core = cpu.scene.layers.find((layer) => layer.id === 'cpu-core')
  const diagram = CpuCoreLayout.create([], false)
  const withoutColor = (regions) => regions.filter((region) => region.id !== 'core').map(({ color, ...region }) => region)
  assert.deepEqual(withoutColor(core.scene.regions), withoutColor(diagram.regions))
  const boundary = core.scene.regions.find((region) => region.id === 'core')
  const originalBoundary = diagram.regions.find((region) => region.id === 'core')
  assert.deepEqual({ ...boundary, label: originalBoundary.label, shortLabel: undefined }, { ...originalBoundary, shortLabel: undefined })
  assert.equal(boundary.shortLabel, 'Cores (~4 per die)')
  assert.equal(core.scene.layers?.length ?? 0, 0)
  assert.ok(cpu.scene.regions.every((region) => !/^cpu-core-\d+$/.test(region.id)))
  assert.equal(preview.count, CpuLayout.componentCount)
  assert.ok(Math.abs(cpu.scene.width * cpu.scale - 660 * 1080 / 1560) < 0.0001)
  assert.equal(core.scale, 1)
  assert.equal(core.scene.width, CpuCoreLayout.size)
  assert.equal(core.scene.height, CpuCoreLayout.size)
  const regions = new Map(cpu.scene.regions.map((region) => [region.id, region]))
  for (const id of ['cpu-package', 'cpu-die', 'cpu-shared-cache', 'cpu-interconnect', 'cpu-memory-controller', 'cpu-io-controller', 'cpu-clock-power', 'cpu-package-contacts', 'cpu-socket']) assert.ok(regions.has(id))
  assert.equal(CpuLayout.coreCount, 4)
  assert.match(regions.get('cpu-package').shortLabel, /4-core example/)
  for (const region of regions.values()) {
    assert.ok(region.x >= 0 && region.y >= 0)
    assert.ok(region.x + region.width <= cpu.scene.width)
    assert.ok(region.y + region.height <= cpu.scene.height)
    if (!region.parentId) continue
    const parent = regions.get(region.parentId)
    assert.ok(region.x >= parent.x && region.y >= parent.y)
    assert.ok(region.x + region.width <= parent.x + parent.width)
    assert.ok(region.y + region.height <= parent.y + parent.height)
  }
  const die = regions.get('cpu-die')
  assert.ok(core.x >= die.x && core.y >= die.y)
  assert.ok(core.x + core.scene.width <= die.x + die.width)
  assert.ok(core.y + core.scene.height <= die.y + die.height)
  const paths = new Map(cpu.scene.paths.map((path) => [path.id, path]))
  assert.ok(cpu.scene.paths.every((path) => !/^cpu-core-\d+-fabric$/.test(path.id)))
  for (const id of ['cpu-core-fabric', 'cpu-cache-fabric', 'cpu-fabric-memory', 'cpu-fabric-io', 'cpu-memory-contacts', 'cpu-io-contacts', 'cpu-socket-memory', 'cpu-socket-io']) {
    assert.equal(paths.get(id).bidirectional, true)
    assert.equal(paths.get(id).directed, true)
  }
  assert.equal(paths.get('cpu-socket-power-contacts').dashed, true)
  const ids = new Set(diagram.regions.map((region) => region.id))
  for (const id of ['instruction-tlb', 'data-tlb', 'rename-map', 'dispatch-allocation', 'architectural-state', 'l2-cache']) {
    assert.ok(ids.has(`component-${id}`))
  }
  for (const id of ['fetch-decode', 'queue-rename', 'rename-dispatch', 'dispatch-issue', 'issue-register-read', 'issue-execute', 'execute-writeback', 'writeback-retire']) {
    const arrow = core.scene.paths.find((path) => path.id === `pipeline-${id}`)
    assert.equal(arrow.directed, true)
    assert.ok(arrow.label.length > 0)
  }
})

test('focused hardware previews exclude unrelated detailed component layers', () => {
  for (const level of ['cpu', 'hdd', 'ssd', 'ram', 'gpu', 'network-adapter']) {
    const preview = SystemOverviewLayout.create(level, null)
    assert.deepEqual(preview.layers.filter((layer) => layer.id.endsWith('-components')).map((layer) => layer.id), [`${level}-components`])
    const layer = preview.layers.find((candidate) => candidate.id === `${level}-components`)
    const bounds = preview.camera.to
    assert.ok(layer.x >= bounds.x && layer.y >= bounds.y)
    assert.ok(layer.x + layer.scene.width * layer.scale <= bounds.x + bounds.width)
    assert.ok(layer.y + layer.scene.height * layer.scale <= bounds.y + bounds.height)
    assert.deepEqual(SystemOverviewLayout.create('hardware', preview).camera.from, bounds)
  }
})

test('out-of-order completion cannot retire around a blocked head or commit a squashed result', () => {
  const model = new OutOfOrderModel()
  assert.equal(model.execute('I3'), false)
  model.execute('I2')
  model.execute('I5')
  assert.equal(model.retireNext(), null)
  assert.equal(model.architectural.get('r2'), 4)
  for (const id of ['I1', 'I3', 'I4']) assert.equal(model.execute(id), true)
  assert.equal(model.entries[4].state, 'squashed')
  assert.equal(model.entries[4].result, 99)
  assert.equal(model.nextPc, '0x200')
  for (const id of ['I1', 'I2', 'I3', 'I4']) assert.equal(model.retireNext(), id)
  assert.equal(model.retireNext(), null)
  assert.deepEqual([...model.architectural], [['r1', 10], ['r2', 7], ['r3', 11]])
  assert.equal(model.snapshot().diagram.fixtures.find((cell) => cell.id === 'retirement-head').value, 'empty')
})

test('history predictor trains the entry selected before resolution, saturates, and stays bounded', () => {
  const model = new BranchPredictorModel()
  assert.throws(() => model.resolve(true), /No prediction/)
  assert.equal(model.predict('0x100'), false)
  assert.throws(() => model.predict('0x200'), /Resolve/)
  model.resolve(true)
  assert.equal(model.counters[0], 2)
  assert.equal(model.counters[1], 1)
  assert.equal(model.history, 1)
  for (let index = 0; index < 12; index += 1) {
    model.predict('0x100')
    model.resolve(true)
  }
  assert.equal(model.history, 7)
  assert.equal(model.counters[7], 3)
  for (let index = 0; index < 12; index += 1) {
    model.predict('0x200')
    model.resolve(false)
  }
  assert.equal(model.history, 0)
  assert.equal(model.counters[0], 0)
  assert.ok(model.correct <= model.resolved)
  assert.ok(model.counters.every((counter) => counter >= 0 && counter <= 3))
})

test('finite return prediction capacity never destroys actual return addresses', () => {
  const model = new ReturnStackModel()
  for (let depth = 0; depth < 9; depth += 1) model.call(0x104 + depth * 0x100)
  assert.equal(model.predictions.length, 8)
  assert.equal(model.actualReturns.length, 9)
  assert.equal(model.lost, 1)
  for (let depth = 8; depth >= 0; depth -= 1) {
    assert.equal(model.returnFromCall(), depth > 0)
    assert.equal(model.actual, 0x104 + depth * 0x100)
  }
  assert.equal(model.matched, 8)
  assert.equal(model.underflows, 1)
  assert.equal(model.actualReturns.length, 0)
  assert.equal(model.predictions.length, 0)
  assert.throws(() => model.returnFromCall(), /No actual call/)
})
