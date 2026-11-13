import type { SystemOverviewInformation } from '../../../../../visualization/SystemOverviewInformation.ts'
import type { RamBitOperation } from './RamBitModel.ts'

export class RamBitOverview {
  public static create(operation: RamBitOperation): SystemOverviewInformation {
    const write = operation === 'write'
    const note = 'Follows one selected data bit in row 0, column 1, lane 0 through the common RAM diagram. Real DDR4 READ/WRITE commands transfer wider bursts; this is not a single-bit DDR bus transaction or a CPU bit-store instruction. The write example changes its selected cell from 0 to 1; other payload bits are outside this bounded view. ACTIVATE senses/restores the whole modeled row, and PRECHARGE closes it after required timing. Charge levels, sharing deltas, and waits are symbolic. Refresh scheduling, caches, CPU read-modify-write, burst packing/masks, analog transistor behavior, and exact die wiring are not simulated.'
    return {
      name: write ? 'Write one bit' : 'Read one bit',
      summary: write ? 'Follow one write-data bit from the memory controller through the row buffer and access transistor into a DRAM capacitor.' : 'Follow one stored bit through row activation, sensing, column selection, and the return path to the memory controller.',
      problem: write ? 'A stored bit must be changed through the selected row and column while preserving neighboring data and allowing charge to settle.' : 'A tiny capacitor signal must be amplified and restored before its value can be delivered reliably through the memory interface.',
      steps: [
        'Begin with a closed bank: wordlines low, bitlines equalized near half supply, and no active row buffer.',
        'Send ACTIVATE through the controller, socket, and DRAM control logic to select row 0.',
        'Raise the wordline so the row cells share charge with their bitlines.',
        'Sense the whole row into its bank-local row buffer and restore charge while the row stays connected.',
        write ? 'Send WRITE with column 1 and route the selected payload bit from the controller through chip I/O.' : 'Send READ with column 1 and select the target entry in the open row buffer.',
        write ? 'Drive the selected row-buffer entry, bitline, and access transistor so the capacitor stores 1.' : 'Route the selected bit through column selection and chip output buffers to the DIMM socket.',
        write ? 'Complete symbolic write recovery while preserving neighboring cell values.' : 'Deliver the selected read bit to the controller; stored data remains unchanged.',
        'After required timing, PRECHARGE lowers the wordline and equalizes bitlines; the stored capacitor values remain intact.',
      ],
      implementationNote: note,
      realWorldUsage: {
        technologies: [
          { name: 'DRAM activation, sensing, restoration, and precharge', url: 'https://users.ece.cmu.edu/~saugatag/papers/18micro_cal.pdf', usage: 'The DRAM background describes 1T1C cells, wordlines/bitlines, bank-local sense amplifiers, and the activation-to-column-access sequence.' },
          { name: 'DDR4 module burst transfers', url: 'https://www.kingston.com/datasheets/KF432C16BWA_8.pdf', usage: 'The 8 GiB x8 module reference specifies eight DRAM components and BL8/BC4 transfers; this lesson magnifies one bit within that wider data movement.' },
        ],
        products: [], note,
      },
    }
  }
}
