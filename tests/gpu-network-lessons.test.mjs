import assert from 'node:assert/strict'
import { test } from 'node:test'
import { HardwareOverviewCatalog } from '../src/components/RealSystemsAlgorithms/Hardware/Fundamental/HardwareOverviewCatalog.ts'
import { HardwareSnapshot } from '../src/components/RealSystemsAlgorithms/Hardware/Fundamental/HardwareSnapshot.ts'
import { GpuLayout } from '../src/components/RealSystemsAlgorithms/Hardware/Fundamental/Gpu/GpuLayout.ts'
import { NetworkAdapterLayout } from '../src/components/RealSystemsAlgorithms/Hardware/Fundamental/NetworkAdapter/NetworkAdapterLayout.ts'
import { FrameRenderingModel } from '../src/components/RealSystemsAlgorithms/Hardware/Fundamental/Gpu/FrameRendering/FrameRenderingModel.ts'
import { HashcatIterationModel } from '../src/components/RealSystemsAlgorithms/Hardware/Fundamental/Gpu/HashcatIteration/HashcatIterationModel.ts'
import { EthernetFrame } from '../src/components/RealSystemsAlgorithms/Hardware/Fundamental/NetworkAdapter/EthernetFrame.ts'
import { ServerToNetworkModel } from '../src/components/RealSystemsAlgorithms/Hardware/Fundamental/NetworkAdapter/ServerToNetwork/ServerToNetworkModel.ts'
import { NetworkToServerModel } from '../src/components/RealSystemsAlgorithms/Hardware/Fundamental/NetworkAdapter/NetworkToServer/NetworkToServerModel.ts'
import { ComponentFlowTrace } from '../src/components/RealSystemsAlgorithms/Hardware/Fundamental/ComponentFlowTrace.ts'
import { SystemOverviewLayout } from '../src/components/RealSystemsAlgorithms/SystemOverview/SystemOverviewLayout.ts'
import { GpuVramModel } from '../src/components/RealSystemsAlgorithms/Hardware/Fundamental/Gpu/GpuVramModel.ts'

test('VRAM reads restore stored bits and writes commit before precharge without changing neighboring buffers', () => {
  const original = new Uint8Array([0, 12])
  const memory = new GpuVramModel([{ id: 'old', label: 'old data', data: original }])
  original[0] = 99
  assert.throws(() => memory.read(), /Activate/)
  memory.activate('old')
  memory.shareCharge()
  assert.equal(memory.capacitorCharge, 0.48)
  assert.equal(memory.bitlineLevel, 0.48)
  assert.equal(memory.sense(), 0)
  memory.restore()
  assert.equal(memory.capacitorCharge, 0)
  const read = memory.read()
  assert.deepEqual([...read.data], [0, 12])
  read.data[0] = 255
  assert.equal(memory.read().data[0], 0)
  memory.precharge()
  memory.activate('new')
  memory.sense()
  memory.restore()
  const written = new Uint8Array([1, 33])
  assert.equal(memory.driveWrite({ id: 'new', label: 'new data', data: written }), 1)
  assert.equal(memory.capacitorBit, 0)
  assert.throws(() => memory.precharge(), /Complete/)
  written[0] = 0
  assert.throws(() => memory.commit(), /bitline/)
  memory.driveBitline()
  memory.commit()
  assert.equal(memory.capacitorBit, 1)
  assert.equal(memory.capacitorCharge, 1)
  memory.precharge()
  memory.activate('new')
  memory.shareCharge()
  assert.equal(memory.capacitorCharge, 0.52)
  assert.equal(memory.sense(), 1)
  memory.restore()
  assert.deepEqual([...memory.read().data], [1, 33])
  memory.precharge()
  memory.activate('old')
  memory.sense()
  memory.restore()
  assert.deepEqual([...memory.read().data], [0, 12])
  memory.precharge()
  assert.equal(memory.wordline, false)
  assert.equal(memory.rowBufferBit, null)
  assert.equal(memory.bitlineLevel, 0.5)
})

test('GPU computation consumes supplied memory bytes', () => {
  const frame = new FrameRenderingModel()
  frame.shadeVertices(frame.vertexData())
  frame.rasterize()
  frame.shadeFragments(new Uint8Array([0, 255, 0, 255]))
  frame.render()
  assert.equal(frame.rendered[0], '#00ff00')
  frame.store()
  const displayed = frame.frameData()
  displayed.set([12, 34, 56], 0)
  frame.present(displayed)
  assert.equal(frame.displayed[0], '#0c2238')
  const hash = new HashcatIterationModel()
  hash.hash(new TextEncoder().encode('abd'))
  hash.compare()
  assert.equal(hash.match, false)
  assert.throws(() => hash.report(1), /VRAM result/)
})

