import assert from 'node:assert/strict'
import { test } from 'node:test'
import { SceneRegionInteraction } from '../src/visualization/SceneRegionInteraction.ts'
import { NetworkAdapterLayout } from '../src/components/RealSystemsAlgorithms/Hardware/Fundamental/NetworkAdapter/NetworkAdapterLayout.ts'

test('network adapter blocks expose independent targets and identify every wire endpoint', () => {
  const scene = NetworkAdapterLayout.create()
  const regions = new Map(scene.regions.map((region) => [region.id, region]))
  for (const region of regions.values()) assert.equal(region.interactive, true, region.id)
  for (const path of scene.paths) {
    assert.ok(path.fromRegionId || path.toRegionId, path.id + ' has an interaction endpoint')
    for (const id of [path.fromRegionId, path.toRegionId]) {
      if (id !== undefined) assert.ok(regions.has(id), path.id + ' references an existing block')
    }
  }
})

test('a child highlights its own input and output arrows without selecting its parent', () => {
  const scene = NetworkAdapterLayout.create()
  assert.deepEqual([...SceneRegionInteraction.boundaryPaths(scene, 'nic-tx-buffer')].sort(), ['nic-dma-tx', 'nic-tx-mac'])
  assert.deepEqual([...SceneRegionInteraction.boundaryPaths(scene, 'nic-rx-buffer')].sort(), ['nic-mac-rx', 'nic-rx-dma'])
})

test('parents include descendant IO while excluding every internal arrow', () => {
  const scene = NetworkAdapterLayout.create()
  const before = structuredClone(scene)
  assert.deepEqual([...SceneRegionInteraction.boundaryPaths(scene, 'nic-buffers')].sort(), [
    'nic-buffer-offload', 'nic-dma-tx', 'nic-mac-rx', 'nic-rx-dma', 'nic-tx-mac',
  ])
  assert.deepEqual([...SceneRegionInteraction.boundaryPaths(scene, 'nic-controller')].sort(), [
    'nic-control-phy', 'nic-host-link', 'nic-mac-phy-tx', 'nic-phy-mac-rx',
  ])
  assert.deepEqual([...SceneRegionInteraction.boundaryPaths(scene, 'nic-board')].sort(), [
    'nic-external-host', 'nic-external-network', 'nic-external-power',
  ])
  assert.deepEqual(scene, before, 'hover selection preserves the committed scene')
})

test('cleared or unavailable elements do not highlight arrows', () => {
  const scene = NetworkAdapterLayout.create()
  assert.equal(SceneRegionInteraction.boundaryPaths(scene, null).size, 0)
  assert.equal(SceneRegionInteraction.boundaryPaths(scene, 'unavailable-block').size, 0)
})
