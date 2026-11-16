import assert from 'node:assert/strict'
import { test } from 'node:test'
import { SsdPageModel } from '../src/components/RealSystemsAlgorithms/Hardware/Fundamental/Ssd/SsdPageModel.ts'
import { SsdLayout } from '../src/components/RealSystemsAlgorithms/Hardware/Fundamental/Ssd/SsdLayout.ts'
import { SsdAlgorithmCatalog } from '../src/components/RealSystemsAlgorithms/Hardware/Fundamental/Ssd/SsdAlgorithmCatalog.ts'
import { HardwareSnapshot } from '../src/components/RealSystemsAlgorithms/Hardware/Fundamental/HardwareSnapshot.ts'
import { SystemOverviewLayout } from '../src/components/RealSystemsAlgorithms/SystemOverview/SystemOverviewLayout.ts'
import { ComponentFlowTrace } from '../src/components/RealSystemsAlgorithms/Hardware/Fundamental/ComponentFlowTrace.ts'
import { HardwareBlockSizes } from '../src/visualization/HardwareBlockSizes.ts'

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
  assert.equal(y, terminal.y)
  assert.ok(x + path.translateX >= terminal.x && x + path.translateX <= terminal.x + terminal.width)
})

function routePoints(path) {
  const tokens = path.d.match(/[MHV]|-?\d+(?:\.\d+)?/g)
  const points = []
  let x = 0
  let y = 0
  for (let index = 0; index < tokens.length;) {
    const command = tokens[index++]
    if (command === 'M') {
      x = Number(tokens[index++])
      y = Number(tokens[index++])
    } else if (command === 'H') x = Number(tokens[index++])
    else if (command === 'V') y = Number(tokens[index++])
    else assert.fail('SSD connection must be orthogonal')
    points.push({ x: x + (path.translateX ?? 0), y })
  }
  return points
}

test('SSD uses standard leaf sizes, one power input, and aligned peripheral blocks', () => {
  const diagram = SsdLayout.diagram()
  const regions = new Map(diagram.regions.map((region) => [region.id, region]))
  assert.ok(!regions.has('ssd-motherboard'))
  assert.ok(!regions.has('ssd-plp'))
  assert.ok(!regions.has('ssd-power-management'))
  assert.deepEqual(diagram.paths.filter((path) => /power/.test(path.id)).map((path) => path.id), ['ssd-external-power'])
  const parents = new Set(diagram.regions.map((region) => region.parentId))
  const sizes = [HardwareBlockSizes.common, HardwareBlockSizes.small, HardwareBlockSizes.wide, HardwareBlockSizes.tall]
  for (const region of regions.values()) {
    if (parents.has(region.id)) continue
    assert.ok(sizes.some((size) => size.width === region.width && size.height === region.height), region.id)
  }
  const wear = regions.get('ssd-wear-leveling')
  const ecc = regions.get('ssd-ecc')
  assert.equal(wear.x + wear.width / 2, ecc.x + ecc.width / 2)
  const row = regions.get('ssd-nand-row-decoder')
  const buffer = regions.get('ssd-nand-page-buffer')
  assert.deepEqual([row.width, row.height], [HardwareBlockSizes.wide.width, HardwareBlockSizes.wide.height])
  assert.deepEqual([buffer.width, buffer.height], [row.width, row.height])
  assert.equal(row.y, buffer.y)
  assert.equal(buffer.x - row.x - row.width, 60)
  const input = regions.get('ssd-power-input')
  const end = routePoints(diagram.paths.find((path) => path.id === 'ssd-external-power')).at(-1)
  assert.equal(end.x, input.x)
  assert.ok(end.y > input.y && end.y < input.y + input.height)
})

