import type { HardwareDiagram } from '../../../../../visualization/HardwareDiagram.ts'
import type { SceneRegion } from '../../../../../visualization/Scene.ts'
import { GpuVramExample } from './GpuVramExample.ts'

export class GpuVramLayout {
  public static add(diagram: HardwareDiagram): void {
    diagram.region('gpu-vram', 'Video memory (VRAM) / illustrative 16 GiB GDDR6 configuration: eight 16-Gbit chips, each modeled as one monolithic die. One representative chip, bank, and enlarged cell are drawn. Counts describe this example; other capacities, packages, and memory generations differ. Some GPUs use HBM, and integrated GPUs commonly share system RAM. Logical organization, not a physical floorplan', 'memory', 1960, 120, 1360, 1090, 'component', 'gpu-board', `Video memory (VRAM, ${GpuVramExample.capacityGiB} GiB GDDR6)`)
      .region('gpu-vram-chip', `GDDR chips / ${GpuVramExample.chipsPerVram} per VRAM in this example, each holding ${GpuVramExample.chipDensityGib} Gbit (2 GiB). One chip is expanded; the eight x32 devices give an illustrative 256-bit aggregate interface`, 'memory', 2000, 200, 1280, 940, 'component', 'gpu-vram', `GDDR chips (~${GpuVramExample.chipsPerVram} per VRAM)`)
      .region('gpu-vram-die', `DRAM dies / ${GpuVramExample.diesPerChip} modeled monolithic die per chip, or ${GpuVramExample.chipsPerVram} dies across this VRAM. One die per package is a modeling choice. Each die contains two independent x16 channels with sixteen banks per channel`, 'memory', 2020, 280, 1240, 840, 'component', 'gpu-vram-chip', `DRAM dies (~${GpuVramExample.diesPerChip} per chip)`)
      .region('gpu-vram-control', 'Command and address logic / decodes memory-controller commands and selects banks, rows, and columns. GDDR command encoding and timing differ from the DDR module example', 'device', 2060, 360, 240, 150, 'component', 'gpu-vram-die', 'Command / address')
      .region('gpu-vram-refresh', 'Refresh circuitry / coordinates row restoration using bank-local sense amplifiers. Stored capacitor charge leaks, so DRAM requires refresh; scheduling and timing are abstracted', 'device', 2060, 600, 240, 150, 'component', 'gpu-vram-die', 'Refresh circuitry')
      .region('gpu-vram-io', 'Data I/O and prefetch buffers / exchange selected-column data with the GPU memory controller over the graphics-memory interface. Wide internal transfers and high-speed external signaling are grouped here', 'interconnect', 2060, 860, 240, 180, 'component', 'gpu-vram-die', 'Data I/O / prefetch')
      .region('gpu-vram-bank', `DRAM banks / ${GpuVramExample.banksPerDie} per die in this example: ${GpuVramExample.channelsPerDie} independent channels with ${GpuVramExample.banksPerChannel} banks each, or ${GpuVramExample.chipsPerVram * GpuVramExample.banksPerDie} banks across this VRAM. Channel boundaries are grouped into the die; one bank is expanded. Counts follow the GDDR6 device addressing table and differ for other organizations`, 'memory', 2360, 360, 860, 720, 'component', 'gpu-vram-die', `Banks (~${GpuVramExample.banksPerDie} per die)`)
      .region('gpu-vram-row-decoder', 'Row decoder / selects a wordline to connect the cells in one row to their bitlines', 'device', 2400, 420, 220, 200, 'component', 'gpu-vram-bank', 'Row decoder')
      .region('gpu-vram-array', 'Cell arrays / groups the physical subarrays in one bank. Their count is implementation dependent and is not inferred from capacity. The cell quantity below is the total across the bank; one representative 1T1C cell is enlarged', 'memory', 2680, 420, 500, 360, 'component', 'gpu-vram-bank', 'Cell arrays')
      .region('gpu-vram-cell', `DRAM cells / ${GpuVramExample.cellsPerBank.toLocaleString('en-US')} addressable one-bit data cells per bank, derived from 16 Gbit per die divided by 32 banks. The total excludes spare cells. Each enlarged cell pairs one access transistor and one storage capacitor; row-buffer latches are separate`, 'memory', 2700, 480, 460, 280, 'component', 'gpu-vram-array', `DRAM cells (${GpuVramExample.bankCellCount} per bank)`)
      .region('gpu-vram-transistor', 'Access transistors / one per addressable data cell. Its gate is driven by the wordline and connects the capacitor to the bitline. Counts exclude spare cells and peripheral decoder, control, and I/O transistors', 'device', 2720, 560, 200, 160, 'component', 'gpu-vram-cell', 'Transistor (~1 per cell)')
      .region('gpu-vram-capacitor', 'Storage capacitors / one per addressable data cell. Charge represents the stored bit and leakage requires refresh. Counts exclude spare cells and board-level power capacitors', 'memory', 2940, 560, 200, 160, 'component', 'gpu-vram-cell', 'Capacitor (~1 per cell)')
      .region('gpu-vram-sense', 'Sense amplifiers and row buffer / amplify the small bitline signal, latch the open row, and restore cell charge while the wordline is active. These row-buffer latches are distinct from the 1T1C storage cells', 'cache', 2680, 860, 500, 140, 'component', 'gpu-vram-bank', 'Sense amplifiers / row buffer')
      .region('gpu-vram-column-decoder', 'Column decoder / selects part of the open row buffer for transfer through the GDDR I/O and prefetch circuitry', 'device', 2400, 860, 220, 180, 'component', 'gpu-vram-bank', 'Column decoder')
    this.connect(diagram)
    this.applyColors(diagram)
  }

