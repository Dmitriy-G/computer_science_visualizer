import assert from 'node:assert/strict'
import { test } from 'node:test'
import { CpuModel } from '../src/components/RealSystemsAlgorithms/Hardware/Fundamental/CPU/CpuModel.ts'
import { CpuAlgorithmCatalog } from '../src/components/RealSystemsAlgorithms/Hardware/Fundamental/CPU/CpuAlgorithmCatalog.ts'
import { RegisterRenameModel } from '../src/components/RealSystemsAlgorithms/Hardware/Fundamental/CPU/RegisterRenaming/RegisterRenameModel.ts'
import { OutOfOrderModel } from '../src/components/RealSystemsAlgorithms/Hardware/Fundamental/CPU/OutOfOrder/OutOfOrderModel.ts'
import { BranchPredictorModel } from '../src/components/RealSystemsAlgorithms/Hardware/Fundamental/CPU/BranchPrediction/BranchPredictorModel.ts'
import { ReturnStackModel } from '../src/components/RealSystemsAlgorithms/Hardware/Fundamental/CPU/ReturnStack/ReturnStackModel.ts'

test('four hardware lessons have deterministic independent snapshots and leave their source unchanged', () => {
  assert.equal(CpuAlgorithmCatalog.choices.length, 4)
  for (const choice of CpuAlgorithmCatalog.choices) {
    const source = new CpuModel()
    const before = source.clone()
    const definition = CpuAlgorithmCatalog.definition(choice.kind)
    const plan = definition.create(source, 0)
    assert.deepEqual(source, before)
    assert.deepEqual(plan, definition.create(source, 0))
    assert.ok(plan.steps.length > 2 && plan.steps.length <= 96)
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
    }
    const firstValue = plan.steps[0].scene.nodes[0].displayValue
    plan.steps.at(-1).scene.nodes[0].displayValue = 'changed final snapshot'
    assert.equal(plan.steps[0].scene.nodes[0].displayValue, firstValue)
    assert.ok(CpuAlgorithmCatalog.describe(choice.kind).realWorldUsage.technologies.length > 0)
  }
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