test('SSD NAND bus enters die I/O directly without vertical detours or duplicate static arrows', () => {
  const diagram = SsdLayout.diagram()
  const io = diagram.regions.find((region) => region.id === 'ssd-nand-io')
  const paths = new Map(diagram.paths.map((path) => [path.id, path]))
  const ids = ['ssd-channel-0', 'ssd-channel-0-shared-bus', 'ssd-channel-0-package-0', 'ssd-nand-die-io']
  const segments = ids.map((id) => routePoints(paths.get(id)))
  for (const id of ids) {
    const path = paths.get(id)
    assert.match(path.d, /^M\d+ \d+H\d+$/)
    assert.equal(path.arrowheads, false)
    for (const point of routePoints(path)) assert.equal(point.y, io.y + io.height / 2)
  }
  assert.deepEqual(segments[0].at(-1), segments[1].at(-1))
  assert.deepEqual(segments[1][0], segments[2][0])
  assert.deepEqual(segments[2].at(-1), segments[3][0])
  assert.equal(segments[3].at(-1).x, io.x)
})

test('SSD signal routes remain attached to their named source and destination blocks', () => {
  const diagram = SsdLayout.diagram()
  const regions = new Map(diagram.regions.map((region) => [region.id, region]))
  const paths = new Map(diagram.paths.map((path) => [path.id, path]))
  const touches = (point, id) => {
    const region = regions.get(id)
    return ((point.x === region.x || point.x === region.x + region.width) && point.y >= region.y && point.y <= region.y + region.height)
      || ((point.y === region.y || point.y === region.y + region.height) && point.x >= region.x && point.x <= region.x + region.width)
  }
  for (const [id, from, to] of [
    ['ssd-data-interface', 'ssd-data', 'ssd-host-interface'],
    ['ssd-interface-dma', 'ssd-host-interface', 'ssd-dma'],
    ['ssd-buffer-encode', 'ssd-dma', 'ssd-ecc-encode'],
    ['ssd-encode-nand', 'ssd-ecc-encode', 'ssd-nand-controllers'],
    ['ssd-nand-decode', 'ssd-nand-controllers', 'ssd-ecc-decode'],
    ['ssd-decode-buffer', 'ssd-ecc-decode', 'ssd-dma'],
    ['ssd-controller-dram', 'ssd-dma', 'ssd-dram'],
    ['ssd-host-ftl', 'ssd-host-interface', 'ssd-ftl'],
    ['ssd-firmware-load', 'ssd-firmware-nvm', 'ssd-sram'],
    ['ssd-cpu-sram', 'ssd-cpu', 'ssd-sram'],
    ['ssd-cpu-ftl', 'ssd-cpu', 'ssd-ftl'],
    ['ssd-cpu-nand', 'ssd-cpu', 'ssd-nand-controllers'],
    ['ssd-sram-ftl', 'ssd-sram', 'ssd-ftl'],
    ['ssd-ftl-gc', 'ssd-ftl', 'ssd-garbage-collection'],
    ['ssd-ftl-wear', 'ssd-ftl', 'ssd-wear-leveling'],
    ['ssd-ftl-dma', 'ssd-ftl', 'ssd-dma'],
    ['ssd-ftl-nand', 'ssd-ftl', 'ssd-nand-controllers'],
    ['ssd-nand-command', 'ssd-nand-control', 'ssd-nand-row-decoder'],
    ['ssd-nand-bias', 'ssd-nand-voltage', 'ssd-nand-row-decoder'],
    ['ssd-nand-wordline', 'ssd-nand-row-decoder', 'ssd-nand-gate'],
    ['ssd-nand-bitline', 'ssd-nand-conduction', 'ssd-nand-page-buffer'],
    ['ssd-nand-buffer-io', 'ssd-nand-page-buffer', 'ssd-nand-io'],
    ['ssd-nand-io-control', 'ssd-nand-io', 'ssd-nand-control'],
    ['ssd-nand-sequencer', 'ssd-nand-control', 'ssd-nand-voltage'],
    ['ssd-nand-source-line', 'ssd-nand-conduction', 'ssd-nand-source-terminal'],
  ]) {
    const points = routePoints(paths.get(id))
    assert.ok(touches(points[0], from), `${id} starts at ${from}`)
    assert.ok(touches(points.at(-1), to), `${id} ends at ${to}`)
  }
})
