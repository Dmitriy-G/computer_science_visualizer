import assert from 'node:assert/strict'
import { test } from 'node:test'
import { GpuLayout } from '../src/components/RealSystemsAlgorithms/Hardware/Fundamental/Gpu/GpuLayout.ts'
import { NetworkAdapterLayout } from '../src/components/RealSystemsAlgorithms/Hardware/Fundamental/NetworkAdapter/NetworkAdapterLayout.ts'
import { SystemOverviewLayout } from '../src/components/RealSystemsAlgorithms/SystemOverview/SystemOverviewLayout.ts'
import { BusLayout } from '../src/components/RealSystemsAlgorithms/Hardware/Fundamental/Bus/BusLayout.ts'

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

for (const [level, layout] of [['gpu', GpuLayout], ['network-adapter', NetworkAdapterLayout], ['bus', BusLayout]]) {
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
