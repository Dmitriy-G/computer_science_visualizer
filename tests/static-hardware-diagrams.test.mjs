import assert from 'node:assert/strict'
import { test } from 'node:test'
import { GpuLayout } from '../src/components/RealSystemsAlgorithms/Hardware/Fundamental/Gpu/GpuLayout.ts'
import { NetworkAdapterLayout } from '../src/components/RealSystemsAlgorithms/Hardware/Fundamental/NetworkAdapter/NetworkAdapterLayout.ts'
import { SystemOverviewLayout } from '../src/components/RealSystemsAlgorithms/SystemOverview/SystemOverviewLayout.ts'
import { BusLayout } from '../src/components/RealSystemsAlgorithms/Hardware/Fundamental/Bus/BusLayout.ts'
import { CpuLayout } from '../src/components/RealSystemsAlgorithms/Hardware/Fundamental/Cpu/CpuLayout.ts'
import { RamLayout } from '../src/components/RealSystemsAlgorithms/Hardware/Fundamental/Ram/RamLayout.ts'
import { HardwareDiagram } from '../src/visualization/HardwareDiagram.ts'
import { HardwareDiagramFrame } from '../src/visualization/HardwareDiagramFrame.ts'

test('hardware margins move paths, captions, and state together without changing source geometry', () => {
  const original = new HardwareDiagram(200, 100)
    .region('part', 'Part', 'device', 10, 10, 80, 60)
    .fixture('state', '', 'idle', 50, 50)
  original.paths.push({ id: 'line', d: 'M10 50H90', label: 'Link', highlighted: false, caption: { text: 'Link', x: 20, y: 40 } })
  const before = original.clone()
  const framed = HardwareDiagramFrame.create(original, 100, 50)
  assert.deepEqual(original, before)
  assert.equal(framed.width, 350)
  assert.equal(framed.regions[0].x, 110)
  assert.equal(framed.positions[0].x, 150)
  assert.equal(framed.paths[0].d, original.paths[0].d)
  assert.equal(framed.paths[0].translateX, 100)
  assert.equal(framed.paths[0].caption.x, 120)
})

for (const [layout, prefix, keys] of [
  [CpuLayout, 'cpu', ['memory', 'pcie', 'chipset', 'clock', 'reset', 'power']],
  [RamLayout, 'ram', ['host', 'dma', 'sideband', 'power']],
  [GpuLayout, 'gpu', ['host', 'display', 'power']],
  [NetworkAdapterLayout, 'nic', ['host', 'network', 'power']],
]) {
  test(`${prefix} external interfaces have labeled tails and distinct power direction`, () => {
    const scene = layout.create()
    const paths = new Map(scene.paths.map((path) => [path.id, path]))
    for (const key of keys) {
      const path = paths.get(`${prefix}-external-${key}`)
      assert.ok(path.caption.text.length > 0)
      assert.ok(path.caption.x >= 0 && path.caption.x < scene.width)
      assert.equal(path.directed, true)
      assert.equal(path.highlighted, false)
    }
    const power = paths.get(`${prefix}-external-power`)
    assert.equal(power.dashed, true)
    assert.ok(!power.bidirectional)
    assert.ok(scene.paths.some((path) => path.translateX === layout.externalLeft), 'internal wires share the component offset')
    if (prefix === 'gpu' || prefix === 'nic') assert.equal(paths.get(`${prefix}-external-host`).caption.text, 'PCIe / DMA')
    if (prefix === 'cpu') {
      assert.ok(!paths.has('cpu-external-io'), 'PCIe and chipset link no longer share an ambiguous external line')
      assert.ok(!paths.has('cpu-external-dma'), 'DMA is not a separate physical channel')
      assert.notEqual(paths.get('cpu-external-pcie').d, paths.get('cpu-external-chipset').d)
      for (const key of ['clock', 'reset']) {
        assert.ok(!paths.get(`cpu-external-${key}`).bidirectional, `${key} is shown as an input`)
        assert.equal(paths.get(`cpu-external-${key}`).dashed, true)
      }
      const regions = new Map(scene.regions.map((region) => [region.id, region]))
      for (const key of ['memory-controller', 'io-controller']) assert.equal(regions.get(`cpu-${key}`).parentId, 'cpu-die')
      assert.equal(regions.get('cpu-socket-clock-reset').parentId, 'cpu-socket')
      assert.match(regions.get('cpu-socket').label, /controllers are inside the CPU die/)
    }
    if (prefix === 'ram') {
      const root = scene.regions.find((region) => region.id === 'ram-pcie-root')
      assert.equal(root.parentId, undefined, 'PCIe host context is outside the RAM module')
      assert.equal(paths.get('ram-external-dma').caption.text, 'PCIe / DMA')
      assert.match(paths.get('ram-dma-memory-controller').label, /controller.*DDR/)
      assert.equal(paths.get('ram-dma-memory-controller').bidirectional, true)
    }
  })
}