  private static connect(diagram: HardwareDiagram): void {
    const paths: readonly [string, string, string, boolean][] = [
      ['gpu-vram-control-row', 'M2300 430H2400', 'Command/address logic selects the bank row decoder', false],
      ['gpu-vram-control-column', 'M2300 480H2320V950H2400', 'Command/address logic supplies column selection', false],
      ['gpu-vram-control-refresh', 'M2180 510V600', 'Refresh sequencing / control and refresh circuitry', false],
      ['gpu-vram-refresh-row', 'M2300 675H2340V580H2400', 'Refresh selects rows whose charge is restored through the bank-local sense amplifiers', false],
      ['gpu-vram-wordline', 'M2620 520H2660V540H2820V560', 'Wordline / row decoder drives the access-transistor gate', false],
      ['gpu-vram-bitline', 'M2720 660H2640V910H2680', 'Bitline / access transistor to the sense amplifiers for sensing, writing, and restoration', true],
      ['gpu-vram-storage-node', 'M2920 660H2940', 'Storage node / pairs the access transistor with its storage capacitor', true],
      ['gpu-vram-sense-column', 'M2680 910H2620', 'Selected-column data / row buffer to column access', true],
      ['gpu-vram-column-io', 'M2400 950H2300', 'Read/write data / selected columns to GDDR I/O and prefetch buffers', true],
    ]
    for (const [id, d, label, bidirectional] of paths) diagram.paths.push({ id, d, label, directed: true, bidirectional, highlighted: false, strokeWidth: 2 })
  }

  private static applyColors(diagram: HardwareDiagram): void {
    const green = new Set(['gpu-vram', 'gpu-vram-chip', 'gpu-vram-control', 'gpu-vram-refresh', 'gpu-vram-cell'])
    const blue = new Set(['gpu-vram-io', 'gpu-vram-row-decoder', 'gpu-vram-array', 'gpu-vram-sense', 'gpu-vram-column-decoder'])
    for (let index = 0; index < diagram.regions.length; index += 1) {
      const region = diagram.regions[index]
      if (region.id !== 'gpu-vram' && !region.id.startsWith('gpu-vram-')) continue
      let color: SceneRegion['color'] = 'neutral'
      if (green.has(region.id)) color = 'green'
      else if (blue.has(region.id)) color = 'light-blue'
      else if (region.id === 'gpu-vram-die' || region.id === 'gpu-vram-bank') color = 'lavender'
      diagram.regions[index] = { ...region, color }
    }
  }
}
