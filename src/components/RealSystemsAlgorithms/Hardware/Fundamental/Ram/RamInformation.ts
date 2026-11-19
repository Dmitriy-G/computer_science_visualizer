import type { HardwareElementInformation } from '../../../../../visualization/HardwareElementInformation.ts'
import { RamIllustrations } from './RamIllustrations.ts'
import { RamCircuitInformation } from './RamCircuitInformation.ts'

export class RamInformation {
  private static readonly dramDocumentation = {
    title: 'Micron / MT40A1G8SA-075:E DDR4 SDRAM',
    url: 'https://www.micron.com/products/memory/dram-components/ddr4-sdram/part-catalog/part-detail/mt40a1g8sa-075-e',
  }

  private static readonly entries: Readonly<Record<string, HardwareElementInformation>> = {
    'ram-pcb': {
      photos: RamIllustrations.board,
      overview: 'A DIMM combines DRAM packages, board conductors, edge contacts, and configuration components on a removable memory module.',
      problem: 'It connects multiple memory devices to the motherboard through a common socket and memory channel.',
      characteristicNote: 'The module, close-up, socket, SPD EEPROM, and DRAM package photos are separate examples. The photographs do not establish a matching assembly. The diagram retains its illustrative 8 GiB DDR4 configuration; that capacity and generation are not assigned to the photographed module.',
      characteristics: [
        { name: 'Visible components', value: 'The complete module shows eight large memory packages on the photographed side, a PCB, gold edge contacts, and a key notch.' },
        { name: 'Board connections', value: 'Conductors and plated vias route connections through the PCB; the gold fingers mate with socket contacts.' },
        { name: 'Keying', value: 'The module notch must match a compatible socket. Similar appearance alone does not establish compatibility.' },
      ],
      documentation: [this.dramDocumentation],
    },
    'ram-socket': {
      photos: RamIllustrations.socket,
      overview: 'A DIMM socket is the motherboard connector that accepts and holds a removable memory module.',
      problem: 'It provides electrical contact and mechanical retention while allowing the module to be replaced.',
      characteristicNote: 'Only the visible slot and retention clips are annotated. The exact socket model, contact count, DDR generation, and compatibility with the separate module are unspecified.',
      characteristics: [
        { name: 'Card slot', value: 'The module edge enters the long slot, where internal contacts mate with its conductive fingers.' },
        { name: 'Retention', value: 'The pictured socket has clips at both ends to secure the installed module.' },
        { name: 'Compatibility', value: 'Mechanical keying and electrical requirements must match the specified module and motherboard.' },
      ],
      documentation: [this.dramDocumentation],
    },
    'ram-spd': {
      photos: RamIllustrations.spd,
      overview: 'Serial Presence Detect (SPD) memory stores module configuration information that the platform reads separately from normal DRAM payload data.',
      problem: 'It lets the platform discover module organization and supported memory timings during configuration.',
      characteristicNote: 'The supplied package is marked Microchip 34AA04. Microchip documents this part as a DDR4 SPD EEPROM. It is a separate component example, rather than identification of an IC on the module photo.',
      characteristics: [
        { name: 'Example device', value: '34AA04: 4-Kbit EEPROM, organized as 512 bytes.' },
        { name: 'Interface', value: 'I²C-compatible serial configuration access, separate from the DDR data interface.' },
        { name: 'Storage role', value: 'Nonvolatile configuration storage; ordinary application data is stored in the DRAM devices instead.' },
      ],
      documentation: [{
        title: 'Microchip / 34AA04 SPD EEPROM',
        url: 'https://www.microchip.com/en-us/product/34AA04',
      }, {
        title: 'Microchip / 34AA04 datasheet',
        url: 'https://ww1.microchip.com/downloads/aemDocuments/documents/MPD/ProductDocuments/DataSheets/34AA04-4Kbit-I2C-Serial-EEPROM-with-Software-Write-Protect-Data-Sheet-DS20005271.pdf',
      }],
    },
    'ram-chip': {
      photos: RamIllustrations.chip,
      overview: 'A DRAM package houses memory silicon and provides its electrical connections to the module PCB.',
      problem: 'It supplies volatile working storage that the memory controller accesses over the supported DDR interface.',
      characteristicNote: 'The image identifies MT40A1G8SA-075:E, a separate Micron DDR4 example. It does not identify the chips on the complete module or expose the internal die layout. The schematic bank and cell positions are logical illustrations.',
      characteristics: [
        { name: 'Named example', value: 'Micron lists MT40A1G8SA-075:E as 8-Gbit DDR4 with an x8 data organization.' },
        { name: 'Package connection', value: 'The pictured underside uses BGA solder balls to connect the package to the PCB.' },
        { name: 'Data retention', value: 'DRAM requires power and periodic refresh to retain stored data.' },
      ],
      documentation: [this.dramDocumentation],
    },
  }

  public static get(regionId: string | null): HardwareElementInformation | null {
    if (regionId === null) return null
    return this.entries[regionId] ?? RamCircuitInformation.get(regionId)
  }
}
