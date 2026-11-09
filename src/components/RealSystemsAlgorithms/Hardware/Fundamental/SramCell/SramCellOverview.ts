import type { SystemOverviewInformation } from '../../../../../visualization/SystemOverviewInformation.ts'

export class SramCellOverview {
  public static describe(): SystemOverviewInformation {
    return {
      name: 'SRAM cell: hold, read, and write',
      summary: 'A conventional six-transistor SRAM cell stores complementary states using feedback and accesses them through two transistors.',
      problem: 'Powered memory must retain a bit and provide reads and writes without periodic charge refresh.',
      steps: [
        'Hold complementary Q and Q-complement using two cross-coupled inverters.',
        'Keep the word line low to isolate the two access transistors.',
        'Precharge the bit lines and raise the word line for a read.',
        'Sense the small differential at a peripheral amplifier without changing the stored bit.',
        'Lower the word line, then drive complementary write values onto the bit lines.',
        'Enable access to change the cell; lower the word line after it settles.',
      ],
      implementationNote: 'Conventional single-port 6T example. Each inverter has two transistors; two additional transistors provide access. Other cells, including 8T dual-port designs, differ. Analog read stability, transistor sizing, and delays are not simulated.',
      realWorldUsage: {
        technologies: [
          { name: 'Infineon/Cypress SRAM cell architecture', url: 'https://community.infineon.com/t5/Knowledge-Base-Articles/Memory-Cell-Architecture-of-Cypress-Dual-Ports/ta-p/249791', usage: 'Documents conventional 6T SRAM cells and the additional access transistors in an 8T dual-port variant.' },
        ],
        products: [], note: 'Conventional single-port 6T example. Each inverter has two transistors; two additional transistors provide access. Other cells, including 8T dual-port designs, differ. Analog read stability, transistor sizing, and delays are not simulated.',
      },
    }
  }
}