test('one frame is rasterized, stored, and presented in separate stages', () => {
  const model = new FrameRenderingModel()
  assert.throws(() => model.present(), /Complete/)
  model.shadeVertices()
  model.rasterize()
  assert.deepEqual(model.fragments, [0])
  model.shadeFragments()
  model.render()
  assert.deepEqual(model.rendered, ['#ff8000', '#000000', '#000000', '#000000'])
  assert.ok(model.vram.every((pixel) => pixel === '#000000'))
  model.store()
  assert.ok(model.displayed.every((pixel) => pixel === '#000000'))
  model.present()
  assert.deepEqual(model.displayed, model.rendered)
  assert.notEqual(model.displayed, model.vram)
})

test('Hashcat example computes and compares one full known SHA-256 digest', () => {
  const model = new HashcatIterationModel()
  assert.throws(() => model.compare(), /full digest/)
  model.hash()
  assert.equal(model.digest, 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad')
  model.compare()
  assert.equal(model.match, true)
  assert.equal(model.evaluated, 1)
  model.report()
  assert.equal(model.reported, true)
  assert.throws(() => model.hash(), /exactly one/)
})

test('minimal Ethernet TX/RX preserves the payload and rejects corrupt input before DMA', () => {
  assert.equal(EthernetFrame.crc32(new TextEncoder().encode('123456789')), 0xcbf43926)
  const tx = new ServerToNetworkModel()
  assert.equal(tx.serverMemory.length, 60)
  assert.throws(() => tx.complete(), /transmit/)
  tx.stage()
  tx.frameAtMac()
  tx.emit()
  tx.complete()
  assert.equal(tx.network.length, 64)
  const rx = new NetworkToServerModel(tx.network)
  assert.throws(() => rx.complete(), /DMA/)
  rx.validate()
  rx.buffer()
  assert.equal(rx.serverMemory, null)
  rx.writeHost()
  rx.complete()
  assert.deepEqual(rx.serverMemory, tx.serverMemory)
  assert.equal(rx.serverMemory[14], 0x41)
  assert.notEqual(rx.serverMemory, rx.rxBuffer)
  const corrupt = tx.network.slice()
  corrupt[14] ^= 1
  const rejected = new NetworkToServerModel(corrupt)
  assert.throws(() => rejected.validate(), /FCS/)
  assert.equal(rejected.rxBuffer, null)
  assert.equal(rejected.serverMemory, null)
  const wrongDestination = EthernetFrame.body()
  wrongDestination[5] = 99
  assert.throws(() => new NetworkToServerModel(EthernetFrame.encode(wrongDestination)).validate(), /Destination/)
})

test('display signals originate at the Display Engine and avoid the VRAM channel', () => {
  const scene = GpuLayout.create()
  const output = scene.paths.find((path) => path.id === 'gpu-display-output')
  assert.match(output.d, /^M570 1170/)
  assert.ok(!output.d.includes('1880'), 'display output uses a separate route from the memory channel')
  const memory = scene.paths.find((path) => path.id === 'gpu-memory-vram')
  assert.equal(memory.bidirectional, true)
})

for (const [kind, layout] of [
  ['gpu-frame-rendering', GpuLayout], ['gpu-hashcat-iteration', GpuLayout],
  ['nic-server-to-network', NetworkAdapterLayout], ['nic-network-to-server', NetworkAdapterLayout],
]) {
  test(`${kind} preserves the component map and highlights one transfer per event`, () => {
    const plan = HardwareOverviewCatalog.definition(kind).create(new HardwareSnapshot())
    assert.ok(plan.steps.length <= 96)
    const common = layout.create()
    const level = kind.startsWith('gpu-') ? 'gpu' : 'network-adapter'
    const preview = SystemOverviewLayout.still(SystemOverviewLayout.create(level, null))
    const layerId = `${level}-components`
    const original = preview.layers.find((layer) => layer.id === layerId)
    for (const step of plan.steps) {
      const expectedRegions = common.regions.map((region) => region.id.startsWith('gpu-vram')
        ? { ...region, shortLabel: region.shortLabel.replace(/\s*\(~[^)]*\)/g, '') } : region)
      assert.deepEqual(step.scene.regions, expectedRegions)
      assert.equal(step.scene.width, common.width)
      assert.equal(step.scene.height, common.height)
      assert.ok(step.scene.paths.filter((path) => path.highlighted).length <= 1)
      assert.ok(step.scene.activity.length > 0)
      const presented = ComponentFlowTrace.present(step.scene, preview, layerId)
      assert.equal(presented.camera, preview.camera)
      assert.equal(presented.width, preview.width)
      assert.equal(presented.height, preview.height)
      const replaced = presented.layers.find((layer) => layer.id === layerId)
      assert.deepEqual({ ...replaced, scene: null }, { ...original, scene: null })
      assert.equal(replaced.scene, step.scene)
      for (const node of step.scene.nodes) {
        assert.ok(node.x - node.width / 2 >= 0 && node.x + node.width / 2 <= common.width)
        assert.ok(node.y - node.height / 2 >= 0 && node.y + node.height / 2 <= common.height)
      }
    }
    const active = plan.steps.flatMap((step) => step.scene.paths.filter((path) => path.highlighted).map((path) => path.id))
    if (kind.startsWith('gpu-')) {
      assert.deepEqual(HardwareOverviewCatalog.choices.find((choice) => choice.kind === kind).components, ['GPU', 'VRAM'])
      for (const id of ['gpu-memory-vram-command', 'gpu-vram-control-row', 'gpu-vram-wordline', 'gpu-vram-bitline', 'gpu-vram-storage-node', 'gpu-vram-control-column', 'gpu-vram-sense-column', 'gpu-vram-column-io', 'gpu-memory-vram']) assert.ok(active.includes(id), `missing memory interaction ${id}`)
      const capacitorValues = new Set(plan.steps.map((step) => step.scene.nodes.find((node) => node.id === 'gpu-vram-capacitor-state').displayValue))
      assert.ok(capacitorValues.has('0 / low') && capacitorValues.has('1 / high') && capacitorValues.has('shared charge'))
      const shared = plan.steps.find((step) => step.scene.nodes.some((node) => node.id === 'gpu-vram-capacitor-state' && node.displayValue === 'shared charge'))
      const charge = shared.scene.paths.find((path) => path.id === 'gpu-vram-charge-level')
      const sharedHeight = Number(charge.d.match(/v-([\d.]+)/)[1])
      assert.ok(sharedHeight > 0 && sharedHeight < 32)
      assert.equal(charge.fill, '#b5d8eb')
      assert.ok(plan.steps.some((step) => step.scene.paths.some((path) => path.id === 'gpu-vram-charge-level' && path.d.includes('v-32h-130Z'))))
      assert.ok(plan.steps.some((step) => step.scene.paths.some((path) => path.id === 'gpu-vram-charge-level' && path.d.includes('v-0h-130Z'))))
      assert.equal(plan.steps.at(-1).scene.nodes.find((node) => node.id === 'gpu-vram-transistor-state').displayValue, 'OFF')
      assert.equal(plan.steps.at(-1).scene.nodes.find((node) => node.id === 'gpu-vram-sense-state').displayValue, 'precharged')
      assert.ok(!active.includes('gpu-vram-control-refresh'), 'access restoration is distinct from scheduled refresh')
    }
    if (kind === 'gpu-frame-rendering') {
      assert.ok(active.indexOf('gpu-vertex-raster') < active.indexOf('gpu-raster-shader'))
      assert.equal(active.at(-1), 'gpu-display-output')
    } else if (kind === 'gpu-hashcat-iteration') {
      for (const id of ['gpu-display-output', 'gpu-shader-output', 'gpu-raster-shader', 'gpu-ray-work', 'gpu-matrix-work', 'gpu-texture-requests']) assert.ok(!active.includes(id))
    } else {
      const order = kind === 'nic-server-to-network'
        ? ['nic-host-link', 'nic-host-dma', 'nic-dma-tx', 'nic-tx-mac', 'nic-mac-phy-tx', 'nic-phy-medium-tx']
        : ['nic-medium-phy-rx', 'nic-phy-mac-rx', 'nic-mac-rx', 'nic-rx-dma', 'nic-host-dma', 'nic-host-link']
      let previous = -1
      for (const id of order) {
        const index = active.indexOf(id, previous + 1)
        assert.ok(index > previous, `missing ordered payload hop ${id}`)
        previous = index
      }
      const forbidden = kind === 'nic-server-to-network' ? ['nic-mac-rx', 'nic-rx-dma'] : ['nic-dma-tx', 'nic-tx-mac']
      for (const id of forbidden) assert.ok(!active.includes(id))
    }
  })
}
