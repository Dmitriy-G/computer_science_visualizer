import assert from 'node:assert/strict'
import { test } from 'node:test'
import { GpuLayout } from '../src/components/RealSystemsAlgorithms/Hardware/Fundamental/Gpu/GpuLayout.ts'
import { NetworkAdapterLayout } from '../src/components/RealSystemsAlgorithms/Hardware/Fundamental/NetworkAdapter/NetworkAdapterLayout.ts'
import { SystemOverviewLayout } from '../src/components/RealSystemsAlgorithms/SystemOverview/SystemOverviewLayout.ts'

for (const [level, layout] of [['gpu', GpuLayout], ['network-adapter', NetworkAdapterLayout]]) {
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
