import { HardwareDiagram } from '../../../../../visualization/HardwareDiagram.ts'
import { HardwareDiagramFrame } from '../../../../../visualization/HardwareDiagramFrame.ts'
import { HardwareSceneLayout } from '../../../../../visualization/HardwareSceneLayout.ts'
import { HardwareBlockSizes } from '../../../../../visualization/HardwareBlockSizes.ts'
import type { Scene } from '../../../../../visualization/Scene.ts'
import { SsdNandLayout } from './SsdNandLayout.ts'

export class SsdLayout {
  public static readonly externalLeft = 300
  private static readonly mapWidth = 3740
  public static readonly width = this.mapWidth + this.externalLeft
  public static readonly height = 2280
  public static readonly componentCount = 7

  public static create(): Scene {
    const diagram = this.diagram()
    const scene = HardwareSceneLayout.create({ diagram, banks: [], focusId: null, events: 0 }, 'hardware-component')
    return {
      ...scene, kind: 'system-overview',
      count: this.componentCount, countLabel: 'SSD component groups', focusId: null,
    }
  }

  public static diagram(height: number = this.height): HardwareDiagram {
    const diagram = new HardwareDiagram(this.mapWidth, height)
    const small = HardwareBlockSizes.small
    const wide = HardwareBlockSizes.wide
    diagram.region('ssd-pcb', 'SSD / logical component map', 'device', 20, 20, this.mapWidth - 40, this.height - 40, 'system')
      .region('ssd-connectors', 'Host connector', 'device', 40, 180, 260, 540, 'component', 'ssd-pcb')
      .region('ssd-data', 'Data link', 'interconnect', 60, 260, small.width, small.height, 'component', 'ssd-connectors')
      .region('ssd-power-input', 'Power / drive DC input and internal power management are grouped; detailed distribution and optional backup capacitors are omitted', 'device', 60, 520, small.width, small.height, 'component', 'ssd-connectors', 'Power')
      .region('ssd-host-interface', 'Host interface / PCIe (NVMe protocol) or SATA, depending on the SSD. PCIe is the interconnect; NVMe is the storage command/queue protocol carried over it in this locally attached example', 'interconnect', 340, 260, small.width, small.height, 'component', 'ssd-pcb', 'Host interface')
      .region('ssd-dram', 'Optional DRAM / mapping and data buffers; DRAM-less SSDs use other memory arrangements', 'observer', 660, 1540, wide.width, wide.height, 'component', 'ssd-pcb', 'DRAM / mapping and buffers (optional)')
    diagram.region('ssd-firmware-nvm', 'Persistent firmware backing / nonvolatile ROM or flash. This is a logical source for boot/runtime code, not an extra mandatory NAND package. Controller ROM and firmware images held in NAND or other flash are implementation choices; runtime code can be loaded into SRAM. Firmware storage and boot policy vary by SSD', 'observer', 660, 1770, wide.width, wide.height, 'component', 'ssd-pcb', 'Persistent firmware / ROM or flash (NVM)')
    this.addController(diagram)
    SsdNandLayout.add(diagram)
    this.connectData(diagram)
    this.connectControl(diagram)
    const framed = HardwareDiagramFrame.create(diagram, this.externalLeft, 0)
    framed.paths.push(
      { id: 'ssd-external-host', d: 'M360 330H20', label: 'Motherboard host connection / alternative SSD attachments: PCIe (NVMe protocol) or SATA. PCIe is the interconnect; NVMe is the storage protocol, not a separate physical link. Commands, payloads, and completions share the selected interface. Host-memory transfers reach system RAM through the platform memory/I/O system; this is not a direct DIMM or GPU connection. Only one host attachment is used by a given drive in this map', highlighted: false, directed: true, bidirectional: true, caption: { text: 'PCIe / NVMe\nor SATA\nHost link', x: 20, y: 362 } },
      { id: 'ssd-external-power', d: 'M20 590H360', label: 'DC supply and ground through the drive power contacts / motherboard supply for an M.2 example, or a PSU drive-power connector for a SATA example. Exact form factor and supply arrangement vary; AC mains does not enter the SSD', highlighted: false, directed: true, stroke: '#b58a45', caption: { text: 'Motherboard / PSU DC', x: 20, y: 622 } },
    )
    return framed
  }

