import assert from 'node:assert/strict'
import { test } from 'node:test'
import { BusLayout } from '../src/components/RealSystemsAlgorithms/Hardware/Fundamental/Bus/BusLayout.ts'
import { HardwareElementCatalog } from '../src/visualization/HardwareElementCatalog.ts'
import { SceneRegionInteraction } from '../src/visualization/SceneRegionInteraction.ts'

const socketSources = new Map([
  ['bus-cpu-port', 'cpu-socket'],
  ['bus-ram-port', 'dimm-sockets'],
  ['bus-gpu-port', 'gpu-slot'],
  ['bus-network-adapter-port', 'nic-slot'],
  ['bus-ssd-port', 'nvme-connector'],
  ['bus-hdd-port', 'sata-ports'],
  ['bus-usb-port', 'host-usb-ports'],
])

test('detailed motherboard sockets reuse the complete main server popup information', () => {
  const scene = BusLayout.create()
  for (const [id, source] of socketSources) {
    const socket = scene.regions.find((region) => region.id === id)
    assert.equal(socket.interactive, true, id)
    const information = HardwareElementCatalog.get(id)
    assert.equal(information, HardwareElementCatalog.get(source), `${id}: same text and images`)
    assert.equal(information.photos.length, id === 'bus-usb-port' ? 2 : 1, id)
    for (const child of scene.regions.filter((region) => region.parentId === id)) {
      assert.ok(!child.interactive, `${child.id}: no independent popup`)
      assert.ok(!child.navigationTarget, child.id)
      assert.equal(HardwareElementCatalog.get(child.id), null, child.id)
    }
  }
})

test('motherboard components use their supplied photos and external devices retain navigation', () => {
  const scene = BusLayout.create()
  const photos = new Map([
    ['bus-fabric', '/hardware/motherboard/pcb-traces.jpg'],
    ['bus-clock-reset', '/hardware/motherboard/clock-generator-annotated.png'],
    ['bus-reset-circuit', '/hardware/motherboard/reset-annotated.png'],
    ['bus-power', '/hardware/motherboard/dc-input-regulation-annotated.png'],
    ['bus-pch', '/hardware/motherboard/pch-annotated.png'],
    ['bus-rtc', '/hardware/motherboard/rtc-battery.jpg'],
    ['bus-flash', '/hardware/motherboard/spi-flash-annotated.png'],
  ])
  const textOnly = new Set([
    'bus-motherboard', 'bus-power-rails', 'bus-power-connectors', 'bus-vrm',
  ])
  for (const region of scene.regions) {
    const expected = socketSources.has(region.id) || photos.has(region.id) || textOnly.has(region.id)
    assert.equal(!!region.interactive, expected, region.id)
    if (region.navigationTarget) assert.ok(!region.interactive, `${region.id}: device navigation`)
    if (!region.interactive) continue
    const information = HardwareElementCatalog.get(region.id)
    assert.ok(information, region.id)
    if (photos.has(region.id)) {
      assert.equal(information.photos.length, 1, region.id)
      assert.equal(information.photos[0].src, photos.get(region.id), region.id)
    } else if (!socketSources.has(region.id)) assert.deepEqual(information.photos, [], region.id)
    for (const field of ['overview', 'problem', 'characteristicNote']) assert.ok(information[field].trim(), `${region.id}: ${field}`)
    assert.ok(information.characteristics.length >= 2, region.id)
    assert.ok(information.documentation.length > 0, region.id)
  }
  assert.equal(HardwareElementCatalog.get('unknown-motherboard-component'), null)
  assert.equal(HardwareElementCatalog.get(null), null)
})

test('motherboard socket highlighting includes its contacts without changing the scene', () => {
  const scene = BusLayout.create()
  const before = structuredClone(scene)
  const regions = new Set(scene.regions.map((region) => region.id))
  for (const path of scene.paths) {
    assert.ok(regions.has(path.fromRegionId), `${path.id}: source`)
    assert.ok(regions.has(path.toRegionId), `${path.id}: destination`)
  }
  assert.deepEqual([...SceneRegionInteraction.boundaryPaths(scene, 'bus-ram-port')].sort(), [
    'bus-power-dimm', 'bus-ram-external-link', 'bus-ram-port-data',
  ])
  assert.deepEqual([...SceneRegionInteraction.boundaryPaths(scene, 'bus-ssd-port')].sort(), [
    'bus-power-m2', 'bus-ssd-clock', 'bus-ssd-direct', 'bus-ssd-external-link', 'bus-ssd-reset',
  ])
  assert.deepEqual(scene, before)
})

test('HDD receives separate PSU power rather than power through its SATA data port', () => {
  const scene = BusLayout.create()
  const power = scene.paths.find((path) => path.id === 'bus-power-hdd')
  assert.equal(power.fromRegionId, 'bus-dc-source')
  assert.equal(power.toRegionId, 'bus-hdd-device')
  assert.equal(power.stroke, '#b58a45')
  assert.equal(power.directed, true)
  assert.equal(power.bidirectional, false)
  assert.ok(!SceneRegionInteraction.boundaryPaths(scene, 'bus-hdd-port').has(power.id))
  assert.deepEqual([...SceneRegionInteraction.boundaryPaths(scene, 'bus-hdd-port')].sort(), [
    'bus-hdd-external-link', 'bus-switch-hdd',
  ])
})