test('bus map connects six separate endpoints and keeps adaptation optional', () => {
  const scene = BusLayout.create()
  const regions = new Map(scene.regions.map((region) => [region.id, region]))
  const paths = new Map(scene.paths.map((path) => [path.id, path]))
  const endpoints = [
    ['cpu', 'CPU'], ['gpu', 'GPU'], ['ram', 'RAM'],
    ['hdd', 'HDD'], ['ssd', 'SSD'], ['network-adapter', 'Network Adapter'],
  ]
  assert.equal(scene.regions.filter((region) => region.role === 'device' && !region.parentId).length, endpoints.length)
  for (const [key, name] of endpoints) {
    const device = regions.get(`bus-${key}-device`)
    assert.equal(device.shortLabel, name)
    assert.equal(device.parentId, undefined)
    assert.equal(regions.get(`bus-${key}-port`).parentId, 'bus-fabric')
    assert.equal(paths.get(`bus-${key}-external-link`).bidirectional, true)
    assert.equal(paths.get(`bus-${key}-port-data`).bidirectional, true)
    const fabricPath = paths.get(key === 'cpu' || key === 'gpu' ? `bus-${key}-queues` : `bus-switch-${key}`)
    assert.equal(fabricPath.bidirectional, true)
    assert.ok(!fabricPath.dashed, `${name} has a payload connection`)
  }
  assert.match(regions.get('bus-bridge').shortLabel, /optional/i)
  assert.ok(paths.has('bus-switch-network-adapter'), 'direct adapter path is available')
  assert.ok(paths.has('bus-switch-bridge') && paths.has('bus-bridge-target'), 'adapted route is an alternative')
  assert.match(regions.get('bus-routing').label, /memory-mapped.*address decoding.*destination IDs/)
  assert.match(regions.get('bus-arbiter').label, /multiple requesters.*compete for a shared resource/)
})

for (const [level, layout] of [['cpu', CpuLayout], ['ram', RamLayout], ['gpu', GpuLayout], ['network-adapter', NetworkAdapterLayout], ['bus', BusLayout]]) {
  test(`${level} static map keeps components inside their logical boundaries`, () => {
    const scene = layout.create()
    const regions = new Map(scene.regions.map((region) => [region.id, region]))
    assert.equal(regions.size, scene.regions.length)
    assert.equal(new Set(scene.paths.map((path) => path.id)).size, scene.paths.length)
    for (const region of regions.values()) {
      const parent = region.parentId ? regions.get(region.parentId) : { x: 0, y: 0, width: scene.width, height: scene.height }
      assert.ok(parent, `${region.id} has a parent`)
      assert.ok(region.x >= parent.x && region.y >= parent.y, `${region.id} starts inside its parent`)
      assert.ok(region.x + region.width <= parent.x + parent.width, `${region.id} fits horizontally`)
      assert.ok(region.y + region.height <= parent.y + parent.height, `${region.id} fits vertically`)
    }
    const preview = SystemOverviewLayout.create(level, SystemOverviewLayout.create('hardware', null))
    const layer = preview.layers.find((candidate) => candidate.id === `${level}-components`)
    assert.deepEqual(layer.scene, scene)
    assert.equal(preview.countLabel, scene.countLabel)
    assert.ok(preview.camera.to.width <= layer.reveal.endWidth, 'focused map is fully revealed')
    const other = level === 'gpu' ? 'network-adapter' : 'gpu'
    const next = SystemOverviewLayout.create(other, preview)
    assert.deepEqual(next.camera.from, preview.camera.to)
    assert.deepEqual(next.layers.filter((candidate) => candidate.id.endsWith('-components')).map((candidate) => candidate.id), [`${other}-components`])
  })
}
