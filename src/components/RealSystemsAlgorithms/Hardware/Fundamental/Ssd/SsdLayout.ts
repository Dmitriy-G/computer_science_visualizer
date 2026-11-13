import { HardwareDiagram } from '../../../../../visualization/HardwareDiagram.ts'
import type { Scene } from '../../../../../visualization/Scene.ts'

export class SsdLayout {
  public static readonly width = 2400
  public static readonly height = 1680
  public static readonly componentCount = 8

  public static create(): Scene {
    const diagram = this.diagram()
    return {
      kind: 'system-overview', width: diagram.width, height: diagram.height,
      nodes: [], edges: [], regions: diagram.regions, paths: diagram.paths,
      count: this.componentCount, countLabel: 'SSD component groups', focusId: null,
    }
  }

  public static diagram(height: number = this.height): HardwareDiagram {
    const diagram = new HardwareDiagram(this.width, height)
    diagram.region('ssd-pcb', 'SSD / logical component map', 'device', 20, 20, 2360, 1640, 'system')
      .region('ssd-connectors', 'Host connector', 'device', 60, 150, 220, 540, 'component', 'ssd-pcb')
      .region('ssd-data', 'Data link', 'interconnect', 80, 240, 180, 130, 'component', 'ssd-connectors')
      .region('ssd-power-input', 'Power', 'device', 80, 500, 180, 130, 'component', 'ssd-connectors')
      .region('ssd-host-interface', 'Host interface / PCIe with NVMe, or SATA, depending on the SSD', 'interconnect', 340, 240, 240, 130, 'component', 'ssd-pcb', 'Host interface')
      .region('ssd-dram', 'Optional DRAM / mapping and data buffers; DRAM-less SSDs use other memory arrangements', 'observer', 660, 1230, 1000, 140, 'component', 'ssd-pcb', 'DRAM / mapping and buffers (optional)')
      .region('ssd-power-management', 'Power management', 'device', 340, 1470, 380, 140, 'component', 'ssd-pcb')
      .region('ssd-plp', 'Optional power-loss protection capacitors / protection coverage depends on the SSD', 'observer', 900, 1470, 520, 140, 'component', 'ssd-pcb', 'PLP caps (optional)')
    this.addController(diagram)
    this.addNand(diagram)
    this.connectData(diagram)
    this.connectControl(diagram)
    this.connectPower(diagram)
    return diagram
  }

  private static addController(diagram: HardwareDiagram): void {
    diagram.region('ssd-controller', 'SSD controller / hardware and firmware', 'device', 620, 100, 1080, 1050, 'component', 'ssd-pcb', 'SSD controller')
      .region('ssd-cpu', 'Internal CPU cores / firmware execution; core count varies by controller', 'device', 660, 180, 320, 120, 'component', 'ssd-controller', 'CPU cores / firmware')
      .region('ssd-sram', 'Internal SRAM / firmware working memory and metadata', 'memory', 1040, 180, 600, 120, 'component', 'ssd-controller', 'SRAM / firmware and metadata')
      .region('ssd-ftl', 'FTL / logical-to-physical mapping; host sectors may occupy part of a NAND page', 'device', 660, 370, 980, 180, 'component', 'ssd-controller', 'FTL / LBA mapping')
      .region('ssd-physical-address', 'LBA to physical NAND location / channel, target selection, die, plane, block, page, and offset as needed; exact representation varies', 'memory', 690, 440, 920, 80, 'component', 'ssd-ftl', 'LBA → channel / target / die / plane / block / page')
      .region('ssd-garbage-collection', 'Garbage collection / firmware policy', 'device', 660, 610, 300, 120, 'component', 'ssd-controller', 'Garbage collection')
      .region('ssd-wear-leveling', 'Wear leveling / firmware policy', 'device', 1000, 610, 300, 120, 'component', 'ssd-controller', 'Wear leveling')
      .region('ssd-dma', 'DMA engines and data buffers / transfer payloads between the host interface, ECC engines, and NAND channel controllers', 'interconnect', 660, 820, 300, 290, 'component', 'ssd-controller', 'DMA / data buffers')
      .region('ssd-ecc', 'ECC engines / logical write and read stages; implementation and placement vary', 'device', 980, 760, 340, 390, 'component', 'ssd-controller', 'ECC engines')
      .region('ssd-ecc-encode', 'ECC encoding / generate redundancy before NAND page programming', 'device', 1000, 820, 300, 110, 'component', 'ssd-ecc', 'ECC encode / write')
      .region('ssd-ecc-decode', 'ECC decoding and error correction / after NAND reading, before returning corrected data; uncorrectable errors are reported', 'device', 1000, 1000, 300, 110, 'component', 'ssd-ecc', 'ECC decode / correct')
      .region('ssd-nand-controllers', 'NAND flash channel controllers / command sequencing, timing, and data I/O; two illustrative channels', 'device', 1360, 760, 300, 390, 'component', 'ssd-controller', 'NAND channel controllers')
      .region('ssd-nand-command-io', 'Read and program page commands, block erase commands, status, and NAND bus timing', 'interconnect', 1380, 940, 260, 160, 'component', 'ssd-nand-controllers', 'Command / timing / data I/O')
  }

