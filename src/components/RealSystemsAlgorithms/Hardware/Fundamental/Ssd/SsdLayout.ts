import { HardwareDiagram } from '../../../../../visualization/HardwareDiagram.ts'
import { HardwareDiagramFrame } from '../../../../../visualization/HardwareDiagramFrame.ts'
import { HardwareSceneLayout } from '../../../../../visualization/HardwareSceneLayout.ts'
import type { Scene } from '../../../../../visualization/Scene.ts'
import { SsdNandLayout } from './SsdNandLayout.ts'

export class SsdLayout {
  public static readonly externalLeft = 650
  private static readonly mapWidth = 3660
  public static readonly width = this.mapWidth + this.externalLeft
  public static readonly height = 2100
  public static readonly componentCount = 8

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
    diagram.region('ssd-pcb', 'SSD / logical component map', 'device', 20, 20, this.mapWidth - 40, this.height - 40, 'system')
      .region('ssd-connectors', 'Host connector', 'device', 60, 150, 220, 540, 'component', 'ssd-pcb')
      .region('ssd-data', 'Data link', 'interconnect', 80, 240, 180, 130, 'component', 'ssd-connectors')
      .region('ssd-power-input', 'Power', 'device', 80, 500, 180, 130, 'component', 'ssd-connectors')
      .region('ssd-host-interface', 'Host interface / PCIe (NVMe protocol) or SATA, depending on the SSD. PCIe is the interconnect; NVMe is the storage command/queue protocol carried over it in this locally attached example', 'interconnect', 340, 240, 240, 130, 'component', 'ssd-pcb', 'Host interface')
      .region('ssd-dram', 'Optional DRAM / mapping and data buffers; DRAM-less SSDs use other memory arrangements', 'observer', 660, 1230, 1000, 140, 'component', 'ssd-pcb', 'DRAM / mapping and buffers (optional)')
      .region('ssd-power-management', 'Power management', 'device', 340, 1470, 380, 140, 'component', 'ssd-pcb')
      .region('ssd-plp', 'Optional power-loss protection capacitors / protection coverage depends on the SSD', 'observer', 900, 1470, 520, 140, 'component', 'ssd-pcb', 'PLP caps (optional)')
    diagram.region('ssd-firmware-nvm', 'Persistent firmware backing / nonvolatile ROM or flash. This is a logical source for boot/runtime code, not an extra mandatory NAND package. Controller ROM and firmware images held in NAND or other flash are implementation choices; runtime code can be loaded into SRAM. Firmware storage and boot policy vary by SSD', 'observer', 660, 1680, 1000, 140, 'component', 'ssd-pcb', 'Persistent firmware / ROM or flash (NVM)')
    this.addController(diagram)
    SsdNandLayout.add(diagram)
    this.connectData(diagram)
    this.connectControl(diagram)
    this.connectPower(diagram)
    const framed = HardwareDiagramFrame.create(diagram, this.externalLeft, 0)
    HardwareDiagramFrame.addMotherboardNavigation(framed, 'ssd', 175, 660)
    framed.paths.push(
      { id: 'ssd-external-host', d: 'M730 305H280', label: 'Motherboard host connection / alternative SSD attachments: PCIe (NVMe protocol) or SATA. PCIe is the interconnect; NVMe is the storage protocol, not a separate physical link. Commands, payloads, and completions share the selected interface. Host-memory transfers reach system RAM through the platform memory/I/O system; this is not a direct DIMM or GPU connection. Only one host attachment is used by a given drive in this map', highlighted: false, directed: true, bidirectional: true, caption: { text: 'PCIe (NVMe protocol)\nor SATA\nMotherboard host link', x: 300, y: 337 } },
      { id: 'ssd-external-power', d: 'M280 565H730', label: 'DC supply and ground through the drive power contacts / motherboard supply for an M.2 example, or a PSU drive-power connector for a SATA example. Exact form factor and supply arrangement vary; AC mains does not enter the SSD', highlighted: false, directed: true, dashed: true, stroke: '#b58a45', caption: { text: 'Motherboard / PSU DC', x: 300, y: 597 } },
    )
    return framed
  }

  private static addController(diagram: HardwareDiagram): void {
    diagram.region('ssd-controller', 'SSD controller / hardware and firmware', 'device', 620, 100, 1080, 1050, 'component', 'ssd-pcb', 'SSD controller')
      .region('ssd-cpu', 'Internal CPU cores / firmware execution; core count varies by controller', 'device', 660, 180, 320, 120, 'component', 'ssd-controller', 'CPU cores / firmware')
      .region('ssd-sram', 'Internal SRAM / volatile runtime firmware code, working state, and temporary metadata. SRAM loses its contents without power; the persistent firmware image must reside in nonvolatile memory, such as ROM or flash. The backing source is shown separately as logical context', 'memory', 1040, 180, 600, 120, 'component', 'ssd-controller', 'SRAM / runtime firmware / temporary metadata')
      .region('ssd-ftl', 'FTL / logical-to-physical mapping; host sectors may occupy part of a NAND page', 'device', 660, 370, 980, 180, 'component', 'ssd-controller', 'FTL / LBA mapping')
      .region('ssd-physical-address', 'LBA to physical NAND location / channel, target selection, die, plane, block, page, and offset as needed; exact representation varies', 'memory', 690, 440, 920, 80, 'component', 'ssd-ftl', 'LBA → channel / target / die / plane / block / page')
      .region('ssd-garbage-collection', 'Garbage collection / firmware policy', 'device', 660, 610, 300, 120, 'component', 'ssd-controller', 'Garbage collection')
      .region('ssd-wear-leveling', 'Wear leveling / firmware policy', 'device', 1000, 610, 300, 120, 'component', 'ssd-controller', 'Wear leveling')
      .region('ssd-dma', 'DMA engines and data buffers / transfer payloads between the host interface, ECC engines, and NAND channel controllers', 'interconnect', 660, 820, 300, 290, 'component', 'ssd-controller', 'DMA / data buffers')
      .region('ssd-ecc', 'ECC engines / logical write and read stages; implementation and placement vary', 'device', 980, 760, 340, 390, 'component', 'ssd-controller', 'ECC engines')
      .region('ssd-ecc-encode', 'ECC encoding / generate redundancy before NAND page programming', 'device', 1000, 820, 300, 110, 'component', 'ssd-ecc', 'ECC encode / write')
      .region('ssd-ecc-decode', 'ECC decoding and error correction / after NAND reading, before returning corrected data; uncorrectable errors are reported', 'device', 1000, 1000, 300, 110, 'component', 'ssd-ecc', 'ECC decode / correct')
      .region('ssd-nand-controllers', 'NAND flash channel controllers / one logical controller per channel in the two-channel example; implementation may share circuitry', 'device', 1360, 760, 300, 390, 'component', 'ssd-controller', 'NAND controllers (~1 per channel)')
      .region('ssd-nand-command-io', 'Read and program page commands, block erase commands, status, and NAND bus timing', 'interconnect', 1380, 940, 260, 160, 'component', 'ssd-nand-controllers', 'Command / timing / data I/O')
  }

  private static connectData(diagram: HardwareDiagram): void {
    const dataPaths: readonly [string, string, string, boolean][] = [
      ['ssd-data-interface', 'M260 305H340', 'Host data link / commands, payloads, and completion', true],
      ['ssd-interface-dma', 'M580 305H600V960H660', 'Host interface to DMA and data buffers / bidirectional payload transfer', true],
      ['ssd-buffer-encode', 'M960 875H1000', 'Program data / DMA buffer to ECC encoding', false],
      ['ssd-encode-nand', 'M1300 875H1360', 'Encoded data with ECC redundancy / to NAND controllers before page programming', false],
      ['ssd-nand-decode', 'M1360 1055H1300', 'NAND readback / NAND controllers to ECC decoding and correction', false],
      ['ssd-decode-buffer', 'M1000 1055H960', 'Corrected read data / to DMA buffer before host delivery; report an error if correction fails', false],
      ['ssd-controller-dram', 'M810 1110V1230', 'Optional DRAM interface / mapping and data buffers; not mandatory in the host-to-NAND path', true],
      ['ssd-channel-0', 'M1660 890H1740', 'Representative NAND channel / one of two independent channels in the modeled SSD', true],
      ['ssd-channel-0-package-0', 'M1740 360H1820', 'Representative package on the shared channel / one of two packages per channel; target selection serializes bus transfers', true],
    ]
    for (const [id, d, label, bidirectional] of dataPaths) {
      diagram.paths.push({ id, d, label, highlighted: false, directed: true, bidirectional, strokeWidth: 2 })
    }
    diagram.paths.push({ id: 'ssd-channel-0-shared-bus', d: 'M1740 360V890', label: 'Representative shared NAND channel / one bus transfer at a time; other packages and channels are counted instead of drawn', highlighted: false, strokeWidth: 2 })
  }

  private static connectControl(diagram: HardwareDiagram): void {
    const controlPaths: readonly [string, string, string, boolean][] = [
      ['ssd-host-ftl', 'M460 240V130H610V450H660', 'Host LBA command to firmware / FTL address translation', false],
      ['ssd-firmware-load', 'M1660 1750H1700V160H1340V180', 'Boot/runtime code loading from nonvolatile firmware backing to SRAM / logical relationship; not a claim of a separate physical firmware chip or exact boot wiring', false],
      ['ssd-cpu-sram', 'M980 240H1040', 'CPU access to volatile SRAM / runtime firmware code, working state, and temporary metadata; persistent firmware resides in ROM or flash', true],
      ['ssd-cpu-ftl', 'M820 300V370', 'CPU firmware executes FTL mapping and request scheduling', false],
      ['ssd-cpu-nand', 'M700 300V330H630V750H1510V760', 'Firmware physical NAND commands / page and cell primitives do not require an LBA lookup', false],
      ['ssd-sram-ftl', 'M1340 300V370', 'FTL access to mapping metadata in internal SRAM', true],
      ['ssd-ftl-gc', 'M810 550V610', 'FTL and garbage collection / relocate valid pages and update mappings before block erase', true],
      ['ssd-ftl-wear', 'M1150 550V610', 'FTL and wear leveling / choose physical destinations using wear metadata', true],
      ['ssd-ftl-dma', 'M810 550V580H650V800H800V820', 'FTL request scheduling controls DMA and data buffers', false],
      ['ssd-ftl-nand', 'M1640 460H1680V800H1660', 'Physical NAND address, read/program/erase commands, and operation status / block erase does not traverse ECC payload stages', true],
    ]
    for (const [id, d, label, bidirectional] of controlPaths) {
      diagram.paths.push({ id, d, label, highlighted: false, directed: true, bidirectional, strokeWidth: 2 })
    }
  }

  private static connectPower(diagram: HardwareDiagram): void {
    const powerPaths: readonly [string, string, string][] = [
      ['ssd-input-power', 'M170 630V1540H340', 'Power input to voltage regulation and power management'],
      ['ssd-power-rails', 'M530 1470V1440H1720V1880H3620', 'Regulated power distribution / logical rails, not exact board routing'],
      ['ssd-interface-power', 'M530 1440H460V370', 'Regulated power to host-interface logic'],
      ['ssd-controller-power', 'M610 1440V1100H620', 'Regulated power to controller and its internal functions'],
      ['ssd-dram-power', 'M1680 1440V1300H1660', 'Regulated power to DRAM when present'],
      ['ssd-nand-power', 'M3620 1880V800H3540', 'Regulated power to the representative NAND package; counted peers also require power'],
    ]
    for (const [id, d, label] of powerPaths) {
      diagram.paths.push({ id, d, label, highlighted: false, directed: true, dashed: true, strokeWidth: 2, caption: id === 'ssd-power-rails' ? { text: 'Power rails', x: 1740, y: 1915 } : undefined })
    }
    diagram.paths.push({ id: 'ssd-plp-power', d: 'M720 1540H900', label: 'Optional capacitor charging and backup energy through power management; protection coverage varies', highlighted: false, directed: true, bidirectional: true, dashed: true, strokeWidth: 2 })
  }
}
