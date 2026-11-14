import assert from 'node:assert/strict'
import { test } from 'node:test'
import { NetworkByteToSsdAnimation } from '../src/components/RealSystemsAlgorithms/Hardware/Fundamental/Bus/NetworkByteToSsd/NetworkByteToSsdAnimation.ts'
import { HardwareSnapshot } from '../src/components/RealSystemsAlgorithms/Hardware/Fundamental/HardwareSnapshot.ts'
import { BusLayout } from '../src/components/RealSystemsAlgorithms/Hardware/Fundamental/Bus/BusLayout.ts'
import { NetworkByteToSsdModel } from '../src/components/RealSystemsAlgorithms/Hardware/Fundamental/Bus/NetworkByteToSsd/NetworkByteToSsdModel.ts'
import { ComponentFlowTrace } from '../src/components/RealSystemsAlgorithms/Hardware/Fundamental/ComponentFlowTrace.ts'
import { SystemOverviewLayout } from '../src/components/RealSystemsAlgorithms/SystemOverview/SystemOverviewLayout.ts'
import { MenuSearchIndex } from '../src/components/MainMenu/Search/MenuSearchIndex.ts'

test('SAVE preserves neighboring storage bytes and gates CPU success on durable completion', () => {
  const model = new NetworkByteToSsdModel()
  assert.equal(model.network.length, 64)
  assert.throws(() => model.dmaReceive(), /Validate/)
  assert.throws(() => model.readMessage(), /completion/)
  model.receive()
  model.dmaReceive()
  assert.equal(model.ramReceive.length, 60)
  model.completeReceive()
  model.readMessage()
  assert.deepEqual([...model.cpuMessage], [1, 7, 0x41])
  model.prepareWrite()
  assert.equal(model.ramBlock[7], 0x41)
  assert.deepEqual(model.storedBlock, model.originalBlock, 'RAM preparation has not persisted anything')
  assert.throws(() => model.dmaReadBlock(), /command/)
  model.fetchCommand()
  model.dmaReadBlock()
  model.ramBlock[8] = 0xff
  assert.equal(model.ssdBuffer[8], 0x2e, 'SSD owns a snapshot of the DMA data')
  assert.throws(() => model.completeWrite(), /nonvolatile/)
  assert.throws(() => model.acknowledge(), /completion/)
  model.commitFua()
  for (let index = 0; index < model.storedBlock.length; index += 1) {
    assert.equal(model.storedBlock[index], index === 7 ? 0x41 : 0x2e)
  }
  assert.equal(model.acknowledged, false)
  model.completeWrite()
  model.acknowledge()
  assert.equal(model.acknowledged, true)
})

test('bad Ethernet FCS prevents receive DMA and storage preparation', () => {
  const corrupted = new NetworkByteToSsdModel().network.slice()
  corrupted[16] ^= 1
  const model = new NetworkByteToSsdModel(corrupted)
  assert.throws(() => model.receive(), /FCS/)
  assert.throws(() => model.dmaReceive(), /Validate/)
  assert.throws(() => model.prepareWrite(), /SAVE/)
  assert.deepEqual(model.storedBlock, model.originalBlock)
})

test('bus overview preserves the map and camera with one directed transfer per event', () => {
  const source = new HardwareSnapshot()
  const before = source.clone()
  const definition = new NetworkByteToSsdAnimation()
  const plan = definition.create(source)
  assert.deepEqual(source, before)
  assert.deepEqual(plan, definition.create(source))
  assert.ok(plan.steps.length > 1 && plan.steps.length <= 96)
  const common = BusLayout.create()
  const preview = SystemOverviewLayout.still(SystemOverviewLayout.create('bus', null))
  const active = []
  for (const step of plan.steps) {
    assert.deepEqual(step.scene.regions, common.regions)
    assert.equal(step.scene.width, common.width)
    assert.equal(step.scene.height, common.height)
    const paths = step.scene.paths.filter((path) => path.highlighted)
    assert.ok(paths.length <= 1)
    for (const path of paths) {
      assert.equal(path.directed, true)
      assert.equal(path.bidirectional, false)
      active.push(path.id)
    }
    for (const node of step.scene.nodes) {
      assert.ok(node.x - node.width / 2 >= 0 && node.x + node.width / 2 <= common.width)
      assert.ok(node.y - node.height / 2 >= 0 && node.y + node.height / 2 <= common.height)
    }
    const presented = ComponentFlowTrace.present(step.scene, preview, 'bus-components')
    assert.equal(presented.camera, preview.camera)
    assert.equal(presented.layers.find((layer) => layer.id === 'bus-components').scene, step.scene)
  }
  for (const key of ['network-adapter', 'ram', 'ssd']) assert.ok(active.includes(`bus-${key}-external-link`))
  assert.ok(active.includes('bus-cpu-external-link'))
  for (const id of ['bus-gpu-external-link', 'bus-switch-hdd']) assert.ok(!active.includes(id))
  const persisted = plan.steps.findIndex((step) => step.title === 'Persist updated block')
  const completed = plan.steps.findIndex((step) => step.title === 'Deliver SSD completion')
  assert.ok(persisted > 0 && completed > persisted)
  const value = (step, key) => step.scene.nodes.find((node) => node.id === `bus-${key}-device-state`).displayValue
  assert.equal(value(plan.steps.at(-1), 'ssd'), '0x41 durable')
  assert.equal(value(plan.steps.at(-1), 'cpu'), 'saved 0x41')
  assert.equal(value(plan.steps[0], 'ssd'), '[7] = 0x2E')
  const result = new MenuSearchIndex(() => null).find('algorithms', 'Network byte to SSD')
    .find((candidate) => candidate.componentAlgorithm === 'bus-network-byte-to-ssd')
  assert.equal(result, undefined, 'removed motherboard overview is absent from search')
})

test('motherboard lesson separates CPU DDR accesses from PCIe device DMA', () => {
  const plan = new NetworkByteToSsdAnimation().create(new HardwareSnapshot())
  const active = (title) => plan.steps.filter((step) => step.title === title)
    .flatMap((step) => step.scene.paths.filter((path) => path.highlighted).map((path) => path.id))
  const memoryWrite = active('Store SSD submission')
  assert.deepEqual(memoryWrite, ['bus-cpu-external-link', 'bus-ram-port-data', 'bus-ram-external-link'])
  const memoryRead = active('Deliver message to CPU')
  assert.deepEqual(memoryRead, ['bus-ram-external-link', 'bus-ram-port-data', 'bus-cpu-external-link'])
  assert.deepEqual(active('Deliver receive data'), [
    'bus-ram-port-data', 'bus-ram-external-link',
  ])
  for (const title of ['Deliver SSD doorbell', 'Deliver SSD write data']) {
    assert.deepEqual(active(title), ['bus-ssd-direct', 'bus-ssd-external-link'])
  }
  assert.deepEqual(active('DMA received body'), ['bus-network-adapter-external-link', 'bus-network-adapter-direct'])
})
