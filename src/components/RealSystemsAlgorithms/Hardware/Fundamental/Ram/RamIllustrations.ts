import type { HardwareElementPhoto } from '../../../../../visualization/HardwareElementInformation.ts'

export class RamIllustrations {
  public static readonly board: readonly HardwareElementPhoto[] = [{
    src: '/hardware/ram/module-annotated.svg',
    alt: 'Original DIMM module with numbered circles around a DRAM package, gold edge contacts, the key notch, and a sample of the green PCB.',
    caption: 'RAM module / packages, contacts, key, and PCB',
    description: 'The complete module is a separate physical example; its capacity and DDR generation are not established by this photograph.',
  }, {
    src: '/hardware/ram/pcb-detail-annotated.svg',
    alt: 'Original RAM board close-up with numbered circles identifying a DRAM package, gold edge contacts, and plated vias.',
    caption: 'RAM PCB / package, edge contacts, and vias',
    description: 'The close-up shows board connections and components. The roles of the small unmarked devices are not inferred from their appearance.',
  }]

  public static readonly socket: readonly HardwareElementPhoto[] = [{
    src: '/hardware/ram/dimm-socket-annotated.svg',
    alt: 'Original DIMM socket image with its long card slot and both end retention clips circled and numbered.',
    caption: 'DIMM socket / card slot and retention clips',
    description: 'The socket accepts the module edge and retains it with end clips. The image alone does not establish its DDR generation or compatibility with the separate module.',
  }]

  public static readonly spd: readonly HardwareElementPhoto[] = [{
    src: '/hardware/ram/spd-eeprom-annotated.svg',
    alt: 'Original Microchip 34AA04 SPD EEPROM package with numbered circles around the marked body and a group of connection leads.',
    caption: 'Microchip 34AA04 / SPD EEPROM example',
    description: 'A separate configuration-memory component, distinct from a DRAM data chip. Its presence on the photographed module is not established.',
  }]

  public static readonly chip: readonly HardwareElementPhoto[] = [{
    src: '/hardware/ram/dram-package-annotated.svg',
    alt: 'Original Micron DRAM package image with numbered circles identifying the marked package top and underside BGA solder balls.',
    caption: 'Micron MT40A1G8SA-075:E / DRAM package example',
    description: 'The supplied image identifies this DDR4 part and shows its top and underside. It does not show the internal die, banks, or memory cells.',
  }]
}
