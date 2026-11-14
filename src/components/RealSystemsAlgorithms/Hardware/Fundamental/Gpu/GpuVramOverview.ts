import type { AlgorithmTechnology } from '../../../../../visualization/AlgorithmInformation.ts'
import { GpuVramExample } from './GpuVramExample.ts'

export class GpuVramOverview {
  public static readonly note = `VRAM counts use a ${GpuVramExample.capacityGiB} GiB GDDR6 example: ${GpuVramExample.chipsPerVram} chips of ${GpuVramExample.chipDensityGib} Gbit, one modeled die per chip, and ${GpuVramExample.banksPerDie} banks per die (${GpuVramExample.channelsPerDie} channels with ${GpuVramExample.banksPerChannel} banks each). That gives ${GpuVramExample.cellsPerBank.toLocaleString('en-US')} data cells per bank. Each 1T1C cell has one transistor and capacitor; spare cells and peripheral logic are excluded. One die per chip is a modeling choice. Counts vary across devices; physical subarray and decoder counts are unspecified. Named buffers map to representative rows. Each access shows ACTIVATE, sensing/restoration, READ or WRITE through column and I/O circuitry, and PRECHARGE. The enlarged cell tracks bit 0 of the first payload byte while the complete buffer transfer is grouped. Access restoration is separate from scheduled refresh, which stays idle. Exact timings, bursts, and analog voltages are not simulated.`

  public static readonly technologies: readonly AlgorithmTechnology[] = [
    { name: 'GDDR graphics DRAM', url: 'https://www.micron.com/products/memory/graphics-memory/gddr6', usage: 'GDDR6 is graphics DRAM designed for high-bandwidth transfers; the diagram groups command/address and data I/O around a representative bank.' },
    { name: 'Micron 16-Gbit GDDR6 addressing', url: 'https://www.mouser.com/datasheet/2/671/Micron_08232024_gddr6_sgram_16gb_brief_1578719_348-3554756.pdf', usage: 'Table 3 specifies two 8-Gbit channels and four bank-address bits per channel. This gives sixteen banks per channel, thirty-two per modeled die; eight such chips form the illustrative 16 GiB VRAM.' },
    { name: 'DRAM transistor and capacitor storage cells', url: 'https://semiconductor.samsung.com/dram/', usage: 'DRAM stores a bit using one transistor and one capacitor and requires refresh. GDDR and HBM are graphics and high-bandwidth forms of DRAM.' },
  ]
}