  private static addNand(diagram: HardwareDiagram): void {
    diagram.region('ssd-nand', 'NAND flash', 'memory', 1760, 100, 580, 1280, 'component', 'ssd-pcb')
    for (let index = 0; index < 3; index += 1) {
      const y = 180 + index * 400
      const channel = index < 2 ? 0 : 1
      diagram.region(`ssd-package-${index}`, `NAND package ${index} / channel ${channel}; a package can contain multiple dies`, 'memory', 1800, y, 500, 360, 'component', 'ssd-nand', `Package ${index} / CH ${channel}`)
        .region(`ssd-die-${index}`, 'NAND die / one shown; multiple dies can share a channel through target selection', 'memory', 1820, y + 60, 460, 280, 'component', `ssd-package-${index}`, 'Die (one shown)')
        .region(`ssd-plane-${index}`, 'NAND plane / one shown; contains erase blocks', 'memory', 1840, y + 120, 420, 220, 'component', `ssd-die-${index}`, 'Plane (one shown)')
        .region(`ssd-block-${index}`, 'NAND block / erase operates on the whole block, not individual pages', 'memory', 1860, y + 180, 380, 160, 'component', `ssd-plane-${index}`, 'Block / erase')
        .region(`ssd-page-${index}`, 'NAND page / read and program operations; programming obeys NAND restrictions and does not support arbitrary overwrite', 'memory', 1880, y + 240, 340, 80, 'component', `ssd-block-${index}`, 'Page / read, program')
    }
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
      ['ssd-channel-0', 'M1660 890H1740', 'NAND controller channel 0 / shared bus to packages 0 and 1', true],
      ['ssd-channel-0-package-0', 'M1740 360H1800', 'Channel 0 to package 0 / selected target; shared-channel bus transfers are serialized', true],
      ['ssd-channel-0-package-1', 'M1740 760H1800', 'Channel 0 to package 1 / selected target; multiple dies may interleave internal NAND operations', true],
      ['ssd-channel-1', 'M1660 1050H1740V1160H1800', 'NAND controller channel 1 to package 2 / separate channel, illustrative topology', true],
    ]
    for (const [id, d, label, bidirectional] of dataPaths) {
      const caption = id === 'ssd-channel-1' ? { text: 'CH 1', x: 1710, y: 1195 } : undefined
      diagram.paths.push({ id, d, label, caption, highlighted: false, directed: true, bidirectional, strokeWidth: 2 })
    }
    diagram.paths.push({ id: 'ssd-channel-0-shared-bus', d: 'M1740 360V890', label: 'Shared channel 0 / branches to multiple NAND packages and their dies; one bus transfer at a time', caption: { text: 'CH 0', x: 1710, y: 340 }, highlighted: false, strokeWidth: 2 })
  }

  private static connectControl(diagram: HardwareDiagram): void {
    const controlPaths: readonly [string, string, string, boolean][] = [
      ['ssd-host-ftl', 'M460 240V130H610V450H660', 'Host LBA command to firmware / FTL address translation', false],
      ['ssd-cpu-sram', 'M980 240H1040', 'CPU firmware access to internal SRAM / code, working state, and metadata', true],
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
      ['ssd-power-rails', 'M530 1470V1420H2360', 'Regulated power distribution / logical rails, not exact board routing'],
      ['ssd-interface-power', 'M530 1420H460V370', 'Regulated power to host-interface logic'],
      ['ssd-controller-power', 'M610 1420V1100H620', 'Regulated power to controller and its internal functions'],
      ['ssd-dram-power', 'M1680 1420V1300H1660', 'Regulated power to DRAM when present'],
      ['ssd-nand-power', 'M2360 1420V360H2300', 'Regulated power to NAND package 0'],
      ['ssd-nand-power-1', 'M2360 760H2300', 'Regulated power to NAND package 1'],
      ['ssd-nand-power-2', 'M2360 1160H2300', 'Regulated power to NAND package 2'],
    ]
    for (const [id, d, label] of powerPaths) {
      diagram.paths.push({ id, d, label, highlighted: false, directed: true, dashed: true, strokeWidth: 2, caption: id === 'ssd-power-rails' ? { text: 'Power rails', x: 1740, y: 1455 } : undefined })
    }
    diagram.paths.push({ id: 'ssd-plp-power', d: 'M720 1540H900', label: 'Optional capacitor charging and backup energy through power management; protection coverage varies', highlighted: false, directed: true, bidirectional: true, dashed: true, strokeWidth: 2 })
  }
}
