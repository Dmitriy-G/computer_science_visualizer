import type { HardwareElementPhoto } from '../../../../../visualization/HardwareElementInformation.ts'

export class NetworkAdapterIllustrations {
  public static board(): readonly HardwareElementPhoto[] {
    return [{
      src: '/hardware/network-adapter/annotated-ethernet-adapter-board.png',
      alt: 'User-provided annotated Ethernet adapter board with blue outlines and labels pointing to the RJ45 port, link and activity LEDs, controller and heatsink area, support circuitry, and PCIe x1 edge connector.',
      caption: 'Annotated Ethernet network adapter / PCIe x1',
    }]
  }
}
