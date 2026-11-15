import assert from 'node:assert/strict'
import { test } from 'node:test'
import { SsdPageModel } from '../src/components/RealSystemsAlgorithms/Hardware/Fundamental/Ssd/SsdPageModel.ts'
import { SsdLayout } from '../src/components/RealSystemsAlgorithms/Hardware/Fundamental/Ssd/SsdLayout.ts'
import { SsdAlgorithmCatalog } from '../src/components/RealSystemsAlgorithms/Hardware/Fundamental/Ssd/SsdAlgorithmCatalog.ts'
import { HardwareSnapshot } from '../src/components/RealSystemsAlgorithms/Hardware/Fundamental/HardwareSnapshot.ts'
import { SystemOverviewLayout } from '../src/components/RealSystemsAlgorithms/SystemOverview/SystemOverviewLayout.ts'
import { ComponentFlowTrace } from '../src/components/RealSystemsAlgorithms/Hardware/Fundamental/ComponentFlowTrace.ts'

test('a complete page is programmed before mapping publication, with independent buffers and neighboring data', () => {
  const memory = new SsdPageModel('write')
  const neighbor = memory.page(1)
  const source = SsdPageModel.payload()
  const expected = source.slice()
  assert.throws(() => memory.receive(source.subarray(0, 512)), /complete NAND data page/)
  assert.equal(memory.phase, 'idle')
  memory.receive(source)
  source.fill(0)
  assert.throws(() => memory.publishMapping(), /Invalid NAND/)
  assert.equal(memory.mappingPublished, false)
  memory.encode()
  memory.latchProgramData()
  assert.equal(memory.storedBit, 1)
  memory.program()
  assert.equal(memory.storedBit, 0)
  assert.deepEqual(memory.page(0), expected)
  assert.equal(memory.mappingPublished, false)
  assert.throws(() => memory.publishMapping(), /Invalid NAND/)
  memory.verify()
  memory.publishMapping()
  assert.equal(memory.mappingPublished, true)
  assert.deepEqual(memory.page(1), neighbor)
  const detached = memory.page(0)
  detached.fill(0)
  assert.deepEqual(memory.page(0), expected)
  assert.throws(() => memory.program(), /Invalid NAND/)
})

test('page read requires sensing and ECC staging before delivery and never changes persistent data', () => {
  const memory = new SsdPageModel('read')
  const stored = memory.page(0)
  const neighbor = memory.page(1)
  assert.equal(memory.returnedData(), null)
  assert.throws(() => memory.deliver(), /Invalid NAND/)
  memory.sense()
  assert.equal(memory.returnedData(), null)
  assert.throws(() => memory.deliver(), /Invalid NAND/)
  memory.decode()
  memory.deliver()
  assert.deepEqual(memory.returnedData(), SsdPageModel.payload())
  assert.deepEqual(memory.page(0), stored)
  assert.deepEqual(memory.page(1), neighbor)
  const detached = memory.returnedData()
  detached.fill(0)
  assert.deepEqual(memory.returnedData(), stored)
})

test('SSD page lessons retain the map and camera, one transfer per step, and independent snapshots', () => {
  const common = SsdLayout.create()
  const preview = SystemOverviewLayout.create('ssd', null)
  for (const choice of SsdAlgorithmCatalog.choices) {
    const definition = SsdAlgorithmCatalog.definition(choice.kind)
    const source = new HardwareSnapshot()
    const before = source.clone()
    const plan = definition.create(source)
    assert.deepEqual(source, before)
    assert.deepEqual(plan, definition.create(source))
    assert.ok(plan.steps.length > 10 && plan.steps.length <= 96)
    assert.equal(plan.steps[0].phase, 0)
    assert.equal(plan.steps.at(-1).phase, 2)
    for (const step of plan.steps) {
      assert.equal(step.scene.width, common.width)
      assert.equal(step.scene.height, common.height)
      assert.ok(step.scene.paths.filter((path) => path.highlighted).length <= 1)
      for (const region of common.regions) {
        const current = step.scene.regions.find((candidate) => candidate.id === region.id)
        for (const field of ['x', 'y', 'width', 'height', 'parentId']) assert.equal(current[field], region[field])
      }
      const presented = ComponentFlowTrace.present(step.scene, preview, 'ssd-components')
      assert.equal(presented.camera, preview.camera)
      assert.equal(presented.layers.find((layer) => layer.id === 'ssd-components').scene, step.scene)
      assert.ok(!step.scene.paths.some((path) => path.highlighted && /erase/i.test(path.id)))
    }
    const first = structuredClone(plan.steps[0].scene)
    plan.result.diagram.fixtures[0].value = 'changed result'
    assert.deepEqual(plan.steps[0].scene, first)
    if (choice.kind === 'ssd-write-page') {
      assert.match(first.nodes.find((node) => node.id === 'ssd-nand-charge-state').displayValue, /bit 1/)
      assert.match(plan.steps.at(-1).scene.nodes.find((node) => node.id === 'ssd-nand-charge-state').displayValue, /bit 0/)
    } else {
      for (const step of plan.steps) {
        assert.match(step.scene.nodes.find((node) => node.id === 'ssd-nand-charge-state').displayValue, /bit 0/)
        assert.ok(!step.scene.paths.some((path) => path.id === 'ssd-nand-tunneling' && path.highlighted))
      }
    }
  }
})

test('the SSD source return ends on the named source terminal', () => {
  const diagram = SsdLayout.diagram()
  const terminal = diagram.regions.find((region) => region.id === 'ssd-nand-source-terminal')
  const path = diagram.paths.find((candidate) => candidate.id === 'ssd-nand-source-line')
  const tokens = path.d.match(/[MHV]|-?\d+(?:\.\d+)?/g)
  let x = 0
  let y = 0
  for (let index = 0; index < tokens.length;) {
    const command = tokens[index++]
    if (command === 'M') {
      x = Number(tokens[index++])
      y = Number(tokens[index++])
    }
    else if (command === 'H') x = Number(tokens[index++])
    else if (command === 'V') y = Number(tokens[index++])
    else assert.fail('Source return must use supported orthogonal routing')
  }
  assert.equal(x + path.translateX, terminal.x)
  assert.ok(y >= terminal.y && y <= terminal.y + terminal.height)
})
