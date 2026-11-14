import assert from 'node:assert/strict'
import { test } from 'node:test'
import { ServerHardwareLayout } from '../src/components/RealSystemsAlgorithms/SystemOverview/ServerHardwareLayout.ts'
import { SystemOverviewLayout } from '../src/components/RealSystemsAlgorithms/SystemOverview/SystemOverviewLayout.ts'

test('server overview distinguishes chassis hardware, motherboard assemblies, and firmware', () => {
  const scene = ServerHardwareLayout.create()
  const regions = new Map(scene.regions.map((region) => [region.id, region]))
  assert.equal(regions.size, scene.regions.length)
  for (const id of ['motherboard', 'gpu', 'network-adapter', 'raid-hba', 'psu', 'hdd', 'ssd']) assert.equal(regions.get(id).parentId, 'server-chassis')
  for (const id of ['cpu', 'ram', 'bus', 'chipset-pch', 'bmc', 'firmware-flash', 'host-usb-ports', 'management-lan-port']) assert.equal(regions.get(id).parentId, 'motherboard')
  assert.equal(regions.get('bios-uefi').parentId, 'firmware-flash')
  assert.ok(!regions.has('usb-management-ports'), 'USB and management Ethernet have independent blocks')
  for (const id of ['ssd-nvme', 'ssd-sata-sas']) assert.equal(regions.get(id).parentId, 'ssd')
  assert.equal(regions.get('bus').shortLabel, 'PCIe / I/O Interconnect')
  for (const region of regions.values()) {
    const parent = region.parentId ? regions.get(region.parentId) : { x: 0, y: 0, width: scene.width, height: scene.height }
    assert.ok(region.x >= parent.x && region.y >= parent.y, `${region.id} starts inside its parent`)
    assert.ok(region.x + region.width <= parent.x + parent.width, `${region.id} fits horizontally`)
    assert.ok(region.y + region.height <= parent.y + parent.height, `${region.id} fits vertically`)
    for (const other of regions.values()) {
      if (region.id === other.id || region.parentId !== other.parentId) continue
      assert.ok(region.x + region.width <= other.x || other.x + other.width <= region.x || region.y + region.height <= other.y || other.y + other.height <= region.y, `${region.id} and ${other.id} do not overlap`)
    }
  }
  assert.match(regions.get('raid-hba').shortLabel, /optional/)
  assert.match(regions.get('bmc').label, /IPMI is a management interface\/protocol/)
})

test('server overview separates memory, storage, management, and power paths', () => {
  const paths = new Map(ServerHardwareLayout.create().paths.map((path) => [path.id, path]))
  assert.ok(paths.has('cpu-ram'))
  assert.ok(!paths.has('ram-bus'), 'RAM is directly attached to the CPU memory controller')
  for (const id of ['raid-hdd', 'raid-ssd', 'nvme-ssd', 'gpu-bus', 'pch-usb', 'bmc-management-lan', 'pch-firmware']) {
    assert.equal(paths.get(id).bidirectional, true)
    assert.ok(!paths.get(id).dashed)
  }
  for (const id of ['psu-motherboard', 'psu-bmc-standby', 'psu-hdd', 'psu-ssd']) {
    assert.equal(paths.get(id).dashed, true)
    assert.equal(paths.get(id).directed, true)
    assert.match(paths.get(id).label, /[Pp]ower/)
  }
  assert.equal(paths.get('pch-bmc').dashed, true)
  assert.equal(paths.get('cpu-ram').caption.text, 'DDR')
  assert.match(paths.get('raid-ssd').label, /SATA\/SAS example only/)
  assert.match(paths.get('nvme-ssd').label, /direct PCIe.*bypassing/)
  assert.match(paths.get('bmc-management-lan').label, /dedicated management NIC\/PHY/)
})

test('component detail zooms stay inside the redesigned server slots', () => {
  const overview = SystemOverviewLayout.create('hardware', null)
  const hardware = overview.layers.find((layer) => layer.id === 'hardware')
  assert.deepEqual(hardware.scene, ServerHardwareLayout.create())
  assert.equal(overview.count, 15)
  assert.ok(overview.camera.to.width <= hardware.reveal.endWidth, 'the widened overview is fully revealed')
  assert.ok(hardware.x + hardware.scene.width * hardware.scale <= overview.camera.to.x + overview.camera.to.width, 'external cable labels fit in the hardware camera')
  assert.ok(!overview.layers.some((layer) => layer.id === 'cpu-summary'), 'CPU has one summary block inside the motherboard')
  for (const [key, bounds] of Object.entries(ServerHardwareLayout.components)) {
    const focused = SystemOverviewLayout.create(key, overview)
    const layer = focused.layers.find((candidate) => candidate.id === `${key}-components`)
    const left = hardware.x + bounds.x * hardware.scale
    const top = hardware.y + bounds.y * hardware.scale
    assert.ok(layer.x >= left - 0.0001 && layer.y >= top - 0.0001)
    assert.ok(layer.x + layer.scene.width * layer.scale <= left + bounds.width * hardware.scale + 0.0001)
    assert.ok(layer.y + layer.scene.height * layer.scale <= top + bounds.height * hardware.scale + 0.0001)
    assert.deepEqual(focused.camera.from, overview.camera.to)
  }
})

test('external cables cross the chassis boundary with readable port labels', () => {
  const scene = ServerHardwareLayout.create()
  const paths = new Map(scene.paths.map((path) => [path.id, path]))
  assert.ok(scene.width > ServerHardwareLayout.chassis.width)
  for (const id of ['external-display', 'external-lan', 'external-usb', 'external-management-lan', 'external-ac-power']) {
    const path = paths.get(id)
    assert.ok(path.caption.text.length > 0)
    assert.ok(path.caption.x > ServerHardwareLayout.chassis.width)
    assert.ok(path.caption.x < scene.width)
    assert.equal(path.directed, true)
  }
  for (const id of ['external-lan', 'external-usb', 'external-management-lan']) assert.equal(paths.get(id).bidirectional, true)
  assert.equal(paths.get('external-display').bidirectional, false)
  assert.equal(paths.get('external-ac-power').dashed, true)
  assert.notEqual(paths.get('external-lan').d, paths.get('external-management-lan').d)
})