  private static addController(diagram: HardwareDiagram): void {
    const small = HardwareBlockSizes.small
    const common = HardwareBlockSizes.common
    const wide = HardwareBlockSizes.wide
    diagram.region('ssd-controller', 'SSD controller / hardware and firmware', 'device', 620, 100, 1100, 1340, 'component', 'ssd-pcb', 'SSD controller')
      .region('ssd-cpu', 'Internal CPU cores / firmware execution; core count varies by controller', 'device', 660, 180, small.width, small.height, 'component', 'ssd-controller', 'CPU cores / firmware')
      .region('ssd-sram', 'Internal SRAM / volatile runtime firmware code, working state, and temporary metadata. SRAM loses its contents without power; the persistent firmware image must reside in nonvolatile memory, such as ROM or flash. The backing source is shown separately as logical context', 'memory', 1020, 180, wide.width, wide.height, 'component', 'ssd-controller', 'SRAM / runtime firmware / temporary metadata')
      .region('ssd-ftl', 'FTL / logical-to-physical mapping; host sectors may occupy part of a NAND page', 'device', 660, 420, 960, 260, 'component', 'ssd-controller', 'FTL / LBA mapping')
      .region('ssd-physical-address', 'LBA to physical NAND location / channel, target selection, die, plane, block, page, and offset as needed; exact representation varies', 'memory', 840, 510, wide.width, wide.height, 'component', 'ssd-ftl', 'LBA → NAND address')
      .region('ssd-garbage-collection', 'Garbage collection / firmware policy', 'device', 700, 780, small.width, small.height, 'component', 'ssd-controller', 'Garbage collection')
      .region('ssd-wear-leveling', 'Wear leveling / firmware policy', 'device', 1060, 780, small.width, small.height, 'component', 'ssd-controller', 'Wear leveling')
      .region('ssd-dma', 'DMA engines and data buffers / transfer payloads between the host interface, ECC engines, and NAND channel controllers', 'interconnect', 660, 1040, common.width, common.height, 'component', 'ssd-controller', 'DMA / data buffers')
      .region('ssd-ecc', 'ECC engines / logical write and read stages; implementation and placement vary', 'device', 1020, 980, 300, 420, 'component', 'ssd-controller', 'ECC engines')
      .region('ssd-ecc-encode', 'ECC encoding / generate redundancy before NAND page programming', 'device', 1060, 1040, small.width, small.height, 'component', 'ssd-ecc', 'ECC encode / write')
      .region('ssd-ecc-decode', 'ECC decoding and error correction / after NAND reading, before returning corrected data; uncorrectable errors are reported', 'device', 1060, 1240, small.width, small.height, 'component', 'ssd-ecc', 'ECC decode / correct')
      .region('ssd-nand-controllers', 'NAND flash channel controllers / one logical controller per channel in the two-channel example; implementation may share circuitry', 'device', 1380, 980, 300, 420, 'component', 'ssd-controller', 'NAND controllers (~1 per channel)')
      .region('ssd-nand-command-io', 'Read and program page commands, block erase commands, status, and NAND bus timing', 'interconnect', 1420, 1140, small.width, small.height, 'component', 'ssd-nand-controllers', 'Command / timing / data I/O')
  }

  private static connectData(diagram: HardwareDiagram): void {
    const dataPaths: readonly [string, string, string, boolean][] = [
      ['ssd-data-interface', 'M280 330H340', 'Host data link / commands, payloads, and completion', true],
      ['ssd-interface-dma', 'M560 330H600V1160H660', 'Host interface to DMA and data buffers / bidirectional payload transfer', true],
      ['ssd-buffer-encode', 'M960 1110H1060', 'Program data / DMA buffer to ECC encoding', false],
      ['ssd-encode-nand', 'M1280 1110H1380', 'Encoded data with ECC redundancy / to NAND controllers before page programming', false],
      ['ssd-nand-decode', 'M1380 1310H1280', 'NAND readback / NAND controllers to ECC decoding and correction', false],
      ['ssd-decode-buffer', 'M1060 1310H980V1220H960', 'Corrected read data / to DMA buffer before host delivery; report an error if correction fails', false],
      ['ssd-controller-dram', 'M810 1280V1540', 'Optional DRAM interface / mapping and data buffers; not mandatory in the host-to-NAND path', true],
      ['ssd-channel-0', 'M1680 1210H1720', 'Representative NAND channel / one of two independent channels in the modeled SSD', true],
      ['ssd-channel-0-package-0', 'M1780 1210H1820', 'Representative package on the shared channel / one of two packages per channel; target selection serializes bus transfers', true],
    ]
    for (const [id, d, label, bidirectional] of dataPaths) {
      diagram.paths.push({ id, d, label, highlighted: false, directed: true, bidirectional, strokeWidth: 2, arrowheads: id.startsWith('ssd-channel-0') ? false : undefined })
    }
    diagram.paths.push({ id: 'ssd-channel-0-shared-bus', d: 'M1780 1210H1720', label: 'Representative shared NAND channel / one bus transfer at a time; other packages and channels are counted instead of drawn', highlighted: false, strokeWidth: 2, arrowheads: false })
  }

  private static connectControl(diagram: HardwareDiagram): void {
    const controlPaths: readonly [string, string, string, boolean][] = [
      ['ssd-host-ftl', 'M450 400V550H660', 'Host LBA command to firmware / FTL address translation', false],
      ['ssd-firmware-load', 'M1260 1835H1700V245H1620', 'Boot/runtime code loading from nonvolatile firmware backing to SRAM / logical relationship; not a claim of a separate physical firmware chip or exact boot wiring', false],
      ['ssd-cpu-sram', 'M880 245H1020', 'CPU access to volatile SRAM / runtime firmware code, working state, and temporary metadata; persistent firmware resides in ROM or flash', true],
      ['ssd-cpu-ftl', 'M770 320V420', 'CPU firmware executes FTL mapping and request scheduling', false],
      ['ssd-cpu-nand', 'M700 320V380H640V960H1530V980', 'Firmware physical NAND commands / page and cell primitives do not require an LBA lookup', false],
      ['ssd-sram-ftl', 'M1320 310V420', 'FTL access to mapping metadata in internal SRAM', true],
      ['ssd-ftl-gc', 'M810 680V780', 'FTL and garbage collection / relocate valid pages and update mappings before block erase', true],
      ['ssd-ftl-wear', 'M1170 680V780', 'FTL and wear leveling / choose physical destinations using wear metadata', true],
      ['ssd-ftl-dma', 'M1620 620H1660V940H810V1040', 'FTL request scheduling controls DMA and data buffers', false],
      ['ssd-ftl-nand', 'M1620 550H1690V1080H1680', 'Physical NAND address, read/program/erase commands, and operation status / block erase does not traverse ECC payload stages', true],
    ]
    for (const [id, d, label, bidirectional] of controlPaths) {
      diagram.paths.push({ id, d, label, highlighted: false, directed: true, bidirectional, strokeWidth: 2 })
    }
  }
}
